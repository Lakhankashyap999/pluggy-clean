// src/pages/BookService.jsx
import { useState, useEffect } from "react"
import { CheckCircle, Wrench, Plug, Droplet, Home } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useApp } from "../AppContext"
import toast from "react-hot-toast"

export default function BookService() {
  const { addBooking, addRequest, user } = useApp()
  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    date: "",
    time: "",
    details: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const services = [
    { id: 1, name: "Electrical Repair", desc: "Switches, Wiring & Lighting", icon: <Plug className="text-[#1A2A49] w-8 h-8" /> },
    { id: 2, name: "Plumbing", desc: "Leakage, Fitting & Installation", icon: <Droplet className="text-[#1A2A49] w-8 h-8" /> },
    { id: 3, name: "Home Cleaning", desc: "Full home & kitchen cleaning", icon: <Home className="text-[#1A2A49] w-8 h-8" /> },
    { id: 4, name: "Appliance Repair", desc: "AC, Fridge, TV & More", icon: <Wrench className="text-[#1A2A49] w-8 h-8" /> },
  ]

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
      }))
    }
  }, [user])

  // ✅ Require login helper
  const requireLogin = (callback) => {
    if (!user) {
      toast.error("Please log in first!")
    } else {
      callback()
    }
  }

  const handleNext = () => {
    requireLogin(() => {
      if (step === 1 && selectedService) setStep(2)
    })
  }

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!user) return toast.error("Please log in first!")

    const bookingObj = {
      id: Date.now(),
      userId: user.id || user.email,
      userName: formData.name,
      userPhone: formData.phone,
      userAddress: formData.address,
      service: selectedService.name,
      date: formData.date,
      time: formData.time,
      details: formData.details,
      status: "Pending",
    }

    addBooking(bookingObj)
    addRequest({
      ...bookingObj,
      selectedIssues: [],
      amount: 0,
      priority: "Low",
    })

    setIsSubmitted(true)
    setStep(3)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col items-center py-10 px-4">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-light text-[#1A2A49] mb-2">Book Reliable Home Services</h1>
        <p className="text-gray-600 text-sm md:text-base">Quick • Verified • Hassle-free</p>
      </motion.div>

      {/* Stepper */}
      <div className="flex justify-center items-center space-x-4 mb-8">
        {[1,2].map(num => (
          <div key={num} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= num ? "bg-[#1A2A49] text-white" : "bg-gray-300 text-gray-600"}`}>
            {num}
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 md:p-8">
        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">Choose a Service</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                {services.map(s => (
                  <div key={s.id} onClick={() => requireLogin(() => setSelectedService(s))} className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center transition-all ${selectedService?.id === s.id ? "border-[#1A2A49] bg-blue-50" : "border-gray-200 hover:border-[#1A2A49]"}`}>
                    {s.icon}
                    <h3 className="font-medium mt-2 text-sm text-gray-800">{s.name}</h3>
                    <p className="text-xs text-gray-500">{s.desc}</p>
                  </div>
                ))}
              </div>
              <button onClick={handleNext} disabled={!selectedService} className={`mt-6 w-full py-3 rounded-xl text-white font-semibold ${selectedService ? "bg-[#1A2A49] hover:bg-[#223a61]" : "bg-gray-400 cursor-not-allowed"}`}>Continue</button>
            </motion.div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">Enter Booking Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="name" placeholder="Full Name" value={formData.name} onChange={handleFormChange} required className="w-full p-3 border rounded-lg focus:outline-[#1A2A49]" />
                <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleFormChange} required className="w-full p-3 border rounded-lg focus:outline-[#1A2A49]" />
                <input name="address" placeholder="Full Address" value={formData.address} onChange={handleFormChange} required className="w-full p-3 border rounded-lg focus:outline-[#1A2A49]" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" name="date" value={formData.date} onChange={handleFormChange} required className="p-3 border rounded-lg focus:outline-[#1A2A49]" />
                  <input type="time" name="time" value={formData.time} onChange={handleFormChange} required className="p-3 border rounded-lg focus:outline-[#1A2A49]" />
                </div>
                <textarea name="details" placeholder="Describe your issue (optional)" value={formData.details} onChange={handleFormChange} className="w-full p-3 border rounded-lg focus:outline-[#1A2A49]" />
                <button type="submit" className="w-full bg-[#1A2A49] hover:bg-[#223a61] text-white font-semibold py-3 rounded-xl">Confirm Booking</button>
              </form>
            </motion.div>
          )}

          {/* STEP 3 */}
          {step === 3 && isSubmitted && (
            <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="w-14 h-14 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h2>
                <p className="text-gray-600 mt-2 text-center">
                  Your {selectedService?.name} service is scheduled on <b>{formData.date}</b> at <b>{formData.time}</b>.
                </p>
                <p className="mt-4 text-[#1A2A49] font-semibold">Our technician will contact you soon!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
