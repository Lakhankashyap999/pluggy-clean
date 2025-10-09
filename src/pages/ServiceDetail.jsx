import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, Star, Wrench, Info, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import Cart from "../components/Cart"
import { useApp } from "../AppContext"

// ✅ Full Service Data (AC, Fan, Wiring, Electrical)
const serviceData = {
  "ac-repair": {
    title: "AC Repair & Service",
    desc: "Expert AC repair with transparent pricing & 30 days service guarantee.",
    rating: "4.8",
    basePrice: "₹499 onwards",
    issues: [
      { issue: "Cooling Issue", priceOptions: [499, 599, 699] },
      { issue: "Water Leakage", priceOptions: [399, 499, 599] },
      { issue: "Gas Refill (Standard)", priceOptions: [1799, 1999, 2199] },
      { issue: "Installation (Split AC)", priceOptions: [1399, 1499, 1599] },
      { issue: "Uninstallation (Split AC)", priceOptions: [699, 799, 899] },
      { issue: "Remote Not Working", priceOptions: [299, 349, 399] },
      { issue: "Unusual Noise", priceOptions: [599, 699, 899] },
      { issue: "PCB Repair / Replacement", priceOptions: [2299, 2499, 2699] },
      { issue: "AC not turning on", priceOptions: [499, 599, 699] },
    ],
  },
  "fan-motor": {
    title: "Fan & Motor Services",
    desc: "Installation, repair, and maintenance of all fan & motor types.",
    rating: "4.6",
    basePrice: "₹199 onwards",
    issues: [
      { issue: "Slow Speed", priceOptions: [199, 249, 299] },
      { issue: "Noise Issue", priceOptions: [149, 199, 249] },
      { issue: "Regulator Problem", priceOptions: [129, 179, 229] },
      { issue: "Exhaust Fan Repair", priceOptions: [249, 299, 349] },
      { issue: "Motor Overheating", priceOptions: [349, 399, 449] },
      { issue: "Motor Winding", priceOptions: [499, 599, 699] },
    ],
  },
  wiring: {
    title: "Wiring & Switchboards",
    desc: "Professional wiring services with safety guarantee.",
    rating: "4.7",
    basePrice: "₹149 onwards",
    issues: [
      { issue: "Switch Burnt", priceOptions: [149, 199, 249] },
      { issue: "Plug Point Not Working", priceOptions: [199, 249, 299] },
      { issue: "MCB Tripping", priceOptions: [299, 349, 399] },
      { issue: "Short Circuit", priceOptions: [349, 399, 449] },
      { issue: "Socket Loose", priceOptions: [129, 179, 199] },
      { issue: "Sparking Issue", priceOptions: [199, 249, 299] },
    ],
  },
  electrical: {
    title: "Electrical Appliances",
    desc: "Repair services for geysers, fridges, washing machines & more.",
    rating: "4.5",
    basePrice: "₹249 onwards",
    issues: [
      { issue: "Geyser Not Heating", priceOptions: [399, 449, 499] },
      { issue: "Geyser Leakage", priceOptions: [349, 399, 449] },
      { issue: "Refrigerator Cooling Issue", priceOptions: [599, 649, 699] },
      { issue: "Washing Machine Leakage", priceOptions: [499, 549, 599] },
      { issue: "Microwave Not Heating", priceOptions: [299, 349, 399] },
      { issue: "Mixer / Grinder Problem", priceOptions: [199, 249, 299] },
    ],
  },
}

export default function ServiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const service = serviceData[id]
  const [selectedIssues, setSelectedIssues] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [address, setAddress] = useState("")
  const [openDropdown, setOpenDropdown] = useState(null)
  const { addToCart } = useApp()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [id])

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Service not found 🚫</p>
      </div>
    )
  }

  const toggleIssue = (issue, price) => {
    setSelectedIssues((prev) => {
      const exists = prev.find((i) => i.issue === issue)
      if (exists) {
        return prev.map((i) => (i.issue === issue ? { ...i, price } : i))
      } else {
        return [...prev, { issue, price }]
      }
    })
  }

  const removeIssue = (issueName) => {
    setSelectedIssues((prev) => prev.filter((i) => i.issue !== issueName))
  }

  const getSelectedPrice = (issue) => {
    const found = selectedIssues.find((i) => i.issue === issue)
    return found ? found.price : null
  }

  const labourCharge = selectedIssues.length > 0 ? 50 : 0
  const subtotal = selectedIssues.reduce((sum, i) => sum + i.price, 0)
  const discount =
    selectedIssues.length >= 3
      ? subtotal * 0.15
      : selectedIssues.length === 2
      ? subtotal * 0.1
      : 0
  const finalTotal = subtotal + labourCharge - discount

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
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

      {/* Main Section */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
        {/* Left Side */}
        <div className="bg-white p-6 rounded-xl shadow-md border">
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

          {/* Selected Items */}
          {selectedIssues.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold text-[#1A2A49] mb-3">
                Your Selected Items
              </h3>
              <ul className="space-y-2 text-sm">
                {selectedIssues.map((i, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between text-gray-700 bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <span>{i.issue}</span>
                    <span className="font-medium text-[#1A2A49]">₹{i.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Side - Issues */}
        <div className="bg-white rounded-xl shadow p-6 border relative">
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
                      onChange={() => toggleIssue(item.issue, item.priceOptions[0])}
                      checked={selectedIssues.some((s) => s.issue === item.issue)}
                    />
                  </td>
                  <td className="py-2 px-3">{item.issue}</td>
                  <td className="py-2 px-3 relative">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() =>
                        setOpenDropdown(openDropdown === i ? null : i)
                      }
                    >
                      <span className="font-medium text-[#1A2A49]">
                        ₹{getSelectedPrice(item.issue) || item.priceOptions[0]}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`ml-2 transition-transform ${
                          openDropdown === i ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    {openDropdown === i && (
                      <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-50">
                        {item.priceOptions.map((price, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              toggleIssue(item.issue, price)
                              setOpenDropdown(null)
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                          >
                            ₹{price}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Not Sure Button */}
          <div className="mt-6 bg-[#f9fafb] border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-700 mb-2">
              ❓ Not sure what’s wrong? Let our engineer inspect it for you.
            </p>
            <button
              onClick={() => {
                setSelectedIssues([
                  { issue: "Engineer Visit for Diagnosis", price: 49 },
                ])
                setCartOpen(true)
              }}
              className="bg-[#1A2A49] text-white px-6 py-2 rounded-lg hover:bg-[#223a61] transition"
            >
              Request Engineer Visit – ₹49
            </button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl shadow p-6 flex gap-3">
          <Info className="text-blue-600 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-[#1A2A49] mb-2">
              Important Information
            </h3>
            <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
              <li>Labour charges of ₹50 are mandatory and added to every order.</li>
              <li>All prices exclude spare parts (if required).</li>
              <li>Service comes with 30-days warranty.</li>
              <li>Cancellation after technician arrival → ₹99 visit fee.</li>
              <li>Final bill may vary depending on inspection.</li>
            </ul>
          </div>
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
        onProceed={() => {
          if (!address) {
            alert("Please enter service address")
            return
          }
          addToCart(selectedIssues)
          navigate(`/request/${id}`, {
            state: { selectedIssues, finalTotal, address },
          })
        }}
      />
    </div>
  )
}