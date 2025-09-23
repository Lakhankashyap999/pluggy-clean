import { useApp } from "../AppContext"

export default function EngineerDashboard() {
  const { engineer, requests, setRequests } = useApp()

  // ✅ Update request status
  const updateRequestStatus = (id, newStatus) => {
    const updated = requests.map((req) =>
      req.id === id ? { ...req, status: newStatus } : req
    )
    setRequests(updated)
  }

  if (!engineer) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Please log in as Engineer to view the dashboard.
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#1A2A49] mb-6">
        Engineer Dashboard — {engineer.name}
      </h1>

      {requests.length === 0 ? (
        <div className="text-gray-600">No user requests yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Service</th>
                <th className="p-3 text-left">Issue</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr
                  key={r.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 text-gray-600">{r.created_at}</td>
                  <td className="p-3 font-semibold text-[#1A2A49]">
                    {r.service}
                  </td>
                  <td className="p-3">{r.issue}</td>
                  <td className="p-3">₹{r.amount}</td>
                  <td className="p-3 text-sm">
                    <div className="font-medium">{r.name}</div>
                    <div className="text-gray-500">{r.email}</div>
                    <div className="text-gray-500">{r.phone}</div>
                  </td>
                  <td className="p-3">
                    <select
                      value={r.status}
                      onChange={(e) =>
                        updateRequestStatus(r.id, e.target.value)
                      }
                      className="border rounded-lg px-2 py-1 text-sm"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Accepted">Accepted</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
