// src/pages/Account.jsx
import { useState } from "react"
import { useApp } from "../AppContext"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Mail, Phone, Edit3, LogOut, Package, Shield, MapPin, CreditCard,
  TicketPercent, Bell, Eye, HelpCircle, ChevronRight, Settings,
  Moon, Sun, Award, Heart, Sparkles, Clock
} from "lucide-react"
import toast from "react-hot-toast"
import BackButton from "../components/BackButton"
import PaymentMethodsCard from "../components/account/PaymentMethodsCard"
import ProfileStrengthMeter from "../components/account/ProfileStrengthMeter"
import WalletCard from "../components/account/WalletCard"
import ReferralCard from "../components/account/ReferralCard"
import BadgesCard from "../components/account/BadgesCard"
import BookingPreferences from "../components/account/BookingPreferences"
import ActivityTimeline from "../components/account/ActivityTimeline"
import SupportCard from "../components/account/SupportCard"

export default function Account() {
  const {
    user,
    logoutUser,
    theme,
    toggleTheme,
    cart,
    requests,
    notifications,
    walletBalance,
  } = useApp()
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [expandedSection, setExpandedSection] = useState(null)
  const [copiedReferral, setCopiedReferral] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F4F6F9] via-white to-[#EDF0F3] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-sm w-full"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#1A2A49] to-[#F37021] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <User size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A2A49] mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to access your account</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3.5 bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white rounded-xl font-semibold hover:shadow-lg transition"
          >
            Login to Continue
          </button>
          <p className="text-xs text-gray-400 mt-4">
            Don't have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-[#F37021] font-medium">
              Sign up
            </button>
          </p>
        </motion.div>
      </div>
    )
  }

  const handleLogout = () => {
    logoutUser()
    toast.success("Logged out successfully")
    navigate("/")
  }

  const referralCode = `PLUG${(user.name || "USER").slice(0, 3).toUpperCase()}100`
  const handleCopyReferral = () => {
    navigator.clipboard?.writeText(referralCode)
    setCopiedReferral(true)
    toast.success("Referral code copied!")
    setTimeout(() => setCopiedReferral(false), 2000)
  }

  const activeBookings = requests?.filter((r) => !["COMPLETED", "CANCELLED"].includes(r.status)).length || 0
  const completedBookings = requests?.filter((r) => r.status === "COMPLETED").length || 0
  const unreadNotifs = notifications?.filter((n) => !n.read).length || 0

  const sections = [
    {
      id: "bookings",
      title: "My Bookings",
      subtitle: "Track active & past service requests",
      icon: Package,
      link: "/account/track",
      badge: activeBookings > 0 ? activeBookings : null,
      color: "bg-blue-50 text-blue-600",
    },
    {
      id: "security",
      title: "Login & Security",
      subtitle: "Password, 2FA, privacy settings",
      icon: Shield,
      link: "/account/security",
      color: "bg-green-50 text-green-600",
    },
    {
      id: "address",
      title: "Your Addresses",
      subtitle: "Home, Office, Other",
      icon: MapPin,
      link: "/account/address",
      color: "bg-orange-50 text-orange-600",
    },
    {
      id: "payment",
      title: "Payment Methods",
      subtitle: "Saved cards & UPI",
      icon: CreditCard,
      color: "bg-purple-50 text-purple-600",
    },
    {
      id: "coupons",
      title: "Coupons",
      subtitle: "Available offers & discounts",
      icon: TicketPercent,
      link: "/account/coupons",
      color: "bg-pink-50 text-pink-600",
    },
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Push, SMS, Email preferences",
      icon: Bell,
      link: "/account/notifications",
      badge: unreadNotifs > 0 ? unreadNotifs : null,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      id: "recent",
      title: "Recently Viewed",
      subtitle: "Services you checked",
      icon: Eye,
      link: "/account/recent",
      color: "bg-cyan-50 text-cyan-600",
    },
    {
      id: "support",
      title: "Help & Support",
      subtitle: "FAQs, Chat, Call us",
      icon: HelpCircle,
      color: "bg-red-50 text-red-600",
    },
  ]

  return (
    <div className="min-h-screen bg-white font-inter pt-[64px] md:pt-[108px] pb-28 md:pb-14">
      <div className="max-w-3xl mx-auto px-5 py-6 sm:py-8">
        {/* Top Row: Back + Sign Out */}
        <div className="flex items-center justify-between mb-6">
          <BackButton />
          <button
            onClick={() => setShowLogoutModal(true)}
            className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Profile — Clean Apple-Style Header (No Box) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-gradient-to-br from-[#F37021] to-[#FF8C42] rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold shadow-md">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
                Verified Customer ({user.id || "USR001"})
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#1A2A49] truncate">
                {user.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">{user.email}</p>
              {user.phone && (
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{user.phone}</p>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate("/account/edit")}
            className="self-start sm:self-center h-10 px-5 rounded-full bg-[#F5F5F7] hover:bg-gray-200 text-xs sm:text-sm font-bold text-[#1A2A49] inline-flex items-center gap-1.5 shrink-0"
          >
            <Edit3 size={14} /> Edit Profile
          </button>
        </motion.div>

        {/* Stats — Three Clean Columns with Hairline Dividers */}
        <div className="grid grid-cols-3 py-5 border-b border-gray-200 text-center">
          <div onClick={() => navigate("/account/track")} className="cursor-pointer">
            <p className="text-2xl font-extrabold text-[#1A2A49]">{activeBookings}</p>
            <p className="text-xs text-gray-500 mt-0.5">Active Bookings</p>
          </div>
          <div
            onClick={() => navigate("/account/track")}
            className="border-x border-gray-200 cursor-pointer"
          >
            <p className="text-2xl font-extrabold text-[#1A2A49]">{completedBookings}</p>
            <p className="text-xs text-gray-500 mt-0.5">Completed</p>
          </div>
          <div onClick={() => navigate("/account/cart")} className="cursor-pointer">
            <p className="text-2xl font-extrabold text-[#F37021]">₹{walletBalance ?? 250}</p>
            <p className="text-xs text-gray-500 mt-0.5">Pluggy Wallet</p>
          </div>
        </div>

        {/* Clean Apple-Style Menu List (Dividers, No Heavy Boxes) */}
        <div className="mt-6">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-2">
            Account & Bookings
          </h2>
          <div className="divide-y divide-gray-200/80 border-y border-gray-200/80">
            {sections.map((section) => (
              <div key={section.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (section.id === "payment" || section.id === "support") {
                      setExpandedSection(expandedSection === section.id ? null : section.id)
                    } else if (section.link) {
                      navigate(section.link)
                    }
                  }}
                  className="w-full py-4 flex items-center justify-between gap-3.5 text-left group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl ${section.color} flex items-center justify-center shrink-0`}
                    >
                      <section.icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[#1A2A49] text-sm sm:text-base group-hover:text-[#F37021] transition-colors">
                          {section.title}
                        </h4>
                        {section.badge && (
                          <span className="bg-[#F37021] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                            {section.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs sm:text-sm mt-0.5 truncate">
                        {section.subtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    className={`text-gray-400 shrink-0 transition-transform ${
                      expandedSection === section.id ? "rotate-90 text-[#F37021]" : ""
                    }`}
                  />
                </button>

                {section.id === "payment" && expandedSection === "payment" && (
                  <div className="pb-4">
                    <PaymentMethodsCard />
                  </div>
                )}

                {section.id === "support" && expandedSection === "support" && (
                  <div className="pb-4">
                    <SupportCard />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Wallet & Referrals Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <WalletCard balance={walletBalance} />
          <ReferralCard
            code={referralCode}
            copied={copiedReferral}
            onCopy={handleCopyReferral}
            earnings={100}
            referrals={1}
          />
        </div>

        {/* Preferences & Activity Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200">
          <div>
            <h3 className="font-bold text-[#1A2A49] mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Settings size={17} className="text-[#F37021]" />
              Service Preferences
            </h3>
            <BookingPreferences />
          </div>

          <div>
            <h3 className="font-bold text-[#1A2A49] mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Clock size={17} className="text-[#F37021]" />
              Recent Activity
            </h3>
            <ActivityTimeline notifications={notifications || []} bookings={requests || []} />
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full mt-8 py-3.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm transition flex items-center justify-center gap-2"
        >
          <LogOut size={17} /> Sign Out of Pluggy
        </button>

        {/* Version */}
        <p className="text-center text-xs text-gray-400 mt-6">
          <Sparkles size={12} className="inline mr-1" />
          Pluggy v2.0 • Made with ❤️ in India
        </p>
      </div>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-[#1A2A49] mb-2">Sign Out?</h3>
              <p className="text-center text-gray-600 text-sm mb-6">Are you sure you want to sign out?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
