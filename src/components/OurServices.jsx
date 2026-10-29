// src/components/OurServices.jsx
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Star, ChevronRight, ShieldCheck, Clock, Plus, Check, FileText } from "lucide-react"
import { CATEGORIES_CATALOG } from "../data/servicesCatalog"
import { useApp } from "../AppContext"
import toast from "react-hot-toast"

export default function OurServices({ onClickService }) {
  const navigate = useNavigate()
  const { cart, addToCart } = useApp()
  const [activeFilter, setActiveFilter] = useState("ALL")

  const handleQuickAdd = (e, cat, srv) => {
    e.stopPropagation()
    addToCart({
      id: srv.id,
      name: srv.name,
      price: srv.price,
      category: cat.slug,
      categoryName: cat.name,
      duration: srv.duration,
      warranty: srv.warranty,
    })
    toast.success(`${srv.name} added to cart!`)
  }

  const openRateCard = (e, slug) => {
    e.stopPropagation()
    window.dispatchEvent(new CustomEvent("pluggy:open-rate-card", { detail: { category: slug } }))
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-5">
        <button
          onClick={() => setActiveFilter("ALL")}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            activeFilter === "ALL"
              ? "bg-[#1A2A49] text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:border-[#F37021]"
          }`}
        >
          ⚡ All 8 Categories ({CATEGORIES_CATALOG.length})
        </button>
        {CATEGORIES_CATALOG.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setActiveFilter(cat.slug)}
            className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeFilter === cat.slug
                ? "bg-[#F37021] text-white shadow-md"
                : "bg-white text-[#1A2A49] border border-gray-200 hover:border-[#F37021]"
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.shortName}</span>
          </button>
        ))}
      </div>

      {/* Rich Flipkart/Amazon-Style Category & Subcategory Showcase Grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AnimatePresence mode="popLayout">
          {CATEGORIES_CATALOG.filter((c) => activeFilter === "ALL" || c.slug === activeFilter).map((cat, i) => {
            const topServices = cat.subcategories.flatMap((s) => s.services).slice(0, 2)

            return (
              <motion.div
                key={cat.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -5 }}
                onClick={() => (onClickService ? onClickService(cat.slug) : navigate(`/services/${cat.slug}`))}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-200/80 overflow-hidden flex flex-col justify-between cursor-pointer group transition-all"
              >
                {/* Card Header Banner */}
                <div>
                  <div className="p-4 sm:p-5 bg-gradient-to-br from-[#1A2A49] to-[#223a61] text-white relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 text-6xl opacity-15 group-hover:scale-110 transition-transform select-none">
                      {cat.emoji}
                    </div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F37021] text-white text-[10px] font-bold uppercase tracking-wider">
                        {cat.badge}
                      </span>
                      <span className="flex items-center gap-1 bg-white/15 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold">
                        <Star size={11} className="text-amber-400 fill-amber-400" /> {cat.rating} ({cat.bookingsCount})
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl sm:text-3xl">{cat.emoji}</span>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg leading-snug text-white group-hover:text-[#FF8C42] transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-white/75 text-xs line-clamp-1">{cat.tagline}</p>
                      </div>
                    </div>
                  </div>

                  {/* Clickable Subcategories Pills (Flipkart/Amazon Department Style) */}
                  <div className="p-4 pb-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Sub-Categories ({cat.subcategories.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/services/${cat.slug}?sub=${sub.id}`)
                          }}
                          className="text-xs bg-[#F4F6F9] hover:bg-[#1A2A49] text-[#1A2A49] hover:text-white px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1"
                        >
                          <span>{sub.icon}</span>
                          <span className="truncate max-w-[130px]">{sub.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick-Add Top Services inside Card */}
                  <div className="px-4 py-2 space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Quick Book Services
                    </p>
                    {topServices.map((srv) => {
                      const inCart = cart.some((item) => item.id === srv.id)
                      return (
                        <div
                          key={srv.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/services/${cat.slug}`)
                          }}
                          className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#F4F6F9]/70 hover:bg-[#F4F6F9] border border-gray-100"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#1A2A49] truncate">{srv.name}</p>
                            <div className="flex items-center gap-2 text-[11px] text-gray-500">
                              <span className="font-bold text-[#F37021]">₹{srv.price}</span>
                              <span className="line-through text-gray-400">₹{srv.originalPrice}</span>
                              <span className="flex items-center gap-0.5">
                                <Clock size={10} /> {srv.duration}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleQuickAdd(e, cat, srv)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition ${
                              inCart
                                ? "bg-emerald-600 text-white"
                                : "bg-white text-[#F37021] border border-[#F37021] hover:bg-[#F37021] hover:text-white"
                            }`}
                          >
                            {inCart ? (
                              <>
                                <Check size={12} /> Added
                              </>
                            ) : (
                              <>
                                <Plus size={12} /> Add
                              </>
                            )}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-3 mt-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
                  <button
                    onClick={(e) => openRateCard(e, cat.slug)}
                    className="text-gray-600 hover:text-[#1A2A49] font-medium flex items-center gap-1"
                  >
                    <FileText size={13} className="text-[#F37021]" /> Official Rate Card
                  </button>
                  <span className="font-bold text-[#1A2A49] group-hover:text-[#F37021] flex items-center gap-0.5">
                    Explore All <ChevronRight size={14} />
                  </span>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
