import React, { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  ShieldCheck,
  MapPin,
  Wrench,
  Sparkles,
  ArrowUpRight,
  MessageSquarePlus,
} from "lucide-react"
import toast from "react-hot-toast"

const REVIEWS_DATA = [
  {
    id: "PLG-8921",
    category: "ac",
    name: "Rohit Sharma",
    location: "Indirapuram, Ghaziabad",
    date: "2 days ago",
    rating: 5,
    serviceBooked: "Split AC Foam-Jet Service & Capacitor",
    engineerName: "Ramesh Kumar (4.9★)",
    savedBadge: "Saved ₹450 via Rate Card",
    text: "Local mechanic ne AC capacitor aur service ke ₹1,400 maange the. Pluggy ke engineer Ramesh ji ne official In-App Rate Card dikhaya—sirf ₹249 capacitor + ₹499 Foam-Jet service laga! Cooling bilkul naye AC jaisi ho gayi hai.",
    helpfulCount: 42,
    serviceLink: "/services/ac-repair",
  },
  {
    id: "PLG-8754",
    category: "sos",
    name: "Neha Verma",
    location: "Sector 62, Noida",
    date: "4 days ago",
    rating: 5,
    serviceBooked: "15-Min Emergency MCB & Distribution Box SOS",
    engineerName: "Vikram Singh (4.9★)",
    savedBadge: "Arrived in 14 Mins",
    text: "Raat 11:30 baje achanak main distribution board me sparking hui aur poore ghar ki light chali gayi. Pluggy ka 15-Min SOS book kiya—executive ne turant call karke safety guide kiya aur 14 minute me engineer ne aakar burnt 32A MCB badal diya!",
    helpfulCount: 68,
    serviceLink: "/services/wiring",
  },
  {
    id: "PLG-8610",
    category: "standby",
    name: "Rajeshwar Prasad",
    location: "Dwarka Sector 12, Delhi",
    date: "1 week ago",
    rating: 5,
    serviceBooked: "Shaadi / Function 8-Hour Dedicated Standby",
    engineerName: "Suresh Nair (4.8★)",
    savedBadge: "Zero Power Cut in Function",
    text: "Beti ki mehendi aur sangeet function ke liye ghar par heavy decorative lights aur catering geysers lage the. Pluggy ka 8-Hour Standby Engineer book kiya—unhone pehle hi load balance kar diya, poore function me ek second ke liye bhi light trip nahi hui!",
    helpfulCount: 55,
    serviceLink: "/services/wiring",
  },
  {
    id: "PLG-8432",
    category: "appliances",
    name: "Pooja Kulkarni",
    location: "Andheri West, Mumbai",
    date: "1 week ago",
    rating: 5,
    serviceBooked: "Ceiling Fan Winding + Standby Backup Fan",
    engineerName: "Deepak Yadav (4.7★)",
    savedBadge: "Got ₹99/Day Standby Fan",
    text: "Sabse best chiz mujhe Pluggy ki Standby Appliance lagi! Mere bedroom ka fan jal gaya tha aur winding me 24 hours lagne the. Engineer ne turant apna Standby High-Speed Fan lagaya taaki humein garmi me na sona pade. Urban Company me bhi ye सुविधा nahi hai!",
    helpfulCount: 91,
    serviceLink: "/services/fan-motor",
  },
  {
    id: "PLG-8309",
    category: "appliances",
    name: "Ankit Bansal",
    location: "Vaishali Sector 4, Ghaziabad",
    date: "2 weeks ago",
    rating: 5,
    serviceBooked: "₹29 Video Consult + Microwave Magnetron Fix",
    engineerName: "Mohd. Irfan (4.8★)",
    savedBadge: "₹29 Adjusted in Final Bill",
    text: "Pehle ₹29 Video Call par senior engineer ko microwave dikhaya—unhone 3 minute me bata diya ki high-voltage diode aur magnetron ka issue hai. Engineer exact spare part lekar aaya, ek hi visit me kaam khatam aur 30-Day QR Warranty bhi mili.",
    helpfulCount: 37,
    serviceLink: "/services/appliances",
  },
  {
    id: "PLG-8195",
    category: "micro",
    name: "Kavita Nair",
    location: "Powai, Mumbai",
    date: "2 weeks ago",
    rating: 5,
    serviceBooked: "₹79 Chota-Kaam Express (Switch & Regulator)",
    engineerName: "Ramesh Kumar (4.9★)",
    savedBadge: "Dual-PIN Verified Safety",
    text: "Chote kaam jaise 2 switch aur fan regulator badalne ke liye koi local electrician aata hi nahi tha. Pluggy ke ₹79 Chota-Kaam Express se book kiya—verified uniform waale भैया aaye, Start PIN aur Happy PIN se poora kaam 20 minute me kar diya.",
    helpfulCount: 49,
    serviceLink: "/services/wiring",
  },
]

const FILTER_TABS = [
  { id: "all", label: "All Verified Reviews (6)" },
  { id: "ac", label: "❄️ AC & Rate Card" },
  { id: "sos", label: "🚨 15-Min SOS" },
  { id: "standby", label: "🎪 Shaadi Standby" },
  { id: "appliances", label: "🔄 Standby Loaner & Appliances" },
  { id: "micro", label: "⚡ ₹79 Chota-Kaam" },
]

export default function CustomerReviews() {
  const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [likedIds, setLikedIds] = useState({})

  const filteredReviews =
    selectedFilter === "all"
      ? REVIEWS_DATA
      : REVIEWS_DATA.filter((r) => r.category === selectedFilter)

  const handleToggleHelpful = (id) => {
    setLikedIds((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      if (next[id]) {
        toast.success("Marked review as helpful!")
      }
      return next
    })
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* 1. Top Rating Breakdown & Verified Trust Summary Banner */}
      <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-7 shadow-sm mb-6 sm:mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Score & Stars (4 cols) */}
          <div className="lg:col-span-4 flex items-center gap-5 border-b lg:border-b-0 lg:border-r border-gray-100 pb-5 lg:pb-0 lg:pr-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#1A2A49] text-white flex flex-col items-center justify-center shrink-0 shadow-md">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#F37021]">4.8</span>
              <span className="text-[11px] text-gray-300 font-semibold">out of 5.0</span>
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#1A2A49]">
                12,400+ Happy Households
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                100% reviews from Happy-PIN completed doorstep jobs
              </p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-2">
                <ShieldCheck size={12} /> Dual-OTP Verified Feedback
              </span>
            </div>
          </div>

          {/* Center: Rating Bars (4 cols) */}
          <div className="lg:col-span-4 space-y-2 border-b lg:border-b-0 lg:border-r border-gray-100 pb-5 lg:pb-0 lg:pr-6">
            {[
              { stars: "5 ★", pct: 86, count: "10,664" },
              { stars: "4 ★", pct: 11, count: "1,364" },
              { stars: "3 ★", pct: 2, count: "248" },
              { stars: "1-2 ★", pct: 1, count: "124" },
            ].map((bar, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs">
                <span className="w-10 font-bold text-[#1A2A49] shrink-0">{bar.stars}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F37021] rounded-full"
                    style={{ width: `${bar.pct}%` }}
                  />
                </div>
                <span className="w-12 text-right text-gray-500 font-semibold">{bar.pct}%</span>
              </div>
            ))}
          </div>

          {/* Right: Customer Satisfaction Highlights (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#F4F6F9] border border-gray-200/70">
                <p className="text-lg font-extrabold text-[#1A2A49]">99.2%</p>
                <p className="text-[11px] text-gray-600 font-medium">On-Time Arrival Rate</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#FFF3EC] border border-orange-200/70">
                <p className="text-lg font-extrabold text-[#F37021]">₹0</p>
                <p className="text-[11px] text-gray-700 font-medium">Overcharging Complaints</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/track")}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1A2A49] hover:bg-[#223a61] text-white text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <MessageSquarePlus size={15} /> Rate Your Completed Service in Track Hub
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">
            Filter by Service:
          </span>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                selectedFilter === tab.id
                  ? "bg-[#F37021] text-white shadow-sm"
                  : "bg-[#F4F6F9] text-[#1A2A49] hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Verified Customer Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredReviews.map((review, index) => {
          const isLiked = !!likedIds[review.id]
          return (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition border border-gray-200 flex flex-col justify-between text-left"
            >
              <div>
                {/* Top Row: Customer Avatar + Verified Booking ID */}
                <div className="flex items-start justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#1A2A49] text-white flex items-center justify-center font-extrabold text-base shrink-0">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#1A2A49] text-sm sm:text-base leading-tight">
                        {review.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-[#F37021]" /> {review.location} •{" "}
                        {review.date}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                    <CheckCircle2 size={11} /> #{review.id}
                  </span>
                </div>

                {/* Service Booked & Savings Badge */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#F4F6F9] text-[#1A2A49] px-2.5 py-1 rounded-lg">
                    <Wrench size={11} className="text-[#F37021]" /> {review.serviceBooked}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-[#FFF3EC] text-[#F37021] border border-orange-200 px-2 py-0.5 rounded-lg">
                    <Sparkles size={10} /> {review.savedBadge}
                  </span>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-2.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[11px] font-bold text-gray-500 ml-1">
                    Tech: {review.engineerName}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
                  “{review.text}”
                </p>
              </div>

              {/* Footer Actions */}
              <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggleHelpful(review.id)}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                    isLiked
                      ? "bg-[#1A2A49] text-white"
                      : "bg-[#F4F6F9] text-gray-600 hover:text-[#1A2A49]"
                  }`}
                >
                  <ThumbsUp size={13} /> Helpful ({review.helpfulCount + (isLiked ? 1 : 0)})
                </button>

                <button
                  onClick={() => navigate(review.serviceLink)}
                  className="inline-flex items-center gap-1 text-xs font-extrabold text-[#F37021] hover:underline"
                >
                  Book This Service <ArrowUpRight size={14} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
