import { useState } from "react"
import { MapPin, Crosshair, X } from "lucide-react"

const BRAND = "#1A2A49"
const CTA = "#F37021"

export default function LocationPopup({ onSelect, onClose }) {
  const [query, setQuery] = useState("")
  const [showManual, setShowManual] = useState(false)

  const cities = [
    "New Delhi", "Gurugram", "Noida", "Ghaziabad",
    "Mumbai", "Pune", "Bengaluru", "Hyderabad", "Jaipur", "Chandigarh"
  ]

  const chooseCity = (city) => {
    localStorage.setItem("pluggy_city", city)
    onSelect?.(city)
    onClose?.()
  }

  const useCurrentLocation = async () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocation not supported. Select manually.")
      return
    }
    navigator.geolocation.getCurrentPosition(
      () => chooseCity("Current Location"),
      () => alert("Permission denied. Select manually."),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  const filtered = cities.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header with close button */}
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-[#F37021]" />
            <h2 className="text-lg sm:text-xl font-bold" style={{ color: BRAND }}>
              Change City
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Use current location */}
          <button
            onClick={useCurrentLocation}
            className="flex items-center gap-3 w-full rounded-xl border px-4 py-3 hover:bg-gray-50 transition"
          >
            <div className="h-10 w-10 rounded-full flex items-center justify-center bg-[#F37021]/10 text-[#F37021]">
              <Crosshair size={20} />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-[#1A2A49]">Use my current location</div>
              <div className="text-xs text-gray-500">We’ll ask for GPS permission</div>
            </div>
          </button>

          {/* Manual selection */}
          <div className="space-y-3">
            {!showManual ? (
              <button
                onClick={() => setShowManual(true)}
                className="w-full rounded-xl bg-[#F37021] text-white py-3 font-medium hover:opacity-90 transition"
              >
                Select Manually
              </button>
            ) : (
              <>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search city..."
                  className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-[#1A2A49]"
                />
                <div className="mt-2 max-h-48 overflow-auto rounded-lg border text-sm">
                  {filtered.length === 0 && (
                    <div className="p-3 text-gray-500">No results</div>
                  )}
                  {filtered.map((c) => (
                    <div
                      key={c}
                      onClick={() => chooseCity(c)}
                      className="px-4 py-2 cursor-pointer hover:bg-[#F37021]/10"
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
