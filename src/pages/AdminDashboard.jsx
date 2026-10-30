// src/pages/AdminDashboard.jsx
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useApp } from "../AppContext";
import FaultMediaView from "../components/FaultMediaView";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  UserCheck,
  CheckCircle2,
  MapPin,
  Plus,
  Users,
  ClipboardCheck,
  Database,
  CreditCard,
  History,
  Play,
  RotateCcw,
  LogOut,
  Edit3,
  Trash2,
  ShieldAlert,
  X,
  Eye,
  EyeOff,
  Ban,
  Navigation,
  Clock,
  Lock,
  Unlock,
  Camera,
  Activity,
  Radio,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

const TOOLKIT_PRESETS = [
  "Digital Clamp Meter + Havells MCB/Capacitor Kit",
  "High-Pressure AC Jet Pump + R32/R410a Gas Gauge",
  "Fan Bearing Puller + Standby Backup Fan Unit",
  "Event 3-Phase Load Balancer + 50m Armored Cable",
  "Geyser Thermostat + Heating Element Kit",
  "Plumbing Pressure Wrench + Leak Sealant Kit",
];

function formatDateTime(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const {
    admin,
    logoutAdmin,
    requests,
    engineersList,
    paymentTransactions,
    orderHistoryLogs,
    verifyByExecutive,
    assignEngineer,
    registerNewEngineer,
    updateEngineer,
    removeEngineer,
    getNextEngineerId,
    executeSql,
    resetDemoSqlDatabase,
    // New Engineer Surveillance & Anti-Bypass Controls
    engineerTelemetryLogs,
    engineerSecurityAlerts,
    unlockEngineerJobPin,
    resolveEngineerAlert,
    pingEngineerLiveLocation,
    raiseEngineerSecurityAlert,
    forceCloudSync,
  } = useApp();

  const [activeTab, setActiveTab] = useState("dispatch"); // dispatch | fleet | surveillance | payments | history | sql
  const [selectedKits, setSelectedKits] = useState({});
  const [selectedEngIds, setSelectedEngIds] = useState({});
  const [showPasswords, setShowPasswords] = useState({});
  const [telemetryFilterEng, setTelemetryFilterEng] = useState("ALL");

  // Edit Engineer Modal State
  const [editingEng, setEditingEng] = useState(null);

  // New Engineer Form State
  const [newEng, setNewEng] = useState({
    id: "",
    name: "",
    phone: "",
    password: "eng123",
    specialization: "AC & Electrical Master Tech",
    area: "Indirapuram / Noida / Ghaziabad",
  });

  // SQL Explorer state
  const [sqlInput, setSqlInput] = useState("SELECT * FROM engineers");
  const [sqlResult, setSqlResult] = useState(null);

  if (!admin) {
    return <Navigate to="/admin-login" replace />;
  }

  const pendingVerificationCount = (requests || []).filter(
    (r) => r.status === "PENDING_EXECUTIVE"
  ).length;
  const totalRevenue = (paymentTransactions || []).reduce(
    (sum, tx) => sum + Number(tx.amount || 0),
    0
  );
  const platformCommission = Math.round(totalRevenue * 0.2);

  const openSecurityAlerts = (engineerSecurityAlerts || []).filter(
    (a) => a.status !== "RESOLVED"
  );
  const onDutyEngineersCount = (engineersList || []).filter(
    (e) => e.isOnline || e.onDuty
  ).length;

  const handleVerify = (req) => {
    const kit = selectedKits[req.id] || TOOLKIT_PRESETS[0];
    verifyByExecutive(
      req.id,
      "Customer address & fault verified by Admin Control Desk.",
      kit
    );
  };

  const handleDispatchEngineer = (req) => {
    const activeEngineers = (engineersList || []).filter(
      (e) => e.status !== "SUSPENDED"
    );
    const engId =
      selectedEngIds[req.id] ||
      req.assignedEngineerId ||
      activeEngineers[0]?.id;
    const engObj =
      activeEngineers.find((e) => e.id === engId) || activeEngineers[0];
    if (!engObj) {
      toast.error("No active engineer available");
      return;
    }
    if (req.status === "PENDING_EXECUTIVE") {
      const kit = selectedKits[req.id] || req.requiredKit || TOOLKIT_PRESETS[0];
      verifyByExecutive(
        req.id,
        "Verified & dispatched by Admin Control Desk.",
        kit
      );
    }
    assignEngineer(req.id, engObj.id, engObj.name);
  };

  const handleRunSql = (queryToRun) => {
    const q = queryToRun || sqlInput;
    setSqlInput(q);
    const res = executeSql(q);
    setSqlResult(res);
  };

  const handleCreateEngineer = (e) => {
    e.preventDefault();
    if (!newEng.name.trim()) {
      toast.error("Please enter Engineer's full name");
      return;
    }
    const resolvedId =
      newEng.id.trim().toUpperCase() || getNextEngineerId();
    const created = registerNewEngineer({
      ...newEng,
      id: resolvedId,
    });
    if (created) {
      setNewEng({
        id: "",
        name: "",
        phone: "",
        password: "eng123",
        specialization: "AC & Electrical Master Tech",
        area: "Indirapuram / Noida / Ghaziabad",
      });
    }
  };

  const handleSaveEngineerEdit = (e) => {
    e.preventDefault();
    if (!editingEng) return;
    updateEngineer(editingEng.id, {
      name: editingEng.name,
      phone: editingEng.phone,
      password: editingEng.password,
      specialization: editingEng.specialization,
      area: editingEng.area,
      status: editingEng.status || "ACTIVE",
    });
    setEditingEng(null);
  };

  const handleSimulateAntiBypassAlert = async (eng) => {
    const targetEng = eng || engineersList?.[0];
    if (!targetEng) return;
    raiseEngineerSecurityAlert({
      engineerId: targetEng.id,
      engineerName: targetEng.name,
      severity: "CRITICAL",
      type: "ANTI_BYPASS_PROXIMITY",
      title: `Repeat Unbooked Visit Near Past Customer Home (${targetEng.name})`,
      description: `GPS Radar detected ${targetEng.name} (${targetEng.id}) stationary within 95m of past customer house (${targetEng.area || "Indirapuram"}) for 14 mins without any active Pluggy booking. Possible off-app poaching attempt!`,
      lat: targetEng.lastLat || 28.6415,
      lng: targetEng.lastLng || 77.3714,
      locationLabel: targetEng.lastLocationLabel || targetEng.area || "Delhi NCR",
    });
    toast.error(
      `Anti-Bypass Alert triggered for ${targetEng.name} (${targetEng.id})!`,
      { id: "anti-bypass-sim" }
    );
  };

  const filteredTelemetryLogs = (engineerTelemetryLogs || []).filter((log) =>
    telemetryFilterEng === "ALL" ? true : log.engineerId === telemetryFilterEng
  );

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-20 font-inter">
      {/* ================= DEDICATED ADMIN COMMAND TOP HEADER ================= */}
      <header className="lg:sticky top-0 z-40 bg-gradient-to-r from-[#0F172A] via-[#1A2A49] to-[#223a61] text-white shadow-lg border-b-2 border-[#F37021]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center p-2 shadow-md ring-2 ring-[#F37021] shrink-0">
                <img
                  src="/image/logos.png"
                  alt="Pluggy Admin HQ"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#F37021] text-white text-[10px] font-extrabold uppercase tracking-wider">
                    ADMIN CONTROL DESK
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                    <Database size={11} /> SQL Master Access ({admin.id})
                  </span>
                  {openSecurityAlerts.length > 0 && (
                    <button
                      onClick={() => setActiveTab("surveillance")}
                      className="px-2.5 py-0.5 rounded bg-red-500 text-white text-[10px] font-extrabold flex items-center gap-1 animate-pulse"
                    >
                      <ShieldAlert size={11} /> {openSecurityAlerts.length}{" "}
                      Security / Anti-Bypass Alert(s)
                    </button>
                  )}
                </div>
                <h1 className="text-lg sm:text-xl font-extrabold mt-0.5">
                  {admin.name}
                </h1>
                <p className="text-blue-200 text-[11px] sm:text-xs leading-snug">
                  <span className="hidden sm:inline">
                    Central Dispatch • Live Engineer GPS & Shift Tracking •
                    Anti-Bypass Radar • Escrow Ledger
                  </span>
                  <span className="sm:hidden">
                    Dispatch • Live Engineer GPS • Anti-Bypass Radar
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex items-center gap-2">
              <button
                onClick={async () => {
                  await forceCloudSync?.(true);
                  toast.success("Synced live bookings from Cloud SQL Server!", {
                    id: "cloud-sync-btn",
                  });
                }}
                className="px-3 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-100 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
                title="Sync Cross-Device Live Bookings"
              >
                <RotateCcw size={14} className="shrink-0 text-emerald-300" />
                <span className="truncate">Sync Live</span>
              </button>
              <button
                onClick={() => setActiveTab("surveillance")}
                className="px-3 py-2.5 rounded-xl bg-red-500/25 hover:bg-red-500/35 border border-red-400/40 text-red-100 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Radio size={14} className="shrink-0 text-red-300" />
                <span className="truncate">
                  GPS & Radar ({openSecurityAlerts.length})
                </span>
              </button>
              <button
                onClick={() => setActiveTab("fleet")}
                className="px-3 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#e05e15] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Users size={14} className="shrink-0" />
                <span className="truncate">
                  Engineers ({engineersList?.length || 0})
                </span>
              </button>
              <button
                onClick={() => {
                  logoutAdmin();
                  toast.success("Logged out of Admin Control Desk");
                  navigate("/admin-login", { replace: true });
                }}
                className="col-span-2 sm:col-span-1 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>

          {/* Admin KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-white/10 [&>div]:!p-2.5 [&_p.text-xs]:!text-[11px] [&_p.text-2xl]:!text-xl sm:[&_p.text-2xl]:!text-2xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/15">
              <p className="text-2xl font-extrabold text-amber-300">
                {pendingVerificationCount}
              </p>
              <p className="text-xs text-white/80">
                New Customer Requests Pending
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/15">
              <p className="text-2xl font-extrabold text-emerald-300">
                {onDutyEngineersCount} / {(engineersList || []).length}
              </p>
              <p className="text-xs text-white/80">
                Engineers On Duty (Live GPS)
              </p>
            </div>
            <div
              onClick={() => setActiveTab("surveillance")}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/15 cursor-pointer hover:bg-white/15 transition"
            >
              <p
                className={`text-2xl font-extrabold ${
                  openSecurityAlerts.length > 0
                    ? "text-red-400"
                    : "text-emerald-300"
                }`}
              >
                {openSecurityAlerts.length}
              </p>
              <p className="text-xs text-white/80">
                Anti-Bypass / Tamper Alerts
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/15">
              <p className="text-2xl font-extrabold text-blue-200">
                {(paymentTransactions || []).length}
              </p>
              <p className="text-xs text-white/80">
                Payment Gateway Transactions
              </p>
            </div>
            <div className="col-span-2 lg:col-span-1 bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/15">
              <p className="text-2xl font-extrabold text-white">
                ₹{totalRevenue}{" "}
                <span className="text-xs font-normal text-amber-300">
                  (Net: ₹{platformCommission})
                </span>
              </p>
              <p className="text-xs text-white/80">Escrow Gross Volume</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4 sm:mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => setActiveTab("dispatch")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === "dispatch"
                ? "bg-[#1A2A49] text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#F37021]"
            }`}
          >
            <ClipboardCheck size={16} /> 1. Dispatch ({requests?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("fleet")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === "fleet"
                ? "bg-[#F37021] text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#F37021]"
            }`}
          >
            <Users size={16} /> 2. Engineers & Shift Logs (
            {engineersList?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("surveillance")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === "surveillance"
                ? "bg-red-600 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-red-500"
            }`}
          >
            <ShieldAlert size={16} /> 3. Live GPS & Anti-Bypass Radar (
            {openSecurityAlerts.length})
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === "payments"
                ? "bg-[#1A2A49] text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#F37021]"
            }`}
          >
            <CreditCard size={16} /> 4. Payments (
            {paymentTransactions?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === "history"
                ? "bg-[#1A2A49] text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#F37021]"
            }`}
          >
            <History size={16} /> 5. History ({orderHistoryLogs?.length || 0})
          </button>

          <button
            onClick={() => {
              setActiveTab("sql");
              if (!sqlResult) handleRunSql("SELECT * FROM engineers");
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === "sql"
                ? "bg-emerald-700 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#F37021]"
            }`}
          >
            <Database size={16} /> 6. SQL DB
          </button>
        </div>

        {/* ================= TAB 1: LIVE DISPATCH QUEUE ================= */}
        {activeTab === "dispatch" && (
          <div className="space-y-4">
            {(requests || []).length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                <p className="text-base font-bold text-[#1A2A49]">
                  No service requests in the SQL database yet.
                </p>
              </div>
            ) : (
              (requests || []).map((req) => (
                <motion.div
                  key={req.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm border border-gray-200/90 space-y-3 sm:space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#F4F6F9] text-[#1A2A49]">
                        #{req.transactionId || `PLG${req.id}`}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-[#1A2A49] text-xs font-bold border border-blue-200">
                        Status: {req.status}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                        Pay: {req.paymentMethod || "UPI"}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">
                        Start PIN: <strong>{req.startOtp || "4821"}</strong> •
                        Happy PIN: <strong>{req.happyOtp || "9134"}</strong>
                      </span>
                      {req.pinLocked && (
                        <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-extrabold flex items-center gap-1 border border-red-300">
                          <Lock size={12} /> PIN Terminal Locked (
                          {req.wrongPinAttempts || 3} wrong attempts)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {req.pinLocked && (
                        <button
                          onClick={() => unlockEngineerJobPin(req.id)}
                          className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
                        >
                          <Unlock size={13} /> Unlock PIN Terminal
                        </button>
                      )}
                      <span className="text-lg font-extrabold text-[#1A2A49]">
                        ₹{req.amount || 0}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 xl:items-center">
                    {/* Customer & Fault Info */}
                    <div className="xl:col-span-5 space-y-1">
                      <h3 className="font-extrabold text-base text-[#1A2A49]">
                        {req.service}
                      </h3>
                      <p className="text-xs text-gray-600">
                        <strong>Customer:</strong> {req.userName || "Customer"}{" "}
                        ({req.userPhone || "+91 9876543210"})
                      </p>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <MapPin size={13} className="text-[#F37021]" />
                        {req.address || req.userAddress || "Doorstep Address"}
                      </p>
                      <p className="text-xs text-gray-500">
                        <strong>Fault Note:</strong>{" "}
                        {req.issue || "Standard Inspection"}
                      </p>

                      {/* Customer Before Photo */}
                      <FaultMediaView request={req} compact />

                      {/* Engineer Live Field Timestamps & Uploaded Work Proof */}
                      {(req.travelStartedAt ||
                        req.enRouteAt ||
                        req.arrivedAt ||
                        req.reachedDoorstepAt ||
                        req.startedAt ||
                        req.jobStartedAt ||
                        req.completedAt ||
                        (req.workProofPhotos &&
                          req.workProofPhotos.length > 0)) && (
                        <div className="mt-2 pt-2 border-t border-gray-100 space-y-2">
                          <div className="flex flex-wrap gap-1.5 text-[11px]">
                            {(req.travelStartedAt || req.enRouteAt) && (
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                                🛵 En Route:{" "}
                                {formatDateTime(
                                  req.travelStartedAt || req.enRouteAt
                                )}
                              </span>
                            )}
                            {(req.arrivedAt || req.reachedDoorstepAt) && (
                              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                                📍 Doorstep:{" "}
                                {formatDateTime(
                                  req.arrivedAt || req.reachedDoorstepAt
                                )}
                              </span>
                            )}
                            {(req.startedAt || req.jobStartedAt) && (
                              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold">
                                🔧 Started:{" "}
                                {formatDateTime(
                                  req.startedAt || req.jobStartedAt
                                )}
                              </span>
                            )}
                            {req.completedAt && (
                              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold">
                                ✅ Done: {formatDateTime(req.completedAt)} (
                                {req.jobDurationMinutes ||
                                  req.workDurationMinutes ||
                                  1}{" "}
                                min)
                              </span>
                            )}
                          </div>

                          {Array.isArray(req.workProofPhotos) &&
                            req.workProofPhotos.length > 0 && (
                              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-2.5">
                                <p className="text-[11px] font-extrabold text-emerald-900 flex items-center gap-1 mb-1.5">
                                  <Camera size={12} /> Engineer After-Repair
                                  Work Proof ({req.workProofPhotos.length})
                                </p>
                                <div className="flex gap-2 overflow-x-auto">
                                  {req.workProofPhotos.map((photo, idx) => {
                                    const imgSrc =
                                      typeof photo === "string"
                                        ? photo
                                        : photo?.dataUrl;
                                    if (!imgSrc) return null;
                                    return (
                                      <a
                                        key={photo?.id || idx}
                                        href={imgSrc}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block w-16 h-16 rounded-lg overflow-hidden border border-emerald-300 shrink-0"
                                        title={
                                          req.workProofNote ||
                                          "Engineer Repair Work Proof"
                                        }
                                      >
                                        <img
                                          src={imgSrc}
                                          alt="Engineer Work Proof"
                                          className="w-full h-full object-cover"
                                        />
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </div>

                    {/* Executive Verification & Toolkit Assignment */}
                    <div className="xl:col-span-4 space-y-2 bg-[#F4F6F9] p-3.5 rounded-2xl">
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                        1. Mandatory Toolkit for Engineer
                      </label>
                      <select
                        value={
                          selectedKits[req.id] ||
                          req.requiredKit ||
                          TOOLKIT_PRESETS[0]
                        }
                        onChange={(e) =>
                          setSelectedKits((prev) => ({
                            ...prev,
                            [req.id]: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-[#1A2A49]"
                      >
                        {TOOLKIT_PRESETS.map((kit) => (
                          <option key={kit} value={kit}>
                            {kit}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleVerify(req)}
                        className="w-full py-2 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 size={14} /> Verify & Lock Toolkit
                      </button>
                    </div>

                    {/* Engineer Dispatch Selector */}
                    <div className="xl:col-span-3 space-y-2 bg-[#F4F6F9] p-3.5 rounded-2xl">
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                        2. Assign to Engineer ID
                      </label>
                      <select
                        value={
                          selectedEngIds[req.id] ||
                          req.assignedEngineerId ||
                          engineersList?.[0]?.id
                        }
                        onChange={(e) =>
                          setSelectedEngIds((prev) => ({
                            ...prev,
                            [req.id]: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-[#1A2A49]"
                      >
                        {(engineersList || [])
                          .filter((e) => e.status !== "SUSPENDED")
                          .map((eng) => (
                            <option key={eng.id} value={eng.id}>
                              {eng.id}: {eng.name}{" "}
                              {eng.isOnline || eng.onDuty
                                ? "(🟢 On Duty)"
                                : "(⚪ Off Duty)"}
                            </option>
                          ))}
                      </select>

                      <button
                        onClick={() => handleDispatchEngineer(req)}
                        className="w-full py-2.5 px-2 bg-[#F37021] hover:bg-[#e05e15] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 text-center leading-tight"
                      >
                        <UserCheck size={14} />{" "}
                        {req.assignedEngineer
                          ? `Assigned: ${req.assignedEngineerId} (${req.assignedEngineer})`
                          : "Assign & Dispatch"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* ================= TAB 2: ENGINEER FLEET, SHIFT LOGS, GPS & CREATE NEW ID ================= */}
        {activeTab === "fleet" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: All Engineers List with Shift Login/Logout, GPS, Work Done & Controls */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="bg-white rounded-2xl p-4 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-extrabold text-[#1A2A49]">
                    Registered SQL Engineers ({engineersList?.length || 0})
                  </h2>
                  <p className="text-xs text-gray-500">
                    View live login/logout times, completed jobs, wallet
                    payouts, live GPS coordinates, and credentials.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("surveillance")}
                  className="px-3 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-extrabold flex items-center gap-1.5 shrink-0"
                >
                  <Radio size={14} /> Open Full GPS Radar
                </button>
              </div>

              {(engineersList || []).map((eng) => {
                const assignedJobs = (requests || []).filter(
                  (r) =>
                    r.assignedEngineerId === eng.id &&
                    !["COMPLETED", "CANCELLED"].includes(r.status)
                );
                const completedJobsForEng = (requests || []).filter(
                  (r) =>
                    r.assignedEngineerId === eng.id && r.status === "COMPLETED"
                );
                const isPassVisible = showPasswords[eng.id];

                return (
                  <motion.div
                    key={eng.id}
                    layout
                    className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200 space-y-3.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-[#1A2A49] text-[#F37021] font-mono font-extrabold flex items-center justify-center text-xs shrink-0">
                          {eng.id}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-extrabold text-base text-[#1A2A49]">
                              {eng.name}
                            </h4>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                eng.status === "SUSPENDED"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}
                            >
                              {eng.status === "SUSPENDED"
                                ? "SUSPENDED"
                                : "ACTIVE"}
                            </span>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                eng.isOnline || eng.onDuty
                                  ? "bg-emerald-600 text-white"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {eng.isOnline || eng.onDuty
                                ? "🟢 ON DUTY"
                                : "⚪ OFF DUTY"}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#F37021]">
                              {assignedJobs.length} Active Job(s)
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {eng.specialization} • 📍{" "}
                            {eng.area || "Delhi NCR"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => pingEngineerLiveLocation(eng.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1A2A49] border border-blue-200 text-xs font-extrabold flex items-center gap-1"
                          title="Ping Engineer Live GPS Location"
                        >
                          <Navigation size={12} className="text-[#F37021]" />{" "}
                          Ping GPS
                        </button>
                        <button
                          onClick={() => setEditingEng({ ...eng })}
                          className="px-3 py-1.5 rounded-xl bg-[#1A2A49] hover:bg-[#223a61] text-white text-xs font-bold flex items-center gap-1"
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        <button
                          onClick={() =>
                            updateEngineer(eng.id, {
                              status:
                                eng.status === "SUSPENDED"
                                  ? "ACTIVE"
                                  : "SUSPENDED",
                            })
                          }
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border ${
                            eng.status === "SUSPENDED"
                              ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                              : "border-amber-300 text-amber-800 bg-amber-50"
                          }`}
                          title="Suspend / Activate Engineer"
                        >
                          <Ban size={13} />
                        </button>
                        <button
                          onClick={() => removeEngineer(eng.id)}
                          className="p-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                          title="Delete Engineer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Credentials & Work Done Summary Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-gray-100 text-xs">
                      <div className="bg-[#F4F6F9] p-2.5 rounded-xl">
                        <span className="text-[10px] text-gray-400 font-bold block">
                          LOGIN ID
                        </span>
                        <span className="font-mono font-extrabold text-[#1A2A49]">
                          {eng.id}
                        </span>
                      </div>
                      <div className="bg-[#F4F6F9] p-2.5 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold block">
                            PASSWORD
                          </span>
                          <span className="font-mono font-extrabold text-[#F37021]">
                            {isPassVisible
                              ? eng.password || "eng123"
                              : "••••••"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords((p) => ({
                              ...p,
                              [eng.id]: !p[eng.id],
                            }))
                          }
                          className="text-gray-400 hover:text-[#1A2A49]"
                        >
                          {isPassVisible ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}
                        </button>
                      </div>
                      <div className="bg-[#F4F6F9] p-2.5 rounded-xl">
                        <span className="text-[10px] text-gray-400 font-bold block">
                          PHONE
                        </span>
                        <span className="font-bold text-[#1A2A49]">
                          {eng.phone}
                        </span>
                      </div>
                      <div className="bg-[#F4F6F9] p-2.5 rounded-xl">
                        <span className="text-[10px] text-gray-400 font-bold block">
                          WORK DONE & WALLET
                        </span>
                        <span className="font-extrabold text-emerald-700">
                          {Math.max(
                            Number(eng.completedCount || 0),
                            completedJobsForEng.length
                          )}{" "}
                          Jobs • ₹{eng.walletBalance || 0}
                        </span>
                      </div>
                    </div>

                    {/* Shift Login / Logout Timestamps & Live GPS Coordinates Box */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-900 text-white p-3 rounded-2xl text-xs">
                      <div className="flex items-start gap-2">
                        <Clock
                          size={14}
                          className="text-emerald-400 shrink-0 mt-0.5"
                        />
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Last Login Time
                          </span>
                          <span className="font-mono font-bold text-emerald-300">
                            {formatDateTime(eng.lastLoginAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <LogOut
                          size={14}
                          className="text-amber-400 shrink-0 mt-0.5"
                        />
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Last Logout Time
                          </span>
                          <span className="font-mono font-bold text-amber-300">
                            {formatDateTime(eng.lastLogoutAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin
                          size={14}
                          className="text-[#F37021] shrink-0 mt-0.5"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">
                            Live Captured GPS Location
                          </span>
                          <span className="font-mono font-bold text-white block truncate">
                            {eng.lastLat && eng.lastLng
                              ? `${eng.lastLat}, ${eng.lastLng}`
                              : "28.6415, 77.3714 (NCR Zone)"}
                          </span>
                          <span className="text-[10px] text-blue-200 block truncate">
                            {eng.lastLocationLabel || eng.area || "Delhi NCR"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right 5 Cols: Create New Engineer ID Form */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleCreateEngineer}
                className="bg-white rounded-3xl p-6 shadow-sm border-2 border-[#1A2A49]/10 space-y-4 sticky top-28"
              >
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F37021] bg-orange-50 px-2.5 py-1 rounded-md">
                    Admin Exclusive Access
                  </span>
                  <h3 className="font-extrabold text-lg text-[#1A2A49] flex items-center gap-2 mt-1.5">
                    <Plus size={18} className="text-[#F37021]" /> Generate New
                    Engineer ID & Password
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Create a new Engineer account in the SQL database. The
                    engineer can immediately log in on{" "}
                    <code>/engineer-login</code> using these credentials.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      Engineer ID (Auto: {getNextEngineerId()})
                    </label>
                    <input
                      type="text"
                      placeholder={getNextEngineerId()}
                      value={newEng.id}
                      onChange={(e) =>
                        setNewEng({
                          ...newEng,
                          id: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono font-bold text-[#1A2A49]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      Login Password *
                    </label>
                    <input
                      type="text"
                      placeholder="eng123"
                      value={newEng.password}
                      onChange={(e) =>
                        setNewEng({ ...newEng, password: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-mono font-bold text-[#F37021]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Engineer Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Manoj Kumar"
                    value={newEng.name}
                    onChange={(e) =>
                      setNewEng({ ...newEng, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    10-Digit Mobile Number *
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9876501234"
                    value={newEng.phone}
                    onChange={(e) =>
                      setNewEng({ ...newEng, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Primary Specialization
                  </label>
                  <input
                    type="text"
                    value={newEng.specialization}
                    onChange={(e) =>
                      setNewEng({ ...newEng, specialization: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Assigned Zone / City Area
                  </label>
                  <input
                    type="text"
                    value={newEng.area}
                    onChange={(e) =>
                      setNewEng({ ...newEng, area: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#F37021] hover:bg-[#e05e15] text-white rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition active:scale-95"
                >
                  + Create Engineer ID in SQL Database
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= TAB 3: LIVE GPS & ANTI-BYPASS SURVEILLANCE RADAR ================= */}
        {activeTab === "surveillance" && (
          <div className="space-y-6">
            {/* Top Anti-Bypass Radar Banner */}
            <div className="bg-gradient-to-r from-[#0F172A] via-[#1A2A49] to-[#223a61] text-white rounded-3xl p-5 sm:p-6 shadow-md border border-white/10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-400/30 text-red-300 text-[11px] font-extrabold uppercase tracking-wider">
                    <Radio size={13} className="animate-pulse" /> Anti-Poaching
                    & Customer Bypass Radar Active
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold">
                    Field Engineer GPS Surveillance, Shift Attendance & Tamper
                    Logs
                  </h2>
                  <p className="text-xs text-blue-200 max-w-3xl leading-relaxed">
                    Every engineer login, logout, duty toggle, travel step, PIN
                    attempt, and 60-second GPS heartbeat is recorded here. If an
                    engineer visits a past customer&apos;s location without an
                    active booking (to offer direct off-app service), or tries
                    to guess Customer PINs, a critical alert is raised
                    immediately.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    onClick={() =>
                      handleSimulateAntiBypassAlert(engineersList?.[0])
                    }
                    className="px-3.5 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#e05e15] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                  >
                    <AlertTriangle size={14} /> Test Repeat Customer Visit Alert
                  </button>
                </div>
              </div>
            </div>

            {/* Section 1: Security & Anti-Bypass Alerts */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#1A2A49] flex items-center gap-2">
                    <ShieldAlert size={18} className="text-red-600" /> Active
                    Anti-Bypass & System Tamper Alerts (
                    {openSecurityAlerts.length} Open)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Alerts for unbooked repeat visits near past customer homes,
                    3x wrong PIN lockouts, GPS permission blocks, and speed-run
                    completions.
                  </p>
                </div>
              </div>

              {(engineerSecurityAlerts || []).length === 0 ? (
                <div className="p-8 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-center space-y-1">
                  <p className="text-sm font-extrabold text-emerald-900">
                    ✅ Zero Bypass or Tamper Alerts Detected
                  </p>
                  <p className="text-xs text-emerald-700">
                    All field engineers are following the locked 4-step workflow
                    within authorized customer zones.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(engineerSecurityAlerts || []).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        alert.status === "RESOLVED"
                          ? "bg-gray-50 border-gray-200 opacity-65"
                          : alert.severity === "CRITICAL"
                          ? "bg-red-50/80 border-red-300"
                          : "bg-amber-50/80 border-amber-300"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                              alert.severity === "CRITICAL"
                                ? "bg-red-600 text-white"
                                : "bg-amber-600 text-white"
                            }`}
                          >
                            {alert.severity} • {alert.type}
                          </span>
                          <span className="font-mono text-xs font-extrabold text-[#1A2A49]">
                            {alert.engineerId} ({alert.engineerName})
                          </span>
                          <span className="text-[11px] text-gray-500 font-mono">
                            📍 {alert.lat || "28.6415"},{" "}
                            {alert.lng || "77.3714"} (
                            {alert.locationLabel || "Delhi NCR"})
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-[#1A2A49]">
                          {alert.title}
                        </h4>
                        <p className="text-xs text-gray-700">
                          {alert.description || alert.details}
                        </p>
                        <p className="text-[11px] font-mono text-gray-500">
                          Triggered:{" "}
                          {formatDateTime(alert.timestamp || alert.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {alert.status !== "RESOLVED" ? (
                          <button
                            onClick={() => resolveEngineerAlert(alert.id)}
                            className="px-3.5 py-2 rounded-xl bg-[#1A2A49] hover:bg-[#223a61] text-white text-xs font-extrabold"
                          >
                            Mark Resolved
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                            Resolved
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 2: Engineer Shift Login/Logout, Work Done & Live GPS Table */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-200 space-y-4">
              <div className="pb-3 border-b border-gray-100">
                <h3 className="text-base sm:text-lg font-extrabold text-[#1A2A49] flex items-center gap-2">
                  <Navigation size={18} className="text-[#F37021]" /> Engineer
                  Shift Attendance, Work Output & Live Location Matrix
                </h3>
                <p className="text-xs text-gray-500">
                  Real-time summary of when each engineer logged in, when they
                  logged out, how many jobs they completed, and their last
                  captured GPS coordinates.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#F4F6F9] text-[#1A2A49] uppercase font-extrabold border-b border-gray-200">
                      <th className="p-3 rounded-tl-xl">Engineer</th>
                      <th className="p-3">Duty Status</th>
                      <th className="p-3">Last Login Time</th>
                      <th className="p-3">Last Logout Time</th>
                      <th className="p-3">Work Done / Wallet</th>
                      <th className="p-3">Live Captured GPS</th>
                      <th className="p-3 rounded-tr-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(engineersList || []).map((eng) => {
                      const activeCount = (requests || []).filter(
                        (r) =>
                          r.assignedEngineerId === eng.id &&
                          !["COMPLETED", "CANCELLED"].includes(r.status)
                      ).length;

                      return (
                        <tr key={eng.id} className="hover:bg-slate-50">
                          <td className="p-3">
                            <div className="font-extrabold text-[#1A2A49]">
                              {eng.name}
                            </div>
                            <div className="font-mono text-[11px] text-gray-500">
                              {eng.id} • {eng.phone}
                            </div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                                eng.isOnline || eng.onDuty
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {eng.isOnline || eng.onDuty
                                ? "🟢 ON DUTY"
                                : "⚪ OFF DUTY"}
                            </span>
                            {(eng.shiftChecklist ||
                              eng.shiftChecklistVerified) && (
                              <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                                ✓ Uniform & Kit Verified
                              </div>
                            )}
                          </td>
                          <td className="p-3 font-mono font-semibold text-emerald-700">
                            {formatDateTime(eng.lastLoginAt)}
                          </td>
                          <td className="p-3 font-mono font-semibold text-amber-700">
                            {formatDateTime(eng.lastLogoutAt)}
                          </td>
                          <td className="p-3">
                            <div className="font-extrabold text-[#1A2A49]">
                              {eng.completedCount || 0} Completed •{" "}
                              {activeCount} Active
                            </div>
                            <div className="text-[11px] font-bold text-emerald-700">
                              Wallet: ₹{eng.walletBalance || 0}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-mono font-bold text-[#1A2A49]">
                              {eng.lastLat && eng.lastLng
                                ? `${eng.lastLat}, ${eng.lastLng}`
                                : "28.6415, 77.3714"}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              {eng.lastLocationLabel || eng.area}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1.5">
                              <button
                                onClick={() => pingEngineerLiveLocation(eng.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#1A2A49] hover:bg-[#223a61] text-white text-[11px] font-bold flex items-center gap-1"
                              >
                                <Navigation size={11} /> Ping GPS
                              </button>
                              <button
                                onClick={() =>
                                  handleSimulateAntiBypassAlert(eng)
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold"
                                title="Simulate Unbooked Repeat Visit Alert"
                              >
                                Test Radar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Second-by-Second Blackbox Telemetry Stream */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#1A2A49] flex items-center gap-2">
                    <Activity size={18} className="text-[#F37021]" /> Engineer
                    Blackbox Activity & GPS Telemetry Stream (
                    {filteredTelemetryLogs.length})
                  </h3>
                  <p className="text-xs text-gray-500">
                    Immutable chronological log of every engineer operation with
                    captured GPS coordinates.
                  </p>
                </div>

                <select
                  value={telemetryFilterEng}
                  onChange={(e) => setTelemetryFilterEng(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-[#F4F6F9] border border-gray-200 text-xs font-extrabold text-[#1A2A49]"
                >
                  <option value="ALL">All Engineers</option>
                  {(engineersList || []).map((eng) => (
                    <option key={eng.id} value={eng.id}>
                      {eng.id} — {eng.name}
                    </option>
                  ))}
                </select>
              </div>

              {filteredTelemetryLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500 bg-[#F4F6F9] rounded-2xl">
                  No engineer telemetry events recorded yet. Log in as an
                  engineer on <code>/engineer</code> or click &ldquo;Ping
                  GPS&rdquo; above to capture live telemetry.
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {filteredTelemetryLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-2xl bg-[#F4F6F9] border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-extrabold px-2 py-0.5 rounded bg-[#1A2A49] text-white text-[10px]">
                            {log.engineerId} • {log.engineerName}
                          </span>
                          <span
                            className={`font-mono font-extrabold px-2 py-0.5 rounded text-[10px] ${
                              String(log.eventType).includes("ALERT") ||
                              String(log.eventType).includes("WRONG") ||
                              String(log.eventType).includes("BLOCKED")
                                ? "bg-red-100 text-red-700"
                                : String(log.eventType).includes("LOGIN") ||
                                  String(log.eventType).includes("COMPLETED")
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-orange-100 text-[#F37021]"
                            }`}
                          >
                            {log.eventType}
                          </span>
                          {log.requestId && (
                            <span className="font-mono text-[11px] font-bold text-[#1A2A49]">
                              Booking #{log.requestId}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 font-medium">
                          {log.details}
                        </p>
                      </div>

                      <div className="sm:text-right shrink-0 font-mono text-[11px] text-gray-500">
                        <div className="font-bold text-[#1A2A49]">
                          📍 {log.lat}, {log.lng}
                        </div>
                        <div>{log.locationLabel}</div>
                        <div>{formatDateTime(log.timestamp)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 4: PAYMENT GATEWAY LEDGER ================= */}
        {activeTab === "payments" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-extrabold text-[#1A2A49]">
                  SQL Payment Gateway Ledger (`payment_transactions`)
                </h2>
                <p className="text-xs text-gray-500">
                  Real-time ledger of all customer bookings, UPI/Card checkouts,
                  and spare part settlements.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200 w-fit">
                Total Volume: ₹{totalRevenue}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#F4F6F9] text-[#1A2A49] uppercase font-extrabold border-b border-gray-200">
                    <th className="p-3 rounded-tl-xl">Transaction ID</th>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Method & Channel</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 rounded-tr-xl">Notes / Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(paymentTransactions || []).map((tx) => (
                    <tr
                      key={tx.transactionId || tx.txnId}
                      className="hover:bg-slate-50"
                    >
                      <td className="p-3 font-mono font-extrabold text-[#1A2A49]">
                        {tx.transactionId || tx.txnId}
                      </td>
                      <td className="p-3 font-mono text-gray-600">
                        #{tx.requestId || tx.bookingId}
                      </td>
                      <td className="p-3 font-semibold text-[#1A2A49]">
                        {tx.customerName || tx.userName}
                        <div className="text-[11px] text-gray-400 font-normal">
                          {tx.customerPhone || tx.userPhone}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-[#1A2A49]">
                          {tx.paymentMethod}
                        </span>
                        <div className="text-[11px] text-gray-500">
                          {tx.paymentChannel}
                        </div>
                      </td>
                      <td className="p-3 font-extrabold text-sm text-[#1A2A49]">
                        ₹{tx.amount}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                            tx.status === "SETTLED" || tx.status === "SUCCESS"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">
                        <div>{tx.notes || tx.serviceName}</div>
                        <div className="text-[10px] text-gray-400">
                          {tx.createdAt
                            ? new Date(tx.createdAt).toLocaleString()
                            : ""}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 5: ORDER HISTORY & AUDIT LOGS ================= */}
        {activeTab === "history" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-extrabold text-[#1A2A49]">
                Master Order History & Cross-Portal Audit Stream (
                `order_history_logs`)
              </h2>
              <p className="text-xs text-gray-500">
                Every action by Customer, Admin Desk, and Field Engineer is
                logged chronologically in SQL.
              </p>
            </div>

            <div className="space-y-2.5">
              {(orderHistoryLogs || []).map((log) => (
                <div
                  key={log.id || log.logId}
                  className="p-4 rounded-2xl bg-[#F4F6F9] border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
                          log.actorRole === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : log.actorRole === "ENGINEER"
                            ? "bg-orange-100 text-[#F37021]"
                            : "bg-blue-100 text-[#1A2A49]"
                        }`}
                      >
                        {log.actorRole} • {log.actorName}
                      </span>
                      <span className="font-mono text-xs font-extrabold text-[#1A2A49]">
                        Order #{log.requestId || log.bookingId}
                      </span>
                      <span className="text-xs font-extrabold text-[#1A2A49]">
                        {log.actionTitle || log.action}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{log.details}</p>
                  </div>
                  <span className="text-[11px] font-mono text-gray-500 shrink-0">
                    {log.createdAt
                      ? new Date(log.createdAt).toLocaleString()
                      : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: SQL DATABASE EXPLORER ================= */}
        {activeTab === "sql" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-extrabold text-[#1A2A49] flex items-center gap-2">
                  <Database size={18} className="text-[#F37021]" /> Live SQL
                  Database Console (`pluggy_sql_relational_db_v2`)
                </h2>
                <p className="text-xs text-gray-500">
                  Inspect relational tables (`engineers`, `service_requests`,
                  `payment_transactions`, `order_history_logs`, `users`).
                </p>
              </div>
              <button
                onClick={resetDemoSqlDatabase}
                className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 w-fit"
              >
                <RotateCcw size={14} /> Reset Seed SQL Database
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                {
                  label: "SELECT * FROM engineers",
                  q: "SELECT * FROM engineers",
                },
                {
                  label: "SELECT * FROM service_requests",
                  q: "SELECT * FROM service_requests",
                },
                {
                  label: "SELECT * FROM payment_transactions",
                  q: "SELECT * FROM payment_transactions",
                },
                {
                  label: "SELECT * FROM order_history_logs",
                  q: "SELECT * FROM order_history_logs",
                },
                { label: "SELECT * FROM users", q: "SELECT * FROM users" },
              ].map((preset) => (
                <button
                  key={preset.q}
                  onClick={() => handleRunSql(preset.q)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition ${
                    sqlInput === preset.q
                      ? "bg-[#1A2A49] text-white border-[#1A2A49]"
                      : "bg-[#F4F6F9] text-[#1A2A49] border-gray-200 hover:border-[#F37021]"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={sqlInput}
                onChange={(e) => setSqlInput(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-[#0F172A] text-emerald-400 font-mono text-xs sm:text-sm border border-slate-700 focus:outline-none"
              />
              <button
                onClick={() => handleRunSql(sqlInput)}
                className="px-5 py-3 rounded-xl bg-[#F37021] hover:bg-[#e05e15] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shrink-0"
              >
                <Play size={15} /> Execute SQL
              </button>
            </div>

            {sqlResult && (
              <div className="rounded-2xl border border-gray-200 overflow-hidden">
                <div className="bg-[#F4F6F9] px-4 py-2.5 border-b border-gray-200 flex items-center justify-between text-xs font-bold text-[#1A2A49]">
                  <span>
                    Table:{" "}
                    <code className="text-[#F37021]">
                      {sqlResult.table || "query"}
                    </code>
                  </span>
                  <span>{sqlResult.rowCount || 0} rows returned</span>
                </div>
                <div className="max-h-96 overflow-auto bg-[#0F172A] text-slate-200 p-4 font-mono text-xs">
                  <pre>
                    {JSON.stringify(sqlResult.rows || sqlResult, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= EDIT ENGINEER MODAL ================= */}
      <AnimatePresence>
        {editingEng && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setEditingEng(null)}
          >
            <motion.form
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSaveEngineerEdit}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F37021]">
                    Admin Engineer Editor
                  </span>
                  <h3 className="text-lg font-extrabold text-[#1A2A49]">
                    Edit Engineer {editingEng.id}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingEng(null)}
                  className="p-1.5 rounded-full hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editingEng.name}
                  onChange={(e) =>
                    setEditingEng({ ...editingEng, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={editingEng.phone}
                    onChange={(e) =>
                      setEditingEng({ ...editingEng, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Login Password
                  </label>
                  <input
                    type="text"
                    value={editingEng.password || "eng123"}
                    onChange={(e) =>
                      setEditingEng({ ...editingEng, password: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-mono font-bold text-[#F37021]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  value={editingEng.specialization || ""}
                  onChange={(e) =>
                    setEditingEng({
                      ...editingEng,
                      specialization: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Service Zone / Area
                </label>
                <input
                  type="text"
                  value={editingEng.area || ""}
                  onChange={(e) =>
                    setEditingEng({ ...editingEng, area: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEng(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#1A2A49] hover:bg-[#223a61] text-white text-xs font-extrabold"
                >
                  Save Changes to SQL
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
