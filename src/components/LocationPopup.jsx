// src/components/LocationPopup.jsx
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Navigation, Search, X, Home, Briefcase, Star, Clock, ChevronRight } from "lucide-react"
import toast from "react-hot-toast"

export default function LocationPopup({ open, onClose, onSelect }) {
  const [query, setQuery] = useState("")
  const [detecting, setDetecting] = useState(false)
  const [recentLocations, setRecentLocations] = useState([])
  const [savedAddresses, setSavedAddresses] = useState([])

  // Load saved addresses from localStorage
  useEffect(() => {
    const addresses = JSON.parse(localStorage.getItem("pluggy_addresses") || "[]")
    setSavedAddresses(addresses.slice(0, 2))
    
    const recent = JSON.parse(localStorage.getItem("pluggy_recent_locations") || "[]")
    setRecentLocations(recent)
  }, [open])

  const cities = [
    "Andheri East, Mumbai",
    "Bandra West, Mumbai",
    "Powai, Mumbai",
    "Juhu, Mumbai",
    "Vile Parle, Mumbai",
    "Ghatkopar, Mumbai",
    "Borivali, Mumbai",
    "Thane, Mumbai",
    "Navi Mumbai",
    "Vashi, Navi Mumbai"
  ]

  const filteredCities = cities.filter(c => 
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
        // In real app, reverse geocode to get address
        setTimeout(() => {
          const detected = "Andheri East, Mumbai"
          chooseCity(detected)
          setDetecting(false)
          toast.success("Location detected!")
        }, 1500)
      },
      (error) => {
        toast.error("Couldn't detect location")
        setDetecting(false)
      }
    )
  }

  const chooseCity = (city) => {
    localStorage.setItem("pluggy_city", city)
    
    // Save to recent locations
    const recent = JSON.parse(localStorage.getItem("pluggy_recent_locations") || "[]")
    const updated = [city, ...recent.filter(c => c !== city)].slice(0, 5)
    localStorage.setItem("pluggy_recent_locations", JSON.stringify(updated))
    
    onSelect?.(city)
    onClose?.()
    toast.success(`📍 ${city}`)
  }

  const saveAddress = (type) => {
    const address = type === "home" ? "Home - Andheri East" : "Office - Bandra West"
    toast.success(`${address} selected`)
  }

  if (!open) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        >
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={onClose} 
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col"
          >
            {/* Drag Handle */}
            <div className="sm:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3" />

            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-[#F37021]" />
                <h2 className="text-lg font-bold text-[#1A2A49] font-poppins">Select Location</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              
              {/* Use Current Location */}
              <button
                onClick={detectLocation}
                disabled={detecting}
                className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-[#F37021]/5 to-[#FF8C42]/5 rounded-2xl border border-[#F37021]/20 hover:border-[#F37021]/40 transition group"
              >
                <div className="w-12 h-12 bg-[#F37021] rounded-full flex items-center justify-center group-hover:scale-105 transition">
                  <Navigation size={22} className="text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-[#1A2A49]">
                    {detecting ? "Detecting location..." : "Use current location"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {detecting ? "Please wait..." : "GPS will detect your address"}
                  </p>
                </div>
                {detecting && (
                  <div className="w-5 h-5 border-2 border-[#F37021] border-t-transparent rounded-full animate-spin" />
                )}
              </button>

              {/* Saved Addresses */}
              {savedAddresses.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
                    <Star size={14} className="text-yellow-500" /> Saved Addresses
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => saveAddress("home")}
                      className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Home size={18} className="text-blue-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-[#1A2A49]">Home</p>
                        <p className="text-xs text-gray-500">Andheri East, Mumbai</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                    
                    <button
                      onClick={() => saveAddress("office")}
                      className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Briefcase size={18} className="text-purple-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-[#1A2A49]">Office</p>
                        <p className="text-xs text-gray-500">Bandra West, Mumbai</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* Search Input */}
              <div>
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for area, street name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F37021] text-base"
                    autoFocus={false}
                  />
                </div>
              </div>

              {/* Recent Locations */}
              {recentLocations.length > 0 && !query && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
                    <Clock size={14} /> Recent Locations
                  </p>
                  <div className="space-y-1">
                    {recentLocations.map((loc, i) => (
                      <button
                        key={i}
                        onClick={() => chooseCity(loc)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition"
                      >
                        <MapPin size={18} className="text-gray-400" />
                        <span className="text-gray-700">{loc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {query && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Search Results</p>
                  {filteredCities.length > 0 ? (
                    <div className="space-y-1">
                      {filteredCities.map((city, i) => (
                        <button
                          key={i}
                          onClick={() => chooseCity(city)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition"
                        >
                          <MapPin size={18} className="text-gray-400" />
                          <span className="text-gray-700">{city}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No locations found</p>
                  )}
                </div>
              )}

              {/* Popular Cities (when no search) */}
              {!query && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Popular Locations</p>
                  <div className="space-y-1">
                    {cities.slice(0, 6).map((city, i) => (
                      <button
                        key={i}
                        onClick={() => chooseCity(city)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition"
                      >
                        <MapPin size={18} className="text-gray-400" />
                        <span className="text-gray-700">{city}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                📍 Your location helps us show available services
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}