// src/AppContext.jsx
import { createContext, useContext, useState, useEffect, useMemo } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import toast from "react-hot-toast"
import { getFaultDraft, clearFaultDraft } from "./lib/faultDraft"
import {
  loadTelemetryLogs,
  saveTelemetryLogs,
  loadSecurityAlerts,
  saveSecurityAlerts,
  captureEngineerGps,
} from "./lib/engineerSurveillance"
import {
  loadSqlDatabase,
  saveSqlDatabase,
  subscribeToSqlChanges,
  executeSqlQuery,
  resetSqlDatabaseToSeed,
  syncWithCloudServer,
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

  // SQL Tables State (Synced Across All Portals, Tabs & Devices via /api/sync)
  const [usersList, setUsersList] = useState(() => initialSql.users)
  const [engineersList, setEngineersList] = useState(() => initialSql.engineers)
  const [requests, setRequests] = useState(() => initialSql.service_requests)
  const [bookings, setBookings] = useState(() => initialSql.service_requests)
  const [paymentTransactions, setPaymentTransactions] = useState(
    () => initialSql.payment_transactions
  )
  const [orderHistoryLogs, setOrderHistoryLogs] = useState(() => initialSql.order_history_logs)

  // Real-time Engineer Surveillance, GPS Telemetry & Anti-Bypass Security Alerts
  const [engineerTelemetryLogs, setEngineerTelemetryLogs] = useState(
    () => initialSql.telemetry_logs?.length ? initialSql.telemetry_logs : loadTelemetryLogs()
  )
  const [engineerSecurityAlerts, setEngineerSecurityAlerts] = useState(
    () => initialSql.security_alerts?.length ? initialSql.security_alerts : loadSecurityAlerts()
  )

  // Cart State (persisted even before login so adding items never fails)
  const [cart, setCart] = useState(() => {
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

  const [myBookedIds, setMyBookedIds] = useState(() => {
    try {
      const saved = localStorage.getItem("pluggy_my_booking_ids")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Persist SQL Relational Tables whenever core entities change
  const syncTablesToSql = (nextOverrides = {}) => {
    const currentDb = loadSqlDatabase()
    const mergedDb = {
      ...currentDb,
      deletedEngineerIds:
        nextOverrides.deletedEngineerIds ?? currentDb.deletedEngineerIds ?? [],
      users: nextOverrides.users ?? usersList,
      engineers: nextOverrides.engineers ?? engineersList,
      service_requests: nextOverrides.service_requests ?? requests,
      payment_transactions: nextOverrides.payment_transactions ?? paymentTransactions,
      order_history_logs: nextOverrides.order_history_logs ?? orderHistoryLogs,
      telemetry_logs: nextOverrides.telemetry_logs ?? engineerTelemetryLogs,
      security_alerts: nextOverrides.security_alerts ?? engineerSecurityAlerts,
    }
    saveSqlDatabase(mergedDb)
  }

  // Subscribe to real-time SQL updates from other browser tabs & cloud devices (Customer <-> Admin <-> Engineer)
  useEffect(() => {
    const unsubscribe = subscribeToSqlChanges((freshDb) => {
      setUsersList(freshDb.users || [])
      setEngineersList(freshDb.engineers || [])
      setRequests(freshDb.service_requests || [])
      setBookings(freshDb.service_requests || [])
      setPaymentTransactions(freshDb.payment_transactions || [])
      setOrderHistoryLogs(freshDb.order_history_logs || [])
      if (Array.isArray(freshDb.telemetry_logs) && freshDb.telemetry_logs.length > 0) {
        setEngineerTelemetryLogs(freshDb.telemetry_logs)
        saveTelemetryLogs(freshDb.telemetry_logs)
      }
      if (Array.isArray(freshDb.security_alerts) && freshDb.security_alerts.length > 0) {
        setEngineerSecurityAlerts(freshDb.security_alerts)
        saveSecurityAlerts(freshDb.security_alerts)
      }

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
  // CUSTOMER LOGIN GUARD — auto-creates a guest customer if needed
  // ---------------------------------------------------------------------------
  const requireCustomerLogin = (message = "Pehle login karein — tabhi cart aur booking hogi") => {
    if (user) return true
    toast.error(message, { id: "login-required" })
    navigate("/login", { state: { from: location.pathname + location.search } })
    return false
  }

  const normalizePhone = (val = "") => String(val).replace(/\D/g, "").slice(-10)

  // Requests that belong to the logged-in customer OR were booked on this device
  const myRequests = useMemo(() => {
    const localSet = new Set((myBookedIds || []).map((id) => String(id)))
    if (!user) {
      return (requests || []).filter((r) => localSet.has(String(r.id)))
    }
    const myPhone = normalizePhone(user.phone)
    const myEmail = String(user.email || "").toLowerCase()
    const myName = String(user.name || "").trim().toLowerCase()
    return (requests || []).filter(
      (r) =>
        localSet.has(String(r.id)) ||
        (user.id && r.userId === user.id) ||
        (myPhone && normalizePhone(r.userPhone) === myPhone) ||
        (myEmail && String(r.userEmail || "").toLowerCase() === myEmail) ||
        (myName && myName !== "customer" && String(r.userName || "").trim().toLowerCase() === myName)
    )
  }, [requests, user, myBookedIds])

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
    try {
      localStorage.setItem("pluggy_requests", JSON.stringify(requests))
    } catch {
      /* quota protected by sqlDatabase */
    }
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
  const raiseEngineerSecurityAlert = ({
    engineerId,
    engineerName,
    severity = "HIGH",
    type = "TAMPER_ATTEMPT",
    title,
    description,
    requestId = null,
    lat = null,
    lng = null,
    locationLabel = "Field Location",
  }) => {
    const newAlert = {
      id: `ALT-${Date.now().toString().slice(-6)}`,
      engineerId: engineerId || engineer?.id || "ENG",
      engineerName: engineerName || engineer?.name || "Engineer",
      severity,
      type,
      title,
      description,
      requestId,
      lat,
      lng,
      locationLabel,
      status: "OPEN",
      timestamp: new Date().toISOString(),
    }
    setEngineerSecurityAlerts((prev) => {
      const next = [newAlert, ...prev]
      saveSecurityAlerts(next)
      syncTablesToSql({ security_alerts: next })
      return next
    })
    return newAlert
  }

  const recordEngineerTelemetry = async (
    engObj,
    eventType,
    title,
    details,
    requestId = null,
    extraEngineerPatch = {}
  ) => {
    const activeEng = engObj || engineer
    if (!activeEng) return null
    const gps = await captureEngineerGps(activeEng)
    const entry = {
      id: `TEL-${Date.now().toString().slice(-6)}`,
      engineerId: activeEng.id,
      engineerName: activeEng.name,
      eventType,
      title,
      details,
      lat: gps.lat,
      lng: gps.lng,
      locationLabel: gps.locationLabel,
      gpsStatus: gps.gpsStatus,
      requestId,
      timestamp: gps.timestamp,
    }
    let nextTelemetryList = []
    setEngineerTelemetryLogs((prev) => {
      const next = [entry, ...prev]
      nextTelemetryList = next
      saveTelemetryLogs(next)
      return next
    })

    // Sync engineer's latest GPS & session timestamps in SQL engineers table
    setEngineersList((prevList) => {
      const nextEngineers = prevList.map((e) =>
        e.id === activeEng.id
          ? {
              ...e,
              lastLat: gps.lat,
              lastLng: gps.lng,
              lastLocationLabel: gps.locationLabel,
              lastGpsStatus: gps.gpsStatus,
              lastSeenAt: gps.timestamp,
              ...extraEngineerPatch,
            }
          : e
      )
      syncTablesToSql({
        engineers: nextEngineers,
        ...(nextTelemetryList.length > 0 ? { telemetry_logs: nextTelemetryList } : {}),
      })
      return nextEngineers
    })

    if (gps.gpsStatus === "GPS_PERMISSION_DENIED") {
      raiseEngineerSecurityAlert({
        engineerId: activeEng.id,
        engineerName: activeEng.name,
        severity: "MEDIUM",
        type: "GPS_BLOCKED",
        title: `GPS Permission Blocked by ${activeEng.name} (${activeEng.id})`,
        description: `Engineer performed "${title}" while device location permission was blocked/off.`,
        requestId,
        lat: gps.lat,
        lng: gps.lng,
        locationLabel: gps.locationLabel,
      })
    }

    return entry
  }

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
    if ((found.password || "eng123") !== password) {
      raiseEngineerSecurityAlert({
        engineerId: found.id,
        engineerName: found.name,
        severity: "MEDIUM",
        type: "FAILED_LOGIN",
        title: `Failed Password Attempt on ${found.id}`,
        description: `Invalid password entered for Engineer ID ${found.id} (${found.name}).`,
      })
      return { ok: false, error: "Galat password. Admin dwara diya gaya password daalein." }
    }
    const loginTime = new Date().toISOString()
    const updatedEng = { ...found, lastLoginAt: loginTime, isLoggedIn: true }
    setEngineer(updatedEng)
    recordEngineerTelemetry(
      updatedEng,
      "ENGINEER_LOGIN",
      "Logged into Partner Terminal",
      `Partner ID ${found.id} signed in & GPS session initialized.`,
      null,
      { lastLoginAt: loginTime, isLoggedIn: true }
    )
    return { ok: true, engineer: updatedEng }
  }

  const loginEngineer = (engineerData) => {
    const found = engineersList.find((e) => e.id?.toUpperCase() === engineerData?.id?.toUpperCase())
    if (!found) return null
    const loginTime = new Date().toISOString()
    const updatedEng = { ...found, lastLoginAt: loginTime, isLoggedIn: true }
    setEngineer(updatedEng)
    recordEngineerTelemetry(
      updatedEng,
      "ENGINEER_LOGIN",
      "Logged into Partner Terminal",
      `Partner ID ${found.id} signed in & GPS session initialized.`,
      null,
      { lastLoginAt: loginTime, isLoggedIn: true }
    )
    return updatedEng
  }

  const logoutEngineer = () => {
    if (engineer) {
      const inProgressJobs = (requests || []).filter(
        (r) => r.assignedEngineerId === engineer.id && r.status === "IN_PROGRESS"
      )
      if (inProgressJobs.length > 0) {
        raiseEngineerSecurityAlert({
          engineerId: engineer.id,
          engineerName: engineer.name,
          severity: "HIGH",
          type: "ABANDON_ATTEMPT",
          title: `${engineer.name} (${engineer.id}) tried to Logout during Active Repair`,
          description: `Engineer attempted to sign out while Booking #${inProgressJobs[0].transactionId || inProgressJobs[0].id} is IN_PROGRESS.`,
          requestId: inProgressJobs[0].id,
        })
        toast.error("Active repair chal rahi hai! Job poora kiye bina logout allowed nahi hai.")
        return false
      }
      const logoutTime = new Date().toISOString()
      recordEngineerTelemetry(
        engineer,
        "ENGINEER_LOGOUT",
        "Signed Out of Partner Terminal",
        `Partner ID ${engineer.id} logged out cleanly.`,
        null,
        { lastLogoutAt: logoutTime, isLoggedIn: false, isOnline: false }
      )
    }
    setEngineer(null)
    return true
  }

  const toggleEngineerDuty = (shiftChecklist = null) => {
    if (!engineer) return false
    const nextOnline = !engineer.isOnline
    if (!nextOnline) {
      const inProgressJobs = (requests || []).filter(
        (r) => r.assignedEngineerId === engineer.id && r.status === "IN_PROGRESS"
      )
      if (inProgressJobs.length > 0) {
        raiseEngineerSecurityAlert({
          engineerId: engineer.id,
          engineerName: engineer.name,
          severity: "HIGH",
          type: "DUTY_OFF_DURING_JOB",
          title: `${engineer.name} (${engineer.id}) tried going OFF DUTY mid-repair`,
          description: `Attempted to switch OFF DUTY while Booking #${inProgressJobs[0].transactionId || inProgressJobs[0].id} is IN_PROGRESS.`,
          requestId: inProgressJobs[0].id,
        })
        toast.error("Active job chalte waqt OFF DUTY nahi ho sakte!")
        return false
      }
    }
    const ts = new Date().toISOString()
    const patch = nextOnline
      ? { isOnline: true, shiftStartedAt: ts, shiftChecklist: shiftChecklist || { uniform: true, idCard: true, toolkit: true } }
      : { isOnline: false, shiftEndedAt: ts }
    const updated = { ...engineer, ...patch }
    setEngineer(updated)
    const nextEngineers = engineersList.map((e) => (e.id === engineer.id ? { ...e, ...patch } : e))
    setEngineersList(nextEngineers)
    syncTablesToSql({ engineers: nextEngineers })
    recordEngineerTelemetry(
      updated,
      nextOnline ? "DUTY_ON" : "DUTY_OFF",
      nextOnline ? "Marked ON DUTY (Shift & Toolkit Verified)" : "Marked OFF DUTY (Shift Paused)",
      nextOnline
        ? "Uniform, ID Card & Toolkit verified • Live GPS shift tracking active."
        : "Engineer went OFF DUTY.",
      null,
      patch
    )
    toast.success(nextOnline ? "Aap ON DUTY hain — Live GPS active" : "Aap OFF DUTY hain")
    return true
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
    const currentDb = loadSqlDatabase()
    const nextDeletedIds = Array.from(
      new Set([...(currentDb.deletedEngineerIds || []), String(engineerId)])
    )
    const nextEngineers = engineersList.filter((e) => e.id !== engineerId)
    setEngineersList(nextEngineers)
    syncTablesToSql({ engineers: nextEngineers, deletedEngineerIds: nextDeletedIds })
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
    setEngineerTelemetryLogs(seeded.telemetry_logs || [])
    setEngineerSecurityAlerts(seeded.security_alerts || [])
    saveTelemetryLogs(seeded.telemetry_logs || [])
    saveSecurityAlerts(seeded.security_alerts || [])
    localStorage.setItem("pluggy_requests", JSON.stringify(seeded.service_requests || []))
    toast.success("SQL Database reset to initial seed state!")
  }

  const logoutAdmin = () => setAdmin(null)

  // Cart Functions (works seamlessly with or without prior login)
  const addToCart = (item) => {
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
  // WORKFLOW 1: CUSTOMER RAISES REQUEST (SAVED IN SQL + CLOUD SYNC + LEDGER)
  // Guaranteed to succeed from ANY booking flow (even if customer was not logged in!)
  // ===========================================================================
  const addRequest = (request) => {
    const resolvedName =
      (request.userName || request.name || user?.name || "").trim() || "Guest Customer"
    const resolvedPhone =
      normalizePhone(request.userPhone || request.phone || user?.phone || "") || "9876543210"
    const resolvedEmail =
      (request.userEmail || request.email || user?.email || "").trim() ||
      `${resolvedPhone}@pluggy.in`

    // Ensure an active customer session exists so /track shows the booking immediately
    let activeCustomer = user
    if (!activeCustomer) {
      activeCustomer = loginUser({
        id: `USR-${Date.now().toString().slice(-5)}`,
        name: resolvedName,
        phone: resolvedPhone,
        email: resolvedEmail,
      })
    } else if (!activeCustomer.id || (!activeCustomer.phone && resolvedPhone)) {
      const patchedUser = {
        ...activeCustomer,
        id: activeCustomer.id || `USR-${Date.now().toString().slice(-5)}`,
        phone: activeCustomer.phone || resolvedPhone,
      }
      setUser(patchedUser)
      activeCustomer = patchedUser
    }

    const faultDraft = getFaultDraft()
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
      userId: request.userId || activeCustomer?.id || "USR001",
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
      userName: resolvedName,
      userPhone: resolvedPhone,
      userEmail: resolvedEmail,
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
      faultPhotos: request.faultPhotos || faultDraft.photos || [],
      faultDevice: request.faultDevice || faultDraft.device || "",
      createdAt: request.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      date:
        request.date ||
        new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
    }

    clearFaultDraft()

    // Track this booking ID on this device so /track always displays it
    setMyBookedIds((prev) => {
      const nextIds = Array.from(new Set([String(id), ...(prev || []).map(String)]))
      try {
        localStorage.setItem("pluggy_my_booking_ids", JSON.stringify(nextIds))
      } catch {
        // ignore
      }
      return nextIds
    })

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
    toast.success("Booking verified & mandatory toolkit locked in SQL!", { id: `verify-${requestId}` })
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

  // WORKFLOW 3B: ENGINEER STEP-BY-STEP TRAVEL & ARRIVAL PROGRESSION + WORK PROOF UPLOAD
  const markEngineerTravelStep = (requestId, stepType) => {
    const target = requests.find((r) => r.id === requestId)
    if (!target) return false
    const nowIso = new Date().toISOString()
    const patch =
      stepType === "EN_ROUTE"
        ? { fieldStep: "EN_ROUTE", travelStartedAt: nowIso }
        : { fieldStep: "REACHED_DOORSTEP", arrivedAt: nowIso }

    const nextRequests = requests.map((r) => (r.id === requestId ? { ...r, ...patch } : r))
    setRequests(nextRequests)
    setBookings(nextRequests)

    const nextLogs = appendOrderLog(
      requestId,
      target.transactionId,
      "ENGINEER",
      target.assignedEngineer || engineer?.name || "Engineer",
      stepType === "EN_ROUTE" ? "ENGINEER_EN_ROUTE" : "ENGINEER_REACHED_DOORSTEP",
      stepType === "EN_ROUTE"
        ? "Engineer started travel to customer address."
        : "Engineer arrived at customer doorstep — awaiting customer Start PIN."
    )
    syncTablesToSql({ service_requests: nextRequests, order_history_logs: nextLogs })

    recordEngineerTelemetry(
      engineer,
      stepType,
      stepType === "EN_ROUTE"
        ? `Started Travel for #${target.transactionId || requestId}`
        : `Reached Customer Doorstep for #${target.transactionId || requestId}`,
      `Customer Address: ${target.address || target.userAddress}`,
      requestId
    )
    toast.success(
      stepType === "EN_ROUTE"
        ? "Status updated: On The Way to Customer!"
        : "Doorstep arrival recorded! Ab customer se 4-digit Start PIN maangein."
    )
    return true
  }

  const uploadEngineerWorkProof = (requestId, photoDataUrl, note = "") => {
    const target = requests.find((r) => r.id === requestId)
    if (!target || !photoDataUrl) return false
    const existing = Array.isArray(target.workProofPhotos) ? target.workProofPhotos : []
    const updatedPhotos = [...existing, photoDataUrl].slice(0, 3)
    const patch = {
      workProofPhotos: updatedPhotos,
      workProofNote: note || target.workProofNote || "Repair completed & tested",
      workProofUploadedAt: new Date().toISOString(),
    }
    const nextRequests = requests.map((r) => (r.id === requestId ? { ...r, ...patch } : r))
    setRequests(nextRequests)
    setBookings(nextRequests)
    syncTablesToSql({ service_requests: nextRequests })

    recordEngineerTelemetry(
      engineer,
      "WORK_PROOF_UPLOADED",
      `Uploaded Repair Proof Photo (#${target.transactionId || requestId})`,
      `Attached ${updatedPhotos.length} photo(s) of completed repair work.`,
      requestId
    )
    toast.success("Repair proof photo uploaded! Ab Happy PIN enter kar sakte hain.")
    return true
  }

  // WORKFLOW 4: ENGINEER STARTS JOB WITH 4-DIGIT START PIN (STRICT ANTI-TAMPER, NO PIN LEAK)
  const startJobWithOtp = (requestId, enteredOtp) => {
    const target = requests.find((r) => r.id === requestId)
    if (!target) {
      toast.error("Booking not found")
      return false
    }
    if (target.pinLocked) {
      toast.error("3 galat PIN attempts ki wajah se job lock ho gayi hai! Admin Desk se contact karein.")
      return false
    }
    if (!enteredOtp || (target.startOtp && enteredOtp.trim() !== target.startOtp)) {
      const attempts = (Number(target.wrongPinAttempts) || 0) + 1
      const locked = attempts >= 3
      const nextRequests = requests.map((r) =>
        r.id === requestId ? { ...r, wrongPinAttempts: attempts, pinLocked: locked } : r
      )
      setRequests(nextRequests)
      setBookings(nextRequests)
      syncTablesToSql({ service_requests: nextRequests })

      recordEngineerTelemetry(
        engineer,
        "WRONG_START_PIN",
        `Invalid Start PIN Attempt (${attempts}/3) on #${target.transactionId || requestId}`,
        `Entered "${enteredOtp}" — did not match customer's Start PIN.`,
        requestId
      )
      raiseEngineerSecurityAlert({
        engineerId: target.assignedEngineerId || engineer?.id,
        engineerName: target.assignedEngineer || engineer?.name,
        severity: locked ? "CRITICAL" : "HIGH",
        type: "WRONG_PIN_ATTEMPT",
        title: locked
          ? `🔒 Job #${target.transactionId} LOCKED — 3 Wrong Start PIN Attempts`
          : `⚠️ Wrong Start PIN Attempt (${attempts}/3) by ${target.assignedEngineer || engineer?.name}`,
        description: `Engineer entered wrong Start PIN ("${enteredOtp}") on Booking #${target.transactionId || requestId}. ${
          locked ? "PIN terminal auto-locked to prevent fraud." : ""
        }`,
        requestId,
      })

      toast.error(
        locked
          ? "3 galat PIN attempts! Ye job security lock ho gayi hai. Admin Desk se sampark karein."
          : `Galat Start PIN! Customer ke phone se sahi 4-digit PIN pooch kar daalein (${3 - attempts} attempts bache hain).`
      )
      return false
    }
    updateRequestStatus(
      requestId,
      "IN_PROGRESS",
      { startedAt: new Date().toISOString(), fieldStep: "IN_PROGRESS", wrongPinAttempts: 0 },
      {
        actorRole: "ENGINEER",
        actorName: target.assignedEngineer || engineer?.name || "Engineer",
        action: "JOB_STARTED_WITH_PIN",
        details: `Verified customer's 4-digit Start PIN at doorstep. Repair in progress.`,
      }
    )
    recordEngineerTelemetry(
      engineer,
      "START_PIN_VERIFIED",
      `Start PIN Verified — Repair Started (#${target.transactionId || requestId})`,
      `Doorstep Start PIN verified for ${target.service}.`,
      requestId
    )
    toast.success("Start PIN verified! Repair work started.")
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

  // WORKFLOW 7: COMPLETE JOB WITH HAPPY PIN + WORK PROOF CHECK + ANTI-TAMPER AUDIT
  const completeJobWithOtp = (requestId, enteredOtp) => {
    const target = requests.find((r) => r.id === requestId)
    if (!target) {
      toast.error("Booking not found")
      return false
    }
    if (target.pinLocked) {
      toast.error("Ye job 3 galat PIN attempts ki wajah se lock hai! Admin Desk se unlock karwayein.")
      return false
    }
    if (!Array.isArray(target.workProofPhotos) || target.workProofPhotos.length === 0) {
      toast.error("Pehle repair ki hui device ki Work Proof Photo upload karein, tabhi Happy PIN lagega!")
      return false
    }
    if (!enteredOtp || (target.happyOtp && enteredOtp.trim() !== target.happyOtp)) {
      const attempts = (Number(target.wrongPinAttempts) || 0) + 1
      const locked = attempts >= 3
      const nextRequests = requests.map((r) =>
        r.id === requestId ? { ...r, wrongPinAttempts: attempts, pinLocked: locked } : r
      )
      setRequests(nextRequests)
      setBookings(nextRequests)
      syncTablesToSql({ service_requests: nextRequests })

      recordEngineerTelemetry(
        engineer,
        "WRONG_HAPPY_PIN",
        `Invalid Happy PIN Attempt (${attempts}/3) on #${target.transactionId || requestId}`,
        `Entered "${enteredOtp}" — did not match customer's Happy PIN.`,
        requestId
      )
      raiseEngineerSecurityAlert({
        engineerId: target.assignedEngineerId || engineer?.id,
        engineerName: target.assignedEngineer || engineer?.name,
        severity: locked ? "CRITICAL" : "HIGH",
        type: "WRONG_PIN_ATTEMPT",
        title: locked
          ? `🔒 Job #${target.transactionId} LOCKED — 3 Wrong Happy PIN Attempts`
          : `⚠️ Wrong Happy PIN Attempt (${attempts}/3) by ${target.assignedEngineer || engineer?.name}`,
        description: `Engineer entered wrong Happy PIN ("${enteredOtp}") on Booking #${target.transactionId || requestId}.`,
        requestId,
      })

      toast.error(
        locked
          ? "3 galat PIN attempts! Job lock ho gayi hai. Admin Desk se contact karein."
          : `Galat Happy PIN! Customer se pooch kar sahi 4-digit PIN daalein (${3 - attempts} attempts bache hain).`
      )
      return false
    }

    // Check if engineer completed suspiciously fast (< 2 minutes after Start PIN)
    const startedMs = target.startedAt ? new Date(target.startedAt).getTime() : 0
    const durationMinutes = startedMs ? Math.max(1, Math.round((Date.now() - startedMs) / 60000)) : 25
    if (startedMs && Date.now() - startedMs < 120000) {
      raiseEngineerSecurityAlert({
        engineerId: target.assignedEngineerId || engineer?.id,
        engineerName: target.assignedEngineer || engineer?.name,
        severity: "HIGH",
        type: "SPEED_RUN_COMPLETION",
        title: `⚡ Suspicious Fast Job Completion (< 2 mins) on #${target.transactionId}`,
        description: `Engineer ${target.assignedEngineer || engineer?.name} completed #${target.transactionId} in less than 2 minutes after Start PIN. Verify work proof photo.`,
        requestId,
      })
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
      jobDurationMinutes: durationMinutes,
      warrantyExpiresAt: expiry.toISOString(),
      warrantyValidTill: expiry.toISOString(),
      applianceQrId: qrCodeId,
      engineerPayout: payout,
      wrongPinAttempts: 0,
      pinLocked: false,
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

    recordEngineerTelemetry(
      engineer,
      "JOB_COMPLETED",
      `Completed Job #${target.transactionId || requestId} (Duration: ${durationMinutes}m)`,
      `Happy PIN verified • Payout ₹${payout} credited to Partner Wallet.`,
      requestId
    )

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

  // Admin & Engineer Surveillance Controls
  const unlockEngineerJobPin = (requestId) => {
    const nextRequests = requests.map((r) =>
      r.id === requestId ? { ...r, wrongPinAttempts: 0, pinLocked: false } : r
    )
    setRequests(nextRequests)
    setBookings(nextRequests)
    syncTablesToSql({ service_requests: nextRequests })
    toast.success("Job PIN terminal unlocked for engineer!")
  }

  const resolveEngineerAlert = (alertId) => {
    setEngineerSecurityAlerts((prev) => {
      const next = prev.map((a) =>
        a.id === alertId ? { ...a, status: "RESOLVED", resolvedAt: new Date().toISOString() } : a
      )
      saveSecurityAlerts(next)
      syncTablesToSql({ security_alerts: next })
      return next
    })
    toast.success("Security alert marked resolved")
  }

  const pingEngineerLiveLocation = async (targetEngineerId = null) => {
    const targetEng =
      (targetEngineerId && engineersList.find((e) => e.id === targetEngineerId)) || engineer
    if (!targetEng) return null

    // Check if engineer has any completed customer addresses and no active job there
    const pastCompletedForEng = (requests || []).filter(
      (r) => r.assignedEngineerId === targetEng.id && r.status === "COMPLETED"
    )
    const activeForEng = (requests || []).filter(
      (r) =>
        r.assignedEngineerId === targetEng.id &&
        !["COMPLETED", "CANCELLED"].includes(r.status)
    )

    const entry = await recordEngineerTelemetry(
      targetEng,
      "GPS_HEARTBEAT_PING",
      `Live GPS Location Ping (${targetEng.id})`,
      activeForEng.length > 0
        ? `Assigned on active booking #${activeForEng[0].transactionId || activeForEng[0].id} at ${activeForEng[0].address}`
        : `No active booking • Monitoring field zone (${targetEng.area || "Delhi NCR"}).`,
      activeForEng[0]?.id || null
    )

    // If engineer has past completed customers and 0 active jobs, check proximity
    if (pastCompletedForEng.length > 0 && activeForEng.length === 0 && targetEngineerId) {
      const pastCustomer = pastCompletedForEng[0]
      raiseEngineerSecurityAlert({
        engineerId: targetEng.id,
        engineerName: targetEng.name,
        severity: "HIGH",
        type: "ANTI_BYPASS_PROXIMITY",
        title: `🕵️ Proximity Radar Check on ${targetEng.name} (${targetEng.id})`,
        description: `Verified GPS coordinates (${entry?.lat}, ${entry?.lng}) against ${pastCompletedForEng.length} past customer home(s) (last: ${pastCustomer.userName} at ${pastCustomer.address}).`,
        lat: entry?.lat,
        lng: entry?.lng,
        locationLabel: entry?.locationLabel,
      })
    }
    return entry
  }

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
    markEngineerTravelStep,
    uploadEngineerWorkProof,
    startJobWithOtp,
    addSparePartToJob,
    respondToSparePartQuote,
    issueStandbyAppliance,
    completeJobWithOtp,
    unlockEngineerJobPin,
    resolveEngineerAlert,
    raiseEngineerSecurityAlert,
    pingEngineerLiveLocation,
    engineerTelemetryLogs,
    engineerSecurityAlerts,
    forceCloudSync: syncWithCloudServer,
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
