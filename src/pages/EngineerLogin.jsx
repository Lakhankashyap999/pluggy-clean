// src/pages/EngineerLogin.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../AppContext"
import { ShieldCheck, Phone, Lock, ArrowRight } from "lucide-react"
import toast from "react-hot-toast"

export default function EngineerLogin() {
  const { loginEngineer } = useApp()
  const navigate = useNavigate()
  
  const [step, setStep] = useState("phone") // phone, otp
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [loading, setLoading] = useState(false)

  // Mock engineers database
  const registeredEngineers = [
    { phone: "9876543210", name: "Mukesh Kumar", id: "ENG001" },
    { phone: "9876543211", name: "Suresh Yadav", id: "ENG002" },
  ]

  const sendOtp = () => {
    if (!phone || phone.length < 10) {
      toast.error("Enter valid phone number")
      return
    }

    const engineer = registeredEngineers.find(e => e.phone === phone)
    if (!engineer) {
      toast.error("Engineer not registered")
      return
    }

    setLoading(true)
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      setGeneratedOtp(code)
      setStep("otp")
      setLoading(false)
      toast.success(`OTP sent! Demo: ${code}`)
    }, 1000)
  }

  const verifyOtp = () => {
    if (otp !== generatedOtp) {
      toast.error("Invalid OTP")
      return
    }

    const engineer = registeredEngineers.find(e => e.phone === phone)
    loginEngineer(engineer)
    toast.success(`Welcome, ${engineer.name}!`)
    navigate("/engineer")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F6F9] to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-6 w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#1A2A49] to-[#F37021] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A2A49] font-poppins">Engineer Login</h2>
          <p className="text-gray-500 text-sm mt-1">Access your dashboard</p>
        </div>

        {step === "phone" ? (
          <>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Enter registered phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F37021] text-base"
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Demo: 9876543210</p>
            </div>

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white rounded-xl font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition"
            >
              {loading ? "Sending..." : "Send OTP"} <ArrowRight size={18} />
            </button>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Enter OTP</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F37021] text-base tracking-widest text-center"
                  maxLength={6}
                />
              </div>
            </div>

            <button
              onClick={verifyOtp}
              className="w-full py-4 bg-gradient-to-r from-[#F37021] to-[#FF8C42] text-white rounded-xl font-semibold text-base active:scale-[0.98] transition mb-3"
            >
              Verify & Login
            </button>

            <button
              onClick={() => {
                setStep("phone")
                setOtp("")
              }}
              className="w-full text-[#1A2A49] text-sm font-medium hover:underline"
            >
              ← Change phone number
            </button>
          </>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          Only registered engineers can login
        </p>
      </div>
    </div>
  )
}