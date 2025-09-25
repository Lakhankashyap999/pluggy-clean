import { X, Timer, Smartphone, CreditCard, Banknote, Wallet } from "lucide-react"
import { useState, useEffect } from "react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import successAnim from "../assets/success.lottie" // ✅ tick animation

export default function PaymentPopup({ open, onClose, amount, onSuccess }) {
  const [method, setMethod] = useState("")
  const [success, setSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 min

  // ✅ Timer
  useEffect(() => {
    if (!open) return
    setTimeLeft(600)
    setSuccess(false)
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [open])

  if (!open) return null

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0")
  const seconds = String(timeLeft % 60).padStart(2, "0")

  const handlePay = () => {
    if (!method || timeLeft <= 0) return
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      onClose()
      if (onSuccess) onSuccess()
    }, 2000)
  }

  const paymentMethods = [
    { label: "UPI (GPay / PhonePe / Paytm)", icon: Smartphone },
    { label: "Debit / Credit Card", icon: CreditCard },
    { label: "Netbanking", icon: Banknote },
    { label: "Cash on Delivery (COD)", icon: Wallet },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-0">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-6 sm:p-7 z-10">
        {!success ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-lg font-bold text-[#1A2A49]">Complete Your Payment</h2>
              <button onClick={onClose}>
                <X size={22} className="text-gray-500 hover:text-black" />
              </button>
            </div>

            {/* Timer */}
            <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
              <Timer size={16} className="text-red-500 shrink-0" />
              {timeLeft > 0 ? (
                <span>
                  Session expires in{" "}
                  <span className="font-semibold text-red-600">
                    {minutes}:{seconds}
                  </span>
                </span>
              ) : (
                <span className="text-red-600 font-medium">❌ Session expired</span>
              )}
            </div>

            {/* Amount */}
            <div className="mt-4 p-3 rounded-lg bg-[#f9fafb] border">
              <p className="text-gray-600 text-sm">Amount to Pay</p>
              <p className="text-xl font-bold text-[#1A2A49]">₹{amount}</p>
            </div>

            {/* Payment Methods */}
            <div className="mt-5 space-y-3">
              {paymentMethods.map(({ label, icon: Icon }) => (
                <label
                  key={label}
                  className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition ${
                    method === label ? "border-[#1A2A49] bg-[#1A2A49]/5" : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    className="accent-[#1A2A49]"
                    checked={method === label}
                    onChange={() => setMethod(label)}
                    disabled={timeLeft <= 0}
                  />
                  <Icon size={20} className="text-[#1A2A49]" />
                  <span className="text-sm sm:text-base">{label}</span>
                </label>
              ))}
            </div>

            {/* Confirm Button */}
            <button
              onClick={handlePay}
              disabled={timeLeft <= 0 || !method}
              className={`mt-6 w-full py-3 rounded-lg text-base font-medium transition ${
                timeLeft > 0 && method
                  ? "bg-[#1A2A49] text-white hover:bg-[#223a61]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {timeLeft > 0 ? "Confirm Payment" : "Session Expired"}
            </button>
          </>
        ) : (
          // ✅ Success Screen
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-28 h-28 sm:w-36 sm:h-36">
              <DotLottieReact src={successAnim} loop={false} autoplay />
            </div>
            <p className="mt-5 text-lg sm:text-xl font-bold text-green-600">Payment Successful!</p>
            <p className="text-gray-500 text-sm mt-1">Technician will arrive shortly.</p>
          </div>
        )}
      </div>
    </div>
  )
}
