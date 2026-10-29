// src/pages/AdminDashboard.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../AppContext"
import { motion } from "framer-motion"
import {
  ShieldCheck,
  AlertTriangle,
  Wrench,
  UserCheck,
  CheckCircle2,
  Phone,
  MapPin,
  Plus,
  Home,
  CircleDollarSign,
  Users,
  ClipboardCheck,
} from "lucide-react"
import toast from "react-hot-toast"

const TOOLKIT_PRESETS = [
  "Digital Clamp Meter + Havells MCB/Capacitor Kit",
  "High-Pressure AC Jet Pump + R32/R410a Gas Gauge",
  "Fan Bearing Puller + Standby Backup Fan Unit",
  "Event 3-Phase Load Balancer + 50m Armored Cable",
  "Geyser Thermostat + Heating Element Kit",
  "Plumbing Pressure Wrench + Leak Sealant Kit",
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const {
    requests,
    engineersList,
    verifyByExecutive,
    assignEngineer,
    registerNewEngineer,
  } = useApp()

  const [activeTab, setActiveTab] = useState("dispatch")
  const [selectedKits, setSelectedKits] = useState({})
  const [execNotes, setExecNotes] = useState({})
  const [selectedEngIds, setSelectedEngIds] = useState({})

  // New Engineer Form
  const [newEng, setNewEng] = useState({
    id: "",
    name: "",
    phone: "",
    specialization: "AC & Electrical Master Tech",
  })

  const pendingVerificationCount = (requests || []).filter(
    (r) => r.status === "PENDING_EXECUTIVE"
  ).length
  const sosCount = (requests || []).filter((r) => r.bookingMode === "SOS_15MIN").length
  const totalRevenue = (requests || [])
    .filter((r) => r.status !== "CANCELLED")
    .reduce((sum, r) => sum + Number(r.amount || 0), 0)
  const platformCommission = Math.round(totalRevenue * 0.2)

  const handleVerify = (req) => {
    const kit = selectedKits[req.id] || TOOLKIT_PRESETS[0]
    const note = execNotes[req.id] || "Customer address & fault verified via phone call."
    verifyByExecutive(req.id, note, kit)
  }

  const handleDispatchEngineer = (req) => {
    const engId = selectedEngIds[req.id] || engineersList?.[0]?.id
    const engObj = (engineersList || []).find((e) => e.id === engId) || engineersList?.[0]
    if (!engObj) {
      toast.error("No engineer available")
      return
    }
    assignEngineer(req.id, engObj.id, engObj.name)
  }

  const handleAddEngineer = (e) => {
    e.preventDefault()
    if (!newEng.id.trim() || !newEng.name.trim()) {
      toast.error("Please enter Engineer ID & Name")
      return
    }
    registerNewEngineer(newEng)
    setNewEng({
      id: "",
      name: "",
      phone: "",
      specialization: "AC & Electrical Master Tech",
    })
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] pt-[128px] md:pt-[140px] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white rounded-3xl p-6 mb-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#F37021] text-white text-[10px] font-extrabold uppercase tracking-wider">
                Pluggy 24/7 Operations Center
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mt-1">
                Executive Verification & Engineer Dispatch Desk
              </h1>
              <p className="text-white/75 text-xs sm:text-sm mt-0.5">
                Verify customer faults, assign mandatory toolkits & dispatch nearest background-verified engineers
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => navigate("/engineer")}
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Wrench size={14} className="text-amber-300" /> Partner Portal
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#e05e15] text-white text-xs font-extrabold flex items-center gap-1.5"
              >
                <Home size={14} /> Storefront
              </button>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
              <p className="text-2xl font-extrabold text-amber-300">{pendingVerificationCount}</p>
              <p className="text-xs text-white/80">Awaiting Executive Verification</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
              <p className="text-2xl font-extrabold text-red-300">{sosCount}</p>
              <p className="text-xs text-white/80">🚨 15-Min Emergency SOS Alerts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
              <p className="text-2xl font-extrabold text-emerald-300">
                {(engineersList || []).length}
              </p>
              <p className="text-xs text-white/80">Verified Engineers in Fleet</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
              <p className="text-2xl font-extrabold text-white">
                ₹{totalRevenue}{" "}
                <span className="text-xs font-normal text-amber-300">
                  (Net: ₹{platformCommission})
                </span>
              </p>
              <p className="text-xs text-white/80">Gross Booking Volume (20% Take Rate)</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("dispatch")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition ${
              activeTab === "dispatch"
                ? "bg-[#1A2A49] text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <ClipboardCheck size={16} /> Live Verification & Dispatch Queue ({requests?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("fleet")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition ${
              activeTab === "fleet"
                ? "bg-[#1A2A49] text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            <Users size={16} /> Engineer Fleet & Onboarding ({engineersList?.length || 0})
          </button>
        </div>

        {/* TAB 1: LIVE DISPATCH QUEUE */}
        {activeTab === "dispatch" && (
          <div className="space-y-4">
            {(requests || []).length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                <p className="text-base font-bold text-[#1A2A49]">
                  No bookings in the queue yet.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Bookings created from the storefront, 15-Min SOS, or Voice/Photo modal appear here immediately.
                </p>
              </div>
            ) : (
              (requests || []).map((req) => (
                <motion.div
                  key={req.id}
                  layout
                  className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200/90 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#F4F6F9] text-[#1A2A49]">
                        #{req.transactionId || `PLG${req.id}`}
                      </span>
                      {req.bookingMode && req.bookingMode !== "STANDARD" && (
                        <span className="px-2.5 py-1 rounded-lg bg-[#F37021] text-white text-xs font-extrabold">
                          {req.bookingMode}
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-[#1A2A49] text-xs font-bold border border-blue-200">
                        Status: {req.status}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        Start PIN: <strong>{req.startOtp || "4821"}</strong> • Happy PIN:{" "}
                        <strong>{req.happyOtp || "9134"}</strong>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-extrabold text-[#1A2A49]">
                        ₹{req.amount || 0}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Customer & Fault Info */}
                    <div className="lg:col-span-5 space-y-1">
                      <h3 className="font-extrabold text-base text-[#1A2A49]">{req.service}</h3>
                      <p className="text-xs text-gray-600">
                        <strong>Customer:</strong> {req.userName || "Customer"} (
                        {req.userPhone || "+91 9876543210"})
                      </p>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <MapPin size={13} className="text-[#F37021]" />
                        {req.address || req.userAddress || "Doorstep Address"}
                      </p>
                      <p className="text-xs text-gray-500">
                        <strong>Issue Note:</strong> {req.issue || "Standard Inspection"}
                      </p>
                    </div>

                    {/* Executive Verification & Toolkit Assignment */}
                    <div className="lg:col-span-4 space-y-2 bg-[#F4F6F9] p-3.5 rounded-2xl">
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                        1. Mandatory Toolkit for Engineer
                      </label>
                      <select
                        value={selectedKits[req.id] || req.requiredKit || TOOLKIT_PRESETS[0]}
                        onChange={(e) =>
                          setSelectedKits((prev) => ({ ...prev, [req.id]: e.target.value }))
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-[#1A2A49]"
                      >
                        {TOOLKIT_PRESETS.map((kit) => (
                          <option key={kit} value={kit}>
                            {kit}
                          </option>
                        ))}
                      </select>

                      {req.status === "PENDING_EXECUTIVE" && (
                        <button
                          onClick={() => handleVerify(req)}
                          className="w-full py-2 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 size={14} /> Verify Booking & Lock Toolkit
                        </button>
                      )}
                    </div>

                    {/* Engineer Dispatch Selector */}
                    <div className="lg:col-span-3 space-y-2 bg-[#F4F6F9] p-3.5 rounded-2xl">
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                        2. Dispatch Engineer Partner
                      </label>
                      <select
                        value={
                          selectedEngIds[req.id] ||
                          req.assignedEngineerId ||
                          engineersList?.[0]?.id
                        }
                        onChange={(e) =>
                          setSelectedEngIds((prev) => ({ ...prev, [req.id]: e.target.value }))
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-[#1A2A49]"
                      >
                        {(engineersList || []).map((eng) => (
                          <option key={eng.id} value={eng.id}>
                            {eng.name} ({eng.id}) — ⭐ {eng.rating}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleDispatchEngineer(req)}
                        className="w-full py-2 bg-[#F37021] hover:bg-[#e05e15] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5"
                      >
                        <UserCheck size={14} />{" "}
                        {req.assignedEngineer ? `Re-Assign (${req.assignedEngineer})` : "Assign & Dispatch"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: ENGINEER FLEET & ONBOARDING */}
        {activeTab === "fleet" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-3">
              {(engineersList || []).map((eng) => (
                <div
                  key={eng.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#1A2A49] text-white font-extrabold flex items-center justify-center text-lg">
                      {eng.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm sm:text-base text-[#1A2A49]">
                          {eng.name}
                        </h4>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F4F6F9] text-[#1A2A49] font-bold">
                          {eng.id}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {eng.specialization} • 📞 {eng.phone}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      ⭐ {eng.rating} ({eng.jobsCompleted} Jobs)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5">
              <form
                onSubmit={handleAddEngineer}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-4"
              >
                <h3 className="font-extrabold text-base text-[#1A2A49] flex items-center gap-2">
                  <Plus size={18} className="text-[#F37021]" /> Onboard New Verified Engineer
                </h3>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Partner ID (e.g. ENG104)
                  </label>
                  <input
                    type="text"
                    placeholder="ENG104"
                    value={newEng.id}
                    onChange={(e) => setNewEng({ ...newEng, id: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Suresh Sharma"
                    value={newEng.name}
                    onChange={(e) => setNewEng({ ...newEng, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 12345"
                    value={newEng.phone}
                    onChange={(e) => setNewEng({ ...newEng, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Primary Specialization
                  </label>
                  <input
                    type="text"
                    value={newEng.specialization}
                    onChange={(e) => setNewEng({ ...newEng, specialization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#F37021] hover:bg-[#e05e15] text-white rounded-xl font-extrabold text-xs sm:text-sm shadow-md"
                >
                  Register Engineer Partner
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
