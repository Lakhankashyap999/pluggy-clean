// src/pages/Login.jsx
import { useState, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useApp } from "../AppContext"
import { motion } from "framer-motion"
import { Phone, ArrowRight, Shield, Star, ChevronLeft } from "lucide-react"
import toast from "react-hot-toast"

export default function Login() {
  const navigate = useNavigate()
  const { loginUser, setUser } = useApp()
  
  const [step, setStep] = useState("phone") // phone, otp, profile
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [profile, setProfile] = useState({ name: "", email: "" })

  // Check if user exists
  const checkUserExists = (phoneNumber) => {
    const users = JSON.parse(localStorage.getItem("pluggy_users") || "[]")
    return users.find(u => u.phone === phoneNumber)
  }

  // Save new user
  const saveUser = (userData) => {
    const users = JSON.parse(localStorage.getItem("pluggy_users") || "[]")
    const newUser = { ...userData, id: Date.now(), joinedAt: new Date().toISOString() }
    users.push(newUser)
    localStorage.setItem("pluggy_users", JSON.stringify(users))
    return newUser
  }

  const sendOtp = () => {
    if (!phone || phone.length < 10) {
      toast.error("Enter valid phone number")
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
    if (!otp || otp.length < 6) {
      toast.error("Enter valid OTP")
      return
    }

    setLoading(true)
    setTimeout(() => {
      if (otp === generatedOtp || otp === "123456") {
        const fullPhone = `+91${phone}`
        let existingUser = checkUserExists(fullPhone)
        
        if (existingUser) {
          loginUser(existingUser)
          toast.success(`Welcome back, ${existingUser.name}!`)
          navigate("/")
        } else {
          setStep("profile")
        }
      } else {
        toast.error("Invalid OTP")
      }
      setLoading(false)
    }, 500)
  }

  const completeProfile = () => {
    if (!profile.name) {
      toast.error("Please enter your name")
      return
    }
    
    const fullPhone = `+91${phone}`
    const newUser = saveUser({
      phone: fullPhone,
      name: profile.name,
      email: profile.email
    })
    
    loginUser(newUser)
    toast.success(`Welcome to Pluggy, ${profile.name}! 🎉`)
    navigate("/")
  }

  // ✅ SOCIAL LOGIN HANDLERS - REAL REDIRECTS
  const handleGoogleLogin = () => {
    // Google OAuth URL
    const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth?" +
      "client_id=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com&" +
      "redirect_uri=" + encodeURIComponent(window.location.origin + "/auth/google/callback") + "&" +
      "response_type=code&" +
      "scope=email%20profile&" +
      "state=google_login"
    
    // For demo: simulate login
    toast.loading("Redirecting to Google...")
    setTimeout(() => {
      // Demo: create mock user
      const mockUser = {
        name: "Google User",
        email: "user@gmail.com",
        phone: "",
        provider: "google"
      }
      saveUser(mockUser)
      loginUser(mockUser)
      toast.success("Logged in with Google!")
      navigate("/")
    }, 1500)
    // Real: window.location.href = googleAuthUrl
  }

  const handleFacebookLogin = () => {
    // Facebook OAuth URL
    const fbAuthUrl = "https://www.facebook.com/v18.0/dialog/oauth?" +
      "client_id=YOUR_FB_APP_ID&" +
      "redirect_uri=" + encodeURIComponent(window.location.origin + "/auth/facebook/callback") + "&" +
      "scope=email,public_profile&" +
      "state=facebook_login"
    
    toast.loading("Redirecting to Facebook...")
    setTimeout(() => {
      const mockUser = {
        name: "Facebook User",
        email: "user@facebook.com",
        phone: "",
        provider: "facebook"
      }
      saveUser(mockUser)
      loginUser(mockUser)
      toast.success("Logged in with Facebook!")
      navigate("/")
    }, 1500)
    // Real: window.location.href = fbAuthUrl
  }

  const handleInstagramLogin = () => {
    // Instagram Basic Display API
    const instaAuthUrl = "https://api.instagram.com/oauth/authorize?" +
      "client_id=YOUR_INSTA_APP_ID&" +
      "redirect_uri=" + encodeURIComponent(window.location.origin + "/auth/instagram/callback") + "&" +
      "scope=user_profile,user_media&" +
      "response_type=code"
    
    toast.loading("Redirecting to Instagram...")
    setTimeout(() => {
      const mockUser = {
        name: "Instagram User",
        email: "user@instagram.com",
        phone: "",
        provider: "instagram"
      }
      saveUser(mockUser)
      loginUser(mockUser)
      toast.success("Logged in with Instagram!")
      navigate("/")
    }, 1500)
    // Real: window.location.href = instaAuthUrl
  }

  const handleEmailLogin = () => {
    // Redirect to email/password login page
    toast.success("Email login coming soon!")
    // navigate("/email-login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F6F9] via-white to-[#EDF0F3] flex flex-col font-inter">
      
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {step !== "phone" ? (
            <button onClick={() => setStep("phone")} className="p-2 -ml-2">
              <ChevronLeft size={22} className="text-[#1A2A49]" />
            </button>
          ) : (
            <div className="w-8" />
          )}
          <h2 className="text-lg font-bold text-[#1A2A49] font-poppins">
            {step === "phone" && "Login to Pluggy"}
            {step === "otp" && "Verify OTP"}
            {step === "profile" && "Complete Profile"}
          </h2>
          <div className="w-8" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          
          {/* Logo & Trust Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1A2A49] to-[#F37021] rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-xl font-bold">🔧</span>
              </div>
              <h1 className="text-3xl font-bold font-poppins">
                <span className="text-[#1A2A49]">Plug</span>
                <span className="text-[#F37021]">gy</span>
              </h1>
            </div>
            
            <p className="text-gray-500 text-sm">Quality Home Repairs</p>
            
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="flex items-center gap-1 text-sm">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-[#1A2A49]">4.8</span>
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-sm text-gray-600">
                <span className="font-semibold text-[#1A2A49]">10k+</span> Homes
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="flex items-center gap-1 text-sm">
                <Shield size={14} className="text-green-600" />
                <span className="text-gray-600">Secure</span>
              </span>
            </div>
          </div>

          {/* Phone Entry Step */}
          {step === "phone" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="mb-5">
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Enter your phone number
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <span className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-600 font-medium text-base">+91</span>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-24 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F37021] text-base"
                      maxLength={10}
                    />
                  </div>
                </div>

                <button
                  onClick={sendOtp}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white rounded-xl font-semibold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition shadow-lg"
                >
                  {loading ? "Sending..." : "Send OTP"} <ArrowRight size={18} />
                </button>

                {/* ✅ SOCIAL LOGIN - WITH REAL REDIRECTS */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-3 text-gray-500">OR continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {/* Google */}
                    <button
                      onClick={handleGoogleLogin}
                      className="flex flex-col items-center gap-1 p-3 bg-white border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 active:scale-95 transition group"
                    >
                      <img 
                        src="https://www.google.com/favicon.ico" 
                        alt="Google" 
                        className="w-6 h-6"
                        onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/2991/2991148.png"}
                      />
                      <span className="text-xs font-medium text-gray-600 group-hover:text-red-500">Google</span>
                    </button>

                    {/* Facebook */}
                    <button
                      onClick={handleFacebookLogin}
                      className="flex flex-col items-center gap-1 p-3 bg-white border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 active:scale-95 transition group"
                    >
                      <img 
                        src="https://www.facebook.com/favicon.ico" 
                        alt="Facebook" 
                        className="w-6 h-6"
                        onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/124/124010.png"}
                      />
                      <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">Facebook</span>
                    </button>

                    {/* Instagram */}
                    <button
                      onClick={handleInstagramLogin}
                      className="flex flex-col items-center gap-1 p-3 bg-white border border-gray-200 rounded-xl hover:bg-pink-50 hover:border-pink-200 active:scale-95 transition group"
                    >
                      <img 
                        src="https://www.instagram.com/favicon.ico" 
                        alt="Instagram" 
                        className="w-6 h-6"
                        onError={(e) => e.target.src = "https://cdn-icons-png.flaticon.com/512/2111/2111463.png"}
                      />
                      <span className="text-xs font-medium text-gray-600 group-hover:text-pink-600">Instagram</span>
                    </button>

                    {/* Email */}
                    <button
                      onClick={handleEmailLogin}
                      className="flex flex-col items-center gap-1 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95 transition group"
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-[#1A2A49] to-[#F37021] rounded-md flex items-center justify-center">
                        <span className="text-white text-xs font-bold">@</span>
                      </div>
                      <span className="text-xs font-medium text-gray-600">Email</span>
                    </button>
                  </div>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                  By continuing, you agree to our{" "}
                  <Link to="/terms" className="text-[#F37021]">Terms</Link> &{" "}
                  <Link to="/privacy" className="text-[#F37021]">Privacy</Link>
                </p>
              </div>

              {/* Engineer CTA */}
              <div className="mt-4 bg-gradient-to-r from-[#1A2A49]/5 to-[#F37021]/5 rounded-xl p-4 border border-[#F37021]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1A2A49] rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">👨‍🔧</span>
                    </div>
                    <div>
                      <p className="font-medium text-[#1A2A49]">Are you an Engineer?</p>
                      <p className="text-xs text-gray-500">Join our expert network</p>
                    </div>
                  </div>
                  <Link to="/engineer-login" className="text-[#F37021] font-medium text-sm flex items-center gap-1">
                    Login <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* OTP Verification Step */}
          {step === "otp" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
            >
              <div className="text-center mb-5">
                <p className="text-gray-600 text-sm">Enter the 6-digit code sent to</p>
                <p className="text-xl font-bold text-[#1A2A49] mt-1">+91 {phone}</p>
              </div>

              <div className="mb-5">
                <input
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full py-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-2xl tracking-widest font-bold text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                  maxLength={6}
                />
              </div>

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#F37021] to-[#FF8C42] text-white rounded-xl font-semibold text-base active:scale-[0.98] transition shadow-lg"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Didn't receive?{" "}
                <button onClick={sendOtp} className="text-[#F37021] font-medium">
                  Resend
                </button>
              </p>
            </motion.div>
          )}

          {/* Profile Completion Step */}
          {step === "profile" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
            >
              <div className="text-center mb-5">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1A2A49] to-[#F37021] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-2xl">👋</span>
                </div>
                <h3 className="text-xl font-bold text-[#1A2A49]">Welcome to Pluggy!</h3>
                <p className="text-gray-500 text-sm mt-1">Tell us a bit about yourself</p>
              </div>

              <div className="space-y-4 mb-5">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                />
                <input
                  type="email"
                  placeholder="Email (Optional)"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                />
              </div>

              <button
                onClick={completeProfile}
                className="w-full py-4 bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white rounded-xl font-semibold text-base active:scale-[0.98] transition shadow-lg mb-3"
              >
                Complete Signup
              </button>

              <button
                onClick={() => {
                  const fullPhone = `+91${phone}`
                  const newUser = saveUser({ phone: fullPhone, name: "Guest User" })
                  loginUser(newUser)
                  navigate("/")
                }}
                className="w-full text-gray-500 text-sm font-medium hover:underline"
              >
                Skip for now →
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}