import { useEffect, useState } from "react"
import { Home, Grid, ShoppingCart, User } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

export default function BottomNavbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [cartCount, setCartCount] = useState(0)

  // ✅ cart count sync (same-tab + cross-tab)
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

    // cross-tab updates
    const onStorage = (e) => {
      if (e.key === "pluggy_cart") read()
    }
    // same-tab custom updates
    const onCustom = () => read()

    window.addEventListener("storage", onStorage)
    window.addEventListener("pluggy:cart-updated", onCustom)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("pluggy:cart-updated", onCustom)
    }
  }, [])

  const openCartPopup = () => {
    // 👉 Navbar cart popup ko kholne ke liye event
    window.dispatchEvent(new Event("pluggy:open-cart"))
  }

  const navItems = [
    { id: "home", label: "Home", icon: Home, onTap: () => navigate("/") },
    { id: "services", label: "Services", icon: Grid, onTap: () => navigate("/services/ac-repair") },
    { id: "cart", label: "Cart", icon: ShoppingCart, onTap: openCartPopup },
    { id: "account", label: "Account", icon: User, onTap: () => navigate("/account") },
  ]

  return (
    // ✅ mobile-only
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive =
            (item.id === "home" && pathname === "/") ||
            (item.id !== "home" && pathname.startsWith(`/${item.id}`))

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
                {item.id === "cart" && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
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
