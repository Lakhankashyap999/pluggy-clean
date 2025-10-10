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
  Bell,
  TicketPercent,
  Wrench,
  LogOut,
  User,
  ChevronLeft,
} from "lucide-react"
import toast from "react-hot-toast"

export default function Account() {
  const { user, logoutUser, bookings } = useApp()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-gray-600">
        <p>Please log in to view your account</p>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-[#1A2A49] text-white rounded-lg hover:bg-[#223a61] transition"
        >
          Log in
        </button>
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
    <div className="min-h-screen bg-gray-50 px-3 sm:px-6 py-6">
      <div className="max-w-3xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-[#1A2A49] hover:underline"
          >
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-8">
          <div className="h-20 w-20 rounded-full bg-[#1A2A49] text-white flex items-center justify-center text-2xl font-bold">
            {user.name?.charAt(0).toUpperCase() || <User size={28} />}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-[#1A2A49]">{user.name}</h2>
            <p className="text-sm text-gray-600">{user.email}</p>
            {user.phone && <p className="text-sm text-gray-500">📞 {user.phone}</p>}
          </div>
          <button
            onClick={() => navigate("/account/edit")}
            className="px-4 py-2 bg-[#1A2A49] text-white text-sm rounded-lg hover:bg-[#223a61]"
          >
            Edit Profile
          </button>
        </div>

        {/* My Bookings */}
        <Section title="My Bookings">
          {bookings.length > 0 ? (
            bookings.map((b, i) => (
              <div key={i} className="px-4 py-3 border-b hover:bg-gray-50">
                <p className="text-gray-800 font-medium">{b.service}</p>
                <p className="text-sm text-gray-500">
                  {b.date} at {b.time}
                </p>
                {b.details && (
                  <p className="text-xs text-gray-400 mt-1">{b.details}</p>
                )}
              </div>
            ))
          ) : (
            <p className="px-4 py-3 text-gray-500">No bookings yet.</p>
          )}
        </Section>

        {/* My Orders */}
        <Section title="My Orders">
          {user && (
            <>
              <Item icon={ListChecks} label="Track Requests" path="/account/track" />
              <Item icon={ShoppingCart} label="My Cart" path="/account/cart" />
            </>
          )}
        </Section>

        {/* Account Settings */}
        <Section title="Account Settings">
          {user && (
            <>
              <Item icon={Lock} label="Login & Security" path="/account/security" />
              <Item icon={MapPin} label="Your Address" path="/account/address" />
              <Item icon={Eye} label="Recently Viewed" path="/account/recent" />
              <Item icon={Key} label="Change Password" path="/account/password" />
            </>
          )}
        </Section>

        {/* Others */}
        <Section title="Others">
          {user && (
            <>
              <Item icon={Bell} label="Notifications" path="/account/notifications" />
              <Item icon={TicketPercent} label="Coupons" path="/account/coupons" />
              <Item icon={Wrench} label="Services" path="/account/services" />
            </>
          )}
        </Section>

        {/* Logout */}
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
