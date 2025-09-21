import { X, Timer } from "lucide-react"
import { useState, useEffect } from "react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import successAnim from "../assets/success.lottie" // ✅ tick animation

export default function PaymentPopup({ open, onClose, amount, onSuccess }) {
  const [method, setMethod] = useState("")
  const [success, setSuccess] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes

  // ✅ Timer logic
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-0">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-md rounded-xl shadow-lg p-5 sm:p-6 z-10">
        {!success ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-base sm:text-lg font-bold text-[#1A2A49]">
                Complete Your Payment
              </h2>
              <button onClick={onClose}>
                <X size={20} className="text-gray-500 hover:text-black" />
              </button>
            </div>

            {/* Timer */}
            <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Timer size={16} className="text-red-500 shrink-0" />
              {timeLeft > 0 ? (
                <span>
                  Session expires in{" "}
                  <span className="font-semibold text-red-600">
                    {minutes}:{seconds}
                  </span>
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  ❌ Payment session expired
                </span>
              )}
            </div>

            {/* Amount */}
            <p className="mt-4 text-gray-700 font-medium text-sm sm:text-base">
              Amount to Pay:{" "}
              <span className="text-[#1A2A49] font-bold">₹{amount}</span>
            </p>

            {/* Payment Methods */}
            <div className="mt-4 space-y-3">
              {[
                "UPI (GPay / PhonePe / Paytm)",
                "Debit/Credit Card",
                "Netbanking",
                "Cash on Delivery (COD)",
              ].map((m) => (
                <label
                  key={m}
                  className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
                >
                  <input
                    type="radio"
                    name="payment"
                    className="accent-[#1A2A49]"
                    checked={method === m}
                    onChange={() => setMethod(m)}
                    disabled={timeLeft <= 0}
                  />
                  {m}
                </label>
              ))}
            </div>

            {/* Confirm Button */}
            <button
              onClick={handlePay}
              disabled={timeLeft <= 0 || !method}
              className={`mt-6 w-full py-2 rounded-lg text-sm sm:text-base transition ${
                timeLeft > 0 && method
                  ? "bg-[#1A2A49] text-white hover:bg-[#223a61]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {timeLeft > 0 ? "Confirm Payment" : "Session Expired"}
            </button>
          </>
        ) : (
          // ✅ Success Animation Screen
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-24 h-24 sm:w-32 sm:h-32">
              <DotLottieReact src={successAnim} loop={false} autoplay />
            </div>
            <p className="mt-4 text-base sm:text-lg font-bold text-green-600">
              Payment Successful!
            </p>
            <p className="text-gray-500 text-xs sm:text-sm text-center">
              Technician will arrive shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
