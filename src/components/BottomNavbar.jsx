// src/components/BottomNavbar.jsx
import React, { useState, useEffect, useRef } from "react"
import {
  Home,
  Grid,
  ShoppingCart,
  User,
  Zap,
  ShieldCheck,
  Receipt,
  ChevronRight,
  X,
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useApp } from "../AppContext"
import { CATEGORIES_CATALOG } from "../data/servicesCatalog"
import { motion, AnimatePresence } from "framer-motion"

export default function BottomNavbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { cart, requests } = useApp()

  const [servicesOpen, setServicesOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollYRef = useRef(0)

  const activeBookingsCount = (requests || []).filter(
    (r) => !["Completed", "COMPLETED", "Cancelled", "CANCELLED"].includes(r.status)
  ).length

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      const prevY = lastScrollYRef.current

      if (currentY <= 70) {
        setVisible(true)
      } else if (currentY > prevY + 8) {
        setVisible(false)
      } else if (currentY < prevY - 6) {
        setVisible(true)
      }
      lastScrollYRef.current = currentY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const openCartPopup = () => {
    window.dispatchEvent(new Event("pluggy:open-cart"))
  }

  const openConsultModal = (tab = "sos") => {
    window.dispatchEvent(new CustomEvent("pluggy:open-consult", { detail: { tab } }))
  }

  const openRateCardModal = () => {
    window.dispatchEvent(
      new CustomEvent("pluggy:open-rate-card", { detail: { category: "ac-repair" } })
    )
  }

  return (
    <>
      {/* Mobile Bottom App Bar (Auto-Hides on Downward Scroll so Screen Stays 100% Open) */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 bg-[#1A2A49] text-white border-t border-white/15 shadow-2xl z-50 transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="grid grid-cols-5 items-center h-14 px-1">
          {/* 1. Home */}
          <button
            onClick={() => {
              setServicesOpen(false)
              navigate("/")
            }}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition ${
              pathname === "/" && !servicesOpen ? "text-[#F37021]" : "text-gray-300"
            }`}
          >
            <Home size={18} />
            <span>Home</span>
          </button>

          {/* 2. Categories Sheet */}
          <button
            onClick={() => setServicesOpen((prev) => !prev)}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition ${
              servicesOpen || pathname.startsWith("/services")
                ? "text-[#F37021]"
                : "text-gray-300"
            }`}
          >
            <Grid size={18} />
            <span>Categories</span>
          </button>

          {/* 3. Center SOS Button */}
          <div className="flex flex-col items-center justify-center -mt-4">
            <button
              onClick={() => openConsultModal("sos")}
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F37021] to-[#FF8C42] text-white shadow-lg border-2 border-[#1A2A49] flex flex-col items-center justify-center active:scale-95 transition"
            >
              <Zap size={18} />
            </button>
            <span className="text-[9px] font-extrabold text-[#FF8C42] mt-0.5">SOS</span>
          </div>

          {/* 4. Track & PIN */}
          <button
            onClick={() => {
              setServicesOpen(false)
              navigate("/track")
            }}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition relative ${
              pathname.startsWith("/track") ? "text-[#F37021]" : "text-gray-300"
            }`}
          >
            <div className="relative">
              <ShieldCheck size={18} />
              {activeBookingsCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-white text-[9px] font-extrabold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                  {activeBookingsCount}
                </span>
              )}
            </div>
            <span>Track</span>
          </button>

          {/* 5. Cart / Account */}
          <button
            onClick={() => {
              setServicesOpen(false)
              if (cart.length > 0) {
                openCartPopup()
              } else {
                navigate("/account")
              }
            }}
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition relative ${
              pathname.startsWith("/account") ? "text-[#F37021]" : "text-gray-300"
            }`}
          >
            <div className="relative">
              {cart.length > 0 ? <ShoppingCart size={18} /> : <User size={18} />}
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#F37021] text-white text-[9px] font-extrabold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </div>
            <span>{cart.length > 0 ? `Cart (${cart.length})` : "Account"}</span>
          </button>
        </div>
      </div>

      {/* All 8 Categories & Sub-Categories Mobile Bottom Drawer */}
      <AnimatePresence>
        {servicesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 md:hidden flex items-end"
            onClick={() => setServicesOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto pb-20 shadow-2xl"
            >
              <div className="sticky top-0 bg-[#1A2A49] text-white px-5 py-3.5 flex items-center justify-between z-10 rounded-t-3xl">
                <h2 className="text-sm font-extrabold">All 8 Service Categories</h2>
                <button
                  onClick={() => setServicesOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-3.5 bg-[#F4F6F9] border-b border-gray-200 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setServicesOpen(false)
                    openRateCardModal()
                  }}
                  className="p-2.5 rounded-xl bg-white border border-gray-200 flex items-center gap-2 text-xs font-extrabold text-[#1A2A49]"
                >
                  <Receipt size={14} className="text-emerald-600 shrink-0" />
                  <span>Spare Rate Card</span>
                </button>
                <button
                  onClick={() => {
                    setServicesOpen(false)
                    openConsultModal("video")
                  }}
                  className="p-2.5 rounded-xl bg-[#FFF3EC] border border-orange-200 flex items-center gap-2 text-xs font-extrabold text-[#F37021]"
                >
                  <Zap size={14} className="shrink-0" />
                  <span>₹29 Video Call</span>
                </button>
              </div>

              <div className="p-3.5 space-y-2.5">
                {CATEGORIES_CATALOG.map((cat) => (
                  <div
                    key={cat.slug}
                    className="rounded-2xl border border-gray-200 bg-white overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        setServicesOpen(false)
                        navigate(`/services/${cat.slug}`)
                      }}
                      className="w-full p-3 bg-[#F4F6F9]/70 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{cat.emoji || cat.icon}</span>
                        <div>
                          <h3 className="font-extrabold text-xs text-[#1A2A49]">{cat.name}</h3>
                          <p className="text-[10px] text-gray-500">Starts ₹{cat.startingPrice}</p>
                        </div>
                      </div>
                      <ChevronRight size={15} className="text-[#F37021]" />
                    </button>

                    <div className="p-2 flex flex-wrap gap-1.5 bg-white">
                      {cat.subcategories?.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setServicesOpen(false)
                            navigate(`/services/${cat.slug}?sub=${sub.id}`)
                          }}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#F4F6F9] text-[#1A2A49] active:bg-[#1A2A49] active:text-white transition"
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
