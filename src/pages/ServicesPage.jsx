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
    <div className="min-h-screen bg-white pt-[72px] md:pt-[112px] pb-28 md:pb-16">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 py-4">
        <BackButton />

        <div className="mt-4 mb-8 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#F37021]">
            8 departments • 60+ services
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1A2A49] mt-2">
            All services.
            <span className="block text-gray-400">One fixed price.</span>
          </h1>

          <div className="relative mt-5 w-full md:w-96">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search AC, MCB, Fan, Geyser, RO..."
              className="w-full pl-11 pr-4 h-12 rounded-full bg-[#F5F5F7] text-sm focus:outline-none focus:ring-2 focus:ring-[#F37021]/60"
            />
          </div>
        </div>

        <div className="space-y-14 sm:space-y-20">
          {filteredCategories.map((cat) => (
            <section key={cat.slug}>
              {/* Category heading — plain text, no box */}
              <div className="flex items-end justify-between gap-4 pb-4 border-b border-gray-200">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl sm:text-4xl">{cat.emoji}</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A2A49]">
                      {cat.name}
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500 mt-1.5 leading-snug">{cat.tagline}</p>
                </div>
                <button
                  onClick={() => navigate(`/services/${cat.slug}`)}
                  className="shrink-0 text-sm font-semibold text-[#F37021] flex items-center gap-0.5"
                >
                  View all <ChevronRight size={16} />
                </button>
              </div>

              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 md:gap-x-12">
                {cat.subcategories.map((sub) => (
                  <div key={sub.id} className="pt-6">
                    <button
                      onClick={() => navigate(`/services/${cat.slug}?sub=${sub.id}`)}
                      className="flex items-center gap-2 text-left mb-1"
                    >
                      <span className="text-xl">{sub.icon}</span>
                      <h3 className="font-bold text-base text-[#1A2A49]">{sub.name}</h3>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>

                    <ul className="divide-y divide-gray-100">
                      {sub.services.map((srv) => {
                        const inCart = cart.some((c) => c.id === srv.id)
                        return (
                          <li key={srv.id} className="flex items-center justify-between gap-4 py-3.5">
                            <div
                              onClick={() => navigate(`/services/${cat.slug}?sub=${sub.id}`)}
                              className="min-w-0 cursor-pointer"
                            >
                              <p className="text-[15px] font-medium text-[#1A2A49] leading-snug">
                                {srv.name}
                              </p>
                              <p className="text-sm mt-0.5">
                                <span className="font-bold text-[#1A2A49]">₹{srv.price}</span>{" "}
                                <span className="text-gray-400 line-through text-xs">
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
                              className={`shrink-0 h-9 px-4 rounded-full text-sm font-semibold flex items-center gap-1 ${
                                inCart
                                  ? "bg-emerald-600 text-white"
                                  : "bg-[#F5F5F7] text-[#1A2A49] active:bg-[#F37021] active:text-white"
                              }`}
                            >
                              {inCart ? <Check size={15} /> : <Plus size={15} />}
                              {inCart ? "Added" : "Add"}
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
