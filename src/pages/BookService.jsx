// src/pages/BookService.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useApp } from "../AppContext"
import toast from "react-hot-toast"
import {
  ChevronLeft,
  Home,
  MapPin,
  Phone,
  User,
  Calendar,
  Clock,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Navigation,
} from "lucide-react"
import PaymentPopup from "../components/PaymentPopup"  // ✅ ADDED

export default function BookService() {
  const navigate = useNavigate()
  const { user, addBooking, addRequest } = useApp()

  // Form State
  const [selectedService, setSelectedService] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: "",
    issue: "",
  })

  // UI State
  const [showExitPopup, setShowExitPopup] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState(null)
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [addressSuggestions, setAddressSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showPayment, setShowPayment] = useState(false)  // ✅ ADDED

  // Services Data with Images
  const services = [
    {
      id: "ac-repair",
      name: "AC Repair",
      icon: "❄️",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
      rating: 4.8,
      bookings: 1200,
      startingPrice: 199,
      popularIssues: ["Cooling Problem", "Water Leakage", "Gas Refill", "Not Turning On"],
    },
    {
      id: "fan-motor",
      name: "Fan & Motor",
      icon: "🌀",
      image: "https://images.unsplash.com/photo-1585298723682-5f9f4e2d3b5e?w=400&h=300&fit=crop",
      rating: 4.6,
      bookings: 850,
      startingPrice: 149,
      popularIssues: ["Slow Speed", "Noise Issue", "Not Starting", "Wobbling"],
    },
    {
      id: "wiring",
      name: "Wiring",
      icon: "⚡",
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop",
      rating: 4.7,
      bookings: 650,
      startingPrice: 249,
      popularIssues: ["Switch Burnt", "MCB Tripping", "Short Circuit", "Loose Connection"],
    },
    {
      id: "electrical",
      name: "Electrical",
      icon: "🔌",
      image: "https://images.unsplash.com/photo-1581092921461-39b4d559b19c?w=400&h=300&fit=crop",
      rating: 4.5,
      bookings: 500,
      startingPrice: 199,
      popularIssues: ["Geyser Issue", "Fridge Not Cooling", "Washing Machine", "Microwave"],
    },
  ]

  // Time Slots
  const timeSlots = [
    { id: "today-9-11", label: "Today", time: "9 AM - 11 AM", available: true },
    { id: "today-2-5", label: "Today", time: "2 PM - 5 PM", available: true },
    { id: "tomorrow-9-11", label: "Tomorrow", time: "9 AM - 11 AM", available: true },
    { id: "tomorrow-2-5", label: "Tomorrow", time: "2 PM - 5 PM", available: true },
    { id: "flexible", label: "Flexible", time: "Anytime", available: true },
  ]

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
      }))
    }
  }, [user])

  // Track form dirty state
  useEffect(() => {
    const hasData =
      selectedService !== null ||
      selectedTimeSlot !== null ||
      formData.address.trim() !== "" ||
      formData.issue.trim() !== ""
    setIsFormDirty(hasData)
  }, [selectedService, selectedTimeSlot, formData])

  // Mock address autocomplete
  const handleAddressChange = (value) => {
    setFormData({ ...formData, address: value })
    setIsFormDirty(true)

    if (value.length > 3) {
      const mockSuggestions = [
        `${value} Main Road, Andheri East, Mumbai`,
        `${value} Market Area, Bandra West, Mumbai`,
        `${value} Society, Powai, Mumbai`,
      ]
      setAddressSuggestions(mockSuggestions)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const selectAddress = (addr) => {
    setFormData({ ...formData, address: addr })
    setShowSuggestions(false)
  }

  // Calculate Price
  const calculatePrice = () => {
    if (!selectedService) return { service: 0, visit: 0, total: 0 }
    const servicePrice = services.find((s) => s.id === selectedService)?.startingPrice || 0
    const visitFee = 50
    return {
      service: servicePrice,
      visit: visitFee,
      total: servicePrice + visitFee,
    }
  }

  const price = calculatePrice()

  // Navigation handlers with confirmation
  const handleNavigation = (path) => {
    if (isFormDirty) {
      setPendingNavigation(path)
      setShowExitPopup(true)
    } else {
      navigate(path)
    }
  }

  const confirmNavigation = () => {
    setShowExitPopup(false)
    if (pendingNavigation) {
      navigate(pendingNavigation)
    }
  }

  const cancelNavigation = () => {
    setShowExitPopup(false)
    setPendingNavigation(null)
  }

  // Submit Booking - Opens Payment Popup ✅ CHANGED
  const handleSubmit = () => {
    if (!user) {
      toast.error("Please login first!")
      navigate("/login")
      return
    }

    if (!selectedService) {
      toast.error("Please select a service!")
      return
    }

    if (!selectedTimeSlot) {
      toast.error("Please select a time slot!")
      return
    }

    if (!formData.address.trim()) {
      toast.error("Please enter your address!")
      return
    }

    // Open Payment Popup
    setShowPayment(true)
  }

  // Payment Success Handler ✅ ADDED
  const handlePaymentSuccess = (transactionId) => {
    const serviceData = services.find((s) => s.id === selectedService)

    const bookingObj = {
      id: Date.now(),
      transactionId: transactionId, // ✅ Save transaction ID
      userId: user.id || user.email,
      userName: formData.name,
      userPhone: formData.phone,
      userAddress: formData.address,
      service: serviceData.name,
      issue: formData.issue || "General Service",
      timeSlot: selectedTimeSlot,
      date: new Date().toLocaleDateString(),
      status: "PENDING_EXECUTIVE",
      amount: price.total,
      createdAt: new Date().toISOString(),
    }

    addBooking(bookingObj)
    addRequest({
      ...bookingObj,
      selectedIssues: [],
      priority: "Medium",
    })

    toast.success("Booking Confirmed! Executive will call you shortly.")
    setIsFormDirty(false)
    setShowPayment(false)
    navigate("/account/track")
  }

  // Check if form is valid
  const isFormValid = selectedService && selectedTimeSlot && formData.address.trim()

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* ====== Header ====== */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => handleNavigation(-1)}
            className="flex items-center gap-1 text-gray-600 hover:text-[#1A2A49] transition"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>

          <h2 className="text-lg font-bold text-[#1A2A49]">Book Service</h2>

          <button
            onClick={() => handleNavigation("/")}
            className="flex items-center gap-1 text-gray-600 hover:text-[#1A2A49] transition"
          >
            <Home size={18} />
            <span className="text-sm font-medium hidden sm:inline">Home</span>
          </button>
        </div>
      </div>

      {/* ====== Main Content ====== */}
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-6 text-sm"
        >
          <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm">
            <span className="text-yellow-500">★★★★★</span>
            <span className="font-semibold">4.8</span>
            <span className="text-gray-500">(2.5k+ reviews)</span>
          </div>
          <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm">
            <ShieldCheck size={16} className="text-green-600" />
            <span className="text-gray-700">500+ Verified Experts</span>
          </div>
          <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm">
            <Sparkles size={16} className="text-[#F37021]" />
            <span className="text-gray-700">30-Day Warranty</span>
          </div>
        </motion.div>

        {/* ====== Step 1: Select Service ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4"
        >
          <h3 className="text-lg font-bold text-[#1A2A49] mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-[#1A2A49] text-white rounded-full flex items-center justify-center text-xs">
              1
            </span>
            What service do you need?
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {services.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedService(service.id)}
                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                  selectedService === service.id
                    ? "border-[#1A2A49] shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="relative h-24 bg-gray-100">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-1.5 py-0.5 text-xs font-medium flex items-center gap-0.5">
                    <span className="text-yellow-500">⭐</span>
                    {service.rating}
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-[#1A2A49] text-sm">
                    {service.icon} {service.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    ₹{service.startingPrice} onwards
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{service.bookings}+ booked</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Popular Issues for Selected Service */}
          <AnimatePresence>
            {selectedService && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t"
              >
                <p className="text-sm font-medium text-gray-600 mb-2">Popular Issues:</p>
                <div className="flex flex-wrap gap-2">
                  {services
                    .find((s) => s.id === selectedService)
                    ?.popularIssues.map((issue, i) => (
                      <button
                        key={i}
                        onClick={() => setFormData({ ...formData, issue })}
                        className={`px-3 py-1.5 rounded-full text-xs transition ${
                          formData.issue === issue
                            ? "bg-[#1A2A49] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {issue}
                      </button>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ====== Step 2: Select Time ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4"
        >
          <h3 className="text-lg font-bold text-[#1A2A49] mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-[#1A2A49] text-white rounded-full flex items-center justify-center text-xs">
              2
            </span>
            When should we come?
          </h3>

          <div className="flex flex-wrap gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedTimeSlot(slot.id)}
                className={`px-4 py-3 rounded-xl border transition-all text-left ${
                  selectedTimeSlot === slot.id
                    ? "border-[#1A2A49] bg-[#1A2A49] text-white shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  {slot.id.includes("flexible") ? (
                    <Clock size={16} />
                  ) : (
                    <Calendar size={16} />
                  )}
                  <span className="font-medium text-sm">{slot.label}</span>
                </div>
                <p
                  className={`text-xs mt-1 ${
                    selectedTimeSlot === slot.id ? "text-gray-200" : "text-gray-500"
                  }`}
                >
                  {slot.time}
                </p>
              </button>
            ))}
          </div>

          <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Same day service available
          </p>
        </motion.div>

        {/* ====== Step 3: Your Details ====== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4"
        >
          <h3 className="text-lg font-bold text-[#1A2A49] mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-[#1A2A49] text-white rounded-full flex items-center justify-center text-xs">
              3
            </span>
            Your Details
          </h3>

          <div className="space-y-4">
            {/* Name */}
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  setIsFormDirty(true)
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A49] bg-gray-50"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value })
                  setIsFormDirty(true)
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A49] bg-gray-50"
              />
            </div>

            {/* Address with Autocomplete */}
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
              <textarea
                placeholder="Complete Address"
                value={formData.address}
                onChange={(e) => handleAddressChange(e.target.value)}
                rows={2}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A49] bg-gray-50 resize-none"
              />
              {showSuggestions && addressSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
                  {addressSuggestions.map((sugg, i) => (
                    <div
                      key={i}
                      onClick={() => selectAddress(sugg)}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    >
                      <Navigation size={14} className="text-[#F37021]" />
                      {sugg}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Issue Details */}
            <div className="relative">
              <textarea
                placeholder="Describe your issue (optional)"
                value={formData.issue}
                onChange={(e) => {
                  setFormData({ ...formData, issue: e.target.value })
                  setIsFormDirty(true)
                }}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A49] bg-gray-50 resize-none"
              />
            </div>
          </div>
        </motion.div>

        {/* ====== Price Summary ====== */}
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
          >
            <h4 className="font-semibold text-[#1A2A49] mb-3">Price Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Service Charge</span>
                <span>₹{price.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Visit Fee</span>
                <span>₹{price.visit}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-[#1A2A49]">
                <span>Total</span>
                <span>₹{price.total}</span>
              </div>
            </div>
            <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
              <ShieldCheck size={14} />
              30-day service warranty included
            </p>
          </motion.div>
        )}
      </div>

      {/* ====== Sticky Bottom CTA ====== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-30">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${
              isFormValid
                ? "bg-[#1A2A49] hover:bg-[#223a61] shadow-lg hover:shadow-xl"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isFormValid ? "🚀 Confirm & Book" : "Fill all required fields"}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            ✅ No hidden charges • Free cancellation
          </p>
        </div>
      </div>

      {/* ====== Exit Confirmation Popup ====== */}
      <AnimatePresence>
        {showExitPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertTriangle size={20} className="text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-[#1A2A49]">Unsaved Changes</h3>
              </div>

              <p className="text-gray-600 mb-6">
                You have unsaved information. Are you sure you want to leave? Your progress will be lost.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={cancelNavigation}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Stay
                </button>
                <button
                  onClick={confirmNavigation}
                  className="flex-1 py-2.5 bg-[#F37021] text-white rounded-xl font-medium hover:bg-[#E05E15] transition"
                >
                  Leave Anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== Payment Popup ====== ✅ ADDED */}
      <PaymentPopup
        open={showPayment}
        onClose={() => setShowPayment(false)}
        amount={price.total}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}