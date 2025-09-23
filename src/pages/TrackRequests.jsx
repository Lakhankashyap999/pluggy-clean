// src/pages/TrackRequests.jsx
import { useApp } from "../AppContext"

export default function TrackRequests() {
  const { requests } = useApp()

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-[#1A2A49] mb-4">Track Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-600">No requests yet.</p>
      ) : (
        <ul className="space-y-3">
          {requests.map((r) => (
            <li key={r.id} className="border rounded-lg p-3">
              <div className="font-semibold">{r.service}</div>
              <div className="text-sm text-gray-600">Issue: {r.issue}</div>
              <div className="text-sm">Amount: ₹{r.amount}</div>
              <div className="text-sm text-gray-500">Status: {r.status}</div>
              {r.status === "Accepted" && (
                <div className="text-green-600 font-medium">
                  ✅ Accepted — Your engineer will call you shortly
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
