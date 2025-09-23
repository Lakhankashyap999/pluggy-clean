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
  LogOut,
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
      <span>{label}</span>
    </button>
  )

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h2 className="text-2xl font-bold text-[#1A2A49] mb-6">
          Welcome, {user.name} 👋
        </h2>

        {/* Menu Options */}
        <div className="bg-white rounded-xl shadow divide-y">
          <Item icon={ListChecks} label="Track Requests" path="/account/track" />
          <Item icon={ShoppingCart} label="My Cart" path="/account/cart" />
          <Item icon={Lock} label="Login & Security" path="/account/security" />
          <Item icon={MapPin} label="Your Address" path="/account/address" />
          <Item icon={Eye} label="Recently Viewed" path="/account/recent" />
          <Item icon={Key} label="Change Password" path="/account/password" />
          <Item icon={Edit} label="Edit Profile" path="/account/edit" />
        </div>

        {/* Logout */}
        <div className="bg-white rounded-xl shadow mt-6">
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
