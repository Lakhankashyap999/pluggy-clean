// src/pages/EngineerDashboard.jsx
import { useState, useMemo } from "react"
import { useApp } from "../AppContext"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Wrench, LogOut, Phone, MapPin, CircleDollarSign,
  CheckCircle2, User, Star, Package, Home, Sparkles, ShieldCheck
} from "lucide-react"
import toast from "react-hot-toast"

export default function EngineerDashboard() {
  const navigate = useNavigate()
  const { engineer, logoutEngineer, requests, updateRequestStatus, assignEngineer } = useApp()

  const [expandedId, setExpandedId] = useState(null)
  const [activeTab, setActiveTab] = useState("jobs")
  const [jobFilter, setJobFilter] = useState("available") // "available" | "assigned"

  // Unassigned jobs available for engineers to pick up
  const availableJobs = useMemo(() => {
    return (requests || [])
      .filter(
        (r) =>
          !r.assignedEngineerId &&
          (r.status === "PENDING_EXECUTIVE" || r.status === "EXECUTIVE_VERIFIED")
      )
      .sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id))
  }, [requests])

  // Jobs assigned to this engineer
  const myJobs = useMemo(() => {
    return (requests || [])
      .filter((r) => r.assignedEngineerId === engineer?.id && r.status !== "CANCELLED")
      .sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id))
  }, [requests, engineer])

  const todayJobs = myJobs.filter((j) => {
    const today = new Date().toDateString()
    return new Date(j.createdAt || Date.now()).toDateString() === today
  })

  const totalEarnings = myJobs
    .filter((j) => j.status === "COMPLETED")
    .reduce((sum, j) => sum + Number(j.amount || 0), 0)

  const todayEarnings = todayJobs.reduce((sum, j) => sum + Number(j.amount || 0), 0)
  const completedJobsCount = myJobs.filter((j) => j.status === "COMPLETED").length

  const handleAcceptJob = (job) => {
    assignEngineer(job.id, engineer.id, engineer.name)
    toast.success(`Accepted job: ${job.service}`)
    setJobFilter("assigned")
    setExpandedId(job.id)
  }

  const handleStatusUpdate = (jobId, newStatus) => {
    updateRequestStatus(jobId, newStatus)
    toast.success(`Status updated to ${newStatus.replace("_", " ")}`)
  }

  if (!engineer) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-md max-w-sm w-full">
          <Wrench size={48} className="text-[#F37021] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1A2A49] mb-2">Engineer Access Required</h2>
          <p className="text-gray-500 mb-6 text-sm">Please login with your Engineer credentials</p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/engineer-login")}
              className="flex-1 py-3 bg-[#1A2A49] text-white rounded-xl font-medium"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  const displayedJobs = jobFilter === "available" ? availableJobs : myJobs

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-inter pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white pb-6 pt-4">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold font-poppins">👨‍🔧 {engineer.name}</h1>
              <p className="text-white/70 text-sm">Engineer ID: {engineer.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/")}
                className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition"
                title="Back to Main Site"
              >
                <Home size={20} />
              </button>
              <button
                onClick={() => {
                  logoutEngineer()
                  toast.success("Engineer logged out")
                  navigate("/engineer-login")
                }}
                className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-2xl font-bold">{availableJobs.length}</p>
              <p className="text-xs text-white/70">New Requests</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-2xl font-bold">{myJobs.length}</p>
              <p className="text-xs text-white/70">My Jobs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-2xl font-bold">₹{totalEarnings || todayEarnings}</p>
              <p className="text-xs text-white/70">Earnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 -mt-3">
        {activeTab === "jobs" && (
          <>
            {/* Sub-tabs: Available vs Assigned */}
            <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 flex gap-2 mb-4">
              <button
                onClick={() => setJobFilter("available")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  jobFilter === "available"
                    ? "bg-[#F37021] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Available Requests
                {availableJobs.length > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      jobFilter === "available"
                        ? "bg-white text-[#F37021]"
                        : "bg-[#F37021]/10 text-[#F37021]"
                    }`}
                  >
                    {availableJobs.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setJobFilter("assigned")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  jobFilter === "assigned"
                    ? "bg-[#1A2A49] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                My Assigned Jobs
                {myJobs.length > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      jobFilter === "assigned"
                        ? "bg-white text-[#1A2A49]"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {myJobs.length}
                  </span>
                )}
              </button>
            </div>

            {displayedJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
                <Package size={40} className="text-gray-300 mx-auto mb-3" />
                <h3 className="font-bold text-[#1A2A49] mb-1">
                  {jobFilter === "available" ? "No new service requests" : "No assigned jobs yet"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {jobFilter === "available"
                    ? "When customers book a service, it will appear here to accept."
                    : "Accept a request from the Available tab to start working."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayedJobs.map((job) => {
                  const isExpanded = expandedId === job.id

                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                    >
                      {/* Job Header */}
                      <div
                        className="p-4 cursor-pointer active:bg-gray-50"
                        onClick={() => setExpandedId(isExpanded ? null : job.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#F37021]/20 to-[#FF8C42]/20 rounded-xl flex items-center justify-center">
                            <Wrench size={22} className="text-[#F37021]" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-bold text-[#1A2A49]">{job.service}</h3>
                              <span
                                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                  job.status === "IN_PROGRESS"
                                    ? "bg-orange-100 text-orange-700"
                                    : job.status === "COMPLETED"
                                    ? "bg-green-100 text-green-700"
                                    : job.status === "ENGINEER_ASSIGNED"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {job.status}
                              </span>
                            </div>

                            <p className="text-gray-500 text-xs mb-2">
                              {job.userName || "Customer"} • {job.userPhone || "N/A"}
                            </p>

                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPin size={12} /> {(job.address || job.userAddress || "Location")?.slice(0, 28)}
                              </span>
                              <span className="flex items-center gap-1 font-semibold text-[#1A2A49]">
                                <CircleDollarSign size={12} /> ₹{job.amount || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50/50 p-4 space-y-4">
                          {/* Customer Details */}
                          <div className="bg-white p-3 rounded-lg">
                            <h4 className="font-medium text-xs text-gray-400 uppercase mb-1">Customer</h4>
                            <p className="font-semibold text-[#1A2A49]">{job.userName || "Customer"}</p>
                            <p className="text-sm text-gray-600">{job.userPhone || "N/A"}</p>
                            <p className="text-sm text-gray-600 mt-1 flex items-start gap-1">
                              <MapPin size={14} className="mt-0.5 text-[#F37021] flex-shrink-0" />
                              {job.address || job.userAddress || "Address not specified"}
                            </p>
                          </div>

                          {/* Issue */}
                          <div className="bg-white p-3 rounded-lg">
                            <h4 className="font-medium text-xs text-gray-400 uppercase mb-1">Issue / Details</h4>
                            <p className="text-sm text-gray-800">{job.issue || "General Service"}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">
                            {job.userPhone && (
                              <a
                                href={`tel:${job.userPhone}`}
                                className="flex-1 py-3 bg-[#1A2A49] text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                              >
                                <Phone size={16} /> Call Customer
                              </a>
                            )}

                            {!job.assignedEngineerId && (
                              <button
                                onClick={() => handleAcceptJob(job)}
                                className="flex-1 py-3 bg-[#F37021] hover:bg-[#e05e15] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-1"
                              >
                                <CheckCircle2 size={16} /> Accept Job
                              </button>
                            )}

                            {job.assignedEngineerId === engineer.id && job.status === "ENGINEER_ASSIGNED" && (
                              <button
                                onClick={() => handleStatusUpdate(job.id, "IN_PROGRESS")}
                                className="flex-1 py-3 bg-[#F37021] text-white rounded-xl text-sm font-medium"
                              >
                                Start Job
                              </button>
                            )}

                            {job.assignedEngineerId === engineer.id && job.status === "IN_PROGRESS" && (
                              <button
                                onClick={() => handleStatusUpdate(job.id, "COMPLETED")}
                                className="flex-1 py-3 bg-green-600 text-white rounded-xl text-sm font-medium"
                              >
                                Mark Complete
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {activeTab === "earnings" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm space-y-5"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <p className="text-xs text-gray-500">Total Completed Earnings</p>
                <h2 className="text-3xl font-bold text-[#1A2A49]">₹{totalEarnings}</h2>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Completed Jobs</p>
                <p className="text-xl font-bold text-green-600">{completedJobsCount}</p>
              </div>
            </div>

            <h3 className="font-semibold text-[#1A2A49] text-sm">Job History & Payouts</h3>
            {myJobs.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">No jobs completed yet.</p>
            ) : (
              <div className="space-y-2.5">
                {myJobs.map((j) => (
                  <div
                    key={j.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-semibold text-sm text-[#1A2A49]">{j.service}</p>
                      <p className="text-xs text-gray-500">
                        {j.userName} • {j.status}
                      </p>
                    </div>
                    <span
                      className={`font-bold text-sm ${
                        j.status === "COMPLETED" ? "text-green-600" : "text-amber-600"
                      }`}
                    >
                      ₹{j.amount || 0}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1A2A49] to-[#F37021] rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {engineer.name?.charAt(0) || "E"}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1A2A49]">{engineer.name}</h3>
                <p className="text-sm text-gray-500">ID: {engineer.id}</p>
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium mt-1">
                  <ShieldCheck size={14} /> Verified Pluggy Expert • <Star size={12} className="fill-yellow-400 text-yellow-400" /> 4.9
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400">Completed Jobs</p>
                <p className="font-bold text-[#1A2A49] text-lg">{completedJobsCount}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-400">Active Jobs</p>
                <p className="font-bold text-[#F37021] text-lg">
                  {myJobs.filter((j) => j.status !== "COMPLETED").length}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                logoutEngineer()
                toast.success("Logged out")
                navigate("/engineer-login")
              }}
              className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-100 transition flex items-center justify-center gap-2"
            >
              <LogOut size={16} /> Sign Out of Engineer Portal
            </button>
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-30">
        <div className="flex justify-around py-2 max-w-3xl mx-auto">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex flex-col items-center p-2 ${
              activeTab === "jobs" ? "text-[#F37021] font-semibold" : "text-gray-500"
            }`}
          >
            <Wrench size={22} />
            <span className="text-xs">Jobs</span>
          </button>
          <button
            onClick={() => setActiveTab("earnings")}
            className={`flex flex-col items-center p-2 ${
              activeTab === "earnings" ? "text-[#F37021] font-semibold" : "text-gray-500"
            }`}
          >
            <CircleDollarSign size={22} />
            <span className="text-xs">Earnings</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center p-2 ${
              activeTab === "profile" ? "text-[#F37021] font-semibold" : "text-gray-500"
            }`}
          >
            <User size={22} />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}
