// src/AppContext.jsx
import { createContext, useContext, useEffect, useState } from "react"
import toast from "react-hot-toast"

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

  // 👔 Executive state
  const [executive, setExecutive] = useState(
    JSON.parse(localStorage.getItem("pluggy_executive") || "null")
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

  // 📌 Bookings state (user view)
  const [bookings, setBookings] = useState(
    JSON.parse(localStorage.getItem("pluggy_bookings") || "[]")
  )

  // 🔔 Notifications state
  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("pluggy_notifications") || "[]")
  )

  // 🎨 Theme state
  const [theme, setTheme] = useState(
    localStorage.getItem("pluggy_theme") || "light"
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

  // 👔 Update executive
  useEffect(() => {
    if (executive) {
      localStorage.setItem("pluggy_executive", JSON.stringify(executive))
    } else {
      localStorage.removeItem("pluggy_executive")
    }
  }, [executive])

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

  // 🔔 Update notifications
  useEffect(() => {
    localStorage.setItem("pluggy_notifications", JSON.stringify(notifications))
  }, [notifications])

  // 🎨 Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("pluggy_theme", newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Initialize theme on load
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    }
  }, [])

  // 🔑 Auth helpers
  const loginUser = (data) => setUser(data)
  const logoutUser = () => {
    setUser(null)
    setBookings([])
    setRequests([])
    setCart([])
    setNotifications([])
  }

  const loginEngineer = (data) => setEngineer(data)
  const logoutEngineer = () => setEngineer(null)

  const loginExecutive = (data) => setExecutive(data)
  const logoutExecutive = () => setExecutive(null)

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
    const newRequest = {
      ...req,
      id: req.id || Date.now(),
      createdAt: req.createdAt || new Date().toISOString(),
    }
    setRequests((prev) => [...prev, newRequest])
  }

  const updateRequestStatus = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    )
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    )
  }

  // ❌ Cancel Request
  const cancelRequest = (requestId, reason = "User cancelled") => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            status: "CANCELLED",
            cancelledAt: new Date().toISOString(),
            cancelReason: reason
          }
        }
        return r
      })
    )

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === requestId) {
          return { ...b, status: "CANCELLED" }
        }
        return b
      })
    )

    addNotification({
      id: Date.now(),
      type: "CANCELLED",
      title: "Booking Cancelled",
      message: `Booking #${requestId} has been cancelled.`,
      createdAt: new Date().toISOString(),
      read: false
    })

    toast.success("Request cancelled successfully")
  }

  // 📌 Booking helper
  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: booking.id || Date.now(),
      createdAt: booking.createdAt || new Date().toISOString(),
    }
    setBookings((prev) => [...prev, newBooking])
  }

  // 🔔 Notification helpers
  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev])
  }

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  // 👔 Assign Engineer
  const assignEngineer = (requestId, engineerId, engineerName) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            status: "ENGINEER_ASSIGNED",
            assignedEngineerId: engineerId,
            assignedEngineer: engineerName,
            assignedAt: new Date().toISOString()
          }
        }
        return r
      })
    )

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === requestId) {
          return {
            ...b,
            status: "ENGINEER_ASSIGNED",
            assignedEngineer: engineerName
          }
        }
        return b
      })
    )

    addNotification({
      id: Date.now(),
      type: "ASSIGNED",
      title: "Engineer Assigned",
      message: `${engineerName} has been assigned to your booking.`,
      createdAt: new Date().toISOString(),
      read: false
    })

    toast.success(`Engineer ${engineerName} assigned!`)
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
        executive,
        setExecutive,
        loginExecutive,
        logoutExecutive,
        cart,
        setCart,
        addToCart,
        removeFromCart,
        clearCart,
        requests,
        setRequests,
        addRequest,
        updateRequestStatus,
        cancelRequest,
        address,
        setAddress,
        bookings,
        addBooking,
        notifications,
        addNotification,
        markNotificationRead,
        clearNotifications,
        assignEngineer,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)