import {
  Phone,
  User,
  LogOut,
  ShoppingCart,
  ListChecks,
  Bell,
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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const open = () => setCartOpen(true)
    window.addEventListener("pluggy:open-cart", open)
    return () => window.removeEventListener("pluggy:open-cart", open)
  }, [])

  const finalTotal =
    cart.reduce((sum, i) => sum + i.price, 0) + (cart.length > 0 ? 50 : 0)

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
    <>
      {/* ✅ Navbar (md+) with framer-motion entry */}
      <motion.nav
        variants={fadeDown}
        initial="hidden"
        animate="visible"
        className="hidden md:block bg-[#1A2A49] shadow-sm sticky top-0 z-50"
      >
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between text-white">
          <Link to="/" className="flex items-center gap-2">
            <motion.img
              src="/image/logos.png"
              alt="Pluggy"
              className="h-10 w-10 rounded-md"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            />
            <span className="text-xl font-extrabold">Pluggy</span>
          </Link>

          <div className="flex items-center gap-6">
            <motion.button
              onClick={() => navigate("/account", { state: { tab: "track" } })}
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
              <ShoppingCart size={18} /> My Cart ({cart.length})
            </motion.button>

            <motion.button
              onClick={() => navigate("/account", { state: { tab: "notifications" } })}
              className="flex items-center gap-2 hover:text-gray-300"
              whileTap={{ scale: 0.97 }}
            >
              <Bell size={18} /> Notifications
            </motion.button>

            <motion.a
              href="tel:+919876543210"
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#1A2A49] rounded-lg shadow hover:bg-gray-100"
              whileTap={{ scale: 0.97 }}
            >
              <Phone size={16} /> Call us
            </motion.a>

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
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm font-medium">
                  <User size={18} />
                  <span className="font-semibold">{user.name}</span>
                </button>

                {/* Dropdown animated */}
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      variants={pop}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 mt-2 w-56 bg-white text-black shadow-lg rounded-lg border z-50 overflow-hidden"
                    >
                      <Link
                        to="/account"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        My Profile
                      </Link>
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

      {/* ✅ Cart Popup (unchanged API, polish later in Part 2) */}
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
