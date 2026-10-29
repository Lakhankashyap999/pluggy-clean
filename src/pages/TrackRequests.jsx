// src/pages/TrackRequests.jsx
import { useState, useMemo } from "react"
import { useApp } from "../AppContext"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  PackageSearch,
  User,
  Wrench,
  CheckCircle2,
  Phone,
  MapPin,
  Star,
  FileText,
  XCircle,
  ChevronDown,
  ChevronUp,
  Search,
  AlertCircle,
  MessageCircle,
  Copy,
  Check,
  Sparkles,
  Home,
  X,
  ShieldCheck,
  KeyRound,
  RefreshCw,
  QrCode,
  AlertTriangle,
  Database,
  CreditCard,
  History,
  ArrowRight,
} from "lucide-react"
import BackButton from "../components/BackButton"
import PaymentPopup from "../components/PaymentPopup"
import toast from "react-hot-toast"

export default function TrackRequests() {
  const navigate = useNavigate()
  const {
    requests,
    user,
    cancelRequest,
    rateRequest,
    respondToSparePartQuote,
    claimWarrantyRevisit,
    paymentTransactions,
    orderHistoryLogs,
  } = useApp()

  const [activeMainTab, setActiveMainTab] = useState("bookings") // "bookings" | "payments" | "history"
  const [sparePaymentPart, setSparePaymentPart] = useState(null) // { requestId, part }

  const [filterStatus, setFilterStatus] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(null)
  const [showRateModal, setShowRateModal] = useState(null)
  const [ratingValue, setRatingValue] = useState(5)
  const [reviewText, setReviewText] = useState("")
  const [showInvoiceModal, setShowInvoiceModal] = useState(null)

  const statusConfig = {
    PENDING_EXECUTIVE: {
      label: "Executive Verifying",
      icon: AlertCircle,
      color: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
      gradient: "from-amber-500 to-orange-500",
      progress: 20,
      description: "Control Desk verifying fault & assigning toolkit",
    },
    EXECUTIVE_VERIFIED: {
      label: "Verified & Dispatching",
      icon: CheckCircle2,
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
      gradient: "from-[#1A2A49] to-[#223a61]",
      progress: 40,
      description: "Matching nearest background-verified engineer",
    },
    ENGINEER_ASSIGNED: {
      label: "Engineer En-Route",
      icon: User,
      color: "text-indigo-700",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      gradient: "from-[#1A2A49] to-[#F37021]",
      progress: 65,
      description: "Share 4-Digit Start PIN on arrival",
    },
    IN_PROGRESS: {
      label: "Repair In Progress",
      icon: Wrench,
      color: "text-[#F37021]",
      bg: "bg-orange-50",
      border: "border-orange-200",
      gradient: "from-[#F37021] to-[#FF8C42]",
      progress: 85,
      description: "Job started • Share Happy PIN after satisfaction",
    },
    COMPLETED: {
      label: "Completed • Under Warranty",
      icon: CheckCircle2,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      gradient: "from-emerald-600 to-teal-600",
      progress: 100,
      description: "30-Day QR Warranty Active",
    },
    CANCELLED: {
      label: "Cancelled",
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200",
      gradient: "from-rose-500 to-red-600",
      progress: 0,
      description: "Booking cancelled",
    },
  }

  const bookingModeBadge = {
    SOS_15MIN: { label: "🚨 15-Min Emergency SOS", cls: "bg-red-600 text-white" },
    EVENT_STANDBY: { label: "🎪 Function Standby Guard", cls: "bg-[#F37021] text-white" },
    VIDEO_DIAGNOSIS: { label: "📹 ₹29 Video Diagnosis", cls: "bg-[#1A2A49] text-white" },
    VOICE_PHOTO: { label: "🎙️ Voice / Photo Booking", cls: "bg-emerald-600 text-white" },
    WARRANTY_CLAIM: { label: "🛡️ ₹0 Warranty Re-Visit", cls: "bg-teal-700 text-white" },
  }

  const filteredRequests = useMemo(() => {
    return (requests || [])
      .filter((r) => (filterStatus === "All" ? true : r.status === filterStatus))
      .filter((r) => {
        const query = searchQuery.toLowerCase()
        return (
          r.service?.toLowerCase().includes(query) ||
          r.id?.toString().includes(query) ||
          r.transactionId?.toLowerCase().includes(query)
        )
      })
      .sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id))
  }, [requests, filterStatus, searchQuery])

  const activeCount = (requests || []).filter(
    (r) => !["COMPLETED", "CANCELLED"].includes(r.status)
  ).length
  const completedCount = (requests || []).filter((r) => r.status === "COMPLETED").length

  const canCancel = (status) => {
    return ["PENDING_EXECUTIVE", "EXECUTIVE_VERIFIED", "ENGINEER_ASSIGNED"].includes(status)
  }

  const confirmCancel = () => {
    if (showCancelModal) {
      cancelRequest(showCancelModal.id, "Cancelled by customer")
      toast.success("Request cancelled")
      setShowCancelModal(null)
      setExpandedId(null)
    }
  }

  const handleSubmitRating = (e) => {
    e.preventDefault()
    if (!showRateModal) return
    rateRequest(showRateModal.id, ratingValue, reviewText)
    toast.success("Thank you for rating your Pluggy experience!")
    setShowRateModal(null)
    setReviewText("")
    setRatingValue(5)
  }

  const copyBookingId = (id) => {
    navigator.clipboard?.writeText(id)
    setCopiedId(id)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getWarrantyDaysLeft = (warrantyValidTill) => {
    if (!warrantyValidTill) return 30
    const diff = new Date(warrantyValidTill).getTime() - Date.now()
    return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)))
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] pt-[92px] md:pt-[112px] pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <BackButton />
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A2A49]">
                Track Live Bookings & Digital Warranty
              </h1>
              <p className="text-xs text-gray-500">
                Dual-PIN Verification • Live Spare Part Quotes • 30-Day QR Appliance Health Cards
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate("/admin")}
              className="px-3.5 py-2 rounded-xl bg-[#1A2A49] text-white text-xs font-bold hover:bg-[#223a61] shadow-sm flex items-center gap-1.5"
            >
              🛡️ Step 2: Admin Desk <ArrowRight size={13} />
            </button>
            <button
              onClick={() => navigate("/engineer")}
              className="px-3.5 py-2 rounded-xl bg-[#F37021] text-white text-xs font-bold hover:bg-[#e05e15] shadow-sm flex items-center gap-1.5"
            >
              👨‍🔧 Step 3: Engineer Portal <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Interactive A-to-Z Real-Time SQL Workflow Guide Banner */}
        <div className="bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white rounded-2xl p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F37021] text-white flex items-center justify-center shrink-0">
              <Database size={18} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold">
                Live SQL Database Connected (Customer ↔ Admin ↔ Engineer)
              </p>
              <p className="text-[11px] text-blue-200 mt-0.5">
                1. Raise Request → 2. Verify & Assign in <strong>Admin Desk</strong> → 3. Enter Start PIN & Happy PIN in <strong>Engineer Portal</strong>
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold shrink-0 w-fit">
            ● {paymentTransactions?.length || 0} Payments • {orderHistoryLogs?.length || 0} SQL Logs
          </span>
        </div>

        {/* Main Section Switcher Tabs (Bookings vs Payment Gateway Records vs Order History) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5 bg-white p-1.5 rounded-2xl border border-gray-200/80 shadow-sm">
          <button
            onClick={() => setActiveMainTab("bookings")}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
              activeMainTab === "bookings"
                ? "bg-[#1A2A49] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <PackageSearch size={16} /> Live Bookings ({requests?.length || 0})
          </button>
          <button
            onClick={() => setActiveMainTab("payments")}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
              activeMainTab === "payments"
                ? "bg-[#F37021] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <CreditCard size={16} /> Payment Gateway Records ({paymentTransactions?.length || 0})
          </button>
          <button
            onClick={() => setActiveMainTab("history")}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition ${
              activeMainTab === "history"
                ? "bg-[#1A2A49] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <History size={16} /> Order History & SQL Logs ({orderHistoryLogs?.length || 0})
          </button>
        </div>

        {activeMainTab === "payments" && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-200/80 mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-[#1A2A49]">
                  Official Payment Gateway Ledger (SQL Table: payment_transactions)
                </h2>
                <p className="text-xs text-gray-500">
                  Every service booking and approved spare part generates an immutable payment record.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-fit">
                100% Escrow Protected
              </span>
            </div>

            {(paymentTransactions || []).length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">No payment transactions recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {(paymentTransactions || []).map((tx) => (
                  <div
                    key={tx.transactionId}
                    className="p-4 rounded-2xl bg-[#F4F6F9] border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded bg-white text-[#1A2A49] border border-gray-200">
                          {tx.transactionId}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1A2A49]">
                          {tx.paymentMethod} • {tx.paymentChannel}
                        </span>
                        <span
                          className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            tx.status === "SETTLED" || tx.status === "SUCCESS"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#1A2A49] mt-1">
                        {tx.notes || "Doorstep Service Booking Payment"}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Customer: {tx.customerName} ({tx.customerPhone}) • Order ID: #{tx.requestId} •{" "}
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "Just now"}
                      </p>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <span className="text-lg font-extrabold text-[#1A2A49]">₹{tx.amount}</span>
                      <button
                        onClick={() => copyBookingId(tx.transactionId)}
                        className="text-[11px] font-bold text-[#F37021] hover:underline flex items-center gap-1"
                      >
                        <Copy size={12} /> Copy Receipt ID
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeMainTab === "history" && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-200/80 mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-[#1A2A49]">
                  Chronological Order History & Audit Trail (SQL Table: order_history_logs)
                </h2>
                <p className="text-xs text-gray-500">
                  Real-time log of every action across Customer, Admin Desk, and Field Engineer portals.
                </p>
              </div>
            </div>

            {(orderHistoryLogs || []).length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">No order history logs yet.</p>
            ) : (
              <div className="space-y-2.5">
                {(orderHistoryLogs || []).map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-[#F4F6F9] border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            log.actorRole === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : log.actorRole === "ENGINEER"
                              ? "bg-orange-100 text-[#F37021]"
                              : "bg-blue-100 text-[#1A2A49]"
                          }`}
                        >
                          {log.actorRole}: {log.actorName}
                        </span>
                        <span className="font-mono text-xs font-bold text-gray-600">
                          Order #{log.requestId}
                        </span>
                        <span className="text-xs font-extrabold text-[#1A2A49]">
                          {log.actionTitle}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{log.details}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-mono text-gray-500">
                        {log.createdAt ? new Date(log.createdAt).toLocaleString() : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Summary KPI Strip */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/80">
            <p className="text-2xl font-extrabold text-[#1A2A49]">{requests?.length || 0}</p>
            <p className="text-xs text-gray-500 font-medium">Total Bookings</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/80">
            <p className="text-2xl font-extrabold text-[#F37021]">{activeCount}</p>
            <p className="text-xs text-gray-500 font-medium">Active / Live</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200/80">
            <p className="text-2xl font-extrabold text-emerald-600">{completedCount}</p>
            <p className="text-xs text-gray-500 font-medium">Under 30-Day Warranty</p>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by service name or Booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#F37021]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              "All",
              "PENDING_EXECUTIVE",
              "ENGINEER_ASSIGNED",
              "IN_PROGRESS",
              "COMPLETED",
            ].map((st) => {
              const cfg = statusConfig[st]
              return (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    filterStatus === st
                      ? "bg-[#1A2A49] text-white shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-[#F37021]"
                  }`}
                >
                  {st === "All" ? "All Bookings" : cfg?.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-200/80">
              <div className="w-16 h-16 bg-[#F4F6F9] rounded-full flex items-center justify-center mx-auto mb-3">
                <PackageSearch size={30} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-extrabold text-[#1A2A49] mb-1">No service requests found</h3>
              <p className="text-gray-500 text-xs sm:text-sm mb-5">
                Book an instant doorstep electrical, AC or appliance repair to track it live here.
              </p>
              <button
                onClick={() => navigate("/services")}
                className="px-6 py-3 bg-[#F37021] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md"
              >
                Explore Services & Book
              </button>
            </div>
          ) : (
            filteredRequests.map((request) => {
              const status = statusConfig[request.status] || statusConfig.PENDING_EXECUTIVE
              const StatusIcon = status.icon
              const isExpanded = expandedId === request.id || !["COMPLETED", "CANCELLED"].includes(request.status)
              const modeBadge = bookingModeBadge[request.bookingMode]
              const pendingSpares = (request.addedSpareParts || []).filter(
                (p) => p.status === "PENDING_APPROVAL"
              )

              return (
                <motion.div
                  key={request.id}
                  layout
                  className="bg-white rounded-3xl shadow-sm border border-gray-200/90 overflow-hidden"
                >
                  {/* Booking Top Header */}
                  <div
                    onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}
                    className="p-5 cursor-pointer hover:bg-gray-50/60 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#F4F6F9] text-[#1A2A49]">
                          #{request.transactionId || `PLG${request.id}`}
                        </span>
                        {modeBadge && (
                          <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg ${modeBadge.cls}`}>
                            {modeBadge.label}
                          </span>
                        )}
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${status.bg} ${status.border} border`}
                        >
                          <StatusIcon size={13} className={status.color} />
                          <span className={`text-xs font-bold ${status.color}`}>{status.label}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <span className="text-lg font-extrabold text-[#1A2A49]">
                          ₹{request.amount || 0}
                        </span>
                        {expandedId === request.id ? (
                          <ChevronUp size={18} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={18} className="text-gray-400" />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base sm:text-lg font-extrabold text-[#1A2A49]">
                          {request.service || "Doorstep Service"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          📍 {request.address || request.userAddress || "Doorstep Address"} • 🗓️{" "}
                          {request.date || "Today"} {request.timeSlot ? `(${request.timeSlot})` : ""}
                        </p>
                      </div>

                      {/* Dual-PIN Quick Pill on Active Bookings */}
                      {!["COMPLETED", "CANCELLED"].includes(request.status) && (
                        <div className="flex items-center gap-2 shrink-0">
                          {request.status !== "IN_PROGRESS" ? (
                            <div className="px-3 py-1.5 rounded-xl bg-[#1A2A49] text-white text-xs flex items-center gap-1.5">
                              <KeyRound size={13} className="text-amber-300" />
                              <span>Start PIN:</span>
                              <strong className="font-mono text-sm tracking-wider text-amber-300">
                                {request.startOtp || "4821"}
                              </strong>
                            </div>
                          ) : (
                            <div className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs flex items-center gap-1.5">
                              <KeyRound size={13} className="text-amber-300" />
                              <span>Happy PIN:</span>
                              <strong className="font-mono text-sm tracking-wider text-amber-300">
                                {request.happyOtp || "9134"}
                              </strong>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                        <span>{status.description}</span>
                        <span className="font-bold text-[#1A2A49]">{status.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${status.gradient}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${status.progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Alert if spare parts quote is waiting for approval */}
                    {pendingSpares.length > 0 && (
                      <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between text-xs text-amber-900 font-bold">
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle size={15} className="text-[#F37021]" />
                          Action Required: Engineer sent {pendingSpares.length} official spare part quote(s) for your approval!
                        </span>
                        <span className="underline">Review Below ↓</span>
                      </div>
                    )}
                  </div>

                  {/* Expanded Body */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100 bg-[#F4F6F9]/60 p-5 space-y-4"
                      >
                        {/* 1. Dual-PIN Verification & Toolkit Strip */}
                        {!["COMPLETED", "CANCELLED"].includes(request.status) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                                  Step 1: Arrival Verification
                                </span>
                                <h4 className="font-bold text-sm text-[#1A2A49] mt-0.5">
                                  4-Digit Start PIN
                                </h4>
                                <p className="text-[11px] text-gray-500">
                                  Share when engineer reaches your door
                                </p>
                              </div>
                              <div className="px-3.5 py-2 rounded-xl bg-[#1A2A49] text-amber-300 font-mono text-lg font-extrabold tracking-widest">
                                {request.startOtp || "4821"}
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-2xl border border-gray-200/80 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                                  Step 2: Completion Sign-Off
                                </span>
                                <h4 className="font-bold text-sm text-[#1A2A49] mt-0.5">
                                  4-Digit Happy PIN
                                </h4>
                                <p className="text-[11px] text-gray-500">
                                  Share ONLY when 100% satisfied
                                </p>
                              </div>
                              <div className="px-3.5 py-2 rounded-xl bg-emerald-700 text-white font-mono text-lg font-extrabold tracking-widest">
                                {request.happyOtp || "9134"}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2. Assigned Engineer + Toolkit + Household Preferences */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="bg-white p-4 rounded-2xl border border-gray-200/80">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-2">
                              Assigned Expert & Toolkit
                            </span>
                            {request.assignedEngineer ? (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1A2A49] to-[#F37021] text-white font-extrabold flex items-center justify-center text-lg">
                                    {request.assignedEngineer.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm text-[#1A2A49]">
                                      {request.assignedEngineer}
                                    </p>
                                    <p className="text-xs text-emerald-700 font-semibold">
                                      🛡️ Police Verified • ⭐ 4.9
                                    </p>
                                  </div>
                                </div>
                                <a
                                  href="tel:+919876543210"
                                  className="px-3 py-2 rounded-xl bg-[#1A2A49] text-white text-xs font-bold flex items-center gap-1.5"
                                >
                                  <Phone size={13} /> Call
                                </a>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-600 font-medium">
                                ⏳ Executive is assigning the closest master technician...
                              </p>
                            )}
                            <div className="mt-3 pt-2.5 border-t border-gray-100 text-xs text-gray-600 flex items-center gap-1.5">
                              <Wrench size={13} className="text-[#F37021]" />
                              <span>
                                <strong>Mandatory Kit:</strong>{" "}
                                {request.requiredKit || "Standard Digital Multimeter & Safety Kit"}
                              </span>
                            </div>
                          </div>

                          <div className="bg-white p-4 rounded-2xl border border-gray-200/80">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-2">
                              Fault Notes & Household Preferences
                            </span>
                            <p className="text-xs text-[#1A2A49] font-semibold mb-2">
                              {request.issue || "Standard Service Inspection & Repair"}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {request.preferences?.pet && (
                                <span className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                                  🐕 Pet at Home
                                </span>
                              )}
                              {request.preferences?.parking && (
                                <span className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
                                  🚗 Parking Available
                                </span>
                              )}
                              {request.preferences?.bringLadder && (
                                <span className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 font-semibold">
                                  🪜 Bring Tall Ladder
                                </span>
                              )}
                              {request.preferences?.callBeforeArrival && (
                                <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                                  📞 Call Before Arrival
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 3. In-App Official Spare Parts Quote Approval Section */}
                        {request.addedSpareParts && request.addedSpareParts.length > 0 && (
                          <div className="bg-white p-4 rounded-2xl border-2 border-[#F37021]/40 space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F37021]">
                                  Anti-Fraud Official Rate Card Quote
                                </span>
                                <h4 className="font-extrabold text-sm text-[#1A2A49]">
                                  Spare Parts Added by Engineer
                                </h4>
                              </div>
                              <button
                                onClick={() =>
                                  window.dispatchEvent(
                                    new CustomEvent("pluggy:open-rate-card", {
                                      detail: { category: "ac-repair" },
                                    })
                                  )
                                }
                                className="text-xs font-bold text-[#F37021] underline"
                              >
                                Verify Rate Card
                              </button>
                            </div>

                            <div className="space-y-2">
                              {request.addedSpareParts.map((part) => (
                                <div
                                  key={part.uid}
                                  className="p-3 rounded-xl bg-[#F4F6F9] border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                                >
                                  <div>
                                    <p className="font-bold text-xs sm:text-sm text-[#1A2A49]">
                                      {part.part}{" "}
                                      <span className="text-xs font-extrabold text-[#F37021]">
                                        (₹{part.price})
                                      </span>
                                    </p>
                                    <p className="text-[11px] text-gray-500">
                                      Code: {part.code} • Official Replacement Warranty:{" "}
                                      <strong>{part.warranty}</strong>
                                    </p>
                                  </div>

                                  {part.status === "PENDING_APPROVAL" ? (
                                    <div className="flex items-center gap-2 shrink-0">
                                      <button
                                        onClick={() =>
                                          setSparePaymentPart({ requestId: request.id, part })
                                        }
                                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                                      >
                                        ✓ Approve & Pay ₹{part.price}
                                      </button>
                                      <button
                                        onClick={() =>
                                          respondToSparePartQuote(request.id, part.uid, false)
                                        }
                                        className="px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold"
                                      >
                                        ✕ Reject
                                      </button>
                                    </div>
                                  ) : (
                                    <span
                                      className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                                        part.status === "APPROVED"
                                          ? "bg-emerald-100 text-emerald-800"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {part.status === "APPROVED"
                                        ? "✓ Approved & Added to Bill"
                                        : "✕ Rejected by Customer"}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 4. Standby Backup Loaner Appliance Card (If Issued) */}
                        {request.standbyLoaner && (
                          <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[#1A2A49] text-white flex items-center justify-center shrink-0">
                                <RefreshCw size={18} />
                              </div>
                              <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">
                                  Standby Backup Appliance Active
                                </span>
                                <h4 className="font-bold text-sm text-[#1A2A49]">
                                  {request.standbyLoaner.unitName} (@ ₹
                                  {request.standbyLoaner.dailyRent}/day)
                                </h4>
                                <p className="text-xs text-gray-600">
                                  Issued while your main motor/PCB is being repaired at Pluggy Workshop.
                                </p>
                              </div>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-white text-[#1A2A49] font-bold text-xs border border-blue-200 shrink-0">
                              Active Loaner
                            </span>
                          </div>
                        )}

                        {/* 5. 30-Day QR Appliance Health Card & Free Re-Visit Claim (When Completed) */}
                        {request.status === "COMPLETED" && (
                          <div className="bg-gradient-to-r from-emerald-900 to-[#1A2A49] text-white p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3.5">
                              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                                <QrCode size={26} className="text-amber-300" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-extrabold uppercase">
                                    30-Day Warranty Active
                                  </span>
                                  <span className="font-mono text-xs text-amber-300">
                                    QR ID: {request.applianceQrId || `QR-PLG-${request.id}`}
                                  </span>
                                </div>
                                <h4 className="font-extrabold text-sm sm:text-base mt-1">
                                  { getWarrantyDaysLeft(request.warrantyValidTill) } Days Remaining on Free Service Guarantee
                                </h4>
                                <p className="text-xs text-white/80 mt-0.5">
                                  Same problem came back? Click to dispatch our senior engineer at ₹0 visit & labour fee!
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => claimWarrantyRevisit(request.id)}
                              className="px-4 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#e05e15] text-white text-xs font-extrabold shrink-0 shadow-md"
                            >
                              🛡️ Claim ₹0 Free Re-Visit
                            </button>
                          </div>
                        )}

                        {/* Bottom Action Buttons */}
                        <div className="flex flex-wrap gap-2.5 pt-1">
                          {request.status === "COMPLETED" ? (
                            <>
                              <button
                                onClick={() => {
                                  setRatingValue(request.rating || 5)
                                  setReviewText(request.review || "")
                                  setShowRateModal(request)
                                }}
                                className="flex-1 py-2.5 px-4 bg-[#F37021] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5"
                              >
                                <Star size={15} />{" "}
                                {request.rating ? `Rated ${request.rating}/5 ★ (Edit)` : "Rate Engineer"}
                              </button>
                              <button
                                onClick={() => setShowInvoiceModal(request)}
                                className="flex-1 py-2.5 px-4 bg-white border border-[#1A2A49] text-[#1A2A49] rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5"
                              >
                                <FileText size={15} /> View Tax Invoice & QR Card
                              </button>
                            </>
                          ) : request.status === "CANCELLED" ? (
                            <button
                              onClick={() => navigate("/services")}
                              className="w-full py-2.5 bg-[#1A2A49] text-white rounded-xl font-bold text-xs sm:text-sm"
                            >
                              Book Service Again
                            </button>
                          ) : (
                            <>
                              {canCancel(request.status) && (
                                <button
                                  onClick={() => setShowCancelModal(request)}
                                  className="px-4 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold text-xs sm:text-sm hover:bg-red-50"
                                >
                                  Cancel Booking
                                </button>
                              )}
                              <button
                                onClick={() => copyBookingId(request.transactionId || `PLG${request.id}`)}
                                className="px-4 py-2.5 bg-white border border-gray-200 text-[#1A2A49] rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5"
                              >
                                {copiedId === (request.transactionId || `PLG${request.id}`) ? (
                                  <Check size={14} className="text-emerald-600" />
                                ) : (
                                  <Copy size={14} />
                                )}
                                Copy Booking ID
                              </button>
                              <button
                                onClick={() =>
                                  toast.success("24/7 Pluggy Control Desk notified! Calling your registered number...")
                                }
                                className="flex-1 py-2.5 px-4 bg-[#1A2A49] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5"
                              >
                                <MessageCircle size={15} /> Priority Help Desk
                              </button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCancelModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={28} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-center text-[#1A2A49] mb-1">Cancel Booking?</h3>
              <p className="text-gray-500 text-xs sm:text-sm text-center mb-6">
                {showCancelModal.status === "ENGINEER_ASSIGNED"
                  ? "Engineer is already assigned & en-route."
                  : "Are you sure you want to cancel this doorstep booking?"}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(null)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl font-bold text-xs sm:text-sm"
                >
                  Keep Booking
                </button>
                <button
                  onClick={confirmCancel}
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs sm:text-sm"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rate Modal */}
      <AnimatePresence>
        {showRateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRateModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-[#1A2A49] text-center mb-1">
                Rate Your Pluggy Engineer
              </h3>
              <p className="text-xs text-gray-500 text-center mb-4">{showRateModal.service}</p>

              <form onSubmit={handleSubmitRating} className="space-y-4">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingValue(star)}
                      className="p-1 transition transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={
                          star <= ratingValue ? "text-amber-400 fill-amber-400" : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  placeholder="Share your feedback about punctuality, toolkit & behaviour..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowRateModal(null)}
                    className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#F37021] text-white rounded-xl text-sm font-bold"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoice Modal */}
      <AnimatePresence>
        {showInvoiceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowInvoiceModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-[#1A2A49]">
                    Pluggy GST Invoice & Warranty Card
                  </h3>
                  <p className="text-xs text-gray-400">
                    #{showInvoiceModal.transactionId || `PLG${showInvoiceModal.id}`} • QR:{" "}
                    {showInvoiceModal.applianceQrId || `QR-PLG-${showInvoiceModal.id}`}
                  </p>
                </div>
                <button
                  onClick={() => setShowInvoiceModal(null)}
                  className="p-1.5 hover:bg-gray-100 rounded-full"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-2 text-xs sm:text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Customer</span>
                  <span className="font-bold text-[#1A2A49]">
                    {showInvoiceModal.userName || user?.name || "Customer"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service</span>
                  <span className="font-bold text-[#1A2A49]">{showInvoiceModal.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Assigned Engineer</span>
                  <span className="text-gray-700">
                    {showInvoiceModal.assignedEngineer || "Verified Master Tech"}
                  </span>
                </div>
                {(showInvoiceModal.addedSpareParts || [])
                  .filter((p) => p.status === "APPROVED")
                  .map((p) => (
                    <div key={p.uid} className="flex justify-between text-emerald-700">
                      <span>Spare: {p.part}</span>
                      <span className="font-bold">₹{p.price}</span>
                    </div>
                  ))}
                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between text-base font-extrabold text-[#1A2A49]">
                  <span>Total Amount</span>
                  <span className="text-emerald-700">₹{showInvoiceModal.amount || 0}</span>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="w-full py-3 bg-[#1A2A49] text-white rounded-xl font-bold text-sm"
              >
                Print / Download PDF Invoice
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Spare Part Payment Gateway Modal */}
      <PaymentPopup
        open={Boolean(sparePaymentPart)}
        onClose={() => setSparePaymentPart(null)}
        amount={sparePaymentPart?.part?.price || 0}
        title={`Pay for Spare: ${sparePaymentPart?.part?.part || "Spare Part"}`}
        onSuccess={() => {
          if (sparePaymentPart) {
            respondToSparePartQuote(
              sparePaymentPart.requestId,
              sparePaymentPart.part.uid,
              true
            )
          }
          setSparePaymentPart(null)
        }}
      />
    </div>
  )
}
