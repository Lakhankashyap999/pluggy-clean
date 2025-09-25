// src/pages/TrackRequests.jsx
import { useApp } from "../AppContext"
import {
  PackageSearch,
  Calendar,
  CircleDollarSign,
  User,
  Wrench,
} from "lucide-react"

export default function TrackRequests() {
  const { requests } = useApp()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2A49] mb-8 text-center">
        📦 Track Your Service Requests
      </h2>

      {requests.length === 0 ? (
        // ✅ Empty state
        <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-2xl shadow border">
          <img
            src="https://illustrations.popsy.co/gray/no-data.svg"
            alt="No requests"
            className="w-44 sm:w-56 mb-5"
          />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            No requests yet
          </h3>
          <p className="text-gray-500 text-sm mb-5 max-w-sm">
            Raise a service request and track its real-time status here.
          </p>
          <a
            href="/"
            className="px-6 py-2 bg-[#1A2A49] text-white rounded-lg hover:bg-[#223a61] text-sm font-medium shadow-md"
          >
            + Book a Service
          </a>
        </div>
      ) : (
        // ✅ Requests list
        <div className="space-y-5">
          {requests.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl shadow-md border p-5 hover:shadow-lg transition"
            >
              {/* Header row */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-[#1A2A49] flex items-center gap-2 text-lg">
                  <Wrench size={20} className="text-[#F37021]" />
                  {r.service}
                </h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    r.status === "Accepted"
                      ? "bg-green-100 text-green-700"
                      : r.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : r.status === "Completed"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              {/* Info grid */}
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                <p className="flex items-center gap-2">
                  <User size={15} className="text-[#1A2A49]" />{" "}
                  <span className="font-medium">{r.name}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Calendar size={15} className="text-[#1A2A49]" /> {r.created_at}
                </p>
                <p className="flex items-center gap-2">
                  <PackageSearch size={15} className="text-[#1A2A49]" />{" "}
                  {r.issue}
                </p>
                <p className="flex items-center gap-2">
                  <CircleDollarSign size={15} className="text-[#1A2A49]" /> ₹
                  {r.amount}
                </p>
              </div>

              {/* Status message */}
              {r.status === "Accepted" && (
                <div className="text-green-600 font-medium text-sm mt-2">
                  ✅ Your engineer has accepted the request and will reach your
                  location shortly.
                </div>
              )}
              {r.status === "In Progress" && (
                <div className="text-yellow-600 font-medium text-sm mt-2">
                  🔧 Your service is currently in progress.
                </div>
              )}
              {r.status === "Completed" && (
                <div className="text-blue-600 font-medium text-sm mt-2">
                  🎉 Service completed successfully!
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
