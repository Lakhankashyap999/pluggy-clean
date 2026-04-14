// src/components/PaymentPopup.jsx
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  Timer, 
  Smartphone, 
  CreditCard, 
  Building, 
  Wallet,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  Shield,
  Copy,
  Check
} from "lucide-react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import successAnim from "../assets/success.lottie"

// UPI Apps Data
const upiApps = [
  { id: "gpay", name: "Google Pay", icon: "https://upload.wikimedia.org/wikipedia/commons/7/7a/GPay_Logo.png", color: "#1A73E8" },
  { id: "phonepe", name: "PhonePe", icon: "https://upload.wikimedia.org/wikipedia/commons/5/5b/PhonePe_Logo.png", color: "#6739B7" },
  { id: "paytm", name: "Paytm", icon: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo.png", color: "#00BAF2" },
  { id: "amazonpay", name: "Amazon Pay", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Amazon_Pay_logo.svg", color: "#FF9900" },
]

export default function PaymentPopup({ open, onClose, amount, onSuccess }) {
  const [step, setStep] = useState("method") // method, upi, card, processing, success
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [selectedUpiApp, setSelectedUpiApp] = useState(null)
  const [upiId, setUpiId] = useState("")
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [processingStep, setProcessingStep] = useState(0) // 0: Verifying, 1: Processing, 2: Confirming
  const [transactionId, setTransactionId] = useState("")
  const [copied, setCopied] = useState(false)
  
  // Card Form State
  const [cardForm, setCardForm] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  })

  // Generate Transaction ID
  const generateTransactionId = () => {
    const date = new Date()
    const yy = date.getFullYear().toString().slice(-2)
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const seq = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')
    return `PLG${yy}${mm}${dd}${seq}`
  }

  // Timer
  useEffect(() => {
    if (!open) {
      // Reset state when closed
      setTimeout(() => {
        setStep("method")
        setSelectedMethod(null)
        setSelectedUpiApp(null)
        setUpiId("")
        setProcessingStep(0)
        setTimeLeft(600)
      }, 300)
      return
    }
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    
    return () => clearInterval(interval)
  }, [open])

  // Processing animation
  useEffect(() => {
    if (step === "processing") {
      const steps = [0, 1, 2]
      let current = 0
      const interval = setInterval(() => {
        if (current < steps.length - 1) {
          current++
          setProcessingStep(current)
        } else {
          clearInterval(interval)
          setTimeout(() => {
            const txId = generateTransactionId()
            setTransactionId(txId)
            setStep("success")
          }, 800)
        }
      }, 1200)
      return () => clearInterval(interval)
    }
  }, [step])

  if (!open) return null

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0")
  const seconds = String(timeLeft % 60).padStart(2, "0")
  const progressPercent = (timeLeft / 600) * 100

  // Handle Payment
  const handlePayment = () => {
    if (selectedMethod === "upi" && !upiId) {
      return
    }
    setStep("processing")
  }

  // Handle Success
  const handleSuccess = () => {
    setStep("method")
    onClose()
    if (onSuccess) {
      onSuccess(transactionId)
    }
  }

  // Format Card Number
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    }
    return value
  }

  // Format Expiry
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4)
    }
    return v
  }

  const copyTransactionId = () => {
    navigator.clipboard?.writeText(transactionId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={step === "processing" || step === "success" ? undefined : onClose}
      />

      {/* Bottom Sheet (Mobile) / Centered Modal (Desktop) */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {step !== "method" && (
              <button
                onClick={() => {
                  if (step === "upi" || step === "card") {
                    setStep("method")
                    setSelectedMethod(null)
                    setSelectedUpiApp(null)
                  }
                }}
                className="p-1.5 hover:bg-gray-100 rounded-full transition"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <h2 className="text-lg font-bold text-[#1A2A49]">
              {step === "method" && "Complete Payment"}
              {step === "upi" && (selectedUpiApp?.name || "UPI Payment")}
              {step === "card" && "Card Payment"}
              {step === "processing" && "Processing"}
              {step === "success" && "Payment Successful"}
            </h2>
          </div>
          {step === "method" && (
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition">
              <X size={20} className="text-gray-500" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            
            {/* ====== STEP 1: METHOD SELECTION ====== */}
            {step === "method" && (
              <motion.div
                key="method"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-5"
              >
                {/* Timer Bar */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Timer size={16} className="text-[#F37021]" />
                      Offer expires in
                    </span>
                    <span className={`font-mono font-bold ${timeLeft < 60 ? "text-red-500" : "text-[#1A2A49]"}`}>
                      {minutes}:{seconds}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#F37021] to-[#FF8C42]"
                      initial={{ width: "100%" }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </div>
                </div>

                {/* Amount */}
                <div className="bg-gradient-to-r from-[#1A2A49] to-[#223a61] rounded-2xl p-5 text-white mb-6">
                  <p className="text-sm opacity-80">Amount to Pay</p>
                  <p className="text-3xl font-bold mt-1">₹{amount}</p>
                  <p className="text-xs opacity-60 mt-2">Inclusive of all taxes</p>
                </div>

                {/* UPI Apps Grid */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">Pay with UPI</p>
                  <div className="grid grid-cols-4 gap-3">
                    {upiApps.map((app) => (
                      <motion.button
                        key={app.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedUpiApp(app)
                          setSelectedMethod("upi")
                          setStep("upi")
                        }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition border border-gray-200"
                      >
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${app.color}15` }}
                        >
                          <img src={app.icon} alt={app.name} className="w-8 h-8 object-contain" />
                        </div>
                        <span className="text-xs font-medium text-gray-700">{app.name.split(" ")[0]}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Other Methods */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-2">Other Payment Methods</p>
                  
                  <button
                    onClick={() => {
                      setSelectedMethod("card")
                      setStep("card")
                    }}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#1A2A49] hover:bg-gray-50 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                      <CreditCard size={20} className="text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700">Credit / Debit Card</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedMethod("netbanking")
                      setStep("processing")
                    }}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#1A2A49] hover:bg-gray-50 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                      <Building size={20} className="text-green-600" />
                    </div>
                    <span className="font-medium text-gray-700">Netbanking</span>
                  </button>

                  <button
                    onClick={() => {
                      const txId = generateTransactionId()
                      setTransactionId(txId)
                      setStep("success")
                    }}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#1A2A49] hover:bg-gray-50 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                      <Wallet size={20} className="text-orange-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-medium text-gray-700">Cash on Delivery</span>
                      <p className="text-xs text-gray-500">Pay when service is completed</p>
                    </div>
                  </button>
                </div>

                {/* Security Badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Shield size={14} className="text-green-600" />
                  <span>100% Secure & Encrypted Payments</span>
                </div>
              </motion.div>
            )}

            {/* ====== STEP: UPI INPUT ====== */}
            {step === "upi" && (
              <motion.div
                key="upi"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-5"
              >
                {/* Selected App */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl mb-6">
                  <img src={selectedUpiApp?.icon} alt={selectedUpiApp?.name} className="w-10 h-10" />
                  <div>
                    <p className="font-medium">{selectedUpiApp?.name}</p>
                    <p className="text-xs text-gray-500">Pay directly from your bank account</p>
                  </div>
                </div>

                {/* Amount */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600">Amount to Pay</p>
                  <p className="text-3xl font-bold text-[#1A2A49]">₹{amount}</p>
                </div>

                {/* UPI ID Input */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Enter UPI ID</label>
                  <div className="relative">
                    <Smartphone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="username@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A49] text-sm"
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Example: 9876543210@paytm</p>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={!upiId}
                  className={`w-full py-3.5 rounded-xl font-semibold text-white transition ${
                    upiId 
                      ? "bg-[#1A2A49] hover:bg-[#223a61]" 
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Verify & Pay ₹{amount}
                </button>

                <button
                  onClick={() => {
                    setStep("method")
                    setSelectedUpiApp(null)
                  }}
                  className="w-full mt-3 py-3 text-gray-500 font-medium hover:text-gray-700"
                >
                  Choose Another Method
                </button>
              </motion.div>
            )}

            {/* ====== STEP: CARD PAYMENT ====== */}
            {step === "card" && (
              <motion.div
                key="card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-5"
              >
                {/* Card Preview */}
                <div className="bg-gradient-to-r from-[#1A2A49] to-[#2A3A59] rounded-2xl p-5 mb-6 text-white">
                  <p className="text-xs opacity-60 mb-4">CARD PREVIEW</p>
                  <p className="font-mono text-lg mb-4">
                    {cardForm.number || "•••• •••• •••• ••••"}
                  </p>
                  <div className="flex justify-between">
                    <p>{cardForm.name || "CARDHOLDER NAME"}</p>
                    <p>{cardForm.expiry || "MM/YY"}</p>
                  </div>
                </div>

                {/* Amount */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600">Amount to Pay</p>
                  <p className="text-3xl font-bold text-[#1A2A49]">₹{amount}</p>
                </div>

                {/* Card Form */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Card Number</label>
                    <div className="relative">
                      <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        value={cardForm.number}
                        onChange={(e) => setCardForm({ ...cardForm, number: formatCardNumber(e.target.value) })}
                        maxLength={19}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A49] text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardForm.expiry}
                        onChange={(e) => setCardForm({ ...cardForm, expiry: formatExpiry(e.target.value) })}
                        maxLength={5}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A49] text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        value={cardForm.cvv}
                        onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.slice(0, 3) })}
                        maxLength={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A49] text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Rajesh Sharma"
                      value={cardForm.name}
                      onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A49] text-sm"
                    />
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={!cardForm.number || !cardForm.expiry || !cardForm.cvv || !cardForm.name}
                  className={`w-full mt-6 py-3.5 rounded-xl font-semibold text-white transition ${
                    cardForm.number && cardForm.expiry && cardForm.cvv && cardForm.name
                      ? "bg-[#1A2A49] hover:bg-[#223a61]" 
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Pay ₹{amount} Securely
                </button>
              </motion.div>
            )}

            {/* ====== STEP: PROCESSING ====== */}
            {step === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 flex flex-col items-center text-center"
              >
                {/* Animated Circles */}
                <div className="relative w-24 h-24 mb-6">
                  <motion.div
                    className="absolute inset-0 border-4 border-[#1A2A49] border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>

                <h3 className="text-xl font-bold text-[#1A2A49] mb-2">
                  {processingStep === 0 && "Verifying Details..."}
                  {processingStep === 1 && "Processing Payment..."}
                  {processingStep === 2 && "Confirming..."}
                </h3>
                <p className="text-gray-500 text-sm">Please don't close this window</p>

                {/* Progress Steps */}
                <div className="flex items-center gap-8 mt-8">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${processingStep >= 0 ? "bg-[#1A2A49]" : "bg-gray-300"}`} />
                    <span className="text-xs mt-1 text-gray-500">Verify</span>
                  </div>
                  <div className="w-12 h-0.5 bg-gray-200">
                    <motion.div
                      className="h-full bg-[#1A2A49]"
                      initial={{ width: "0%" }}
                      animate={{ width: processingStep >= 1 ? "100%" : "0%" }}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${processingStep >= 1 ? "bg-[#1A2A49]" : "bg-gray-300"}`} />
                    <span className="text-xs mt-1 text-gray-500">Process</span>
                  </div>
                  <div className="w-12 h-0.5 bg-gray-200">
                    <motion.div
                      className="h-full bg-[#1A2A49]"
                      initial={{ width: "0%" }}
                      animate={{ width: processingStep >= 2 ? "100%" : "0%" }}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${processingStep >= 2 ? "bg-[#1A2A49]" : "bg-gray-300"}`} />
                    <span className="text-xs mt-1 text-gray-500">Confirm</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-8">Secured by SSL Encryption</p>
              </motion.div>
            )}

            {/* ====== STEP: SUCCESS ====== */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 flex flex-col items-center text-center"
              >
                {/* Lottie Success Animation */}
                <div className="w-32 h-32 mb-4">
                  <DotLottieReact src={successAnim} loop={false} autoplay />
                </div>

                <h3 className="text-2xl font-bold text-[#1A2A49] mb-1">Payment Successful!</h3>
                <p className="text-gray-600 mb-4">₹{amount} paid to Pluggy</p>

                {/* Transaction Details */}
                <div className="bg-gray-50 rounded-xl p-4 w-full mb-4">
                  <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#1A2A49]">{transactionId}</span>
                    <button
                      onClick={copyTransactionId}
                      className="p-1.5 hover:bg-gray-200 rounded-lg transition"
                    >
                      {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">Date & Time</p>
                  <p className="text-sm text-gray-700">{new Date().toLocaleString()}</p>
                </div>

                {/* Success Message */}
                <div className="flex items-center gap-2 text-green-600 mb-6">
                  <CheckCircle2 size={18} />
                  <span className="text-sm">Booking Confirmed Successfully</span>
                </div>

                {/* Done Button */}
                <button
                  onClick={handleSuccess}
                  className="w-full py-3.5 bg-[#1A2A49] text-white rounded-xl font-semibold hover:bg-[#223a61] transition"
                >
                  Done
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Security Footer */}
        {step !== "success" && step !== "processing" && (
          <div className="border-t px-5 py-3 bg-gray-50">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Shield size={12} className="text-green-600" /> 100% Secure
              </span>
              <span>•</span>
              <span>SSL Encrypted</span>
              <span>•</span>
              <span>24/7 Support</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}