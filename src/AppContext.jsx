// src/AppContext.jsx
import { createContext, useContext, useEffect, useState } from "react"
import toast from "react-hot-toast"

const AppContext = createContext()

const DEFAULT_NOTIFICATIONS = [
  {
    id: 101,
    type: "offer",
    title: "Welcome Offer Unlocked! 🎉",
    message: "Use code PLUGGY20 to get 20% OFF on your first service booking.",
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    time: "2 hours ago",
    read: false,
  },
  {
    id: 102,
    type: "service",
    title: "Same-Day Service Available",
    message: "Verified technicians are available in your area for instant booking.",
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    time: "Yesterday",
    read: true,
  },
]

export function AppProvider({ children }) {
  // 🌍 City selection
  const [city, setCity] = useState(localStorage.getItem("pluggy_city") || null)

  // 👤 Active logged-in user (support both pluggy_activeUser and legacy pluggy_user)
  const [user, setUser] = useState(() => {
    const active = localStorage.getItem("pluggy_activeUser")
    if (active && active !== "null") return JSON.parse(active)
    const legacy = localStorage.getItem("pluggy_user")
    if (legacy && legacy !== "null") return JSON.parse(legacy)
    return null
  })

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
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("pluggy_notifications")
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS
  })

  // 🕒 Recently viewed services state
  const [recent, setRecent] = useState(
    JSON.parse(localStorage.getItem("pluggy_recent") || "[]")
  )

  // 💰 Wallet state
  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem("pluggy_wallet_balance")
    return saved !== null ? Number(saved) : 150
  })

  const [walletTransactions, setWalletTransactions] = useState(() => {
    const saved = localStorage.getItem("pluggy_wallet_txs")
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, type: "credit", amount: 200, from: "Welcome & Referral Bonus", date: "Recent" },
          { id: 2, type: "debit", amount: 50, from: "Service Visit Discount", date: "Recent" },
        ]
  })

  // 🎟️ Applied Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(
    JSON.parse(localStorage.getItem("pluggy_applied_coupon") || "null")
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
      localStorage.setItem("pluggy_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("pluggy_activeUser")
      localStorage.removeItem("pluggy_user")
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

  // 🕒 Update recent
  useEffect(() => {
    localStorage.setItem("pluggy_recent", JSON.stringify(recent))
  }, [recent])

  // 💰 Update wallet
  useEffect(() => {
    localStorage.setItem("pluggy_wallet_balance", String(walletBalance))
  }, [walletBalance])

  useEffect(() => {
    localStorage.setItem("pluggy_wallet_txs", JSON.stringify(walletTransactions))
  }, [walletTransactions])

  // 🎟️ Update coupon
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem("pluggy_applied_coupon", JSON.stringify(appliedCoupon))
    } else {
      localStorage.removeItem("pluggy_applied_coupon")
    }
  }, [appliedCoupon])

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
  const updateUser = (patch) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), ...patch }
      const users = JSON.parse(localStorage.getItem("pluggy_users") || "[]")
      const idx = users.findIndex(
        (u) =>
          (u.id && updated.id && u.id === updated.id) ||
          (u.phone && updated.phone && u.phone === updated.phone) ||
          (u.email && updated.email && u.email === updated.email)
      )
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...updated }
        localStorage.setItem("pluggy_users", JSON.stringify(users))
      }
      return updated
    })
  }

  const logoutUser = () => {
    setUser(null)
    setCart([])
  }

  const loginEngineer = (data) => setEngineer(data)
  const logoutEngineer = () => setEngineer(null)

  const loginExecutive = (data) => setExecutive(data)
  const logoutExecutive = () => setExecutive(null)

  // 🕒 Recent helper
  const addRecent = (serviceName) => {
    if (!serviceName) return
    setRecent((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== serviceName.toLowerCase())
      return [serviceName, ...filtered].slice(0, 9)
    })
  }

  // 💰 Wallet helper
  const addWalletMoney = (amount, source = "Wallet Top-up") => {
    const num = Number(amount)
    if (!num || num <= 0) return
    setWalletBalance((prev) => prev + num)
    setWalletTransactions((prev) => [
      { id: Date.now(), type: "credit", amount: num, from: source, date: "Just now" },
      ...prev,
    ])
    toast.success(`₹${num} added to wallet!`)
  }

  // 🎟️ Coupon helper
  const applyCouponCode = (code) => {
    const clean = (code || "").trim().toUpperCase()
    const catalog = {
      PLUGGY20: { code: "PLUGGY20", type: "percent", value: 20, minAmount: 0, desc: "20% OFF on your booking" },
      PLUG20: { code: "PLUG20", type: "percent", value: 20, minAmount: 0, desc: "20% OFF on your first booking" },
      SUMMER25: { code: "SUMMER25", type: "percent", value: 25, minAmount: 299, desc: "25% Summer Special OFF" },
      SAVE100: { code: "SAVE100", type: "flat", value: 100, minAmount: 499, desc: "Flat ₹100 OFF above ₹499" },
    }
    if (!catalog[clean]) {
      toast.error("Invalid coupon code")
      return false
    }
    setAppliedCoupon(catalog[clean])
    toast.success(`Coupon ${clean} applied! 🎉`)
    return true
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    toast.success("Coupon removed")
  }

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

  // 🔔 Notification helpers
  const addNotification = (notification) => {
    const newNotif = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      createdAt: new Date().toISOString(),
      time: "Just now",
      read: false,
      ...notification,
    }
    setNotifications((prev) => [newNotif, ...prev])
  }

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  // 📋 Request helpers (normalized across all booking flows)
  const addRequest = (req) => {
    const validStatuses = [
      "PENDING_EXECUTIVE",
      "EXECUTIVE_VERIFIED",
      "ENGINEER_ASSIGNED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
    ]
    const normalizedStatus = validStatuses.includes(req.status)
      ? req.status
      : "PENDING_EXECUTIVE"

    const id = req.id || Date.now()
    const createdAt = req.createdAt || new Date().toISOString()
    const resolvedAddress = req.address || req.userAddress || address || "Not provided"

    const newRequest = {
      ...req,
      id,
      transactionId: req.transactionId || `PLG${String(id).slice(-8)}`,
      service: req.service || "Home Service",
      issue: req.issue || "General Service",
      address: resolvedAddress,
      userAddress: resolvedAddress,
      userName: req.userName || req.name || user?.name || "Customer",
      userPhone: req.userPhone || req.phone || user?.phone || "",
      userEmail: req.userEmail || req.email || user?.email || "",
      amount: Number(req.amount) || 0,
      status: normalizedStatus,
      createdAt,
      date:
        req.date ||
        new Date(createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    }

    setRequests((prev) => [newRequest, ...prev.filter((r) => r.id !== id)])
    setBookings((prev) => [newRequest, ...prev.filter((b) => b.id !== id)])

    addNotification({
      type: "service",
      title: "Booking Confirmed ✅",
      message: `Your request for ${newRequest.service} (${newRequest.transactionId}) has been received.`,
    })

    return newRequest
  }

  const updateRequestStatus = (id, newStatus) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    )
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    )

    const statusLabels = {
      EXECUTIVE_VERIFIED: "Confirmed by Executive",
      ENGINEER_ASSIGNED: "Engineer Assigned",
      IN_PROGRESS: "Service In Progress",
      COMPLETED: "Service Completed",
    }
    if (statusLabels[newStatus]) {
      addNotification({
        type: "update",
        title: statusLabels[newStatus],
        message: `Booking #${id} status updated to ${statusLabels[newStatus]}.`,
      })
    }
  }

  const rateRequest = (id, rating, review = "") => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, rating, review } : r))
    )
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, rating, review } : b))
    )
    toast.success("Thank you for your feedback! ⭐")
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
            cancelReason: reason,
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
      type: "update",
      title: "Booking Cancelled",
      message: `Booking #${requestId} has been cancelled.`,
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
    setBookings((prev) => [newBooking, ...prev.filter((b) => b.id !== newBooking.id)])
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
            assignedAt: new Date().toISOString(),
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
            assignedEngineerId: engineerId,
            assignedEngineer: engineerName,
          }
        }
        return b
      })
    )

    addNotification({
      type: "service",
      title: "Engineer Assigned 👨‍🔧",
      message: `${engineerName} has been assigned to your booking.`,
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
        updateUser,
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
        rateRequest,
        cancelRequest,
        address,
        setAddress,
        bookings,
        addBooking,
        notifications,
        setNotifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        recent,
        setRecent,
        addRecent,
        walletBalance,
        walletTransactions,
        addWalletMoney,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
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
