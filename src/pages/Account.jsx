import { useState, useEffect } from "react"
import {
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
import { useApp } from "../AppContext"

export default function Account() {
  const { user, setUser, requests, cart, logoutUser } = useApp()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: "", email: "" })
  const [activeTab, setActiveTab] = useState(null)

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email })
  }, [user])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-gray-600 text-center px-4">
        Please log in to view your account
      </div>
    )
  }

  // ✅ Save profile changes
  const saveProfile = () => {
    const updatedUser = { ...user, name: form.name, email: form.email }
    setUser(updatedUser)
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

        {/* Options */}
        <Section title="My Orders">
          <Item icon={ListChecks} label="Track Requests" onClick={() => setActiveTab("track")} />
          <Item icon={ShoppingCart} label={`My Cart (${cart.length})`} onClick={() => setActiveTab("cart")} />
        </Section>

        <Section title="Account Settings">
          <Item icon={Lock} label="Login & Security" onClick={() => setActiveTab("login")} />
          <Item icon={MapPin} label="Your Address" onClick={() => setActiveTab("address")} />
          <Item icon={Eye} label="Recently Viewed" onClick={() => setActiveTab("recent")} />
          <Item icon={Key} label="Change Password" onClick={() => setActiveTab("password")} />
          <Item icon={Edit} label="Edit Profile" onClick={() => setActiveTab("editProfile")} />
        </Section>

        <Section title="Others">
          <Item icon={Bell} label="Notifications" onClick={() => setActiveTab("notifications")} />
          <Item icon={TicketPercent} label="Coupons" onClick={() => setActiveTab("coupons")} />
          <Item icon={Wrench} label="Services" onClick={() => setActiveTab("services")} />
        </Section>

        <div className="bg-white rounded-xl shadow">
          <Item
            icon={LogOut}
            label="Logout"
            onClick={() => {
              logoutUser()
              toast.success("Logged out successfully ✅")
            }}
          />
        </div>

        {/* Tab Content */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow">
          {activeTab === "track" && (
            <div>
              <h3 className="font-bold text-[#1A2A49] mb-3">Track Your Requests</h3>
              {requests.length === 0 ? (
                <p className="text-gray-600">No requests found.</p>
              ) : (
                <ul className="space-y-3">
                  {requests.map((r) => (
                    <li key={r.id} className="border rounded-lg p-3">
                      <div className="font-semibold">{r.service}</div>
                      <div className="text-sm text-gray-600">Issue: {r.issue}</div>
                      <div className="text-sm">Amount: ₹{r.amount}</div>
                      <div className="text-sm text-gray-500">Status: {r.status}</div>
                      {r.status === "Accepted" && (
                        <div className="text-green-600 font-medium mt-1">
                          ✅ Accepted — Your engineer will call you shortly
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === "cart" && (
            <div>
              <h3 className="font-bold text-[#1A2A49] mb-3">My Cart</h3>
              {cart.length === 0 ? (
                <p className="text-gray-600">Your cart is empty.</p>
              ) : (
                <ul className="space-y-2">
                  {cart.map((c, i) => (
                    <li key={i} className="border p-2 rounded">
                      {c.issue} — ₹{c.price}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h3 className="font-bold text-[#1A2A49] mb-3">Notifications</h3>
              <p className="text-gray-600">No new notifications.</p>
            </div>
          )}

          {activeTab === "coupons" && (
            <div>
              <h3 className="font-bold text-[#1A2A49] mb-3">Coupons</h3>
              <p className="text-gray-600">No coupons available.</p>
            </div>
          )}

          {activeTab === "services" && (
            <div>
              <h3 className="font-bold text-[#1A2A49] mb-3">Services</h3>
              <p className="text-gray-600">Services list will be shown here.</p>
            </div>
          )}

          {activeTab === "editProfile" && (
            <div>
              <h3 className="font-bold text-[#1A2A49] mb-3">Edit Profile</h3>
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
          )}
        </div>
      </div>
    </div>
  )
}
