// src/pages/CouponsPage.jsx
import { useState } from "react"
import { TicketPercent, Info, Check } from "lucide-react"
import BackButton from "../components/BackButton"
import { useApp } from "../AppContext"
import toast from "react-hot-toast"

export default function CouponsPage() {
  const { appliedCoupon, applyCouponCode, removeCoupon } = useApp()
  const [customCode, setCustomCode] = useState("")

  const coupons = [
    {
      code: "PLUGGY20",
      desc: "Get 20% OFF on your first booking",
      expiry: "Valid till 31 Dec 2026",
    },
    {
      code: "SUMMER25",
      desc: "Summer Special: Flat 25% OFF on AC & Fan services",
      expiry: "Valid till 30 Sep 2026",
    },
    {
      code: "SAVE100",
      desc: "Flat ₹100 OFF on services above ₹499",
      expiry: "Valid till 31 Dec 2026",
    },
    {
      code: "PLUG20",
      desc: "Get 20% OFF on any electrical repair",
      expiry: "Valid till 31 Dec 2026",
    },
  ]

  const handleApply = (code) => {
    const res = applyCouponCode(code)
    if (res.success) {
      toast.success(`Coupon ${code} applied! (${res.coupon.label})`)
    } else {
      toast.error(res.message || "Invalid coupon code")
    }
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    if (!customCode.trim()) return
    handleApply(customCode)
    setCustomCode("")
  }

  return (
    <div className="main-container max-w-3xl mx-auto px-4 py-6">
      <BackButton />
      <h2 className="text-xl sm:text-2xl font-bold text-[#1A2A49] mb-6 mt-2 flex items-center gap-2">
        <TicketPercent size={22} className="text-[#F37021]" /> Coupons & Offers
      </h2>

      {/* Enter Coupon Input */}
      <form onSubmit={handleCustomSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code (e.g. PLUGGY20)"
          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#F37021]"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-[#1A2A49] text-white text-sm font-semibold rounded-xl hover:bg-[#223a61] transition"
        >
          Apply
        </button>
      </form>

      {/* Active Coupons Section */}
      <div className="space-y-4">
        {coupons.map((c, i) => {
          const isApplied = appliedCoupon?.code === c.code
          return (
            <div
              key={i}
              className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                isApplied ? "border-green-500 ring-1 ring-green-500/30" : "border-gray-200"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-[#1A2A49] font-mono">{c.code}</h3>
                  {isApplied && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                      <Check size={12} /> Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{c.desc}</p>
                <p className="text-xs text-gray-400 mt-1">{c.expiry}</p>
              </div>
              {isApplied ? (
                <button
                  onClick={() => {
                    removeCoupon()
                    toast.success("Coupon removed")
                  }}
                  className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={() => handleApply(c.code)}
                  className="px-4 py-2 bg-[#1A2A49] text-white text-sm font-medium rounded-lg hover:bg-[#223a61] transition"
                >
                  Apply
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* How to Use Section */}
      <div className="mt-10 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-[#1A2A49] mb-3 flex items-center gap-2">
          <Info size={18} /> How to use Coupons?
        </h3>
        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
          <li>Click “Apply” on any coupon above to activate it for your next booking.</li>
          <li>Select your service and proceed to checkout or cart.</li>
          <li>Discount will be applied automatically to your total bill.</li>
        </ol>
      </div>

      {/* Terms & Conditions */}
      <div className="mt-6 bg-gray-50 border rounded-xl p-5">
        <h3 className="font-semibold text-[#1A2A49] mb-2">Terms & Conditions</h3>
        <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
          <li>Coupons cannot be combined with other offers.</li>
          <li>Valid for all online and cash bookings.</li>
          <li>Coupon codes may expire without prior notice.</li>
        </ul>
      </div>
    </div>
  )
}
