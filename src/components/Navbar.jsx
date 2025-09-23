import {
  Phone, User, LogOut, ShoppingCart, ListChecks, Bell,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import Cart from "./Cart"
import { useEffect, useState } from "react"
import { useApp } from "../AppContext"

export default function Navbar() {
  const navigate = useNavigate()
  const { user, logoutUser, cart, removeFromCart } = useApp()
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    const open = () => setCartOpen(true)
    window.addEventListener("pluggy:open-cart", open)
    return () => window.removeEventListener("pluggy:open-cart", open)
  }, [])

  const finalTotal =
    cart.reduce((sum, i) => sum + i.price, 0) + (cart.length > 0 ? 50 : 0)

  return (
    <>
      <nav className="bg-[#1A2A49] shadow-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-white">
          <Link to="/" className="flex items-center gap-2">
            <img src="/image/logos.png" alt="Pluggy" className="h-10 w-10 rounded-md" />
            <span className="text-xl font-extrabold">Pluggy</span>
          </Link>

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
              <ShoppingCart size={18} /> My Cart ({cart.length})
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
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-white text-[#1A2A49] rounded-lg shadow hover:bg-gray-100"
              >
                Log in
              </button>
            ) : (
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium">
                  <User size={18} />
                  <span className="font-semibold">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white text-black shadow-lg rounded-lg border hidden group-hover:block z-50">
                  <Link to="/account" className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
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
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

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
    </>
  )
}
