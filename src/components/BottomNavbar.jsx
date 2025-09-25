import { useEffect, useState } from "react"
import { Home, Grid, ShoppingCart, User } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useApp } from "../AppContext"
import { motion, AnimatePresence } from "framer-motion"

export default function BottomNavbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { cart } = useApp()

  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [servicesOpen, setServicesOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setVisible(false) // niche → hide
      } else {
        setVisible(true) // upar → show
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
    { id: "services", label: "Services", icon: Grid, onTap: () => setServicesOpen(true) },
    { id: "cart", label: "Cart", icon: ShoppingCart, onTap: openCartPopup },
    { id: "account", label: "Account", icon: User, onTap: () => navigate("/account") },
  ]

  // ✅ Services Data
  const servicesData = {
    AC: ["AC Repair", "AC Installation", "AC Gas Refill"],
    Wiring: ["House Wiring", "Short Circuit Fix", "Switchboard Repair"],
    Lighting: ["Tube Light Install", "LED Replacement", "Smart Light Setup"],
    Fan: ["Fan Motor Repair", "Ceiling Fan Installation", "Fan Regulator Fix"],
  }

  return (
    <>
      {/* ✅ Bottom Navbar (Mobile only) */}
      <div
        className={`sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 transform transition-transform duration-300 ${
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
              <button
                key={item.id}
                onClick={item.onTap}
                className={`flex flex-col items-center text-xs ${
                  isActive ? "text-[#1A2A49] font-semibold" : "text-gray-500"
                }`}
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
              </button>
            )
          })}
        </div>
      </div>

      {/* ✅ Services Drawer */}
      <AnimatePresence>
        {servicesOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-2xl z-50 max-h-[70vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-[#1A2A49]">Services</h2>
              <button
                onClick={() => setServicesOpen(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* Services List */}
            <div className="p-4 space-y-6">
              {Object.keys(servicesData).map((category) => (
                <div key={category}>
                  <h3 className="font-semibold text-[#1A2A49] mb-2">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {servicesData[category].map((service) => (
                      <div
                        key={service}
                        className="px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          navigate(
                            `/request/${service.replace(/\s+/g, "-").toLowerCase()}`
                          )
                          setServicesOpen(false)
                        }}
                      >
                        {service}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
