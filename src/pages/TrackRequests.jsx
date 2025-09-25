// src/pages/TrackRequests.jsx
import { useApp } from "../AppContext"
import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function TrackRequests() {
  const { requests } = useApp()
  const navigate = useNavigate()

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-6">
      {/* Header with Back button */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate("/account")}
          className="flex items-center text-[#1A2A49] hover:underline"
        >
          <ChevronLeft size={20} />
          <span className="ml-1 text-sm">Back</span>
        </button>
        <h2 className="flex-1 text-center text-xl font-bold text-[#1A2A49]">
          Track Requests
        </h2>
      </div>

      {/* Requests List */}
      <div className="max-w-3xl mx-auto">
        {requests.length === 0 ? (
          <p className="text-gray-600 text-center">No requests yet.</p>
        ) : (
          <ul className="space-y-3">
            {requests.map((r) => (
              <li
                key={r.id}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="font-semibold text-[#1A2A49]">
                  {r.service}
                </div>
                <div className="text-sm text-gray-600">
                  Issue: {r.issue}
                </div>
                <div className="text-sm">Amount: ₹{r.amount}</div>
                <div className="text-sm text-gray-500">
                  Status: {r.status}
                </div>
                {r.status === "Accepted" && (
                  <div className="text-green-600 font-medium mt-1">
                    ✅ Accepted — Your engineer will call you shortly
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
