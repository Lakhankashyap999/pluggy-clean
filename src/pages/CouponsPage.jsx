import { TicketPercent, Info } from "lucide-react"
import BackButton from "../components/BackButton"

export default function CouponsPage() {
  const coupons = [
    {
      code: "PLUG20",
      desc: "Get 20% OFF on your first booking",
      expiry: "Valid till 31 Dec 2025",
    },
    {
      code: "SAVE100",
      desc: "Flat ₹100 OFF on services above ₹499",
      expiry: "Valid till 15 Oct 2025",
    },
  ]

  return (
    <div className="main-container max-w-3xl mx-auto px-4 py-6">
      <BackButton />
      <h2 className="text-xl sm:text-2xl font-bold text-[#1A2A49] mb-6 flex items-center gap-2">
        <TicketPercent size={22} className="text-[#1A2A49]" /> Coupons
      </h2>

      {/* Active Coupons Section */}
      {coupons.length === 0 ? (
        <p className="text-gray-500 text-center">No active coupons.</p>
      ) : (
        <div className="space-y-4">
          {coupons.map((c, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <h3 className="font-bold text-lg text-[#1A2A49]">{c.code}</h3>
                <p className="text-sm text-gray-600">{c.desc}</p>
                <p className="text-xs text-gray-400 mt-1">{c.expiry}</p>
              </div>
              <button className="px-4 py-2 bg-[#1A2A49] text-white text-sm rounded-lg hover:bg-[#223a61]">
                Apply
              </button>
            </div>
          ))}
        </div>
      )}

      {/* How to Use Section */}
      <div className="mt-10 bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-[#1A2A49] mb-3 flex items-center gap-2">
          <Info size={18} /> How to use Coupons?
        </h3>
        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
          <li>Select your service and proceed to checkout.</li>
          <li>Click on “Apply Coupon” and enter the code.</li>
          <li>Discount will be applied instantly to your total bill.</li>
        </ol>
      </div>

      {/* Terms & Conditions */}
      <div className="mt-6 bg-gray-50 border rounded-xl p-5">
        <h3 className="font-semibold text-[#1A2A49] mb-2">Terms & Conditions</h3>
        <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
          <li>Coupons cannot be combined with other offers.</li>
          <li>Valid only for prepaid bookings.</li>
          <li>Coupon codes may expire without prior notice.</li>
        </ul>
      </div>
    </div>
  )
}
