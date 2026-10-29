// src/pages/Dashboard.jsx
import { useState, useEffect } from "react"
import Slider from "../components/Slider"
import {
  Copy,
  Check,
  Star,
  AlertTriangle,
  Video,
  Mic,
  PartyPopper,
  ShieldCheck,
  Wrench,
  Plus,
  ChevronRight,
  FileText,
  RefreshCw,
  QrCode,
  Zap,
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

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, cart, addToCart, applyCouponCode } = useApp()

  const [filterOpen, setFilterOpen] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState(null)
  const [copied, setCopied] = useState(false)
  const [welcomePopup, setWelcomePopup] = useState(false)

  // Compact 1-Row Smart Fault & Cost Estimator State
  const [selectedApplianceIdx, setSelectedApplianceIdx] = useState(0)
  const [selectedSymptomIdx, setSelectedSymptomIdx] = useState(0)

  const currentAppliance = SYMPTOM_ESTIMATOR_DATA[selectedApplianceIdx] || SYMPTOM_ESTIMATOR_DATA[0]
  const currentSymptom =
    currentAppliance.symptoms[selectedSymptomIdx] || currentAppliance.symptoms[0]

  const popularServices = getAllServicesFlat()
    .filter((s) => s.popular)
    .slice(0, 8)

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("pluggy_welcome_seen")
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setWelcomePopup(true)
        localStorage.setItem("pluggy_welcome_seen", "true")
      }, 8000)
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

  const openConsultModal = (tab) => {
    window.dispatchEvent(new CustomEvent("pluggy:open-consult", { detail: { tab } }))
  }

  const openRateCardModal = (category = "ac-repair") => {
    window.dispatchEvent(new CustomEvent("pluggy:open-rate-card", { detail: { category } }))
  }

  const handleAddEstimatorService = () => {
    if (!addToCart({
      id: `est-${currentAppliance.appliance}-${selectedSymptomIdx}`,
      name: `${currentAppliance.appliance}: ${currentSymptom.serviceName}`,
      price: currentSymptom.visitFee,
      category: currentAppliance.categorySlug,
      categoryName: currentAppliance.appliance,
      duration: "45 mins",
      warranty: "30 Days",
    })) return
    toast.success(`${currentSymptom.serviceName} added to cart!`)
    window.dispatchEvent(new CustomEvent("pluggy:open-cart"))
  }

  const handleAddMicroService = (micro) => {
    if (!addToCart({
      id: micro.id,
      name: `${micro.name} (Chota-Kaam Express)`,
      price: micro.price,
      category: micro.categorySlug,
      categoryName: "Chota-Kaam Express",
      duration: micro.time,
      warranty: "15 Days",
    })) return
    toast.success(`${micro.name} (₹${micro.price}) added to cart!`)
  }

  return (
    <div className="min-h-screen bg-white pt-[72px] md:pt-[104px]">
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
              1. CLEAN HERO SECTION: 8-CATEGORY DOCK (LEFT) + VISUAL BANNER (RIGHT)
             =================================================================== */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-6 sm:py-9">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* LEFT 7 COLUMNS: Clean Headline + 8 Category Icons + 4 Action Pills */}
              <div className="lg:col-span-7 px-1 sm:px-2">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    18 Verified Engineers Nearby
                  </span>
                  <button
                    onClick={() => openRateCardModal("ac-repair")}
                    className="text-xs font-bold text-[#F37021] hover:underline flex items-center gap-1"
                  >
                    <FileText size={13} /> Fixed Rate Card
                  </button>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1A2A49] leading-[1.1] mb-3">
                  Home Electrical & Appliance Services,{" "}
                  <span className="text-[#F37021]">Done Right.</span>
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mb-6">
                  What do you need help with today? Select a category for instant doorstep booking:
                </p>

                {/* Clean 8-Category Icon Grid (Zero Clutter) */}
                <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
                  {CATEGORIES_CATALOG.map((cat) => (
                    <motion.button
                      key={cat.slug}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => navigate(`/services/${cat.slug}`)}
                      className="flex flex-col items-center justify-center text-center py-3.5 px-1 rounded-2xl bg-[#F5F5F7] hover:bg-[#1A2A49] text-[#1A2A49] hover:text-white transition-all group"
                    >
                      <span className="text-2xl sm:text-3xl mb-1.5 group-hover:scale-110 transition-transform">
                        {cat.emoji}
                      </span>
                      <span className="text-[11px] sm:text-xs font-bold leading-tight line-clamp-1">
                        {cat.shortName}
                      </span>
                    </motion.button>
                  ))}
                </div>

                {/* 4 Compact Quick-Action Pills Below Categories */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => openConsultModal("sos")}
                    className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition"
                  >
                    <AlertTriangle size={14} className="shrink-0" />
                    <span className="truncate">15-Min SOS</span>
                  </button>

                  <button
                    onClick={() => openConsultModal("video")}
                    className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-[#F5F5F7] hover:bg-gray-200 text-[#1A2A49] text-xs font-bold transition"
                  >
                    <Video size={14} className="shrink-0 text-[#F37021]" />
                    <span className="truncate">₹29 Video Call</span>
                  </button>

                  <button
                    onClick={() => openConsultModal("event")}
                    className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-[#F5F5F7] hover:bg-gray-200 text-[#1A2A49] text-xs font-bold transition"
                  >
                    <PartyPopper size={14} className="shrink-0 text-[#F37021]" />
                    <span className="truncate">Shaadi Guard</span>
                  </button>

                  <button
                    onClick={() => openConsultModal("voice")}
                    className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-2xl bg-[#F5F5F7] hover:bg-gray-200 text-[#1A2A49] text-xs font-bold transition"
                  >
                    <Mic size={14} className="shrink-0" />
                    <span className="truncate">Voice Book</span>
                  </button>
                </div>
              </div>

              {/* RIGHT 5 COLUMNS: Clean Visual Promo Slider + 3 Trust Badges */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="rounded-3xl overflow-hidden">
                  <Slider />
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="py-2 px-2">
                    <p className="text-xs sm:text-sm font-extrabold text-[#1A2A49]">⭐ 4.8 / 5</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">12.4k+ Bookings</p>
                  </div>
                  <div className="py-2 px-2">
                    <p className="text-xs sm:text-sm font-extrabold text-[#F37021]">Fixed MRP</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Official Rate Card</p>
                  </div>
                  <div className="py-2 px-2">
                    <p className="text-xs sm:text-sm font-extrabold text-emerald-700">30-Day</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Free Warranty</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===================================================================
              2. SLEEK 1-ROW SMART FAULT & COST ESTIMATOR BAR (NO CLUTTER)
             =================================================================== */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
            <div className="bg-[#1A2A49] text-white rounded-3xl p-5 sm:p-6 shadow-md">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Title */}
                <div className="lg:w-1/4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F37021] bg-white/10 px-2.5 py-0.5 rounded-full">
                    Instant Cost Check
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold mt-1">
                    🔍 Check Fault & Repair Cost
                  </h2>
                  <p className="text-[11px] text-gray-300">
                    Select appliance & issue for upfront pricing
                  </p>
                </div>

                {/* 2 Clean Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:flex-1">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                      1. Select Appliance
                    </label>
                    <select
                      value={selectedApplianceIdx}
                      onChange={(e) => {
                        setSelectedApplianceIdx(Number(e.target.value))
                        setSelectedSymptomIdx(0)
                      }}
                      className="w-full h-11 rounded-xl bg-white text-[#1A2A49] px-3 text-xs sm:text-sm font-bold focus:outline-none"
                    >
                      {SYMPTOM_ESTIMATOR_DATA.map((item, idx) => (
                        <option key={item.appliance} value={idx}>
                          {item.icon} {item.appliance}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-300 mb-1">
                      2. Select Issue / Symptom
                    </label>
                    <select
                      value={selectedSymptomIdx}
                      onChange={(e) => setSelectedSymptomIdx(Number(e.target.value))}
                      className="w-full h-11 rounded-xl bg-white text-[#1A2A49] px-3 text-xs sm:text-sm font-bold focus:outline-none"
                    >
                      {currentAppliance.symptoms.map((sym, sIdx) => (
                        <option key={sym.symptom} value={sIdx}>
                          {sym.symptom}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Result + Book Button */}
                <div className="bg-[#223a61] rounded-2xl p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full lg:w-auto lg:shrink-0 border border-white/10">
                  <div className="min-w-0">
                    <span className="text-[10px] text-gray-300 block">
                      Est. Total: <strong className="text-emerald-300">{currentSymptom.estimatedCost}</strong>
                    </span>
                    <span className="text-xs font-bold text-white block truncate max-w-full sm:max-w-[180px]">
                      {currentSymptom.likelyCause}
                    </span>
                  </div>
                  <button
                    onClick={handleAddEstimatorService}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#e05e15] text-white text-xs font-extrabold whitespace-nowrap shadow-xs transition"
                  >
                    + Book @ ₹{currentSymptom.visitFee}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ===================================================================
              3. MOST BOOKED SERVICES (HORIZONTAL SWIPE ON MOBILE, 4-COL DESKTOP)
             =================================================================== */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14">
            <div className="flex items-end justify-between mb-5 gap-2">
              <div>
                <span className="text-[#F37021] font-bold text-xs uppercase tracking-wider">
                  Top Rated
                </span>
                <h2 className="text-lg sm:text-2xl font-extrabold text-[#1A2A49]">
                  Most Booked Doorstep Services
                </h2>
              </div>
              <button
                onClick={() => navigate("/services")}
                className="text-xs sm:text-sm font-bold text-[#F37021] hover:underline flex items-center gap-1 shrink-0"
              >
                See All <ChevronRight size={15} />
              </button>
            </div>

            {/* Horizontal Swipe Carousel on Mobile, 4-Col Grid on Desktop */}
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
              {popularServices.map((srv) => {
                const inCart = cart.some((item) => item.id === srv.id)
                return (
                  <div
                    key={srv.id}
                    onClick={() => navigate(`/services/${srv.categorySlug}?sub=${srv.subCategoryId}`)}
                    className="min-w-[240px] sm:min-w-[260px] md:min-w-0 snap-start bg-[#F5F5F7] rounded-3xl p-5 flex flex-col justify-between cursor-pointer transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white text-[#1A2A49] truncate">
                          {srv.categoryEmoji} {srv.subCategoryName}
                        </span>
                        <span className="flex items-center gap-0.5 text-xs font-bold text-amber-600 shrink-0">
                          <Star size={11} className="fill-amber-400 text-amber-400" /> {srv.rating}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-[#1A2A49] text-sm sm:text-base leading-snug mb-1 line-clamp-1">
                        {srv.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-4">{srv.desc}</p>
                    </div>

                    <div className="pt-3 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-base font-extrabold text-[#1A2A49]">
                          ₹{srv.price}
                        </span>
                        <span className="text-xs text-gray-400 line-through ml-1.5">
                          ₹{srv.originalPrice}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!addToCart({
                            id: srv.id,
                            name: srv.name,
                            price: srv.price,
                            category: srv.categorySlug,
                            categoryName: srv.categoryName,
                            duration: srv.duration,
                            warranty: srv.warranty,
                          })) return
                          toast.success(`${srv.name} added to cart!`)
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
                          inCart
                            ? "bg-emerald-600 text-white"
                            : "bg-[#1A2A49] text-white hover:bg-[#F37021]"
                        }`}
                      >
                        {inCart ? (
                          <>
                            <Check size={13} /> Added
                          </>
                        ) : (
                          <>
                            <Plus size={13} /> Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ===================================================================
              4. TABBED DEPARTMENT & SUB-CATEGORY EXPLORER (CLEAN VIEW)
             =================================================================== */}
          <section id="our-services" className="px-4 sm:px-6 py-12 sm:py-16 bg-[#F5F5F7]">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-5 gap-2">
                <div>
                  <span className="text-[#F37021] font-bold text-xs uppercase tracking-wider">
                    Browse By Department
                  </span>
                  <h2 className="text-lg sm:text-2xl font-extrabold text-[#1A2A49]">
                    Explore Categories & Sub-Categories
                  </h2>
                </div>
                <button
                  onClick={() => navigate("/services")}
                  className="text-xs sm:text-sm font-bold text-[#F37021] hover:underline shrink-0"
                >
                  All 64+ Services →
                </button>
              </div>

              <OurServices />
            </div>
          </section>

          {/* ===================================================================
              5. COMPACT ₹79 CHOTA-KAAM STRIP + STANDBY HIGHLIGHTS
             =================================================================== */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
            {/* ₹79 Chota-Kaam Horizontal Swipe Strip */}
            <div className="bg-gradient-to-r from-[#1A2A49] to-[#223a61] rounded-3xl p-5 sm:p-7 text-white shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#F37021] text-white px-2.5 py-0.5 rounded-full">
                    ⚡ Chota-Kaam Express
                  </span>
                  <h3 className="text-base sm:text-xl font-extrabold mt-1">
                    Quick Switch, Socket & Regulator Fixes @ Flat ₹79
                  </h3>
                </div>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("pluggy:open-cart"))}
                  className="text-xs font-bold text-amber-300 hover:underline self-start sm:self-auto"
                >
                  View Cart ({cart.length}) →
                </button>
              </div>

              <div className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto no-scrollbar snap-x pb-1">
                {MICRO_FIX_SERVICES.map((micro) => {
                  const inCart = cart.some((item) => item.id === micro.id)
                  return (
                    <div
                      key={micro.id}
                      className="min-w-[165px] md:min-w-0 snap-start bg-white/10 border border-white/15 rounded-2xl p-3.5 flex flex-col justify-between"
                    >
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="text-xl">{micro.icon}</span>
                        <h4 className="font-bold text-xs text-white line-clamp-2">{micro.name}</h4>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-sm font-extrabold text-[#FF8C42]">₹{micro.price}</span>
                        <button
                          onClick={() => handleAddMicroService(micro)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                            inCart ? "bg-emerald-500 text-white" : "bg-[#F37021] text-white"
                          }`}
                        >
                          {inCart ? "Added ✓" : "+ Add"}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Clean 2-Card Split: Shaadi Standby + ₹99/Day Loaner Guarantee */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Card 1: Shaadi / Function Standby */}
              <div className="bg-[#F5F5F7] rounded-3xl p-5 sm:p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#F37021]">
                      🎪 Event Power Guard
                    </span>
                    <button
                      onClick={() => openConsultModal("event")}
                      className="px-3 py-1.5 bg-[#1A2A49] text-white rounded-xl text-xs font-bold"
                    >
                      Book Standby →
                    </button>
                  </div>
                  <h3 className="text-base sm:text-xl font-extrabold text-[#1A2A49] mb-3">
                    Dedicated Electrician for Shaadi & Home Functions
                  </h3>

                  <div className="grid grid-cols-3 gap-2.5">
                    {EVENT_STANDBY_PACKAGES.map((pkg) => (
                      <div
                        key={pkg.id}
                        onClick={() => openConsultModal("event")}
                        className="p-3 rounded-2xl bg-white cursor-pointer text-center"
                      >
                        <p className="text-[11px] font-bold text-[#1A2A49] truncate">{pkg.name}</p>
                        <p className="text-sm font-extrabold text-[#F37021] mt-1">₹{pkg.price}</p>
                        <p className="text-[10px] text-gray-500">{pkg.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 2: Standby Backup Appliance + Dual-PIN */}
              <div className="bg-[#F5F5F7] rounded-3xl p-5 sm:p-7 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                    🛡️ Pluggy Exclusive Protection
                  </span>
                  <h3 className="text-base sm:text-xl font-extrabold text-[#1A2A49] mt-1 mb-3">
                    Zero Downtime & 100% Safe Repairs
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="p-3.5 rounded-2xl bg-white">
                      <RefreshCw size={16} className="text-[#1A2A49] mb-1.5" />
                      <p className="text-xs font-bold text-[#1A2A49]">₹99/Day Loaner Fan</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Backup unit during 24h motor repairs
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white">
                      <ShieldCheck size={16} className="text-[#F37021] mb-1.5" />
                      <p className="text-xs font-bold text-[#1A2A49]">Dual-PIN Escrow</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Share Happy PIN only when satisfied
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white">
                      <QrCode size={16} className="text-emerald-600 mb-1.5" />
                      <p className="text-xs font-bold text-[#1A2A49]">30-Day QR Warranty</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        1-Click ₹0 free re-visit claim
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===================================================================
              6. WHY CHOOSE US, REVIEWS, HOW IT WORKS & MARQUEE
             =================================================================== */}
          <section className="px-4 sm:px-6 lg:px-12 py-12 sm:py-16 bg-[#1A2A49]">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <span className="text-[#F37021] text-xs font-extrabold uppercase tracking-wider">
                  The Pluggy Advantage
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white mt-1 font-poppins">
                  Why 12,400+ Families Trust Pluggy
                </h2>
              </div>
              <WhyChooseUs />
            </div>
          </section>

          <section className="px-4 sm:px-6 lg:px-12 py-12 sm:py-16 bg-white">
            <div className="max-w-7xl mx-auto">
              <CustomerReviews />
            </div>
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
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="text-xl font-bold text-[#1A2A49] mb-1">Welcome to Pluggy!</h3>
                <p className="text-gray-600 mb-4 text-xs sm:text-sm">
                  Get Flat 20% OFF on your first doorstep service
                </p>
                <div className="bg-gray-100 rounded-xl p-3.5 mb-4">
                  <p className="text-[11px] text-gray-500 mb-1">Your Coupon Code</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl font-mono font-bold text-[#1A2A49]">PLUGGY20</span>
                    <button onClick={handleCopyCode} className="p-1.5 hover:bg-gray-200 rounded-lg">
                      {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setWelcomePopup(false)
                    applyCouponCode("PLUGGY20")
                    navigate("/services")
                  }}
                  className="w-full py-3 bg-[#F37021] text-white rounded-xl font-bold text-sm hover:bg-[#E05E15] transition"
                >
                  Explore Services
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
