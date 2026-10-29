// src/AppContext.jsx
import { createContext, useContext, useState, useEffect } from "react"
import toast from "react-hot-toast"

const AppContext = createContext()

const DEFAULT_COUPONS = {
  PLUGGY20: { code: "PLUGGY20", type: "percent", value: 20, label: "20% OFF" },
  PLUG20: { code: "PLUG20", type: "percent", value: 20, label: "20% OFF" },
  SUMMER25: { code: "SUMMER25", type: "percent", value: 25, label: "25% OFF" },
  SAVE100: { code: "SAVE100", type: "flat", value: 100, label: "₹100 OFF" },
}

const DEFAULT_ENGINEERS = [
  {
    id: "ENG001",
    name: "Rajesh Sharma",
    phone: "9876543210",
    specialization: "AC & Cooling, Refrigerator",
    rating: 4.9,
    completedCount: 342,
    isOnline: true,
    lat: 28.7306,
    lng: 77.7759,
    area: "Sector 18 / Main Market",
    walletBalance: 4250,
    toolKit: ["Digital Clamp Meter", "Foam-Jet Pump", "Vacuum Pump", "35mfd & 2.5mfd Capacitors"],
  },
  {
    id: "ENG002",
    name: "Amit Verma",
    phone: "9876543211",
    specialization: "Electrical, Wiring & MCB SOS",
    rating: 4.8,
    completedCount: 518,
    isOnline: true,
    lat: 28.7345,
    lng: 77.7812,
    area: "Civil Lines / Model Town",
    walletBalance: 6120,
    toolKit: ["Insulation Megger", "Havells MCB Kit", "FRLS Wire Roll", "Heavy Drill Machine"],
  },
  {
    id: "ENG003",
    name: "Suresh Kumar",
    phone: "9876543212",
    specialization: "Fan, Geyser, Motor & Appliances",
    rating: 4.9,
    completedCount: 289,
    isOnline: true,
    lat: 28.7261,
    lng: 77.7704,
    area: "Railway Road / Indra Nagar",
    walletBalance: 3190,
    toolKit: ["SKF Bearing Puller", "2000W Geyser Element", "RO TDS Meter", "Standby Ceiling Fan"],
  },
]

export function AppProvider({ children }) {
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

  // Registered Engineers Pool (for Admin Desk & Geo-Radar)
  const [engineersList, setEngineersList] = useState(() => {
    const saved = localStorage.getItem("pluggy_engineers_pool")
    return saved ? JSON.parse(saved) : DEFAULT_ENGINEERS
  })

  // Cart State
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("pluggy_cart")
    return saved ? JSON.parse(saved) : []
  })

  // Recently Viewed Services State
  const [recent, setRecent] = useState(() => {
    const saved = localStorage.getItem("pluggy_recent")
    return saved ? JSON.parse(saved) : ["Foam-Jet Power AC Service", "Single / Double Pole MCB Replacement"]
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

  // Customer Preferences (Pet, Parking, Ladder, Preferred Time)
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

  // Requests State
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem("pluggy_requests")
    return saved ? JSON.parse(saved) : []
  })

  // Bookings State
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("pluggy_bookings")
    return saved ? JSON.parse(saved) : []
  })

  // City State
  const [city, setCity] = useState(() => {
    return localStorage.getItem("pluggy_city") || "Hapur / Delhi NCR"
  })

  // Address State
  const [address, setAddress] = useState(() => {
    return localStorage.getItem("pluggy_address") || ""
  })

  // Saved Addresses
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
            message: "15-Min Emergency SOS, Official Spare Parts Rate Card & 30-Day Warranty are now live.",
            time: "Just now",
            read: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            type: "offer",
            title: "Use Code SUMMER25",
            message: "Flat 25% OFF on Split & Window AC Foam-Jet Servicing.",
            time: "1 hour ago",
            read: false,
            createdAt: new Date().toISOString(),
          },
        ]
  })

  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("pluggy_theme") || "light"
  })

  // Apply Dark Mode class
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("pluggy_theme", theme)
  }, [theme])

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
  }, [requests])

  useEffect(() => {
    localStorage.setItem("pluggy_bookings", JSON.stringify(bookings))
  }, [bookings])

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

  // User Functions
  const loginUser = (userData) => setUser(userData)

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...updatedFields }
      const users = JSON.parse(localStorage.getItem("pluggy_users") || "[]")
      const updatedUsers = users.map((u) =>
        u.id === next.id || u.email === prev?.email ? { ...u, ...next } : u
      )
      localStorage.setItem("pluggy_users", JSON.stringify(updatedUsers))
      return next
    })
  }

  const logoutUser = () => {
    setUser(null)
    setCart([])
  }

  // Engineer Functions
  const loginEngineer = (engineerData) => {
    const found = engineersList.find((e) => e.id === engineerData.id)
    setEngineer(found || { ...engineerData, isOnline: true, rating: 4.9, walletBalance: 1500 })
  }

  const logoutEngineer = () => setEngineer(null)

  const toggleEngineerDuty = () => {
    if (!engineer) return
    const nextOnline = !engineer.isOnline
    const updated = { ...engineer, isOnline: nextOnline }
    setEngineer(updated)
    setEngineersList((prev) => prev.map((e) => (e.id === engineer.id ? updated : e)))
  }

  const registerNewEngineer = (engData) => {
    const newId = `ENG00${engineersList.length + 1}`
    const newEng = {
      id: newId,
      name: engData.name,
      phone: engData.phone,
      specialization: engData.specialization || "Electrical & Appliances",
      rating: 4.8,
      completedCount: 1,
      isOnline: true,
      lat: 28.731,
      lng: 77.776,
      area: engData.area || city,
      walletBalance: 500,
      toolKit: engData.toolKit || ["Standard Electrical Kit", "Digital Multimeter"],
    }
    setEngineersList((prev) => [...prev, newEng])
    setEngineer(newEng)
    return newEng
  }

  // Cart Functions
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
  }

  const removeFromCart = (idOrIssue) => {
    setCart((prev) =>
      prev.filter(
        (i) => i.id !== idOrIssue && i.issue !== idOrIssue && i.name !== idOrIssue
      )
    )
  }

  const clearCart = () => setCart([])

  // Recent Services Helper
  const addRecent = (serviceName) => {
    if (!serviceName) return
    setRecent((prev) => {
      const filtered = (prev || []).filter((item) => item !== serviceName)
      return [serviceName, ...filtered].slice(0, 8)
    })
  }

  // Coupon Helper
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

  // Wallet Helpers
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

  // Generate 4-digit OTPs
  const generate4DigitPin = () => String(Math.floor(1000 + Math.random() * 9000))

  // Request & Booking Functions (Full 7-Workflow Support)
  const addRequest = (request) => {
    const id = request.id || Date.now()
    const transactionId = request.transactionId || `PLG${id.toString().slice(-8)}`
    const startOtp = request.startOtp || generate4DigitPin()
    const happyOtp = request.happyOtp || generate4DigitPin()
    const bookingMode = request.bookingMode || (request.priority === "High" ? "SOS_15MIN" : "STANDARD")

    // If SOS 15-Min Emergency, auto-verify and assign nearest online engineer for instant response!
    const isSOS = bookingMode === "SOS_15MIN" || request.priority === "High"
    const onlineEng = engineersList.find((e) => e.isOnline) || DEFAULT_ENGINEERS[0]

    const normalized = {
      ...request,
      id,
      transactionId,
      bookingMode,
      priority: isSOS ? "High" : request.priority || "Medium",
      status: isSOS && request.autoAssignSOS ? "ENGINEER_ASSIGNED" : "PENDING_EXECUTIVE",
      assignedEngineerId: isSOS && request.autoAssignSOS ? onlineEng.id : request.assignedEngineerId || null,
      assignedEngineer: isSOS && request.autoAssignSOS ? onlineEng.name : request.assignedEngineer || null,
      assignedEngineerPhone: isSOS && request.autoAssignSOS ? onlineEng.phone : "9876543210",
      startOtp,
      happyOtp,
      address: request.address || request.userAddress || address || "Saved Location",
      userAddress: request.userAddress || request.address || address || "Saved Location",
      userName: request.userName || request.name || user?.name || "Customer",
      userPhone: request.userPhone || request.phone || user?.phone || "",
      userEmail: request.userEmail || user?.email || "",
      baseAmount: Number(request.baseAmount ?? request.amount ?? request.finalAmount ?? 0),
      partsAmount: Number(request.partsAmount ?? 0),
      amount: Number(request.amount ?? request.finalAmount ?? 0),
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

    setRequests((prev) => [normalized, ...prev.filter((r) => r.id !== normalized.id)])
    setBookings((prev) => [normalized, ...prev.filter((b) => b.id !== normalized.id)])

    addNotification({
      type: "service",
      title: isSOS ? "🚨 15-Min SOS Responder Activated!" : "Booking Confirmed!",
      message: `${normalized.service || "Service"} (${normalized.transactionId}) is booked. Start PIN: ${startOtp}`,
    })

    return normalized
  }

  const updateRequestStatus = (id, status, engineerData = {}) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, ...engineerData, updatedAt: new Date().toISOString() } : r))
    )
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status, ...engineerData, updatedAt: new Date().toISOString() } : b))
    )
  }

  // Workflow 2: Executive Desk Verifies Booking
  const verifyByExecutive = (requestId, noteOrKit = "", kitOrNote = "") => {
    const resolvedKit = Array.isArray(noteOrKit)
      ? noteOrKit.join(", ")
      : kitOrNote || noteOrKit || "Digital Multimeter, Spare Capacitor/MCB & Safety Gloves"
    const resolvedNote =
      typeof noteOrKit === "string" && kitOrNote
        ? noteOrKit
        : "Verified by Pluggy Executive Desk"

    const update = {
      status: "EXECUTIVE_VERIFIED",
      requiredKit: resolvedKit,
      executiveNote: resolvedNote,
      verifiedAt: new Date().toISOString(),
    }
    updateRequestStatus(requestId, "EXECUTIVE_VERIFIED", update)
    toast.success("Booking verified & mandatory toolkit locked!")
    addNotification({
      type: "update",
      title: "Booking Verified by Executive",
      message: `Request #${requestId.toString().slice(-6)} has been verified. Assigning nearest expert now.`,
    })
  }

  // Workflow 2/3: Assign Engineer
  const assignEngineer = (requestId, engineerId, engineerName) => {
    const engObj = engineersList.find((e) => e.id === engineerId)
    const update = {
      assignedEngineerId: engineerId,
      assignedEngineer: engineerName || engObj?.name || "Verified Expert",
      assignedEngineerPhone: engObj?.phone || "9876543210",
      assignedAt: new Date().toISOString(),
    }
    updateRequestStatus(requestId, "ENGINEER_ASSIGNED", update)
    toast.success(`Engineer ${update.assignedEngineer} assigned & dispatched!`)
    addNotification({
      type: "service",
      title: "👨‍🔧 Expert Assigned!",
      message: `${update.assignedEngineer} is on the way to your doorstep.`,
    })
  }

  // Workflow 3: Engineer Starts Job with 4-Digit Start OTP
  const startJobWithOtp = (requestId, enteredOtp) => {
    const target = requests.find((r) => r.id === requestId)
    if (!target) {
      toast.error("Booking not found")
      return false
    }
    if (enteredOtp && target.startOtp && enteredOtp.trim() !== target.startOtp) {
      toast.error(`Incorrect Start PIN! Ask customer for 4-digit Start PIN (${target.startOtp})`)
      return false
    }
    updateRequestStatus(requestId, "IN_PROGRESS", { startedAt: new Date().toISOString() })
    toast.success("Start PIN verified! Job is now IN PROGRESS.")
    addNotification({
      type: "update",
      title: "🔧 Service Started (PIN Verified)",
      message: `Your ${target.service} is now in progress.`,
    })
    return true
  }

  // Workflow 4: Engineer Adds Spare Part from Official Rate Card (Requires Customer Approval)
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
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r
        return {
          ...r,
          addedSpareParts: [...(r.addedSpareParts || []), newPartEntry],
        }
      })
    )
    toast.success(`Official quote for ${partName} (₹${part.price}) sent to customer!`)
    addNotification({
      type: "service",
      title: "📋 Spare Part Approval Requested",
      message: `Engineer requested to add ${partName} (₹${part.price}). Please Approve/Reject in Track Requests.`,
    })
  }

  // Workflow 4: Customer Approves or Rejects Spare Part Quote
  const respondToSparePartQuote = (requestId, entryId, isApproved) => {
    const nextStatus = isApproved ? "APPROVED" : "REJECTED"
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r
        const updatedParts = (r.addedSpareParts || []).map((p) =>
          p.entryId === entryId || p.uid === entryId
            ? { ...p, status: nextStatus, approvalStatus: nextStatus }
            : p
        )
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
    )
    toast.success(isApproved ? "Spare part quote approved!" : "Spare part quote rejected.")
  }

  // Workflow 4: Issue Standby Backup Appliance (Fan / Cooler / Stabilizer) when Motor/PCB goes to Workshop
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
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r
        const nextAmount = Number(r.amount || 0) + Number(dailyRent)
        return {
          ...r,
          standbyLoaner: loaner,
          amount: nextAmount,
        }
      })
    )
    toast.success(`${loanerItem} issued @ ₹${dailyRent}/day!`)
    addNotification({
      type: "update",
      title: "🔄 Standby Appliance Issued",
      message: `${loanerItem} (Receipt: ${loaner.receiptNo}) provided while your part is being repaired at the workshop.`,
    })
  }

  // Workflow 5: Complete Job with 4-Digit Happy OTP + Activate 30-Day Warranty + QR Health Sticker
  const completeJobWithOtp = (requestId, enteredOtp) => {
    const target = requests.find((r) => r.id === requestId)
    if (!target) {
      toast.error("Booking not found")
      return false
    }
    if (enteredOtp && target.happyOtp && enteredOtp.trim() !== target.happyOtp) {
      toast.error(`Incorrect Happy PIN! Ask customer for 4-digit Happy PIN (${target.happyOtp})`)
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
      completedAt: new Date().toISOString(),
      warrantyExpiresAt: expiry.toISOString(),
      warrantyValidTill: expiry.toISOString(),
      applianceQrId: qrCodeId,
      engineerPayout: payout,
    }

    updateRequestStatus(requestId, "COMPLETED", completionData)

    // Credit 80% service fee + 100% spare parts to engineer
    if (target.assignedEngineerId) {
      setEngineersList((prev) =>
        prev.map((e) =>
          e.id === target.assignedEngineerId
            ? {
                ...e,
                walletBalance: (e.walletBalance || 0) + payout,
                completedCount: (e.completedCount || 0) + 1,
                jobsCompleted: (e.jobsCompleted || e.completedCount || 0) + 1,
              }
            : e
        )
      )
      if (engineer && engineer.id === target.assignedEngineerId) {
        setEngineer((prev) => ({
          ...prev,
          walletBalance: (prev.walletBalance || 0) + payout,
          completedCount: (prev.completedCount || 0) + 1,
        }))
      }
    }

    toast.success(`Happy PIN verified! Job completed & ₹${payout} credited to Partner Wallet!`)
    addNotification({
      type: "service",
      title: "✅ Service Completed & 30-Day Warranty Active!",
      message: `Digital QR Health Card (${qrCodeId}) generated for your ${target.service}.`,
    })

    return true
  }

  // Workflow 6: Claim Free 30-Day Warranty Re-Visit
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
      cancelledAt: new Date().toISOString(),
      cancellationReason: reason,
    }
    updateRequestStatus(id, "CANCELLED", cancellationData)
  }

  const rateRequest = (id, rating, review = "") => {
    const ratingData = {
      rating,
      review,
      ratedAt: new Date().toISOString(),
    }
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...ratingData } : r)))
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, ...ratingData } : b)))
  }

  const addBooking = (booking) => addRequest(booking)

  // Saved Addresses Functions
  const addSavedAddress = (newAddress) => {
    setSavedAddresses((prev) => [...prev, { id: Date.now(), ...newAddress }])
  }

  const removeSavedAddress = (id) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id))
  }

  const updateSavedAddress = (id, updated) => {
    setSavedAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)))
  }

  // Notification Functions
  const addNotification = (notif) => {
    setNotifications((prev) => [
      { id: Date.now(), read: false, time: "Just now", createdAt: new Date().toISOString(), ...notif },
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

  // Theme Toggle
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  const value = {
    user,
    setUser,
    loginUser,
    updateUser,
    logoutUser,
    engineer,
    loginEngineer,
    logoutEngineer,
    toggleEngineerDuty,
    registerNewEngineer,
    engineersList,
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
