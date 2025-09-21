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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[90%] md:w-[600px] p-4">
        <h2 className="text-lg font-bold mb-2">Select Your Location</h2>

        <MapContainer
          center={[position.lat, position.lng]}
          zoom={13}
          style={{ height: "300px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* ✅ Marker ab hamesha state ke saath sync hoga */}
          <Marker position={[position.lat, position.lng]} />
          <LocationMarker
            setPosition={(pos) => {
              setPosition(pos)
              fetchAddress(pos.lat, pos.lng) // click pe address update hoga
            }}
          />
        </MapContainer>

        <div className="mt-4">
          <p className="text-sm text-gray-600">
            📍 {address || "Click on the map to select location"}
          </p>
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-[#1A2A49] text-white"
            onClick={handleSave}
          >
            Save Location
          </button>
        </div>
      </div>
    </div>
  )
}
