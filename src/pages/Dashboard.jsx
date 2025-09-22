import { useState, useRef, useEffect } from "react"
import Slider from "../components/Slider"
import LocomotiveScroll from "locomotive-scroll"
import "locomotive-scroll/dist/locomotive-scroll.css"
import { ReactTyped } from "react-typed"
import { SlidersHorizontal, Search, X } from "lucide-react"
import WhyChooseUs from "../components/WhyChooseUs"
import OurServices from "../components/OurServices"
import FilterDrawer from "../components/FilterDrawer"
import FilteredResults from "../components/FilteredResults"
import CustomerReviews from "../components/CustomerReviews"
import ExtraSections from "../components/ExtraSections"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

export default function Dashboard() {
  const scrollRef = useRef(null)
  const scrollInstance = useRef(null)
  const navigate = useNavigate()

  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState(null)
  const [openSearch, setOpenSearch] = useState(false)

  useEffect(() => {
    if (!scrollRef.current) return
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      lerp: 0.08,
    })
    scrollInstance.current = scroll
    return () => scroll.destroy()
  }, [])

  useEffect(() => {
    if (filterOpen || openSearch) {
      document.body.style.overflow = "hidden"
      scrollInstance.current?.stop()
    } else {
      document.body.style.overflow = "auto"
      scrollInstance.current?.start()
    }
  }, [filterOpen, openSearch])

  const allServices = {
    ac: ["AC Repair", "AC Installation", "AC Gas Refill"],
    fan: ["Fan Motor Repair", "Ceiling Fan Installation", "Fan Regulator Fix"],
    wiring: ["House Wiring", "Short Circuit Fix", "Switchboard Repair"],
    electrical: ["Fuse Replacement", "MCB Repair", "New Electrical Fittings"],
  }

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

  const popularSearches = ["AC Repair", "Fan Installation", "Switchboard Fix", "Lighting Setup"]

  return (
    <div ref={scrollRef} data-scroll-container className="min-h-screen pb-20">
      {appliedFilters ? (
        <FilteredResults filters={appliedFilters} />
      ) : (
        <>
          {/* Hero Slider */}
          <section data-scroll-section>
            <Slider />
          </section>

          {/* Hero Section */}
          <section
            data-scroll-section
            className="bg-gray-50 px-4 sm:px-6 lg:px-12 py-8 flex flex-col lg:flex-row items-center justify-between gap-8"
          >
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center lg:items-start text-center lg:text-left flex-1 space-y-4"
            >
              <h2 className="text-2xl sm:text-4xl font-bold text-[#1A2A49] leading-snug">
                Reliable Home Services, <br className="hidden sm:block" /> Anytime, Anywhere 🚀
              </h2>

              <div className="flex flex-col gap-2 text-gray-700 text-sm">
                <p>⭐ <span className="font-semibold">4.8/5</span> Average Rating</p>
                <p>🏠 <span className="font-semibold">10,000+</span> Homes Served</p>
                <p>👨‍🔧 <span className="font-semibold">500+</span> Verified Technicians</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto">
                <button
                  onClick={() => navigate("/request/ac-repair")}
                  className="w-full sm:w-auto px-5 py-3 bg-[#1A2A49] text-white rounded-lg shadow hover:bg-[#223a61]">
                  Book Now
                </button>
                <button
                  onClick={() => (window.location.href = 'tel:+911234567890')}
                  className="w-full sm:w-auto px-5 py-3 bg-[#1A2A49] text-white rounded-lg shadow hover:bg-[#223a61]">
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
                  Use Code: <span className="bg-white text-[#1A2A49] px-2 py-0.5 rounded">PLUG20</span>
                </p>
              </div>

              <img
                src="/image/Electrician-rafiki.png"
                alt="Technician"
                className="w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[420px] object-contain"
              />
            </motion.div>
          </section>

          {/* Why Choose Us */}
          <section data-scroll-section className="bg-gray-50 py-10 px-4">
            <WhyChooseUs />
          </section>

          {/* Services */}
          <section data-scroll-section className="bg-white py-10 px-4">
            <OurServices />
          </section>

          {/* Reviews */}
          <section data-scroll-section className="bg-gray-50 py-10 px-4">
            <CustomerReviews />
          </section>

          {/* Brands */}
          <section data-scroll-section className="bg-white py-10 px-4">
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

          {/* Extra Sections */}
          <section data-scroll-section className="bg-gray-50 py-10 px-4">
            <ExtraSections />
          </section>
        </>
      )}

      {/* Floating Search Button */}
      {!openSearch && (
        <button
          onClick={() => setOpenSearch(true)}
          className="fixed bottom-24 sm:bottom-6 right-6 z-50 bg-[#1A2A49] text-white p-4 rounded-full shadow-lg hover:bg-[#223a61]">
          <Search size={22} />
        </button>
      )}

      {/* Floating Search Overlay */}
      {openSearch && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg bg-white rounded-t-2xl shadow-lg p-4"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-[#1A2A49]">Search</h2>
              <button
                onClick={() => setOpenSearch(false)}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={handleChange}
                className="w-full border px-5 py-3 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#1A2A49]"/>
              {!query && (
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <ReactTyped
                    strings={[
                      "Search AC Service...",
                      "Search Fan Repair...",
                      "Search Wiring Issues...",
                      "Search Electrical Repairs...",
                    ]}
                    typeSpeed={80}
                    backSpeed={40}
                    loop
                  />
                </span>
              )}
            </div>

            {suggestions.length > 0 && (
              <ul className="mt-2 bg-white shadow-lg rounded-lg border text-left max-h-48 overflow-y-auto">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setQuery(s)
                      setSuggestions([])
                    }}>
                    {s}
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => {
                setFilterOpen(true)
                setOpenSearch(false)
              }}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#1A2A49] text-white rounded-md hover:bg-[#223a61]">
              <SlidersHorizontal size={18} /> Filter
            </button>

            <div className="flex flex-wrap gap-2 mt-4">
              {popularSearches.map((item, i) => (
                <motion.span
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuery(item)}
                  className="px-3 py-1 bg-gray-100 text-sm rounded-full cursor-pointer hover:bg-[#1A2A49] hover:text-white">
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={(filters) => {
          setAppliedFilters(filters)
          setFilterOpen(false)
        }}
      />
    </div>
  )
}
