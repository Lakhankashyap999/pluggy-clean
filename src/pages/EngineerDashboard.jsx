// src/pages/EngineerDashboard.jsx
import { useState, useMemo } from "react";
import { useApp } from "../AppContext";
import FaultMediaView from "../components/FaultMediaView";
import { useNavigate, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Briefcase,
  Clock,
  QrCode,
} from "lucide-react";
import { SPARE_PARTS_RATE_CARD } from "../data/servicesCatalog";
import toast from "react-hot-toast";

const ALL_OFFICIAL_SPARES = Object.values(SPARE_PARTS_RATE_CARD).flat();

export default function EngineerDashboard() {
  const navigate = useNavigate();
  const {
    engineer,
    logoutEngineer,
    toggleEngineerDuty,
    myEngineerJobs,
    startJobWithOtp,
    addSparePartToJob,
    issueStandbyAppliance,
    completeJobWithOtp,
  } = useApp();

  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState("jobs"); // "jobs" | "earnings" | "profile"

  // OTP & Spare Part inputs keyed by job.id
  const [startOtpInputs, setStartOtpInputs] = useState({});
  const [happyOtpInputs, setHappyOtpInputs] = useState({});
  const [selectedSpareCode, setSelectedSpareCode] = useState(
    ALL_OFFICIAL_SPARES[0]?.code || ""
  );

  // Strictly only jobs assigned to this logged-in engineer
  const activeAssignedJobs = useMemo(() => {
    return (myEngineerJobs || [])
      .filter((r) => !["COMPLETED", "CANCELLED"].includes(r.status))
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id)
      );
  }, [myEngineerJobs]);

  const completedJobs = useMemo(() => {
    return (myEngineerJobs || [])
      .filter((r) => r.status === "COMPLETED")
      .sort(
        (a, b) =>
          new Date(b.completedAt || b.createdAt || b.id) -
          new Date(a.completedAt || a.createdAt || a.id)
      );
  }, [myEngineerJobs]);

  if (!engineer) {
    return <Navigate to="/engineer-login" replace />;
  }

  const totalEarnings = completedJobs.reduce(
    (sum, j) =>
      sum +
      Number(j.engineerPayout || Math.round(Number(j.amount || 0) * 0.8)),
    0
  );

  const handleStartWithPin = (job) => {
    const pin = (startOtpInputs[job.id] || "").trim();
    if (!pin) {
      toast.error("Please enter the customer's 4-Digit Start PIN");
      return;
    }
    const ok = startJobWithOtp(job.id, pin);
    if (ok) {
      setStartOtpInputs((prev) => ({ ...prev, [job.id]: "" }));
    }
  };

  const handleCompleteWithPin = (job) => {
    const pin = (happyOtpInputs[job.id] || "").trim();
    if (!pin) {
      toast.error("Please enter the customer's 4-Digit Happy PIN");
      return;
    }
    const ok = completeJobWithOtp(job.id, pin);
    if (ok) {
      setHappyOtpInputs((prev) => ({ ...prev, [job.id]: "" }));
    }
  };

  const handleSendSpareQuote = (jobId) => {
    const partObj = ALL_OFFICIAL_SPARES.find(
      (p) => p.code === selectedSpareCode
    );
    if (!partObj) return;
    addSparePartToJob(jobId, partObj);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-24 font-inter">
      {/* ================= DEDICATED ENGINEER TERMINAL TOP BAR ================= */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#121E36] via-[#1A2A49] to-[#223a61] text-white shadow-lg border-b-2 border-[#F37021]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center p-2 shadow-md ring-2 ring-[#F37021] shrink-0">
                <img
                  src="/image/logos.png"
                  alt="Pluggy Partner"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#F37021] text-white text-[10px] font-extrabold uppercase tracking-wider">
                    ENGINEER TERMINAL
                  </span>
                  <span className="font-mono text-xs font-extrabold text-amber-300">
                    ID: {engineer.id}
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-extrabold mt-0.5">
                  {engineer.name}
                </h1>
                <p className="text-blue-200 text-xs">
                  {engineer.specialization || "Master Technician"} • 📍{" "}
                  {engineer.area || "Delhi NCR"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              {/* Online / Offline Duty Toggle */}
              <button
                onClick={toggleEngineerDuty}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition active:scale-95 ${
                  engineer.isOnline !== false
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white/15 text-white/80"
                }`}
              >
                <Power size={14} />
                {engineer.isOnline !== false ? "ON DUTY" : "OFF DUTY"}
              </button>

              <button
                onClick={() => {
                  logoutEngineer();
                  toast.success("Logged out of Engineer Terminal");
                  navigate("/engineer-login", { replace: true });
                }}
                className="px-3.5 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>

          {/* Engineer Personal KPI Strip */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10"
            >
              <p className="text-xl sm:text-2xl font-extrabold text-amber-300">
                {activeAssignedJobs.length}
              </p>
              <p className="text-[11px] text-white/80 font-medium">
                Assigned Active Jobs
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10"
            >
              <p className="text-xl sm:text-2xl font-extrabold text-white">
                {(engineer.completedCount || 0) + completedJobs.length}
              </p>
              <p className="text-[11px] text-white/80 font-medium">
                Total Completed Jobs
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10"
            >
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-300">
                ₹{engineer.walletBalance || totalEarnings}
              </p>
              <p className="text-[11px] text-white/80 font-medium">
                My Partner Wallet
              </p>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ================= MAIN ENGINEER WORKSPACE ================= */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
        {/* Top Section Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200/80 mb-6">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
              activeTab === "jobs"
                ? "bg-[#1A2A49] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Wrench size={16} /> My Assigned Jobs ({activeAssignedJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("earnings")}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
              activeTab === "earnings"
                ? "bg-[#F37021] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <CircleDollarSign size={16} /> Earnings & History (
            {completedJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
              activeTab === "profile"
                ? "bg-[#1A2A49] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <User size={16} /> My ID Card & Kit
          </button>
        </div>

        {/* ================= TAB 1: MY ASSIGNED FIELD JOBS ================= */}
        {activeTab === "jobs" && (
          <div className="space-y-4">
            {activeAssignedJobs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-200/80"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <Package size={32} className="text-slate-400" />
                </div>
                <h3 className="font-extrabold text-[#1A2A49] text-base sm:text-lg mb-1">
                  No Active Jobs Assigned to {engineer.name} ({engineer.id})
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto">
                  Jab Admin Control Desk aapki ID (<strong>{engineer.id}</strong>) par koi customer request dispatch karega, toh woh job real-time mein yahan show hogi.
                </p>
              </motion.div>
            ) : (
              activeAssignedJobs.map((job, idx) => {
                const isExpanded = expandedId === job.id || true;

                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    layout
                    className="bg-white rounded-3xl shadow-sm border border-gray-200/90 overflow-hidden"
                  >
                    {/* Job Header */}
                    <div
                      className="p-5 cursor-pointer hover:bg-gray-50/60"
                      onClick={() =>
                        setExpandedId(expandedId === job.id ? null : job.id)
                      }
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#F4F6F9] text-[#1A2A49]">
                            #{job.transactionId || `PLG${job.id}`}
                          </span>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-bold ${
                              job.status === "IN_PROGRESS"
                                ? "bg-orange-100 text-[#F37021]"
                                : "bg-blue-100 text-[#1A2A49]"
                            }`}
                          >
                            {job.status === "IN_PROGRESS"
                              ? "🔧 Repair In Progress"
                              : "📍 Dispatched — Awaiting Start PIN"}
                          </span>
                        </div>
                        <span className="text-lg font-extrabold text-[#1A2A49]">
                          Bill: ₹{job.amount || 0}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-[#1A2A49] text-base sm:text-lg">
                        {job.service}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1 flex flex-wrap items-center gap-2">
                        <span>
                          👤 <strong>{job.userName || "Customer"}</strong> (
                          {job.userPhone || "+91 9876543210"})
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-[#F37021]" />
                          {job.address || job.userAddress}
                        </span>
                      </p>
                    </div>

                    {/* Expanded Partner Controls */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="border-t border-gray-100 bg-[#F4F6F9]/60 p-5 space-y-4"
                        >
                          {/* Pre-Departure Checklist & Customer Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-white p-4 rounded-2xl border border-gray-200">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F37021] block mb-1">
                                🧰 Admin-Locked Mandatory Toolkit
                              </span>
                              <p className="text-xs sm:text-sm font-bold text-[#1A2A49]">
                                {job.requiredKit ||
                                  "Digital Clamp Meter, Insulated Tools & Genuine Spares"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                <strong>Customer Issue:</strong>{" "}
                                {job.issue || "Standard Inspection"}
                              </p>
                              <div className="mt-2">
                                <FaultMediaView request={job} />
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">
                                  📞 Customer Contact & Executive Note
                                </span>
                                <p className="text-xs text-gray-600">
                                  {job.executiveNote ||
                                    "Verified by Admin Control Desk. Collect Start PIN on arrival."}
                                </p>
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                                <span className="text-xs font-bold text-emerald-700">
                                  Your Est. Share (80%): ₹
                                  {Math.round(Number(job.amount || 0) * 0.8)}
                                </span>
                                <a
                                  href={`tel:${job.userPhone || "+919876543210"}`}
                                  className="text-xs px-3 py-1.5 rounded-xl bg-[#1A2A49] text-white font-bold flex items-center gap-1"
                                >
                                  <Phone size={12} /> Call Customer
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* STEP 1: ENGINEER_ASSIGNED -> Enter 4-Digit Start PIN */}
                          {job.status === "ENGINEER_ASSIGNED" && (
                            <div className="bg-white p-4 rounded-2xl border-2 border-[#1A2A49]/20 space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F37021]">
                                    Step 1: Doorstep Arrival Verification
                                  </span>
                                  <h4 className="font-extrabold text-sm text-[#1A2A49]">
                                    Enter Customer&apos;s 4-Digit Start PIN to
                                    Begin Repair
                                  </h4>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setStartOtpInputs((prev) => ({
                                      ...prev,
                                      [job.id]: job.startOtp || "4821",
                                    }))
                                  }
                                  className="text-xs bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 px-3 py-1 rounded-lg font-mono font-bold transition"
                                >
                                  Auto-Fill Customer PIN: {job.startOtp || "4821"}
                                </button>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                  type="text"
                                  maxLength={4}
                                  placeholder="Enter 4-Digit Start PIN"
                                  value={startOtpInputs[job.id] || ""}
                                  onChange={(e) =>
                                    setStartOtpInputs((prev) => ({
                                      ...prev,
                                      [job.id]: e.target.value,
                                    }))
                                  }
                                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl font-mono text-base font-extrabold tracking-widest text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                                />
                                <button
                                  onClick={() => handleStartWithPin(job)}
                                  className="px-6 py-2.5 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
                                >
                                  <KeyRound size={15} /> Verify Start PIN &
                                  Begin Work
                                </button>
                              </div>
                            </div>
                          )}

                          {/* STEP 2: IN_PROGRESS -> Official Spare Parts Quote + Standby Loaner + Happy PIN */}
                          {job.status === "IN_PROGRESS" && (
                            <div className="space-y-4">
                              {/* Add Spare Part from Official Rate Card */}
                              <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F37021] block">
                                  🛠️ Add Spare Part from Official MRP Rate Card
                                  (100% Payout to You)
                                </span>
                                <div className="flex flex-col sm:flex-row gap-2">
                                  <select
                                    value={selectedSpareCode}
                                    onChange={(e) =>
                                      setSelectedSpareCode(e.target.value)
                                    }
                                    className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-[#1A2A49] bg-[#F4F6F9]"
                                  >
                                    {ALL_OFFICIAL_SPARES.map((sp) => (
                                      <option key={sp.code} value={sp.code}>
                                        {sp.part} — ₹{sp.price} (Warranty:{" "}
                                        {sp.warranty})
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    onClick={() => handleSendSpareQuote(job.id)}
                                    className="px-4 py-2.5 bg-[#F37021] hover:bg-[#e05e15] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shrink-0 active:scale-95 transition"
                                  >
                                    <PlusCircle size={15} /> Send Quote to
                                    Customer
                                  </button>
                                </div>

                                {job.addedSpareParts &&
                                  job.addedSpareParts.length > 0 && (
                                    <div className="pt-2 space-y-1.5">
                                      {job.addedSpareParts.map((p) => (
                                        <div
                                          key={p.uid}
                                          className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#F4F6F9]"
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

                              {/* Issue ₹99/day Standby Backup Appliance */}
                              <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">
                                    🔄 Workshop Motor/PCB Repair Continuity
                                  </span>
                                  <h4 className="font-bold text-xs sm:text-sm text-[#1A2A49]">
                                    Issue ₹99/day Standby Backup Fan or Cooler
                                    to Customer
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
                                    <RefreshCw size={14} /> Issue Standby Unit
                                    (₹99)
                                  </button>
                                )}
                              </div>

                              {/* Complete Job with 4-Digit Happy PIN */}
                              <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-300 space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                                      Step 2: Final Sign-Off & Instant Wallet
                                      Settlement
                                    </span>
                                    <h4 className="font-extrabold text-sm text-[#1A2A49]">
                                      Enter Customer&apos;s 4-Digit Happy PIN to
                                      Complete Job
                                    </h4>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setHappyOtpInputs((prev) => ({
                                        ...prev,
                                        [job.id]: job.happyOtp || "9134",
                                      }))
                                    }
                                    className="text-xs bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 px-3 py-1 rounded-lg font-mono font-bold transition"
                                  >
                                    Auto-Fill Happy PIN: {job.happyOtp || "9134"}
                                  </button>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2">
                                  <input
                                    type="text"
                                    maxLength={4}
                                    placeholder="Enter 4-Digit Happy PIN"
                                    value={happyOtpInputs[job.id] || ""}
                                    onChange={(e) =>
                                      setHappyOtpInputs((prev) => ({
                                        ...prev,
                                        [job.id]: e.target.value,
                                      }))
                                    }
                                    className="flex-1 px-4 py-2.5 bg-white border border-emerald-300 rounded-xl font-mono text-base font-extrabold tracking-widest text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                  />
                                  <button
                                    onClick={() => handleCompleteWithPin(job)}
                                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
                                  >
                                    <CheckCircle2 size={16} /> Complete & Claim
                                    Payout
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* ================= TAB 2: MY EARNINGS & COMPLETED HISTORY ================= */}
        {activeTab === "earnings" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <p className="text-xs text-gray-500">
                  Partner Wallet Balance (80% Service Share + 100% Spare MRP)
                </p>
                <h2 className="text-3xl font-extrabold text-[#1A2A49]">
                  ₹{engineer.walletBalance || totalEarnings}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Completed Jobs</p>
                <p className="text-xl font-extrabold text-emerald-600">
                  {completedJobs.length}
                </p>
              </div>
            </div>

            <h3 className="font-extrabold text-[#1A2A49] text-sm">
              My Completed Jobs & Escrow Payout Ledger
            </h3>
            {completedJobs.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">
                No completed jobs in this session yet. Complete an assigned job
                using the customer&apos;s Happy PIN to see your instant payout!
              </p>
            ) : (
              <div className="space-y-2.5">
                {completedJobs.map((j) => (
                  <div
                    key={j.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#F4F6F9] rounded-2xl border border-gray-200/80 gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-[#1A2A49]">
                          #{j.transactionId}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <QrCode size={11} /> {j.applianceQrId || "30-Day QR"}
                        </span>
                      </div>
                      <p className="font-bold text-sm text-[#1A2A49] mt-1">
                        {j.service}
                      </p>
                      <p className="text-xs text-gray-500">
                        Customer: {j.userName} • {j.address}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="font-extrabold text-base text-emerald-700">
                        + ₹
                        {j.engineerPayout ||
                          Math.round(Number(j.amount || 0) * 0.8)}
                      </span>
                      <p className="text-[11px] text-gray-500">
                        Settled via Happy PIN
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ================= TAB 3: MY PARTNER ID CARD & TOOLKIT ================= */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1A2A49] to-[#F37021] rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold shadow-md">
                  {engineer.name?.charAt(0) || "E"}
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    🛡️ Admin-Verified Pluggy Partner
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
              <div className="flex items-center gap-1.5 text-sm font-extrabold text-[#1A2A49] bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl w-fit">
                <Star size={16} className="fill-amber-400 text-amber-400" />
                <span>{engineer.rating || 4.9} Rating</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#F4F6F9] border border-gray-200">
                <p className="text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Assigned Service Zone
                </p>
                <p className="font-extrabold text-sm text-[#1A2A49]">
                  {engineer.area || "Delhi NCR"}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F4F6F9] border border-gray-200">
                <p className="text-gray-400 font-bold uppercase text-[10px] mb-1">
                  Primary Specialization
                </p>
                <p className="font-extrabold text-sm text-[#1A2A49]">
                  {engineer.specialization || "AC & Electrical Master Tech"}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">
                🧰 Issued Standard Toolkit
              </h4>
              <div className="flex flex-wrap gap-2">
                {(
                  engineer.toolKit || [
                    "Digital Clamp Meter",
                    "Insulated Safety Kit",
                    "Genuine Spare Parts Box",
                  ]
                ).map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#1A2A49] border border-blue-200 text-xs font-bold"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
