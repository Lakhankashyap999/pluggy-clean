// src/components/VideoConsultModal.jsx
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X, Zap, Video, Mic, CalendarCheck, ShieldCheck,
  PhoneCall, CheckCircle2, Camera, MapPin, Sparkles, Clock
} from "lucide-react"
import { useApp } from "../AppContext"
import FaultMediaUpload from "./FaultMediaUpload"
import { useNavigate } from "react-router-dom"
import { EVENT_STANDBY_PACKAGES } from "../data/servicesCatalog"
import toast from "react-hot-toast"

export default function VideoConsultModal({ open, onClose, initialTab = "sos" }) {
  const { user, address, setAddress, addRequest, requireCustomerLogin } = useApp()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState(initialTab) // "sos" | "video" | "voice" | "event"
  const [localAddress, setLocalAddress] = useState(address || "")
  const [issueText, setIssueText] = useState("")
  const [selectedAppliance, setSelectedAppliance] = useState("Main Line / MCB Short Circuit")
  const [isRecording, setIsRecording] = useState(false)
  const [recordedSeconds, setRecordedSeconds] = useState(0)
  const [selectedEventPkg, setSelectedEventPkg] = useState(EVENT_STANDBY_PACKAGES[0])
  const [eventDate, setEventDate] = useState("")

  if (!open) return null

  const ensureAuthAndAddress = () => {
    if (!user) {
      onClose()
      requireCustomerLogin("Booking ke liye pehle login karein")
      return false
    }
    const finalAddr = (localAddress || "").trim() || (address || "").trim()
    if (!finalAddr) {
      toast.error("Please enter your house/flat address")
      return false
    }
    if (localAddress.trim() && localAddress !== address) {
      setAddress(localAddress.trim())
    }
    return finalAddr
  }

  // 1. Handle 15-Min SOS Dispatch
  const handleSOSSubmit = (e) => {
    e.preventDefault()
    const finalAddr = ensureAuthAndAddress()
    if (!finalAddr) return

    addRequest({
      service: `🚨 15-Min SOS: ${selectedAppliance}`,
      issue: issueText || `Emergency SOS Dispatch for ${selectedAppliance}`,
      address: finalAddr,
      amount: 299,
      baseAmount: 299,
      priority: "High",
      bookingMode: "SOS_15MIN",
      autoAssignSOS: true,
      requiredKit: ["Emergency Megger & Multimeter", "32A MCB & Fuse Kit", "2.5sqmm FRLS Bypass Cable"],
    })

    toast.success("🚨 15-Min SOS Responder Assigned! Check Track Requests for Start OTP.")
    onClose()
    navigate("/account/track")
  }

  // 2. Handle ₹29 60-Sec Video Call Diagnosis
  const handleVideoBook = (e) => {
    e.preventDefault()
    const finalAddr = ensureAuthAndAddress()
    if (!finalAddr) return

    addRequest({
      service: `📹 60-Sec Video Diagnosis (${selectedAppliance})`,
      issue: issueText || `Live Video Fault Inspection for ${selectedAppliance} (₹29 adjustable in final repair bill)`,
      address: finalAddr,
      amount: 29,
      baseAmount: 29,
      priority: "High",
      bookingMode: "VIDEO_DIAGNOSIS",
      autoAssignSOS: true,
    })

    toast.success("📹 Senior Engineer connected for Video Diagnosis! ₹29 will be adjusted if visit is needed.")
    onClose()
    navigate("/account/track")
  }

  // 3. Handle Voice Note / Photo Booking (For Elders / Zero Typing)
  const toggleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true)
      setRecordedSeconds(8)
      toast("🎙️ Recording voice note... Speak your issue in Hindi or English", { icon: "🎤" })
      setTimeout(() => {
        setIsRecording(false)
        setIssueText((prev) =>
          prev || "Voice Note (0:08s attached): Geyser aur rasoi ke switchboard mein light nahi aa rahi hai."
        )
        toast.success("Voice note attached!")
      }, 2200)
    } else {
      setIsRecording(false)
    }
  }

  const handleVoicePhotoSubmit = (e) => {
    e.preventDefault()
    const finalAddr = ensureAuthAndAddress()
    if (!finalAddr) return

    addRequest({
      service: `🎙️ Easy Voice/Photo Booking (${selectedAppliance})`,
      issue: issueText || "Voice note & photo uploaded — Executive will verify exact fault",
      address: finalAddr,
      amount: 199,
      baseAmount: 199,
      priority: "Medium",
      bookingMode: "VOICE_PHOTO",
    })

    toast.success("🎙️ Voice/Photo request received! Our Executive will call within 2 mins.")
    onClose()
    navigate("/account/track")
  }

  // 4. Handle Shaadi / Function Standby Electrician
  const handleEventStandbySubmit = (e) => {
    e.preventDefault()
    const finalAddr = ensureAuthAndAddress()
    if (!finalAddr) return

    addRequest({
      service: `🎪 ${selectedEventPkg.name}`,
      issue: `${selectedEventPkg.duration} (${eventDate || "Today/Upcoming Function"}) — ${
        issueText || "Full load balancing, AC & generator/inverter standby"
      }`,
      address: finalAddr,
      amount: selectedEventPkg.price,
      baseAmount: selectedEventPkg.price,
      priority: "High",
      bookingMode: "EVENT_STANDBY",
      requiredKit: [
        "3-Phase Clamp Meter",
        "Heavy Changeover & Spare MCBs",
        "10m Heavy Extension Bypass",
        "Standby Voltage Stabilizer",
      ],
    })

    toast.success(`🎪 ${selectedEventPkg.name} Booked! Dedicated Senior Expert reserved.`)
    onClose()
    navigate("/account/track")
  }

  const tabs = [
    { id: "sos", label: "🚨 15-Min SOS", badge: "URGENT" },
    { id: "event", label: "🎪 Function Standby", badge: "SHAADI/PARTY" },
    { id: "video", label: "📹 ₹29 Video Call", badge: "SAVE ₹400" },
    { id: "voice", label: "🎙️ Bolo & Book Karo", badge: "ELDERS MODE" },
  ]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 24, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Header */}
            <div className="bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#F37021] bg-white/10 px-2.5 py-1 rounded-full">
                  ⚡ Pluggy Exclusive Smart Services
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-poppins mt-1.5">
                  Emergency SOS, Function Standby & Smart Diagnosis
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="bg-[#F4F6F9] p-2 border-b border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 ${
                    activeTab === t.id
                      ? "bg-[#1A2A49] text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <span>{t.label}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded ${
                      activeTab === t.id ? "text-[#F37021]" : "text-gray-400"
                    }`}
                  >
                    {t.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6 max-h-[62vh] sm:max-h-[68vh] overflow-y-auto">
              {(activeTab === "sos" || activeTab === "voice") && (
                <div className="mb-4">
                  <FaultMediaUpload />
                </div>
              )}
              {/* TAB 1: 15-MIN SOS */}
              {activeTab === "sos" && (
                <form onSubmit={handleSOSSubmit} className="space-y-4">
                  <div className="bg-orange-50 border border-[#F37021]/30 rounded-2xl p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F37021] text-white flex items-center justify-center flex-shrink-0">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1A2A49] text-sm sm:text-base">
                        15–20 Min Rapid Bike-Responder (Priority = HIGH)
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Short circuit, main line blackout, burning smell, or water motor burst? Nearest online engineer is assigned immediately without waiting for slots.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A2A49] uppercase mb-1.5">
                      What is the Emergency?
                    </label>
                    <select
                      value={selectedAppliance}
                      onChange={(e) => setSelectedAppliance(e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-[#1A2A49] focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                    >
                      <option>Main Line / MCB Short Circuit (Power Blackout)</option>
                      <option>Switchboard Sparking / Burning Smell</option>
                      <option>AC Stopped Cooling in Peak Heat / Night</option>
                      <option>Inverter / Battery Backup Failure</option>
                      <option>Geyser Electric Shock / Water Pipe Burst</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A2A49] uppercase mb-1.5">
                      Complete Doorstep Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="House No, Street, Landmark, Area..."
                      value={localAddress}
                      onChange={(e) => setLocalAddress(e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#F37021] to-[#FF8C42] text-white rounded-xl font-bold text-sm sm:text-base shadow-lg hover:opacity-95 transition flex items-center justify-center gap-2"
                  >
                    <Zap size={18} /> Dispatch SOS Responder Now (₹299)
                  </button>
                </form>
              )}

              {/* TAB 2: SHAADI / FUNCTION STANDBY */}
              {activeTab === "event" && (
                <form onSubmit={handleEventStandbySubmit} className="space-y-4">
                  <div className="bg-[#1A2A49]/5 border border-[#1A2A49]/15 rounded-2xl p-4">
                    <h4 className="font-bold text-[#1A2A49] text-sm sm:text-base flex items-center gap-2">
                      🎪 Shaadi / Function Standby Electrician (Zero Blackout Shield)
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Ghar mein shaadi, birthday, pooja ya party hai? End-time par heavy AC/lighting load se MCB trip na ho — humara Senior Electrician pure function ke dauran aapke ghar par standby rahega!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {EVENT_STANDBY_PACKAGES.map((pkg) => {
                      const active = selectedEventPkg.id === pkg.id
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedEventPkg(pkg)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                            active
                              ? "border-[#F37021] bg-orange-50/40 shadow-sm"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <span className="text-[10px] font-bold bg-[#1A2A49] text-white px-2 py-0.5 rounded-full">
                            {pkg.badge}
                          </span>
                          <h5 className="font-bold text-[#1A2A49] text-sm mt-2">{pkg.name}</h5>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-xl font-extrabold text-[#F37021]">₹{pkg.price}</span>
                            <span className="text-xs text-gray-400 line-through">₹{pkg.originalPrice}</span>
                          </div>
                          <ul className="mt-2 space-y-1 text-[11px] text-gray-600">
                            {pkg.features.map((f, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <CheckCircle2 size={12} className="text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    })}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Function Date & Time (e.g. Today 6 PM)"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Venue / House Address..."
                      value={localAddress}
                      onChange={(e) => setLocalAddress(e.target.value)}
                      className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#F37021]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl font-bold text-sm sm:text-base shadow-lg transition"
                  >
                    Reserve Standby Electrician (₹{selectedEventPkg.price})
                  </button>
                </form>
              )}

              {/* TAB 3: ₹29 VIDEO CALL DIAGNOSIS */}
              {activeTab === "video" && (
                <form onSubmit={handleVideoBook} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1A2A49] text-white flex items-center justify-center flex-shrink-0">
                      <Video size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1A2A49] text-sm sm:text-base">
                        ₹29 60-Second Video Call Diagnosis (100% Adjustable)
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Show your faulty AC, Fridge, Geyser, or Switchboard on video call. If it's a minor setting, fix it on call & save ₹400! If engineer visit is needed, engineer brings the exact spare part on first visit & ₹29 is deducted from your bill.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A2A49] uppercase mb-1.5">
                      Select Appliance
                    </label>
                    <select
                      value={selectedAppliance}
                      onChange={(e) => setSelectedAppliance(e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-[#1A2A49]"
                    >
                      <option>Split / Window AC</option>
                      <option>Refrigerator (Fridge)</option>
                      <option>Washing Machine</option>
                      <option>Geyser / Water Heater</option>
                      <option>Switchboard / MCB / Inverter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A2A49] uppercase mb-1.5">
                      Your Address (In case doorstep visit is needed)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="House No, Area, City..."
                      value={localAddress}
                      onChange={(e) => setLocalAddress(e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#F37021] hover:bg-[#e05e15] text-white rounded-xl font-bold text-sm sm:text-base shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <Video size={18} /> Start Video Diagnosis Call @ ₹29
                  </button>
                </form>
              )}

              {/* TAB 4: BOLO & BOOK KARO (ELDERS VOICE / PHOTO MODE) */}
              {activeTab === "voice" && (
                <form onSubmit={handleVoicePhotoSubmit} className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                    <h4 className="font-bold text-[#1A2A49] text-sm sm:text-base">
                      🎙️ "Bolo Ya Photo Kheencho" (Zero-Typing Booking for Parents & Elders)
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Technical naam nahi pata? Bas mic daba kar apni aawaaz mein dikkat bol dein, humara Executive khud sahi engineer aur spare part bhej dega!
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={toggleVoiceRecord}
                      className={`flex-1 py-4 px-4 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition ${
                        isRecording
                          ? "border-red-500 bg-red-50 text-red-600 animate-pulse"
                          : "border-[#1A2A49] bg-[#1A2A49]/5 text-[#1A2A49] hover:bg-[#1A2A49]/10"
                      }`}
                    >
                      <Mic size={20} />
                      {isRecording ? "Recording Voice Note..." : "Tap to Record 10-Sec Voice Note"}
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Voice transcript or optional note..."
                    value={issueText}
                    onChange={(e) => setIssueText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm"
                  />

                  <input
                    type="text"
                    required
                    placeholder="Enter House Address..."
                    value={localAddress}
                    onChange={(e) => setLocalAddress(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-sm"
                  />

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#1A2A49] hover:bg-[#223a61] text-white rounded-xl font-bold text-sm sm:text-base shadow-lg transition"
                  >
                    Submit Voice / Photo Request
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
