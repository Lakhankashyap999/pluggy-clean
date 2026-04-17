// src/components/LocationGate.jsx
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Navigation, Search, Sparkles, TrendingUp, ChevronRight } from "lucide-react"
import toast from "react-hot-toast"

export default function LocationGate({ onSelect }) {
  const [query, setQuery] = useState("")
  const [detecting, setDetecting] = useState(false)
  const [selectedCity, setSelectedCity] = useState(null)

  const popularCities = [
    "Andheri East, Mumbai",
    "Bandra West, Mumbai", 
    "Powai, Mumbai",
    "Juhu, Mumbai",
    "Borivali, Mumbai",
    "Thane, Mumbai",
    "Navi Mumbai",
    "Ghatkopar, Mumbai"
  ]

  const trendingAreas = [
    { name: "Andheri East", count: "2.5k+ services" },
    { name: "Bandra West", count: "1.8k+ services" },
    { name: "Powai", count: "1.2k+ services" }
  ]

  const filteredCities = popularCities.filter(c => 
    c.toLowerCase().includes(query.toLowerCase())
  )

  const detectLocation = () => {
    setDetecting(true)
    
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported")
      setDetecting(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setTimeout(() => {
          const detected = "Andheri East, Mumbai"
          setSelectedCity(detected)
          setDetecting(false)
          toast.success("📍 Location detected!")
        }, 1500)
      },
      (error) => {
        toast.error("Couldn't detect location")
        setDetecting(false)
      }
    )
  }

  const confirmLocation = () => {
    if (selectedCity) {
      localStorage.setItem("pluggy_city", selectedCity)
      onSelect?.(selectedCity)
      toast.success(`Welcome! Serving ${selectedCity}`)
    } else {
      toast.error("Please select a location")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#F4F6F9] via-white to-[#EDF0F3] p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-md"
      >
        
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-[#1A2A49] to-[#F37021] rounded-2xl flex items-center justify-center shadow-xl">
              <MapPin size={28} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold font-poppins">
            <span className="text-[#1A2A49]">Plug</span>
            <span className="text-[#F37021]">gy</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 flex items-center justify-center gap-1">
            <Sparkles size={14} className="text-[#F37021]" />
            Where do you need service?
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          
          {/* Current Location Button */}
          <button
            onClick={detectLocation}
            disabled={detecting}
            className="w-full flex items-center gap-4 p-5 border-b border-gray-100 hover:bg-gray-50 transition group"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              detecting 
                ? "bg-[#F37021] animate-pulse" 
                : "bg-[#1A2A49] group-hover:scale-105"
            }`}>
              <Navigation size={22} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-[#1A2A49] text-base">
                {detecting ? "Detecting your location..." : "Use current location"}
              </p>
              <p className="text-sm text-gray-500">
                {detecting ? "Please wait a moment" : "We'll find the best experts near you"}
              </p>
            </div>
            {detecting ? (
              <div className="w-5 h-5 border-2 border-[#F37021] border-t-transparent rounded-full animate-spin" />
            ) : (
              <ChevronRight size={18} className="text-gray-400 group-hover:text-[#1A2A49]" />
            )}
          </button>

          {/* Search Input */}
          <div className="p-5 border-b border-gray-100">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for your area..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A2A49] text-base transition"
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="p-5 max-h-[300px] overflow-y-auto">
            
            {query ? (
              // Search Results
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 mb-2">Search Results</p>
                {filteredCities.length > 0 ? (
                  filteredCities.map((city, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedCity(city)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
                        selectedCity === city
                          ? "bg-[#1A2A49] text-white"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <MapPin size={18} className={selectedCity === city ? "text-white" : "text-[#F37021]"} />
                      <span>{city}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">No areas found</p>
                )}
              </div>
            ) : (
              <>
                {/* Selected Location Display */}
                {selectedCity && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-[#1A2A49]/5 to-[#F37021]/5 rounded-xl border border-[#1A2A49]/20">
                    <p className="text-xs text-gray-500 mb-1">Selected Location</p>
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-[#F37021]" />
                      <span className="font-semibold text-[#1A2A49]">{selectedCity}</span>
                    </div>
                  </div>
                )}

                {/* Trending Areas */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
                    <TrendingUp size={14} className="text-[#F37021]" />
                    Trending Areas
                  </p>
                  <div className="space-y-2">
                    {trendingAreas.map((area, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedCity(`${area.name}, Mumbai`)}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition group"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin size={18} className="text-gray-400 group-hover:text-[#F37021]" />
                          <span className="text-gray-700">{area.name}</span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {area.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Areas */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Popular Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {popularCities.slice(0, 6).map((city, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedCity(city)}
                        className={`px-4 py-2 rounded-full text-sm transition ${
                          selectedCity === city
                            ? "bg-[#1A2A49] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {city.split(",")[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Confirm Button */}
          <div className="p-5 border-t border-gray-100 bg-gray-50">
            <button
              onClick={confirmLocation}
              disabled={!selectedCity}
              className={`w-full py-4 rounded-xl font-semibold text-base transition-all ${
                selectedCity
                  ? "bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white shadow-lg hover:shadow-xl active:scale-[0.98]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {selectedCity ? "Confirm Location" : "Select a location"}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              📍 You can change this anytime from settings
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}