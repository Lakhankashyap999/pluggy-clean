// src/AppContext.jsx
import { createContext, useContext, useState, useEffect } from "react"

const AppContext = createContext()

export function AppProvider({ children }) {
  // ----------------- User -----------------
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("pluggy_user") || "null")
  )

  const loginUser = (data) => {
    setUser(data)
    localStorage.setItem("pluggy_user", JSON.stringify(data))
  }

  const logoutUser = () => {
    setUser(null)
    localStorage.removeItem("pluggy_user")
  }

  // ----------------- Engineer -----------------
  const [engineer, setEngineer] = useState(
    JSON.parse(localStorage.getItem("pluggy_engineer") || "null")
  )

  const loginEngineer = (data) => {
    setEngineer(data)
    localStorage.setItem("pluggy_engineer", JSON.stringify(data))
  }

  const logoutEngineer = () => {
    setEngineer(null)
    localStorage.removeItem("pluggy_engineer")
  }

  // ----------------- Cart -----------------
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("pluggy_cart") || "[]")
  )

  useEffect(() => {
    localStorage.setItem("pluggy_cart", JSON.stringify(cart))
  }, [cart])

  // ----------------- Requests -----------------
  const [requests, setRequestsState] = useState(
    JSON.parse(localStorage.getItem("pluggy_requests") || "[]")
  )

  const setRequests = (newReqs) => {
    setRequestsState(newReqs)
    localStorage.setItem("pluggy_requests", JSON.stringify(newReqs))
  }

  // ----------------- City -----------------
  const [city, setCity] = useState(
    localStorage.getItem("pluggy_city") || null
  )

  useEffect(() => {
    if (city) localStorage.setItem("pluggy_city", city)
  }, [city])

  // ----------------- Context Provider -----------------
  return (
    <AppContext.Provider
      value={{
        // User
        user,
        setUser,
        loginUser,
        logoutUser,

        // Engineer
        engineer,
        setEngineer,
        loginEngineer,
        logoutEngineer,

        // Cart
        cart,
        setCart,

        // Requests
        requests,
        setRequests,

        // City
        city,
        setCity,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
