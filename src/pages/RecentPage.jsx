import { useApp } from "../AppContext"
import BackButton from "../components/BackButton"
import { Clock, Trash2, Sparkles } from "lucide-react"
import { useState } from "react"

export default function RecentPage() {
  const { recent, setRecent } = useApp()
  const [showRecommendations, setShowRecommendations] = useState(true)

  const clearAll = () => {
    setRecent([])
    localStorage.removeItem("pluggy_recent")
  }

  // Example recommendations (in real case, dynamic aa sakte)
  const recommendations = [
    {
      name: "Geyser Repair",
      desc: "Instant hot water solutions",
      img: "https://illustrations.popsy.co/gray/electrician.svg",
    },
    {
      name: "Deep Cleaning",
      desc: "Kitchen, bathroom & full home cleaning",
      img: "https://illustrations.popsy.co/gray/cleaning.svg",
    },
    {
      name: "Pest Control",
      desc: "Protect your home from insects & pests",
      img: "https://illustrations.popsy.co/gray/pest-control.svg",
    },
  ]

  return (
    <div className="main-container max-w-4xl mx-auto px-4 py-6">
      <BackButton />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1A2A49] flex items-center gap-2">
          <Clock size={22} /> Recently Viewed
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
        <div className="text-center py-12">
          <img
            src="https://illustrations.popsy.co/gray/no-data.svg"
            alt="No recently viewed"
            className="w-40 mx-auto mb-4"
          />
          <p className="text-gray-500">You haven’t viewed any services yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recent.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition flex flex-col"
            >
              <h3 className="font-semibold text-[#1A2A49]">{item}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Quick service and trusted professionals
              </p>
              <button className="mt-auto px-3 py-1.5 bg-[#1A2A49] text-white rounded-lg text-sm hover:bg-[#223a61]">
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
            Because you viewed services
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.map((r, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition flex flex-col items-center text-center"
              >
                <img
                  src={r.img}
                  alt={r.name}
                  className="w-24 h-24 object-contain mb-3"
                />
                <h4 className="font-semibold text-[#1A2A49]">{r.name}</h4>
                <p className="text-sm text-gray-600">{r.desc}</p>
                <button className="mt-3 px-4 py-1.5 bg-[#1A2A49] text-white text-sm rounded-lg hover:bg-[#223a61]">
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
