// src/components/Navbar.jsx
import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Phone, User, LogOut, ShoppingCart, ListChecks, Bell } from "lucide-react"
import toast from "react-hot-toast"
import { useApp } from "../AppContext"
import Cart from "./Cart"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, logoutUser, cart, removeFromCart } = useApp()
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(null)

  useEffect(() => {
    const open = () => setCartOpen(true)
    window.addEventListener("pluggy:open-cart", open)
    return () => window.removeEventListener("pluggy:open-cart", open)
  }, [])

  const finalTotal =
    cart.reduce((sum, i) => sum + i.price, 0) + (cart.length > 0 ? 50 : 0)

  // ✅ Show login alert if user tries to access cart or requests
  const handleRequireLogin = (callback) => {
    if (!user) {
      toast.error("Please log in first!")
    } else {
      callback()
    }
  }

  return (
    <div className="sticky top-0 z-50">
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-[#1A2A49] text-white flex items-center justify-between px-3 py-2 shadow">
        <div className="flex items-center gap-1">
          <img
            src="/image/logos.png"
            alt="Pluggy"
            className="h-5 w-5 object-contain brightness-0 invert"
          />
          <span className="text-sm font-bold tracking-wide">Pluggy</span>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/account")}
            className="relative text-white p-1"
          >
            <User size={16} />
          </motion.button>
          <motion.a
            whileTap={{ scale: 0.9 }}
            href="tel:+919876543210"
            className="relative text-white p-1"
          >
            <Phone size={16} />
          </motion.a>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleRequireLogin(() => setCartOpen(true))}
            className="relative text-white p-1"
          >
            <ShoppingCart size={16} />
            {cart.length > 0 && user && (
              <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 rounded-full px-1">
                {cart.length}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Desktop Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:block bg-[#1A2A49] shadow-sm"
      >
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-white">
          <Link to="/" className="flex items-center gap-2">
            <motion.img
              src="/image/logos.png"
              alt="Pluggy"
              className="h-12 w-12 rounded-md filter brightness-0 invert"
            />
            <span className="text-xl font-extrabold tracking-wider">Pluggy</span>
          </Link>

          {/* Menu Items */}
          <div className="flex items-center gap-6 text-sm">
            {/* Only show these if user is logged in */}
            {user && (
              <>
                <motion.button
                  onClick={() => navigate("/account/track")}
                  className="flex items-center gap-2 hover:text-gray-300"
                  whileTap={{ scale: 0.97 }}
                >
                  <ListChecks size={18} /> My Requests
                </motion.button>

                <motion.button
                  onClick={() => setCartOpen(true)}
                  className="flex items-center gap-2 hover:text-gray-300"
                  whileTap={{ scale: 0.97 }}
                >
                  <ShoppingCart size={18} /> Cart ({cart.length})
                </motion.button>
              </>
            )}

            {!user ? (
              <motion.button
                onClick={() => navigate("/login")}
                className="px-3 py-1 bg-white text-[#1A2A49] rounded-lg shadow hover:bg-gray-100"
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
                  <span className="font-semibold">{user.name}</span>
                </button>
                <AnimatePresence>
                  {menuOpen === "user" && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg border z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => navigate("/account")}
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

      {/* Cart Popup */}
      <Cart
        open={cartOpen && !!user}
        onClose={() => setCartOpen(false)}
        items={cart}
        labourCharge={cart.length > 0 ? 50 : 0}
        discount={0}
        finalTotal={finalTotal}
        onRemove={removeFromCart}
        onProceed={() =>
          handleRequireLogin(() => navigate("/request/ac-repair"))
        }
      />
    </div>
  )
}
