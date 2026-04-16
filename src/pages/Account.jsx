// src/pages/Account.jsx
import { useState } from "react"
import { useApp } from "../AppContext"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Mail, Phone, Edit3, LogOut, Package, Shield, MapPin, CreditCard,
  TicketPercent, Bell, Eye, HelpCircle, ChevronRight, Smartphone, Settings,
  Moon, Sun, Copy, Check, Sparkles, Heart, Clock, Award
} from "lucide-react"
import toast from "react-hot-toast"
import BackButton from "../components/BackButton"

export default function Account() {
  const { user, logoutUser, theme, toggleTheme, bookings, cart } = useApp()
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#1A2A49] to-[#223a61] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <User size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A2A49] mb-2">Login Required</h2>
          <p className="text-gray-600 mb-8">Please login to access your account</p>
          <button onClick={() => navigate("/login")} className="w-full py-3.5 bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white rounded-xl font-semibold">
            Login to Continue
          </button>
        </motion.div>
      </div>
    )
  }

  const handleLogout = () => {
    logoutUser()
    toast.success("Logged out successfully")
    navigate("/")
  }

  const activeBookings = bookings?.filter(b => !["COMPLETED", "CANCELLED"].includes(b.status)).length || 0

  // Amazon-style sections
  const sections = [
    {
      title: "My Bookings",
      subtitle: "Track active & past service requests",
      icon: Package,
      link: "/account/track",
      badge: activeBookings > 0 ? activeBookings : null,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Login & Security",
      subtitle: "Password, 2FA, privacy settings",
      icon: Shield,
      link: "/account/security",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Your Addresses",
      subtitle: "Home, Office, Other",
      icon: MapPin,
      link: "/account/address",
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Payment Methods",
      subtitle: "Saved cards & UPI",
      icon: CreditCard,
      link: "/account/payment",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Coupons",
      subtitle: "Available offers & discounts",
      icon: TicketPercent,
      link: "/account/coupons",
      color: "bg-pink-50 text-pink-600",
    },
    {
      title: "Notifications",
      subtitle: "Push, SMS, Email preferences",
      icon: Bell,
      link: "/account/notifications",
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Recently Viewed",
      subtitle: "Services you checked",
      icon: Eye,
      link: "/account/recent",
      color: "bg-cyan-50 text-cyan-600",
    },
    {
      title: "Help & Support",
      subtitle: "FAQs, Chat, Call us",
      icon: HelpCircle,
      link: "/account/support",
      color: "bg-red-50 text-red-600",
    },
  ]

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-inter">
      
      {/* ====== HEADER ====== */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <BackButton />
          <h2 className="text-lg font-bold text-[#1A2A49]">Your Account</h2>
          <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 rounded-full transition">
            {theme === "dark" ? <Sun size={20} className="text-gray-600" /> : <Moon size={20} className="text-gray-600" />}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* ====== PROFILE CARD - AMAZON STYLE ====== */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#1A2A49] to-[#F37021] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#1A2A49]">{user.name}</h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <Mail size={14} /> {user.email}
                </span>
                {user.phone && (
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Phone size={14} /> {user.phone}
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={() => navigate("/account/edit")}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition flex items-center gap-1"
            >
              <Edit3 size={14} /> Edit
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-[#F37021]" />
              <span className="text-sm text-gray-600">{activeBookings} Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={18} className="text-[#F37021]" />
              <span className="text-sm text-gray-600">Silver Member</span>
            </div>
          </div>
        </motion.div>

        {/* ====== AMAZON STYLE GRID SECTIONS ====== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(0,0,0,0.06)" }}
              onClick={() => navigate(section.link)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 cursor-pointer hover:border-[#F37021]/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${section.color} flex items-center justify-center group-hover:scale-110 transition`}>
                  <section.icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-[#1A2A49] text-base">{section.title}</h4>
                    {section.badge && (
                      <span className="bg-[#F37021] text-white text-xs px-2 py-0.5 rounded-full">{section.badge}</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-0.5">{section.subtitle}</p>
                </div>
                <ChevronRight size={20} className="text-gray-400 group-hover:text-[#F37021] group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ====== ADDITIONAL OPTIONS ====== */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div 
            onClick={() => navigate("/account/services")}
            className="flex items-center justify-between p-5 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-gray-500" />
              <span className="text-gray-700 font-medium">Account Settings</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
          <div 
            onClick={() => navigate("/account/password")}
            className="flex items-center justify-between p-5 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-gray-500" />
              <span className="text-gray-700 font-medium">Change Password</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
          <div 
            className="flex items-center justify-between p-5 hover:bg-gray-50 cursor-pointer"
            onClick={toggleTheme}
          >
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon size={20} className="text-gray-500" /> : <Sun size={20} className="text-gray-500" />}
              <span className="text-gray-700 font-medium">Dark Mode</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </motion.div>

        {/* ====== LOGOUT BUTTON ====== */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => setShowLogoutModal(true)}
          className="w-full mt-4 py-4 bg-white border border-red-200 rounded-xl text-red-600 font-medium hover:bg-red-50 transition flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> Sign Out
        </motion.button>

        {/* Version */}
        <p className="text-center text-xs text-gray-400 mt-6">Pluggy v1.0 • Made with ❤️ in India</p>
      </div>

      {/* ====== LOGOUT MODAL ====== */}
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
                <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-3 border border-gray-300 rounded-xl font-medium">Cancel</button>
                <button onClick={handleLogout} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium">Sign Out</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}