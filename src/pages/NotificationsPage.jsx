// src/pages/NotificationsPage.jsx
import { Bell, CheckCircle2, Info, Trash2 } from "lucide-react"
import BackButton from "../components/BackButton"
import { useState } from "react"
import { useApp } from "../AppContext"
import toast from "react-hot-toast"

export default function NotificationsPage() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  } = useApp()

  const [filter, setFilter] = useState("all")

  const list = notifications || []
  const filteredNotifications =
    filter === "all"
      ? list
      : list.filter((n) => n.type === filter)

  const handleMarkAllRead = () => {
    markAllNotificationsRead()
    toast.success("All notifications marked as read")
  }

  return (
    <div className="main-container max-w-3xl mx-auto px-4 py-6">
      <BackButton />

      {/* Page Title */}
      <div className="flex items-center justify-between mb-6 mt-2">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1A2A49] flex items-center gap-2">
          <Bell size={22} className="text-[#1A2A49]" /> Notifications
        </h2>
        <div className="flex items-center gap-2">
          {list.length > 0 && (
            <>
              <button
                onClick={handleMarkAllRead}
                className="text-xs sm:text-sm bg-[#1A2A49] text-white px-3 py-1.5 rounded-lg hover:bg-[#223a61] transition"
              >
                Mark All Read
              </button>
              <button
                onClick={() => {
                  clearNotifications()
                  toast.success("Notifications cleared")
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                title="Clear All"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
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
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Bell size={28} className="text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No notifications available.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {filteredNotifications.map((n) => (
            <li
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition cursor-pointer ${
                n.read ? "opacity-75" : "border-[#F37021]/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#1A2A49]">{n.title}</h3>
                {n.read ? (
                  <CheckCircle2 size={18} className="text-green-500" />
                ) : (
                  <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">
                    New
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{n.message}</p>
              <p className="text-xs text-gray-400 mt-2">
                {n.time || (n.createdAt ? new Date(n.createdAt).toLocaleString() : "Just now")}
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-gray-50 border rounded-xl p-5 text-sm text-gray-600 flex items-start gap-2">
        <Info size={18} className="text-[#1A2A49] mt-0.5 flex-shrink-0" />
        <p>
          You will receive notifications about your bookings, service status,
          offers, and updates here. Click any notification to mark it as read.
        </p>
      </div>
    </div>
  )
}
