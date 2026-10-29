import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import toast from "react-hot-toast"
import { sendRequestEmail } from "../lib/email"
import { ChevronLeft, Shield, Info, AlarmClock, Home, MapPin } from "lucide-react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import successAnim from "../assets/success.lottie"
import PaymentPopup from "../components/PaymentPopup"
import { useApp } from "../AppContext"

export default function RequestForm() {
  const { service } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, addRequest, address: savedAddress, setAddress: setGlobalAddress, clearCart } = useApp()

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const cleanService = (service || "Home Service").replace(/-/g, " ")

  const initialIssue =
    (Array.isArray(location.state?.selectedItems) && location.state.selectedItems.length > 0
      ? location.state.selectedItems.map((i) => i.issue).join(", ")
      : "") ||
    location.state?.selectedIssue?.issue ||
    (typeof location.state?.selectedIssue === "string" ? location.state.selectedIssue : "") ||
    cleanService

  const resolvedAmount =
    location.state?.finalTotal ||
    location.state?.finalAmount ||
    249

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    issue: initialIssue,
    address: location.state?.address || savedAddress || "",
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const saveRequest = async (transactionId) => {
    const createdAt = new Date().toISOString()
    if (form.address) setGlobalAddress(form.address)

    const newReq = {
      id: Date.now(),
      transactionId: transactionId || `PLG${String(Date.now()).slice(-8)}`,
      service: cleanService.replace(/\b\w/g, (c) => c.toUpperCase()),
      userName: form.name,
      userEmail: form.email,
      userPhone: form.phone,
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
      toast.success("Booking confirmed! ✅")
    } catch (err) {
      console.error(err)
      toast.success("Booking saved! ✅")
    } finally {
      setSubmitted(true)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
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
    }, 500)
  }

  // ✅ Success Page
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6 sm:p-8 text-center">
          <div className="w-32 sm:w-40 h-32 sm:h-40 mx-auto">
            <DotLottieReact src={successAnim} loop={false} autoplay />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1A2A49] mt-4">
            Request Submitted
          </h2>
          <p className="text-gray-600 mt-2">
            Your request for{" "}
            <span className="font-semibold capitalize">{cleanService}</span> has been
            received.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/account/track")}
              className="px-5 py-2.5 rounded-xl bg-[#1A2A49] text-white hover:bg-[#223a61] font-medium"
            >
              Track your request
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ✅ If user not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg text-center w-full max-w-md">
          <h2 className="text-lg sm:text-xl font-bold text-[#1A2A49] mb-4">
            Please log in first
          </h2>
          <p className="text-gray-600 mb-6">
            You need to log in or sign up before raising a request.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 bg-[#1A2A49] text-white rounded-lg hover:bg-[#223a61]"
            >
              Log In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ✅ Main Form
  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-gray-700 hover:text-[#1A2A49]"
          >
            <ChevronLeft size={20} />
            <span className="text-sm">Back</span>
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-gray-700 hover:text-[#1A2A49]"
          >
            <Home size={20} />
            <span className="text-sm">Home</span>
          </button>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info Box */}
        <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-6 h-fit">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#1A2A49] text-white flex items-center justify-center">
              <AlarmClock size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1A2A49]">
                Raise a Request
              </h2>
              <p className="text-xs text-gray-500 capitalize">{cleanService}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3">
              <Shield size={18} className="text-[#1A2A49]" />
              <p className="text-sm text-gray-600">
                Verified technicians, 30 days service guarantee
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Info size={18} className="text-[#1A2A49]" />
              <p className="text-sm text-gray-600">
                Estimated Total: <span className="font-bold text-[#1A2A49]">₹{resolvedAmount}</span> (incl. visit/labour charges)
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-[#1A2A49] mb-4">
            Your Details
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full rounded-lg border px-4 py-3 text-sm"
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address (Optional)"
              className="w-full rounded-lg border px-4 py-3 text-sm"
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full rounded-lg border px-4 py-3 text-sm"
              required
            />

            {/* ✅ Address Input */}
            <div className="flex items-center border rounded-lg px-3 py-2">
              <MapPin size={18} className="text-gray-400 mr-2" />
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Service Address"
                className="flex-1 outline-none text-sm py-1"
                required
              />
            </div>

            <textarea
              name="issue"
              value={form.issue}
              onChange={handleChange}
              placeholder="Describe your issue"
              rows={4}
              className="w-full rounded-lg border px-4 py-3 text-sm"
              required
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-[#1A2A49] text-white hover:bg-[#223a61] disabled:opacity-60 font-medium"
              >
                {loading ? "Processing..." : `Proceed to Pay ₹${resolvedAmount}`}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ✅ Payment Popup */}
      <PaymentPopup
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        amount={resolvedAmount}
        onSuccess={(txId) => saveRequest(txId)}
      />
    </div>
  )
}
