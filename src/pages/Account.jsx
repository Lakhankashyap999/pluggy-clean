// src/pages/Account.jsx
import { useApp } from "../AppContext"
import { useNavigate } from "react-router-dom"
import {
  ListChecks,
  ShoppingCart,
  Lock,
  MapPin,
  Eye,
  Key,
  Edit,
  Bell,
  TicketPercent,
  Wrench,
  LogOut,
  User,
} from "lucide-react"
import toast from "react-hot-toast"

export default function Account() {
  const { user, logoutUser } = useApp()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] text-gray-600">
        Please log in to view your account
      </div>
    )
  }

  const Item = ({ icon: Icon, label, path, onClick }) => (
    <button
      onClick={onClick || (() => navigate(path))}
      className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition"
    >
      <Icon size={18} className="text-[#1A2A49]" />
      <span className="text-gray-700">{label}</span>
    </button>
  )

  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-500 uppercase mb-2 px-1">
        {title}
      </h3>
      <div className="bg-white rounded-xl shadow divide-y">{children}</div>
    </div>
  )

  return (
    <div className="bg-gray-50 min-h-screen px-3 sm:px-6 py-6">
      <div className="max-w-3xl mx-auto">
        {/* ✅ Profile Header */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-8">
          <div className="h-20 w-20 rounded-full bg-[#1A2A49] text-white flex items-center justify-center text-2xl font-bold">
            {user.name?.charAt(0).toUpperCase() || <User size={28} />}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-[#1A2A49]">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            {user.phone && (
              <p className="text-sm text-gray-500">📞 {user.phone}</p>
            )}
          </div>
          <button
            onClick={() => navigate("/account/edit")}
            className="px-4 py-2 bg-[#1A2A49] text-white text-sm rounded-lg hover:bg-[#223a61]"
          >
            Edit Profile
          </button>
        </div>

        {/* ✅ My Orders */}
        <Section title="My Orders">
          <Item icon={ListChecks} label="Track Requests" path="/account/track" />
          <Item icon={ShoppingCart} label="My Cart" path="/account/cart" />
        </Section>

        {/* ✅ Account Settings */}
        <Section title="Account Settings">
          <Item icon={Lock} label="Login & Security" path="/account/security" />
          <Item icon={MapPin} label="Your Address" path="/account/address" />
          <Item icon={Eye} label="Recently Viewed" path="/account/recent" />
          <Item icon={Key} label="Change Password" path="/account/password" />
        </Section>

        {/* ✅ Others */}
        <Section title="Others">
          <Item
            icon={Bell}
            label="Notifications"
            path="/account/notifications"
          />
          <Item icon={TicketPercent} label="Coupons" path="/account/coupons" />
          <Item icon={Wrench} label="Services" path="/account/services" />
        </Section>

        {/* ✅ Logout */}
        <div className="bg-white rounded-xl shadow">
          <Item
            icon={LogOut}
            label="Logout"
            onClick={() => {
              logoutUser()
              toast.success("Logged out successfully ✅")
              navigate("/")
            }}
          />
        </div>
      </div>
    </div>
  )
}
