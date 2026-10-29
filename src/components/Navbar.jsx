// src/components/Navbar.jsx
import { useState, useEffect, useMemo } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  User, LogOut, ShoppingCart, MapPin, ChevronDown, Search, Bell,
  Zap, FileText, ShieldCheck, Wrench, LayoutDashboard, Wallet,
  ChevronRight, Sparkles, Plus, Check, PhoneCall, Video, Menu, X
} from "lucide-react"
import toast from "react-hot-toast"
import { useApp } from "../AppContext"
import Cart from "./Cart"
import LocationPopup from "./LocationPopup"
import RateCardModal from "./RateCardModal"
import VideoConsultModal from "./VideoConsultModal"
import { CATEGORIES_CATALOG, getAllServicesFlat } from "../data/servicesCatalog"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    user,
    logoutUser,
    cart,
    addToCart,
    removeFromCart,
    city,
    notifications,
    appliedCoupon,
    applyCouponCode,
    walletBalance,
  } = useApp()

  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(null)
  const [locationOpen, setLocationOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [rateCardOpen, setRateCardOpen] = useState(false)
  const [rateCardCategory, setRateCardCategory] = useState("ac-repair")
  const [consultModalOpen, setConsultModalOpen] = useState(false)
  const [consultInitialTab, setConsultInitialTab] = useState("sos")

  // Desktop Search State
  const [searchCategory, setSearchCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)

  // Desktop Hover Mega-Menu State
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [hoveredSubId, setHoveredSubId] = useState(null)

  // Mobile Drawer State
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [mobileExpandedCat, setMobileExpandedCat] = useState("ac-repair")

  const allServices = useMemo(() => getAllServicesFlat(), [])

  useEffect(() => {
    const openCartHandler = () => setCartOpen(true)
    const openRateCardHandler = (e) => {
      if (e?.detail?.category) setRateCardCategory(e.detail.category)
      setRateCardOpen(true)
    }
    const openConsultHandler = (e) => {
      if (e?.detail?.tab) setConsultInitialTab(e.detail.tab)
      setConsultModalOpen(true)
    }

    window.addEventListener("pluggy:open-cart", openCartHandler)
    window.addEventListener("pluggy:open-rate-card", openRateCardHandler)
    window.addEventListener("pluggy:open-consult", openConsultHandler)
    return () => {
      window.removeEventListener("pluggy:open-cart", openCartHandler)
      window.removeEventListener("pluggy:open-rate-card", openRateCardHandler)
      window.removeEventListener("pluggy:open-consult", openConsultHandler)
    }
  }, [])

  // Close Mega-Menu & Mobile Drawer on route change
  useEffect(() => {
    setHoveredCategory(null)
    setSearchFocused(false)
    setMenuOpen(null)
    setMobileDrawerOpen(false)
  }, [location.pathname, location.search])

  const unreadCount = (notifications || []).filter((n) => !n.read).length
  const itemsTotal = cart.reduce((sum, i) => sum + Number(i.price || 0), 0)
  const labourCharge = cart.length > 0 ? 50 : 0
  const discount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.round((itemsTotal * appliedCoupon.value) / 100)
      : appliedCoupon.value
    : 0
  const finalTotal = Math.max(0, itemsTotal + labourCharge - discount)

  // Live filtered results for Universal Search Bar
  const liveSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    const q = searchQuery.toLowerCase()
    return allServices
      .filter((s) => (searchCategory === "all" ? true : s.categoryKey === searchCategory))
      .filter(
        (s) =>
          s.issue.toLowerCase().includes(q) ||
          s.subcategoryName.toLowerCase().includes(q) ||
          s.categoryName.toLowerCase().includes(q)
      )
      .slice(0, 7)
  }, [searchQuery, searchCategory, allServices])

  const handleDesktopSearchSubmit = (e) => {
    e?.preventDefault()
    if (!searchQuery.trim()) {
      if (searchCategory !== "all") {
        navigate(`/services/${searchCategory}`)
      }
      return
    }
    if (liveSearchResults.length > 0) {
      const top = liveSearchResults[0]
      navigate(`/services/${top.categoryKey}?sub=${top.subcategoryId}`)
      setSearchFocused(false)
      setSearchQuery("")
    } else {
      navigate(`/services/${searchCategory === "all" ? "ac-repair" : searchCategory}`)
      setSearchFocused(false)
    }
  }

  const activeCategoryObj = useMemo(() => {
    if (!hoveredCategory) return null
    return CATEGORIES_CATALOG.find((c) => c.slug === hoveredCategory) || null
  }, [hoveredCategory])

  const activeSubcategoryObj = useMemo(() => {
    if (!activeCategoryObj) return null
    return (
      activeCategoryObj.subcategories.find((s) => s.id === hoveredSubId) ||
      activeCategoryObj.subcategories[0]
    )
  }, [activeCategoryObj, hoveredSubId])

  const handleQuickAddFromMenu = (srv, cat, sub) => {
    const exists = cart.some((c) => c.issue === srv.issue || c.id === srv.id)
    if (exists) {
      removeFromCart(srv.id || srv.issue)
      toast.success("Removed from cart")
    } else {
      addToCart({
        ...srv,
        id: srv.id,
        name: srv.issue,
        issue: srv.issue,
        service: cat.name,
        categoryName: cat.name,
        subcategory: sub.name,
        categoryKey: cat.slug,
        category: cat.slug,
      })
      toast.success(`${srv.issue} added to cart!`)
    }
  }

  return (
    <>
      {/* ===================================================================== */}
      {/* 📱 MOBILE NAVBAR (ALWAYS VISIBLE, HIGH-CONTRAST NAVY & ORANGE)        */}
      {/* ===================================================================== */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#1A2A49] text-white z-50 shadow-lg border-b border-white/10">
        {/* ROW 1 (48px): Hamburger + Pluggy Logo + City Pill + SOS + Cart + Profile */}
        <div className="h-12 px-3 flex items-center justify-between gap-2">
          {/* Left: Menu + Brand + City */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="w-8 h-8 rounded-lg bg-white/10 active:bg-white/20 flex items-center justify-center text-white shrink-0"
              aria-label="Open Menu"
            >
              <Menu size={18} />
            </button>

            <Link to="/" className="flex items-center gap-1.5 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#F37021] to-[#FF8C42] p-1 flex items-center justify-center shadow">
                <img
                  src="/image/logos.png"
                  alt="Pluggy"
                  className="h-full w-full object-contain filter brightness-0 invert"
                />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                Pluggy
              </span>
            </Link>

            <button
              onClick={() => setLocationOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#223a61] border border-white/15 text-[11px] font-bold text-white truncate max-w-[110px]"
            >
              <MapPin size={12} className="text-[#F37021] shrink-0" />
              <span className="truncate">{city || "City"}</span>
              <ChevronDown size={11} className="text-gray-300 shrink-0" />
            </button>
          </div>

          {/* Right: SOS + Cart + Account */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                setConsultInitialTab("sos")
                setConsultModalOpen(true)
              }}
              className="px-2.5 py-1.5 rounded-lg bg-[#F37021] text-white font-extrabold text-[11px] flex items-center gap-1 shadow-sm"
            >
              <Zap size={12} /> SOS
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center relative"
              aria-label="Cart"
            >
              <ShoppingCart size={16} className="text-white" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F37021] text-white text-[10px] font-extrabold w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate(user ? "/account" : "/login")}
              className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center relative"
              aria-label="Account"
            >
              <User size={16} className="text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[9px] font-extrabold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ROW 2 (40px): High-Contrast Search Trigger + ₹29 Video Pill + Rate Card */}
        <div className="px-3 pb-2 flex items-center gap-1.5">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex-1 h-9 flex items-center gap-2 bg-white rounded-xl px-3 text-gray-600 shadow-inner min-w-0"
          >
            <Search size={15} className="text-[#F37021] shrink-0" />
            <span className="text-xs font-medium text-gray-500 truncate">
              Search AC, MCB, Fan, Geyser, RO...
            </span>
          </button>

          <button
            onClick={() => {
              setConsultInitialTab("video")
              setConsultModalOpen(true)
            }}
            className="h-9 px-2.5 rounded-xl bg-[#223a61] border border-white/15 text-emerald-300 font-extrabold text-[11px] flex items-center gap-1 shrink-0"
          >
            <Video size={13} /> ₹29
          </button>

          <button
            onClick={() => setRateCardOpen(true)}
            className="h-9 px-2.5 rounded-xl bg-[#223a61] border border-white/15 text-amber-300 font-extrabold text-[11px] flex items-center gap-1 shrink-0"
          >
            <FileText size={13} /> Rates
          </button>
        </div>

        {/* ROW 3 (36px): Touch-Scrollable 8-Category Bar */}
        <div className="h-9 bg-[#132038] flex items-center gap-1.5 overflow-x-auto px-3 no-scrollbar border-t border-white/10">
          {CATEGORIES_CATALOG.map((cat) => {
            const isCurr = location.pathname === `/services/${cat.slug}`
            return (
              <button
                key={cat.slug}
                onClick={() => navigate(`/services/${cat.slug}`)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap shrink-0 transition ${
                  isCurr
                    ? "bg-[#F37021] text-white"
                    : "bg-[#223a61] text-white/90 active:bg-[#F37021]"
                }`}
              >
                <span>{cat.emoji || cat.icon}</span>
                <span>{cat.shortName}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 📱 MOBILE HAMBURGER SLIDE-OVER MENU DRAWER (ALL CATEGORIES & SUBCATEGORIES) */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[60] md:hidden flex"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[86vw] max-w-[340px] bg-white h-full overflow-y-auto flex flex-col justify-between shadow-2xl"
            >
              <div>
                {/* Drawer Header */}
                <div className="bg-[#1A2A49] text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#F37021] text-white font-extrabold flex items-center justify-center text-base">
                      {user ? user.name?.charAt(0).toUpperCase() : "⚡"}
                    </div>
                    <div>
                      <p className="font-extrabold text-sm text-white">
                        {user ? `Hi, ${user.name}` : "Welcome to Pluggy 2.0"}
                      </p>
                      <p className="text-[11px] text-amber-300 font-semibold">
                        {user ? `Wallet Balance: ₹${walletBalance}` : "100% Fixed Rate Home Services"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* 4 Quick Emergency & Smart Tools */}
                <div className="p-3 bg-[#F4F6F9] border-b border-gray-200 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false)
                      setConsultInitialTab("sos")
                      setConsultModalOpen(true)
                    }}
                    className="p-2.5 rounded-xl bg-red-600 text-white text-left flex items-center gap-2 shadow-xs"
                  >
                    <Zap size={16} className="shrink-0" />
                    <div>
                      <p className="text-[11px] font-extrabold leading-tight">15-Min SOS</p>
                      <p className="text-[9px] text-white/80">Rapid Dispatch</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false)
                      setRateCardOpen(true)
                    }}
                    className="p-2.5 rounded-xl bg-[#1A2A49] text-white text-left flex items-center gap-2 shadow-xs"
                  >
                    <FileText size={16} className="text-[#F37021] shrink-0" />
                    <div>
                      <p className="text-[11px] font-extrabold leading-tight">Rate Card</p>
                      <p className="text-[9px] text-gray-300">Fixed MRP Parts</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false)
                      setConsultInitialTab("video")
                      setConsultModalOpen(true)
                    }}
                    className="p-2.5 rounded-xl bg-white border border-gray-200 text-[#1A2A49] text-left flex items-center gap-2"
                  >
                    <Video size={16} className="text-[#F37021] shrink-0" />
                    <div>
                      <p className="text-[11px] font-extrabold leading-tight">₹29 Video</p>
                      <p className="text-[9px] text-gray-500">Live Fault Check</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false)
                      setConsultInitialTab("event")
                      setConsultModalOpen(true)
                    }}
                    className="p-2.5 rounded-xl bg-white border border-gray-200 text-[#1A2A49] text-left flex items-center gap-2"
                  >
                    <Sparkles size={16} className="text-[#F37021] shrink-0" />
                    <div>
                      <p className="text-[11px] font-extrabold leading-tight">Shaadi Guard</p>
                      <p className="text-[9px] text-gray-500">Event Standby</p>
                    </div>
                  </button>
                </div>

                {/* Expandable 8 Categories & 32+ Sub-Categories Accordion */}
                <div className="p-3">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 px-1 mb-2">
                    Shop By Department & Sub-Category
                  </p>
                  <div className="space-y-1.5">
                    {CATEGORIES_CATALOG.map((cat) => {
                      const isExpanded = mobileExpandedCat === cat.slug
                      return (
                        <div
                          key={cat.slug}
                          className="rounded-xl border border-gray-200 overflow-hidden bg-white"
                        >
                          <div className="flex items-center justify-between px-3 py-2.5 bg-[#F4F6F9]/70">
                            <button
                              onClick={() =>
                                setMobileExpandedCat(isExpanded ? null : cat.slug)
                              }
                              className="flex items-center gap-2.5 flex-1 text-left"
                            >
                              <span className="text-lg">{cat.emoji || cat.icon}</span>
                              <div>
                                <p className="text-xs font-extrabold text-[#1A2A49]">
                                  {cat.name}
                                </p>
                                <p className="text-[10px] text-gray-500">
                                  {cat.subcategories.length} Sub-Categories • From ₹{cat.startingPrice}
                                </p>
                              </div>
                            </button>
                            <button
                              onClick={() =>
                                setMobileExpandedCat(isExpanded ? null : cat.slug)
                              }
                              className="p-1 text-[#1A2A49]"
                            >
                              <ChevronDown
                                size={15}
                                className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              />
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="p-2 bg-white border-t border-gray-100 space-y-1">
                              {cat.subcategories.map((sub) => (
                                <button
                                  key={sub.id}
                                  onClick={() => {
                                    setMobileDrawerOpen(false)
                                    navigate(`/services/${cat.slug}?sub=${sub.id}`)
                                  }}
                                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F4F6F9] flex items-center justify-between text-xs font-semibold text-[#1A2A49]"
                                >
                                  <span className="flex items-center gap-2">
                                    <span>{sub.icon}</span>
                                    <span>{sub.name}</span>
                                  </span>
                                  <ChevronRight size={13} className="text-[#F37021]" />
                                </button>
                              ))}
                              <button
                                onClick={() => {
                                  setMobileDrawerOpen(false)
                                  navigate(`/services/${cat.slug}`)
                                }}
                                className="w-full text-center py-1.5 mt-1 rounded-lg bg-[#FFF3EC] text-[#F37021] text-[11px] font-extrabold"
                              >
                                View All {cat.shortName} Services →
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Drawer Footer: Portals & Account */}
              <div className="p-3 bg-[#F4F6F9] border-t border-gray-200 space-y-1.5">
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false)
                    navigate("/track")
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-extrabold text-[#1A2A49] flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={15} className="text-emerald-600" /> Track Bookings & Dual-PINs
                  </span>
                  <ChevronRight size={14} />
                </button>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false)
                      navigate("/engineer")
                    }}
                    className="px-2.5 py-2 rounded-xl bg-[#1A2A49] text-white text-[11px] font-bold flex items-center justify-center gap-1.5"
                  >
                    <Wrench size={13} className="text-[#F37021]" /> Engineer App
                  </button>
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false)
                      navigate("/admin")
                    }}
                    className="px-2.5 py-2 rounded-xl bg-[#1A2A49] text-white text-[11px] font-bold flex items-center justify-center gap-1.5"
                  >
                    <LayoutDashboard size={13} className="text-amber-400" /> Admin Desk
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* 🖥️ DESKTOP 3-TIER HEADER & FLIPKART/AMAZON HOVER MEGA-MENU             */}
      {/* ===================================================================== */}
      <header
        className="hidden md:block fixed top-0 left-0 right-0 z-50 shadow-md"
        onMouseLeave={() => setHoveredCategory(null)}
      >
        {/* TIER 1: Top Utility Strip (Strict Single-Line h-8) */}
        <div className="bg-[#0F172A] text-white/90 text-[11px] border-b border-white/10 h-8 flex items-center">
          <div className="max-w-7xl w-full mx-auto px-4 lg:px-6 flex items-center justify-between gap-2 whitespace-nowrap overflow-hidden">
            <div className="flex items-center gap-3 lg:gap-4 whitespace-nowrap">
              <button
                onClick={() => {
                  setConsultInitialTab("sos")
                  setConsultModalOpen(true)
                }}
                className="flex items-center gap-1.5 text-[#FF8C42] hover:text-white font-bold transition whitespace-nowrap"
              >
                <span className="w-2 h-2 rounded-full bg-[#F37021] animate-ping shrink-0" />
                <span>⚡ 15-Min Emergency SOS</span>
              </button>
              <span className="text-white/20">|</span>
              <button
                onClick={() => {
                  setConsultInitialTab("event")
                  setConsultModalOpen(true)
                }}
                className="hover:text-white transition flex items-center gap-1 whitespace-nowrap"
              >
                <span>🎪 Shaadi / Function Standby</span>
              </button>
              <span className="text-white/20">|</span>
              <button
                onClick={() => setRateCardOpen(true)}
                className="hover:text-white transition flex items-center gap-1 whitespace-nowrap"
              >
                <FileText size={12} className="text-[#F37021] shrink-0" />
                <span>Official Spare Rate Card</span>
              </button>
            </div>

            <div className="flex items-center gap-3 lg:gap-4 whitespace-nowrap">
              <button
                onClick={() => {
                  setConsultInitialTab("video")
                  setConsultModalOpen(true)
                }}
                className="hover:text-white transition flex items-center gap-1 text-emerald-300 font-semibold whitespace-nowrap"
              >
                <Video size={12} className="shrink-0" />
                <span>₹29 Video Diagnosis</span>
              </button>
              <span className="text-white/20">|</span>
              <Link
                to="/engineer"
                className="hover:text-white transition flex items-center gap-1 whitespace-nowrap"
              >
                <Wrench size={12} className="text-[#F37021] shrink-0" />
                <span>Partner Portal</span>
              </Link>
              <span className="text-white/20">|</span>
              <Link
                to="/admin"
                className="hover:text-white transition flex items-center gap-1 font-bold text-amber-300 whitespace-nowrap"
              >
                <LayoutDashboard size={12} className="shrink-0" />
                <span>Admin Desk</span>
              </Link>
            </div>
          </div>
        </div>

        {/* TIER 2: Main Brand, Universal Search Bar & Quick Actions (Strict Single-Line h-16) */}
        <div className="bg-[#1A2A49] text-white h-16 flex items-center">
          <div className="max-w-7xl w-full mx-auto px-4 lg:px-6 flex items-center justify-between gap-3 lg:gap-4">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F37021] to-[#FF8C42] p-1.5 flex items-center justify-center shadow-md group-hover:scale-105 transition">
                <img
                  src="/image/logos.png"
                  alt="Pluggy"
                  className="h-full w-full object-contain filter brightness-0 invert"
                />
              </div>
              <div className="whitespace-nowrap">
                <span className="text-xl font-extrabold tracking-wide font-poppins block leading-none">
                  Pluggy
                </span>
                <span className="text-[10px] text-[#FF8C42] font-semibold tracking-wider uppercase block mt-0.5">
                  Home Services
                </span>
              </div>
            </Link>

            {/* Location Selector Box (Amazon Style) */}
            <button
              onClick={() => setLocationOpen(true)}
              className="flex items-center gap-2 text-left px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition shrink-0 max-w-[175px]"
            >
              <MapPin size={16} className="text-[#F37021] shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] text-white/70 leading-tight whitespace-nowrap">
                  Service Location
                </span>
                <span className="font-semibold text-xs truncate block text-white">
                  {city || "Select City"}
                </span>
              </div>
              <ChevronDown size={13} className="text-white/60 shrink-0" />
            </button>

            {/* CENTER: Wide Universal Search Bar with Category Dropdown */}
            <div className="flex-1 max-w-xl relative">
              <form
                onSubmit={handleDesktopSearchSubmit}
                className="flex items-center bg-white rounded-xl overflow-hidden shadow-inner border-2 border-transparent focus-within:border-[#F37021] transition h-10"
              >
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="bg-gray-100 text-[#1A2A49] text-xs font-bold px-2.5 h-full border-r border-gray-200 focus:outline-none cursor-pointer shrink-0"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES_CATALOG.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.shortName}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setSearchFocused(true)
                  }}
                  placeholder="Search 'AC Foam Jet', 'MCB Trip', 'Fan', 'Geyser'..."
                  className="flex-1 px-3 h-full text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none min-w-0"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="px-2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    ✕
                  </button>
                )}

                <button
                  type="submit"
                  className="bg-[#F37021] hover:bg-[#e05e15] text-white px-4 h-full font-semibold text-sm flex items-center justify-center transition shrink-0"
                >
                  <Search size={16} />
                </button>
              </form>

              {/* Live Search Autocomplete Dropdown */}
              <AnimatePresence>
                {searchFocused && (searchQuery.trim().length > 0 || searchCategory !== "all") && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    onMouseLeave={() => setSearchFocused(false)}
                    className="absolute top-full left-0 right-0 mt-2 bg-white text-[#1A2A49] rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                  >
                    {liveSearchResults.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No exact service match.{" "}
                        <button
                          onClick={() => {
                            setSearchFocused(false)
                            setConsultInitialTab("voice")
                            setConsultModalOpen(true)
                          }}
                          className="text-[#F37021] font-semibold underline"
                        >
                          Book with Voice/Photo instead →
                        </button>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                        {liveSearchResults.map((srv) => {
                          const inCart = cart.some((c) => c.issue === srv.issue || c.id === srv.id)
                          return (
                            <div
                              key={srv.id}
                              className="p-3 hover:bg-[#F4F6F9] flex items-center justify-between gap-3 transition"
                            >
                              <div
                                onClick={() => {
                                  navigate(`/services/${srv.categoryKey}?sub=${srv.subcategoryId}`)
                                  setSearchFocused(false)
                                  setSearchQuery("")
                                }}
                                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                              >
                                <span className="w-9 h-9 rounded-xl bg-[#1A2A49]/5 flex items-center justify-center text-lg shrink-0">
                                  {srv.categoryIcon}
                                </span>
                                <div className="min-w-0">
                                  <p className="font-semibold text-sm text-[#1A2A49] truncate">
                                    {srv.issue}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {srv.categoryName} • {srv.subcategoryName} • ⏱️ {srv.duration}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <span className="font-bold text-sm text-[#F37021]">₹{srv.price}</span>
                                <button
                                  onClick={() =>
                                    handleQuickAddFromMenu(
                                      srv,
                                      { name: srv.categoryName, slug: srv.categoryKey },
                                      { name: srv.subcategoryName }
                                    )
                                  }
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                                    inCart
                                      ? "bg-green-600 text-white"
                                      : "bg-[#1A2A49] text-white hover:bg-[#F37021]"
                                  }`}
                                >
                                  {inCart ? "Added ✓" : "+ Add"}
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 lg:gap-2.5 shrink-0 whitespace-nowrap">
              {/* SOS Button */}
              <button
                onClick={() => {
                  setConsultInitialTab("sos")
                  setConsultModalOpen(true)
                }}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#F37021] to-[#FF8C42] text-white font-bold text-xs shadow-md hover:scale-105 transition flex items-center gap-1 whitespace-nowrap"
              >
                <Zap size={13} /> SOS
              </button>

              {user && (
                <>
                  {/* Wallet Pill */}
                  <button
                    onClick={() => navigate("/account")}
                    className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold transition whitespace-nowrap"
                    title="Pluggy Wallet Balance"
                  >
                    <Wallet size={14} className="text-[#FF8C42]" />
                    <span>₹{walletBalance}</span>
                  </button>

                  {/* Notifications */}
                  <button
                    onClick={() => navigate("/account/notifications")}
                    className="relative p-2 rounded-xl bg-white/10 hover:bg-white/15 transition"
                    title="Notifications"
                  >
                    <Bell size={16} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#F37021] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {/* User Account Dropdown */}
              {!user ? (
                <button
                  onClick={() => navigate("/login")}
                  className="px-3.5 py-2 bg-white text-[#1A2A49] font-bold text-xs rounded-xl shadow hover:bg-gray-100 transition whitespace-nowrap"
                >
                  Login / Sign Up
                </button>
              ) : (
                <div
                  className="relative"
                  onMouseEnter={() => setMenuOpen("user")}
                  onMouseLeave={() => setMenuOpen(null)}
                >
                  <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs transition whitespace-nowrap">
                    <div className="w-7 h-7 rounded-full bg-[#F37021] text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="text-left">
                      <span className="block text-[10px] text-white/70 leading-none">
                        Hello, {user.name?.split(" ")[0]}
                      </span>
                      <span className="font-bold text-xs flex items-center gap-0.5">
                        Account <ChevronDown size={12} />
                      </span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {menuOpen === "user" && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        className="absolute right-0 mt-1.5 w-56 bg-white text-[#1A2A49] shadow-2xl rounded-2xl border border-gray-100 z-50 overflow-hidden py-1.5 text-xs font-medium"
                      >
                        <button
                          onClick={() => navigate("/account")}
                          className="w-full text-left px-4 py-2.5 hover:bg-[#F4F6F9] flex items-center gap-2.5"
                        >
                          <User size={15} className="text-[#F37021]" /> Your Account & Wallet
                        </button>
                        <button
                          onClick={() => navigate("/track")}
                          className="w-full text-left px-4 py-2.5 hover:bg-[#F4F6F9] flex items-center gap-2.5"
                        >
                          <ShoppingCart size={15} className="text-[#F37021]" /> Track Bookings & OTP
                        </button>
                        <button
                          onClick={() => navigate("/account/coupons")}
                          className="w-full text-left px-4 py-2.5 hover:bg-[#F4F6F9] flex items-center gap-2.5"
                        >
                          <Sparkles size={15} className="text-[#F37021]" /> Coupons & Offers
                        </button>
                        <div className="border-t border-gray-100 my-1" />
                        <button
                          onClick={() => navigate("/engineer")}
                          className="w-full text-left px-4 py-2.5 hover:bg-[#F4F6F9] flex items-center gap-2.5 text-gray-600"
                        >
                          <Wrench size={15} /> Switch to Engineer Portal
                        </button>
                        <button
                          onClick={() => navigate("/admin")}
                          className="w-full text-left px-4 py-2.5 hover:bg-[#F4F6F9] flex items-center gap-2.5 text-gray-600"
                        >
                          <LayoutDashboard size={15} /> Switch to Executive Desk
                        </button>
                        <div className="border-t border-gray-100 my-1" />
                        <button
                          onClick={() => {
                            logoutUser()
                            toast.success("Logged out")
                            navigate("/")
                          }}
                          className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-semibold"
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Cart Trigger */}
              <button
                onClick={() => setCartOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white text-[#1A2A49] hover:bg-gray-100 font-bold text-xs shadow transition relative whitespace-nowrap"
              >
                <ShoppingCart size={16} className="text-[#F37021] shrink-0" />
                <div className="text-left leading-tight">
                  <span className="block text-[10px] text-gray-500">Cart ({cart.length})</span>
                  <span className="font-extrabold text-xs text-[#1A2A49]">₹{finalTotal}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* TIER 3: Flipkart / Amazon Style Category Mega-Menu Bar (NO Scrollbar, Strict Single-Line h-10) */}
        <div className="bg-[#223a61] text-white border-t border-white/10 h-10 flex items-center">
          <div className="max-w-7xl w-full mx-auto px-4 lg:px-6 flex items-center justify-between gap-2">
            <div className="flex items-center justify-between flex-1">
              {CATEGORIES_CATALOG.map((cat) => {
                const isHovered = hoveredCategory === cat.slug
                const isCurrentRoute = location.pathname === `/services/${cat.slug}`
                return (
                  <div
                    key={cat.slug}
                    onMouseEnter={() => {
                      setHoveredCategory(cat.slug)
                      setHoveredSubId(cat.subcategories[0]?.id || null)
                    }}
                    className="relative"
                  >
                    <button
                      onClick={() => {
                        setHoveredCategory(null)
                        navigate(`/services/${cat.slug}`)
                      }}
                      className={`px-2 lg:px-3 h-10 text-xs font-semibold flex items-center gap-1 whitespace-nowrap transition border-b-2 ${
                        isHovered || isCurrentRoute
                          ? "border-[#F37021] bg-white/10 text-white"
                          : "border-transparent text-white/90 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.shortName}</span>
                      <ChevronDown
                        size={12}
                        className={`transition-transform duration-200 ${
                          isHovered ? "rotate-180 text-[#F37021]" : "text-white/60"
                        }`}
                      />
                    </button>
                  </div>
                )
              })}
            </div>

            <button
              onClick={() => navigate("/book-service")}
              className="text-xs font-bold text-[#FF8C42] hover:text-white whitespace-nowrap pl-3 border-l border-white/15 h-6 flex items-center gap-1 shrink-0"
            >
              Quick Slot Book →
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 🪟 HOVER MEGA-MENU FLYOUT (3-COLUMN AMAZON / FLIPKART STYLE)         */}
        {/* =================================================================== */}
        <AnimatePresence>
          {activeCategoryObj && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="bg-white text-[#1A2A49] shadow-2xl border-b border-gray-200"
            >
              <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-12 gap-6">
                {/* COLUMN 1 (3 Cols): Sub-Categories List */}
                <div className="col-span-3 border-r border-gray-100 pr-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      {activeCategoryObj.name} Sub-Categories
                    </span>
                  </div>
                  <div className="space-y-1">
                    {activeCategoryObj.subcategories.map((sub) => {
                      const isSubActive = activeSubcategoryObj?.id === sub.id
                      return (
                        <div
                          key={sub.id}
                          onMouseEnter={() => setHoveredSubId(sub.id)}
                          onClick={() => {
                            setHoveredCategory(null)
                            navigate(`/services/${activeCategoryObj.slug}?sub=${sub.id}`)
                          }}
                          className={`px-3.5 py-2.5 rounded-xl cursor-pointer flex items-center justify-between transition ${
                            isSubActive
                              ? "bg-[#1A2A49] text-white font-semibold shadow-sm"
                              : "text-gray-700 hover:bg-[#F4F6F9]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="text-base">{sub.icon}</span>
                            <span className="text-xs sm:text-sm truncate">{sub.name}</span>
                          </div>
                          <ChevronRight
                            size={15}
                            className={isSubActive ? "text-[#F37021]" : "text-gray-400"}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* COLUMN 2 (6 Cols): Popular Services & Instant Add inside Hovered Sub-Category */}
                <div className="col-span-6 pr-2">
                  {activeSubcategoryObj && (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-base text-[#1A2A49] flex items-center gap-2">
                            <span>{activeSubcategoryObj.icon}</span>
                            <span>{activeSubcategoryObj.name}</span>
                          </h4>
                          <p className="text-xs text-gray-500">{activeSubcategoryObj.desc}</p>
                        </div>
                        <button
                          onClick={() => {
                            setHoveredCategory(null)
                            navigate(`/services/${activeCategoryObj.slug}?sub=${activeSubcategoryObj.id}`)
                          }}
                          className="text-xs font-bold text-[#F37021] hover:underline"
                        >
                          View All ({activeSubcategoryObj.services.length}) →
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {activeSubcategoryObj.services.map((srv) => {
                          const inCart = cart.some((c) => c.issue === srv.issue)
                          return (
                            <div
                              key={srv.id}
                              className="p-3 rounded-xl border border-gray-200 hover:border-[#F37021]/60 bg-[#F4F6F9]/50 hover:bg-white flex items-center justify-between gap-4 transition group"
                            >
                              <div
                                onClick={() => {
                                  setHoveredCategory(null)
                                  navigate(`/services/${activeCategoryObj.slug}?sub=${activeSubcategoryObj.id}`)
                                }}
                                className="cursor-pointer flex-1 min-w-0"
                              >
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-sm text-[#1A2A49] group-hover:text-[#F37021] transition truncate">
                                    {srv.issue}
                                  </p>
                                  {srv.popular && (
                                    <span className="bg-orange-100 text-[#F37021] text-[10px] font-bold px-2 py-0.5 rounded-full">
                                      BESTSELLER
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                  <span className="text-amber-600 font-semibold">★ {srv.rating}</span>
                                  <span>• ⏱️ {srv.duration}</span>
                                  <span>• 🛡️ {srv.warranty}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="text-right">
                                  <span className="text-base font-extrabold text-[#1A2A49] block leading-none">
                                    ₹{srv.price}
                                  </span>
                                  {srv.originalPrice && (
                                    <span className="text-[11px] text-gray-400 line-through">
                                      ₹{srv.originalPrice}
                                    </span>
                                  )}
                                </div>

                                <button
                                  onClick={() =>
                                    handleQuickAddFromMenu(srv, activeCategoryObj, activeSubcategoryObj)
                                  }
                                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition ${
                                    inCart
                                      ? "bg-green-600 text-white"
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
                    </>
                  )}
                </div>

                {/* COLUMN 3 (3 Cols): Category Promo Card & Official Spare Parts Rate Card */}
                <div className="col-span-3 flex flex-col justify-between bg-gradient-to-br from-[#1A2A49] to-[#223a61] text-white rounded-2xl p-5 shadow-lg">
                  <div>
                    <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider bg-[#F37021] text-white px-2.5 py-1 rounded-full">
                      {activeCategoryObj.promoOffer.badge}
                    </span>
                    <h4 className="text-lg font-bold font-poppins mt-3">
                      {activeCategoryObj.promoOffer.title}
                    </h4>
                    <p className="text-xs text-white/80 mt-1 leading-relaxed">
                      {activeCategoryObj.promoOffer.subtitle}
                    </p>

                    <div className="mt-4 bg-white/10 rounded-xl p-3 border border-white/15 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-white/60 block">Use Coupon Code</span>
                        <span className="font-mono font-bold text-sm text-[#FF8C42]">
                          {activeCategoryObj.promoOffer.code}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          applyCouponCode(activeCategoryObj.promoOffer.code)
                          toast.success(`Coupon ${activeCategoryObj.promoOffer.code} applied!`)
                          setHoveredCategory(null)
                          navigate(`/services/${activeCategoryObj.slug}`)
                        }}
                        className="px-3 py-1.5 bg-white text-[#1A2A49] rounded-lg text-xs font-bold hover:bg-gray-100 transition"
                      >
                        Claim & Explore
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/15 space-y-2">
                    <button
                      onClick={() => {
                        setRateCardCategory(activeCategoryObj.slug)
                        setHoveredCategory(null)
                        setRateCardOpen(true)
                      }}
                      className="w-full py-2.5 px-3 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <FileText size={14} className="text-[#FF8C42]" /> View Spare Parts Rate Card
                    </button>
                    <p className="text-[11px] text-center text-white/70 flex items-center justify-center gap-1">
                      <ShieldCheck size={13} className="text-green-400" /> 30-Day Pluggy Service Warranty
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ===================================================================== */}
      {/* 📱 MOBILE SEARCH DRAWER                                                */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-end md:hidden"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-3xl w-full p-5 shadow-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-[#1A2A49]">Search All 120+ Services</h3>
                <button onClick={() => setSearchOpen(false)} className="p-2 text-gray-500">
                  ✕
                </button>
              </div>

              <form onSubmit={handleDesktopSearchSubmit} className="relative mb-4">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="AC Foam Jet, MCB, Fan, Geyser, RO..."
                  className="w-full pl-11 pr-20 py-3.5 bg-[#F4F6F9] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#1A2A49] text-white text-xs font-bold rounded-xl"
                >
                  Search
                </button>
              </form>

              {liveSearchResults.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {liveSearchResults.map((srv) => (
                    <div
                      key={srv.id}
                      onClick={() => {
                        setSearchOpen(false)
                        navigate(`/services/${srv.categoryKey}?sub=${srv.subcategoryId}`)
                      }}
                      className="p-3 bg-[#F4F6F9] rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-sm text-[#1A2A49]">{srv.issue}</p>
                        <p className="text-xs text-gray-500">{srv.categoryName}</p>
                      </div>
                      <span className="font-bold text-sm text-[#F37021]">₹{srv.price}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES_CATALOG.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        setSearchOpen(false)
                        navigate(`/services/${cat.slug}`)
                      }}
                      className="p-3 bg-[#F4F6F9] hover:bg-gray-200 rounded-xl text-left flex items-center gap-2"
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <div>
                        <p className="font-semibold text-xs text-[#1A2A49]">{cat.shortName}</p>
                        <p className="text-[10px] text-gray-500">From ₹{cat.startingPrice}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* POPUPS & MODALS                                                        */}
      {/* ===================================================================== */}
      <LocationPopup
        open={locationOpen}
        onClose={() => setLocationOpen(false)}
        onSelect={() => setLocationOpen(false)}
      />

      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />

      <RateCardModal
        open={rateCardOpen}
        onClose={() => setRateCardOpen(false)}
        initialCategory={rateCardCategory}
      />

      <VideoConsultModal
        open={consultModalOpen}
        onClose={() => setConsultModalOpen(false)}
        initialTab={consultInitialTab}
      />
    </>
  )
}
