import React, { useState } from "react"
import { Star, CheckCircle2, ThumbsUp, MapPin } from "lucide-react"
import toast from "react-hot-toast"

const REVIEWS_DATA = [
  {
    id: "PLG-8921",
    category: "ac",
    name: "Rohit Sharma",
    location: "Indirapuram, Ghaziabad",
    rating: 5,
    serviceBooked: "Split AC Foam-Jet & Capacitor",
    text: "Local mechanic ne ₹1,400 maange the. Pluggy engineer ne official In-App Rate Card dikhaya—sirf ₹249 capacitor + ₹499 service laga! Cooling bilkul naye AC jaisi ho gayi.",
    helpfulCount: 42,
  },
  {
    id: "PLG-8754",
    category: "sos",
    name: "Neha Verma",
    location: "Sector 62, Noida",
    rating: 5,
    serviceBooked: "15-Min Midnight MCB SOS",
    text: "Raat 11:30 baje main board me sparking hui. Pluggy ka 15-Min SOS book kiya—14 minute me engineer ne aakar burnt 32A MCB badal diya!",
    helpfulCount: 68,
  },
  {
    id: "PLG-8610",
    category: "standby",
    name: "Rajeshwar Prasad",
    location: "Dwarka Sec 12, Delhi",
    rating: 5,
    serviceBooked: "Shaadi 8-Hour Standby Guard",
    text: "Beti ke sangeet function ke liye 8-Hour Standby Engineer book kiya. Unhone pehle hi load balance kar diya, poore function me ek second ke liye bhi light trip nahi hui!",
    helpfulCount: 55,
  },
  {
    id: "PLG-8432",
    category: "appliances",
    name: "Pooja Kulkarni",
    location: "Andheri West, Mumbai",
    rating: 5,
    serviceBooked: "Fan Winding + Standby Fan",
    text: "Bedroom ka fan jal gaya tha aur winding me 24 hours lagne the. Engineer ne turant apna Standby High-Speed Fan lagaya taaki humein garmi me na sona pade.",
    helpfulCount: 91,
  },
  {
    id: "PLG-8309",
    category: "appliances",
    name: "Ankit Bansal",
    location: "Vaishali Sec 4, Ghaziabad",
    rating: 5,
    serviceBooked: "₹29 Video Consult + Microwave Fix",
    text: "Pehle ₹29 Video Call par senior engineer ko microwave dikhaya—3 minute me fault bata diya. Engineer exact spare part lekar aaya aur ek hi visit me kaam ho gaya.",
    helpfulCount: 37,
  },
  {
    id: "PLG-8195",
    category: "ac",
    name: "Kavita Nair",
    location: "Powai, Mumbai",
    rating: 5,
    serviceBooked: "₹79 Chota-Kaam Express",
    text: "2 switch aur fan regulator badalne ke liye ₹79 Chota-Kaam Express se book kiya—verified uniform waale engineer ne Start PIN aur Happy PIN se 20 minute me kar diya.",
    helpfulCount: 49,
  },
]

const FILTER_TABS = [
  { id: "all", label: "All Reviews" },
  { id: "ac", label: "❄️ AC & Wiring" },
  { id: "sos", label: "🚨 15-Min SOS" },
  { id: "standby", label: "🎪 Shaadi Guard" },
  { id: "appliances", label: "🔄 Appliances" },
]

export default function CustomerReviews() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [likedIds, setLikedIds] = useState({})

  const filteredReviews =
    selectedFilter === "all"
      ? REVIEWS_DATA
      : REVIEWS_DATA.filter((r) => r.category === selectedFilter)

  const handleToggleHelpful = (id) => {
    setLikedIds((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      if (next[id]) toast.success("Marked review as helpful!")
      return next
    })
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Clean Header + Filter Pills */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#F4F6F9] px-3 py-1 rounded-full border border-gray-200 mb-2">
            <span className="font-extrabold text-xs text-[#1A2A49]">⭐ 4.8 / 5</span>
            <span className="text-[11px] text-gray-500">• 12,400+ Happy-PIN Verified Bookings</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#1A2A49] font-poppins">
            What Homeowners Say About Pluggy
          </h2>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition shrink-0 ${
                selectedFilter === tab.id
                  ? "bg-[#1A2A49] text-white"
                  : "bg-[#F4F6F9] text-[#1A2A49] hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Review Cards (Horizontal Swipe on Mobile, 3-Col Grid on Desktop) */}
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto no-scrollbar snap-x pb-2">
        {filteredReviews.map((review) => {
          const isLiked = !!likedIds[review.id]
          return (
            <div
              key={review.id}
              className="min-w-[275px] sm:min-w-[300px] md:min-w-0 snap-start bg-[#F4F6F9]/60 rounded-2xl p-5 border border-gray-200 flex flex-col justify-between text-left"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#1A2A49] text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#1A2A49] text-sm leading-tight">
                        {review.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} className="text-[#F37021]" /> {review.location}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 size={10} /> Verified
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-bold text-[#F37021] truncate">
                    {review.serviceBooked}
                  </span>
                  <div className="flex items-center gap-0.5 shrink-0">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 text-xs leading-relaxed mb-4">“{review.text}”</p>
              </div>

              <div className="pt-3 border-t border-gray-200/70 flex items-center justify-between">
                <button
                  onClick={() => handleToggleHelpful(review.id)}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                    isLiked ? "bg-[#1A2A49] text-white" : "bg-white text-gray-600 border border-gray-200"
                  }`}
                >
                  <ThumbsUp size={12} /> Helpful ({review.helpfulCount + (isLiked ? 1 : 0)})
                </button>
                <span className="text-[10px] text-gray-400 font-mono">#{review.id}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
