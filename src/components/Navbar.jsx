// src/components/Navbar.jsx
import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Phone, User, LogOut, ShoppingCart, MapPin, ChevronDown, Search, Bell } from "lucide-react"
import toast from "react-hot-toast"
import { useApp } from "../AppContext"
import Cart from "./Cart"
import LocationPopup from "./LocationPopup"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, logoutUser, cart, removeFromCart, city } = useApp()
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(null)
  const [locationOpen, setLocationOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const open = () => setCartOpen(true)
    window.addEventListener("pluggy:open-cart", open)
    return () => window.removeEventListener("pluggy:open-cart", open)
  }, [])

  const finalTotal = cart.reduce((sum, i) => sum + i.price, 0) + (cart.length > 0 ? 50 : 0)

  const handleRequireLogin = (callback) => {
    if (!user) {
      toast.error("Please log in first!")
      navigate("/login")
    } else {
      callback()
    }
  }

  return (
    <>
      <div className="sticky top-0 z-50">
        {/* ====== MOBILE NAVBAR - PROFESSIONAL & CLEAN ====== */}
        <div className="md:hidden bg-white border-b border-gray-200 safe-top">
          {/* Location Bar */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100">
            <button 
              onClick={() => setLocationOpen(true)}
              className="flex items-center gap-1 text-sm"
            >
              <MapPin size={16} className="text-[#F37021]" />
              <span className="font-medium text-gray-700 truncate max-w-[180px]">
                {city || "Select Location"}
              </span>
              <ChevronDown size={14} className="text-gray-400" />
            </button>
            
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/account/notifications")} className="relative">
                <Bell size={20} className="text-gray-700" />
              </button>
              <button onClick={() => navigate(user ? "/account" : "/login")}>
                <User size={20} className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 py-2">
            <button 
              onClick={() => setSearchOpen(true)}
              className="w-full flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5 text-gray-500"
            >
              <Search size={18} />
              <span className="text-sm">Search for services...</span>
            </button>
          </div>
        </div>

        {/* ====== DESKTOP NAVBAR ====== */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden md:block bg-[#1A2A49] shadow-md"
        >
          <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-white">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <motion.img
                src="/image/logos.png"
                alt="Pluggy"
                className="h-12 w-12 rounded-md filter brightness-0 invert"
              />
              <span className="text-xl font-extrabold tracking-wider font-poppins">Pluggy</span>
            </Link>

            {/* Desktop Navigation Items */}
            <div className="flex items-center gap-6 text-sm">
              {/* Location Selector */}
              <button 
                onClick={() => setLocationOpen(true)}
                className="flex items-center gap-1.5 text-white/90 hover:text-white transition px-3 py-1.5 rounded-full bg-white/10"
              >
                <MapPin size={16} className="text-[#F37021]" />
                <span className="font-medium">{city || "Select Location"}</span>
                <ChevronDown size={14} />
              </button>

              {user && (
                <>
                  <motion.button
                    onClick={() => navigate("/account/track")}
                    className="flex items-center gap-2 hover:text-gray-300 transition"
                    whileTap={{ scale: 0.97 }}
                  >
                    <ShoppingCart size={18} /> My Requests
                  </motion.button>

                  <motion.button
                    onClick={() => setCartOpen(true)}
                    className="flex items-center gap-2 hover:text-gray-300 transition relative"
                    whileTap={{ scale: 0.97 }}
                  >
                    <ShoppingCart size={18} /> Cart
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {cart.length}
                      </span>
                    )}
                  </motion.button>
                </>
              )}

              {!user ? (
                <motion.button
                  onClick={() => navigate("/login")}
                  className="px-4 py-1.5 bg-white text-[#1A2A49] rounded-full shadow hover:bg-gray-100 transition"
                  whileTap={{ scale: 0.97 }}
                >
                  Log in
                </motion.button>
              ) : (
                <div
                  className="relative"
                  onMouseEnter={() => setMenuOpen("user")}
                  onMouseLeave={() => setMenuOpen(null)}
                >
                  <button className="flex items-center gap-1 text-sm font-medium">
                    <User size={16} />
                    <span className="font-semibold">{user.name?.split(" ")[0]}</span>
                    <ChevronDown size={14} />
                  </button>
                  <AnimatePresence>
                    {menuOpen === "user" && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-xl border border-gray-100 z-50 overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            navigate("/account")
                            setMenuOpen(null)
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-2"
                        >
                          <User size={16} /> My Account
                        </button>
                        <button
                          onClick={() => {
                            navigate("/account/track")
                            setMenuOpen(null)
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition flex items-center gap-2"
                        >
                          <ShoppingCart size={16} /> My Requests
                        </button>
                        <div
                          className="px-4 py-3 text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2 transition"
                          onClick={() => {
                            logoutUser()
                            toast.success("Logged out successfully ✅")
                            navigate("/")
                            setMenuOpen(null)
                          }}
                        >
                          <LogOut size={16} /> Logout
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </motion.nav>
      </div>

      {/* ====== SEARCH DRAWER (MOBILE) ====== */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-end md:hidden"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-3xl w-full p-5 shadow-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[#1A2A49]">Search Services</h3>
                <button onClick={() => setSearchOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <span className="text-gray-500 text-xl">✕</span>
                </button>
              </div>
              
              <div className="relative mb-4">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="AC repair, fan, wiring..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F37021] text-base"
                  autoFocus
                />
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500 mb-2">Popular Searches</p>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-xl">AC Repair</button>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-xl">Fan Motor</button>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-xl">Wiring</button>
                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-xl">Geyser Repair</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== LOCATION POPUP ====== */}
      <LocationPopup 
        open={locationOpen} 
        onClose={() => setLocationOpen(false)} 
        onSelect={() => setLocationOpen(false)}
      />

      {/* ====== CART POPUP ====== */}
      <Cart
        open={cartOpen && !!user}
        onClose={() => setCartOpen(false)}
        items={cart}
        labourCharge={cart.length > 0 ? 50 : 0}
        discount={0}
        finalTotal={finalTotal}
        onRemove={removeFromCart}
        onProceed={() => handleRequireLogin(() => navigate("/request/ac-repair"))}
      />
    </>
  )
}