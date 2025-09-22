import {
  Phone,
  User,
  LogOut,
  ShoppingCart,
  ListChecks,
  Bell,
  Menu,
  X,
} from "lucide-react"
import LoginPopup from "./Popup/LoginPopup"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import Cart from "./Cart"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate()
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const loadCart = () => {
      const saved = localStorage.getItem("pluggy_cart")
      if (saved) setCartItems(JSON.parse(saved))
      else setCartItems([])
    }
    loadCart()
    window.addEventListener("storage", loadCart)
    return () => window.removeEventListener("storage", loadCart)
  }, [])

  useEffect(() => {
    localStorage.setItem("pluggy_cart", JSON.stringify(cartItems))
  }, [cartItems])

  const handleRemove = (issue) => {
    const updated = cartItems.filter((i) => i.issue !== issue)
    setCartItems(updated)
  }

  return (
    <>
      {/* ✅ Top Navbar */}
      <nav className="bg-[#1A2A49] shadow-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-white">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/image/logos.png" alt="Pluggy" className="h-10 w-10 rounded-md" />
            <span className="text-xl font-extrabold">Pluggy</span>
          </Link>

          {/* Right: Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/account", { state: { tab: "track" } })}
              className="flex items-center gap-2 hover:text-gray-300"
            >
              <ListChecks size={18} /> My Requests
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 hover:text-gray-300"
            >
              <ShoppingCart size={18} /> My Cart ({cartItems.length})
            </button>
            <button
              onClick={() => navigate("/account", { state: { tab: "notifications" } })}
              className="flex items-center gap-2 hover:text-gray-300"
            >
              <Bell size={18} /> Notifications
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#1A2A49] rounded-lg shadow hover:bg-gray-100">
              <Phone size={16} /> Call us
            </button>
            {!user ? (
              <LoginPopup
                onLogin={(u) => {
                  setUser(u)
                  toast.success("Logged in successfully 🎉")
                }}
              />
            ) : (
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium">
                  <User size={18} />
                  <span className="font-semibold">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white text-black shadow-lg rounded-lg border hidden group-hover:block z-50">
                  <Link to="/account" className="block px-4 py-2 hover:bg-gray-100">
                    My Profile
                  </Link>
                  <div
                    className="px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      localStorage.removeItem("pluggy_user")
                      setUser(null)
                      toast.success("Logged out successfully ✅")
                      navigate("/")
                    }}
                  >
                    <LogOut size={16} /> Logout
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Mobile Menu Button */}
          <button
            className="md:hidden flex items-center"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* ✅ Animated Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
              className="fixed top-0 right-0 h-full w-3/4 sm:w-1/2 bg-white text-[#1A2A49] shadow-lg z-50 flex flex-col"
            >
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="text-lg font-bold">Menu</h2>
                <button onClick={() => setMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 px-6 py-4 space-y-4 text-lg font-medium">
                <button
                  onClick={() => {
                    navigate("/account", { state: { tab: "track" } })
                    setMenuOpen(false)
                  }}
                  className="w-full text-left hover:text-[#223a61]"
                >
                  📋 My Requests
                </button>
                <button
                  onClick={() => {
                    setCartOpen(true)
                    setMenuOpen(false)
                  }}
                  className="w-full text-left hover:text-[#223a61]"
                >
                  🛒 My Cart ({cartItems.length})
                </button>
                <button
                  onClick={() => {
                    navigate("/account", { state: { tab: "notifications" } })
                    setMenuOpen(false)
                  }}
                  className="w-full text-left hover:text-[#223a61]"
                >
                  🔔 Notifications
                </button>
                <button
                  onClick={() => (window.location.href = "tel:+911234567890")}
                  className="w-full text-left hover:text-[#223a61]"
                >
                  📞 Call Us
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ✅ Cart Popup */}
      <Cart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        labourCharge={50}
        discount={0}
        finalTotal={
          cartItems.reduce((sum, i) => sum + i.price, 0) +
          (cartItems.length > 0 ? 50 : 0)
        }
        onRemove={handleRemove}
        onProceed={() => navigate("/checkout")}
      />
    </>
  )
}
