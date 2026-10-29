// src/components/Navbar.jsx
import { useState, useEffect, useMemo, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import {
  User,
  LogOut,
  ShoppingCart,
  MapPin,
  ChevronDown,
  Search,
  Bell,
  Zap,
  FileText,
  ShieldCheck,
  Wrench,
  LayoutDashboard,
  Wallet,
  ChevronRight,
  Sparkles,
  Video,
  Menu,
  X,
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

  // Mobile Drawer State & Smart Auto-Hide on Scroll Down
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [mobileExpandedCat, setMobileExpandedCat] = useState("ac-repair")
  const [mobileNavVisible, setMobileNavVisible] = useState(true)
  const lastScrollYRef = useRef(0)

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
    setMobileNavVisible(true)
  }, [location.pathname, location.search])

  // Smart Mobile Scroll Auto-Hide (Frees screen when scrolling down, shows when scrolling up)
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const prevY = lastScrollYRef.current

      if (currentY <= 70) {
        setMobileNavVisible(true)
      } else if (currentY > prevY + 8) {
        setMobileNavVisible(false)
      } else if (currentY < prevY - 6) {
        setMobileNavVisible(true)
      }
      lastScrollYRef.current = currentY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const unreadCount = (notifications || []).filter((n) => !n.read).length

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
      if (!addToCart({
        ...srv,
        id: srv.id,
        name: srv.issue,
        issue: srv.issue,
        service: cat.name,
        categoryName: cat.name,
        subcategory: sub.name,
        categoryKey: cat.slug,
        category: cat.slug,
      })) return
      toast.success(`${srv.issue} added to cart!`)
    }
  }

  return (
    <>
      {/* ===================================================================== */}
      {/* MOBILE CLEAN SINGLE-ROW HEADER (56px, frosted white, auto-hides on scroll) */}
      {/* ===================================================================== */}
      <div
        className={`md:hidden fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl text-[#1A2A49] z-50 border-b border-black/5 transition-transform duration-300 ${
          mobileNavVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="h-14 px-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="w-9 h-9 rounded-full active:bg-gray-100 flex items-center justify-center text-[#1A2A49] shrink-0"
              aria-label="Open Menu"
            >
              <Menu size={20} />
            </button>

            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#F37021] to-[#FF8C42] p-1 flex items-center justify-center shadow-xs">
                <img
                  src="/image/logos.png"
                  alt="Pluggy"
                  className="h-full w-full object-contain filter brightness-0 invert"
                />
              </div>
              <span className="font-extrabold text-[17px] tracking-tight text-[#1A2A49]">
                Pluggy
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setLocationOpen(true)}
              className="flex items-center gap-1 h-8 px-2.5 rounded-full bg-[#F5F5F7] text-xs font-semibold text-[#1A2A49] max-w-[130px]"
              aria-label="Change location"
            >
              <MapPin size={12} className="text-[#F37021] shrink-0" />
              <span className="truncate">{city?.split(",")[0] || "Select City"}</span>
              <ChevronDown size={11} className="text-gray-400 shrink-0" />
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 rounded-full active:bg-gray-100 flex items-center justify-center"
              aria-label="Search"
            >
              <Search size={19} />
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="w-9 h-9 rounded-full active:bg-gray-100 flex items-center justify-center relative"
              aria-label="Cart"
            >
              <ShoppingCart size={19} />
              {cart.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#F37021] text-white text-[9px] font-extrabold min-w-4 h-4 px-0.5 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 📱 MOBILE HAMBURGER SLIDE-OVER MENU DRAWER */}
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
              className="w-[84vw] max-w-[320px] bg-white h-full overflow-y-auto flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="bg-[#1A2A49] text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#F37021] text-white font-extrabold flex items-center justify-center text-sm">
                      {user ? user.name?.charAt(0).toUpperCase() : "⚡"}
                    </div>
                    <div>
                      <p className="font-extrabold text-sm text-white">
                        {user ? `Hi, ${user.name}` : "Welcome to Pluggy"}
                      </p>
                      <p className="text-[11px] text-amber-300 font-medium">
                        {user ? `Wallet: ₹${walletBalance}` : "Fixed Rate Home Services"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white"
                  >
                    <X size={17} />
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="p-3 bg-[#F4F6F9] border-b border-gray-200 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false)
                      setConsultInitialTab("sos")
                      setConsultModalOpen(true)
                    }}
                    className="p-2.5 rounded-xl bg-red-600 text-white text-left flex items-center gap-2"
                  >
                    <Zap size={15} className="shrink-0" />
                    <span className="text-xs font-extrabold">15-Min SOS</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false)
                      setRateCardOpen(true)
                    }}
                    className="p-2.5 rounded-xl bg-[#1A2A49] text-white text-left flex items-center gap-2"
                  >
                    <FileText size={15} className="text-[#F37021] shrink-0" />
                    <span className="text-xs font-extrabold">Rate Card</span>
                  </button>
                </div>

                {/* Expandable Categories */}
                <div className="p-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-1 mb-2">
                    All 8 Service Categories
                  </p>
                  <div className="space-y-1.5">
                    {CATEGORIES_CATALOG.map((cat) => {
                      const isExpanded = mobileExpandedCat === cat.slug
                      return (
                        <div
                          key={cat.slug}
                          className="rounded-xl border border-gray-200 overflow-hidden bg-white"
                        >
                          <button
                            onClick={() => setMobileExpandedCat(isExpanded ? null : cat.slug)}
                            className="w-full flex items-center justify-between px-3 py-2.5 bg-[#F4F6F9]/60 text-left"
                          >
                            <span className="flex items-center gap-2 text-xs font-extrabold text-[#1A2A49]">
                              <span className="text-base">{cat.emoji || cat.icon}</span>
                              <span>{cat.name}</span>
                            </span>
                            <ChevronDown
                              size={14}
                              className={`text-gray-500 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {isExpanded && (
                            <div className="p-2 bg-white border-t border-gray-100 space-y-1">
                              {cat.subcategories.map((sub) => (
                                <button
                                  key={sub.id}
                                  onClick={() => {
                                    setMobileDrawerOpen(false)
                                    navigate(`/services/${cat.slug}?sub=${sub.id}`)
                                  }}
                                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F4F6F9] flex items-center justify-between text-xs font-medium text-[#1A2A49]"
                                >
                                  <span>
                                    {sub.icon} {sub.name}
                                  </span>
                                  <ChevronRight size={13} className="text-[#F37021]" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Portals Footer */}
              <div className="p-3 bg-[#F4F6F9] border-t border-gray-200 space-y-1.5">
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
      {/* 🖥️ DESKTOP CLEAN 2-TIER HEADER (104px Total: h-16 Main + h-10 Cat)    */}
      {/* ===================================================================== */}
      <header
        className="hidden md:block fixed top-0 left-0 right-0 z-50 shadow-md"
        onMouseLeave={() => setHoveredCategory(null)}
      >
        {/* TIER 1: Main Brand, Location, Universal Search & Quick Actions (h-16) */}
        <div className="bg-[#1A2A49] text-white h-16 flex items-center">
          <div className="max-w-7xl w-full mx-auto px-4 lg:px-6 flex items-center justify-between gap-4">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F37021] to-[#FF8C42] p-1.5 flex items-center justify-center shadow-sm group-hover:scale-105 transition">
                <img
                  src="/image/logos.png"
                  alt="Pluggy"
                  className="h-full w-full object-contain filter brightness-0 invert"
                />
              </div>
              <div className="whitespace-nowrap">
                <span className="text-xl font-extrabold tracking-tight font-poppins block leading-none">
                  Pluggy
                </span>
                <span className="text-[10px] text-[#FF8C42] font-semibold tracking-wider uppercase block mt-0.5">
                  Home Services
                </span>
              </div>
            </Link>

            {/* Location Selector */}
            <button
              onClick={() => setLocationOpen(true)}
              className="flex items-center gap-2 text-left px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition shrink-0 max-w-[165px]"
            >
              <MapPin size={15} className="text-[#F37021] shrink-0" />
              <div className="min-w-0">
                <span className="block text-[9px] text-white/70 leading-none">Location</span>
                <span className="font-semibold text-xs truncate block text-white mt-0.5">
                  {city || "Select City"}
                </span>
              </div>
              <ChevronDown size={13} className="text-white/60 shrink-0" />
            </button>

            {/* Center Search Bar */}
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
                  <option value="all">All</option>
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
                  placeholder="Search AC service, MCB repair, Fan, Geyser..."
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
                          Book with Voice/Photo →
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
                                <span className="w-8 h-8 rounded-lg bg-[#F4F6F9] flex items-center justify-center text-base shrink-0">
                                  {srv.categoryIcon}
                                </span>
                                <div className="min-w-0">
                                  <p className="font-semibold text-sm text-[#1A2A49] truncate">
                                    {srv.issue}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {srv.categoryName} • ⏱️ {srv.duration}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2.5 shrink-0">
                                <span className="font-bold text-sm text-[#F37021]">₹{srv.price}</span>
                                <button
                                  onClick={() =>
                                    handleQuickAddFromMenu(
                                      srv,
                                      { name: srv.categoryName, slug: srv.categoryKey },
                                      { name: srv.subcategoryName }
                                    )
                                  }
                                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                                    inCart
                                      ? "bg-emerald-600 text-white"
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

            {/* Right Actions: Rate Card + SOS + Account + Cart */}
            <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
              <button
                onClick={() => setRateCardOpen(true)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold transition"
              >
                <FileText size={14} className="text-[#FF8C42]" />
                <span>Rate Card</span>
              </button>

              <button
                onClick={() => {
                  setConsultInitialTab("sos")
                  setConsultModalOpen(true)
                }}
                className="px-3 py-2 rounded-xl bg-[#F37021] hover:bg-[#e05e15] text-white font-bold text-xs shadow-sm transition flex items-center gap-1"
              >
                <Zap size={13} /> 15m SOS
              </button>

              {!user ? (
                <button
                  onClick={() => navigate("/login")}
                  className="px-3.5 py-2 bg-white text-[#1A2A49] font-bold text-xs rounded-xl shadow-xs hover:bg-gray-100 transition"
                >
                  Login
                </button>
              ) : (
                <div
                  className="relative"
                  onMouseEnter={() => setMenuOpen("user")}
                  onMouseLeave={() => setMenuOpen(null)}
                >
                  <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs transition">
                    <div className="w-7 h-7 rounded-full bg-[#F37021] text-white font-bold flex items-center justify-center text-xs shrink-0">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="font-bold text-xs flex items-center gap-0.5">
                      {user.name?.split(" ")[0]} <ChevronDown size={12} />
                    </span>
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
                          <User size={15} className="text-[#F37021]" /> My Account (₹{walletBalance})
                        </button>
                        <button
                          onClick={() => navigate("/track")}
                          className="w-full text-left px-4 py-2.5 hover:bg-[#F4F6F9] flex items-center gap-2.5"
                        >
                          <ShieldCheck size={15} className="text-[#F37021]" /> Track Bookings & PINs
                        </button>
                        <button
                          onClick={() => navigate("/account/notifications")}
                          className="w-full text-left px-4 py-2.5 hover:bg-[#F4F6F9] flex items-center justify-between"
                        >
                          <span className="flex items-center gap-2.5">
                            <Bell size={15} className="text-[#F37021]" /> Notifications
                          </span>
                          {unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-[#F37021] text-white text-[10px] font-bold">
                              {unreadCount}
                            </span>
                          )}
                        </button>
                        <div className="border-t border-gray-100 my-1" />
                        <button
                          onClick={() => navigate("/engineer")}
                          className="w-full text-left px-4 py-2 hover:bg-[#F4F6F9] flex items-center gap-2.5 text-gray-600"
                        >
                          <Wrench size={14} /> Engineer Terminal
                        </button>
                        <button
                          onClick={() => navigate("/admin")}
                          className="w-full text-left px-4 py-2 hover:bg-[#F4F6F9] flex items-center gap-2.5 text-gray-600"
                        >
                          <LayoutDashboard size={14} /> Admin Control Desk
                        </button>
                        <div className="border-t border-gray-100 my-1" />
                        <button
                          onClick={() => {
                            logoutUser()
                            navigate("/")
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2.5 text-red-600 font-semibold"
                        >
                          <LogOut size={14} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Cart Button */}
              <button
                onClick={() => setCartOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 transition relative"
              >
                <div className="relative">
                  <ShoppingCart size={16} />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#F37021] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {cart.length}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold hidden xl:inline">Cart</span>
              </button>
            </div>
          </div>
        </div>

        {/* TIER 2: Clean 8-Category Hover Bar (h-10) */}
        <div className="bg-[#223a61] text-white border-t border-white/10 h-10 flex items-center">
          <div className="max-w-7xl w-full mx-auto px-4 lg:px-6 flex items-center justify-between gap-2 whitespace-nowrap">
            <div className="flex items-center gap-1 lg:gap-2">
              {CATEGORIES_CATALOG.map((cat) => {
                const isHovered = hoveredCategory === cat.slug
                const isActiveRoute = location.pathname.startsWith(`/services/${cat.slug}`)
                return (
                  <button
                    key={cat.slug}
                    onMouseEnter={() => {
                      setHoveredCategory(cat.slug)
                      setHoveredSubId(cat.subcategories[0]?.id || null)
                    }}
                    onClick={() => {
                      setHoveredCategory(null)
                      navigate(`/services/${cat.slug}`)
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                      isHovered || isActiveRoute
                        ? "bg-[#F37021] text-white"
                        : "text-white/90 hover:bg-white/10"
                    }`}
                  >
                    <span>{cat.emoji || cat.icon}</span>
                    <span>{cat.shortName}</span>
                    <ChevronDown
                      size={11}
                      className={`transition-transform duration-200 ${
                        isHovered ? "rotate-180" : "opacity-60"
                      }`}
                    />
                  </button>
                )
              })}
            </div>

            <div className="hidden xl:flex items-center gap-3 text-xs">
              <button
                onClick={() => {
                  setConsultInitialTab("video")
                  setConsultModalOpen(true)
                }}
                className="text-emerald-300 hover:text-white font-semibold flex items-center gap-1"
              >
                <Video size={13} /> ₹29 Video Diagnosis
              </button>
              <span className="text-white/20">|</span>
              <Link
                to="/track"
                className="text-amber-300 hover:text-white font-semibold flex items-center gap-1"
              >
                <ShieldCheck size={13} /> Track Order & PIN
              </Link>
            </div>
          </div>
        </div>

        {/* 3-COLUMN FLIPKART/AMAZON HOVER MEGA-MENU */}
        <AnimatePresence>
          {activeCategoryObj && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="w-full bg-white text-[#1A2A49] shadow-2xl border-b border-gray-200 z-50"
            >
              <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-12 gap-6">
                {/* Col 1: Subcategories */}
                <div className="col-span-4 border-r border-gray-100 pr-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                    {activeCategoryObj.name} Sub-Categories
                  </p>
                  <div className="space-y-1">
                    {activeCategoryObj.subcategories.map((sub) => {
                      const isSubActive = activeSubcategoryObj?.id === sub.id
                      return (
                        <button
                          key={sub.id}
                          onMouseEnter={() => setHoveredSubId(sub.id)}
                          onClick={() => {
                            setHoveredCategory(null)
                            navigate(`/services/${activeCategoryObj.slug}?sub=${sub.id}`)
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-bold transition ${
                            isSubActive
                              ? "bg-[#1A2A49] text-white"
                              : "hover:bg-[#F4F6F9] text-[#1A2A49]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{sub.icon}</span>
                            <span>{sub.name}</span>
                          </span>
                          <ChevronRight size={14} />
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Col 2: Services inside Subcategory */}
                <div className="col-span-5 border-r border-gray-100 pr-4">
                  {activeSubcategoryObj && (
                    <>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                        Popular in {activeSubcategoryObj.name}
                      </p>
                      <div className="space-y-2">
                        {activeSubcategoryObj.services.map((srv) => {
                          const inCart = cart.some(
                            (c) => c.issue === srv.issue || c.id === srv.id
                          )
                          return (
                            <div
                              key={srv.id}
                              className="p-2.5 rounded-xl border border-gray-100 hover:border-gray-200 flex items-center justify-between gap-3"
                            >
                              <div
                                onClick={() => {
                                  setHoveredCategory(null)
                                  navigate(
                                    `/services/${activeCategoryObj.slug}?sub=${activeSubcategoryObj.id}`
                                  )
                                }}
                                className="cursor-pointer min-w-0"
                              >
                                <p className="text-xs font-bold text-[#1A2A49] truncate">
                                  {srv.issue}
                                </p>
                                <p className="text-[11px] text-gray-500">
                                  ₹{srv.price} • ⏱️ {srv.duration}
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  handleQuickAddFromMenu(
                                    srv,
                                    activeCategoryObj,
                                    activeSubcategoryObj
                                  )
                                }
                                className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 transition ${
                                  inCart
                                    ? "bg-emerald-600 text-white"
                                    : "bg-[#F4F6F9] hover:bg-[#F37021] text-[#1A2A49] hover:text-white"
                                }`}
                              >
                                {inCart ? "Added ✓" : "+ Add"}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Col 3: Category Guarantee & Rate Card */}
                <div className="col-span-3 flex flex-col justify-between bg-[#F4F6F9] rounded-2xl p-4">
                  <div>
                    <span className="text-2xl">{activeCategoryObj.emoji}</span>
                    <h4 className="font-extrabold text-sm text-[#1A2A49] mt-2">
                      {activeCategoryObj.name}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">{activeCategoryObj.tagline}</p>
                  </div>
                  <div className="space-y-2 mt-4">
                    <button
                      onClick={() => {
                        setRateCardCategory(activeCategoryObj.slug)
                        setHoveredCategory(null)
                        setRateCardOpen(true)
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-white border border-gray-200 text-xs font-bold text-[#1A2A49] hover:border-[#F37021]"
                    >
                      📋 View Spare Rate Card
                    </button>
                    <button
                      onClick={() => {
                        setHoveredCategory(null)
                        navigate(`/services/${activeCategoryObj.slug}`)
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#F37021] text-white text-xs font-bold"
                    >
                      Open {activeCategoryObj.shortName} Store →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 📱 MOBILE SEARCH DRAWER */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex justify-center items-end md:hidden"
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
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-extrabold text-[#1A2A49]">Search Services</h3>
                <button onClick={() => setSearchOpen(false)} className="p-1.5 text-gray-500">
                  ✕
                </button>
              </div>

              <form onSubmit={handleDesktopSearchSubmit} className="relative mb-4">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="AC Foam Jet, MCB, Fan, Geyser..."
                  className="w-full pl-10 pr-20 py-3 bg-[#F4F6F9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3.5 py-1.5 bg-[#1A2A49] text-white text-xs font-bold rounded-lg"
                >
                  Go
                </button>
              </form>

              {liveSearchResults.length > 0 ? (
                <div className="space-y-2">
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
                        <p className="font-semibold text-xs text-[#1A2A49]">{srv.issue}</p>
                        <p className="text-[11px] text-gray-500">{srv.categoryName}</p>
                      </div>
                      <span className="font-bold text-xs text-[#F37021]">₹{srv.price}</span>
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
                      className="p-2.5 bg-[#F4F6F9] rounded-xl text-left flex items-center gap-2"
                    >
                      <span className="text-lg">{cat.emoji || cat.icon}</span>
                      <span className="font-bold text-xs text-[#1A2A49]">{cat.shortName}</span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POPUPS & MODALS */}
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
