// src/AppContext.jsx
import { createContext, useContext, useState, useEffect, useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import toast from "react-hot-toast"
import {
  loadSqlDatabase,
  saveSqlDatabase,
  subscribeToSqlChanges,
  executeSqlQuery,
  resetSqlDatabaseToSeed,
} from "./lib/sqlDatabase"

const AppContext = createContext()

const DEFAULT_COUPONS = {
  PLUGGY20: { code: "PLUGGY20", type: "percent", value: 20, label: "20% OFF" },
  PLUG20: { code: "PLUG20", type: "percent", value: 20, label: "20% OFF" },
  SUMMER25: { code: "SUMMER25", type: "percent", value: 25, label: "25% OFF" },
  SAVE100: { code: "SAVE100", type: "flat", value: 100, label: "₹100 OFF" },
}

export function AppProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Load initial SQL relational database
  const initialSql = loadSqlDatabase()

  // User State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("pluggy_activeUser") || localStorage.getItem("pluggy_user")
    return saved ? JSON.parse(saved) : null
  })

  // Engineer State
  const [engineer, setEngineer] = useState(() => {
    const saved = localStorage.getItem("pluggy_engineer")
    return saved ? JSON.parse(saved) : null
  })

  // Admin / Executive State (requires explicit login)
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem("pluggy_admin")
    return saved ? JSON.parse(saved) : null
  })

  // SQL Tables State (Synced Across All Portals & Tabs)
  const [usersList, setUsersList] = useState(() => initialSql.users)
  const [engineersList, setEngineersList] = useState(() => initialSql.engineers)
  const [requests, setRequests] = useState(() => {
    const savedReqs = localStorage.getItem("pluggy_requests")
    if (savedReqs) {
      const parsed = JSON.parse(savedReqs)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
    return initialSql.service_requests
  })
  const [bookings, setBookings] = useState(() => requests)
  const [paymentTransactions, setPaymentTransactions] = useState(
    () => initialSql.payment_transactions
  )
  const [orderHistoryLogs, setOrderHistoryLogs] = useState(() => initialSql.order_history_logs)

  // Cart State (only kept for a logged-in customer)
  const [cart, setCart] = useState(() => {
    const hasUser = localStorage.getItem("pluggy_activeUser") || localStorage.getItem("pluggy_user")
    if (!hasUser) return []
    const saved = localStorage.getItem("pluggy_cart")
    return saved ? JSON.parse(saved) : []
  })

  // Recently Viewed Services State
  const [recent, setRecent] = useState(() => {
    const saved = localStorage.getItem("pluggy_recent")
    return saved
      ? JSON.parse(saved)
      : ["Foam-Jet Power AC Service", "Single / Double Pole MCB Replacement"]
  })

  // Applied Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const saved = localStorage.getItem("pluggy_coupon")
    return saved ? JSON.parse(saved) : null
  })

  // Wallet Balance & Transactions
  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem("pluggy_wallet_balance")
    return saved ? Number(saved) : 250
  })

  const [walletTransactions, setWalletTransactions] = useState(() => {
    const saved = localStorage.getItem("pluggy_wallet_txns")
    return saved
      ? JSON.parse(saved)
      : [
          { type: "credit", amount: 200, from: "Pluggy Welcome Bonus", date: "Today" },
          { type: "credit", amount: 100, from: "Referral Reward", date: "Yesterday" },
          { type: "debit", amount: 50, from: "AC Inspection Cashback Used", date: "3 days ago" },
        ]
  })

  // Customer Preferences
  const [userPreferences, setUserPreferences] = useState(() => {
    const saved = localStorage.getItem("pluggy_preferences")
    return saved
      ? JSON.parse(saved)
      : {
          pet: false,
          parking: true,
          bringLadder: true,
          preferredTime: "morning",
        }
  })

  // City & Address
  const [city, setCity] = useState(() => {
    return localStorage.getItem("pluggy_city") || "Hapur / Delhi NCR"
  })

  const [address, setAddress] = useState(() => {
    return localStorage.getItem("pluggy_address") || ""
  })

  const [savedAddresses, setSavedAddresses] = useState(() => {
    const saved = localStorage.getItem("pluggy_saved_addresses")
    return saved ? JSON.parse(saved) : []
  })

  // Notifications
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("pluggy_notifications")
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            type: "service",
            title: "Welcome to Pluggy 2.0!",
            message:
              "15-Min Emergency SOS, Official Spare Parts Rate Card & 30-Day Warranty are now live.",
            time: "Just now",
            read: false,
            createdAt: new Date().toISOString(),
          },
        ]
  })

  const [theme, setTheme] = useState("light")

  // Persist SQL Relational Tables whenever core entities change
  const syncTablesToSql = (nextOverrides = {}) => {
    const currentDb = loadSqlDatabase()
    const mergedDb = {
      ...currentDb,
      users: nextOverrides.users ?? usersList,
      engineers: nextOverrides.engineers ?? engineersList,
      service_requests: nextOverrides.service_requests ?? requests,
      payment_transactions: nextOverrides.payment_transactions ?? paymentTransactions,
      order_history_logs: nextOverrides.order_history_logs ?? orderHistoryLogs,
    }
    saveSqlDatabase(mergedDb)
  }

  // Subscribe to real-time SQL updates from other browser tabs (Customer <-> Admin <-> Engineer)
  useEffect(() => {
    const unsubscribe = subscribeToSqlChanges((freshDb) => {
      setUsersList(freshDb.users || [])
      setEngineersList(freshDb.engineers || [])
      setRequests(freshDb.service_requests || [])
      setBookings(freshDb.service_requests || [])
      setPaymentTransactions(freshDb.payment_transactions || [])
      setOrderHistoryLogs(freshDb.order_history_logs || [])

      // Keep the logged-in engineer session in sync with admin edits
      setEngineer((prev) => {
        if (!prev) return prev
        const fresh = (freshDb.engineers || []).find((e) => e.id === prev.id)
        if (!fresh || fresh.status === "SUSPENDED") return null
        return { ...prev, ...fresh }
      })
    })
    return unsubscribe
  }, [])

  // ---------------------------------------------------------------------------
  // CUSTOMER LOGIN GUARD — cart, booking & payment need a logged-in customer
  // ---------------------------------------------------------------------------
  const requireCustomerLogin = (message = "Pehle login karein — tabhi cart aur booking hogi") => {
    if (user) return true
    toast.error(message, { id: "login-required" })
    navigate("/login", { state: { from: location.pathname + location.search } })
    return false
  }

  const normalizePhone = (val = "") => String(val).replace(/\D/g, "").slice(-10)

  // Requests that belong to the logged-in customer only
  const myRequests = useMemo(() => {
    if (!user) return []
    const myPhone = normalizePhone(user.phone)
    const myEmail = String(user.email || "").toLowerCase()
    return (requests || []).filter(
      (r) =>
        (user.id && r.userId === user.id) ||
        (myPhone && normalizePhone(r.userPhone) === myPhone) ||
        (myEmail && String(r.userEmail || "").toLowerCase() === myEmail)
    )
  }, [requests, user])

  // Jobs that belong to the logged-in engineer only
  const myEngineerJobs = useMemo(() => {
    if (!engineer) return []
    return (requests || []).filter((r) => r.assignedEngineerId === engineer.id)
  }, [requests, engineer])

  // Sync LocalStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("pluggy_activeUser", JSON.stringify(user))
      localStorage.setItem("pluggy_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("pluggy_activeUser")
      localStorage.removeItem("pluggy_user")
    }
  }, [user])

  useEffect(() => {
    if (engineer) {
      localStorage.setItem("pluggy_engineer", JSON.stringify(engineer))
    } else {
      localStorage.removeItem("pluggy_engineer")
    }
  }, [engineer])

  useEffect(() => {
    if (admin) {
      localStorage.setItem("pluggy_admin", JSON.stringify(admin))
    } else {
      localStorage.removeItem("pluggy_admin")
    }
  }, [admin])

  useEffect(() => {
    localStorage.setItem("pluggy_engineers_pool", JSON.stringify(engineersList))
  }, [engineersList])

  useEffect(() => {
    localStorage.setItem("pluggy_cart", JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem("pluggy_recent", JSON.stringify(recent))
  }, [recent])

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem("pluggy_coupon", JSON.stringify(appliedCoupon))
    } else {
      localStorage.removeItem("pluggy_coupon")
    }
  }, [appliedCoupon])

  useEffect(() => {
    localStorage.setItem("pluggy_wallet_balance", String(walletBalance))
  }, [walletBalance])

  useEffect(() => {
    localStorage.setItem("pluggy_wallet_txns", JSON.stringify(walletTransactions))
  }, [walletTransactions])

  useEffect(() => {
    localStorage.setItem("pluggy_preferences", JSON.stringify(userPreferences))
  }, [userPreferences])

  useEffect(() => {
    localStorage.setItem("pluggy_requests", JSON.stringify(requests))
    localStorage.setItem("pluggy_bookings", JSON.stringify(requests))
  }, [requests])

  useEffect(() => {
    localStorage.setItem("pluggy_city", city)
  }, [city])

  useEffect(() => {
    localStorage.setItem("pluggy_address", address)
  }, [address])

  useEffect(() => {
    localStorage.setItem("pluggy_saved_addresses", JSON.stringify(savedAddresses))
  }, [savedAddresses])

  useEffect(() => {
    localStorage.setItem("pluggy_notifications", JSON.stringify(notifications))
  }, [notifications])

  // Helper: Append Order History Audit Log into SQL
  const appendOrderLog = (
    bookingId,
    transactionId,
    actorRole,
    actorName,
    action,
    details,
    customLogsList = null
  ) => {
    const logId = `LOG-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`
    const newLog = {
      id: logId,
      logId,
      bookingId,
      requestId: bookingId,
      transactionId: transactionId || `PLG${String(bookingId).slice(-8)}`,
      actorRole,
      actorName,
      action,
      actionTitle: action,
      details,
      createdAt: new Date().toISOString(),
    }
    const nextLogs = [newLog, ...(customLogsList || orderHistoryLogs)]
    setOrderHistoryLogs(nextLogs)
    return nextLogs
  }

  // Helper: Record Payment Gateway Transaction into SQL
  const recordPaymentTransaction = (paymentData) => {
    const resolvedTxnId = paymentData.txnId || paymentData.transactionId || `PLG${Date.now().toString().slice(-8)}`
    const resolvedBookingId = paymentData.bookingId || paymentData.requestId || Date.now()
    const resolvedName = paymentData.userName || paymentData.customerName || user?.name || "Customer"
    const resolvedPhone = paymentData.userPhone || paymentData.customerPhone || user?.phone || "+91 9876543210"
    const resolvedService = paymentData.serviceName || paymentData.notes || "Home Service"
    const newPayment = {
      txnId: resolvedTxnId,
      transactionId: resolvedTxnId,
      bookingId: resolvedBookingId,
      requestId: resolvedBookingId,
      userName: resolvedName,
      customerName: resolvedName,
      userPhone: resolvedPhone,
      customerPhone: resolvedPhone,
      serviceName: resolvedService,
      notes: resolvedService,
      amount: Number(paymentData.amount || 0),
      paymentMethod: paymentData.paymentMethod || "UPI",
      paymentChannel: paymentData.paymentChannel || "Google Pay / UPI Escrow",
      paymentType: paymentData.paymentType || "SERVICE_BOOKING",
      status: paymentData.status || "SUCCESS",
      escrowState: paymentData.escrowState || "HELD_IN_ESCROW",
      createdAt: new Date().toISOString(),
    }
    const nextPayments = [newPayment, ...paymentTransactions]
    setPaymentTransactions(nextPayments)
    syncTablesToSql({ payment_transactions: nextPayments })
    return newPayment
  }

  // User Auth Functions (Backed by SQL `users` table)
  const loginUser = (userData) => {
    const cleanPhone = (userData.phone || "").replace(/\D/g, "").slice(-10)
    const existing = usersList.find(
      (u) =>
        (cleanPhone && (u.phone || "").replace(/\D/g, "").slice(-10) === cleanPhone) ||
        (userData.email && u.email?.toLowerCase() === userData.email.toLowerCase())
    )
    if (existing) {
      const merged = { ...existing, ...userData }
      setUser(merged)
      return merged
    }
    const createdUser = {
      id: userData.id || `USR00${usersList.length + 1}`,
      name: userData.name || "Customer",
      phone: cleanPhone || userData.phone || "9876543210",
      email: userData.email || `${cleanPhone || "user"}@pluggy.in`,
      password: userData.password || "password123",
      walletBalance: 250,
      city: city || "Delhi NCR",
      joinedAt: new Date().toISOString(),
    }
    const nextUsers = [createdUser, ...usersList]
    setUsersList(nextUsers)
    setUser(createdUser)
    syncTablesToSql({ users: nextUsers })
    return createdUser
  }

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...updatedFields }
      const nextUsers = usersList.map((u) =>
        u.id === next.id || u.email === prev?.email ? { ...u, ...next } : u
      )
      setUsersList(nextUsers)
      syncTablesToSql({ users: nextUsers })
      return next
    })
  }

  const logoutUser = () => {
    setUser(null)
    setCart([])
  }

  // Engineer Auth Functions (Backed by SQL `engineers` table — credentials issued by Admin)
  const authenticateEngineer = (identifier = "", password = "") => {
    const raw = String(identifier).trim()
    const digits = normalizePhone(raw)
    const found = engineersList.find(
      (e) =>
        e.id?.toUpperCase() === raw.toUpperCase() ||
        (digits.length === 10 && normalizePhone(e.phone) === digits)
    )
    if (!found) return { ok: false, error: "Ye Engineer ID registered nahi hai. Admin se ID banwayein." }
    if (found.status === "SUSPENDED")
      return { ok: false, error: "Aapka account Admin ne suspend kiya hai. Control Desk se contact karein." }
    if ((found.password || "eng123") !== password)
      return { ok: false, error: "Galat password. Admin dwara diya gaya password daalein." }
    setEngineer(found)
    return { ok: true, engineer: found }
  }

  const loginEngineer = (engineerData) => {
    const found = engineersList.find((e) => e.id?.toUpperCase() === engineerData?.id?.toUpperCase())
    if (!found) return null
    setEngineer(found)
    return found
  }

  const logoutEngineer = () => setEngineer(null)

  const toggleEngineerDuty = () => {
    if (!engineer) return
    const nextOnline = !engineer.isOnline
    const updated = { ...engineer, isOnline: nextOnline }
    setEngineer(updated)
    const nextEngineers = engineersList.map((e) => (e.id === engineer.id ? { ...e, isOnline: nextOnline } : e))
    setEngineersList(nextEngineers)
    syncTablesToSql({ engineers: nextEngineers })
    toast.success(nextOnline ? "Aap ON DUTY hain — naye jobs milenge" : "Aap OFF DUTY hain")
  }

  // ---------------------------------------------------------------------------
  // ADMIN-ONLY: ENGINEER FLEET MANAGEMENT (create ID, edit, suspend, remove)
  // ---------------------------------------------------------------------------
  const getNextEngineerId = () => {
    const maxNum = engineersList.reduce((max, e) => {
      const n = parseInt(String(e.id).replace(/\D/g, ""), 10)
      return Number.isFinite(n) && n > max ? n : max
    }, 0)
    return `ENG${String(maxNum + 1).padStart(3, "0")}`
  }

  const registerNewEngineer = (engData) => {
    const newId = engData.id?.trim().toUpperCase() || getNextEngineerId()
    if (engineersList.some((e) => e.id.toUpperCase() === newId)) {
      toast.error(`Engineer ID ${newId} pehle se exist karti hai`)
      return null
    }
    const newEng = {
      id: newId,
      name: engData.name,
      phone: normalizePhone(engData.phone) || "9876500000",
      email: engData.email || `${newId.toLowerCase()}@pluggy.in`,
      password: engData.password || "eng123",
      specialization: engData.specialization || "Electrical & Appliances",
      rating: 5.0,
      completedCount: 0,
      isOnline: false,
      status: "ACTIVE",
      area: engData.area || city,
      walletBalance: 0,
      toolKit: engData.toolKit || ["Standard Electrical Kit", "Digital Multimeter"],
      joinedAt: new Date().toISOString(),
      createdBy: admin?.id || "ADM001",
    }
    const nextEngineers = [...engineersList, newEng]
    setEngineersList(nextEngineers)
    syncTablesToSql({ engineers: nextEngineers })
    toast.success(`Engineer ${newEng.name} ki ID ${newEng.id} ban gayi!`)
    return newEng
  }

  const updateEngineer = (engineerId, fields = {}) => {
    const nextEngineers = engineersList.map((e) =>
      e.id === engineerId
        ? {
            ...e,
            ...fields,
            phone: fields.phone !== undefined ? normalizePhone(fields.phone) : e.phone,
            updatedAt: new Date().toISOString(),
          }
        : e
    )
    setEngineersList(nextEngineers)
    syncTablesToSql({ engineers: nextEngineers })
    if (engineer?.id === engineerId) {
      const fresh = nextEngineers.find((e) => e.id === engineerId)
      setEngineer(fresh?.status === "SUSPENDED" ? null : fresh)
    }
    toast.success(`Engineer ${engineerId} update ho gaya`)
  }

  const removeEngineer = (engineerId) => {
    const activeJobs = (requests || []).filter(
      (r) => r.assignedEngineerId === engineerId && !["COMPLETED", "CANCELLED"].includes(r.status)
    )
    if (activeJobs.length > 0) {
      toast.error(`Pehle ${activeJobs.length} active job(s) kisi aur engineer ko re-assign karein`)
      return false
    }
    const nextEngineers = engineersList.filter((e) => e.id !== engineerId)
    setEngineersList(nextEngineers)
    syncTablesToSql({ engineers: nextEngineers })
    if (engineer?.id === engineerId) setEngineer(null)
    toast.success(`Engineer ${engineerId} remove ho gaya`)
    return true
  }

  // Admin Auth Functions (validated against SQL `admins` table)
  const loginAdmin = ({ email = "", password = "" } = {}) => {
    const db = loadSqlDatabase()
    const found = (db.admins || []).find(
      (a) =>
        (a.email?.toLowerCase() === email.trim().toLowerCase() ||
          a.id?.toUpperCase() === email.trim().toUpperCase()) &&
        a.password === password
    )
    if (!found) return { ok: false, error: "Galat Admin email ya password" }
    const nextAdmin = { id: found.id, name: found.name, email: found.email, role: found.role }
    setAdmin(nextAdmin)
    return { ok: true, admin: nextAdmin }
  }

  const resetDemoSqlDatabase = () => {
    const seeded = resetSqlDatabaseToSeed()
    setUsersList(seeded.users || [])
    setEngineersList(seeded.engineers || [])
    setRequests(seeded.service_requests || [])
    setBookings(seeded.service_requests || [])
    setPaymentTransactions(seeded.payment_transactions || [])
    setOrderHistoryLogs(seeded.order_history_logs || [])
    localStorage.setItem("pluggy_requests", JSON.stringify(seeded.service_requests || []))
    toast.success("SQL Database reset to initial seed state!")
  }

  const logoutAdmin = () => setAdmin(null)

  // Cart Functions (customer must be logged in)
  const addToCart = (item) => {
    if (!requireCustomerLogin("Cart mein add karne ke liye pehle login karein")) return false
    const normalizedName = item.name || item.issue || "Doorstep Service"
    const normalizedId = item.id || normalizedName
    setCart((prev) => {
      const exists = prev.find(
        (i) =>
          (i.id && i.id === normalizedId) ||
          (i.issue && i.issue === normalizedName) ||
          (i.name && i.name === normalizedName)
      )
      if (exists) return prev
      return [
        ...prev,
        {
          ...item,
          id: normalizedId,
          name: normalizedName,
          issue: normalizedName,
          qty: item.qty || item.quantity || 1,
          quantity: item.quantity || item.qty || 1,
        },
      ]
    })
    return true
  }

  const removeFromCart = (idOrIssue) => {
    setCart((prev) =>
      prev.filter(
        (i) => i.id !== idOrIssue && i.issue !== idOrIssue && i.name !== idOrIssue
      )
    )
  }

  const clearCart = () => setCart([])

  const addRecent = (serviceName) => {
    if (!serviceName) return
    setRecent((prev) => {
      const filtered = (prev || []).filter((item) => item !== serviceName)
      return [serviceName, ...filtered].slice(0, 8)
    })
  }

  const applyCouponCode = (code) => {
    if (!code) return { success: false, message: "Enter a coupon code" }
    const normalized = code.trim().toUpperCase()
    const found = DEFAULT_COUPONS[normalized]
    if (found) {
      setAppliedCoupon(found)
      return { success: true, coupon: found }
    }
    return { success: false, message: "Invalid or expired coupon code" }
  }

  const removeCoupon = () => setAppliedCoupon(null)

  const addWalletMoney = (amount, source = "Wallet Top-up") => {
    const num = Number(amount)
    if (!num || num <= 0) return
    setWalletBalance((prev) => prev + num)
    setWalletTransactions((prev) => [
      { type: "credit", amount: num, from: source, date: "Just now" },
      ...prev,
    ])
  }

  const deductWalletMoney = (amount, reason = "Service Booking") => {
    const num = Number(amount)
    if (!num || num <= 0) return false
    if (walletBalance < num) return false
    setWalletBalance((prev) => prev - num)
    setWalletTransactions((prev) => [
      { type: "debit", amount: num, from: reason, date: "Just now" },
      ...prev,
    ])
    return true
  }

  const generate4DigitPin = () => String(Math.floor(1000 + Math.random() * 9000))

  // ===========================================================================
  // WORKFLOW 1: CUSTOMER RAISES REQUEST (SAVED IN SQL + PAYMENT GATEWAY LEDGER)
  // ===========================================================================
  const addRequest = (request) => {
    if (!user) {
      requireCustomerLogin("Booking aur payment ke liye pehle login karein")
      return null
    }
    const id = request.id || Date.now()
    const transactionId = request.transactionId || `PLG${id.toString().slice(-8)}`
    const startOtp = request.startOtp || generate4DigitPin()
    const happyOtp = request.happyOtp || generate4DigitPin()
    const bookingMode =
      request.bookingMode || (request.priority === "High" ? "SOS_15MIN" : "STANDARD")

    const isSOS = bookingMode === "SOS_15MIN" || request.priority === "High"
    const onlineEng = engineersList.find((e) => e.isOnline) || engineersList[0]

    const normalized = {
      ...request,
      id,
      transactionId,
      userId: user?.id || "USR001",
      bookingMode,
      priority: isSOS ? "High" : request.priority || "Medium",
      status: isSOS && request.autoAssignSOS ? "ENGINEER_ASSIGNED" : "PENDING_EXECUTIVE",
      assignedEngineerId:
        isSOS && request.autoAssignSOS ? onlineEng?.id : request.assignedEngineerId || null,
      assignedEngineer:
        isSOS && request.autoAssignSOS ? onlineEng?.name : request.assignedEngineer || null,
      assignedEngineerPhone:
        isSOS && request.autoAssignSOS ? onlineEng?.phone : "9876543210",
      startOtp,
      happyOtp,
      address: request.address || request.userAddress || address || "Indirapuram, Delhi NCR",
      userAddress:
        request.userAddress || request.address || address || "Indirapuram, Delhi NCR",
      userName: request.userName || request.name || user?.name || "Customer",
      userPhone: request.userPhone || request.phone || user?.phone || "9876543210",
      userEmail: request.userEmail || user?.email || "",
      baseAmount: Number(request.baseAmount ?? request.amount ?? request.finalAmount ?? 249),
      partsAmount: Number(request.partsAmount ?? 0),
      amount: Number(request.amount ?? request.finalAmount ?? 249),
      paymentStatus: request.paymentStatus || "PAID_ESCROW",
      paymentMethod: request.paymentMethod || "UPI / Online Escrow",
      paymentChannel: request.paymentChannel || "Pluggy Secure Gateway",
      preferences: request.preferences || request.customerPreferences || userPreferences,
      customerPreferences: request.customerPreferences || request.preferences || userPreferences,
      requiredKit: Array.isArray(request.requiredKit)
        ? request.requiredKit.join(", ")
        : request.requiredKit || "Digital Multimeter, Standard Safety Kit & Genuine Spares",
      addedSpareParts: request.addedSpareParts || [],
      standbyLoaner: request.standbyLoaner || null,
      createdAt: request.createdAt || new Date().toISOString(),
      date:
        request.date ||
        new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    }

    const nextRequests = [normalized, ...requests.filter((r) => r.id !== normalized.id)]
    setRequests(nextRequests)
    setBookings(nextRequests)

    // Record Payment Transaction in SQL
    const newPayRow = {
      txnId: transactionId,
      transactionId,
      bookingId: id,
      requestId: id,
      userName: normalized.userName,
      customerName: normalized.userName,
      userPhone: normalized.userPhone,
      customerPhone: normalized.userPhone,
      serviceName: normalized.service || "Home Service",
      notes: `${normalized.service || "Home Service"} (Doorstep Booking)`,
      amount: normalized.amount,
      paymentMethod: normalized.paymentMethod,
      paymentChannel: normalized.paymentChannel,
      paymentType: "SERVICE_BOOKING",
      status: normalized.paymentMethod === "PAY_AFTER_SERVICE" ? "PAY_ON_COMPLETION" : "SUCCESS",
      escrowState: "HELD_UNTIL_HAPPY_PIN",
      createdAt: normalized.createdAt,
    }
    const nextPayments = [
      newPayRow,
      ...paymentTransactions.filter((p) => p.txnId !== transactionId),
    ]
    setPaymentTransactions(nextPayments)

    // Record Audit Log in SQL
    const nextLogs = appendOrderLog(
      id,
      transactionId,
      "USER",
      normalized.userName,
      "BOOKING_RAISED",
      `Raised ${normalized.service} (₹${normalized.amount}) via ${normalized.paymentMethod}. Start PIN: ${startOtp}`
    )

    syncTablesToSql({
      service_requests: nextRequests,
      payment_transactions: nextPayments,
      order_history_logs: nextLogs,
    })

    addNotification({
      type: "service",
      title: isSOS ? "🚨 15-Min SOS Responder Activated!" : "Booking Saved in SQL Database!",
      message: `${normalized.service || "Service"} (${normalized.transactionId}) is live across Admin & Engineer Portals. Start PIN: ${startOtp}`,
    })

    return normalized
  }

  const updateRequestStatus = (id, status, extraData = {}, logInfo = null) => {
    const nextRequests = requests.map((r) =>
      r.id === id ? { ...r, status, ...extraData, updatedAt: new Date().toISOString() } : r
    )
    setRequests(nextRequests)
    setBookings(nextRequests)

    let nextLogs = orderHistoryLogs
    if (logInfo) {
      const target = nextRequests.find((r) => r.id === id)
      nextLogs = appendOrderLog(
        id,
        target?.transactionId,
        logInfo.actorRole,
        logInfo.actorName,
        logInfo.action,
        logInfo.details
      )
    }

    syncTablesToSql({
      service_requests: nextRequests,
      order_history_logs: nextLogs,
    })
  }

  // WORKFLOW 2: EXECUTIVE VERIFIES BOOKING & LOCKS TOOLKIT
  const verifyByExecutive = (requestId, noteOrKit = "", kitOrNote = "") => {
    const resolvedKit = Array.isArray(noteOrKit)
      ? noteOrKit.join(", ")
      : kitOrNote || noteOrKit || "Digital Multimeter, Spare Capacitor/MCB & Safety Gloves"
    const resolvedNote =
      typeof noteOrKit === "string" && kitOrNote
        ? noteOrKit
        : "Verified by Pluggy Executive Control Desk"

    const update = {
      status: "EXECUTIVE_VERIFIED",
      requiredKit: resolvedKit,
      executiveNote: resolvedNote,
      verifiedAt: new Date().toISOString(),
    }
    updateRequestStatus(requestId, "EXECUTIVE_VERIFIED", update, {
      actorRole: "ADMIN",
      actorName: admin?.name || "Executive Desk",
      action: "EXECUTIVE_VERIFIED",
      details: `Locked mandatory toolkit (${resolvedKit}). Note: ${resolvedNote}`,
    })
    toast.success("Booking verified & mandatory toolkit locked in SQL!")
    addNotification({
      type: "update",
      title: "Booking Verified by Executive",
      message: `Request #${requestId.toString().slice(-6)} verified & toolkit locked.`,
    })
  }

  // WORKFLOW 3: ASSIGN ENGINEER (FROM ADMIN DESK OR ENGINEER PICKUP)
  const assignEngineer = (requestId, engineerId, engineerName) => {
    const engObj = engineersList.find((e) => e.id === engineerId) || engineersList[0]
    const resolvedId = engineerId || engObj?.id || "ENG001"
    const resolvedName = engineerName || engObj?.name || "Rajesh Sharma"
    const update = {
      assignedEngineerId: resolvedId,
      assignedEngineer: resolvedName,
      assignedEngineerPhone: engObj?.phone || "9876543210",
      assignedAt: new Date().toISOString(),
    }
    updateRequestStatus(requestId, "ENGINEER_ASSIGNED", update, {
      actorRole: "ADMIN",
      actorName: admin?.name || "Executive Desk",
      action: "ENGINEER_ASSIGNED",
      details: `Dispatched Engineer ${resolvedName} (${resolvedId}) to customer location.`,
    })
    toast.success(`Engineer ${resolvedName} (${resolvedId}) assigned & synced!`, { id: `assign-${requestId}` })
    addNotification({
      type: "service",
      title: "👨‍🔧 Expert Assigned!",
      message: `${resolvedName} (${resolvedId}) is on the way. Share Start PIN on arrival.`,
    })
  }

  // WORKFLOW 4: ENGINEER STARTS JOB WITH 4-DIGIT START PIN
  const startJobWithOtp = (requestId, enteredOtp) => {
    const target = requests.find((r) => r.id === requestId)
    if (!target) {
      toast.error("Booking not found")
      return false
    }
    if (enteredOtp && target.startOtp && enteredOtp.trim() !== target.startOtp) {
      toast.error(`Incorrect Start PIN! Customer's Start PIN is ${target.startOtp}`)
      return false
    }
    updateRequestStatus(
      requestId,
      "IN_PROGRESS",
      { startedAt: new Date().toISOString() },
      {
        actorRole: "ENGINEER",
        actorName: target.assignedEngineer || engineer?.name || "Engineer",
        action: "JOB_STARTED_WITH_PIN",
        details: `Verified 4-digit Start PIN (${target.startOtp}) at doorstep. Repair in progress.`,
      }
    )
    toast.success("Start PIN verified! Job is now IN PROGRESS.")
    addNotification({
      type: "update",
      title: "🔧 Service Started (Start PIN Verified)",
      message: `Your ${target.service} has started.`,
    })
    return true
  }

  // WORKFLOW 5: ENGINEER ADDS SPARE PART QUOTE FROM OFFICIAL RATE CARD
  const addSparePartToJob = (requestId, part) => {
    const uid = `${part.id || part.code}-${Date.now()}`
    const partName = part.name || part.part
    const newPartEntry = {
      ...part,
      id: part.id || part.code,
      code: part.code || part.id,
      name: partName,
      part: partName,
      uid,
      entryId: uid,
      status: "PENDING_APPROVAL",
      approvalStatus: "PENDING_APPROVAL",
      addedAt: new Date().toISOString(),
    }
    const nextRequests = requests.map((r) => {
      if (r.id !== requestId) return r
      return {
        ...r,
        addedSpareParts: [...(r.addedSpareParts || []), newPartEntry],
      }
    })
    setRequests(nextRequests)
    setBookings(nextRequests)

    const target = nextRequests.find((r) => r.id === requestId)
    const nextLogs = appendOrderLog(
      requestId,
      target?.transactionId,
      "ENGINEER",
      target?.assignedEngineer || engineer?.name || "Engineer",
      "SPARE_PART_QUOTED",
      `Requested customer approval for ${partName} (₹${part.price}) from Official Rate Card.`
    )

    syncTablesToSql({
      service_requests: nextRequests,
      order_history_logs: nextLogs,
    })

    toast.success(`Official quote for ${partName} (₹${part.price}) sent to customer!`)
    addNotification({
      type: "service",
      title: "📋 Spare Part Quote Received",
      message: `Engineer quoted ${partName} (₹${part.price}). Approve in Track Requests.`,
    })
  }

  // WORKFLOW 5B: CUSTOMER APPROVES OR REJECTS SPARE PART QUOTE
  const respondToSparePartQuote = (requestId, entryId, isApproved) => {
    const nextStatus = isApproved ? "APPROVED" : "REJECTED"
    let quotedPartName = "Spare Part"
    let quotedPartPrice = 0

    const nextRequests = requests.map((r) => {
      if (r.id !== requestId) return r
      const updatedParts = (r.addedSpareParts || []).map((p) => {
        if (p.entryId === entryId || p.uid === entryId) {
          quotedPartName = p.name || p.part
          quotedPartPrice = Number(p.price || 0)
          return { ...p, status: nextStatus, approvalStatus: nextStatus }
        }
        return p
      })
      const approvedPartsSum = updatedParts
        .filter((p) => p.approvalStatus === "APPROVED" || p.status === "APPROVED")
        .reduce((sum, p) => sum + Number(p.price || 0), 0)
      const base = Number(r.baseAmount ?? r.amount ?? 0)
      return {
        ...r,
        addedSpareParts: updatedParts,
        partsAmount: approvedPartsSum,
        amount: base + approvedPartsSum,
      }
    })

    setRequests(nextRequests)
    setBookings(nextRequests)

    const target = nextRequests.find((r) => r.id === requestId)
    let nextPayments = paymentTransactions
    if (isApproved && quotedPartPrice > 0) {
      const spareTxnId = `PLGSP${Date.now().toString().slice(-6)}`
      const sparePayRow = {
        txnId: spareTxnId,
        transactionId: spareTxnId,
        bookingId: requestId,
        requestId,
        userName: target?.userName || user?.name || "Customer",
        customerName: target?.userName || user?.name || "Customer",
        userPhone: target?.userPhone || user?.phone || "+91 9876543210",
        customerPhone: target?.userPhone || user?.phone || "+91 9876543210",
        serviceName: `Spare Part: ${quotedPartName}`,
        notes: `Official Rate Card Spare Part: ${quotedPartName}`,
        amount: quotedPartPrice,
        paymentMethod: "UPI",
        paymentChannel: "Pluggy Escrow Spare Checkout",
        paymentType: "SPARE_PART",
        status: "SUCCESS",
        escrowState: "HELD_UNTIL_HAPPY_PIN",
        createdAt: new Date().toISOString(),
      }
      nextPayments = [sparePayRow, ...paymentTransactions]
      setPaymentTransactions(nextPayments)
    }

    const nextLogs = appendOrderLog(
      requestId,
      target?.transactionId,
      "USER",
      target?.userName || user?.name || "Customer",
      isApproved ? "SPARE_QUOTE_APPROVED" : "SPARE_QUOTE_REJECTED",
      `${isApproved ? "Approved & paid" : "Rejected"} ${quotedPartName} (₹${quotedPartPrice}). Updated Bill: ₹${target?.amount}`
    )

    syncTablesToSql({
      service_requests: nextRequests,
      payment_transactions: nextPayments,
      order_history_logs: nextLogs,
    })

    toast.success(isApproved ? "Spare part quote approved in SQL!" : "Spare part quote rejected.")
  }

  // WORKFLOW 6: ENGINEER ISSUES STANDBY BACKUP APPLIANCE
  const issueStandbyAppliance = (
    requestId,
    loanerItem = "Pluggy Standby High-Speed Fan",
    dailyRent = 99
  ) => {
    const loaner = {
      active: true,
      item: loanerItem,
      unitName: loanerItem,
      dailyRate: dailyRent,
      dailyRent,
      receiptNo: `STBY-${Date.now().toString().slice(-5)}`,
      issuedAt: new Date().toISOString(),
    }
    const nextRequests = requests.map((r) => {
      if (r.id !== requestId) return r
      const nextAmount = Number(r.amount || 0) + Number(dailyRent)
      return {
        ...r,
        standbyLoaner: loaner,
        amount: nextAmount,
      }
    })
    setRequests(nextRequests)
    setBookings(nextRequests)

    const target = nextRequests.find((r) => r.id === requestId)
    const nextLogs = appendOrderLog(
      requestId,
      target?.transactionId,
      "ENGINEER",
      target?.assignedEngineer || engineer?.name || "Engineer",
      "STANDBY_LOANER_ISSUED",
      `Issued ${loanerItem} @ ₹${dailyRent}/day (Receipt: ${loaner.receiptNo}).`
    )

    syncTablesToSql({
      service_requests: nextRequests,
      order_history_logs: nextLogs,
    })

    toast.success(`${loanerItem} issued @ ₹${dailyRent}/day!`)
  }

  // WORKFLOW 7: COMPLETE JOB WITH HAPPY PIN + ESCROW SETTLEMENT + 30-DAY WARRANTY
  const completeJobWithOtp = (requestId, enteredOtp) => {
    const target = requests.find((r) => r.id === requestId)
    if (!target) {
      toast.error("Booking not found")
      return false
    }
    if (enteredOtp && target.happyOtp && enteredOtp.trim() !== target.happyOtp) {
      toast.error(`Incorrect Happy PIN! Customer's Happy PIN is ${target.happyOtp}`)
      return false
    }

    const expiry = new Date()
    expiry.setDate(expiry.getDate() + 30)
    const qrCodeId = `PLG-QR-${requestId.toString().slice(-5)}`
    const payout =
      Math.round(Number(target.baseAmount || target.amount || 0) * 0.8) +
      Number(target.partsAmount || 0)

    const completionData = {
      status: "COMPLETED",
      paymentStatus: "SETTLED",
      completedAt: new Date().toISOString(),
      warrantyExpiresAt: expiry.toISOString(),
      warrantyValidTill: expiry.toISOString(),
      applianceQrId: qrCodeId,
      engineerPayout: payout,
    }

    const nextRequests = requests.map((r) =>
      r.id === requestId ? { ...r, ...completionData, updatedAt: new Date().toISOString() } : r
    )
    setRequests(nextRequests)
    setBookings(nextRequests)

    // Update Engineer Wallet in SQL
    let nextEngineers = engineersList
    if (target.assignedEngineerId) {
      nextEngineers = engineersList.map((e) =>
        e.id === target.assignedEngineerId
          ? {
              ...e,
              walletBalance: (e.walletBalance || 0) + payout,
              completedCount: (e.completedCount || 0) + 1,
            }
          : e
      )
      setEngineersList(nextEngineers)
      if (engineer && engineer.id === target.assignedEngineerId) {
        setEngineer((prev) => ({
          ...prev,
          walletBalance: (prev.walletBalance || 0) + payout,
          completedCount: (prev.completedCount || 0) + 1,
        }))
      }
    }

    // Release Escrow in Payment Transactions
    const nextPayments = paymentTransactions.map((p) =>
      p.bookingId === requestId || p.txnId === target.transactionId
        ? { ...p, status: "SUCCESS", escrowState: `RELEASED_TO_${target.assignedEngineerId || "ENG"}` }
        : p
    )
    setPaymentTransactions(nextPayments)

    const nextLogs = appendOrderLog(
      requestId,
      target.transactionId,
      "ENGINEER",
      target.assignedEngineer || engineer?.name || "Engineer",
      "JOB_COMPLETED_HAPPY_PIN",
      `Verified Happy PIN (${target.happyOtp}). Escrow released ₹${payout} to engineer & 30-Day QR Warranty (${qrCodeId}) activated.`
    )

    syncTablesToSql({
      service_requests: nextRequests,
      engineers: nextEngineers,
      payment_transactions: nextPayments,
      order_history_logs: nextLogs,
    })

    toast.success(`Happy PIN verified! Job completed & ₹${payout} credited to Partner Wallet!`)
    addNotification({
      type: "service",
      title: "✅ Service Completed & 30-Day Warranty Active!",
      message: `Digital QR Health Card (${qrCodeId}) generated for your ${target.service}.`,
    })

    return true
  }

  // WORKFLOW 8: CLAIM FREE 30-DAY WARRANTY RE-VISIT
  const claimWarrantyRevisit = (idOrReq) => {
    const originalRequest =
      typeof idOrReq === "object" && idOrReq !== null
        ? idOrReq
        : requests.find((r) => r.id === idOrReq)
    if (!originalRequest) {
      toast.error("Original booking not found")
      return null
    }
    const revisit = addRequest({
      service: `${originalRequest.service} (Warranty Free Re-Visit)`,
      issue: `30-Day Warranty Claim for Booking #${originalRequest.transactionId || originalRequest.id}`,
      address: originalRequest.address || originalRequest.userAddress,
      amount: 0,
      baseAmount: 0,
      priority: "High",
      bookingMode: "WARRANTY_CLAIM",
      autoAssignSOS: true,
      parentBookingId: originalRequest.id,
    })
    toast.success("🛡️ ₹0 Free Warranty Re-Visit booked & Priority Engineer assigned!")
    return revisit
  }

  const cancelRequest = (id, reason) => {
    const cancellationData = {
      status: "CANCELLED",
      paymentStatus: "REFUNDED",
      cancelledAt: new Date().toISOString(),
      cancellationReason: reason,
    }
    updateRequestStatus(id, "CANCELLED", cancellationData, {
      actorRole: "USER",
      actorName: user?.name || "Customer",
      action: "BOOKING_CANCELLED",
      details: `Booking cancelled. Reason: ${reason}`,
    })
  }

  const rateRequest = (id, rating, review = "") => {
    const ratingData = {
      rating,
      review,
      ratedAt: new Date().toISOString(),
    }
    const nextRequests = requests.map((r) => (r.id === id ? { ...r, ...ratingData } : r))
    setRequests(nextRequests)
    setBookings(nextRequests)
    const target = nextRequests.find((r) => r.id === id)
    const nextLogs = appendOrderLog(
      id,
      target?.transactionId,
      "USER",
      target?.userName || user?.name || "Customer",
      "CUSTOMER_RATED_JOB",
      `Rated ${rating}★: "${review || "Great doorstep service!"}"`
    )
    syncTablesToSql({
      service_requests: nextRequests,
      order_history_logs: nextLogs,
    })
  }

  const addBooking = (booking) => addRequest(booking)

  const addSavedAddress = (newAddress) => {
    setSavedAddresses((prev) => [...prev, { id: Date.now(), ...newAddress }])
  }

  const removeSavedAddress = (id) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  const updateSavedAddress = (id, updated) => {
    setSavedAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)))
  }

  const addNotification = (notif) => {
    setNotifications((prev) => [
      {
        id: Date.now(),
        read: false,
        time: "Just now",
        createdAt: new Date().toISOString(),
        ...notif,
      },
      ...prev,
    ])
  }

  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const clearNotifications = () => setNotifications([])

  const toggleTheme = () => {
    setTheme("light")
  }

  const value = {
    user,
    setUser,
    loginUser,
    registerUser: loginUser,
    requireCustomerLogin,
    myRequests,
    myEngineerJobs,
    authenticateEngineer,
    updateEngineer,
    removeEngineer,
    getNextEngineerId,
    updateUser,
    logoutUser,
    usersList,
    engineer,
    loginEngineer,
    logoutEngineer,
    toggleEngineerDuty,
    registerNewEngineer,
    engineersList,
    admin,
    loginAdmin,
    logoutAdmin,
    cart,
    setCart,
    addToCart,
    removeFromCart,
    clearCart,
    recent,
    setRecent,
    addRecent,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    walletBalance,
    walletTransactions,
    addWalletMoney,
    deductWalletMoney,
    userPreferences,
    setUserPreferences,
    requests,
    addRequest,
    updateRequestStatus,
    verifyByExecutive,
    assignEngineer,
    startJobWithOtp,
    addSparePartToJob,
    respondToSparePartQuote,
    issueStandbyAppliance,
    completeJobWithOtp,
    claimWarrantyRevisit,
    cancelRequest,
    rateRequest,
    bookings,
    addBooking,
    paymentTransactions,
    recordPaymentTransaction,
    orderHistoryLogs,
    executeSqlQuery,
    executeSql: executeSqlQuery,
    resetDemoSqlDatabase,
    city,
    setCity,
    address,
    setAddress,
    savedAddresses,
    addSavedAddress,
    removeSavedAddress,
    updateSavedAddress,
    notifications,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    theme,
    toggleTheme,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
export const useAppContext = useApp
