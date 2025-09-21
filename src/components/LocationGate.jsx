import { useState } from "react"

const BRAND = "#1A2A49"
const CTA = "#F37021"

export default function LocationGate({ onSelect }) {
  const [showManual, setShowManual] = useState(false)
  const [query, setQuery] = useState("")
  const cities = [
    "New Delhi", "Gurugram", "Noida", "Ghaziabad",
    "Mumbai", "Pune", "Bengaluru", "Hyderabad", "Jaipur", "Chandigarh"
  ]

  const chooseCity = (city) => {
    localStorage.setItem("pluggy_city", city)
    onSelect?.(city)
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

  const filtered = cities.filter(c =>
    c.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-6">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 border-b">
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: BRAND }}>
            Select your city
          </h2>
        </div>

        {/* Two options row (stack on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
          {/* Left: Use current */}
          <div className="rounded-xl border p-4 sm:p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border flex items-center justify-center text-sm sm:text-base"
                style={{ borderColor: BRAND, color: BRAND }}
              >
                ➤
              </div>
              <h3 className="text-base sm:text-lg font-semibold" style={{ color: BRAND }}>
                Use my current location
              </h3>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">
              We’ll need permission to use your device’s location
            </p>
            <button
              onClick={useCurrentLocation}
              className="mt-auto rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm sm:text-base font-medium"
              style={{ background: CTA }}
            >
              USE CURRENT LOCATION
            </button>
          </div>

          {/* Right: Select manually */}
          <div className="rounded-xl border p-4 sm:p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border flex items-center justify-center text-sm sm:text-base"
                style={{ borderColor: BRAND, color: BRAND }}
              >
                📍
              </div>
              <h3 className="text-base sm:text-lg font-semibold" style={{ color: BRAND }}>
                Select Manually
              </h3>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">
              Search by your City
            </p>

            {!showManual ? (
              <button
                onClick={() => setShowManual(true)}
                className="mt-auto rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm sm:text-base font-medium"
                style={{ background: CTA }}
              >
                SELECT MANUALLY
              </button>
            ) : (
              <>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search city..."
                  className="border rounded-lg px-3 py-2 text-sm sm:text-base"
                />
                <div className="mt-3 max-h-40 overflow-auto rounded-lg border text-sm sm:text-base">
                  {filtered.length === 0 && (
                    <div className="p-3 text-gray-500">No results</div>
                  )}
                  {filtered.map((c) => (
                    <div
                      key={c}
                      onClick={() => chooseCity(c)}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
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
