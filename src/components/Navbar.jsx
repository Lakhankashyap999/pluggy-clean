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

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate()
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [mobileOpen, setMobileOpen] = useState(false)

  // ✅ Load + Sync cart
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
      <nav className="bg-[#1A2A49] shadow-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between text-white">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/image/logos.png" alt="Pluggy" className="h-10 w-10 rounded-md" />
            <span className="text-xl font-extrabold">Pluggy</span>
          </Link>

          {/* Desktop Menu */}
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

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-[#1A2A49] text-white px-6 py-4 space-y-4">
            <button
              onClick={() => navigate("/account", { state: { tab: "track" } })}
              className="flex items-center gap-2 w-full text-left hover:text-gray-300"
            >
              <ListChecks size={18} /> My Requests
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 w-full text-left hover:text-gray-300"
            >
              <ShoppingCart size={18} /> My Cart ({cartItems.length})
            </button>

            <button
              onClick={() => navigate("/account", { state: { tab: "notifications" } })}
              className="flex items-center gap-2 w-full text-left hover:text-gray-300"
            >
              <Bell size={18} /> Notifications
            </button>

            <button className="flex items-center gap-2 w-full text-left px-4 py-2 bg-white text-[#1A2A49] rounded-lg shadow hover:bg-gray-100">
              <Phone size={16} /> Call us
            </button>

            {!user ? (
              <LoginPopup
                onLogin={(u) => {
                  setUser(u)
                  toast.success("Logged in successfully 🎉")
                  setMobileOpen(false)
                }}
              />
            ) : (
              <div>
                <Link
                  to="/account"
                  className="block px-4 py-2 hover:bg-gray-100 bg-white text-black rounded"
                  onClick={() => setMobileOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("pluggy_user")
                    setUser(null)
                    toast.success("Logged out successfully ✅")
                    navigate("/")
                    setMobileOpen(false)
                  }}
                  className="mt-2 px-4 py-2 w-full bg-red-600 text-white rounded"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Cart Popup */}
      <Cart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        labourCharge={50}
        discount={0}
        finalTotal={cartItems.reduce((sum, i) => sum + i.price, 0) + (cartItems.length > 0 ? 50 : 0)}
        onRemove={handleRemove}
        onProceed={() => navigate("/checkout")}
      />
    </>
  )
}
