import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import toast from "react-hot-toast"
import { sendRequestEmail } from "../lib/email"
import { ChevronLeft, Shield, Info, AlarmClock, Home } from "lucide-react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import successAnim from "../assets/success.lottie"
import PaymentPopup from "../components/PaymentPopup"

export default function RequestForm() {
  const { service } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const stored = localStorage.getItem("pluggy_user")
  const user = stored ? JSON.parse(stored) : null

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const cleanService = service.replace(/-/g, " ")

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    issue: location.state?.selectedIssue?.issue || location.state?.selectedIssue || "",
  })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const saveRequest = async () => {
    const created_at = new Date().toLocaleString()
    const newReq = {
      id: Date.now(),
      service: cleanService,
      name: form.name,
      email: form.email,
      phone: form.phone,
      issue: form.issue,
      amount: location.state?.finalAmount || null,
      status: "Confirmed",
      created_at,
    }

    const saved = localStorage.getItem("pluggy_requests")
    const requests = saved ? JSON.parse(saved) : []
    localStorage.setItem("pluggy_requests", JSON.stringify([...requests, newReq]))

    try {
      await sendRequestEmail({
        user_name: form.name,
        user_email: form.email,
        user_phone: form.phone,
        service: cleanService,
        issue: form.issue,
        amount: newReq.amount,
        created_at,
      })
      toast.success("Request submitted & emailed ✅")
    } catch (err) {
      console.error(err)
      toast.error("Request saved but email failed ❌")
    } finally {
      setSubmitted(true)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.issue) {
      toast.error("Please select an issue first ❌")
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setPaymentOpen(true)
    }, 800)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-8 text-center">
          <div className="w-40 h-40 mx-auto">
            <DotLottieReact src={successAnim} loop={false} autoplay />
          </div>
          <h2 className="text-2xl font-bold text-[#1A2A49] mt-4">Request Submitted</h2>
          <p className="text-gray-600 mt-2">
            Your request for <span className="font-semibold">{cleanService}</span> has been received.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/account", { state: { tab: "track" } })}
              className="px-5 py-2 rounded-lg bg-[#1A2A49] text-white hover:bg-[#223a61]"
            >
              Track your request
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-md">
          <h2 className="text-xl font-bold text-[#1A2A49] mb-4">Please log in first</h2>
          <p className="text-gray-600 mb-6">You need to log in or sign up before raising a request.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate("/login")} className="px-5 py-2 bg-[#1A2A49] text-white rounded-lg hover:bg-[#223a61]">
              Log In
            </button>
            <button onClick={() => navigate("/signup")} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-700 hover:text-[#1A2A49]">
            <ChevronLeft size={20} />
            <span className="text-sm">Back</span>
          </button>
          <button onClick={() => navigate("/")} className="flex items-center gap-1 text-gray-700 hover:text-[#1A2A49]">
            <Home size={20} />
            <span className="text-sm">Home</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        {/* Info */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#1A2A49] text-white flex items-center justify-center">
              <AlarmClock size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1A2A49]">Raise a Request</h2>
              <p className="text-xs text-gray-500">{cleanService}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-3">
              <Shield size={18} className="text-[#1A2A49]" />
              <p className="text-sm text-gray-600">Verified technicians, 30 days service guarantee</p>
            </div>
            <div className="flex items-start gap-3">
              <Info size={18} className="text-[#1A2A49]" />
              <p className="text-sm text-gray-600">Please describe the issue clearly.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-[#1A2A49] mb-4">Your Details</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input name="name"  value={form.name}  onChange={handleChange}  placeholder="Full Name"     className="w-full rounded-lg border px-4 py-3" required />
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email Address" className="w-full rounded-lg border px-4 py-3" required />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="w-full rounded-lg border px-4 py-3" required />
            <textarea name="issue" value={form.issue} onChange={handleChange} placeholder="Describe your issue" rows={4} className="w-full rounded-lg border px-4 py-3" required />

            <div className="text-xs text-gray-500 -mt-2">
              Note: Labour charge ₹50 will be added to the selected issue charge at payment step.
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button type="button" onClick={() => navigate("/")} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-[#1A2A49] text-white hover:bg-[#223a61] disabled:opacity-60">
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Payment Popup */}
      <PaymentPopup
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        amount={location.state?.finalAmount || 0}
        onSuccess={() => saveRequest()}
      />
    </div>
  )
}
