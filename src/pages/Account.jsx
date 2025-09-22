import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  User,
  ShoppingCart,
  ListChecks,
  Lock,
  MapPin,
  Eye,
  Key,
  Bell,
  TicketPercent,
  Wrench,
  LogOut,
  Edit,
} from "lucide-react"
import toast from "react-hot-toast"

export default function Account({ user, setUser }) {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: "", email: "" })

  useEffect(() => {
    const saved = localStorage.getItem("pluggy_requests")
    if (saved) setRequests(JSON.parse(saved))
  }, [])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-gray-600 text-center px-4">
        Please log in to view your account
      </div>
    )
  }

  // ✅ Start edit mode
  const startEdit = () => {
    setForm({ name: user.name, email: user.email })
    setEditing(true)
  }

  // ✅ Save profile changes
  const saveProfile = () => {
    const updatedUser = { ...user, name: form.name, email: form.email }
    setUser(updatedUser)
    localStorage.setItem("pluggy_user", JSON.stringify(updatedUser))
    setEditing(false)
    toast.success("Profile updated ✅")
  }

  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">{title}</h3>
      <div className="bg-white rounded-xl shadow divide-y">{children}</div>
    </div>
  )

  const Item = ({ icon: Icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition"
    >
      <Icon size={18} className="text-[#1A2A49]" />
      <span className="text-gray-700">{label}</span>
    </button>
  )

  return (
    <div className="bg-gray-50 min-h-screen px-3 sm:px-6 py-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-[#1A2A49] mb-6">My Account</h2>

        {/* My Orders */}
        <Section title="My Orders">
          <Item
            icon={ListChecks}
            label="My Orders"
            onClick={() => navigate("/account", { state: { tab: "track" } })}
          />
          <Item
            icon={ShoppingCart}
            label={`My Cart (${(JSON.parse(localStorage.getItem("pluggy_cart") || "[]")).length})`}
            onClick={() => window.dispatchEvent(new Event("pluggy:open-cart"))}
          />
        </Section>

        {/* Account Settings */}
        <Section title="Account Settings">
          <Item icon={Lock} label="Login & Security" onClick={() => toast("Login settings")} />
          <Item icon={MapPin} label="Your Address" onClick={() => toast("Address book")} />
          <Item icon={Eye} label="Recently Viewed" onClick={() => toast("Recently viewed")} />
          <Item icon={Key} label="Change Password" onClick={() => toast("Change password")} />
          {editing ? (
            <div className="p-4">
              <input
                className="border w-full mb-2 px-3 py-2 rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="border w-full mb-2 px-3 py-2 rounded"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <div className="flex gap-3">
                <button
                  onClick={saveProfile}
                  className="px-4 py-2 bg-[#1A2A49] text-white rounded-lg hover:bg-[#223a61]"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <Item icon={Edit} label="Edit Profile" onClick={startEdit} />
          )}
        </Section>

        {/* Others */}
        <Section title="Others">
          <Item
            icon={Bell}
            label="Notifications"
            onClick={() => navigate("/account", { state: { tab: "notifications" } })}
          />
          <Item
            icon={TicketPercent}
            label="Coupons"
            onClick={() => navigate("/account", { state: { tab: "coupons" } })}
          />
          <Item
            icon={Wrench}
            label="Services"
            onClick={() => navigate("/account", { state: { tab: "services" } })}
          />
        </Section>

        {/* Logout */}
        <div className="bg-white rounded-xl shadow">
          <Item
            icon={LogOut}
            label="Logout"
            onClick={() => {
              localStorage.removeItem("pluggy_user")
              setUser(null)
              toast.success("Logged out successfully ✅")
              navigate("/")
            }}
          />
        </div>
      </div>
    </div>
  )
}
