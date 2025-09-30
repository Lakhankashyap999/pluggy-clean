import { useState, useEffect } from "react"
import Slider from "../components/Slider"
import { Search, SlidersHorizontal, X } from "lucide-react"
import WhyChooseUs from "../components/WhyChooseUs"
import OurServices from "../components/OurServices"
import FilterDrawer from "../components/FilterDrawer"
import FilteredResults from "../components/FilteredResults"
import CustomerReviews from "../components/CustomerReviews"
import ExtraSections from "../components/ExtraSections"
import MarqueeSection from "../components/MarqueeSection"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useApp } from "../AppContext"

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useApp()

  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [seeMoreOpen, setSeeMoreOpen] = useState(false)

  // ✅ rotating placeholder
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

  // ✅ search filter logic
  const handleChange = (e) => {
    const value = e.target.value.toLowerCase()
    setQuery(value)
    if (!value) {
      setSuggestions([])
      return
    }
    let matches = []
    serviceSuggestions.forEach((item) => {
      if (item.toLowerCase().includes(value)) {
        matches.push(item)
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
      setSearchOpen(false)
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
            className="p-2 bg-[#1A2A49] text-white rounded-full hover:bg-[#223a61] transition"
          >
            <Search size={18} />
          </button>
          <button
            onClick={() => setFilterOpen(true)}
            className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 bg-white"
          >
            <SlidersHorizontal size={18} className="text-[#1A2A49]" />
          </button>

          {/* ✅ Suggestions dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => handleSearch(s)}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ✅ Mobile Search Drawer */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end sm:hidden"
          >
            <div className="bg-white rounded-t-2xl w-full p-4 shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-[#1A2A49]">Search Services</h3>
                <button onClick={() => setSearchOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder={`Try "${placeholder}"`}
                className="w-full border rounded-lg px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A49]"
              />
              {suggestions.length > 0 && (
                <div className="max-h-40 overflow-y-auto border rounded-lg mb-3">
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      onClick={() => handleSearch(s)}
                      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => handleSearch()}
                className="w-full py-2 bg-[#1A2A49] text-white rounded-lg hover:bg-[#223a61]"
              >
                Search
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Filter Drawer */}
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={(filters) => {
          setAppliedFilters(filters)
          setFilterOpen(false)
        }}
      />

      {/* ✅ Main Content */}
      <div className="flex-1">
        {appliedFilters ? (
          <FilteredResults filters={appliedFilters} />
        ) : (
          <>
            {/* Slider */}
            <section>
              <Slider />
            </section>

            {/* Hero Section */}
            <section className="bg-gray-50 px-4 sm:px-6 lg:px-12 py-10 flex flex-col lg:flex-row items-center justify-between gap-8">
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
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={() => navigate("/services")}
                    className="px-6 py-2 bg-[#1A2A49] text-white rounded-lg shadow hover:bg-[#223a61]"
                  >
                    Book a Service
                  </button>
                  <a
                    href="tel:+919876543210"
                    className="px-6 py-2 border border-[#1A2A49] text-[#1A2A49] rounded-lg hover:bg-gray-50"
                  >
                    Call Us
                  </a>
                </div>
              </motion.div>

              {/* Right */}
              <motion.img
                src="../image/Electrician-rafiki.png"
                alt="Home Services"
                className="w-full max-w-md rounded-xl"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              />
            </section>

            {/* Our Services */}
            <section className="px-4 sm:px-6 lg:px-12 py-12 bg-white">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-bold text-[#1A2A49]">
                  Our Services
                </h2>
                <button
                  onClick={() => setSeeMoreOpen(true)}
                  className="px-5 py-2 text-sm bg-[#1A2A49] text-white rounded-lg shadow hover:bg-[#223a61] transition"
                >
                  See More
                </button>
              </div>
              <OurServices />
            </section>

            {/* Why Choose Pluggy */}
            <section className="px-4 sm:px-6 lg:px-12 py-12 bg-gray-50 text-center">
              <h2 className="text-3xl font-bold text-[#1A2A49] mb-2">
                Why Choose Pluggy?
              </h2>
              <p className="text-gray-600 mb-10 text-sm sm:text-base">
                Our Advantage – Trusted by thousands of happy customers
              </p>
              <WhyChooseUs />
            </section>

            {/* Customer Reviews */}
            <section className="px-4 sm:px-6 lg:px-12 py-10 bg-white">
              <CustomerReviews />
            </section>

            {/* Extra Sections */}
            <section className="px-4 sm:px-6 lg:px-12 py-10 bg-gray-50">
              <ExtraSections />
            </section>

            {/* ✅ Marquee */}
            <section>
              <MarqueeSection />
            </section>
          </>
        )}
      </div>

      {/* ✅ See More Popup */}
      <AnimatePresence>
        {seeMoreOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative"
            >
              <button
                onClick={() => setSeeMoreOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <X size={22} />
              </button>

              <h3 className="text-xl font-bold text-[#1A2A49] mb-4">More Services</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <li>🔧 Geyser Repair</li>
                <li>🚿 Water Purifier Installation</li>
                <li>🧹 Deep Cleaning</li>
                <li>🪟 Window Repair</li>
                <li>📺 TV Wall Mount</li>
                <li>🚪 Door Lock Fix</li>
                <li>🛠️ Modular Kitchen Setup</li>
                <li>💡 Smart Home Automation</li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
