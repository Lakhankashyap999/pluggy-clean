// src/pages/Dashboard.jsx
import { useState, useRef, useEffect } from "react"
import Slider from "../components/Slider"
import LocomotiveScroll from "locomotive-scroll"
import "locomotive-scroll/dist/locomotive-scroll.css"
import { Search, SlidersHorizontal } from "lucide-react"
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
    if (filterOpen) {
      document.body.style.overflow = "hidden"
      scrollInstance.current?.stop()
    } else {
      document.body.style.overflow = "auto"
      scrollInstance.current?.start()
    }
  }, [filterOpen])

  // ✅ Dummy services
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

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/request/${query.replace(/\s+/g, "-").toLowerCase()}`)
      setQuery("")
      setSuggestions([])
    }
  }

  return (
    <div ref={scrollRef} data-scroll-container className="min-h-screen pb-20">
      {/* ✅ Search Bar */}
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-40 w-full px-4 sm:px-6 py-3"
      >
        <div
          className={`
            flex items-center gap-2 rounded-full shadow-lg
            ${window.innerWidth >= 768
              ? "backdrop-blur-md bg-white/30 border border-white/40 max-w-2xl mx-auto px-4"
              : "bg-white shadow px-3"}
          `}
        >
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search services..."
            className="flex-1 bg-transparent border-none focus:outline-none px-2 py-2 text-sm sm:text-base"
          />
          <button
            onClick={handleSearch}
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
        </div>
      </motion.div>

      {/* ✅ Suggestions dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-14 mx-4 sm:mx-6 bg-white shadow-lg rounded-lg border max-h-48 overflow-y-auto z-50">
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                navigate(`/request/${s.replace(/\s+/g, "-").toLowerCase()}`)
                setQuery("")
                setSuggestions([])
              }}
            >
              {s}
            </div>
          ))}
        </div>
      )}

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
