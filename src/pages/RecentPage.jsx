// src/pages/RecentPage.jsx
import { useApp } from "../AppContext"
import BackButton from "../components/BackButton"
import { Clock, Trash2, Sparkles, Wrench } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export default function RecentPage() {
  const { recent, setRecent } = useApp()
  const navigate = useNavigate()
  const [showRecommendations] = useState(true)

  const clearAll = () => {
    setRecent([])
    localStorage.removeItem("pluggy_recent")
    toast.success("Recently viewed cleared")
  }

  const getSlugForItem = (name) => {
    const lower = (name || "").toLowerCase()
    if (lower.includes("ac")) return "/services/ac-repair"
    if (lower.includes("fan")) return "/services/fan-motor"
    if (lower.includes("wir")) return "/services/wiring"
    if (lower.includes("mcb") || lower.includes("fuse")) return "/services/mcb-repair"
    return `/request/${lower.replace(/\s+/g, "-")}`
  }

  const recommendations = [
    {
      name: "AC Repair & Service",
      desc: "Cooling check, gas refill & jet servicing",
      slug: "/services/ac-repair",
      icon: "❄️",
    },
    {
      name: "House Wiring & Switchboard",
      desc: "Safe electrical fittings & short circuit fix",
      slug: "/services/wiring",
      icon: "⚡",
    },
    {
      name: "Fan & Motor Repair",
      desc: "Ceiling fan, exhaust fan & regulator fix",
      slug: "/services/fan-motor",
      icon: "🌀",
    },
  ]

  return (
    <div className="main-container max-w-4xl mx-auto px-4 py-6">
      <BackButton />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 mt-2">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1A2A49] flex items-center gap-2">
          <Clock size={22} className="text-[#F37021]" /> Recently Viewed
        </h2>
        {recent && recent.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
          >
            <Trash2 size={16} /> Clear All
          </button>
        )}
      </div>

      {/* Recent List */}
      {!recent || recent.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Wrench size={28} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">You haven’t viewed any services yet.</p>
          <button
            onClick={() => navigate("/book-service")}
            className="mt-4 px-5 py-2 bg-[#1A2A49] text-white text-sm rounded-full hover:bg-[#223a61] transition"
          >
            Browse Services
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recent.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition flex flex-col"
            >
              <h3 className="font-semibold text-[#1A2A49]">{item}</h3>
              <p className="text-sm text-gray-600 mt-1 mb-4">
                Quick service and trusted professionals
              </p>
              <button
                onClick={() => navigate(getSlugForItem(item))}
                className="mt-auto px-3 py-2 bg-[#1A2A49] text-white rounded-lg text-sm hover:bg-[#223a61] transition"
              >
                Book Again
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {showRecommendations && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-[#1A2A49] mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-yellow-500" />
            Recommended for You
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.map((r, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl mb-3">
                  {r.icon}
                </div>
                <h4 className="font-semibold text-[#1A2A49]">{r.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{r.desc}</p>
                <button
                  onClick={() => navigate(r.slug)}
                  className="mt-4 px-5 py-2 bg-[#1A2A49] text-white text-sm rounded-lg hover:bg-[#223a61] transition"
                >
                  Explore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
