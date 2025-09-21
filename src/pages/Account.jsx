import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  User,
  PackageSearch,
  TicketPercent,
  Bell,
  LogOut,
  Home,
  MapPin,
  Wrench,
} from "lucide-react"
import toast from "react-hot-toast"
import LocationPopup from "../components/LocationPopup" // ✅ FIXED PATH

export default function Account({ user, setUser }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(location.state?.tab || "profile")
  const [requests, setRequests] = useState([])
  const [openLocation, setOpenLocation] = useState(false)
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem("pluggy_requests")
    if (saved) setRequests(JSON.parse(saved))
  }, [location])

  const handleCancel = (id) => {
    const updated = requests.filter((r) => r.id !== id)
    setRequests(updated)
    localStorage.setItem("pluggy_requests", JSON.stringify(updated))
    toast.success("Request cancelled ❌")
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-gray-600 text-center px-4">
        Please log in to view your account
      </div>
    )
  }

  const menus = [
    {
      label: "AC Services",
      items: ["Cooling Issue", "Water Leakage", "Gas Refill", "Installation / Uninstallation", "Remote Not Working", "Unusual Noise"],
    },
    {
      label: "Fan & Motor",
      items: ["Slow Speed", "Noise Issue", "Regulator Problem", "Exhaust Fan Repair", "Motor Overheating", "Motor Winding"],
    },
    {
      label: "Wiring & Switchboards",
      items: ["Switch Burnt", "Plug Point Not Working", "MCB Tripping", "Short Circuit", "Socket Loose", "Sparking Issue"],
    },
    {
      label: "Appliances",
      items: ["Geyser Not Heating", "Geyser Leakage", "Refrigerator Cooling Issue", "Washing Machine Leakage", "Microwave Not Heating", "Induction Cooktop Issue", "Mixer / Grinder Problem"],
    },
    {
      label: "Others",
      items: ["Tube Light Fuse", "LED Flickering", "Fancy Light Setup", "Bulb Holder Issue", "Emergency Light Problem", "Inverter Battery Issue", "Inverter Charging Problem", "Doorbell Not Working", "CCTV Connection", "Wi-Fi Power Point", "Smart Device Setup"],
    },
  ]

  return (
    <div className="bg-gray-50 min-h-screen px-2 sm:px-4 py-4">
      <div className="max-w-5xl mx-auto bg-white shadow rounded-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 border-b gap-3 sm:gap-0">
          <h2 className="text-lg font-bold text-[#1A2A49]">My Account</h2>
          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <button
              onClick={() => setOpenLocation(true)}
              className="flex items-center gap-1 text-gray-700 hover:text-[#1A2A49]"
            >
              <MapPin size={18} /> Location
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 text-gray-700 hover:text-[#1A2A49]"
            >
              <Home size={18} /> Home
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap sm:flex-nowrap border-b text-sm sm:text-base">
          {[
            { id: "profile", label: "My Profile", icon: <User size={16} /> },
            { id: "track", label: "Track", icon: <PackageSearch size={16} /> },
            { id: "coupons", label: "Coupons", icon: <TicketPercent size={16} /> },
            { id: "notifications", label: "Notify", icon: <Bell size={16} /> },
            { id: "services", label: "Services", icon: <Wrench size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 sm:py-3 text-center font-medium flex justify-center items-center gap-1 ${
                activeTab === tab.id
                  ? "text-[#1A2A49] border-b-2 border-[#1A2A49]"
                  : "text-gray-500"
              }`}
            >
              {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 text-sm sm:text-base">
          {activeTab === "profile" && (
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#1A2A49] mb-4">My Profile</h2>
              <p><span className="font-medium">Name:</span> {user.name}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Phone:</span> {user.phone}</p>
            </div>
          )}

          {activeTab === "track" && (
            <div>
              <h2 className="text-xl font-bold text-[#1A2A49] mb-4">Your Requests</h2>
              {requests.length === 0 ? (
                <p className="text-gray-600">No requests yet.</p>
              ) : (
                <ul className="space-y-3">
                  {requests.map((r) => (
                    <li key={r.id} className="border rounded-md p-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div className="space-y-1">
                        <p className="font-medium">{r.service}</p>
                        <p className="text-sm text-gray-600">{r.issue}</p>
                        {r.amount !== null && (
                          <p className="text-sm text-[#1A2A49] font-semibold">
                            Amount Paid: ₹{r.amount}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">{r.name} • {r.phone}</p>
                        <p className="text-sm text-gray-500">{r.email}</p>
                        <p className="text-xs text-gray-400">Created: {r.created_at}</p>
                        <span className="inline-block mt-1 text-sm font-medium text-yellow-600">
                          {r.status}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCancel(r.id)}
                        className="self-end sm:self-center text-gray-400 hover:text-red-600 transition"
                        title="Cancel Request"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === "coupons" && (
            <div>
              <h2 className="text-xl font-bold text-[#1A2A49] mb-4">Coupons</h2>
              <p className="text-gray-600">No coupons available. 🎟️</p>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h2 className="text-xl font-bold text-[#1A2A49] mb-4">Notifications</h2>
              <p className="text-gray-600">No new notifications. 🔔</p>
            </div>
          )}

          {activeTab === "services" && (
            <div>
              <h2 className="text-xl font-bold text-[#1A2A49] mb-6">Our Services</h2>
              <ul className="space-y-6">
                {menus.map((menu, i) => (
                  <li
                    key={i}
                    className="relative group border rounded-lg p-4 hover:shadow-md"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <button className="flex justify-between items-center w-full font-medium text-[#1A2A49]">
                      {menu.label}
                    </button>
                    {hovered === i && (
                      <div className="mt-3 bg-white shadow-lg rounded-lg border p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {menu.items.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() =>
                              navigate(`/request/${item.replace(/\s+/g, "-").toLowerCase()}`)
                            }
                            className="text-sm text-gray-700 hover:bg-gray-100 px-3 py-1 rounded-md text-left"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="border-t px-4 sm:px-6 py-4">
          <button
            onClick={() => {
              localStorage.removeItem("pluggy_user")
              setUser(null)
              toast.success("Logged out successfully ✅")
              navigate("/")
            }}
            className="flex items-center gap-2 text-red-600 hover:text-red-800"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {openLocation && (
        <LocationPopup
          onClose={() => setOpenLocation(false)}
          onSave={(loc) => {
            localStorage.setItem("pluggy_city", JSON.stringify(loc))
            setOpenLocation(false)
          }}
        />
      )}
    </div>
  )
}
