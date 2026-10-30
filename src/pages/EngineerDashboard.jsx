// src/pages/EngineerDashboard.jsx
import { useState, useMemo, useEffect, useRef } from "react"
import { useApp } from "../AppContext"
import FaultMediaView from "../components/FaultMediaView"
import { compressImage } from "../lib/faultDraft"
import { maskCustomerPhone, maskCustomerAddress } from "../lib/engineerSurveillance"
import { useNavigate, Navigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
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
  ShieldCheck,
  KeyRound,
  RefreshCw,
  PlusCircle,
  Power,
  Clock,
  QrCode,
  Navigation,
  Camera,
  Lock,
  AlertTriangle,
} from "lucide-react"
import { SPARE_PARTS_RATE_CARD } from "../data/servicesCatalog"
import toast from "react-hot-toast"

const ALL_OFFICIAL_SPARES = Object.values(SPARE_PARTS_RATE_CARD).flat()

export default function EngineerDashboard() {
  const navigate = useNavigate()
  const {
    engineer,
    logoutEngineer,
    toggleEngineerDuty,
    myEngineerJobs,
    markEngineerTravelStep,
    uploadEngineerWorkProof,
    startJobWithOtp,
    addSparePartToJob,
    issueStandbyAppliance,
    completeJobWithOtp,
    pingEngineerLiveLocation,
  } = useApp()

  const [activeTab, setActiveTab] = useState("jobs") // "jobs" | "earnings" | "profile"
  const [startOtpInputs, setStartOtpInputs] = useState({})
  const [happyOtpInputs, setHappyOtpInputs] = useState({})
  const [selectedSpareCode, setSelectedSpareCode] = useState(
    ALL_OFFICIAL_SPARES[0]?.code || ""
  )
  const [shiftCheck, setShiftCheck] = useState({
    uniform: true,
    idCard: true,
    toolkit: true,
  })
  const [uploadingJobId, setUploadingJobId] = useState(null)
  const proofInputRefs = useRef({})

  // Periodic GPS heartbeat while engineer is logged in
  useEffect(() => {
    if (!engineer?.id) return
    pingEngineerLiveLocation()
    const timer = setInterval(() => {
      pingEngineerLiveLocation()
    }, 60000)
    return () => clearInterval(timer)
  }, [engineer?.id])

  const activeAssignedJobs = useMemo(() => {
    return (myEngineerJobs || [])
      .filter((r) => !["COMPLETED", "CANCELLED"].includes(r.status))
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id)
      )
  }, [myEngineerJobs])

  const completedJobs = useMemo(() => {
    return (myEngineerJobs || [])
      .filter((r) => r.status === "COMPLETED")
      .sort(
        (a, b) =>
          new Date(b.completedAt || b.createdAt || b.id) -
          new Date(a.completedAt || a.createdAt || a.id)
      )
  }, [myEngineerJobs])

  if (!engineer) {
    return <Navigate to="/engineer-login" replace />
  }

  const totalEarnings = completedJobs.reduce(
    (sum, j) =>
      sum +
      Number(j.engineerPayout || Math.round(Number(j.amount || 0) * 0.8)),
    0
  )

  const handleToggleDutyWithCheck = () => {
    if (!engineer.isOnline) {
      if (!shiftCheck.uniform || !shiftCheck.idCard || !shiftCheck.toolkit) {
        toast.error("ON DUTY hone se pehle teeno shift safety checks tick karein!")
        return
      }
    }
    toggleEngineerDuty(shiftCheck)
  }

  const handleStartWithPin = (job) => {
    const pin = (startOtpInputs[job.id] || "").trim()
    if (pin.length !== 4) {
      toast.error("Customer ke phone par dikh raha 4-Digit Start PIN daalein")
      return
    }
    const ok = startJobWithOtp(job.id, pin)
    if (ok) {
      setStartOtpInputs((prev) => ({ ...prev, [job.id]: "" }))
    }
  }

  const handleProofFileChange = async (jobId, fileList) => {
    const file = fileList?.[0]
    if (!file) return
    try {
      setUploadingJobId(jobId)
      const compressed = await compressImage(file, 720, 0.65)
      uploadEngineerWorkProof(jobId, compressed, "Repaired appliance photo verified at customer site")
    } catch {
      toast.error("Photo upload nahi ho saki, dobara koshish karein")
    } finally {
      setUploadingJobId(null)
    }
  }

  const handleCompleteWithPin = (job) => {
    const pin = (happyOtpInputs[job.id] || "").trim()
    if (pin.length !== 4) {
      toast.error("Customer se pooch kar 4-Digit Happy PIN daalein")
      return
    }
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

  const handleSignOut = () => {
    const allowed = logoutEngineer()
    if (allowed !== false) {
      toast.success("Signed out of Partner App")
      navigate("/engineer-login", { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-white pb-24 font-inter">
      {/* ================= FIELD PARTNER TOP HEADER ================= */}
      <header className="lg:sticky top-0 z-40 bg-[#1A2A49] text-white border-b-2 border-[#F37021]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center p-2 ring-2 ring-[#F37021] shrink-0">
                <img
                  src="/image/logos.png"
                  alt="Pluggy Partner"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#F37021] text-white text-[10px] font-extrabold uppercase tracking-wider">
                    PARTNER APP
                  </span>
                  <span className="font-mono text-xs font-extrabold text-amber-300">
                    ID: {engineer.id}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    GPS Live
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-extrabold mt-0.5 truncate">
                  {engineer.name}
                </h1>
                <p className="text-blue-200 text-[11px] truncate">
                  {engineer.specialization || "Field Technician"} • 📍{" "}
                  {engineer.area || "Delhi NCR"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:flex items-center gap-2">
              <button
                onClick={handleToggleDutyWithCheck}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition active:scale-95 ${
                  engineer.isOnline !== false
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white/15 text-white/85"
                }`}
              >
                <Power size={14} />
                {engineer.isOnline !== false ? "ON DUTY" : "OFF DUTY"}
              </button>

              <button
                onClick={handleSignOut}
                className="px-3.5 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>

          {/* 3-Point Shift Readiness Strip (when OFF DUTY) */}
          {engineer.isOnline === false && (
            <div className="mt-3 p-3 rounded-2xl bg-white/10 border border-white/15 text-xs space-y-2">
              <p className="font-bold text-amber-300">
                ⚡ Shift Start Checklist (Tick all 3 to go ON DUTY):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shiftCheck.uniform}
                    onChange={(e) =>
                      setShiftCheck((p) => ({ ...p, uniform: e.target.checked }))
                    }
                    className="accent-[#F37021]"
                  />
                  <span>Pluggy Uniform Worn</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shiftCheck.idCard}
                    onChange={(e) =>
                      setShiftCheck((p) => ({ ...p, idCard: e.target.checked }))
                    }
                    className="accent-[#F37021]"
                  />
                  <span>Verified ID Card Ready</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shiftCheck.toolkit}
                    onChange={(e) =>
                      setShiftCheck((p) => ({ ...p, toolkit: e.target.checked }))
                    }
                    className="accent-[#F37021]"
                  />
                  <span>Full Safety Toolkit Checked</span>
                </label>
              </div>
            </div>
          )}

          {/* Partner Personal Summary Strip */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10 text-center">
            <div className="bg-white/10 rounded-xl p-2">
              <p className="text-lg sm:text-xl font-extrabold text-amber-300">
                {activeAssignedJobs.length}
              </p>
              <p className="text-[11px] text-white/80">Active Jobs</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2">
              <p className="text-lg sm:text-xl font-extrabold text-white">
                {(engineer.completedCount || 0) + completedJobs.length}
              </p>
              <p className="text-[11px] text-white/80">Completed</p>
            </div>
            <div className="bg-white/10 rounded-xl p-2">
              <p className="text-lg sm:text-xl font-extrabold text-emerald-300">
                ₹{engineer.walletBalance || totalEarnings}
              </p>
              <p className="text-[11px] text-white/80">My Wallet</p>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MAIN PARTNER WORKSPACE ================= */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-5">
        {/* Clean 3-Tab Switcher */}
        <div className="grid grid-cols-3 gap-1.5 bg-[#F5F5F7] p-1.5 rounded-2xl mb-6">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition ${
              activeTab === "jobs"
                ? "bg-[#1A2A49] text-white shadow-xs"
                : "text-gray-600"
            }`}
          >
            <Wrench size={15} /> Jobs ({activeAssignedJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("earnings")}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition ${
              activeTab === "earnings"
                ? "bg-[#F37021] text-white shadow-xs"
                : "text-gray-600"
            }`}
          >
            <CircleDollarSign size={15} /> Passbook ({completedJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 transition ${
              activeTab === "profile"
                ? "bg-[#1A2A49] text-white shadow-xs"
                : "text-gray-600"
            }`}
          >
            <User size={15} /> My ID Card
          </button>
        </div>

        {/* ================= TAB 1: MY ASSIGNED FIELD JOBS ================= */}
        {activeTab === "jobs" && (
          <div className="space-y-6">
            {activeAssignedJobs.length === 0 ? (
              <div className="bg-[#F5F5F7] rounded-3xl p-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <Package size={28} className="text-[#1A2A49]" />
                </div>
                <h3 className="font-extrabold text-[#1A2A49] text-base sm:text-lg mb-1">
                  No Active Jobs Right Now
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto">
                  Apna status <strong>ON DUTY</strong> rakhein. Jaise hi aapke service zone mein naya kaam assign hoga, woh turant yahan dikhega.
                </p>
              </div>
            ) : (
              activeAssignedJobs.map((job) => {
                const fieldStep =
                  job.status === "IN_PROGRESS"
                    ? "IN_PROGRESS"
                    : job.fieldStep || "ASSIGNED"
                const hasWorkProof =
                  Array.isArray(job.workProofPhotos) &&
                  job.workProofPhotos.length > 0
                const attemptsLeft = Math.max(
                  0,
                  3 - (Number(job.wrongPinAttempts) || 0)
                )

                return (
                  <div
                    key={job.id}
                    className="rounded-3xl bg-[#F5F5F7] p-4 sm:p-6 space-y-5"
                  >
                    {/* Top Row: Booking ID + Status + Engineer Share */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-gray-200">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-white text-[#1A2A49]">
                          #{job.transactionId || `PLG${job.id}`}
                        </span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-bold ${
                            job.status === "IN_PROGRESS"
                              ? "bg-orange-100 text-[#F37021]"
                              : fieldStep === "REACHED_DOORSTEP"
                              ? "bg-amber-100 text-amber-900"
                              : fieldStep === "EN_ROUTE"
                              ? "bg-blue-100 text-blue-900"
                              : "bg-white text-[#1A2A49]"
                          }`}
                        >
                          {job.status === "IN_PROGRESS"
                            ? "🔧 Step 4: Repair In Progress"
                            : fieldStep === "REACHED_DOORSTEP"
                            ? "📍 Step 3: At Doorstep — Enter Start PIN"
                            : fieldStep === "EN_ROUTE"
                            ? "🛵 Step 2: On The Way to Customer"
                            : "📋 Step 1: New Job Assigned"}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-gray-500 block">
                          Your Payout (80%)
                        </span>
                        <span className="text-base sm:text-lg font-extrabold text-emerald-700">
                          ₹{Math.round(Number(job.amount || 0) * 0.8)}
                        </span>
                      </div>
                    </div>

                    {/* Service & Customer Details */}
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-[#1A2A49] text-lg sm:text-xl leading-snug">
                        {job.service}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-700">
                        <strong>Reported Problem:</strong>{" "}
                        {job.issue || "Standard Inspection"}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700 flex items-start gap-1.5">
                        <MapPin
                          size={15}
                          className="text-[#F37021] shrink-0 mt-0.5"
                        />
                        <span>
                          <strong>{job.userName || "Customer"}</strong> —{" "}
                          {job.address || job.userAddress}
                        </span>
                      </p>
                    </div>

                    {/* Customer Uploaded Fault Photo & Device Model */}
                    <FaultMediaView request={job} />

                    {/* Required Toolkit Info */}
                    <div className="py-3 px-4 rounded-2xl bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F37021] block">
                          🧰 Mandatory Toolkit to Carry
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-[#1A2A49] mt-0.5">
                          {job.requiredKit ||
                            "Digital Clamp Meter, Insulated Tools & Genuine Spares"}
                        </p>
                      </div>

                      {fieldStep !== "ASSIGNED" ? (
                        <a
                          href={`tel:${job.userPhone || "+919876543210"}`}
                          className="px-4 py-2.5 rounded-xl bg-[#1A2A49] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shrink-0"
                        >
                          <Phone size={13} /> Call Customer
                        </a>
                      ) : (
                        <span className="text-[11px] font-semibold text-gray-500">
                          📞 Phone unlocks on starting travel: {maskCustomerPhone(job.userPhone)}
                        </span>
                      )}
                    </div>

                    {/* =========================================================
                        STRICT LOCKED STEP-BY-STEP WORKFLOW
                       ========================================================= */}
                    {job.pinLocked ? (
                      <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 space-y-1.5">
                        <div className="flex items-center gap-2 font-extrabold text-sm text-red-700">
                          <Lock size={16} /> Security Lock Activated (3 Wrong PIN Attempts)
                        </div>
                        <p className="text-xs text-red-700">
                          Aapne 3 baar galat PIN enter kiya hai. Suraksha ke liye yeh job lock kar di gayi hai. Kripya Dispatch Control Desk se sampark karein.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* STEP 1: START TRAVEL ("ON THE WAY") */}
                        {job.status === "ENGINEER_ASSIGNED" &&
                          fieldStep === "ASSIGNED" && (
                            <button
                              onClick={() =>
                                markEngineerTravelStep(job.id, "EN_ROUTE")
                              }
                              className="w-full py-3.5 px-5 rounded-2xl bg-[#F37021] hover:bg-[#e05e15] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm"
                            >
                              <Navigation size={16} /> Step 1: Start Travel (On The Way to Customer)
                            </button>
                          )}

                        {/* STEP 2: MARK REACHED DOORSTEP */}
                        {job.status === "ENGINEER_ASSIGNED" &&
                          fieldStep === "EN_ROUTE" && (
                            <button
                              onClick={() =>
                                markEngineerTravelStep(
                                  job.id,
                                  "REACHED_DOORSTEP"
                                )
                              }
                              className="w-full py-3.5 px-5 rounded-2xl bg-[#1A2A49] hover:bg-[#223a61] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm"
                            >
                              <MapPin size={16} /> Step 2: I Have Reached Customer Doorstep
                            </button>
                          )}

                        {/* STEP 3: ENTER CUSTOMER'S 4-DIGIT START PIN (NO AUTO-FILL!) */}
                        {job.status === "ENGINEER_ASSIGNED" &&
                          fieldStep === "REACHED_DOORSTEP" && (
                            <div className="bg-white p-4 rounded-2xl space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F37021]">
                                    Step 3: Customer Doorstep Verification
                                  </span>
                                  <h4 className="font-extrabold text-sm text-[#1A2A49]">
                                    Ask Customer for their 4-Digit Start PIN
                                  </h4>
                                  <p className="text-[11px] text-gray-500">
                                    Customer ke Pluggy app ke &ldquo;My Bookings&rdquo; page par Start PIN likha hai.
                                  </p>
                                </div>
                                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800">
                                  {attemptsLeft} attempts left
                                </span>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={4}
                                  placeholder="Enter 4-Digit Start PIN"
                                  value={startOtpInputs[job.id] || ""}
                                  onChange={(e) =>
                                    setStartOtpInputs((prev) => ({
                                      ...prev,
                                      [job.id]: e.target.value.replace(/\D/g, ""),
                                    }))
                                  }
                                  className="flex-1 px-4 py-3 bg-[#F5F5F7] rounded-xl font-mono text-base font-extrabold tracking-widest text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                                />
                                <button
                                  onClick={() => handleStartWithPin(job)}
                                  className="px-6 py-3 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5"
                                >
                                  <KeyRound size={15} /> Verify Start PIN & Begin Repair
                                </button>
                              </div>
                            </div>
                          )}

                        {/* STEP 4: IN_PROGRESS -> MANDATORY WORK PROOF PHOTO + SPARE PARTS + HAPPY PIN */}
                        {job.status === "IN_PROGRESS" && (
                          <div className="space-y-4">
                            {/* 4A: Mandatory After-Repair Work Proof Photo Upload */}
                            <div className="bg-white p-4 rounded-2xl space-y-3">
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F37021]">
                                    Step 4A: Mandatory Work Proof (Required)
                                  </span>
                                  <h4 className="font-extrabold text-sm text-[#1A2A49]">
                                    📸 Upload Repaired Device / Work Proof Photo
                                  </h4>
                                  <p className="text-[11px] text-gray-500">
                                    Kaam poora hone ke baad device ki photo khinch kar dalein. Bina photo ke Happy PIN unlock nahi hoga.
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  disabled={uploadingJobId === job.id}
                                  onClick={() =>
                                    proofInputRefs.current[job.id]?.click()
                                  }
                                  className="px-4 py-2.5 rounded-xl bg-[#1A2A49] text-white text-xs font-extrabold flex items-center gap-1.5 shrink-0"
                                >
                                  <Camera size={14} />
                                  {uploadingJobId === job.id
                                    ? "Uploading..."
                                    : hasWorkProof
                                    ? "+ Add More Proof"
                                    : "Take Proof Photo"}
                                </button>
                                <input
                                  ref={(el) => {
                                    proofInputRefs.current[job.id] = el
                                  }}
                                  type="file"
                                  accept="image/*"
                                  capture="environment"
                                  className="hidden"
                                  onChange={(e) => {
                                    handleProofFileChange(
                                      job.id,
                                      e.target.files
                                    )
                                    e.target.value = ""
                                  }}
                                />
                              </div>

                              {hasWorkProof && (
                                <div className="grid grid-cols-3 gap-2 pt-1">
                                  {job.workProofPhotos.map((src, i) => (
                                    <div
                                      key={i}
                                      className="aspect-square rounded-xl overflow-hidden border border-emerald-200 bg-[#F5F5F7]"
                                    >
                                      <img
                                        src={src}
                                        alt={`Work proof ${i + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* 4B: Official Rate Card Spare Part Request */}
                            <div className="bg-white p-4 rounded-2xl space-y-3">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block">
                                Optional: Official Spare Part Quote (Customer Approval Required)
                              </span>
                              <div className="flex flex-col sm:flex-row gap-2">
                                <select
                                  value={selectedSpareCode}
                                  onChange={(e) =>
                                    setSelectedSpareCode(e.target.value)
                                  }
                                  className="flex-1 px-3 py-2.5 rounded-xl bg-[#F5F5F7] text-xs sm:text-sm font-semibold text-[#1A2A49]"
                                >
                                  {ALL_OFFICIAL_SPARES.map((sp) => (
                                    <option key={sp.code} value={sp.code}>
                                      {sp.part} — ₹{sp.price} ({sp.warranty})
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => handleSendSpareQuote(job.id)}
                                  className="px-4 py-2.5 bg-[#F37021] hover:bg-[#e05e15] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shrink-0"
                                >
                                  <PlusCircle size={15} /> Send Quote
                                </button>
                              </div>

                              {job.addedSpareParts?.length > 0 && (
                                <div className="divide-y divide-gray-100 pt-1">
                                  {job.addedSpareParts.map((p) => (
                                    <div
                                      key={p.uid}
                                      className="flex items-center justify-between text-xs py-2"
                                    >
                                      <span className="font-bold text-[#1A2A49]">
                                        {p.part} (₹{p.price})
                                      </span>
                                      <span
                                        className={`font-extrabold px-2 py-0.5 rounded ${
                                          p.status === "APPROVED"
                                            ? "bg-emerald-100 text-emerald-800"
                                            : p.status === "REJECTED"
                                            ? "bg-red-100 text-red-600"
                                            : "bg-amber-100 text-amber-800"
                                        }`}
                                      >
                                        {p.status}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* 4C: Enter Customer's 4-Digit Happy PIN (NO AUTO-FILL!) */}
                            <div
                              className={`p-4 rounded-2xl space-y-3 ${
                                hasWorkProof
                                  ? "bg-emerald-50 border border-emerald-200"
                                  : "bg-gray-100 opacity-75"
                              }`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                                    Step 4B: Final Customer Sign-Off
                                  </span>
                                  <h4 className="font-extrabold text-sm text-[#1A2A49]">
                                    Ask Customer for 4-Digit Happy PIN
                                  </h4>
                                  {!hasWorkProof && (
                                    <p className="text-xs text-red-600 font-semibold mt-0.5">
                                      ⚠️ Pehle upar Step 4A mein Repair Proof Photo upload karein!
                                    </p>
                                  )}
                                </div>
                                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white text-emerald-900">
                                  {attemptsLeft} attempts left
                                </span>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  disabled={!hasWorkProof}
                                  maxLength={4}
                                  placeholder="Enter 4-Digit Happy PIN"
                                  value={happyOtpInputs[job.id] || ""}
                                  onChange={(e) =>
                                    setHappyOtpInputs((prev) => ({
                                      ...prev,
                                      [job.id]: e.target.value.replace(/\D/g, ""),
                                    }))
                                  }
                                  className="flex-1 px-4 py-3 bg-white rounded-xl font-mono text-base font-extrabold tracking-widest text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-emerald-600 disabled:bg-gray-200"
                                />
                                <button
                                  disabled={!hasWorkProof}
                                  onClick={() => handleCompleteWithPin(job)}
                                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5"
                                >
                                  <CheckCircle2 size={16} /> Complete & Claim Payout
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ================= TAB 2: MY PASSBOOK & COMPLETED JOBS (CUSTOMER PHONE MASKED!) ================= */}
        {activeTab === "earnings" && (
          <div className="space-y-6">
            <div className="bg-[#F5F5F7] rounded-3xl p-5 sm:p-6 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">
                  Available Partner Wallet Balance
                </p>
                <h2 className="text-3xl font-extrabold text-[#1A2A49] mt-0.5">
                  ₹{engineer.walletBalance || totalEarnings}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Completed Jobs</p>
                <p className="text-2xl font-extrabold text-emerald-600">
                  {completedJobs.length}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-extrabold text-[#1A2A49] text-base mb-3">
                Completed Jobs History
              </h3>
              {completedJobs.length === 0 ? (
                <p className="text-sm text-gray-500 py-8 text-center bg-[#F5F5F7] rounded-2xl">
                  Abhi tak koi job complete nahi hui hai.
                </p>
              ) : (
                <div className="divide-y divide-gray-200 border-y border-gray-200">
                  {completedJobs.map((j) => (
                    <div
                      key={j.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-[#1A2A49]">
                            #{j.transactionId}
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                            ✓ Verified via Happy PIN
                          </span>
                        </div>
                        <p className="font-bold text-sm text-[#1A2A49] mt-1">
                          {j.service}
                        </p>
                        {/* Customer phone & house no. are masked after completion to prevent off-app poaching */}
                        <p className="text-xs text-gray-500 mt-0.5">
                          Customer: {j.userName} ({maskCustomerPhone(j.userPhone)}) •{" "}
                          {maskCustomerAddress(j.address)}
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <span className="font-extrabold text-base text-emerald-700">
                          + ₹
                          {j.engineerPayout ||
                            Math.round(Number(j.amount || 0) * 0.8)}
                        </span>
                        <p className="text-[11px] text-gray-400">
                          Credited to Wallet
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: DIGITAL PARTNER ID CARD ================= */}
        {activeTab === "profile" && (
          <div className="bg-[#F5F5F7] rounded-3xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1A2A49] to-[#F37021] rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold">
                  {engineer.name?.charAt(0) || "E"}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    🛡️ Background-Verified Pluggy Partner
                  </span>
                  <h3 className="text-xl font-extrabold text-[#1A2A49] mt-1">
                    {engineer.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Partner ID: <strong>{engineer.id}</strong> • Phone:{" "}
                    <strong>{engineer.phone}</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-extrabold text-[#1A2A49] bg-white px-3.5 py-2 rounded-xl w-fit">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <span>{engineer.rating || 4.9} Rating</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-white">
                <p className="text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Assigned Service Zone
                </p>
                <p className="font-extrabold text-sm text-[#1A2A49]">
                  {engineer.area || "Delhi NCR"}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white">
                <p className="text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Primary Specialization
                </p>
                <p className="font-extrabold text-sm text-[#1A2A49]">
                  {engineer.specialization || "AC & Electrical Master Tech"}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <p className="font-extrabold flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-[#F37021]" /> Partner Code of Conduct (Strict Compliance)
              </p>
              <p>
                • Customer se bina Pluggy App ke direct kaam ya off-app number lena sakt mana hai. Aapki shift GPS location humesha monitor hoti hai.
              </p>
              <p>
                • Har job par Start PIN aur Repair Proof Photo ke baad Happy PIN lena zaroori hai.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
