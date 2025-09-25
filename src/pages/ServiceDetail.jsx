import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, Star, Wrench } from "lucide-react"
import { useState } from "react"
import Cart from "../components/Cart"
import { useApp } from "../AppContext"

const serviceData = {
  "ac-repair": {
    title: "AC Repair & Service",
    desc: "Expert AC repair with transparent pricing & 30 days service guarantee.",
    rating: "4.8",
    basePrice: "₹499 onwards",
    issues: [
      { issue: "Cooling Issue", price: 499 },
      { issue: "Water Leakage", price: 399 },
      { issue: "Gas Refill (Standard)", price: 1999 },
      { issue: "Installation (Split AC)", price: 1499 },
      { issue: "Uninstallation (Split AC)", price: 799 },
      { issue: "Remote Not Working", price: 299 },
      { issue: "Unusual Noise", price: 699 },
      { issue: "PCB Repair/Replacement", price: 2499 },
      { issue: "AC not turning on", price: 599 },
    ],
  },
  "fan-motor": {
    title: "Fan & Motor Services",
    desc: "Installation, repair, and maintenance of all fan & motor types.",
    rating: "4.6",
    basePrice: "₹199 onwards",
    issues: [
      { issue: "Slow Speed", price: 199 },
      { issue: "Noise Issue", price: 149 },
      { issue: "Regulator Problem", price: 129 },
      { issue: "Exhaust Fan Repair", price: 249 },
      { issue: "Motor Overheating", price: 349 },
      { issue: "Motor Winding", price: 499 },
    ],
  },
  wiring: {
    title: "Wiring & Switchboards",
    desc: "Professional wiring services with safety guarantee.",
    rating: "4.7",
    basePrice: "₹149 onwards",
    issues: [
      { issue: "Switch Burnt", price: 149 },
      { issue: "Plug Point Not Working", price: 199 },
      { issue: "MCB Tripping", price: 299 },
      { issue: "Short Circuit", price: 349 },
      { issue: "Socket Loose", price: 129 },
      { issue: "Sparking Issue", price: 199 },
    ],
  },
  electrical: {
    title: "Electrical Appliances",
    desc: "Repair services for geysers, fridges, washing machines & more.",
    rating: "4.5",
    basePrice: "₹249 onwards",
    issues: [
      { issue: "Geyser Not Heating", price: 399 },
      { issue: "Geyser Leakage", price: 349 },
      { issue: "Refrigerator Cooling Issue", price: 599 },
      { issue: "Washing Machine Leakage", price: 499 },
      { issue: "Microwave Not Heating", price: 299 },
      { issue: "Mixer / Grinder Problem", price: 199 },
    ],
  },
}

export default function ServiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const service = serviceData[id]

  const [selectedIssues, setSelectedIssues] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [address, setAddress] = useState("") // ✅ new state
  const { addToCart } = useApp()

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Service not found 🚫</p>
      </div>
    )
  }

  const toggleIssue = (item) => {
    setSelectedIssues((prev) =>
      prev.find((i) => i.issue === item.issue)
        ? prev.filter((i) => i.issue !== item.issue)
        : [...prev, item]
    )
  }

  const removeIssue = (issueName) => {
    setSelectedIssues((prev) => prev.filter((i) => i.issue !== issueName))
  }

  const labourCharge = selectedIssues.length > 0 ? 50 : 0
  const subtotal = selectedIssues.reduce((sum, i) => sum + i.price, 0)
  const discount =
    selectedIssues.length >= 3 ? subtotal * 0.15 : selectedIssues.length === 2 ? subtotal * 0.1 : 0
  const finalTotal = subtotal + labourCharge - discount

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-gray-700 hover:text-[#1A2A49]"
          >
            <ChevronLeft size={20} />
            <span className="text-sm">Back</span>
          </button>
          <h2 className="font-bold text-[#1A2A49]">{service.title}</h2>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-[#1A2A49] hover:underline"
          >
            Home
          </button>
        </div>
      </div>

      {/* Service Info + Issues */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2A49]">{service.title}</h1>
          <p className="text-gray-600 mt-2">{service.desc}</p>
          <div className="flex items-center gap-4 mt-4">
            <span className="flex items-center gap-1 text-yellow-500 font-medium">
              <Star size={18} /> {service.rating}
            </span>
            <span className="text-lg font-bold text-[#1A2A49]">
              {selectedIssues.length > 0 ? `₹${finalTotal}` : service.basePrice}
            </span>
          </div>
        </div>

        {/* Issues list with checkbox */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-[#1A2A49] mb-3 flex items-center gap-2">
            <Wrench size={18} /> Common Issues & Charges
          </h3>
          <table className="w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-600 text-left">
                <th className="pb-2">Select</th>
                <th className="pb-2">Issue</th>
                <th className="pb-2">Charges</th>
              </tr>
            </thead>
            <tbody>
              {service.issues.map((item, i) => (
                <tr key={i} className="bg-gray-50 hover:bg-gray-100 transition">
                  <td className="py-2 px-3">
                    <input
                      type="checkbox"
                      className="accent-[#1A2A49]"
                      onChange={() => toggleIssue(item)}
                      checked={selectedIssues.some((i) => i.issue === item.issue)}
                    />
                  </td>
                  <td className="py-2 px-3">{item.issue}</td>
                  <td className="py-2 px-3 font-medium text-[#1A2A49]">₹{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Summary */}
      {selectedIssues.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-20">
          <div className="max-w-6xl mx-auto flex justify-between items-center gap-3">
            <span className="text-sm text-gray-700">
              {selectedIssues.length} selected | Total: ₹{finalTotal}
            </span>
            <button
              onClick={() => setCartOpen(true)}
              className="px-6 py-2 bg-[#1A2A49] text-white rounded-lg hover:bg-[#223a61]"
            >
              View Cart →
            </button>
          </div>
        </div>
      )}

      {/* Cart Popup */}
      <Cart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={selectedIssues}
        labourCharge={labourCharge}
        discount={discount}
        finalTotal={finalTotal}
        onRemove={removeIssue}
        // ✅ address input
        extraContent={
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter service location"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-[#1A2A49]"
              required
            />
          </div>
        }
        onProceed={() => {
          if (!address) {
            alert("Please enter service address")
            return
          }
          addToCart(selectedIssues)
          navigate(`/request/${id}`, { state: { selectedIssues, finalTotal, address } })
        }}
      />
    </div>
  )
}
