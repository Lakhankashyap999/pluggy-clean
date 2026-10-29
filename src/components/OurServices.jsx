// src/components/OurServices.jsx
import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Star, ChevronRight, Plus, Check, FileText } from "lucide-react"
import { CATEGORIES_CATALOG } from "../data/servicesCatalog"
import { useApp } from "../AppContext"
import toast from "react-hot-toast"

export default function OurServices() {
  const navigate = useNavigate()
  const { cart, addToCart } = useApp()
  const [selectedSlug, setSelectedSlug] = useState(CATEGORIES_CATALOG[0]?.slug || "ac-repair")

  const activeCategory =
    CATEGORIES_CATALOG.find((c) => c.slug === selectedSlug) || CATEGORIES_CATALOG[0]

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

  const openRateCard = (slug) => {
    window.dispatchEvent(new CustomEvent("pluggy:open-rate-card", { detail: { category: slug } }))
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* 1. Clean Horizontal Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
        {CATEGORIES_CATALOG.map((cat) => {
          const isActive = cat.slug === activeCategory.slug
          return (
            <button
              key={cat.slug}
              onClick={() => setSelectedSlug(cat.slug)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-all shrink-0 ${
                isActive
                  ? "bg-[#1A2A49] text-white shadow-md"
                  : "bg-[#F4F6F9] text-[#1A2A49] hover:bg-gray-200"
              }`}
            >
              <span className="text-base">{cat.emoji}</span>
              <span>{cat.shortName}</span>
            </button>
          )
        })}
      </div>

      {/* 2. Selected Category Header Strip */}
      <div className="bg-[#F4F6F9] rounded-2xl p-4 sm:px-6 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-gray-200/70">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{activeCategory.emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-[#1A2A49]">
                {activeCategory.name}
              </h3>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                <Star size={11} className="fill-amber-400 text-amber-400" /> {activeCategory.rating}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-0.5">{activeCategory.tagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => openRateCard(activeCategory.slug)}
            className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-[#1A2A49] hover:border-[#F37021] flex items-center gap-1.5"
          >
            <FileText size={13} className="text-[#F37021]" /> Spare Rate Card
          </button>
          <button
            onClick={() => navigate(`/services/${activeCategory.slug}`)}
            className="px-4 py-2 rounded-xl bg-[#F37021] hover:bg-[#e05e15] text-white text-xs font-bold flex items-center gap-1"
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* 3. Clean 4 Sub-Category Cards (Horizontal Swipe on Mobile, 4-Col Grid on Desktop) */}
      <motion.div
        key={activeCategory.slug}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2"
      >
        {activeCategory.subcategories.map((sub) => (
          <div
            key={sub.id}
            onClick={() => navigate(`/services/${activeCategory.slug}?sub=${sub.id}`)}
            className="min-w-[265px] sm:min-w-[280px] md:min-w-0 snap-start bg-white rounded-2xl p-5 border border-gray-200 hover:border-[#1A2A49]/40 shadow-xs hover:shadow-md transition flex flex-col justify-between cursor-pointer"
          >
            <div>
              {/* Subcategory Title */}
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-10 h-10 rounded-xl bg-[#F4F6F9] flex items-center justify-center text-xl shrink-0">
                    {sub.icon}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-sm text-[#1A2A49] truncate">{sub.name}</h4>
                    <p className="text-[11px] text-gray-500">{sub.services.length} Services</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-400 shrink-0" />
              </div>

              {/* Services inside Subcategory */}
              <div className="space-y-2.5">
                {sub.services.slice(0, 2).map((srv) => {
                  const inCart = cart.some((item) => item.id === srv.id)
                  return (
                    <div
                      key={srv.id}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#F4F6F9]/70"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1A2A49] truncate">{srv.name}</p>
                        <p className="text-xs font-extrabold text-[#F37021] mt-0.5">
                          ₹{srv.price}{" "}
                          <span className="text-[10px] text-gray-400 line-through font-normal">
                            ₹{srv.originalPrice}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleQuickAdd(e, activeCategory, srv)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 shrink-0 transition ${
                          inCart
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-[#1A2A49] border border-gray-200 hover:bg-[#1A2A49] hover:text-white"
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

            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/services/${activeCategory.slug}?sub=${sub.id}`)
              }}
              className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-[#1A2A49] hover:text-[#F37021] flex items-center justify-between w-full"
            >
              <span>Explore {sub.name}</span>
              <span>→</span>
            </button>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
