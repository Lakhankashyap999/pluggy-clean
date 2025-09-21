import { useNavigate } from "react-router-dom"
import { ChevronLeft, Star, Wrench } from "lucide-react"
import { useState } from "react"

export default function WiringDetail() {
  const navigate = useNavigate()
  const [selectedIssue, setSelectedIssue] = useState(null)

  const service = {
    title: "Wiring & Switchboard",
    desc: "Professional electrical wiring & switchboard services with safety.",
    rating: "4.7",
    basePrice: "₹299 onwards",
    issues: [
      { issue: "Switchboard Repair", price: 299 },
      { issue: "Short Circuit Fix", price: 399 },
      { issue: "New Wiring Setup", price: 799 },
      { issue: "Fuse Replacement", price: 199 },
      { issue: "MCB Installation", price: 499 },
    ],
  }

  const labourCharge = 50
  const finalAmount = selectedIssue ? selectedIssue.price + labourCharge : null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-700 hover:text-[#1A2A49]">
            <ChevronLeft size={20} /> <span className="text-sm">Back</span>
          </button>
          <h2 className="font-bold text-[#1A2A49]">{service.title}</h2>
          <button onClick={() => navigate("/")} className="text-sm text-[#1A2A49] hover:underline">Home</button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2A49]">{service.title}</h1>
          <p className="text-gray-600 mt-2">{service.desc}</p>
          <div className="flex items-center gap-4 mt-4">
            <span className="flex items-center gap-1 text-yellow-500 font-medium">
              <Star size={18} /> {service.rating}
            </span>
            <span className="text-lg font-bold text-[#1A2A49]">
              {finalAmount ? `₹${finalAmount}` : service.basePrice}
            </span>
          </div>
          <button
            onClick={() => navigate(`/request/wiring-switchboard`, { state: { selectedIssue, finalAmount } })}
            disabled={!selectedIssue}
            className="mt-6 px-6 py-3 bg-[#1A2A49] text-white rounded-lg hover:bg-[#223a61] disabled:opacity-50"
          >
            Book Now
          </button>
        </div>

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
                      type="radio"
                      name="selectedIssue"
                      className="accent-[#1A2A49]"
                      onChange={() => setSelectedIssue(item)}
                      checked={selectedIssue?.issue === item.issue}
                    />
                  </td>
                  <td className="py-2 px-3">{item.issue}</td>
                  <td className="py-2 px-3 font-medium text-[#1A2A49]">₹{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedIssue && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
              <p>Selected: <span className="font-semibold">{selectedIssue.issue}</span></p>
              <p>Issue Charge: ₹{selectedIssue.price} + Labour: ₹{labourCharge}</p>
              <p className="font-bold text-[#1A2A49]">Total: ₹{finalAmount}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
