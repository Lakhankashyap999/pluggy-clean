// src/pages/EngineerDashboard.jsx
import { useState, useMemo } from "react"
import { useApp } from "../AppContext"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Wrench,
  LogOut,
  Phone,
  MapPin,
  CircleDollarSign,
  CheckCircle2,
  User,
  Star,
  Package,
  Home,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  PlusCircle,
  Power,
} from "lucide-react"
import { SPARE_PARTS_RATE_CARD } from "../data/servicesCatalog"
import toast from "react-hot-toast"

const ALL_OFFICIAL_SPARES = Object.values(SPARE_PARTS_RATE_CARD).flat()

export default function EngineerDashboard() {
  const navigate = useNavigate()
  const {
    engineer,
    engineersList,
    loginEngineer,
    logoutEngineer,
    toggleEngineerDuty,
    requests,
    assignEngineer,
    startJobWithOtp,
    addSparePartToJob,
    issueStandbyAppliance,
    completeJobWithOtp,
    paymentTransactions,
    orderHistoryLogs,
  } = useApp()

  const [expandedId, setExpandedId] = useState(null)
  const [activeTab, setActiveTab] = useState("jobs")
  const [jobFilter, setJobFilter] = useState("assigned")

  // OTP & Spare Part inputs keyed by job.id
  const [startOtpInputs, setStartOtpInputs] = useState({})
  const [happyOtpInputs, setHappyOtpInputs] = useState({})
  const [selectedSpareCode, setSelectedSpareCode] = useState(ALL_OFFICIAL_SPARES[0]?.code || "")

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

  const completedJobs = myJobs.filter((j) => j.status === "COMPLETED")
  const totalEarnings = completedJobs.reduce(
    (sum, j) => sum + Number(j.engineerPayout || Math.round(Number(j.amount || 0) * 0.85)),
    0
  )

  const handleAcceptJob = (job) => {
    assignEngineer(job.id, engineer.id, engineer.name)
    toast.success(`Accepted job: ${job.service}`)
    setJobFilter("assigned")
    setExpandedId(job.id)
  }

  const handleStartWithPin = (job) => {
    const pin = startOtpInputs[job.id] || job.startOtp || "4821"
    const ok = startJobWithOtp(job.id, pin)
    if (ok) {
      setStartOtpInputs((prev) => ({ ...prev, [job.id]: "" }))
    }
  }

  const handleCompleteWithPin = (job) => {
    const pin = happyOtpInputs[job.id] || job.happyOtp || "9134"
    const ok = completeJobWithOtp(job.id, pin)
    if (ok) {
      setHappyOtpInputs((prev) => ({ ...prev, [job.id]: "" }))
    }
  }

  const handleSendSpareQuote = (jobId) => {
    const partObj = ALL_OFFICIAL_SPARES.find((p) => p.code === selectedSpareCode)
    if (!partObj) return
    addSparePartToJob(jobId, partObj)
  }

  if (!engineer) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] pt-[92px] md:pt-[112px] flex items-center justify-center p-4">
        <div className="text-center bg-white p-6 sm:p-8 rounded-3xl shadow-md max-w-md w-full border border-gray-200">
          <Wrench size={44} className="text-[#F37021] mx-auto mb-3" />
          <h2 className="text-xl font-extrabold text-[#1A2A49] mb-1">Engineer Partner Terminal</h2>
          <p className="text-gray-500 mb-5 text-xs sm:text-sm">
            Select a SQL Engineer Profile below for instant 1-click access, or open the full Partner Login page.
          </p>
          <div className="space-y-2 mb-5 text-left">
            {(engineersList || []).map((eng) => (
              <button
                key={eng.id}
                onClick={() => {
                  loginEngineer(eng)
                  toast.success(`Logged in as ${eng.name} (${eng.id})`)
                }}
                className="w-full p-3 rounded-xl border border-gray-200 hover:border-[#F37021] hover:bg-orange-50/40 flex items-center justify-between transition"
              >
                <div>
                  <p className="text-xs font-extrabold text-[#1A2A49]">
                    {eng.name} <span className="text-[#F37021]">({eng.id})</span>
                  </p>
                  <p className="text-[11px] text-gray-500">{eng.specialty || eng.specialization}</p>
                </div>
                <span className="text-xs font-bold text-[#F37021]">Open →</span>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-bold text-xs sm:text-sm"
            >
              Storefront
            </button>
            <button
              onClick={() => navigate("/engineer-login")}
              className="flex-1 py-2.5 bg-[#1A2A49] text-white rounded-xl font-bold text-xs sm:text-sm"
            >
              Partner Login Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  const displayedJobs = jobFilter === "available" ? availableJobs : myJobs

  return (
    <div className="min-h-screen bg-[#F4F6F9] pt-[92px] md:pt-[112px] pb-24">
      {/* Partner Header Banner */}
      <div className="bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white py-5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Quick Engineer Switcher + Cross-Portal Links */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-blue-200 font-semibold mr-1">Switch SQL Engineer:</span>
              {(engineersList || []).map((eng) => (
                <button
                  key={eng.id}
                  onClick={() => {
                    loginEngineer(eng)
                    toast.success(`Switched to ${eng.name} (${eng.id})`)
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition ${
                    engineer.id === eng.id
                      ? "bg-[#F37021] text-white"
                      : "bg-white/10 text-blue-100 hover:bg-white/20"
                  }`}
                >
                  {eng.id}: {eng.name.split(" ")[0]}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/track")}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold"
              >
                👤 Customer Track
              </button>
              <button
                onClick={() => navigate("/admin")}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold"
              >
                🛡️ Admin Desk
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-[#F37021] text-white font-extrabold text-xl flex items-center justify-center p-3 shadow-md">
                👨‍🔧
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-extrabold">{engineer.name}</h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
                    ID: {engineer.id}
                  </span>
                </div>
                <p className="text-white/75 text-xs mt-0.5">
                  {engineer.specialization || "AC & Electrical Master Tech"} • ⭐{" "}
                  {engineer.rating || 4.9}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Online / Offline Duty Toggle */}
              <button
                onClick={toggleEngineerDuty}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                  engineer.onDuty !== false
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white/15 text-white/80"
                }`}
              >
                <Power size={14} />
                {engineer.onDuty !== false ? "ON DUTY (Receiving SOS)" : "OFF DUTY"}
              </button>

              <button
                onClick={() => navigate("/")}
                className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition"
                title="Main Storefront"
              >
                <Home size={18} />
              </button>
              <button
                onClick={() => {
                  logoutEngineer()
                  toast.success("Engineer logged out")
                  navigate("/engineer-login")
                }}
                className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
              <p className="text-2xl font-extrabold">{availableJobs.length}</p>
              <p className="text-xs text-white/75">New Open Jobs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
              <p className="text-2xl font-extrabold text-amber-300">{myJobs.length}</p>
              <p className="text-xs text-white/75">My Assigned Jobs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10">
              <p className="text-2xl font-extrabold text-emerald-300">
                ₹{engineer.walletBalance || totalEarnings}
              </p>
              <p className="text-xs text-white/75">Partner Wallet (80% + 100% Spares)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-5">
        {activeTab === "jobs" && (
          <>
            {/* Sub-tabs: Available vs Assigned */}
            <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200/80 flex gap-2 mb-5">
              <button
                onClick={() => setJobFilter("available")}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2 ${
                  jobFilter === "available"
                    ? "bg-[#F37021] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Available Radar Requests ({availableJobs.length})
              </button>
              <button
                onClick={() => setJobFilter("assigned")}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition flex items-center justify-center gap-2 ${
                  jobFilter === "assigned"
                    ? "bg-[#1A2A49] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                My Active & Completed Jobs ({myJobs.length})
              </button>
            </div>

            {displayedJobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-200/80">
                <Package size={42} className="text-gray-300 mx-auto mb-3" />
                <h3 className="font-extrabold text-[#1A2A49] text-base mb-1">
                  {jobFilter === "available"
                    ? "No unassigned requests right now"
                    : "No jobs assigned to you yet"}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {jobFilter === "available"
                    ? "New customer bookings & 15-Min SOS alerts appear here automatically."
                    : "Accept a request from the Available tab to start working."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayedJobs.map((job) => {
                  const isExpanded = expandedId === job.id || job.status !== "COMPLETED"

                  return (
                    <motion.div
                      key={job.id}
                      layout
                      className="bg-white rounded-3xl shadow-sm border border-gray-200/90 overflow-hidden"
                    >
                      {/* Job Header */}
                      <div
                        className="p-5 cursor-pointer hover:bg-gray-50/60"
                        onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#F4F6F9] text-[#1A2A49]">
                              #{job.transactionId || `PLG${job.id}`}
                            </span>
                            {job.bookingMode === "SOS_15MIN" && (
                              <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-extrabold">
                                🚨 15-MIN SOS
                              </span>
                            )}
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-bold ${
                                job.status === "IN_PROGRESS"
                                  ? "bg-orange-100 text-[#F37021]"
                                  : job.status === "COMPLETED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-blue-100 text-[#1A2A49]"
                              }`}
                            >
                              {job.status}
                            </span>
                          </div>
                          <span className="text-lg font-extrabold text-[#1A2A49]">
                            ₹{job.amount || 0}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-[#1A2A49] text-base sm:text-lg">
                          {job.service}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          👤 {job.userName || "Customer"} ({job.userPhone || "+91 9876543210"}) • 📍{" "}
                          {job.address || job.userAddress || "Doorstep Location"}
                        </p>
                      </div>

                      {/* Expanded Partner Controls */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-[#F4F6F9]/60 p-5 space-y-4">
                          {/* Pre-Departure Checklist & Customer Household Preferences */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-white p-3.5 rounded-2xl border border-gray-200">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F37021] block mb-1">
                                🧰 Mandatory Toolkit to Carry
                              </span>
                              <p className="text-xs sm:text-sm font-bold text-[#1A2A49]">
                                {job.requiredKit || "Digital Clamp Meter, Insulated Tools & Genuine Spares"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Fault Note: {job.issue || "Standard Inspection"}
                              </p>
                            </div>

                            <div className="bg-white p-3.5 rounded-2xl border border-gray-200">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1.5">
                                🏠 Customer Household Tags
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {job.preferences?.pet && (
                                  <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold border border-amber-200">
                                    🐕 Pet at Home
                                  </span>
                                )}
                                {job.preferences?.parking && (
                                  <span className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold border border-blue-200">
                                    🚗 Bike/Car Parking Available
                                  </span>
                                )}
                                {job.preferences?.bringLadder && (
                                  <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 font-bold border border-purple-200">
                                    🪜 Bring Tall Ladder
                                  </span>
                                )}
                                <a
                                  href={`tel:${job.userPhone || "+919876543210"}`}
                                  className="text-xs px-3 py-1 rounded-lg bg-[#1A2A49] text-white font-bold flex items-center gap-1"
                                >
                                  <Phone size={12} /> Call Customer
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Step 1: Unassigned -> Accept Job */}
                          {!job.assignedEngineerId && (
                            <button
                              onClick={() => handleAcceptJob(job)}
                              className="w-full py-3 bg-[#F37021] hover:bg-[#e05e15] text-white rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 shadow-md"
                            >
                              <CheckCircle2 size={18} /> Accept Job & Dispatch Now
                            </button>
                          )}

                          {/* Step 2: ENGINEER_ASSIGNED -> Enter 4-Digit Start PIN */}
                          {job.assignedEngineerId === engineer.id &&
                            job.status === "ENGINEER_ASSIGNED" && (
                              <div className="bg-white p-4 rounded-2xl border-2 border-[#1A2A49]/20 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F37021]">
                                      Doorstep Arrival Verification
                                    </span>
                                    <h4 className="font-extrabold text-sm text-[#1A2A49]">
                                      Enter Customer&apos;s 4-Digit Start PIN to Begin Work
                                    </h4>
                                  </div>
                                  <span className="text-xs bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1 rounded-lg font-mono font-bold">
                                    Demo Hint: {job.startOtp || "4821"}
                                  </span>
                                </div>

                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    maxLength={4}
                                    placeholder={`Enter Start PIN (${job.startOtp || "4821"})`}
                                    value={startOtpInputs[job.id] || ""}
                                    onChange={(e) =>
                                      setStartOtpInputs((prev) => ({
                                        ...prev,
                                        [job.id]: e.target.value,
                                      }))
                                    }
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                                  />
                                  <button
                                    onClick={() => handleStartWithPin(job)}
                                    className="px-5 py-2.5 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5"
                                  >
                                    <KeyRound size={15} /> Verify & Start Job
                                  </button>
                                </div>
                              </div>
                            )}

                          {/* Step 3: IN_PROGRESS -> Official Spare Parts Quote + Standby Loaner + Happy PIN */}
                          {job.assignedEngineerId === engineer.id &&
                            job.status === "IN_PROGRESS" && (
                              <div className="space-y-4">
                                {/* Add Spare Part from Official Rate Card */}
                                <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F37021] block">
                                    🛠️ Need a Spare Part? Send Official Rate Card Quote to Customer App
                                  </span>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <select
                                      value={selectedSpareCode}
                                      onChange={(e) => setSelectedSpareCode(e.target.value)}
                                      className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-[#1A2A49] bg-[#F4F6F9]"
                                    >
                                      {ALL_OFFICIAL_SPARES.map((sp) => (
                                        <option key={sp.code} value={sp.code}>
                                          {sp.part} — ₹{sp.price} (Warranty: {sp.warranty})
                                        </option>
                                      ))}
                                    </select>
                                    <button
                                      onClick={() => handleSendSpareQuote(job.id)}
                                      className="px-4 py-2.5 bg-[#F37021] hover:bg-[#e05e15] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shrink-0"
                                    >
                                      <PlusCircle size={15} /> Send Quote to Customer
                                    </button>
                                  </div>

                                  {/* Existing Spare Quotes on this Job */}
                                  {job.addedSpareParts && job.addedSpareParts.length > 0 && (
                                    <div className="pt-2 space-y-1.5">
                                      {job.addedSpareParts.map((p) => (
                                        <div
                                          key={p.uid}
                                          className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#F4F6F9]"
                                        >
                                          <span className="font-bold text-[#1A2A49]">
                                            {p.part} (₹{p.price})
                                          </span>
                                          <span
                                            className={`font-extrabold ${
                                              p.status === "APPROVED"
                                                ? "text-emerald-700"
                                                : p.status === "REJECTED"
                                                ? "text-red-600"
                                                : "text-amber-700"
                                            }`}
                                          >
                                            {p.status}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Issue ₹99/day Standby Backup Appliance */}
                                <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">
                                      🔄 Workshop Motor/PCB Repair Continuity
                                    </span>
                                    <h4 className="font-bold text-xs sm:text-sm text-[#1A2A49]">
                                      Issue ₹99/day Standby Backup Fan or Cooler to Customer
                                    </h4>
                                  </div>
                                  {job.standbyLoaner ? (
                                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                                      ✓ {job.standbyLoaner.unitName} Issued
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        issueStandbyAppliance(
                                          job.id,
                                          "Pluggy High-Speed Standby Fan/Cooler Unit",
                                          99
                                        )
                                      }
                                      className="px-4 py-2 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
                                    >
                                      <RefreshCw size={14} /> Issue Standby Unit (₹99)
                                    </button>
                                  )}
                                </div>

                                {/* Complete Job with 4-Digit Happy PIN */}
                                <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-300 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                                        Final Sign-Off & Instant Wallet Payout
                                      </span>
                                      <h4 className="font-extrabold text-sm text-[#1A2A49]">
                                        Enter Customer&apos;s 4-Digit Happy PIN to Complete Job
                                      </h4>
                                    </div>
                                    <span className="text-xs bg-white border border-emerald-300 text-emerald-900 px-2.5 py-1 rounded-lg font-mono font-bold">
                                      Demo Hint: {job.happyOtp || "9134"}
                                    </span>
                                  </div>

                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      maxLength={4}
                                      placeholder={`Enter Happy PIN (${job.happyOtp || "9134"})`}
                                      value={happyOtpInputs[job.id] || ""}
                                      onChange={(e) =>
                                        setHappyOtpInputs((prev) => ({
                                          ...prev,
                                          [job.id]: e.target.value,
                                        }))
                                      }
                                      className="flex-1 px-4 py-2.5 bg-white border border-emerald-300 rounded-xl font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                    />
                                    <button
                                      onClick={() => handleCompleteWithPin(job)}
                                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-sm"
                                    >
                                      <CheckCircle2 size={16} /> Complete & Claim Payout
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
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
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <p className="text-xs text-gray-500">Partner Wallet Balance (80% Service + 100% Spares)</p>
                <h2 className="text-3xl font-extrabold text-[#1A2A49]">
                  ₹{engineer.walletBalance || totalEarnings}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Completed Jobs</p>
                <p className="text-xl font-extrabold text-emerald-600">{completedJobs.length}</p>
              </div>
            </div>

            <h3 className="font-bold text-[#1A2A49] text-sm">Job History & Instant Payout Split</h3>
            {myJobs.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">No jobs completed yet.</p>
            ) : (
              <div className="space-y-2.5">
                {myJobs.map((j) => (
                  <div
                    key={j.id}
                    className="flex items-center justify-between p-3.5 bg-[#F4F6F9] rounded-2xl"
                  >
                    <div>
                      <p className="font-bold text-sm text-[#1A2A49]">{j.service}</p>
                      <p className="text-xs text-gray-500">
                        {j.userName} • {j.status} • QR: {j.applianceQrId || "Pending"}
                      </p>
                    </div>
                    <span
                      className={`font-extrabold text-sm ${
                        j.status === "COMPLETED" ? "text-emerald-700" : "text-amber-600"
                      }`}
                    >
                      ₹{j.engineerPayout || Math.round(Number(j.amount || 0) * 0.8)}
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
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-4"
          >
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1A2A49] to-[#F37021] rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold">
                {engineer.name?.charAt(0) || "E"}
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#1A2A49]">{engineer.name}</h3>
                <p className="text-sm text-gray-500">Partner ID: {engineer.id}</p>
                <div className="flex items-center gap-1 text-xs text-emerald-700 font-bold mt-1">
                  <ShieldCheck size={14} /> Police Verified Master Tech •{" "}
                  <Star size={12} className="fill-amber-400 text-amber-400" /> 4.9
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                logoutEngineer()
                toast.success("Logged out")
                navigate("/engineer-login")
              }}
              className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition flex items-center justify-center gap-2"
            >
              <LogOut size={16} /> Sign Out of Partner Portal
            </button>
          </motion.div>
        )}
      </div>

      {/* Bottom Partner Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex justify-around py-2 max-w-3xl mx-auto">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex flex-col items-center p-2 ${
              activeTab === "jobs" ? "text-[#F37021] font-bold" : "text-gray-500"
            }`}
          >
            <Wrench size={20} />
            <span className="text-xs">Radar & Jobs</span>
          </button>
          <button
            onClick={() => setActiveTab("earnings")}
            className={`flex flex-col items-center p-2 ${
              activeTab === "earnings" ? "text-[#F37021] font-bold" : "text-gray-500"
            }`}
          >
            <CircleDollarSign size={20} />
            <span className="text-xs">Wallet & Payouts</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center p-2 ${
              activeTab === "profile" ? "text-[#F37021] font-bold" : "text-gray-500"
            }`}
          >
            <User size={20} />
            <span className="text-xs">Partner Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}
