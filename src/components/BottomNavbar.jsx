import { Home, Grid, ShoppingCart, User } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useApp } from "../AppContext"

export default function BottomNavbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { cart } = useApp()

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
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
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
                isActive
                  ? "text-[#1A2A49] font-semibold"
                  : "text-gray-500"
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
  )
}
