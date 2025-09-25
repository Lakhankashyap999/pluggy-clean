import { useEffect, useState } from "react"
import { Home, Grid, ShoppingCart, User } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useApp } from "../AppContext"
import { motion } from "framer-motion"

export default function BottomNavbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { cart } = useApp()

  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setVisible(false)
      } else {
        setVisible(true)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const openCartPopup = () => {
    window.dispatchEvent(new Event("pluggy:open-cart"))
  }

  const navItems = [
    { id: "home", label: "Home", icon: Home, onTap: () => navigate("/") },
    { id: "services", label: "Services", icon: Grid, onTap: () => navigate("/services/ac-repair") },
    { id: "cart", label: "Cart", icon: ShoppingCart, onTap: openCartPopup },
    { id: "account", label: "Account", icon: User, onTap: () => navigate("/account") },
  ]

  const container = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.25 } },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      className={`sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive =
            (item.id === "home" && pathname === "/") ||
            (item.id === "services" && pathname.startsWith("/services")) ||
            (item.id === "account" && pathname.startsWith("/account")) ||
            (item.id === "cart" && pathname.startsWith("/cart"))

          return (
            <motion.button
              key={item.id}
              onClick={item.onTap}
              className={`flex flex-col items-center text-xs ${
                isActive ? "text-[#1A2A49] font-semibold" : "text-gray-500"
              }`}
              whileTap={{ scale: 0.92 }}
            >
              <div className="relative">
                <item.icon size={22} />
                {item.id === "cart" && cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </div>
              {item.label}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
