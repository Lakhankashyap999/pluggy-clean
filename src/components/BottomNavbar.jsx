// src/components/BottomNavbar.jsx
import React, { useState, useEffect } from "react"
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

  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [servicesOpen, setServicesOpen] = useState(false)

  const activeBookingsCount = (requests || []).filter(
    (r) => r.status !== "Completed" && r.status !== "Cancelled"
  ).length

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 90) {
        setVisible(false)
      } else if (currentScrollY < lastScrollY) {
        setVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

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
      {/* Mobile Bottom App Bar (md:hidden) */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 bg-[#1A2A49] text-white border-t border-white/15 shadow-2xl z-50 transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="grid grid-cols-5 items-center h-16 px-1">
          {/* 1. Home */}
          <button
            onClick={() => {
              setServicesOpen(false)
              navigate("/")
            }}
            className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold transition ${
              pathname === "/" && !servicesOpen ? "text-[#F37021]" : "text-gray-300"
            }`}
          >
            <Home size={20} />
            <span>Home</span>
          </button>

          {/* 2. Categories Sheet */}
          <button
            onClick={() => setServicesOpen((prev) => !prev)}
            className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold transition ${
              servicesOpen || pathname.startsWith("/services")
                ? "text-[#F37021]"
                : "text-gray-300"
            }`}
          >
            <Grid size={20} />
            <span>Categories</span>
          </button>

          {/* 3. Center Floating SOS / ₹29 Action Button */}
          <div className="flex flex-col items-center justify-center -mt-5">
            <button
              onClick={() => openConsultModal("sos")}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F37021] to-[#FF8C42] text-white shadow-lg border-2 border-[#1A2A49] flex flex-col items-center justify-center active:scale-95 transition"
              title="15-Min SOS & ₹29 Video Call"
            >
              <Zap size={20} />
            </button>
            <span className="text-[10px] font-extrabold text-[#FF8C42] mt-0.5">
              15m SOS
            </span>
          </div>

          {/* 4. Track & OTP PINs */}
          <button
            onClick={() => {
              setServicesOpen(false)
              navigate("/track")
            }}
            className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold transition relative ${
              pathname.startsWith("/track") ? "text-[#F37021]" : "text-gray-300"
            }`}
          >
            <div className="relative">
              <ShieldCheck size={20} />
              {activeBookingsCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-white text-[9px] font-extrabold w-4 h-4 flex items-center justify-center rounded-full">
                  {activeBookingsCount}
                </span>
              )}
            </div>
            <span>Track & PIN</span>
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
            className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold transition relative ${
              pathname.startsWith("/account") ? "text-[#F37021]" : "text-gray-300"
            }`}
          >
            <div className="relative">
              {cart.length > 0 ? <ShoppingCart size={20} /> : <User size={20} />}
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#F37021] text-white text-[9px] font-extrabold w-4 h-4 flex items-center justify-center rounded-full">
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
              className="w-full bg-white rounded-t-3xl max-h-[82vh] overflow-y-auto pb-20 shadow-2xl"
            >
              {/* Sticky Header */}
              <div className="sticky top-0 bg-[#1A2A49] text-white px-5 py-4 flex items-center justify-between z-10 rounded-t-3xl">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F37021] block">
                    Complete Storefront Directory
                  </span>
                  <h2 className="text-base font-extrabold">All 8 Service Categories</h2>
                </div>
                <button
                  onClick={() => setServicesOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Quick Action Pills */}
              <div className="p-4 bg-[#F4F6F9] border-b border-gray-200 grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    setServicesOpen(false)
                    openRateCardModal()
                  }}
                  className="p-2.5 rounded-xl bg-white border border-gray-200 flex items-center gap-2 text-xs font-extrabold text-[#1A2A49]"
                >
                  <Receipt size={15} className="text-emerald-600 shrink-0" />
                  <span>Official Rate Card</span>
                </button>
                <button
                  onClick={() => {
                    setServicesOpen(false)
                    openConsultModal("video")
                  }}
                  className="p-2.5 rounded-xl bg-[#FFF3EC] border border-orange-200 flex items-center gap-2 text-xs font-extrabold text-[#F37021]"
                >
                  <Zap size={15} className="shrink-0" />
                  <span>₹29 Video Diagnosis</span>
                </button>
              </div>

              {/* Category Cards with Sub-Categories */}
              <div className="p-4 space-y-3">
                {CATEGORIES_CATALOG.map((cat) => (
                  <div
                    key={cat.slug}
                    className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs"
                  >
                    <button
                      onClick={() => {
                        setServicesOpen(false)
                        navigate(`/services/${cat.slug}`)
                      }}
                      className="w-full p-3.5 bg-[#F4F6F9]/70 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cat.emoji || cat.icon}</span>
                        <div>
                          <h3 className="font-extrabold text-sm text-[#1A2A49]">{cat.name}</h3>
                          <p className="text-[11px] text-gray-500">
                            Starts ₹{cat.startingPrice} • {cat.subCategories?.length || 4} Sub-Categories
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-[#F37021]" />
                    </button>

                    <div className="p-2.5 flex flex-wrap gap-1.5 bg-white">
                      {cat.subCategories?.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setServicesOpen(false)
                            navigate(`/services/${cat.slug}?sub=${sub.id}`)
                          }}
                          className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#F4F6F9] hover:bg-[#1A2A49] text-[#1A2A49] hover:text-white transition"
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
