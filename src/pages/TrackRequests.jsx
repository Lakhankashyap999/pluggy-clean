import { useApp } from "../AppContext"
import {
  PackageSearch,
  Calendar,
  CircleDollarSign,
  User,
  Wrench,
  Clock,
  CheckCircle2,
} from "lucide-react"
import BackButton from "../components/BackButton"

export default function TrackRequests() {
  const { requests } = useApp()

  const getStatusSteps = (status) => {
    const steps = ["Pending", "Accepted", "In Progress", "Completed"]
    const currentIndex = steps.indexOf(status)
    return steps.map((s, i) => ({
      label: s,
      done: i <= currentIndex,
    }))
  }

  return (
    <div className="main-container max-w-5xl mx-auto px-4 py-8">
      <BackButton />
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
        <div className="space-y-6">
          {requests.map((r) => {
            const steps = getStatusSteps(r.status)

            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl shadow-md border p-6 hover:shadow-lg transition"
              >
                {/* Header row */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-[#1A2A49] flex items-center gap-2 text-lg">
                    <Wrench size={20} className="text-[#F37021]" />
                    {r.service || "Service Request"}
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
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-6">
                  <p className="flex items-center gap-2">
                    <User size={15} className="text-[#1A2A49]" />{" "}
                    <span className="font-medium">{r.name}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar size={15} className="text-[#1A2A49]" />{" "}
                    {r.created_at}
                  </p>
                  <p className="flex items-center gap-2">
                    <PackageSearch size={15} className="text-[#1A2A49]" />{" "}
                    {r.issue || "No issue details"}
                  </p>
                  <p className="flex items-center gap-2">
                    <CircleDollarSign size={15} className="text-[#1A2A49]" /> ₹
                    {r.amount}
                  </p>
                </div>

                {/* Progress Timeline */}
                <div className="flex items-center justify-between relative">
                  {steps.map((s, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          s.done ? "bg-[#1A2A49] text-white" : "bg-gray-200"
                        }`}
                      >
                        {s.done ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                      </div>
                      <p className="text-xs mt-2">{s.label}</p>
                      {i < steps.length - 1 && (
                        <div
                          className={`absolute top-4 h-1 ${
                            s.done ? "bg-[#1A2A49]" : "bg-gray-300"
                          }`}
                          style={{
                            left: `${(i * 100) / (steps.length - 1)}%`,
                            width: `${100 / (steps.length - 1)}%`,
                          }}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Status message */}
                <div className="mt-4">
                  {r.status === "Accepted" && (
                    <div className="text-green-600 font-medium text-sm">
                      ✅ Your engineer has accepted the request and will reach
                      your location shortly.
                    </div>
                  )}
                  {r.status === "In Progress" && (
                    <div className="text-yellow-600 font-medium text-sm">
                      🔧 Your service is currently in progress.
                    </div>
                  )}
                  {r.status === "Completed" && (
                    <div className="text-blue-600 font-medium text-sm">
                      🎉 Service completed successfully!
                    </div>
                  )}
                  {r.status === "Pending" && (
                    <div className="text-gray-600 font-medium text-sm">
                      ⏳ Waiting for engineer to accept your request.
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
