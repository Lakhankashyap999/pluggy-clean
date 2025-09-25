import { useState, useEffect } from "react"
import Slider from "../components/Slider"
import { Search, SlidersHorizontal, X } from "lucide-react"
import WhyChooseUs from "../components/WhyChooseUs"
import OurServices from "../components/OurServices"
import FilterDrawer from "../components/FilterDrawer"
import FilteredResults from "../components/FilteredResults"
import CustomerReviews from "../components/CustomerReviews"
import ExtraSections from "../components/ExtraSections"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

export default function Dashboard() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false) // ✅ mobile drawer toggle

  // ✅ all services
  const allServices = {
    ac: ["AC Repair", "AC Installation", "AC Gas Refill"],
    fan: ["Fan Motor Repair", "Ceiling Fan Installation", "Fan Regulator Fix"],
    wiring: ["House Wiring", "Short Circuit Fix", "Switchboard Repair"],
    electrical: ["Fuse Replacement", "MCB Repair", "New Electrical Fittings"],
  }

  // ✅ placeholder auto typing services
  const serviceSuggestions = [
    "AC Repair",
    "AC Installation",
    "Fan Motor Repair",
    "Ceiling Fan Installation",
    "House Wiring",
    "Short Circuit Fix",
    "Switchboard Repair",
    "Fuse Replacement",
    "MCB Repair",
    "New Electrical Fittings",
  ]
  const [placeholder, setPlaceholder] = useState(serviceSuggestions[0])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % serviceSuggestions.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setPlaceholder(serviceSuggestions[index])
  }, [index])

  // ✅ suggestion filter
  const handleChange = (e) => {
    const value = e.target.value.toLowerCase()
    setQuery(value)
    if (!value) {
      setSuggestions([])
      return
    }
    let matches = []
    Object.keys(allServices).forEach((key) => {
      if (key.startsWith(value)) {
        matches = [...matches, ...allServices[key]]
      }
    })
    setSuggestions(matches)
  }

  const handleSearch = (text) => {
    const q = text || query
    if (q.trim()) {
      navigate(`/request/${q.replace(/\s+/g, "-").toLowerCase()}`)
      setQuery("")
      setSuggestions([])
      setSearchOpen(false) // close drawer on mobile
    }
  }

  return (
    <div className="min-h-screen flex flex-col">

      {/* ✅ Desktop/Tablet Search Bar */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-40 w-full px-4 sm:px-6 py-3 bg-white/80 backdrop-blur-md hidden sm:block"
      >
        <div className="relative flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm max-w-full sm:max-w-md lg:max-w-2xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={`Try "${placeholder}"`}
            className="flex-1 bg-transparent border-none focus:outline-none px-2 py-1 text-sm sm:text-base placeholder-gray-400"
          />
          <button
            onClick={() => handleSearch()}
            className="p-2 bg-[#1A2A49] text-white rounded-full hover:bg-[#223a61]"
          >
            <Search size={18} />
          </button>
          <button
            onClick={() => setFilterOpen(true)}
            className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 bg-white"
          >
            <SlidersHorizontal size={18} className="text-[#1A2A49]" />
          </button>

          {/* ✅ Suggestions dropdown desktop */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSearch(s)}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ✅ Mobile Floating Search Button */}
      <button
        onClick={() => setSearchOpen(true)}
        className="sm:hidden fixed bottom-20 right-4 z-40 bg-[#1A2A49] text-white p-4 rounded-full shadow-lg"
      >
        <Search size={22} />
      </button>

      {/* ✅ Mobile Search Drawer */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder={`Try "${placeholder}"`}
                className="flex-1 border rounded-full px-3 py-2 text-sm focus:outline-none placeholder-gray-400"
              />
              <button
                onClick={() => handleSearch()}
                className="p-2 bg-[#1A2A49] text-white rounded-full hover:bg-[#223a61]"
              >
                <Search size={18} />
              </button>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <X size={18} />
              </button>
            </div>

            {/* ✅ Suggestions dropdown mobile */}
            {suggestions.length > 0 && (
              <div className="mt-2 bg-white border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSearch(s)}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Main Content */}
      <div className="flex-1">
        {appliedFilters ? (
          <FilteredResults filters={appliedFilters} />
        ) : (
          <>
            <section>
              <Slider />
            </section>

            <section className="block sm:hidden mt-4 px-4">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img
                  src="/image/dussehra-banner.jpg"
                  alt="Happy Dussehra"
                  className="w-full h-auto object-cover"
                />
              </div>
            </section>

            {/* Hero Section */}
            <section className="bg-gray-50 px-4 sm:px-6 lg:px-12 py-8 flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1 space-y-4"
              >
                <h2 className="text-2xl sm:text-4xl font-bold text-[#1A2A49] leading-snug">
                  Reliable Home Services,{" "}
                  <br className="hidden sm:block" /> Anytime, Anywhere 🚀
                </h2>
                <div className="flex flex-col gap-2 text-gray-700 text-sm">
                  <p>⭐ <span className="font-semibold">4.8/5</span> Average Rating</p>
                  <p>🏠 <span className="font-semibold">10,000+</span> Homes Served</p>
                  <p>👨‍🔧 <span className="font-semibold">500+</span> Verified Technicians</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto">
                  <button
                    onClick={() => navigate("/request/ac-repair")}
                    className="w-full sm:w-auto px-5 py-3 bg-[#1A2A49] text-white rounded-lg shadow hover:bg-[#223a61]"
                  >
                    Book Now
                  </button>
                  <button
                    onClick={() => (window.location.href = "tel:+911234567890")}
                    className="w-full sm:w-auto px-5 py-3 bg-[#1A2A49] text-white rounded-lg shadow hover:bg-[#223a61]"
                  >
                    Call Us
                  </button>
                </div>
              </motion.div>

              {/* Right */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-4 items-center flex-1 w-full"
              >
                <div className="bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white px-6 py-4 rounded-xl shadow-lg w-full max-w-sm">
                  <p className="text-lg font-bold">🎉 Special Offer</p>
                  <p className="text-sm mt-1">
                    Get <span className="font-semibold">20% OFF</span> on your first booking! <br />
                    Use Code:{" "}
                    <span className="bg-white text-[#1A2A49] px-2 py-0.5 rounded">PLUG20</span>
                  </p>
                </div>
                <img
                  src="/image/Electrician-rafiki.png"
                  alt="Technician"
                  className="w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[420px] object-contain"
                />
              </motion.div>
            </section>

            <section className="bg-gray-50 py-10 px-4">
              <WhyChooseUs />
            </section>

            <section className="bg-white py-10 px-4">
              <OurServices />
            </section>

            <section className="bg-gray-50 py-10 px-4">
              <CustomerReviews />
            </section>

            <section className="bg-white py-10 px-4">
              <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-[#1A2A49] mb-4">
                  Trusted By Leading Brands
                </h2>
                <div className="flex flex-wrap justify-center gap-6">
                  <img src="../image/philips.png" alt="Philips" className="h-8 sm:h-10" />
                  <img src="../image/crompton.png" alt="Crompton" className="h-8 sm:h-10" />
                  <img src="../image/syska.png" alt="Syska" className="h-8 sm:h-10" />
                  <img src="../image/havells.jpg" alt="Havells" className="h-8 sm:h-10" />
                </div>
              </div>
            </section>

            <section className="bg-gray-50 py-10 px-4">
              <ExtraSections />
            </section>
          </>
        )}
      </div>
    </div>
  )
}
