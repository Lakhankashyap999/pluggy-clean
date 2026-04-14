// src/pages/TrackRequests.jsx
import { useState, useMemo } from "react"
import { useApp } from "../AppContext"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  PackageSearch,
  Calendar,
  CircleDollarSign,
  User,
  Wrench,
  Clock,
  CheckCircle2,
  Phone,
  MapPin,
  Star,
  FileText,
  RotateCcw,
  XCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Search,
  AlertCircle,
  MessageCircle,
  Navigation,
  Copy,
  Check,
  Trash2,
  Shield,
  Sparkles
} from "lucide-react"
import BackButton from "../components/BackButton"
import toast from "react-hot-toast"

export default function TrackRequests() {
  const navigate = useNavigate()
  const { requests, user, cancelRequest } = useApp()
  
  const [filterStatus, setFilterStatus] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedId, setExpandedId] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(null)

  // Status Configuration
  const statusConfig = {
    PENDING_EXECUTIVE: {
      label: "Executive Verifying",
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      gradient: "from-amber-400 to-amber-500",
      progress: 15,
      description: "Executive will call you shortly to confirm details"
    },
    EXECUTIVE_VERIFIED: {
      label: "Verified",
      icon: CheckCircle2,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      gradient: "from-blue-400 to-blue-500",
      progress: 35,
      description: "Details verified, finding best engineer for you"
    },
    ENGINEER_ASSIGNED: {
      label: "Engineer Assigned",
      icon: User,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      gradient: "from-indigo-400 to-indigo-500",
      progress: 55,
      description: "Engineer assigned and preparing to visit"
    },
    IN_PROGRESS: {
      label: "In Progress",
      icon: Wrench,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      gradient: "from-orange-400 to-orange-500",
      progress: 80,
      description: "Service is being performed"
    },
    COMPLETED: {
      label: "Completed",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      gradient: "from-emerald-400 to-emerald-500",
      progress: 100,
      description: "Service completed successfully"
    },
    CANCELLED: {
      label: "Cancelled",
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200",
      gradient: "from-rose-400 to-rose-500",
      progress: 0,
      description: "Booking was cancelled"
    }
  }

  // Filter and Search
  const filteredRequests = useMemo(() => {
    return requests
      .filter(r => filterStatus === "All" ? true : r.status === filterStatus)
      .filter(r => {
        const query = searchQuery.toLowerCase()
        return (
          r.service?.toLowerCase().includes(query) ||
          r.id?.toString().includes(query) ||
          r.transactionId?.toLowerCase().includes(query)
        )
      })
      .sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id))
  }, [requests, filterStatus, searchQuery])

  const activeCount = requests.filter(r => !["COMPLETED", "CANCELLED"].includes(r.status)).length
  const completedCount = requests.filter(r => r.status === "COMPLETED").length

  // Check if request can be cancelled
  const canCancel = (status) => {
    return ["PENDING_EXECUTIVE", "EXECUTIVE_VERIFIED", "ENGINEER_ASSIGNED"].includes(status)
  }

  // Handle Cancel
  const handleCancelRequest = (request) => {
    if (!canCancel(request.status)) {
      toast.error("This request cannot be cancelled at this stage.")
      return
    }
    setShowCancelModal(request)
  }

  const confirmCancel = () => {
    if (showCancelModal) {
      cancelRequest(showCancelModal.id, "Cancelled by customer")
      toast.success("Request cancelled successfully")
      setShowCancelModal(null)
      setExpandedId(null)
    }
  }

  // Copy Booking ID
  const copyBookingId = (id) => {
    navigator.clipboard?.writeText(id)
    setCopiedId(id)
    toast.success("Booking ID copied!")
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Get status badge
  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.PENDING_EXECUTIVE
    const Icon = config.icon
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bg} ${config.border} border`}>
        <Icon size={14} className={config.color} />
        <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F4F6F9] via-white to-[#EDF0F3] flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md border border-gray-100"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#1A2A49] to-[#223a61] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <User size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A2A49] mb-2">Login Required</h2>
          <p className="text-gray-600 mb-8">Please login to view your service requests</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3.5 bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Login to Continue
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F6F9] via-white to-[#EDF0F3]">
      {/* Premium Header */}
      <div className="relative bg-gradient-to-r from-[#1A2A49] to-[#223a61] pb-8">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 pt-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <h2 className="text-2xl font-bold text-white">My Requests</h2>
          </div>

          {/* Premium Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <p className="text-white/70 text-xs font-medium mb-1">Active</p>
              <p className="text-white text-3xl font-bold">{activeCount}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <p className="text-white/70 text-xs font-medium mb-1">Completed</p>
              <p className="text-white text-3xl font-bold">{completedCount}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <p className="text-white/70 text-xs font-medium mb-1">Total</p>
              <p className="text-white text-3xl font-bold">{requests.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-4xl mx-auto px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
          <div className="relative mb-4">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by service, booking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A49] text-sm"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {["All", "PENDING_EXECUTIVE", "ENGINEER_ASSIGNED", "IN_PROGRESS", "COMPLETED"].map((status) => {
              const config = statusConfig[status]
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    filterStatus === status
                      ? `bg-gradient-to-r ${config?.gradient || 'from-[#1A2A49] to-[#223a61]'} text-white shadow-md`
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status === "All" ? "All Requests" : config?.label || status}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredRequests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageSearch size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-[#1A2A49] mb-2">No requests found</h3>
            <p className="text-gray-500 mb-8">
              {searchQuery ? "Try a different search term" : "Book your first service to get started"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate("/book-service")}
                className="px-8 py-3.5 bg-gradient-to-r from-[#F37021] to-[#FF8C42] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                <Sparkles size={18} className="inline mr-2" />
                Book a Service
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request, index) => {
              const status = statusConfig[request.status] || statusConfig.PENDING_EXECUTIVE
              const StatusIcon = status.icon
              const isExpanded = expandedId === request.id

              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl shadow-lg border overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    isExpanded ? "ring-2 ring-[#1A2A49]/20" : ""
                  }`}
                >
                  {/* Card Header */}
                  <div 
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : request.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${status.gradient} flex items-center justify-center shadow-md`}>
                          <Wrench size={22} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#1A2A49] text-lg">{request.service}</h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              copyBookingId(request.transactionId || `PLG${request.id}`)
                            }}
                            className="text-xs text-gray-500 hover:text-[#1A2A49] flex items-center gap-1 mt-0.5"
                          >
                            ID: {request.transactionId || `PLG${request.id}`}
                            {copiedId === (request.transactionId || `PLG${request.id}`) ? (
                              <Check size={12} className="text-emerald-600" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    {/* Premium Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span className="font-medium">Progress</span>
                        <span className="font-bold text-[#1A2A49]">{status.progress}%</span>
                      </div>
                      <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${status.gradient}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${status.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                        <Calendar size={14} />
                        {request.date || new Date(request.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                        <CircleDollarSign size={14} />
                        ₹{request.amount || 0}
                      </span>
                    </div>

                    {/* Status Message */}
                    <div className={`mt-4 p-4 rounded-xl ${status.bg} border ${status.border} flex items-start gap-3`}>
                      <div className={`w-8 h-8 rounded-full ${status.bg} flex items-center justify-center`}>
                        <StatusIcon size={18} className={status.color} />
                      </div>
                      <div>
                        <p className={`font-semibold ${status.color}`}>{status.label}</p>
                        <p className={`text-sm ${status.color} opacity-80`}>{status.description}</p>
                      </div>
                    </div>

                    {/* Expand Indicator */}
                    <div className="flex justify-center mt-4">
                      <div className="bg-gray-100 rounded-full p-1">
                        {isExpanded ? (
                          <ChevronUp size={18} className="text-[#1A2A49]" />
                        ) : (
                          <ChevronDown size={18} className="text-[#1A2A49]" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t bg-gradient-to-br from-gray-50 to-white"
                      >
                        <div className="p-5 space-y-4">
                          
                          {/* Booking Details */}
                          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                            <h4 className="font-bold text-[#1A2A49] mb-4 flex items-center gap-2">
                              <PackageSearch size={18} className="text-[#F37021]" />
                              Booking Details
                            </h4>
                            
                            <div className="space-y-3">
                              <div className="flex">
                                <span className="w-28 text-sm text-gray-500">Service</span>
                                <span className="flex-1 text-sm font-semibold text-[#1A2A49]">{request.service}</span>
                              </div>
                              <div className="flex">
                                <span className="w-28 text-sm text-gray-500">Issue</span>
                                <span className="flex-1 text-sm text-gray-700">{request.issue || "General Service"}</span>
                              </div>
                              
                              {request.selectedIssues && request.selectedIssues.length > 0 && (
                                <div className="flex">
                                  <span className="w-28 text-sm text-gray-500">Selected</span>
                                  <div className="flex-1 space-y-2">
                                    {request.selectedIssues.map((item, i) => (
                                      <div key={i} className="text-sm flex justify-between bg-gray-50 p-2 rounded-lg">
                                        <span className="text-gray-700">• {item.issue}</span>
                                        <span className="font-semibold text-[#1A2A49]">₹{item.price}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Customer Details */}
                          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                            <h4 className="font-bold text-[#1A2A49] mb-4 flex items-center gap-2">
                              <User size={18} className="text-[#F37021]" />
                              Customer Details
                            </h4>
                            
                            <div className="space-y-3">
                              <p className="text-base font-semibold text-[#1A2A49]">
                                {request.userName || request.name || user?.name}
                              </p>
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <Phone size={15} className="text-gray-400" />
                                {request.userPhone || request.phone || user?.phone}
                              </p>
                              <p className="text-sm text-gray-600 flex items-start gap-2">
                                <MapPin size={15} className="text-gray-400 mt-0.5" />
                                <span>{request.address || request.userAddress || "Address not provided"}</span>
                              </p>
                            </div>
                          </div>

                          {/* Schedule */}
                          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                            <h4 className="font-bold text-[#1A2A49] mb-4 flex items-center gap-2">
                              <Calendar size={18} className="text-[#F37021]" />
                              Schedule
                            </h4>
                            
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#1A2A49] to-[#223a61] rounded-xl flex items-center justify-center shadow-md">
                                <Clock size={22} className="text-white" />
                              </div>
                              <div>
                                <p className="font-bold text-[#1A2A49] text-lg">
                                  {request.timeSlot || "Flexible Timing"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {request.date || new Date(request.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Payment Details */}
                          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                            <h4 className="font-bold text-[#1A2A49] mb-4 flex items-center gap-2">
                              <CircleDollarSign size={18} className="text-[#F37021]" />
                              Payment Details
                            </h4>
                            
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Service Charge</span>
                                <span className="font-semibold">₹{request.amount - 50 || 0}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Visit Fee</span>
                                <span className="font-semibold">₹50</span>
                              </div>
                              <div className="border-t pt-3 mt-3 flex justify-between">
                                <span className="font-bold text-[#1A2A49]">Total Paid</span>
                                <span className="font-bold text-lg text-[#1A2A49]">₹{request.amount || 0}</span>
                              </div>
                              
                              {request.transactionId && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                                  <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                                  <div className="flex items-center justify-between">
                                    <span className="font-mono text-sm font-semibold text-[#1A2A49]">{request.transactionId}</span>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard?.writeText(request.transactionId)
                                        toast.success("Transaction ID copied!")
                                      }}
                                      className="p-2 hover:bg-gray-200 rounded-lg transition"
                                    >
                                      <Copy size={16} className="text-gray-500" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Engineer Info (if assigned) */}
                          {(request.status === "ENGINEER_ASSIGNED" || request.status === "IN_PROGRESS") && (
                            <div className="bg-gradient-to-br from-[#1A2A49] to-[#223a61] rounded-xl p-5 text-white shadow-lg">
                              <h4 className="font-bold mb-4 flex items-center gap-2">
                                <User size={18} />
                                Your Engineer
                              </h4>
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-2xl border-2 border-white/30">
                                  {request.assignedEngineer?.charAt(0) || "M"}
                                </div>
                                <div className="flex-1">
                                  <p className="font-bold text-xl">
                                    {request.assignedEngineer || "Mukesh Kumar"}
                                  </p>
                                  <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                    4.8 • 234 jobs completed
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-3 mt-5">
                                <button className="flex-1 py-3 bg-white text-[#1A2A49] rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition">
                                  <Phone size={18} /> Call
                                </button>
                                <button className="flex-1 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-white/30 transition border border-white/20">
                                  <MessageCircle size={18} /> Message
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-2">
                            {request.status === "COMPLETED" ? (
                              <>
                                <button className="flex-1 py-3.5 bg-gradient-to-r from-[#F37021] to-[#FF8C42] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition">
                                  <Star size={18} /> Rate Service
                                </button>
                                <button className="flex-1 py-3.5 border-2 border-[#1A2A49] text-[#1A2A49] rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#1A2A49] hover:text-white transition">
                                  <FileText size={18} /> Invoice
                                </button>
                                <button 
                                  onClick={() => navigate("/book-service")}
                                  className="px-5 py-3.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
                                >
                                  <RotateCcw size={18} />
                                </button>
                              </>
                            ) : request.status === "CANCELLED" ? (
                              <button 
                                onClick={() => navigate("/book-service")}
                                className="w-full py-3.5 bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white rounded-xl font-semibold hover:shadow-lg transition"
                              >
                                Book Again
                              </button>
                            ) : (
                              <>
                                {canCancel(request.status) && (
                                  <button 
                                    onClick={() => handleCancelRequest(request)}
                                    className="flex-1 py-3.5 border-2 border-rose-200 text-rose-600 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-rose-50 transition"
                                  >
                                    <Trash2 size={18} /> Cancel Request
                                  </button>
                                )}
                                <button className="px-5 py-3.5 bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white rounded-xl hover:shadow-lg transition">
                                  <MessageCircle size={18} />
                                </button>
                              </>
                            )}
                          </div>

                          {/* Support */}
                          <p className="text-xs text-gray-400 text-center pt-3">
                            <Shield size={12} className="inline mr-1" />
                            Need help? <button className="text-[#1A2A49] font-semibold hover:underline">Contact Support</button>
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6"
            >
              <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={28} className="text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-[#1A2A49] text-center mb-2">Cancel Request?</h3>
              <p className="text-gray-600 text-center text-sm mb-6">
                {showCancelModal.status === "ENGINEER_ASSIGNED" 
                  ? "Engineer is already assigned. Cancellation may incur charges."
                  : "Are you sure you want to cancel this request? This action cannot be undone."
                }
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(null)}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Keep It
                </button>
                <button
                  onClick={confirmCancel}
                  className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}