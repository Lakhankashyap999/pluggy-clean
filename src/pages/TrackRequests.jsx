// src/pages/TrackRequests.jsx
import { useApp } from "../AppContext"
import { PackageSearch, Calendar, CircleDollarSign, User, Wrench } from "lucide-react"

export default function TrackRequests() {
  const { requests } = useApp()

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-xl sm:text-2xl font-bold text-[#1A2A49] mb-6">
        Track Your Requests
      </h2>

      {requests.length === 0 ? (
        // ✅ Empty state
        <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-2xl shadow-sm border">
          <img
            src="https://illustrations.popsy.co/gray/no-data.svg"
            alt="No requests"
            className="w-40 sm:w-52 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No requests yet
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Raise a service request and track its status here.
          </p>
          <a
            href="/"
            className="px-5 py-2 bg-[#1A2A49] text-white rounded-lg hover:bg-[#223a61] text-sm"
          >
            Book a Service
          </a>
        </div>
      ) : (
        // ✅ Requests list
        <ul className="space-y-4">
          {requests.map((r) => (
            <li
              key={r.id}
              className="bg-white rounded-xl shadow-md border p-4 sm:p-5 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-[#1A2A49] flex items-center gap-2">
                  <Wrench size={18} className="text-[#F37021]" />
                  {r.service}
                </h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
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

              <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <User size={14} className="text-[#1A2A49]" /> {r.name}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar size={14} className="text-[#1A2A49]" /> {r.created_at}
                </p>
                <p className="flex items-center gap-2">
                  <PackageSearch size={14} className="text-[#1A2A49]" /> {r.issue}
                </p>
                <p className="flex items-center gap-2">
                  <CircleDollarSign size={14} className="text-[#1A2A49]" /> ₹{r.amount}
                </p>
              </div>

              {r.status === "Accepted" && (
                <div className="text-green-600 font-medium text-sm mt-3">
                  ✅ Your engineer will call you shortly
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
