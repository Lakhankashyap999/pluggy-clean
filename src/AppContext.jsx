import { createContext, useContext, useEffect, useMemo, useState } from "react"

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // Global states
  const [user, setUser] = useState(null)          // logged-in user
  const [engineer, setEngineer] = useState(null)  // logged-in engineer
  const [requests, setRequests] = useState([])    // all users' service requests
  const [cart, setCart] = useState([])            // current user's cart items
  const [city, setCity] = useState(null)          // selected city or location

  // Load once from localStorage (persistence)
  useEffect(() => {
    try {
      const u  = JSON.parse(localStorage.getItem("pluggy_user") || "null")
      const e  = JSON.parse(localStorage.getItem("pluggy_engineer") || "null")
      const rq = JSON.parse(localStorage.getItem("pluggy_requests") || "[]")
      const ct = localStorage.getItem("pluggy_city") || null
      const ca = JSON.parse(localStorage.getItem("pluggy_cart") || "[]")

      if (u) setUser(u)
      if (e) setEngineer(e)
      setRequests(Array.isArray(rq) ? rq : [])
      setCart(Array.isArray(ca) ? ca : [])
      if (ct) setCity(ct)
    } catch {}
  }, [])

  // Persist on change
  useEffect(() => {
    if (user) localStorage.setItem("pluggy_user", JSON.stringify(user))
    else localStorage.removeItem("pluggy_user")
  }, [user])

  useEffect(() => {
    if (engineer) localStorage.setItem("pluggy_engineer", JSON.stringify(engineer))
    else localStorage.removeItem("pluggy_engineer")
  }, [engineer])

  useEffect(() => {
    localStorage.setItem("pluggy_requests", JSON.stringify(requests))
  }, [requests])

  useEffect(() => {
    localStorage.setItem("pluggy_cart", JSON.stringify(cart))
    // keep old components in sync (e.g., BottomNavbar)
    window.dispatchEvent(new Event("pluggy:cart-updated"))
  }, [cart])

  useEffect(() => {
    if (city) localStorage.setItem("pluggy_city", typeof city === "string" ? city : JSON.stringify(city))
  }, [city])

  // Helpers
  const loginUser = (u) => setUser(u)
  const logoutUser = () => { setUser(null); setCart([]) }

  const loginEngineer = (e) => setEngineer(e)
  const logoutEngineer = () => setEngineer(null)

  const addRequest = (req) => setRequests((prev) => [...prev, req])

  const addToCart = (items) => {
    setCart((prev) => {
      const next = [...prev]
      items.forEach((it) => {
        if (!next.find((x) => x.issue === it.issue)) next.push(it)
      })
      return next
    })
  }
  const removeFromCart = (issueName) =>
    setCart((prev) => prev.filter((i) => i.issue !== issueName))
  const clearCart = () => setCart([])

  const value = useMemo(() => ({
    // state
    user, engineer, requests, cart, city,
    // setters
    setUser, setEngineer, setRequests, setCart, setCity,
    // helpers
    loginUser, logoutUser, loginEngineer, logoutEngineer,
    addRequest, addToCart, removeFromCart, clearCart,
  }), [user, engineer, requests, cart, city])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>")
  return ctx
}
