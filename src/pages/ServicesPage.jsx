// src/pages/ServicesPage.jsx
import { useState } from "react"
import { Wrench, Search, Star, ChevronRight, FileText, ShieldCheck, Plus, Check } from "lucide-react"
import { useNavigate } from "react-router-dom"
import BackButton from "../components/BackButton"
import { CATEGORIES_CATALOG } from "../data/servicesCatalog"
import { useApp } from "../AppContext"
import toast from "react-hot-toast"

export default function ServicesPage() {
  const navigate = useNavigate()
  const { cart, addToCart } = useApp()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCategories = CATEGORIES_CATALOG.filter((cat) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.tagline.toLowerCase().includes(q) ||
      cat.subcategories.some(
        (sub) =>
          sub.name.toLowerCase().includes(q) ||
          sub.services.some((s) => s.name.toLowerCase().includes(q))
      )
    )
  })

  return (
    <div className="min-h-screen bg-[#F4F6F9] pt-[92px] md:pt-[112px] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <BackButton />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2 mb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#F37021]">
              8 Master Departments • 32+ Sub-Categories • 60+ Services
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A2A49] flex items-center gap-2 mt-0.5">
              <Wrench size={24} className="text-[#F37021]" /> Complete Services Directory
            </h1>
          </div>

          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AC, MCB, Fan, Geyser, RO..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#F37021]"
            />
          </div>
        </div>

        <div className="space-y-8">
          {filteredCategories.map((cat) => (
            <div
              key={cat.slug}
              className="bg-white rounded-3xl shadow-sm border border-gray-200/80 overflow-hidden"
            >
              {/* Category Header Bar */}
              <div className="bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <span className="text-3xl sm:text-4xl">{cat.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-extrabold">{cat.name}</h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F37021] text-white text-[10px] font-extrabold uppercase">
                        {cat.badge}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-white/80 mt-0.5">{cat.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("pluggy:open-rate-card", {
                          detail: { category: cat.slug },
                        })
                      )
                    }
                    className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <FileText size={14} className="text-amber-300" /> Official Rate Card
                  </button>
                  <button
                    onClick={() => navigate(`/services/${cat.slug}`)}
                    className="px-4 py-2 rounded-xl bg-[#F37021] hover:bg-[#e05e15] text-white text-xs font-extrabold flex items-center gap-1"
                  >
                    Open Store <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Subcategories Grid */}
              <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cat.subcategories.map((sub) => (
                  <div
                    key={sub.id}
                    className="rounded-2xl bg-[#F4F6F9] p-4 border border-gray-200/70 flex flex-col justify-between"
                  >
                    <div>
                      <div
                        onClick={() => navigate(`/services/${cat.slug}?sub=${sub.id}`)}
                        className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-gray-200 cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{sub.icon}</span>
                          <h3 className="font-bold text-sm text-[#1A2A49] group-hover:text-[#F37021]">
                            {sub.name}
                          </h3>
                        </div>
                        <ChevronRight size={15} className="text-gray-400 group-hover:text-[#F37021]" />
                      </div>

                      <div className="space-y-2">
                        {sub.services.map((srv) => {
                          const inCart = cart.some((c) => c.id === srv.id)
                          return (
                            <div
                              key={srv.id}
                              className="bg-white rounded-xl p-2.5 border border-gray-200/60 flex items-center justify-between gap-2"
                            >
                              <div
                                onClick={() => navigate(`/services/${cat.slug}?sub=${sub.id}`)}
                                className="min-w-0 cursor-pointer"
                              >
                                <p className="text-xs font-bold text-[#1A2A49] truncate">
                                  {srv.name}
                                </p>
                                <p className="text-[11px] text-[#F37021] font-extrabold">
                                  ₹{srv.price}{" "}
                                  <span className="text-gray-400 line-through font-normal">
                                    ₹{srv.originalPrice}
                                  </span>
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  if (!addToCart({
                                    id: srv.id,
                                    name: srv.name,
                                    price: srv.price,
                                    category: cat.slug,
                                    categoryName: cat.name,
                                    duration: srv.duration,
                                    warranty: srv.warranty,
                                  })) return
                                  toast.success(`${srv.name} added to cart!`)
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 ${
                                  inCart
                                    ? "bg-emerald-600 text-white"
                                    : "bg-[#1A2A49] text-white hover:bg-[#F37021]"
                                }`}
                              >
                                {inCart ? <Check size={12} /> : <Plus size={12} />}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
