// src/components/account/BookingPreferences.jsx
import { useState } from "react"
import { motion } from "framer-motion"
import { Dog, Car, Clock, Wrench } from "lucide-react"

export default function BookingPreferences() {
  const [preferences, setPreferences] = useState({
    pet: false,
    parking: true,
    preferredTime: "morning",
    preferredService: "ac-repair",
  })

  const timeSlots = [
    { id: "morning", label: "Morning (9-11 AM)" },
    { id: "afternoon", label: "Afternoon (2-5 PM)" },
    { id: "evening", label: "Evening (5-8 PM)" },
  ]

  return (
    <div className="space-y-4">
      {/* Pet Alert */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div className="flex items-center gap-3">
          <Dog size={18} className="text-amber-600" />
          <span className="text-sm font-medium text-[#1A2A49] dark:text-white">Pet at home</span>
        </div>
        <button
          onClick={() => setPreferences(prev => ({ ...prev, pet: !prev.pet }))}
          className={`relative w-11 h-6 rounded-full transition ${
            preferences.pet ? "bg-[#F37021]" : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <motion.div
            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
            animate={{ x: preferences.pet ? 20 : 0 }}
          />
        </button>
      </div>

      {/* Parking */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div className="flex items-center gap-3">
          <Car size={18} className="text-blue-600" />
          <span className="text-sm font-medium text-[#1A2A49] dark:text-white">Parking available</span>
        </div>
        <button
          onClick={() => setPreferences(prev => ({ ...prev, parking: !prev.parking }))}
          className={`relative w-11 h-6 rounded-full transition ${
            preferences.parking ? "bg-[#F37021]" : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <motion.div
            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow"
            animate={{ x: preferences.parking ? 20 : 0 }}
          />
        </button>
      </div>

      {/* Preferred Time */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <Clock size={18} className="text-purple-600" />
          <span className="text-sm font-medium text-[#1A2A49] dark:text-white">Preferred Time</span>
        </div>
        <div className="flex gap-2">
          {timeSlots.map(slot => (
            <button
              key={slot.id}
              onClick={() => setPreferences(prev => ({ ...prev, preferredTime: slot.id }))}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition ${
                preferences.preferredTime === slot.id
                  ? "bg-[#1A2A49] dark:bg-[#F37021] text-white"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}