// src/components/Navbar.jsx
import { useState, useEffect, useMemo } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  User, LogOut, ShoppingCart, MapPin, ChevronDown, Search, Bell,
  Zap, FileText, ShieldCheck, Wrench, LayoutDashboard, Wallet,
  ChevronRight, Sparkles, Plus, Check, PhoneCall, Video
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

  // Mobile Scroll Detection
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

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

  // Close Mega-Menu on route change
  useEffect(() => {
    setHoveredCategory(null)
    setSearchFocused(false)
    setMenuOpen(null)
  }, [location.pathname, location.search])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

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
      {/* 📱 MOBILE NAVBAR                                                       */}
      {/* ===================================================================== */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 bg-white z-50 transition-transform duration-300 shadow-sm ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Top Mobile Utility Strip */}
        <div className="bg-[#1A2A49] text-white px-3 py-1.5 flex items-center justify-between text-[11px]">
          <button
            onClick={() => {
              setConsultInitialTab("sos")
              setConsultModalOpen(true)
            }}
            className="flex items-center gap-1 font-bold text-[#F37021]"
          >
            <Zap size={12} /> 15-Min SOS
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => setRateCardOpen(true)} className="text-white/90 hover:text-white">
              📋 Rate Card
            </button>
            <button onClick={() => navigate("/admin")} className="text-white/90 hover:text-white">
              🎛️ Admin
            </button>
          </div>
        </div>

        {/* Location & Icons Row */}
        <div className="px-4 py-2 flex items-center justify-between">
          <button onClick={() => setLocationOpen(true)} className="flex items-center gap-1">
            <MapPin size={16} className="text-[#F37021]" />
            <span className="font-semibold text-[#1A2A49] text-sm truncate max-w-[160px]">
              {city || "Select Location"}
            </span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/account/notifications")} className="p-1.5 relative">
              <Bell size={18} className="text-[#1A2A49]" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#F37021] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <button onClick={() => setCartOpen(true)} className="p-1.5 relative">
              <ShoppingCart size={18} className="text-[#1A2A49]" />
              {cart.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#F37021] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
            <button onClick={() => navigate(user ? "/account" : "/login")} className="p-1.5">
              <User size={18} className="text-[#1A2A49]" />
            </button>
          </div>
        </div>

        {/* Search Trigger */}
        <div className="px-4 pb-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center gap-2 bg-[#F4F6F9] border border-gray-200 rounded-full px-4 py-2 text-gray-500"
          >
            <Search size={16} className="text-[#F37021]" />
            <span className="text-xs sm:text-sm">Search AC, MCB, Fan, Geyser, RO...</span>
          </button>
        </div>

        {/* Mobile Quick Category Horizontal Strip */}
        <div className="flex gap-2 overflow-x-auto px-3 pb-2 scrollbar-hide border-b border-gray-200">
          {CATEGORIES_CATALOG.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => navigate(`/services/${cat.slug}`)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F4F6F9] text-[#1A2A49] text-xs font-medium whitespace-nowrap active:bg-[#1A2A49] active:text-white transition"
            >
              <span>{cat.icon}</span>
              <span>{cat.shortName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 🖥️ DESKTOP 3-TIER HEADER & FLIPKART/AMAZON HOVER MEGA-MENU             */}
      {/* ===================================================================== */}
      <header
        className="hidden md:block fixed top-0 left-0 right-0 z-50 shadow-md"
        onMouseLeave={() => setHoveredCategory(null)}
      >
        {/* TIER 1: Top Utility Strip */}
        <div className="bg-[#0F172A] text-white/85 text-xs border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <button
                onClick={() => {
                  setConsultInitialTab("sos")
                  setConsultModalOpen(true)
                }}
                className="flex items-center gap-1.5 text-[#FF8C42] hover:text-white font-semibold transition"
              >
                <span className="w-2 h-2 rounded-full bg-[#F37021] animate-ping" />
                ⚡ 15-Min Emergency SOS Responder
              </button>
              <span className="text-white/20">|</span>
              <button
                onClick={() => {
                  setConsultInitialTab("event")
                  setConsultModalOpen(true)
                }}
                className="hover:text-white transition flex items-center gap-1"
              >
                🎪 Shaadi / Function Standby Electrician
              </button>
              <span className="text-white/20">|</span>
              <button
                onClick={() => setRateCardOpen(true)}
                className="hover:text-white transition flex items-center gap-1"
              >
                <FileText size={13} className="text-[#F37021]" /> Official Spare Parts Rate Card
              </button>
            </div>

            <div className="flex items-center gap-5">
              <button
                onClick={() => {
                  setConsultInitialTab("video")
                  setConsultModalOpen(true)
                }}
                className="hover:text-white transition flex items-center gap-1 text-emerald-300 font-medium"
              >
                <Video size={13} /> ₹29 Video Diagnosis
              </button>
              <span className="text-white/20">|</span>
              <Link to="/engineer-dashboard" className="hover:text-white transition flex items-center gap-1">
                <Wrench size={13} className="text-[#F37021]" /> Engineer Partner Portal
              </Link>
              <span className="text-white/20">|</span>
              <Link to="/admin" className="hover:text-white transition flex items-center gap-1 font-semibold text-amber-300">
                <LayoutDashboard size={13} /> Executive / Admin Desk
              </Link>
            </div>
          </div>
        </div>

        {/* TIER 2: Main Brand, Universal Search Bar & Quick Actions */}
        <div className="bg-[#1A2A49] text-white">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-5">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F37021] to-[#FF8C42] p-1.5 flex items-center justify-center shadow-md group-hover:scale-105 transition">
                <img
                  src="/image/logos.png"
                  alt="Pluggy"
                  className="h-full w-full object-contain filter brightness-0 invert"
                />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-wide font-poppins block leading-none">
                  Pluggy
                </span>
                <span className="text-[10px] text-[#FF8C42] font-medium tracking-wider uppercase">
                  Home Services
                </span>
              </div>
            </Link>

            {/* Location Selector Box (Amazon Style) */}
            <button
              onClick={() => setLocationOpen(true)}
              className="flex items-center gap-2 text-left px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition flex-shrink-0 max-w-[190px]"
            >
              <MapPin size={18} className="text-[#F37021] flex-shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] text-white/70 leading-tight">
                  Service Location
                </span>
                <span className="font-semibold text-xs truncate block text-white">
                  {city || "Select City"}
                </span>
              </div>
              <ChevronDown size={14} className="text-white/60 flex-shrink-0" />
            </button>

            {/* CENTER: Wide Universal Search Bar with Category Dropdown */}
            <div className="flex-1 max-w-2xl relative">
              <form
                onSubmit={handleDesktopSearchSubmit}
                className="flex items-center bg-white rounded-xl overflow-hidden shadow-inner border-2 border-transparent focus-within:border-[#F37021] transition"
              >
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="bg-gray-100 text-[#1A2A49] text-xs font-semibold px-3 py-3 border-r border-gray-200 focus:outline-none cursor-pointer"
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
                  placeholder="Search for 'AC Foam Jet', 'MCB Tripping', 'Fan Capacitor', 'Geyser'..."
                  className="flex-1 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
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
                  className="bg-[#F37021] hover:bg-[#e05e15] text-white px-5 py-3 font-semibold text-sm flex items-center gap-1.5 transition"
                >
                  <Search size={17} />
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
                          const inCart = cart.some((c) => c.issue === srv.issue)
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
                                <span className="w-9 h-9 rounded-xl bg-[#1A2A49]/5 flex items-center justify-center text-lg flex-shrink-0">
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
                              <div className="flex items-center gap-3 flex-shrink-0">
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
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* SOS Button */}
              <button
                onClick={() => {
                  setConsultInitialTab("sos")
                  setConsultModalOpen(true)
                }}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#F37021] to-[#FF8C42] text-white font-bold text-xs shadow-md hover:scale-105 transition flex items-center gap-1"
              >
                <Zap size={14} /> SOS
              </button>

              {user && (
                <>
                  {/* Wallet Pill */}
                  <button
                    onClick={() => navigate("/account")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold transition"
                    title="Pluggy Wallet Balance"
                  >
                    <Wallet size={15} className="text-[#FF8C42]" />
                    <span>₹{walletBalance}</span>
                  </button>

                  {/* Notifications */}
                  <button
                    onClick={() => navigate("/account/notifications")}
                    className="relative p-2 rounded-xl bg-white/10 hover:bg-white/15 transition"
                    title="Notifications"
                  >
                    <Bell size={17} />
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
                  className="px-4 py-2 bg-white text-[#1A2A49] font-bold text-xs rounded-xl shadow hover:bg-gray-100 transition"
                >
                  Login / Sign Up
                </button>
              ) : (
                <div
                  className="relative"
                  onMouseEnter={() => setMenuOpen("user")}
                  onMouseLeave={() => setMenuOpen(null)}
                >
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs transition">
                    <div className="w-7 h-7 rounded-full bg-[#F37021] text-white font-bold flex items-center justify-center text-xs">
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
                          onClick={() => navigate("/account/track")}
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
                          onClick={() => navigate("/engineer-dashboard")}
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
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-[#1A2A49] hover:bg-gray-100 font-bold text-xs shadow transition relative"
              >
                <ShoppingCart size={17} className="text-[#F37021]" />
                <div className="text-left leading-tight">
                  <span className="block text-[10px] text-gray-500">Cart ({cart.length})</span>
                  <span className="font-extrabold text-xs text-[#1A2A49]">₹{finalTotal}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* TIER 3: Flipkart / Amazon Style Category Mega-Menu Bar */}
        <div className="bg-[#223a61] text-white border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
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
                      className={`px-3.5 py-2.5 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition border-b-2 ${
                        isHovered || isCurrentRoute
                          ? "border-[#F37021] bg-white/10 text-white"
                          : "border-transparent text-white/90 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.shortName}</span>
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${isHovered ? "rotate-180 text-[#F37021]" : "text-white/60"}`}
                      />
                    </button>
                  </div>
                )
              })}
            </div>

            <button
              onClick={() => navigate("/book-service")}
              className="text-xs font-bold text-[#FF8C42] hover:text-white whitespace-nowrap pl-4 py-2 flex items-center gap-1"
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
