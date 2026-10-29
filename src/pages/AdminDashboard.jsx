// src/pages/AdminDashboard.jsx
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useApp } from "../AppContext";
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
  KeyRound,
  ShieldAlert,
  X,
  Eye,
  EyeOff,
  Ban,
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
  } = useApp();

  const [activeTab, setActiveTab] = useState("dispatch"); // dispatch | fleet | payments | history | sql
  const [selectedKits, setSelectedKits] = useState({});
  const [selectedEngIds, setSelectedEngIds] = useState({});
  const [showPasswords, setShowPasswords] = useState({});

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

  return (
    <div className="min-h-screen bg-[#F4F6F9] pb-20 font-inter">
      {/* ================= DEDICATED ADMIN COMMAND TOP HEADER ================= */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#0F172A] via-[#1A2A49] to-[#223a61] text-white shadow-lg border-b-2 border-[#F37021]">
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
                </div>
                <h1 className="text-lg sm:text-xl font-extrabold mt-0.5">
                  {admin.name}
                </h1>
                <p className="text-blue-200 text-xs">
                  Central Dispatch • Engineer ID & Access Management • Escrow
                  Payment Ledger
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab("fleet")}
                className="px-3.5 py-2 rounded-xl bg-[#F37021] hover:bg-[#e05e15] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Users size={14} /> Manage Engineers & Create ID (
                {engineersList?.length || 0})
              </button>
              <button
                onClick={() => {
                  logoutAdmin();
                  toast.success("Logged out of Admin Control Desk");
                  navigate("/admin-login", { replace: true });
                }}
                className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>

          {/* Admin KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-white/10">
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
                {(engineersList || []).length}
              </p>
              <p className="text-xs text-white/80">
                Registered SQL Engineers (IDs)
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
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/15">
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
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
          <button
            onClick={() => setActiveTab("dispatch")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === "dispatch"
                ? "bg-[#1A2A49] text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#F37021]"
            }`}
          >
            <ClipboardCheck size={16} /> 1. Customer Requests & Dispatch (
            {requests?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("fleet")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === "fleet"
                ? "bg-[#F37021] text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#F37021]"
            }`}
          >
            <Users size={16} /> 2. Engineer Fleet, Edit & Create ID (
            {engineersList?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === "payments"
                ? "bg-[#1A2A49] text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#F37021]"
            }`}
          >
            <CreditCard size={16} /> 3. Payment Gateway Ledger (
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
            <History size={16} /> 4. Order History Logs (
            {orderHistoryLogs?.length || 0})
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
            <Database size={16} /> 5. SQL Database Explorer
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
                  className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200/90 space-y-4"
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
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-lg font-extrabold text-[#1A2A49]">
                        ₹{req.amount || 0}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Customer & Fault Info */}
                    <div className="lg:col-span-5 space-y-1">
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
                    </div>

                    {/* Executive Verification & Toolkit Assignment */}
                    <div className="lg:col-span-4 space-y-2 bg-[#F4F6F9] p-3.5 rounded-2xl">
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
                    <div className="lg:col-span-3 space-y-2 bg-[#F4F6F9] p-3.5 rounded-2xl">
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
                              {eng.id}: {eng.name}
                            </option>
                          ))}
                      </select>

                      <button
                        onClick={() => handleDispatchEngineer(req)}
                        className="w-full py-2 bg-[#F37021] hover:bg-[#e05e15] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5"
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

        {/* ================= TAB 2: ENGINEER FLEET, EDIT & CREATE NEW ID ================= */}
        {activeTab === "fleet" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: All Engineers List with Edit, Password View, Suspend & Delete */}
            <div className="lg:col-span-7 space-y-3.5">
              <div className="bg-white rounded-2xl p-4 border border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-[#1A2A49]">
                    Registered SQL Engineers ({engineersList?.length || 0})
                  </h2>
                  <p className="text-xs text-gray-500">
                    Admin has full control to view credentials, edit details, reset passwords, or suspend any Engineer ID.
                  </p>
                </div>
              </div>

              {(engineersList || []).map((eng) => {
                const assignedJobs = (requests || []).filter(
                  (r) =>
                    r.assignedEngineerId === eng.id &&
                    !["COMPLETED", "CANCELLED"].includes(r.status)
                );
                const isPassVisible = showPasswords[eng.id];

                return (
                  <motion.div
                    key={eng.id}
                    layout
                    className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200 space-y-3"
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

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingEng({ ...eng })}
                          className="px-3 py-1.5 rounded-xl bg-[#1A2A49] hover:bg-[#223a61] text-white text-xs font-bold flex items-center gap-1"
                        >
                          <Edit3 size={13} /> Edit / Reset Pass
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

                    {/* Credentials & Wallet Info Bar */}
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
                          WALLET / JOBS
                        </span>
                        <span className="font-extrabold text-emerald-700">
                          ₹{eng.walletBalance || 0} ({eng.completedCount || 0})
                        </span>
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
                    Create a new Engineer account in the SQL database. The engineer can immediately log in on <code>/engineer-login</code> using these credentials.
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

        {/* ================= TAB 3: PAYMENT GATEWAY LEDGER ================= */}
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

        {/* ================= TAB 4: ORDER HISTORY & AUDIT LOGS ================= */}
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

        {/* ================= TAB 5: SQL DATABASE EXPLORER ================= */}
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
