// src/pages/Dashboard.jsx
import { useState, useEffect } from "react"
import Slider from "../components/Slider"
import {
  Sparkles,
  Copy,
  Check,
  Star,
  AlertTriangle,
  Video,
  Mic,
  PartyPopper,
  ShieldCheck,
  Wrench,
  Clock,
  Plus,
  ChevronRight,
  FileText,
  RefreshCw,
  QrCode,
  Zap,
  CheckCircle2,
  PhoneCall,
} from "lucide-react"
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
import {
  CATEGORIES_CATALOG,
  SYMPTOM_ESTIMATOR_DATA,
  MICRO_FIX_SERVICES,
  EVENT_STANDBY_PACKAGES,
  getAllServicesFlat,
} from "../data/servicesCatalog"
import toast from "react-hot-toast"

const liveActivities = [
  "Rajesh from Indirapuram just booked Split AC Power Jet Service (₹499)",
  "Priya from Sector 62 booked 15-Min Emergency MCB Trip SOS",
  "Sharma Family booked Shaadi Standby Electrician (8 Hours Event Guard)",
  "Amit from Vaishali approved ₹350 Havells Capacitor via Official Rate Card",
  "Sneha from Raj Nagar booked ₹79 Chota-Kaam Switch & Regulator Fix",
  "Vikram from Noida Extension used ₹29 Video Diagnosis Call & saved ₹249 visit fee",
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, cart, addToCart, applyCouponCode } = useApp()

  const [filterOpen, setFilterOpen] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState(null)
  const [showOfferBar, setShowOfferBar] = useState(true)
  const [copied, setCopied] = useState(false)
  const [currentActivity, setCurrentActivity] = useState(0)
  const [welcomePopup, setWelcomePopup] = useState(false)

  // Smart Fault & Cost Estimator State
  const [selectedApplianceIdx, setSelectedApplianceIdx] = useState(0)
  const [selectedSymptomIdx, setSelectedSymptomIdx] = useState(0)

  const currentAppliance = SYMPTOM_ESTIMATOR_DATA[selectedApplianceIdx] || SYMPTOM_ESTIMATOR_DATA[0]
  const currentSymptom =
    currentAppliance.symptoms[selectedSymptomIdx] || currentAppliance.symptoms[0]

  const popularServices = getAllServicesFlat()
    .filter((s) => s.popular)
    .slice(0, 8)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % liveActivities.length)
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("pluggy_welcome_seen")
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setWelcomePopup(true)
        localStorage.setItem("pluggy_welcome_seen", "true")
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleCopyCode = () => {
    navigator.clipboard?.writeText("PLUGGY20")
    applyCouponCode("PLUGGY20")
    setCopied(true)
    toast.success("Coupon PLUGGY20 copied & applied!")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleProtectedAction = (path) => {
    navigate(path)
  }

  const handleClaimSummerOffer = () => {
    applyCouponCode("SUMMER25")
    toast.success("Coupon SUMMER25 (25% OFF) applied!")
    navigate("/services")
  }

  const openConsultModal = (tab) => {
    window.dispatchEvent(new CustomEvent("pluggy:open-consult", { detail: { tab } }))
  }

  const openRateCardModal = (category = "ac-repair") => {
    window.dispatchEvent(new CustomEvent("pluggy:open-rate-card", { detail: { category } }))
  }

  const handleAddEstimatorService = () => {
    addToCart({
      id: `est-${currentAppliance.appliance}-${selectedSymptomIdx}`,
      name: `${currentAppliance.appliance}: ${currentSymptom.serviceName}`,
      price: currentSymptom.visitFee,
      category: currentAppliance.categorySlug,
      categoryName: currentAppliance.appliance,
      duration: "45 mins",
      warranty: "30 Days",
    })
    toast.success(`${currentSymptom.serviceName} added to cart!`)
    window.dispatchEvent(new CustomEvent("pluggy:open-cart"))
  }

  const handleAddMicroService = (micro) => {
    addToCart({
      id: micro.id,
      name: `${micro.name} (Gali-Pass Micro Fix)`,
      price: micro.price,
      category: micro.categorySlug,
      categoryName: "Chota-Kaam Express",
      duration: micro.time,
      warranty: "15 Days",
    })
    toast.success(`${micro.name} (₹${micro.price}) added to cart!`)
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] pt-[128px] md:pt-[138px]">
      {/* Top Offer Ribbon */}
      <AnimatePresence>
        {showOfferBar && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-[#F37021] via-[#e66417] to-[#FF8C42] text-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <Sparkles size={14} className="animate-pulse hidden sm:block" />
                <span className="font-bold">⚡ Summer Season Special: Flat 25% OFF on AC & Electrical</span>
                <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-mono font-bold">
                  SUMMER25
                </span>
                <span className="hidden lg:inline text-white/90 text-xs">
                  • 100% Fixed Spare Part Rate Card • 30-Day Warranty
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleClaimSummerOffer}
                  className="bg-white text-[#F37021] px-3 py-1 rounded-full text-xs font-bold hover:bg-gray-100 transition shadow-sm"
                >
                  Claim Offer
                </button>
                <button
                  onClick={() => setShowOfferBar(false)}
                  className="p-1 hover:bg-white/20 rounded text-xs"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={(f) => {
          setAppliedFilters(f)
          setFilterOpen(false)
        }}
      />

      {appliedFilters ? (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-semibold text-[#1A2A49]">Showing filtered services</span>
            <button
              onClick={() => setAppliedFilters(null)}
              className="text-xs text-[#F37021] font-bold hover:underline"
            >
              Clear Filters ✕
            </button>
          </div>
          <FilteredResults filters={appliedFilters} />
        </div>
      ) : (
        <>
          {/* ===================================================================
              1. 4-PILLAR PLUGGY EXCLUSIVE ACTION STRIP (Emergency / Function / Video / Voice)
             =================================================================== */}
          <section className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                {/* 15-Min SOS */}
                <motion.button
                  whileHover={{ y: -2 }}
                  onClick={() => openConsultModal("sos")}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-red-50 hover:bg-red-100/80 border border-red-200 text-left transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <AlertTriangle size={20} className="animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-extrabold text-red-700 truncate">
                        15-Min Emergency SOS
                      </span>
                    </div>
                    <p className="text-[11px] text-red-600/90 truncate">
                      Sparking, MCB Trip, Blackout
                    </p>
                  </div>
                </motion.button>

                {/* Shaadi / Function Standby */}
                <motion.button
                  whileHover={{ y: -2 }}
                  onClick={() => openConsultModal("event")}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-left transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F37021] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <PartyPopper size={20} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-extrabold text-[#1A2A49] block truncate">
                      Function / Shaadi Guard
                    </span>
                    <p className="text-[11px] text-gray-600 truncate">
                      Dedicated Standby Electrician
                    </p>
                  </div>
                </motion.button>

                {/* ₹29 Video Diagnosis */}
                <motion.button
                  whileHover={{ y: -2 }}
                  onClick={() => openConsultModal("video")}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-left transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1A2A49] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Video size={20} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-extrabold text-[#1A2A49] block truncate">
                      ₹29 Video Diagnosis
                    </span>
                    <p className="text-[11px] text-gray-600 truncate">
                      Show fault on video & save visit fee
                    </p>
                  </div>
                </motion.button>

                {/* Bolo & Book Karo (Voice/Photo) */}
                <motion.button
                  whileHover={{ y: -2 }}
                  onClick={() => openConsultModal("voice")}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-left transition group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Mic size={20} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-extrabold text-[#1A2A49] block truncate">
                      Bolo & Book Karo 🎙️
                    </span>
                    <p className="text-[11px] text-gray-600 truncate">
                      Hindi Voice Note + Photo Booking
                    </p>
                  </div>
                </motion.button>
              </div>
            </div>
          </section>

          {/* ===================================================================
              2. DESKTOP HERO SPLIT: SLIDER + 8-CATEGORY QUICK DOCK (LEFT) & SMART FAULT ESTIMATOR (RIGHT)
             =================================================================== */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* LEFT 7 COLUMNS: What Are You Looking For + Promo Slider */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-5">
                {/* Hero Headline + Category Quick Box */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      {user && (
                        <p className="text-[#F37021] font-bold text-xs uppercase tracking-wider mb-0.5">
                          👋 Namaste, {user.name?.split(" ")[0] || "Member"}!
                        </p>
                      )}
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1A2A49] leading-tight">
                        Ghar Ki Har Electrical & Appliance Dikkat Ka{" "}
                        <span className="text-[#F37021]">Instant Solution</span>
                      </h1>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full shrink-0 self-start">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-bold text-emerald-800">18 Engineers Nearby</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-500 mb-4">
                    No carrying heavy appliances to the market! Select a category below to explore sub-categories, fixed spare part rates & instant doorstep booking:
                  </p>

                  {/* 8-Category Icon Dock Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    {CATEGORIES_CATALOG.map((cat) => (
                      <motion.button
                        key={cat.slug}
                        whileHover={{ y: -3, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/services/${cat.slug}`)}
                        className="flex flex-col items-center text-center p-2.5 sm:p-3 rounded-xl bg-[#F4F6F9] hover:bg-[#1A2A49] text-[#1A2A49] hover:text-white border border-gray-200/60 transition-all group"
                      >
                        <span className="text-2xl sm:text-3xl mb-1.5 group-hover:scale-110 transition-transform">
                          {cat.emoji}
                        </span>
                        <span className="text-[11px] sm:text-xs font-bold leading-tight line-clamp-1">
                          {cat.shortName}
                        </span>
                        <span className="text-[10px] text-gray-500 group-hover:text-amber-300 mt-0.5">
                          {cat.subcategories.length} Sub-Types
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Trust Badges Footer inside Left Card */}
                  <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#F4F6F9] rounded-xl py-2 px-2">
                      <p className="text-xs sm:text-sm font-extrabold text-[#1A2A49]">⭐ 4.8 / 5</p>
                      <p className="text-[10px] text-gray-500">12,400+ Verified Reviews</p>
                    </div>
                    <div className="bg-[#F4F6F9] rounded-xl py-2 px-2">
                      <p className="text-xs sm:text-sm font-extrabold text-[#F37021]">₹0 Hidden Cost</p>
                      <p className="text-[10px] text-gray-500">App-Controlled Rate Card</p>
                    </div>
                    <div className="bg-[#F4F6F9] rounded-xl py-2 px-2">
                      <p className="text-xs sm:text-sm font-extrabold text-emerald-700">30-Day Warranty</p>
                      <p className="text-[10px] text-gray-500">Free Re-Visit Guarantee</p>
                    </div>
                  </div>
                </div>

                {/* Promotional Banner Slider */}
                <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200/80 bg-white">
                  <Slider />
                </div>
              </div>

              {/* RIGHT 5 COLUMNS: SMART FAULT & PRICE ESTIMATOR WIDGET */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl shadow-md border-2 border-[#1A2A49]/10 overflow-hidden h-full flex flex-col justify-between">
                  <div>
                    {/* Estimator Header */}
                    <div className="bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white p-5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#F37021] text-white text-[10px] font-extrabold uppercase tracking-wider">
                          Smart AI Estimator
                        </span>
                        <button
                          onClick={() => openRateCardModal(currentAppliance.categorySlug)}
                          className="text-xs text-amber-300 hover:underline flex items-center gap-1 font-medium"
                        >
                          <FileText size={13} /> Official Spare Rate Card
                        </button>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold mt-1">
                        🔍 Check Kya Kharab Hai & Kitna Kharcha Aayega
                      </h2>
                      <p className="text-white/75 text-xs mt-0.5">
                        Select your appliance & symptom to see exact cause and upfront cost before booking
                      </p>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Step 1: Select Appliance */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                          1. Select Appliance / System
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {SYMPTOM_ESTIMATOR_DATA.map((item, idx) => (
                            <button
                              key={item.appliance}
                              onClick={() => {
                                setSelectedApplianceIdx(idx)
                                setSelectedSymptomIdx(0)
                              }}
                              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                                selectedApplianceIdx === idx
                                  ? "bg-[#1A2A49] text-white border-[#1A2A49] shadow-sm"
                                  : "bg-[#F4F6F9] text-[#1A2A49] border-gray-200 hover:border-[#F37021]"
                              }`}
                            >
                              <span className="text-base">{item.icon}</span>
                              <span className="truncate">{item.appliance}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Step 2: Select Symptom */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                          2. Kya Dikkat Aa Rahi Hai? (Select Symptom)
                        </label>
                        <div className="space-y-1.5">
                          {currentAppliance.symptoms.map((sym, sIdx) => (
                            <button
                              key={sym.symptom}
                              onClick={() => setSelectedSymptomIdx(sIdx)}
                              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition flex items-center justify-between ${
                                selectedSymptomIdx === sIdx
                                  ? "bg-orange-50 border-[#F37021] text-[#1A2A49] font-bold shadow-sm"
                                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <span>{sym.symptom}</span>
                              <span
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                  selectedSymptomIdx === sIdx
                                    ? "border-[#F37021] bg-[#F37021] text-white"
                                    : "border-gray-300"
                                }`}
                              >
                                {selectedSymptomIdx === sIdx && "✓"}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Step 3: Live Diagnosis Result Box */}
                      <motion.div
                        key={`${selectedApplianceIdx}-${selectedSymptomIdx}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#F4F6F9] rounded-2xl p-4 border border-gray-200 space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F37021]">
                              Likely Diagnosis
                            </span>
                            <p className="text-xs sm:text-sm font-bold text-[#1A2A49] mt-0.5">
                              {currentSymptom.likelyCause}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                              Est. Total Range
                            </span>
                            <span className="text-sm sm:text-base font-extrabold text-emerald-700">
                              {currentSymptom.estimatedCost}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200/80 text-xs">
                          <span className="text-gray-600 flex items-center gap-1">
                            <Wrench size={13} className="text-[#1A2A49]" />
                            <strong>Kit Assigned:</strong> {currentSymptom.requiredKit}
                          </span>
                          <span className="bg-white px-2.5 py-0.5 rounded-full font-bold text-[#1A2A49] border border-gray-200">
                            Inspection/Base: ₹{currentSymptom.visitFee}
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Estimator Footer Actions */}
                  <div className="p-5 pt-0 flex flex-col sm:flex-row gap-2.5">
                    <button
                      onClick={handleAddEstimatorService}
                      className="flex-1 py-3 px-4 bg-[#F37021] hover:bg-[#e05e15] text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs sm:text-sm"
                    >
                      <Plus size={16} /> Book {currentSymptom.serviceName} (₹{currentSymptom.visitFee})
                    </button>
                    <button
                      onClick={() => openConsultModal("video")}
                      className="py-3 px-3.5 bg-[#1A2A49] hover:bg-[#223a61] text-white font-semibold rounded-xl transition text-xs flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Video size={14} /> ₹29 Video Check
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===================================================================
              3. LIVE ACTIVITY TICKER & ANTI-FRAUD RATE CARD BAR
             =================================================================== */}
          <section className="border-y border-gray-200 py-2.5 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
              <motion.div
                key={currentActivity}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-medium"
              >
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span>{liveActivities[currentActivity]}</span>
              </motion.div>

              <button
                onClick={() => openRateCardModal("ac-repair")}
                className="text-xs font-bold text-[#1A2A49] hover:text-[#F37021] flex items-center gap-1.5 bg-[#F4F6F9] px-3 py-1 rounded-full border border-gray-200 shrink-0"
              >
                <ShieldCheck size={14} className="text-emerald-600" />
                Check Official Spare Parts Rate Card (Zero Overcharging) →
              </button>
            </div>
          </section>

          {/* ===================================================================
              4. MOST BOOKED SERVICES SHELF (DIRECT + ADD TO CART)
             =================================================================== */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
              <div>
                <span className="text-[#F37021] font-bold text-xs uppercase tracking-wider">
                  High-Demand Repairs & Maintenance
                </span>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1A2A49] mt-0.5">
                  Most Booked Doorstep Services
                </h2>
              </div>
              <button
                onClick={() => navigate("/services")}
                className="text-sm font-bold text-[#F37021] hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                View All 60+ Services <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularServices.map((srv) => {
                const inCart = cart.some((item) => item.id === srv.id)
                return (
                  <motion.div
                    key={srv.id}
                    whileHover={{ y: -4 }}
                    onClick={() => navigate(`/services/${srv.categorySlug}?sub=${srv.subCategoryId}`)}
                    className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg border border-gray-200/80 flex flex-col justify-between cursor-pointer transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#F4F6F9] text-[#1A2A49] flex items-center gap-1">
                          <span>{srv.categoryEmoji}</span> {srv.subCategoryName}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          <Star size={11} className="fill-amber-500 text-amber-500" /> {srv.rating}
                        </span>
                      </div>

                      <h3 className="font-bold text-[#1A2A49] text-sm sm:text-base leading-snug mb-1.5">
                        {srv.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{srv.desc}</p>

                      {/* Included Bullets */}
                      <div className="space-y-1 mb-3">
                        {srv.included?.slice(0, 2).map((inc, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                            <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                            <span className="truncate">{inc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base sm:text-lg font-extrabold text-[#1A2A49]">
                            ₹{srv.price}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            ₹{srv.originalPrice}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold block">
                          🛡️ {srv.warranty} Warranty
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart({
                            id: srv.id,
                            name: srv.name,
                            price: srv.price,
                            category: srv.categorySlug,
                            categoryName: srv.categoryName,
                            duration: srv.duration,
                            warranty: srv.warranty,
                          })
                          toast.success(`${srv.name} added to cart!`)
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
                          inCart
                            ? "bg-emerald-600 text-white"
                            : "bg-[#1A2A49] text-white hover:bg-[#F37021]"
                        }`}
                      >
                        {inCart ? (
                          <>
                            <Check size={14} /> Added
                          </>
                        ) : (
                          <>
                            <Plus size={14} /> Add
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </section>

          {/* ===================================================================
              5. ALL 8 CATEGORIES & SUB-CATEGORIES STOREFRONT GRID
             =================================================================== */}
          <section id="our-services" className="px-4 sm:px-6 py-8 sm:py-10 bg-white border-y border-gray-200">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 gap-2">
                <div>
                  <span className="text-[#F37021] font-bold text-xs uppercase tracking-wider">
                    Complete Department Directory
                  </span>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1A2A49] mt-0.5">
                    Explore Categories & Sub-Categories
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                    Click any category or sub-category pill to view detailed checklists, rate cards & bundle discounts
                  </p>
                </div>
                <button
                  onClick={() => navigate("/services")}
                  className="text-[#F37021] font-bold hover:underline flex items-center gap-1 text-sm"
                >
                  Open Full Directory →
                </button>
              </div>

              <OurServices onClickService={(slug) => navigate(`/services/${slug}`)} />
            </div>
          </section>

          {/* ===================================================================
              6. ⚡ ₹79 "CHOTA-KAAM" GALI-PASS EXPRESS MICRO-FIX STRIP
             =================================================================== */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="bg-gradient-to-r from-[#1A2A49] to-[#223a61] rounded-3xl p-5 sm:p-8 text-white shadow-lg relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F37021] text-white text-xs font-extrabold uppercase tracking-wider mb-2">
                    <Zap size={13} /> Chota-Kaam Gali-Pass Express
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold">
                    Chote Kaam Ke Liye ₹300 Visit Fee Kyun Dena? Book @ Flat ₹79!
                  </h2>
                  <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-2xl">
                    Single switch खराब हो, fan regulator बदलना हो, या bulb holder लगाना हो — पास में घूम रहे Pluggy Gali-Pass Engineer से 20 मिनट में करवाएं।
                  </p>
                </div>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("pluggy:open-cart"))}
                  className="px-5 py-2.5 bg-white text-[#1A2A49] font-extrabold rounded-xl text-xs sm:text-sm hover:bg-amber-50 transition shrink-0 self-start lg:self-center shadow-sm"
                >
                  View Cart ({cart.length}) →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {MICRO_FIX_SERVICES.map((micro) => {
                  const inCart = cart.some((item) => item.id === micro.id)
                  return (
                    <motion.div
                      key={micro.id}
                      whileHover={{ y: -3 }}
                      className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-3.5 flex flex-col justify-between hover:bg-white/15 transition"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{micro.icon}</span>
                          <span className="text-[11px] bg-white/15 px-2 py-0.5 rounded-full text-amber-300 font-bold">
                            {micro.time}
                          </span>
                        </div>
                        <h3 className="font-bold text-xs sm:text-sm text-white leading-snug mb-2">
                          {micro.name}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-base font-extrabold text-[#FF8C42]">₹{micro.price}</span>
                        <button
                          onClick={() => handleAddMicroService(micro)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                            inCart
                              ? "bg-emerald-500 text-white"
                              : "bg-[#F37021] hover:bg-[#e05e15] text-white"
                          }`}
                        >
                          {inCart ? "Added ✓" : "+ Add"}
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* ===================================================================
              7. 🎪 SHAADI / FUNCTION STANDBY ELECTRICIAN & 🔄 STANDBY BACKUP APPLIANCE GUARANTEE
             =================================================================== */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Event Standby Packages (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#F37021]">
                      🎪 Shaadi • Birthday • Jagran • House Party
                    </span>
                    <h3 className="text-lg sm:text-2xl font-extrabold text-[#1A2A49] mt-0.5">
                      Function Mein Light Ya Phase Jane Ka Darr Khatam!
                    </h3>
                  </div>
                  <button
                    onClick={() => openConsultModal("event")}
                    className="px-3.5 py-2 bg-[#1A2A49] text-white rounded-xl text-xs font-bold hover:bg-[#223a61] shrink-0"
                  >
                    Book Standby
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">
                  Book a dedicated uniformed Pluggy Master Electrician who stays at your venue with a heavy-duty toolkit, phase changer & backup cables so your event never stops:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {EVENT_STANDBY_PACKAGES.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => openConsultModal("event")}
                      className="rounded-2xl p-4 bg-[#F4F6F9] hover:bg-orange-50/60 border border-gray-200 hover:border-[#F37021] cursor-pointer transition flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1A2A49] text-white">
                          {pkg.badge}
                        </span>
                        <h4 className="font-bold text-sm text-[#1A2A49] mt-2">{pkg.name}</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">{pkg.duration}</p>
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">{pkg.idealFor}</p>
                      </div>
                      <div className="mt-4 pt-2.5 border-t border-gray-200 flex items-center justify-between">
                        <div>
                          <span className="text-base font-extrabold text-[#F37021]">₹{pkg.price}</span>
                          <span className="text-[11px] text-gray-400 line-through ml-1">
                            ₹{pkg.originalPrice}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#1A2A49]">Select →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Standby Backup Loaner + Dual-OTP Security Card (5 Cols) */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-7 border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                    🔄 Pluggy Trust & Continuity Shield
                  </span>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-[#1A2A49] mt-0.5 mb-4">
                    Why Families Prefer Pluggy Over Local Unverified Mechanics
                  </h3>

                  <div className="space-y-3.5">
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F4F6F9]">
                      <div className="w-9 h-9 rounded-xl bg-[#1A2A49] text-white flex items-center justify-center shrink-0">
                        <RefreshCw size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#1A2A49]">
                          Standby Backup Fan / Cooler / Heater @ ₹99/day
                        </h4>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Agar aapka Fan motor winding ya AC PCB 24-hour workshop repair ke liye jata hai, toh Engineer aapko turant Standby Backup unit dekar jayega!
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F4F6F9]">
                      <div className="w-9 h-9 rounded-xl bg-[#F37021] text-white flex items-center justify-center shrink-0">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#1A2A49]">
                          Dual-PIN Security (Start PIN + Happy PIN)
                        </h4>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Kaam shuru hone par <strong>Start PIN</strong> aur kaam se 100% khush hone ke baad hi <strong>Happy PIN</strong> share karein.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#F4F6F9]">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <QrCode size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-[#1A2A49]">
                          30-Day QR Appliance Health Sticker
                        </h4>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Har repair ke baad 30 din ki digital warranty aur ₹0 Free Re-Visit claim in 1 click from Track Requests.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => navigate("/track")}
                    className="text-xs font-bold text-[#1A2A49] hover:text-[#F37021]"
                  >
                    Track Live Request & Warranty →
                  </button>
                  <a
                    href="tel:+919876543210"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F37021] bg-orange-50 px-3 py-1.5 rounded-lg"
                  >
                    <PhoneCall size={13} /> 24/7 Helpline
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ===================================================================
              8. WHY CHOOSE US, REVIEWS, EXTRA SECTIONS & MARQUEE
             =================================================================== */}
          <section className="px-0 sm:px-6 lg:px-12 py-12 sm:py-16 bg-gradient-to-br from-[#1A2A49] to-[#0F172A] text-center">
            <div className="max-w-6xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
                <span className="text-[#F37021] text-sm font-medium uppercase tracking-wider">
                  Our Advantage
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-3 font-poppins">
                  Why Choose Pluggy?
                </h2>
                <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto mb-8">
                  Experience hassle-free home services with our background-verified professionals
                </p>
              </motion.div>
              <WhyChooseUs />
            </div>
          </section>

          <section className="px-4 sm:px-6 lg:px-12 py-10 sm:py-12 bg-gradient-to-b from-white to-[#F4F6F9]">
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl sm:text-3xl font-bold text-[#1A2A49]">4.8</span>
                <span className="text-yellow-500 text-xl sm:text-2xl">★★★★★</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A2A49]">What Our Customers Say</h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                12,400+ happy families across Delhi NCR & Mumbai
              </p>
            </div>
            <CustomerReviews />
          </section>

          <ExtraSections />
          <MarqueeSection />
        </>
      )}

      {/* Welcome Popup */}
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setWelcomePopup(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              <div className="text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1A2A49] mb-2">Welcome to Pluggy!</h3>
                <p className="text-gray-600 mb-4 text-sm">Get 20% OFF on your first doorstep service</p>
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-1">Your Coupon Code</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl sm:text-2xl font-mono font-bold text-[#1A2A49]">PLUGGY20</span>
                    <button onClick={handleCopyCode} className="p-2 hover:bg-gray-200 rounded-lg">
                      {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setWelcomePopup(false)
                    applyCouponCode("PLUGGY20")
                    handleProtectedAction("/services")
                  }}
                  className="w-full py-3 bg-[#F37021] text-white rounded-full font-bold hover:bg-[#E05E15] transition"
                >
                  Explore Services & Book
                </button>
                <p className="text-xs text-gray-400 mt-3">Valid on all 8 categories. Terms apply.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
