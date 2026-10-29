// src/pages/ServiceDetail.jsx
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import {
  ChevronLeft,
  Star,
  Shield,
  Clock,
  Award,
  Sparkles,
  CheckCircle2,
  MapPin,
  Tag,
  ShoppingBag,
  Plus,
  Check,
  FileText,
  Video,
  Wrench,
  X,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useApp } from "../AppContext"
import {
  CATEGORIES_CATALOG,
  SPARE_PARTS_RATE_CARD,
  getCategoryBySlug,
} from "../data/servicesCatalog"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

export default function ServiceDetail() {
  const params = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const rawSlug = params.category || params.id || "ac-repair"
  const subParam = searchParams.get("sub") || params.sub || null

  const {
    cart,
    addToCart,
    removeFromCart,
    address: savedAddress,
    setAddress: setGlobalAddress,
    addRecent,
  } = useApp()

  const currentCat = getCategoryBySlug(rawSlug) || CATEGORIES_CATALOG[0]
  const [activeSubId, setActiveSubId] = useState(
    subParam && currentCat.subcategories.some((s) => s.id === subParam)
      ? subParam
      : "ALL"
  )
  const [address, setAddress] = useState(savedAddress || "")
  const [detailModalService, setDetailModalService] = useState(null)

  useEffect(() => {
    if (savedAddress && !address) {
      setAddress(savedAddress)
    }
  }, [savedAddress])

  useEffect(() => {
    addRecent(currentCat.name)
    if (subParam && currentCat.subcategories.some((s) => s.id === subParam)) {
      setActiveSubId(subParam)
    } else {
      setActiveSubId("ALL")
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [rawSlug, subParam])

  const categorySpares =
    SPARE_PARTS_RATE_CARD[currentCat.slug] || SPARE_PARTS_RATE_CARD["ac-repair"] || []

  const isInCart = (srvId) => cart.some((c) => c.id === srvId)

  const handleToggleService = (srv, subName) => {
    if (isInCart(srv.id)) {
      removeFromCart(srv.id)
      toast.success(`Removed ${srv.name}`)
    } else {
      addToCart({
        id: srv.id,
        name: srv.name,
        issue: srv.name,
        price: srv.price,
        originalPrice: srv.originalPrice,
        category: currentCat.slug,
        categoryKey: currentCat.slug,
        categoryName: currentCat.name,
        subcategory: subName,
        duration: srv.duration,
        warranty: srv.warranty,
      })
      toast.success(`${srv.name} added to cart!`)
    }
  }

  // Cart & Bundle Calculations
  const subtotal = cart.reduce((sum, i) => sum + Number(i.price || 0) * (i.qty || 1), 0)
  const originalSubtotal = cart.reduce(
    (sum, i) => sum + Number(i.originalPrice || Math.round((i.price || 0) * 1.3)) * (i.qty || 1),
    0
  )
  const itemSavings = Math.max(0, originalSubtotal - subtotal)
  const totalItemsCount = cart.reduce((sum, i) => sum + (i.qty || 1), 0)

  const bundleDiscountPercent = totalItemsCount >= 3 ? 15 : totalItemsCount === 2 ? 10 : 0
  const bundleDiscountAmount = Math.round((subtotal * bundleDiscountPercent) / 100)
  const finalTotal = Math.max(0, subtotal - bundleDiscountAmount)

  const handleCategorySwitch = (slug) => {
    navigate(`/services/${slug}`)
  }

  const handleSubSwitch = (subId) => {
    setActiveSubId(subId)
    if (subId === "ALL") {
      setSearchParams({})
    } else {
      setSearchParams({ sub: subId })
    }
  }

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      toast.error("Please add at least one service to proceed!")
      return
    }
    if (address.trim()) {
      setGlobalAddress(address.trim())
    }
    navigate(`/request/${currentCat.slug}`, {
      state: {
        selectedItems: cart,
        selectedIssue: cart.map((i) => i.name || i.issue).join(", "),
        finalTotal,
        address: address.trim() || savedAddress,
      },
    })
  }

  const displayedSubcategories =
    activeSubId === "ALL"
      ? currentCat.subcategories
      : currentCat.subcategories.filter((s) => s.id === activeSubId)

  return (
    <div className="min-h-screen bg-[#F4F6F9] pt-[92px] md:pt-[112px] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Top Breadcrumb & Category Switcher Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
            <button
              onClick={() => navigate("/")}
              className="hover:text-[#1A2A49] font-medium flex items-center gap-1"
            >
              <ChevronLeft size={16} /> Home
            </button>
            <span>/</span>
            <button onClick={() => navigate("/services")} className="hover:text-[#1A2A49]">
              Services
            </button>
            <span>/</span>
            <span className="font-bold text-[#1A2A49]">{currentCat.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("pluggy:open-rate-card", {
                    detail: { category: currentCat.slug },
                  })
                )
              }
              className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-[#1A2A49] hover:border-[#F37021] flex items-center gap-1.5 shadow-sm"
            >
              <FileText size={14} className="text-[#F37021]" /> Official Spare Rate Card
            </button>
            <button
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent("pluggy:open-consult", { detail: { tab: "video" } })
                )
              }
              className="px-3 py-1.5 rounded-xl bg-[#1A2A49] text-white text-xs font-bold hover:bg-[#223a61] flex items-center gap-1.5 shadow-sm"
            >
              <Video size={14} className="text-[#F37021]" /> ₹29 Video Diagnosis
            </button>
          </div>
        </div>

        {/* Horizontal 8-Category Switcher Bar */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-5">
          {CATEGORIES_CATALOG.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategorySwitch(cat.slug)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                currentCat.slug === cat.slug
                  ? "bg-[#1A2A49] text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-[#F37021]"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.shortName}</span>
            </button>
          ))}
        </div>

        {/* Category Hero Header Banner */}
        <motion.div
          key={currentCat.slug}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#1A2A49] via-[#223a61] to-[#1A2A49] rounded-3xl p-5 sm:p-7 mb-6 text-white shadow-lg relative overflow-hidden"
        >
          <div className="absolute -right-6 -bottom-6 text-8xl opacity-10 select-none">
            {currentCat.emoji}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#F37021] text-white text-xs font-extrabold uppercase tracking-wider">
                  {currentCat.badge}
                </span>
                <span className="flex items-center gap-1 bg-white/15 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  <Star size={12} className="fill-amber-400 text-amber-400" /> {currentCat.rating} (
                  {currentCat.bookingsCount} Bookings)
                </span>
                <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  🛡️ 30-Day Service Warranty
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-4xl sm:text-5xl">{currentCat.emoji}</span>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold">
                    {currentCat.name}
                  </h1>
                  <p className="text-white/80 text-xs sm:text-sm mt-0.5">{currentCat.tagline}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/15 shrink-0">
              <div className="text-center px-2">
                <p className="text-xs font-extrabold text-amber-300">Fixed Rates</p>
                <p className="text-[10px] text-white/75">Zero Overcharging</p>
              </div>
              <div className="text-center px-2 border-x border-white/15">
                <p className="text-xs font-extrabold text-white">Dual-PIN</p>
                <p className="text-[10px] text-white/75">Start & Happy OTP</p>
              </div>
              <div className="text-center px-2">
                <p className="text-xs font-extrabold text-emerald-300">₹99/Day</p>
                <p className="text-[10px] text-white/75">Standby Loaner</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===================================================================
            3-COLUMN URBAN COMPANY STYLE STOREFRONT LAYOUT
           =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (3 COLS): STICKY SUB-CATEGORY RAIL + QUICK HELP */}
          <div className="lg:col-span-3 lg:sticky lg:top-[150px] space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#F37021]" /> Select Sub-Category
              </h3>

              <div className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
                <button
                  onClick={() => handleSubSwitch("ALL")}
                  className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                    activeSubId === "ALL"
                      ? "bg-[#1A2A49] text-white shadow-sm"
                      : "bg-[#F4F6F9] text-[#1A2A49] hover:bg-gray-200/70"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>⚡</span>
                    <span>All {currentCat.shortName}</span>
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${
                      activeSubId === "ALL" ? "bg-[#F37021] text-white" : "bg-white text-gray-600"
                    }`}
                  >
                    {currentCat.subcategories.reduce((acc, s) => acc + s.services.length, 0)}
                  </span>
                </button>

                {currentCat.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleSubSwitch(sub.id)}
                    className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                      activeSubId === sub.id
                        ? "bg-[#F37021] text-white shadow-sm"
                        : "bg-[#F4F6F9] text-[#1A2A49] hover:bg-gray-200/70"
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span>{sub.icon}</span>
                      <span className="truncate">{sub.name}</span>
                    </span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${
                        activeSubId === sub.id ? "bg-white/25 text-white" : "bg-white text-gray-600"
                      }`}
                    >
                      {sub.services.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Not Sure / ₹49 Inspection or ₹29 Video Call Box */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4 space-y-3 hidden lg:block">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-[#F37021]" />
                <h4 className="font-bold text-xs sm:text-sm text-[#1A2A49]">
                  Not Sure What&apos;s Faulty?
                </h4>
              </div>
              <p className="text-xs text-gray-500">
                Book an expert doorstep inspection or show the problem on a 5-min video call before booking.
              </p>
              <button
                onClick={() => {
                  const diagId = `diag-${currentCat.slug}`
                  if (!isInCart(diagId)) {
                    addToCart({
                      id: diagId,
                      name: `${currentCat.shortName} Expert Fault Inspection Visit`,
                      issue: `${currentCat.shortName} Expert Fault Inspection Visit`,
                      price: 99,
                      originalPrice: 199,
                      category: currentCat.slug,
                      categoryName: currentCat.name,
                      subcategory: "Inspection",
                      duration: "30 mins",
                      warranty: "Adjusted in final bill",
                    })
                    toast.success("Expert Inspection Visit (₹99) added!")
                  } else {
                    toast.success("Already in your cart!")
                  }
                }}
                className="w-full py-2.5 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl text-xs font-bold transition"
              >
                + Book Doorstep Inspection (₹99)
              </button>
              <button
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("pluggy:open-consult", { detail: { tab: "video" } })
                  )
                }
                className="w-full py-2 bg-orange-50 hover:bg-orange-100 text-[#F37021] border border-[#F37021]/30 rounded-xl text-xs font-bold transition"
              >
                📹 ₹29 Video Call Diagnosis
              </button>
            </div>
          </div>

          {/* CENTER COLUMN (5 COLS): DETAILED SERVICE CARDS */}
          <div className="lg:col-span-5 space-y-6">
            {displayedSubcategories.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4 sm:p-5"
              >
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{sub.icon}</span>
                    <div>
                      <h2 className="font-extrabold text-[#1A2A49] text-base sm:text-lg">
                        {sub.name}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {sub.services.length} specialized doorstep services available
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {sub.services.map((srv) => {
                    const selected = isInCart(srv.id)
                    return (
                      <motion.div
                        key={srv.id}
                        layout
                        className={`rounded-2xl p-4 border transition-all ${
                          selected
                            ? "bg-orange-50/40 border-[#F37021] shadow-sm"
                            : "bg-[#F4F6F9]/60 border-gray-200/80 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              {srv.popular && (
                                <span className="px-2 py-0.5 rounded bg-[#F37021] text-white text-[10px] font-extrabold uppercase">
                                  Bestseller
                                </span>
                              )}
                              <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                <Star size={11} className="fill-amber-500 text-amber-500" />{" "}
                                {srv.rating}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                                <Clock size={11} /> {srv.duration}
                              </span>
                            </div>

                            <h3 className="font-bold text-[#1A2A49] text-sm sm:text-base mt-1">
                              {srv.name}
                            </h3>
                            <p className="text-xs text-gray-600 mt-1">{srv.desc}</p>

                            {/* Price Row */}
                            <div className="flex items-baseline gap-2 mt-2.5">
                              <span className="text-lg font-extrabold text-[#1A2A49]">
                                ₹{srv.price}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                ₹{srv.originalPrice}
                              </span>
                              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                Save ₹{srv.originalPrice - srv.price}
                              </span>
                            </div>
                          </div>

                          {/* Add / Added Button */}
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <button
                              onClick={() => handleToggleService(srv, sub.name)}
                              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-sm transition ${
                                selected
                                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                  : "bg-white text-[#F37021] border-2 border-[#F37021] hover:bg-[#F37021] hover:text-white"
                              }`}
                            >
                              {selected ? (
                                <>
                                  <Check size={15} /> Added
                                </>
                              ) : (
                                <>
                                  <Plus size={15} /> Add
                                </>
                              )}
                            </button>
                            <span className="text-[10px] text-gray-500 font-medium">
                              🛡️ {srv.warranty} Warranty
                            </span>
                          </div>
                        </div>

                        {/* Included Checklist & View Details Link */}
                        <div className="mt-3 pt-3 border-t border-gray-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-x-3 gap-y-1">
                            {srv.included?.map((inc, idx) => (
                              <span
                                key={idx}
                                className="flex items-center gap-1 text-[11px] text-gray-600"
                              >
                                <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                                {inc}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={() => setDetailModalService({ ...srv, subName: sub.name })}
                            className="text-xs font-bold text-[#1A2A49] hover:text-[#F37021] underline shrink-0 self-start sm:self-auto"
                          >
                            View Process & Rate Card →
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN (4 COLS): STICKY LIVE CART + BUNDLE DISCOUNT + OFFICIAL SPARE PARTS */}
          <div className="lg:col-span-4 lg:sticky lg:top-[150px] space-y-4">
            {/* Bundle Discount Progress Card */}
            <div className="bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white rounded-2xl p-4 shadow-md">
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <Tag size={14} /> Multi-Service Bundle Offer
                </span>
                <span>{bundleDiscountPercent}% OFF Unlocked</span>
              </div>
              <p className="text-xs text-white/85 mb-2.5">
                {totalItemsCount === 0
                  ? "Add 2 services for 10% OFF or 3+ services for 15% Super Saver Discount!"
                  : totalItemsCount === 1
                  ? "Add 1 more service to unlock 10% Bundle Discount!"
                  : totalItemsCount === 2
                  ? "🎉 10% OFF unlocked! Add 1 more service for 15% OFF!"
                  : "🔥 Maximum 15% Super Saver Bundle Discount unlocked!"}
              </p>
              <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F37021] transition-all duration-300"
                  style={{ width: `${Math.min(100, (totalItemsCount / 3) * 100)}%` }}
                />
              </div>
            </div>

            {/* Selection / Cart Summary Card */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200/80 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-[#1A2A49] text-base flex items-center gap-2">
                  <ShoppingBag size={18} className="text-[#F37021]" />
                  Your Service Cart ({totalItemsCount})
                </h3>
                {cart.length > 0 && (
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent("pluggy:open-cart"))}
                    className="text-xs font-bold text-[#F37021] hover:underline"
                  >
                    Open Drawer
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8 bg-[#F4F6F9] rounded-2xl border border-dashed border-gray-300">
                  <ShoppingBag size={28} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-xs sm:text-sm font-semibold text-gray-600">
                    Your cart is empty
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5 px-4">
                    Click &ldquo;+ Add&rdquo; on any service card on the left to build your booking
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 mb-4">
                    {cart.map((item) => (
                      <div
                        key={item.id || item.name}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#F4F6F9] border border-gray-200/60 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[#1A2A49] truncate">
                            {item.name || item.issue}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {item.categoryName || currentCat.shortName} • Qty: {item.qty || 1}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-extrabold text-emerald-700">
                            ₹{Number(item.price) * (item.qty || 1)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id || item.name)}
                            className="w-6 h-6 rounded-lg bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 flex items-center justify-center border border-gray-200"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="border-t border-gray-200 pt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-500">
                      <span>MRP Total</span>
                      <span className="line-through">₹{originalSubtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-700 font-medium">
                      <span>Service Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {bundleDiscountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Bundle Discount ({bundleDiscountPercent}% OFF)</span>
                        <span>-₹{bundleDiscountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-extrabold text-[#1A2A49] pt-2 border-t border-gray-200">
                      <span>To Pay</span>
                      <span className="text-emerald-700">₹{finalTotal}</span>
                    </div>
                    {(itemSavings + bundleDiscountAmount > 0) && (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl py-1.5 px-3 text-center font-bold text-[11px] mt-2">
                        🎉 You are saving ₹{itemSavings + bundleDiscountAmount} on this order!
                      </div>
                    )}
                  </div>

                  {/* Address Input */}
                  <div className="mt-4">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Doorstep Service Address
                    </label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-3 text-[#F37021]" />
                      <input
                        type="text"
                        placeholder="House/Flat No, Floor, Landmark..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F37021] bg-[#F4F6F9]"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToCheckout}
                    className="w-full mt-4 py-3 bg-[#F37021] hover:bg-[#e05e15] text-white rounded-xl text-sm font-extrabold shadow-md transition"
                  >
                    Proceed to Slot & Booking (₹{finalTotal}) →
                  </button>
                </>
              )}
            </div>

            {/* Official Spare Parts Rate Card Preview Box */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="font-bold text-xs text-[#1A2A49] flex items-center gap-1.5">
                  <Shield size={14} className="text-emerald-600" /> Official Spare Parts Rate Card
                </h4>
                <button
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("pluggy:open-rate-card", {
                        detail: { category: currentCat.slug },
                      })
                    )
                  }
                  className="text-[11px] font-bold text-[#F37021] hover:underline"
                >
                  See All ({categorySpares.length})
                </button>
              </div>
              <div className="space-y-2">
                {categorySpares.slice(0, 3).map((sp) => (
                  <div
                    key={sp.code}
                    className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#F4F6F9]"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold text-[#1A2A49] truncate">{sp.part}</p>
                      <p className="text-[10px] text-gray-500">Warranty: {sp.warranty}</p>
                    </div>
                    <span className="font-extrabold text-[#1A2A49] shrink-0">₹{sp.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Checkout Bar */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl p-3 z-40">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold text-gray-500">
                {totalItemsCount} Service{totalItemsCount > 1 ? "s" : ""} Selected
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold text-[#1A2A49] text-base">₹{finalTotal}</span>
                <span className="text-xs text-gray-400 line-through">₹{originalSubtotal}</span>
              </div>
            </div>
            <button
              onClick={handleProceedToCheckout}
              className="px-5 py-2.5 bg-[#F37021] text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-md"
            >
              Proceed to Book →
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================
          SERVICE PROCESS & RATE CARD MODAL ("View Process & Rate Card")
         =================================================================== */}
      <AnimatePresence>
        {detailModalService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={() => setDetailModalService(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200"
            >
              <div className="bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white p-5 flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F37021]">
                    {detailModalService.subName}
                  </span>
                  <h3 className="text-lg font-extrabold mt-1.5">{detailModalService.name}</h3>
                  <p className="text-xs text-white/80 mt-0.5">{detailModalService.desc}</p>
                </div>
                <button
                  onClick={() => setDetailModalService(null)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Included Checklist */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">
                    What&apos;s Included in ₹{detailModalService.price}
                  </h4>
                  <div className="space-y-2 bg-[#F4F6F9] p-3.5 rounded-2xl">
                    {detailModalService.included?.map((inc, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#1A2A49]">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4-Step Pluggy SOP */}
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">
                    4-Step Transparent Service Process
                  </h4>
                  <div className="space-y-2 text-xs text-gray-700">
                    <div className="p-2.5 rounded-xl border border-gray-200 flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#1A2A49] text-white font-bold flex items-center justify-center shrink-0">
                        1
                      </span>
                      <span>
                        <strong>Start PIN Verification:</strong> Share your 4-digit Start OTP when the uniformed engineer arrives with the assigned toolkit.
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-gray-200 flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#1A2A49] text-white font-bold flex items-center justify-center shrink-0">
                        2
                      </span>
                      <span>
                        <strong>In-App Spare Part Quote:</strong> If any part is needed, engineer sends an official Rate Card quote to your phone for approval.
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-gray-200 flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#1A2A49] text-white font-bold flex items-center justify-center shrink-0">
                        3
                      </span>
                      <span>
                        <strong>Standby Backup Option:</strong> Need workshop motor/PCB repair? Get a ₹99/day Standby Fan/Cooler on the spot.
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-gray-200 flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#F37021] text-white font-bold flex items-center justify-center shrink-0">
                        4
                      </span>
                      <span>
                        <strong>Happy PIN & 30-Day QR Warranty:</strong> Share Happy PIN only when 100% satisfied.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <span className="text-lg font-extrabold text-[#1A2A49]">
                    ₹{detailModalService.price}
                  </span>
                  <span className="text-xs text-gray-400 line-through ml-1.5">
                    ₹{detailModalService.originalPrice}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleToggleService(detailModalService, detailModalService.subName)
                    setDetailModalService(null)
                  }}
                  className="px-5 py-2.5 bg-[#F37021] hover:bg-[#e05e15] text-white rounded-xl text-xs font-extrabold"
                >
                  {isInCart(detailModalService.id) ? "Remove from Cart" : "+ Add to Cart"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
