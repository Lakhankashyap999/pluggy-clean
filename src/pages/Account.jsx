// src/pages/Account.jsx - COMPLETE WITH ALL SECTIONS
import { useState } from "react"
import { useApp } from "../AppContext"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Mail, Phone, Edit3, Share2, Settings, LogOut,
  ShoppingCart, Package, CheckCircle, Wallet,
  MapPin, Lock, Bell, CreditCard, Shield, Moon, Sun,
  Copy, Check, Sparkles, Gift, Clock,
  HelpCircle, ChevronDown, ChevronUp, Award,
  Wrench, TrendingUp, Plus, ArrowUpRight, ArrowDownLeft,
  Star, Zap, Crown, Dog, Car, History, Smartphone,
  MessageCircle, FileText, ExternalLink, ChevronRight,
  Home, Building
} from "lucide-react"
import toast from "react-hot-toast"
import BackButton from "../components/BackButton"

export default function Account() {
  const { user, logoutUser, theme, toggleTheme, cart, requests, bookings } = useApp()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [expandedSection, setExpandedSection] = useState("")
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F4F6F9] via-white to-[#EDF0F3] dark:from-[#0B1120] dark:via-[#1E293B] dark:to-[#0F172A] flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl p-8 text-center max-w-md"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#1A2A49] to-[#223a61] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <User size={36} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#1A2A49] dark:text-white mb-2">Login Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Please login to access your account</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3.5 bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
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

  const copyReferralCode = () => {
    const code = `PLUGGY${user.name?.substring(0, 4).toUpperCase() || 'USER'}${user.phone?.slice(-4) || '0000'}`
    navigator.clipboard?.writeText(code)
    setCopied(true)
    toast.success("Referral code copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  const referralCode = `PLUGGY${user.name?.substring(0, 4).toUpperCase() || 'USER'}${user.phone?.slice(-4) || '0000'}`
  const activeBookings = requests.filter(r => !["COMPLETED", "CANCELLED"].includes(r.status)).length
  const completedBookings = requests.filter(r => r.status === "COMPLETED").length
  const cartCount = cart.length

  const calculateStrength = () => {
    let strength = 0
    if (user.name) strength += 25
    if (user.email) strength += 25
    if (user.phone) strength += 25
    if (user.email && user.phone) strength += 25
    return strength
  }
  const profileStrength = calculateStrength()

  const sections = [
    { id: "wallet", label: "Wallet & Referral", icon: Wallet },
    { id: "badges", label: "Loyalty Badges", icon: Award },
    { id: "bookings", label: "Recent Bookings", icon: Package, badge: activeBookings },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
    { id: "notifications", label: "Notification Settings", icon: Bell },
    { id: "bookingPrefs", label: "Booking Preferences", icon: Calendar },
    { id: "security", label: "Security", icon: Shield },
    { id: "support", label: "Support", icon: HelpCircle },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F6F9] via-white to-[#EDF0F3] dark:from-[#0B1120] dark:via-[#1E293B] dark:to-[#0F172A] transition-colors duration-300">
      
      {/* Header */}
      <div className="relative bg-gradient-to-r from-[#1A2A49] to-[#223a61] dark:from-[#0F172A] dark:to-[#1E293B] pb-8 pt-4">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <BackButton />
            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className="p-2 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition">
                {theme === "dark" ? <Sun size={18} className="text-white" /> : <Moon size={18} className="text-white" />}
              </button>
              <button className="p-2 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition">
                <Settings size={18} className="text-white" />
              </button>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-[#F37021] to-[#FF8C42] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white/30">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle size={12} className="text-white" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <Sparkles size={18} className="text-yellow-400" />
                </div>
                <p className="text-white/80 text-sm flex items-center gap-1 mb-1"><Mail size={14} /> {user.email}</p>
                <p className="text-white/80 text-sm flex items-center gap-1"><Phone size={14} /> {user.phone || "Add phone number"}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => navigate("/account/edit")} className="p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition">
                  <Edit3 size={18} className="text-white" />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition">
                  <Share2 size={18} className="text-white" />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/80 text-xs">Profile Strength</span>
                <span className="text-white font-bold text-xs">{profileStrength}%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div className={`h-full rounded-full ${profileStrength === 100 ? "bg-green-400" : "bg-[#F37021]"}`} initial={{ width: 0 }} animate={{ width: `${profileStrength}%` }} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-4 pb-8">
        
        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: ShoppingCart, value: cartCount, label: "Cart", color: "from-blue-500 to-blue-600" },
              { icon: Package, value: activeBookings, label: "Active", color: "from-orange-500 to-orange-600" },
              { icon: CheckCircle, value: completedBookings, label: "Done", color: "from-green-500 to-green-600" },
              { icon: TrendingUp, value: "₹1250", label: "Saved", color: "from-purple-500 to-purple-600" },
            ].map((stat, i) => (
              <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-xl p-3 text-white shadow-lg`}>
                <stat.icon size={20} className="mb-2 opacity-80" />
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <div className="flex justify-around">
              {[
                { icon: Edit3, label: "Edit", path: "/account/edit" },
                { icon: MapPin, label: "Address", path: "/account/address" },
                { icon: CreditCard, label: "Payment", path: "/account/payment" },
                { icon: Shield, label: "Security", path: "/account/security" },
                { icon: Bell, label: "Notif", path: "/account/notifications" },
              ].map((action, i) => (
                <button key={i} onClick={() => navigate(action.path)} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                    <action.icon size={20} className="text-[#1A2A49] dark:text-[#F37021]" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Accordion Sections */}
        <div className="space-y-3">
          {sections.map((section) => (
            <motion.div key={section.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === section.id ? "" : section.id)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <section.icon size={20} className="text-[#1A2A49] dark:text-[#F37021]" />
                    <span className="font-semibold text-[#1A2A49] dark:text-white">{section.label}</span>
                    {section.badge > 0 && <span className="bg-[#F37021] text-white text-xs px-2 py-0.5 rounded-full">{section.badge}</span>}
                  </div>
                  {expandedSection === section.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                <AnimatePresence>
                  {expandedSection === section.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-gray-100 dark:border-gray-700">
                      <div className="p-5">
                        {section.id === "wallet" && <WalletReferralContent referralCode={referralCode} copied={copied} onCopy={copyReferralCode} />}
                        {section.id === "badges" && <BadgesContent completedCount={completedBookings} />}
                        {section.id === "bookings" && <BookingsContent bookings={bookings} navigate={navigate} />}
                        {section.id === "payment" && <PaymentContent />}
                        {section.id === "notifications" && <NotificationsContent />}
                        {section.id === "bookingPrefs" && <BookingPrefsContent />}
                        {section.id === "security" && <SecurityContent navigate={navigate} />}
                        {section.id === "support" && <SupportContent />}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Logout */}
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowLogoutModal(true)} className="w-full mt-6 py-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-2">
          <LogOut size={18} /> Logout
        </motion.button>
      </div>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 max-w-sm w-full">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LogOut size={28} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-center text-[#1A2A49] dark:text-white mb-2">Logout?</h3>
              <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-6">Are you sure you want to logout?</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold">Cancel</button>
                <button onClick={handleLogout} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold">Logout</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Content Components
function WalletReferralContent({ referralCode, copied, onCopy }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2"><Wallet size={18} className="text-[#F37021]" /><span className="font-medium">Wallet</span></div>
        <p className="text-2xl font-bold text-[#1A2A49] dark:text-white">₹250</p>
        <button className="mt-2 text-xs text-[#F37021] font-medium flex items-center gap-1"><Plus size={12} /> Add Money</button>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2"><Gift size={18} className="text-[#F37021]" /><span className="font-medium">Referral</span></div>
        <p className="text-sm font-mono font-bold text-[#1A2A49] dark:text-white">{referralCode}</p>
        <button onClick={onCopy} className="mt-2 text-xs text-[#F37021] font-medium flex items-center gap-1">{copied ? <Check size={12} /> : <Copy size={12} />} {copied ? "Copied!" : "Copy"}</button>
      </div>
    </div>
  )
}

function BadgesContent({ completedCount }) {
  const badges = [
    { name: "First Booking", earned: completedCount >= 1, icon: Star },
    { name: "5 Services", earned: completedCount >= 5, icon: Zap },
    { name: "10 Services", earned: completedCount >= 10, icon: Award },
    { name: "Premium", earned: completedCount >= 20, icon: Crown },
  ]
  return (
    <div className="flex gap-3">
      {badges.map((badge, i) => {
        const Icon = badge.icon
        return (
          <div key={i} className={`flex-1 aspect-square rounded-xl flex flex-col items-center justify-center ${badge.earned ? "bg-gradient-to-br from-[#1A2A49]/10 to-[#223a61]/10" : "bg-gray-100 dark:bg-gray-800/50 opacity-50"}`}>
            <Icon size={24} className={badge.earned ? "text-[#F37021]" : "text-gray-400"} />
            <span className="text-[10px] font-medium text-center mt-1">{badge.name}</span>
          </div>
        )
      })}
    </div>
  )
}

function BookingsContent({ bookings, navigate }) {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-6">
        <Package size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">No bookings yet</p>
        <button onClick={() => navigate("/book-service")} className="mt-3 bg-[#F37021] text-white px-4 py-2 rounded-full text-sm font-medium">Book Now</button>
      </div>
    )
  }
  return (
    <div className="space-y-3">
      {bookings.slice(0, 3).map((booking) => (
        <div key={booking.id} onClick={() => navigate("/account/track")} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 cursor-pointer">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Wrench size={16} className="text-[#F37021]" />
              <span className="font-medium text-[#1A2A49] dark:text-white">{booking.service || "Service"}</span>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">{booking.status || "PENDING"}</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{booking.date || "Today"} • {booking.timeSlot || "Flexible"}</p>
        </div>
      ))}
      <button onClick={() => navigate("/account/track")} className="w-full py-2 text-[#F37021] font-medium text-sm">View All →</button>
    </div>
  )
}

function PaymentContent() {
  return (
    <div className="space-y-2">
      {[
        { type: "upi", name: "Google Pay", detail: "rajesh@okhdfcbank" },
        { type: "card", name: "HDFC Credit Card", detail: "**** 4242" },
      ].map((m, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="flex items-center gap-3">
            {m.type === "upi" ? <Smartphone size={18} className="text-green-600" /> : <CreditCard size={18} className="text-blue-600" />}
            <div><p className="font-medium text-sm">{m.name}</p><p className="text-xs text-gray-500">{m.detail}</p></div>
          </div>
        </div>
      ))}
      <button className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-500 flex items-center justify-center gap-1"><Plus size={14} /> Add Method</button>
    </div>
  )
}

function NotificationsContent() {
  return (
    <div className="space-y-2">
      {[
        { label: "Push Notifications", enabled: true },
        { label: "Email Updates", enabled: true },
        { label: "SMS Alerts", enabled: false },
        { label: "WhatsApp", enabled: true },
      ].map((n, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <span className="text-sm font-medium">{n.label}</span>
          <div className={`w-10 h-5 rounded-full ${n.enabled ? "bg-[#F37021]" : "bg-gray-300"}`}>
            <div className={`w-4 h-4 bg-white rounded-full m-0.5 transition ${n.enabled ? "ml-5" : ""}`} />
          </div>
        </div>
      ))}
    </div>
  )
}

function BookingPrefsContent() {
  return (
    <div className="space-y-2">
      {[
        { icon: Dog, label: "Pet at home", enabled: false },
        { icon: Car, label: "Parking available", enabled: true },
      ].map((p, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="flex items-center gap-2"><p.icon size={16} className="text-gray-500" /><span className="text-sm">{p.label}</span></div>
          <div className={`w-10 h-5 rounded-full ${p.enabled ? "bg-[#F37021]" : "bg-gray-300"}`}>
            <div className={`w-4 h-4 bg-white rounded-full m-0.5 transition ${p.enabled ? "ml-5" : ""}`} />
          </div>
        </div>
      ))}
    </div>
  )
}

function SecurityContent({ navigate }) {
  return (
    <div className="space-y-2">
      {[
        { icon: Lock, label: "Change Password", path: "/account/password" },
        { icon: Shield, label: "Two-Factor Authentication", path: "/account/2fa" },
        { icon: History, label: "Login History", path: "/account/login-history" },
      ].map((s, i) => (
        <button key={i} onClick={() => navigate(s.path)} className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="flex items-center gap-2"><s.icon size={16} className="text-gray-500" /><span className="text-sm">{s.label}</span></div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      ))}
    </div>
  )
}

function SupportContent() {
  return (
    <div className="space-y-2">
      {[
        { icon: HelpCircle, label: "Help Center", desc: "FAQs and guides" },
        { icon: MessageCircle, label: "Live Chat", desc: "Usually replies in 5 mins", badge: "Online" },
        { icon: FileText, label: "Raise a Ticket", desc: "Get email support" },
        { icon: Phone, label: "Call Support", desc: "+91 98765 43210" },
      ].map((s, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div className="flex items-center gap-3">
            <s.icon size={18} className="text-gray-500" />
            <div><p className="font-medium text-sm">{s.label}</p><p className="text-xs text-gray-500">{s.desc}</p></div>
          </div>
          {s.badge && <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">{s.badge}</span>}
        </div>
      ))}
    </div>
  )
}

// Missing import
import { Calendar } from "lucide-react"