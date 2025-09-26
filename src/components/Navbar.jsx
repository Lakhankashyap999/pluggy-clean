import {
  Phone,
  User,
  LogOut,
  ShoppingCart,
  ListChecks,
  Bell,
  ChevronRight,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import Cart from "./Cart"
import { useEffect, useState } from "react"
import { useApp } from "../AppContext"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const navigate = useNavigate()
  const { user, logoutUser, cart, removeFromCart } = useApp()
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)

  useEffect(() => {
    const open = () => setCartOpen(true)
    window.addEventListener("pluggy:open-cart", open)
    return () => window.removeEventListener("pluggy:open-cart", open)
  }, [])

  const finalTotal =
    cart.reduce((sum, i) => sum + i.price, 0) + (cart.length > 0 ? 50 : 0)

  const servicesData = {
    AC: ["AC Repair", "AC Installation", "AC Gas Refill"],
    Wiring: ["House Wiring", "Short Circuit Fix", "Switchboard Repair"],
    Lighting: ["Tube Light Install", "LED Replacement", "Smart Light Setup"],
    Fan: ["Fan Motor Repair", "Ceiling Fan Installation", "Fan Regulator Fix"],
    Appliances: ["Geyser Repair", "Fridge Service", "Washing Machine Repair"],
  }

  const fadeDown = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.35 } },
  }

  const pop = {
    hidden: { opacity: 0, scale: 0.96, y: -6 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.18 } },
    exit: { opacity: 0, scale: 0.96, y: -6, transition: { duration: 0.15 } },
  }

  return (
    <div className="sticky top-0 z-50">
      {/* ✅ Mobile Navbar */}
      <div className="md:hidden bg-[#1A2A49] text-white flex items-center justify-between px-4 py-3 shadow">
        <div className="flex items-center gap-2">
          <img
            src="/image/logos.png"
            alt="Pluggy"
            className="h-7 w-7 object-contain filter brightness-0 invert"
          />
          <span className="text-lg font-bold">Pluggy</span>
        </div>
        <div className="text-sm font-medium">{user?.name || "Guest"}</div>
      </div>

      {/* ✅ Desktop Navbar */}
      <motion.nav
        variants={fadeDown}
        initial="hidden"
        animate="visible"
        className="hidden md:block bg-[#1A2A49] shadow-sm"
      >
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-white">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.img
              src="/image/logos.png"
              alt="Pluggy"
              className="h-12 w-12 rounded-md filter brightness-0 invert"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            />
            <span className="text-xl font-extrabold">Pluggy</span>
          </Link>

          {/* Menu Items */}
          <div className="flex items-center gap-6">
            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setMenuOpen("services")}
              onMouseLeave={() => {
                setMenuOpen(null)
                setActiveCategory(null)
              }}
            >
              <button className="flex items-center gap-2 hover:text-gray-300">
                Services
              </button>
              <AnimatePresence>
                {menuOpen === "services" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 top-full mt-2 bg-white text-black shadow-lg rounded-lg border z-50 flex"
                  >
                    {/* Categories */}
                    <div className="w-48 border-r">
                      {Object.keys(servicesData).map((category) => (
                        <div
                          key={category}
                          className={`flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                            activeCategory === category ? "bg-gray-100" : ""
                          }`}
                          onMouseEnter={() => setActiveCategory(category)}
                        >
                          <span>{category}</span>
                          <ChevronRight size={16} className="text-gray-500" />
                        </div>
                      ))}
                    </div>

                    {/* Issues */}
                    {activeCategory && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="w-64"
                      >
                        {servicesData[activeCategory].map((item) => (
                          <div
                            key={item}
                            className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              navigate(
                                `/request/${item.replace(/\s+/g, "-").toLowerCase()}`
                              )
                              setMenuOpen(null)
                              setActiveCategory(null)
                            }}
                          >
                            <span>{item}</span>
                            <ChevronRight size={14} className="text-gray-400" />
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* My Requests */}
            <motion.button
              onClick={() => navigate("/account/track")}
              className="flex items-center gap-2 hover:text-gray-300"
              whileTap={{ scale: 0.97 }}
            >
              <ListChecks size={18} /> My Requests
            </motion.button>

            {/* My Cart */}
            <motion.button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 hover:text-gray-300"
              whileTap={{ scale: 0.97 }}
            >
              <ShoppingCart size={18} /> My Cart ({cart.length})
            </motion.button>

            {/* Notifications */}
            <motion.button
              onClick={() => navigate("/account/notifications")}
              className="flex items-center gap-2 hover:text-gray-300"
              whileTap={{ scale: 0.97 }}
            >
              <Bell size={18} /> Notifications
            </motion.button>

            {/* Call Us */}
            <motion.a
              href="tel:+919876543210"
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#1A2A49] rounded-lg shadow hover:bg-gray-100"
              whileTap={{ scale: 0.97 }}
            >
              <Phone size={16} /> Call us
            </motion.a>

            {/* User Menu */}
            {!user ? (
              <motion.button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-white text-[#1A2A49] rounded-lg shadow hover:bg-gray-100"
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
                  <User size={18} />
                  <span className="font-semibold">{user.name}</span>
                </button>

                <AnimatePresence>
                  {menuOpen === "user" && (
                    <motion.div
                      variants={pop}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-56 bg-white text-black shadow-lg rounded-lg border z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          navigate("/account")
                          setMenuOpen(null)
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        My Account
                      </button>
                      <div
                        className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={() => {
                          logoutUser()
                          toast.success("Logged out successfully ✅")
                          navigate("/")
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

      {/* ✅ Cart Popup */}
      <Cart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        labourCharge={cart.length > 0 ? 50 : 0}
        discount={0}
        finalTotal={finalTotal}
        onRemove={removeFromCart}
        onProceed={() => navigate("/request/ac-repair")}
      />
    </div>
  )
}
