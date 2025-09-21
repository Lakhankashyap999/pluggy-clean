import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { useState } from "react"

function LocationMarker({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng) // jaha click karega wahi set hoga
    },
  })
  return null
}

export default function LocationPopup({ onClose, onSave }) {
  const [position, setPosition] = useState({ lat: 28.6139, lng: 77.2090 }) // Default Delhi
  const [address, setAddress] = useState("")

  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      )
      const data = await res.json()
      if (data && data.display_name) {
        setAddress(data.display_name)
      }
    } catch (err) {
      console.error("Error fetching address:", err)
    }
  }

  const handleSave = () => {
    const locationData = {
      lat: position.lat,
      lng: position.lng,
      address,
    }
    localStorage.setItem("pluggy_city", JSON.stringify(locationData))
    onSave(locationData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-6">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg sm:max-w-2xl p-4 sm:p-6">
        {/* Header */}
        <h2 className="text-lg sm:text-xl font-bold mb-3 text-[#1A2A49]">
          Select Your Location
        </h2>

        {/* Map */}
        <div className="rounded-lg overflow-hidden border">
          <MapContainer
            center={[position.lat, position.lng]}
            zoom={13}
            style={{ height: "280px", width: "100%" }}
            className="rounded-lg"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[position.lat, position.lng]} />
            <LocationMarker
              setPosition={(pos) => {
                setPosition(pos)
                fetchAddress(pos.lat, pos.lng) // click pe address update hoga
              }}
            />
          </MapContainer>
        </div>

        {/* Address */}
        <div className="mt-4">
          <p className="text-sm sm:text-base text-gray-600 break-words">
            📍 {address || "Click on the map to select location"}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col sm:flex-row justify-end gap-3">
          <button
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm sm:text-base"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#1A2A49] text-white text-sm sm:text-base"
            onClick={handleSave}
          >
            Save Location
          </button>
        </div>
      </div>
    </div>
  )
}
