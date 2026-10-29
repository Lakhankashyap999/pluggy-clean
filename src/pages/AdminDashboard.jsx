// src/pages/AdminDashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import { motion } from "framer-motion";
import {
  Wrench,
  UserCheck,
  CheckCircle2,
  MapPin,
  Plus,
  Home,
  Users,
  ClipboardCheck,
  Database,
  CreditCard,
  History,
  Play,
  RotateCcw,
  ArrowRight,
  Zap,
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
    requests,
    engineersList,
    usersList,
    paymentTransactions,
    orderHistoryLogs,
    verifyByExecutive,
    assignEngineer,
    registerNewEngineer,
    executeSql,
    resetDemoSqlDatabase,
    loginEngineer,
  } = useApp();

  const [activeTab, setActiveTab] = useState("dispatch"); // dispatch | payments | history | sql | fleet
  const [selectedKits, setSelectedKits] = useState({});
  const [execNotes, setExecNotes] = useState({});
  const [selectedEngIds, setSelectedEngIds] = useState({});

  // SQL Explorer state
  const [sqlInput, setSqlInput] = useState("SELECT * FROM service_requests");
  const [sqlResult, setSqlResult] = useState(null);

  // New Engineer Form
  const [newEng, setNewEng] = useState({
    id: "",
    name: "",
    phone: "",
    specialization: "AC & Electrical Master Tech",
  });

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
    const note =
      execNotes[req.id] || "Customer address & fault verified via phone call.";
    verifyByExecutive(req.id, note, kit);
  };

  const handleDispatchEngineer = (req) => {
    const engId =
      selectedEngIds[req.id] ||
      req.assignedEngineerId ||
      engineersList?.[0]?.id;
    const engObj =
      (engineersList || []).find((e) => e.id === engId) || engineersList?.[0];
    if (!engObj) {
      toast.error("No engineer available");
      return;
    }
    assignEngineer(req.id, engObj.id, engObj.name);
  };

  // 1-Click Fast Verify + Dispatch + Open Engineer Portal
  const handleOneClickVerifyAndDispatch = (req, openPortal = false) => {
    const kit = selectedKits[req.id] || req.requiredKit || TOOLKIT_PRESETS[0];
    if (req.status === "PENDING_EXECUTIVE") {
      verifyByExecutive(
        req.id,
        "Fast-track verified by Admin Control Desk.",
        kit
      );
    }
    const engId =
      selectedEngIds[req.id] ||
      req.assignedEngineerId ||
      engineersList?.[0]?.id;
    const engObj =
      (engineersList || []).find((e) => e.id === engId) || engineersList?.[0];
    if (engObj) {
      assignEngineer(req.id, engObj.id, engObj.name);
      loginEngineer(engObj);
      if (openPortal) {
        navigate("/engineer");
      }
    }
  };

  const handleRunSql = (queryToRun) => {
    const q = queryToRun || sqlInput;
    setSqlInput(q);
    const res = executeSql(q);
    setSqlResult(res);
  };

  const handleAddEngineer = (e) => {
    e.preventDefault();
    if (!newEng.id.trim() || !newEng.name.trim()) {
      toast.error("Please enter Engineer ID & Name");
      return;
    }
    registerNewEngineer(newEng);
    setNewEng({
      id: "",
      name: "",
      phone: "",
      specialization: "AC & Electrical Master Tech",
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] pt-[92px] md:pt-[112px] pb-20 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white rounded-3xl p-5 sm:p-6 mb-6 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#F37021] text-white text-[10px] font-extrabold uppercase tracking-wider">
                  Pluggy 24/7 Operations & SQL HQ
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                  <Database size={11} /> Relational SQL Sync Active
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold">
                Executive Dispatch, Payment Ledger & SQL Control Desk
              </h1>
              <p className="text-white/75 text-xs sm:text-sm mt-0.5">
                Verify customer requests, assign toolkits, dispatch engineers (`ENG001`–`ENG004`), and inspect live SQL tables.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => navigate("/track")}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5"
              >
                👤 Step 1: Customer Orders
              </button>
              <button
                onClick={() => navigate("/engineer")}
                className="px-3.5 py-2 rounded-xl bg-[#F37021] hover:bg-[#e05e15] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm"
              >
                <Wrench size={14} /> Step 3: Engineer Terminal <ArrowRight size={13} />
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Home size={14} /> Storefront
              </button>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/15">
              <p className="text-2xl font-extrabold text-amber-300">
                {pendingVerificationCount}
              </p>
              <p className="text-xs text-white/80">
                Awaiting Executive Verification
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/15">
              <p className="text-2xl font-extrabold text-emerald-300">
                {(paymentTransactions || []).length}
              </p>
              <p className="text-xs text-white/80">
                SQL Payment Gateway Records
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/15">
              <p className="text-2xl font-extrabold text-blue-200">
                {(orderHistoryLogs || []).length}
              </p>
              <p className="text-xs text-white/80">
                Order History Audit Logs
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/15">
              <p className="text-2xl font-extrabold text-white">
                ₹{totalRevenue}{" "}
                <span className="text-xs font-normal text-amber-300">
                  (20% Net: ₹{platformCommission})
                </span>
              </p>
              <p className="text-xs text-white/80">Escrow Gross Volume</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-5">
          <button
            onClick={() => setActiveTab("dispatch")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === "dispatch"
                ? "bg-[#1A2A49] text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#F37021]"
            }`}
          >
            <ClipboardCheck size={16} /> 1. Dispatch Queue ({requests?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === "payments"
                ? "bg-[#F37021] text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#F37021]"
            }`}
          >
            <CreditCard size={16} /> 2. Payment Gateway Ledger (
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
            <History size={16} /> 3. Order History Logs (
            {orderHistoryLogs?.length || 0})
          </button>

          <button
            onClick={() => {
              setActiveTab("sql");
              if (!sqlResult) handleRunSql("SELECT * FROM service_requests");
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === "sql"
                ? "bg-emerald-700 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#F37021]"
            }`}
          >
            <Database size={16} /> 4. SQL Database Explorer
          </button>

          <button
            onClick={() => setActiveTab("fleet")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === "fleet"
                ? "bg-[#1A2A49] text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-[#F37021]"
            }`}
          >
            <Users size={16} /> 5. Engineer Fleet ({engineersList?.length || 0})
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
                        Pay: {req.paymentMethod || "UPI"} ({req.paymentStatus || "ESCROW_HELD"})
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
                      {req.status !== "COMPLETED" && req.status !== "CANCELLED" && (
                        <button
                          onClick={() => handleOneClickVerifyAndDispatch(req, true)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1 shadow-sm"
                        >
                          <Zap size={13} /> 1-Click Dispatch & Open Engineer View →
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Customer & Fault Info */}
                    <div className="lg:col-span-5 space-y-1">
                      <h3 className="font-extrabold text-base text-[#1A2A49]">
                        {req.service}
                      </h3>
                      <p className="text-xs text-gray-600">
                        <strong>Customer:</strong> {req.userName || "Customer"} (
                        {req.userPhone || "+91 9876543210"})
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
                        <CheckCircle2 size={14} />{" "}
                        {req.executiveVerified
                          ? "✓ Verified (Update Toolkit)"
                          : "Verify Booking & Lock Toolkit"}
                      </button>
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
                          setSelectedEngIds((prev) => ({
                            ...prev,
                            [req.id]: e.target.value,
                          }))
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
                        {req.assignedEngineer
                          ? `Assigned: ${req.assignedEngineer}`
                          : "Assign & Dispatch"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* ================= TAB 2: PAYMENT GATEWAY LEDGER ================= */}
        {activeTab === "payments" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-extrabold text-[#1A2A49]">
                  SQL Payment Gateway Ledger (`payment_transactions`)
                </h2>
                <p className="text-xs text-gray-500">
                  Real-time ledger of all customer bookings, UPI/Card checkouts, and spare part settlements.
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
                    <tr key={tx.transactionId} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-extrabold text-[#1A2A49]">
                        {tx.transactionId}
                      </td>
                      <td className="p-3 font-mono text-gray-600">
                        #{tx.requestId}
                      </td>
                      <td className="p-3 font-semibold text-[#1A2A49]">
                        {tx.customerName}
                        <div className="text-[11px] text-gray-400 font-normal">
                          {tx.customerPhone}
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
                        <div>{tx.notes}</div>
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

        {/* ================= TAB 3: ORDER HISTORY & AUDIT LOGS ================= */}
        {activeTab === "history" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h2 className="text-lg font-extrabold text-[#1A2A49]">
                Master Order History & Cross-Portal Audit Stream (`order_history_logs`)
              </h2>
              <p className="text-xs text-gray-500">
                Every action by Customer, Admin Desk, and Field Engineer is logged chronologically in SQL.
              </p>
            </div>

            <div className="space-y-2.5">
              {(orderHistoryLogs || []).map((log) => (
                <div
                  key={log.id}
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
                        Order #{log.requestId}
                      </span>
                      <span className="text-xs font-extrabold text-[#1A2A49]">
                        {log.actionTitle}
                      </span>
                      {log.newStatus && (
                        <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-600">
                          {log.previousStatus || "NEW"} → {log.newStatus}
                        </span>
                      )}
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

        {/* ================= TAB 4: SQL DATABASE EXPLORER ================= */}
        {activeTab === "sql" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-extrabold text-[#1A2A49] flex items-center gap-2">
                  <Database size={18} className="text-[#F37021]" /> Live SQL Database Console (`pluggy_sql_db_v2`)
                </h2>
                <p className="text-xs text-gray-500">
                  Inspect relational tables (`service_requests`, `payment_transactions`, `order_history_logs`, `engineers`, `users`).
                </p>
              </div>
              <button
                onClick={resetDemoSqlDatabase}
                className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5 w-fit"
              >
                <RotateCcw size={14} /> Reset Seed SQL Database
              </button>
            </div>

            {/* Preset SQL Table Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
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
                {
                  label: "SELECT * FROM engineers",
                  q: "SELECT * FROM engineers",
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

            {/* SQL Query Runner Input */}
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

            {/* Query Result Viewer */}
            {sqlResult && (
              <div className="rounded-2xl border border-gray-200 overflow-hidden">
                <div className="bg-[#F4F6F9] px-4 py-2.5 border-b border-gray-200 flex items-center justify-between text-xs font-bold text-[#1A2A49]">
                  <span>
                    Table: <code className="text-[#F37021]">{sqlResult.table || "query"}</code>
                  </span>
                  <span>{sqlResult.rowCount || 0} rows returned</span>
                </div>
                <div className="max-h-96 overflow-auto bg-[#0F172A] text-slate-200 p-4 font-mono text-xs">
                  <pre>{JSON.stringify(sqlResult.rows || sqlResult, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 5: ENGINEER FLEET & ONBOARDING ================= */}
        {activeTab === "fleet" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-3">
              {(engineersList || []).map((eng) => (
                <div
                  key={eng.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#1A2A49] text-white font-extrabold flex items-center justify-center text-sm">
                      {eng.id}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm sm:text-base text-[#1A2A49]">
                          {eng.name}
                        </h4>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F4F6F9] text-[#1A2A49] font-bold">
                          {eng.zone || "Central Zone"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {eng.specialty || eng.specialization} • 📞 {eng.phone}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      ⭐ {eng.rating} ({eng.completedJobsCount || eng.jobsCompleted || 0} Jobs)
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
                  <Plus size={18} className="text-[#F37021]" /> Onboard New SQL Engineer
                </h3>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Partner ID (e.g. ENG005)
                  </label>
                  <input
                    type="text"
                    placeholder="ENG005"
                    value={newEng.id}
                    onChange={(e) =>
                      setNewEng({ ...newEng, id: e.target.value.toUpperCase() })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Manoj Tiwari"
                    value={newEng.name}
                    onChange={(e) =>
                      setNewEng({ ...newEng, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 12345"
                    value={newEng.phone}
                    onChange={(e) =>
                      setNewEng({ ...newEng, phone: e.target.value })
                    }
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
                    onChange={(e) =>
                      setNewEng({ ...newEng, specialization: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#F37021] hover:bg-[#e05e15] text-white rounded-xl font-extrabold text-xs sm:text-sm shadow-md"
                >
                  Save Engineer to SQL Database
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
