import { Bell, CheckCircle2, Info } from "lucide-react"
import BackButton from "../components/BackButton"
import { useState } from "react"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "service",
      title: "Service Accepted",
      message: "Your AC Repair request has been accepted by Engineer Raj.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "update",
      title: "Engineer On the Way",
      message: "Your assigned engineer is on the way to your location.",
      time: "Yesterday",
      read: false,
    },
    {
      id: 3,
      type: "offer",
      title: "Coupon Applied",
      message: "You saved ₹200 using code PLUG20 🎉",
      time: "2 days ago",
      read: true,
    },
  ])

  const [filter, setFilter] = useState("all")

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter)

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      }))
    )
  }

  return (
    <div className="main-container max-w-3xl mx-auto px-4 py-6">
      <BackButton />

      {/* Page Title */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1A2A49] flex items-center gap-2">
          <Bell size={22} className="text-[#1A2A49]" /> Notifications
        </h2>
        <button
          onClick={markAllAsRead}
          className="text-sm bg-[#1A2A49] text-white px-3 py-1.5 rounded-lg hover:bg-[#223a61] transition"
        >
          Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "service", "update", "offer"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm rounded-full border transition ${
              filter === f
                ? "bg-[#1A2A49] text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <img
            src="https://illustrations.popsy.co/gray/no-notifications.svg"
            alt="No Notifications"
            className="w-40 mx-auto mb-4"
          />
          <p className="text-gray-500">No notifications available.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredNotifications.map((n) => (
            <li
              key={n.id}
              className={`bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition ${
                n.read ? "opacity-70" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#1A2A49]">{n.title}</h3>
                {n.read ? (
                  <CheckCircle2 size={18} className="text-green-500" />
                ) : (
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                    New
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{n.message}</p>
              <p className="text-xs text-gray-400 mt-2">{n.time}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-gray-50 border rounded-xl p-5 text-sm text-gray-600 flex items-start gap-2">
        <Info size={18} className="text-[#1A2A49] mt-0.5" />
        <p>
          You will receive notifications about your bookings, service status,
          offers, and updates here. Keep them enabled to stay informed.
        </p>
      </div>
    </div>
  )
}
