import { createContext, useContext, useEffect, useState } from "react"

const AppContext = createContext()

export function AppProvider({ children }) {
  // 🌍 City selection
  const [city, setCity] = useState(localStorage.getItem("pluggy_city") || null)

  // 👤 Active logged-in user
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("pluggy_activeUser") || "null")
  )

  // 🛠️ Engineer state
  const [engineer, setEngineer] = useState(
    JSON.parse(localStorage.getItem("pluggy_engineer") || "null")
  )

  // 🛒 Cart state
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("pluggy_cart") || "[]")
  )

  // 📋 Requests state
  const [requests, setRequests] = useState(
    JSON.parse(localStorage.getItem("pluggy_requests") || "[]")
  )

  // 🏠 Address state
  const [address, setAddress] = useState(
    localStorage.getItem("pluggy_address") || ""
  )

  // 📌 Bookings state
  const [bookings, setBookings] = useState(
    JSON.parse(localStorage.getItem("pluggy_bookings") || "[]")
  )

  // 🌍 Update city
  useEffect(() => {
    if (city) localStorage.setItem("pluggy_city", city)
  }, [city])

  // 👤 Update active user
  useEffect(() => {
    if (user) {
      localStorage.setItem("pluggy_activeUser", JSON.stringify(user))
    } else {
      localStorage.removeItem("pluggy_activeUser")
    }
  }, [user])

  // 🛠️ Update engineer
  useEffect(() => {
    if (engineer) {
      localStorage.setItem("pluggy_engineer", JSON.stringify(engineer))
    } else {
      localStorage.removeItem("pluggy_engineer")
    }
  }, [engineer])

  // 🛒 Update cart
  useEffect(() => {
    localStorage.setItem("pluggy_cart", JSON.stringify(cart))
  }, [cart])

  // 📋 Update requests
  useEffect(() => {
    localStorage.setItem("pluggy_requests", JSON.stringify(requests))
  }, [requests])

  // 🏠 Update address
  useEffect(() => {
    if (address) {
      localStorage.setItem("pluggy_address", address)
    } else {
      localStorage.removeItem("pluggy_address")
    }
  }, [address])

  // 📌 Update bookings
  useEffect(() => {
    localStorage.setItem("pluggy_bookings", JSON.stringify(bookings))
  }, [bookings])

  // 🔑 Auth helpers
  const loginUser = (data) => setUser(data)
  const logoutUser = () => setUser(null)

  const loginEngineer = (data) => setEngineer(data)
  const logoutEngineer = () => setEngineer(null)

  // 🛒 Cart helpers
  const addToCart = (item) => {
    if (Array.isArray(item)) {
      setCart((prev) => [...prev, ...item])
    } else {
      setCart((prev) => [...prev, item])
    }
  }

  const removeFromCart = (issueName) => {
    setCart((prev) => prev.filter((item) => item.issue !== issueName))
  }

  const clearCart = () => {
    setCart([])
    localStorage.setItem("pluggy_cart", "[]")
  }

  // 📋 Request helpers
  const addRequest = (req) => {
    setRequests((prev) => {
      const updated = [...prev, req]
      localStorage.setItem("pluggy_requests", JSON.stringify(updated))
      return updated
    })
  }

  const updateRequestStatus = (id, newStatus) => {
    setRequests((prev) => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, status: newStatus } : r
      )
      localStorage.setItem("pluggy_requests", JSON.stringify(updated))
      return updated
    })
  }

  // 📌 Booking helper
  const addBooking = (booking) => {
    setBookings((prev) => [...prev, booking])
  }

  return (
    <AppContext.Provider
      value={{
        city,
        setCity,
        user,
        setUser,
        loginUser,
        logoutUser,
        engineer,
        setEngineer,
        loginEngineer,
        logoutEngineer,
        cart,
        setCart,
        addToCart,
        removeFromCart,
        clearCart,
        requests,
        setRequests,
        addRequest,
        updateRequestStatus,
        address,
        setAddress,
        bookings,
        addBooking,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
