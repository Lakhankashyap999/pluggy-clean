import { useEffect, useState } from "react"
import { Home, Grid, ShoppingCart, User } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

export default function BottomNavbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const read = () => {
      try {
        const items = JSON.parse(localStorage.getItem("pluggy_cart") || "[]")
        setCartCount(Array.isArray(items) ? items.length : 0)
      } catch {
        setCartCount(0)
      }
    }
    read()
    const onStorage = (e) => {
      if (e.key === "pluggy_cart") read()
    }
    const onCustom = () => read()

    window.addEventListener("storage", onStorage)
    window.addEventListener("pluggy:cart-updated", onCustom)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("pluggy:cart-updated", onCustom)
    }
  }, [])

  const openCartPopup = () => {
    window.dispatchEvent(new Event("pluggy:open-cart"))
  }

  const navItems = [
    { id: "home", label: "Home", icon: Home, onTap: () => navigate("/") },
    { id: "services", label: "Services", icon: Grid, onTap: () => navigate("/services/ac-repair") },
    { id: "cart", label: "Cart", icon: ShoppingCart, onTap: openCartPopup },
    { id: "account", label: "Account", icon: User, onTap: () => navigate("/account") },
  ]

  return (
    <div className="sm:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[95%] max-w-md z-50">
      <div className="flex justify-around items-center py-2 rounded-2xl shadow-lg border border-gray-200 bg-white/90 backdrop-blur-md">
        {navItems.map((item) => {
          const isActive =
            (item.id === "home" && pathname === "/") ||
            (item.id !== "home" && pathname.startsWith(`/${item.id}`))

          return (
            <button
              key={item.id}
              onClick={item.onTap}
              className={`flex flex-col items-center text-xs transition ${
                isActive ? "text-[#1A2A49] font-semibold" : "text-gray-500"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <item.icon
                  size={24}
                  className={isActive ? "stroke-[#1A2A49]" : "stroke-gray-400"}
                />
                {item.id === "cart" && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="mt-0.5">{item.label}</span>
              {isActive && (
                <span className="mt-1 w-1.5 h-1.5 bg-[#1A2A49] rounded-full"></span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
