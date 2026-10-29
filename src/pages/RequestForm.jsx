import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import toast from "react-hot-toast"
import { sendRequestEmail } from "../lib/email"
import { ChevronLeft, Shield, Info, AlarmClock, Home, MapPin, KeyRound } from "lucide-react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import successAnim from "../assets/success.lottie"
import PaymentPopup from "../components/PaymentPopup"
import { useApp } from "../AppContext"

export default function RequestForm() {
  const { service } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const {
    user,
    requireCustomerLogin,
    addRequest,
    address: savedAddress,
    setAddress: setGlobalAddress,
    clearCart,
  } = useApp()

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const cleanService = (service || "Home Service").replace(/-/g, " ")

  const initialIssue =
    (Array.isArray(location.state?.selectedItems) && location.state.selectedItems.length > 0
      ? location.state.selectedItems.map((i) => i.name || i.issue).join(", ")
      : "") ||
    location.state?.selectedIssue?.issue ||
    (typeof location.state?.selectedIssue === "string" ? location.state.selectedIssue : "") ||
    cleanService

  const resolvedAmount =
    location.state?.finalTotal || location.state?.finalAmount || 249

  const [form, setForm] = useState({
    name: user?.name || "Customer",
    email: user?.email || "",
    phone: user?.phone || "+91 9876543210",
    issue: initialIssue,
    address: location.state?.address || savedAddress || "",
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const saveRequest = async (transactionId, paymentMeta = {}) => {
    const createdAt = new Date().toISOString()
    if (form.address) setGlobalAddress(form.address)

    const newReq = {
      id: Date.now(),
      transactionId: transactionId || paymentMeta?.transactionId || `PLG${String(Date.now()).slice(-8)}`,
      paymentMethod: paymentMeta?.paymentMethod || "UPI",
      paymentChannel: paymentMeta?.paymentChannel || "Pluggy Instant UPI",
      paymentStatus:
        paymentMeta?.paymentMethod === "PAY_AFTER_SERVICE"
          ? "PAY_ON_COMPLETION"
          : "ESCROW_HELD",
      service: cleanService.replace(/\b\w/g, (c) => c.toUpperCase()),
      userName: form.name || "Customer",
      userEmail: form.email,
      userPhone: form.phone || "+91 9876543210",
      issue: form.issue,
      amount: resolvedAmount,
      address: form.address,
      userAddress: form.address,
      status: "PENDING_EXECUTIVE",
      createdAt,
    }

    addRequest(newReq)
    if (Array.isArray(location.state?.selectedItems) && location.state.selectedItems.length > 0) {
      clearCart()
    }

    try {
      await sendRequestEmail({
        user_name: form.name,
        user_email: form.email,
        user_phone: form.phone,
        service: cleanService,
        issue: form.issue,
        amount: newReq.amount,
        address: form.address,
        created_at: new Date(createdAt).toLocaleString(),
      })
      toast.success("Booking confirmed with 4-Digit Start & Happy PINs! ✅")
    } catch (err) {
      console.error(err)
      toast.success("Booking confirmed with 4-Digit Start & Happy PINs! ✅")
    } finally {
      setSubmitted(true)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!user) {
      requireCustomerLogin("Service book aur payment karne ke liye pehle login karein!")
      return
    }
    if (!form.issue.trim()) {
      toast.error("Please describe your issue first ❌")
      return
    }
    if (!form.address.trim()) {
      toast.error("Please enter service address ❌")
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setPaymentOpen(true)
    }, 400)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] pt-[128px] flex items-center justify-center px-4 pb-16">
        <div className="bg-white w-full max-w-xl rounded-3xl shadow-lg p-6 sm:p-8 text-center border border-gray-200">
          <div className="w-32 sm:w-40 h-32 sm:h-40 mx-auto">
            <DotLottieReact src={successAnim} loop={false} autoplay />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A2A49] mt-4">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-2">
            Your doorstep request for{" "}
            <span className="font-bold capitalize text-[#1A2A49]">{cleanService}</span> has been
            sent to the Pluggy 24/7 Control Desk. Your 4-Digit Start PIN & Happy PIN are ready!
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/track")}
              className="px-6 py-3 rounded-xl bg-[#F37021] text-white hover:bg-[#e05e15] font-extrabold text-xs sm:text-sm shadow-md"
            >
              Track Live Request & View Start PIN →
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-xl border border-gray-300 text-[#1A2A49] hover:bg-gray-50 font-bold text-xs sm:text-sm"
            >
              Back to Storefront
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] pt-[92px] md:pt-[112px] pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Summary Box (5 Cols) */}
        <div className="md:col-span-5 bg-white rounded-3xl shadow-sm border border-gray-200/80 p-6 h-fit space-y-5">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-[#1A2A49]"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#F37021] text-[10px] font-extrabold uppercase">
              Instant Dispatch
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-[#1A2A49] text-white flex items-center justify-center shrink-0">
              <AlarmClock size={22} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#1A2A49] capitalize">{cleanService}</h2>
              <p className="text-xs text-gray-500">Doorstep Inspection & Repair</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-100 text-xs sm:text-sm">
            <div className="flex items-start gap-2.5">
              <Shield size={17} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-gray-600">
                <strong>30-Day QR Service Guarantee:</strong> Free re-visit if the same fault returns within 30 days.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <KeyRound size={17} className="text-[#F37021] shrink-0 mt-0.5" />
              <p className="text-gray-600">
                <strong>Dual-PIN Protection:</strong> You receive a 4-Digit Start PIN & Happy PIN immediately after booking.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Info size={17} className="text-[#1A2A49] shrink-0 mt-0.5" />
              <p className="text-gray-600">
                Total Payable:{" "}
                <span className="font-extrabold text-[#1A2A49] text-base">₹{resolvedAmount}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Form Box (7 Cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl shadow-sm border border-gray-200/80 p-6">
          <h3 className="text-lg font-extrabold text-[#1A2A49] mb-4">
            Confirm Doorstep Details
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-400 mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs sm:text-sm bg-[#F4F6F9]"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-400 mb-1">
                  Mobile Number
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs sm:text-sm bg-[#F4F6F9]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-400 mb-1">
                Complete Doorstep Address
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl px-3.5 py-2 bg-[#F4F6F9]">
                <MapPin size={16} className="text-[#F37021] mr-2 shrink-0" />
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House/Flat No, Society, Landmark..."
                  className="flex-1 outline-none text-xs sm:text-sm bg-transparent py-0.5"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-400 mb-1">
                Selected Services / Fault Description
              </label>
              <textarea
                name="issue"
                value={form.issue}
                onChange={handleChange}
                placeholder="Describe your issue"
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs sm:text-sm bg-[#F4F6F9]"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-[#F37021] text-white hover:bg-[#e05e15] disabled:opacity-60 font-extrabold text-xs sm:text-sm shadow-md"
              >
                {loading ? "Processing..." : `Confirm & Pay ₹${resolvedAmount} →`}
              </button>
            </div>
          </form>
        </div>
      </div>

      <PaymentPopup
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        amount={resolvedAmount}
        onSuccess={(txId, paymentMeta) => saveRequest(txId, paymentMeta)}
      />
    </div>
  )
}
