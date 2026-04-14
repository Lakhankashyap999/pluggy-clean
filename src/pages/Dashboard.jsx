// src/pages/Dashboard.jsx
import { useState, useEffect } from "react"
import Slider from "../components/Slider"
import { Search, SlidersHorizontal, X, Sparkles, TrendingUp, Copy, Check } from "lucide-react"
import WhyChooseUs from "../components/WhyChooseUs"
import OurServices from "../components/OurServices"
import FilterDrawer from "../components/FilterDrawer"
import FilteredResults from "../components/FilteredResults"
import CustomerReviews from "../components/CustomerReviews"
import ExtraSections from "../components/ExtraSections"
import MarqueeSection from "../components/MarqueeSection"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useApp } from "../AppContext"

// ✨ TYPEWRITER CUSTOM HOOK ✨
const useTypewriter = (words, speed = 150, deleteSpeed = 80, pauseTime = 2000) => {
  const [displayText, setDisplayText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
        } else {
          setIsDeleting(false)
          setWordIndex((prev) => (prev + 1) % words.length)
        }
      }
    }, isDeleting ? deleteSpeed : speed)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, wordIndex, words, speed, deleteSpeed, pauseTime])

  return displayText
}

// 🟢 Live Activity Ticker Data
const liveActivities = [
  "Rajesh from Andheri just booked AC Repair",
  "Priya from Bandra booked Fan Motor Service",
  "Amit from Juhu booked MCB Repair",
  "Sneha from Powai booked Wiring Service",
  "Vikram from Borivali booked Geyser Repair",
]

// 🔥 Trending Services Data
const trendingServices = [
  { name: "AC Gas Refill", bookings: 120, icon: "❄️" },
  { name: "MCB Repair", bookings: 85, icon: "⚡" },
  { name: "Geyser Installation", bookings: 60, icon: "🔥" },
  { name: "Fan Motor Repair", bookings: 45, icon: "🌀" },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useApp()

  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [seeMoreOpen, setSeeMoreOpen] = useState(false)
  
  // 🆕 New States
  const [showOfferBar, setShowOfferBar] = useState(true)
  const [copied, setCopied] = useState(false)
  const [currentActivity, setCurrentActivity] = useState(0)
  const [welcomePopup, setWelcomePopup] = useState(false)

  // ✅ Service suggestions
  const serviceSuggestions = [
    "AC Repair",
    "AC Installation",
    "Fan Motor Repair",
    "Ceiling Fan Installation",
    "House Wiring",
    "Short Circuit Fix",
    "Switchboard Repair",
    "Fuse Replacement",
    "MCB Repair",
    "New Electrical Fittings",
  ]

  const placeholder = useTypewriter(serviceSuggestions, 120, 60, 2000)

  // 🟢 Auto-rotate live activity
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % liveActivities.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // 🎉 Welcome Popup for new users (5 sec delay)
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("pluggy_welcome_seen")
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setWelcomePopup(true)
        localStorage.setItem("pluggy_welcome_seen", "true")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleCopyCode = () => {
    navigator.clipboard?.writeText("PLUGGY20")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 🔍 Handle search
  const handleChange = (e) => {
    const value = e.target.value.toLowerCase()
    setQuery(value)
    if (!value) {
      setSuggestions([])
      return
    }
    const matches = serviceSuggestions.filter((s) =>
      s.toLowerCase().includes(value)
    )
    setSuggestions(matches)
  }

  const handleSearch = (text) => {
    if (!user) {
      alert("Please login first to search services!")
      navigate("/login")
      return
    }
    const q = text || query
    if (q.trim()) {
      navigate(`/request/${q.replace(/\s+/g, "-").toLowerCase()}`)
      setQuery("")
      setSuggestions([])
      setSearchOpen(false)
    }
  }

  const handleProtectedAction = (path) => {
    if (!user) {
      alert("Please login first to perform this action!")
      navigate("/login")
      return
    }
    navigate(path)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F9]">
      {/* ====== STICKY OFFER BAR ====== */}
      <AnimatePresence>
        {showOfferBar && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-[#F37021] to-[#FF8C42] text-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="animate-pulse" />
                <span className="font-medium">🔥 Summer Special: 25% OFF on AC Repair</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-mono">SUMMER25</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleProtectedAction("/book-service")}
                  className="bg-white text-[#F37021] px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-100 transition"
                >
                  Claim
                </button>
                <button onClick={() => setShowOfferBar(false)} className="hover:bg-white/20 p-1 rounded">
                  <X size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== Search Bar (Desktop) ====== */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-40 w-full px-4 sm:px-6 py-3 bg-white/80 backdrop-blur-md hidden sm:block border-b border-gray-200"
      >
        <div className="relative flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm max-w-full sm:max-w-md lg:max-w-2xl mx-auto">
          <Search size={18} className="text-gray-400 ml-2" />
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={`Try "${placeholder}"`}
            className="flex-1 bg-transparent border-none focus:outline-none px-2 py-1 text-sm sm:text-base placeholder-gray-500"
          />
          <span className="w-0.5 h-5 bg-[#F37021] animate-pulse"></span>
          
          <button
            onClick={() => handleSearch()}
            className="p-2 bg-[#1A2A49] text-white rounded-full hover:bg-[#223a61] transition"
          >
            <Search size={18} />
          </button>
          <button
            onClick={() => setFilterOpen(true)}
            className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 bg-white"
          >
            <SlidersHorizontal size={18} className="text-[#1A2A49]" />
          </button>

          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => handleSearch(s)}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ====== Search Drawer (Mobile) ====== */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end sm:hidden"
          >
            <div className="bg-white rounded-t-2xl w-full p-4 shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-[#1A2A49]">Search Services</h3>
                <button onClick={() => setSearchOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={handleChange}
                  placeholder={`Try "${placeholder}"`}
                  className="w-full border rounded-lg px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A49]"
                />
                <span className="absolute right-3 top-3 w-0.5 h-5 bg-[#F37021] animate-pulse"></span>
              </div>
              {suggestions.length > 0 && (
                <div className="max-h-40 overflow-y-auto border rounded-lg mb-3">
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      onClick={() => handleSearch(s)}
                      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => handleSearch()}
                className="w-full py-2 bg-[#1A2A49] text-white rounded-lg hover:bg-[#223a61]"
              >
                Search
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== Filter Drawer ====== */}
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={(filters) => {
          setAppliedFilters(filters)
          setFilterOpen(false)
        }}
      />

      {/* ====== Main Dashboard Content ====== */}
      <div className="flex-1">
        {appliedFilters ? (
          <FilteredResults filters={appliedFilters} />
        ) : (
          <>
            {/* Hero Slider */}
            <section>
              <Slider />
            </section>

            {/* ====== Hero Section ====== */}
            <section className="bg-gradient-to-br from-[#F4F6F9] via-white to-[#EDF0F3] px-4 sm:px-6 lg:px-12 py-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Mobile: Image First */}
              <motion.img
                src="../image/Electrician-rafiki.png"
                alt="Home Services"
                className="w-full max-w-md rounded-xl lg:hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              />
              
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1 space-y-4"
              >
                {/* Welcome Back Message */}
                {user && (
                  <p className="text-[#F37021] font-medium text-sm">
                    👋 Welcome back, {user.name?.split(" ")[0] || "User"}!
                  </p>
                )}
                
                <h2 className="text-2xl sm:text-4xl font-bold text-[#1A2A49] leading-snug">
                  Reliable Home Services, <br className="hidden sm:block" /> Anytime, Anywhere 🚀
                </h2>
                
                {/* Trust Badges in Chips */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  <span className="bg-white px-3 py-1.5 rounded-full text-sm shadow-sm border border-gray-100">
                    ⭐ <span className="font-semibold">4.8</span> Rating
                  </span>
                  <span className="bg-white px-3 py-1.5 rounded-full text-sm shadow-sm border border-gray-100">
                    🏠 <span className="font-semibold">10,000+</span> Homes
                  </span>
                  <span className="bg-white px-3 py-1.5 rounded-full text-sm shadow-sm border border-gray-100">
                    👨‍🔧 <span className="font-semibold">500+</span> Experts
                  </span>
                </div>

                {/* Limited Slots Badge */}
                <div className="bg-red-50 border border-red-200 rounded-full px-4 py-1.5">
                  <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    ⏰ Only 3 slots left for today!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={() => handleProtectedAction("/book-service")}
                    className="px-6 py-3 bg-[#1A2A49] text-white rounded-full shadow-lg hover:bg-[#223a61] transition font-medium"
                  >
                    Book a Service
                  </button>
                  <a
                    href="tel:+919876543210"
                    className="px-6 py-3 border-2 border-[#1A2A49] text-[#1A2A49] rounded-full hover:bg-[#1A2A49] hover:text-white transition font-medium text-center"
                  >
                    📞 Call Us
                  </a>
                </div>
              </motion.div>
              
              {/* Desktop: Image Right */}
              <motion.div
                className="relative hidden lg:block"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-30 -z-10"></div>
                <motion.img
                  src="../image/Electrician-rafiki.png"
                  alt="Home Services"
                  className="w-full max-w-md rounded-xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Badge on Image */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-full px-4 py-2 border border-gray-100">
                  <p className="text-sm font-medium text-[#1A2A49]">
                    ⚡ 500+ Verified Experts
                  </p>
                </div>
              </motion.div>
            </section>

            {/* ====== Live Activity Ticker ====== */}
            <section className="border-y border-gray-200 py-3 overflow-hidden bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <motion.div
                  key={currentActivity}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-2 text-sm text-gray-600"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span>{liveActivities[currentActivity]}</span>
                </motion.div>
              </div>
            </section>

            {/* ====== Our Services Section ====== */}
            <section className="px-4 sm:px-6 lg:px-12 py-12 bg-[#F4F6F9]">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-[#1A2A49]">Our Services</h2>
                  <p className="text-gray-500 text-sm mt-1">Choose from our most popular services</p>
                </div>
                <button
                  onClick={() => handleProtectedAction("/book-service")}
                  className="text-[#F37021] font-medium hover:underline flex items-center gap-1"
                >
                  View All <span className="text-lg">→</span>
                </button>
              </div>
              <OurServices
                onClickService={(serviceKey) =>
                  handleProtectedAction(`/service/${serviceKey}`)
                }
              />
            </section>

            {/* ====== Trending Services ====== */}
            <section className="px-4 sm:px-6 lg:px-12 py-8 bg-[#EDF0F3]">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp size={24} className="text-[#F37021]" />
                  <h3 className="text-xl font-bold text-[#1A2A49]">Trending This Week</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {trendingServices.map((service, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition"
                      onClick={() => handleProtectedAction(`/request/${service.name.replace(/\s+/g, "-").toLowerCase()}`)}
                    >
                      <span className="text-2xl">{service.icon}</span>
                      <p className="font-medium text-[#1A2A49] mt-2">{service.name}</p>
                      <p className="text-xs text-gray-500">{service.bookings}+ bookings</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* ====== Why Choose Us ====== */}
            <section className="px-4 sm:px-6 lg:px-12 py-16 bg-[#1A2A49] text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Why Choose Pluggy?</h2>
              <p className="text-gray-300 mb-12 text-sm sm:text-base">
                Our Advantage – Trusted by thousands of happy customers
              </p>
              <WhyChooseUs />
            </section>

            {/* ====== Customer Reviews ====== */}
            <section className="px-4 sm:px-6 lg:px-12 py-12 bg-[#F4F6F9]">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-3xl font-bold text-[#1A2A49]">4.8</span>
                  <span className="text-yellow-500 text-2xl">★★★★★</span>
                  <span className="text-gray-500 text-sm">(2,500+ reviews)</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1A2A49]">What Our Customers Say</h2>
              </div>
              <CustomerReviews />
            </section>

            {/* ====== Extra Sections ====== */}
            <section className="px-4 sm:px-6 lg:px-12 py-10 bg-white">
              <ExtraSections />
            </section>

            {/* ====== Marquee Section ====== */}
            <section>
              <MarqueeSection />
            </section>
          </>
        )}
      </div>

      {/* ====== Welcome Offer Popup ====== */}
      <AnimatePresence>
        {welcomePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
            onClick={() => setWelcomePopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setWelcomePopup(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <div className="text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-[#1A2A49] mb-2">Welcome to Pluggy!</h3>
                <p className="text-gray-600 mb-4">Get 20% OFF on your first service</p>
                
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-500 mb-1">Your Coupon Code</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-mono font-bold text-[#1A2A49]">PLUGGY20</span>
                    <button
                      onClick={handleCopyCode}
                      className="p-2 hover:bg-gray-200 rounded-lg transition"
                    >
                      {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setWelcomePopup(false)
                    handleProtectedAction("/book-service")
                  }}
                  className="w-full py-3 bg-[#F37021] text-white rounded-full font-medium hover:bg-[#E05E15] transition"
                >
                  Book Your First Service
                </button>
                
                <p className="text-xs text-gray-400 mt-3">Valid for new users only. Terms apply.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== See More Popup ====== */}
      <AnimatePresence>
        {seeMoreOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative"
            >
              <button
                onClick={() => setSeeMoreOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X size={22} />
              </button>

              <h3 className="text-xl font-bold text-[#1A2A49] mb-4">More Services</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <li>🔧 Geyser Repair</li>
                <li>🚿 Water Purifier Installation</li>
                <li>🧹 Deep Cleaning</li>
                <li>🪟 Window Repair</li>
                <li>📺 TV Wall Mount</li>
                <li>🚪 Door Lock Fix</li>
                <li>🛠️ Modular Kitchen Setup</li>
                <li>💡 Smart Home Automation</li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}