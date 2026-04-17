// src/pages/EngineerDashboard.jsx
import { useState, useMemo } from "react"
import { useApp } from "../AppContext"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Wrench, LogOut, Phone, MapPin, Calendar, Clock, CircleDollarSign,
  CheckCircle2, User, Star, ChevronRight, Package, AlertCircle
} from "lucide-react"
import toast from "react-hot-toast"

export default function EngineerDashboard() {
  const navigate = useNavigate()
  const { engineer, logoutEngineer, requests, updateRequestStatus } = useApp()
  
  const [expandedId, setExpandedId] = useState(null)

  // ✅ ONLY assigned jobs, not cancelled
  const myJobs = useMemo(() => {
    return requests
      .filter(r => r.assignedEngineerId === engineer?.id && r.status !== "CANCELLED")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [requests, engineer])

  const todayJobs = myJobs.filter(j => {
    const today = new Date().toDateString()
    return new Date(j.createdAt).toDateString() === today
  })

  const todayEarnings = todayJobs.reduce((sum, j) => sum + (j.amount || 0), 0)
  const completedJobs = myJobs.filter(j => j.status === "COMPLETED").length

  const handleStatusUpdate = (jobId, newStatus) => {
    updateRequestStatus(jobId, newStatus)
    toast.success(`Status updated to ${newStatus}`)
  }

  if (!engineer) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
        <div className="text-center">
          <Wrench size={48} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1A2A49] mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-4">Please login as engineer</p>
          <button onClick={() => navigate("/engineer-login")} className="px-6 py-3 bg-[#1A2A49] text-white rounded-xl">
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-inter pb-20">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white pb-6 pt-4">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold font-poppins">👨‍🔧 {engineer.name}</h1>
              <p className="text-white/70 text-sm">Engineer ID: {engineer.id}</p>
            </div>
            <button 
              onClick={() => { logoutEngineer(); navigate("/engineer-login") }}
              className="p-2 bg-white/10 rounded-xl active:bg-white/20"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-2xl font-bold">{myJobs.length}</p>
              <p className="text-xs text-white/70">Total Jobs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-2xl font-bold">{todayJobs.length}</p>
              <p className="text-xs text-white/70">Today</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <p className="text-2xl font-bold">₹{todayEarnings}</p>
              <p className="text-xs text-white/70">Earnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-3xl mx-auto px-4 -mt-3">
        {myJobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <Package size={40} className="text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-[#1A2A49] mb-1">No assigned jobs</h3>
            <p className="text-gray-500 text-sm">New jobs will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myJobs.map((job) => {
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
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            job.status === "IN_PROGRESS" ? "bg-orange-100 text-orange-700" :
                            job.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                            "bg-blue-100 text-blue-700"
                          }`}>
                            {job.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-500 text-xs mb-2">{job.userName} • {job.userPhone}</p>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><MapPin size={12} /> {job.address?.slice(0, 20)}...</span>
                          <span className="flex items-center gap-1"><CircleDollarSign size={12} /> ₹{job.amount}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/50 p-4 space-y-4">
                      
                      {/* Customer Details */}
                      <div className="bg-white p-3 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">Customer</h4>
                        <p className="font-semibold">{job.userName}</p>
                        <p className="text-sm text-gray-600">{job.userPhone}</p>
                        <p className="text-sm text-gray-600 mt-1 flex items-start gap-1">
                          <MapPin size={14} className="mt-0.5" /> {job.address}
                        </p>
                      </div>

                      {/* Issue */}
                      <div className="bg-white p-3 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">Issue</h4>
                        <p className="text-sm">{job.issue || "General Service"}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <a href={`tel:${job.userPhone}`} className="flex-1 py-3 bg-[#1A2A49] text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                          <Phone size={16} /> Call
                        </a>
                        
                        {job.status === "ENGINEER_ASSIGNED" && (
                          <button 
                            onClick={() => handleStatusUpdate(job.id, "IN_PROGRESS")}
                            className="flex-1 py-3 bg-[#F37021] text-white rounded-xl text-sm font-medium"
                          >
                            Start Job
                          </button>
                        )}
                        
                        {job.status === "IN_PROGRESS" && (
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
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom">
        <div className="flex justify-around py-2">
          <button className="flex flex-col items-center p-2 text-[#F37021]">
            <Wrench size={22} />
            <span className="text-xs font-medium">Jobs</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-500">
            <CircleDollarSign size={22} />
            <span className="text-xs">Earnings</span>
          </button>
          <button className="flex flex-col items-center p-2 text-gray-500">
            <User size={22} />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}