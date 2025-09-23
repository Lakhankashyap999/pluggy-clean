// src/AppContext.jsx
import { createContext, useContext, useState, useEffect } from "react"

const AppContext = createContext()

export function AppProvider({ children }) {
  // ✅ User state
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("pluggy_user") || "null")
  )

  // ✅ Engineer state
  const [engineer, setEngineer] = useState(
    JSON.parse(localStorage.getItem("pluggy_engineer") || "null")
  )

  // ✅ Cart
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("pluggy_cart") || "[]")
  )

  // ✅ Requests
  const [requests, setRequestsState] = useState(
    JSON.parse(localStorage.getItem("pluggy_requests") || "[]")
  )

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("pluggy_user", JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem("pluggy_engineer", JSON.stringify(engineer))
  }, [engineer])

  useEffect(() => {
    localStorage.setItem("pluggy_cart", JSON.stringify(cart))
  }, [cart])

  const setRequests = (newReqs) => {
    setRequestsState(newReqs)
    localStorage.setItem("pluggy_requests", JSON.stringify(newReqs))
  }

  // ✅ Logout functions
  const logoutUser = () => {
    setUser(null)
    localStorage.removeItem("pluggy_user")
  }

  const logoutEngineer = () => {
    setEngineer(null)
    localStorage.removeItem("pluggy_engineer")
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        logoutUser,
        engineer,
        setEngineer,
        logoutEngineer,
        cart,
        setCart,
        requests,
        setRequests,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
