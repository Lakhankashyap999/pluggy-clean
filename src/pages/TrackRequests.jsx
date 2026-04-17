// src/pages/TrackRequests.jsx
import { useState, useMemo } from "react"
import { useApp } from "../AppContext"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  PackageSearch, Calendar, CircleDollarSign, User, Wrench, Clock,
  CheckCircle2, Phone, MapPin, Star, FileText, RotateCcw,
  XCircle, ChevronDown, ChevronUp, ChevronLeft, Search,
  AlertCircle, MessageCircle, Copy, Check, Trash2, Shield,
  Sparkles, Home
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

  const statusConfig = {
    PENDING_EXECUTIVE: {
      label: "Processing",
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      gradient: "from-amber-400 to-amber-500",
      progress: 15,
      description: "Executive will call shortly"
    },
    EXECUTIVE_VERIFIED: {
      label: "Confirmed",
      icon: CheckCircle2,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      gradient: "from-blue-400 to-blue-500",
      progress: 35,
      description: "Finding best expert"
    },
    ENGINEER_ASSIGNED: {
      label: "Expert Assigned",
      icon: User,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      gradient: "from-indigo-400 to-indigo-500",
      progress: 55,
      description: "Expert is on the way"
    },
    IN_PROGRESS: {
      label: "In Progress",
      icon: Wrench,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      gradient: "from-orange-400 to-orange-500",
      progress: 80,
      description: "Service in progress"
    },
    COMPLETED: {
      label: "Completed",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      gradient: "from-emerald-400 to-emerald-500",
      progress: 100,
      description: "Service completed"
    },
    CANCELLED: {
      label: "Cancelled",
      icon: XCircle,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200",
      gradient: "from-rose-400 to-rose-500",
      progress: 0,
      description: "Booking cancelled"
    }
  }

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

  const canCancel = (status) => {
    return ["PENDING_EXECUTIVE", "EXECUTIVE_VERIFIED", "ENGINEER_ASSIGNED"].includes(status)
  }

  const handleCancelRequest = (request) => {
    if (!canCancel(request.status)) {
      toast.error("Cannot cancel at this stage")
      return
    }
    setShowCancelModal(request)
  }

  const confirmCancel = () => {
    if (showCancelModal) {
      cancelRequest(showCancelModal.id, "Cancelled by customer")
      toast.success("Request cancelled")
      setShowCancelModal(null)
      setExpandedId(null)
    }
  }

  const copyBookingId = (id) => {
    navigator.clipboard?.writeText(id)
    setCopiedId(id)
    toast.success("ID copied!")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.PENDING_EXECUTIVE
    const Icon = config.icon
    return (
      <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full ${config.bg} ${config.border} border`}>
        <Icon size={12} className={config.color} />
        <span className={`text-[10px] sm:text-xs font-medium ${config.color}`}>{config.label}</span>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 text-center max-w-sm w-full shadow-xl"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#1A2A49] to-[#223a61] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User size={36} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-[#1A2A49] mb-2">Login Required</h2>
          <p className="text-gray-500 text-sm mb-6">Please login to view your requests</p>
          <button onClick={() => navigate("/login")} className="w-full py-3 bg-[#1A2A49] text-white rounded-xl font-medium">
            Login
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-inter">
      
      {/* Header - Mobile Optimized */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 safe-top">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <BackButton />
            <h2 className="text-lg font-bold text-[#1A2A49] font-poppins">My Requests</h2>
          </div>
          <button onClick={() => navigate("/")} className="p-2 hover:bg-gray-100 rounded-full active:bg-gray-200">
            <Home size={20} className="text-[#1A2A49]" />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4">
        
        {/* Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-xl font-bold text-[#1A2A49]">{requests.length}</p>
            <p className="text-[10px] text-gray-500">Total</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-xl font-bold text-[#F97316]">{activeCount}</p>
            <p className="text-[10px] text-gray-500">Active</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
            <p className="text-xl font-bold text-[#10B981]">{completedCount}</p>
            <p className="text-[10px] text-gray-500">Done</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by service or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F37021]"
          />
        </div>

        {/* Filter Pills - Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-hide">
          {["All", "PENDING_EXECUTIVE", "ENGINEER_ASSIGNED", "IN_PROGRESS", "COMPLETED"].map((status) => {
            const config = statusConfig[status]
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition active:scale-95 ${
                  filterStatus === status
                    ? `bg-gradient-to-r ${config?.gradient || 'from-[#1A2A49] to-[#223a61]'} text-white shadow-md`
                    : "bg-white text-gray-600 border border-gray-200"
                }`}
              >
                {status === "All" ? "All" : config?.label || status}
              </button>
            )
          })}
        </div>

        {/* Requests List */}
        <div className="space-y-3 pb-4">
          {filteredRequests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <PackageSearch size={28} className="text-gray-400" />
              </div>
              <h3 className="text-base font-bold text-[#1A2A49] mb-1">No requests found</h3>
              <p className="text-gray-500 text-xs mb-5">
                {searchQuery ? "Try different search" : "Book your first service"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => navigate("/book-service")}
                  className="px-5 py-2.5 bg-[#F37021] text-white rounded-full font-medium text-sm active:scale-95"
                >
                  <Sparkles size={16} className="inline mr-1" />
                  Book a Service
                </button>
              )}
            </motion.div>
          ) : (
            filteredRequests.map((request, index) => {
              const status = statusConfig[request.status] || statusConfig.PENDING_EXECUTIVE
              const StatusIcon = status.icon
              const isExpanded = expandedId === request.id

              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${
                    isExpanded ? "ring-1 ring-[#F37021]/30" : ""
                  }`}
                >
                  {/* Card Header */}
                  <div 
                    className="p-4 cursor-pointer active:bg-gray-50 transition"
                    onClick={() => setExpandedId(isExpanded ? null : request.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${status.gradient} flex items-center justify-center shadow-sm flex-shrink-0`}>
                        <Wrench size={20} className="text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <h3 className="font-bold text-[#1A2A49] text-base truncate font-poppins">
                            {request.service || "Service"}
                          </h3>
                          {getStatusBadge(request.status)}
                        </div>
                        
                        <p className="text-gray-400 text-[10px] mb-2">
                          {request.date || (request.createdAt ? new Date(request.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Today')}
                        </p>

                        <div className="mb-2">
                          <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span>Progress</span>
                            <span className="font-medium text-[#1A2A49]">{status.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${status.gradient}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${status.progress}%` }}
                              transition={{ duration: 0.6 }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <StatusIcon size={12} className={status.color} />
                            <span className="text-[10px] text-gray-500 truncate max-w-[130px]">{status.description}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#1A2A49] text-base">₹{request.amount || 0}</span>
                            {isExpanded ? 
                              <ChevronUp size={16} className="text-gray-400" /> : 
                              <ChevronDown size={16} className="text-gray-400" />
                            }
                          </div>
                        </div>
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
                        className="border-t border-gray-100 bg-gray-50/50"
                      >
                        <div className="p-4 space-y-3">
                          
                          {/* Booking ID */}
                          <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                            <span className="text-xs text-gray-500">Booking ID</span>
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-xs font-medium">
                                {request.transactionId || `PLG${request.id}`}
                              </span>
                              <button 
                                onClick={() => copyBookingId(request.transactionId || `PLG${request.id}`)} 
                                className="p-1.5 hover:bg-gray-100 rounded active:bg-gray-200"
                              >
                                {copiedId === (request.transactionId || `PLG${request.id}`) ? 
                                  <Check size={14} className="text-green-600" /> : 
                                  <Copy size={14} className="text-gray-400" />
                                }
                              </button>
                            </div>
                          </div>

                          {/* Issue */}
                          <div className="bg-white p-3 rounded-lg">
                            <span className="text-xs text-gray-500 block mb-1">Issue</span>
                            <p className="text-sm text-gray-800">{request.issue || "General Service"}</p>
                          </div>

                          {/* Address */}
                          <div className="bg-white p-3 rounded-lg">
                            <span className="text-xs text-gray-500 block mb-1 flex items-center gap-1">
                              <MapPin size={12} /> Address
                            </span>
                            <p className="text-sm text-gray-800">{request.address || request.userAddress || "Not provided"}</p>
                          </div>

                          {/* Payment */}
                          <div className="bg-white p-3 rounded-lg">
                            <span className="text-xs text-gray-500 block mb-1">Payment</span>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Total Paid</span>
                              <span className="font-bold text-[#1A2A49]">₹{request.amount || 0}</span>
                            </div>
                          </div>

                          {/* Engineer */}
                          {(request.status === "ENGINEER_ASSIGNED" || request.status === "IN_PROGRESS") && (
                            <div className="bg-white p-3 rounded-lg">
                              <span className="text-xs text-gray-500 block mb-2">Assigned Expert</span>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#1A2A49] to-[#F37021] rounded-full flex items-center justify-center text-white font-bold">
                                  {request.assignedEngineer?.charAt(0) || "E"}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-[#1A2A49]">{request.assignedEngineer || "Expert"}</p>
                                  <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Star size={12} className="text-yellow-500 fill-yellow-500" /> 4.8
                                  </p>
                                </div>
                                <a href={`tel:9876543210`} className="p-2.5 bg-[#1A2A49] text-white rounded-full active:scale-95">
                                  <Phone size={16} />
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-1">
                            {request.status === "COMPLETED" ? (
                              <>
                                <button className="flex-1 py-3 bg-[#F37021] text-white rounded-xl font-medium text-sm flex items-center justify-center gap-1 active:scale-[0.98]">
                                  <Star size={16} /> Rate
                                </button>
                                <button className="flex-1 py-3 border border-[#1A2A49] text-[#1A2A49] rounded-xl font-medium text-sm flex items-center justify-center gap-1 active:bg-gray-50">
                                  <FileText size={16} /> Invoice
                                </button>
                              </>
                            ) : request.status === "CANCELLED" ? (
                              <button 
                                onClick={() => navigate("/book-service")} 
                                className="w-full py-3 bg-[#1A2A49] text-white rounded-xl font-medium text-sm active:scale-[0.98]"
                              >
                                Book Again
                              </button>
                            ) : (
                              <>
                                {canCancel(request.status) && (
                                  <button 
                                    onClick={() => handleCancelRequest(request)}
                                    className="flex-1 py-3 border border-red-200 text-red-600 rounded-xl font-medium text-sm active:bg-red-50"
                                  >
                                    Cancel
                                  </button>
                                )}
                                <button className="flex-1 py-3 bg-[#1A2A49] text-white rounded-xl font-medium text-sm flex items-center justify-center gap-1 active:scale-[0.98]">
                                  <MessageCircle size={16} /> Support
                                </button>
                              </>
                            )}
                          </div>
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
              <h3 className="text-lg font-bold text-center text-[#1A2A49] mb-1">Cancel Request?</h3>
              <p className="text-gray-500 text-sm text-center mb-6">
                {showCancelModal.status === "ENGINEER_ASSIGNED" 
                  ? "Expert is already assigned. Charges may apply."
                  : "This cannot be undone."
                }
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowCancelModal(null)} className="flex-1 py-3 border border-gray-300 rounded-xl font-medium active:bg-gray-50">
                  Keep It
                </button>
                <button onClick={confirmCancel} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium active:bg-red-600">
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