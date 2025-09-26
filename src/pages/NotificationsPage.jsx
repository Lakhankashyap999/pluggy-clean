import { Bell } from "lucide-react"
import BackButton from "../components/BackButton"

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "Service Accepted",
      message: "Your AC Repair request has been accepted by Engineer Raj.",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Engineer On the Way",
      message: "Your assigned engineer is on the way to your location.",
      time: "Yesterday",
    },
    {
      id: 3,
      title: "Coupon Applied",
      message: "You saved ₹200 using code PLUG20 🎉",
      time: "2 days ago",
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <BackButton />
      <h2 className="text-xl sm:text-2xl font-bold text-[#1A2A49] mb-6 flex items-center gap-2">
        <Bell size={22} className="text-[#1A2A49]" /> Notifications
      </h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-center">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-[#1A2A49]">{n.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{n.message}</p>
              <p className="text-xs text-gray-400 mt-2">{n.time}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
