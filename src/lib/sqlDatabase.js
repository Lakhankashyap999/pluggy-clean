// src/lib/sqlDatabase.js
// Relational SQL Database Engine with Persistent Tables, Quota-Safe Storage & Real-Time Cross-Device Cloud Sync

const DB_STORAGE_KEY = "pluggy_sql_relational_db_v2"
const SYNC_CHANNEL_NAME = "pluggy_sql_realtime_channel"

const STATUS_RANK = {
  PENDING_EXECUTIVE: 1,
  EXECUTIVE_VERIFIED: 2,
  ENGINEER_ASSIGNED: 3,
  IN_PROGRESS: 4,
  COMPLETED: 5,
  CANCELLED: 6,
}

export const INITIAL_SQL_TABLES = {
  resetAt: 0,
  deletedEngineerIds: [],
  users: [
    {
      id: "USR001",
      name: "Lakhan Kashyap",
      phone: "9876543210",
      email: "lakhan@pluggy.in",
      password: "password123",
      walletBalance: 500,
      city: "Delhi NCR",
      joinedAt: "2026-10-01T10:00:00.000Z",
    },
    {
      id: "USR002",
      name: "Rohit Sharma",
      phone: "9811223344",
      email: "rohit@gmail.com",
      password: "password123",
      walletBalance: 250,
      city: "Indirapuram, Ghaziabad",
      joinedAt: "2026-10-12T14:30:00.000Z",
    },
  ],

  engineers: [
    {
      id: "ENG001",
      name: "Rajesh Sharma",
      phone: "9876543210",
      email: "rajesh.eng@pluggy.in",
      password: "Pluggy@1001",
      specialization: "AC & Cooling, Refrigerator Master",
      rating: 4.9,
      completedCount: 342,
      isOnline: true,
      area: "Indirapuram / Sector 62",
      walletBalance: 4250,
      toolKit: ["Digital Clamp Meter", "Foam-Jet Pump", "Vacuum Pump", "35mfd Capacitor"],
    },
    {
      id: "ENG002",
      name: "Amit Verma",
      phone: "9876543211",
      email: "amit.eng@pluggy.in",
      password: "Pluggy@1002",
      specialization: "Electrical, Wiring & 15-Min MCB SOS",
      rating: 4.8,
      completedCount: 518,
      isOnline: true,
      area: "Noida / Ghaziabad / Hapur",
      walletBalance: 6120,
      toolKit: ["Insulation Megger", "Havells MCB Kit", "FRLS Wire Roll", "Heavy Drill"],
    },
    {
      id: "ENG003",
      name: "Suresh Kumar",
      phone: "9876543212",
      email: "suresh.eng@pluggy.in",
      password: "Pluggy@1003",
      specialization: "Fan, Geyser, Motor & Standby Units",
      rating: 4.9,
      completedCount: 289,
      isOnline: true,
      area: "Vaishali / Dwarka / West Delhi",
      walletBalance: 3190,
      toolKit: ["SKF Bearing Puller", "2000W Geyser Element", "Standby Ceiling Fan"],
    },
    {
      id: "ENG004",
      name: "Vikram Singh",
      phone: "9876543213",
      email: "vikram.eng@pluggy.in",
      password: "Pluggy@1004",
      specialization: "Shaadi Standby & 3-Phase Load Guard",
      rating: 4.9,
      completedCount: 195,
      isOnline: true,
      area: "South Delhi / Gurugram",
      walletBalance: 5400,
      toolKit: ["3-Phase Load Tester", "50m Armored Cable", "Backup Changeover Switch"],
    },
  ],

  admins: [
    {
      id: "ADM001",
      name: "Chief Dispatch Officer",
      email: "admin@pluggy.in",
      phone: "9999888877",
      password: "Lakhan@Admin999",
      role: "SUPER_ADMIN",
    },
  ],

  service_requests: [
    {
      id: 1730190001001,
      transactionId: "PLG26102901",
      userId: "USR001",
      userName: "Lakhan Kashyap",
      userPhone: "9876543210",
      userEmail: "lakhan@pluggy.in",
      service: "Split AC Power Foam-Jet Service",
      issue: "Split AC cooling low + water drop from indoor unit",
      address: "Plot 42, Indirapuram Habitat Centre, Ghaziabad",
      userAddress: "Plot 42, Indirapuram Habitat Centre, Ghaziabad",
      bookingMode: "STANDARD",
      priority: "Medium",
      status: "ENGINEER_ASSIGNED",
      assignedEngineerId: "ENG001",
      assignedEngineer: "Rajesh Sharma",
      assignedEngineerPhone: "9876543210",
      requiredKit: "High-Pressure AC Jet Pump + R32/R410a Gas Gauge",
      executiveNote: "Verified fault with customer; send 35mfd capacitor in kit.",
      startOtp: "4821",
      happyOtp: "9134",
      baseAmount: 499,
      partsAmount: 0,
      amount: 499,
      paymentStatus: "PAID_ESCROW",
      paymentMethod: "UPI (Google Pay)",
      addedSpareParts: [],
      standbyLoaner: null,
      createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    },
  ],

  payment_transactions: [
    {
      txnId: "PLG26102901",
      transactionId: "PLG26102901",
      bookingId: 1730190001001,
      requestId: 1730190001001,
      userName: "Lakhan Kashyap",
      customerName: "Lakhan Kashyap",
      userPhone: "9876543210",
      customerPhone: "9876543210",
      serviceName: "Split AC Power Foam-Jet Service",
      notes: "Split AC Power Foam-Jet Service (Escrow Booking)",
      amount: 499,
      paymentMethod: "UPI",
      paymentChannel: "Google Pay (lakhan@okaxis)",
      paymentType: "SERVICE_BOOKING",
      status: "SUCCESS",
      escrowState: "HELD_IN_ESCROW",
      createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    },
  ],

  order_history_logs: [
    {
      id: "LOG-1001",
      logId: "LOG-1001",
      bookingId: 1730190001001,
      requestId: 1730190001001,
      transactionId: "PLG26102901",
      actorRole: "USER",
      actorName: "Lakhan Kashyap",
      action: "BOOKING_CREATED",
      actionTitle: "BOOKING_CREATED",
      newStatus: "PENDING_EXECUTIVE",
      details: "Booked Split AC Power Foam-Jet Service (₹499) via UPI Escrow.",
      createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    },
    {
      id: "LOG-1002",
      logId: "LOG-1002",
      bookingId: 1730190001001,
      requestId: 1730190001001,
      transactionId: "PLG26102901",
      actorRole: "ADMIN",
      actorName: "Chief Dispatch Officer",
      action: "EXECUTIVE_VERIFIED_AND_ASSIGNED",
      actionTitle: "EXECUTIVE_VERIFIED_AND_ASSIGNED",
      previousStatus: "PENDING_EXECUTIVE",
      newStatus: "ENGINEER_ASSIGNED",
      details: "Locked AC Jet Pump toolkit & assigned Engineer Rajesh Sharma (ENG001).",
      createdAt: new Date(Date.now() - 3600 * 1000 * 1.5).toISOString(),
    },
  ],
  telemetry_logs: [],
  security_alerts: [],
}

let syncChannel = null
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    syncChannel = new BroadcastChannel(SYNC_CHANNEL_NAME)
  } catch {
    syncChannel = null
  }
}

function getRowKey(row) {
  if (!row || typeof row !== "object") return null
  return String(row.id ?? row.txnId ?? row.transactionId ?? row.logId ?? "").trim()
}

function getRowTime(row) {
  if (!row || typeof row !== "object") return 0
  const candidates = [
    row.updatedAt,
    row.completedAt,
    row.resolvedAt,
    row.workProofUploadedAt,
    row.startedAt,
    row.arrivedAt,
    row.travelStartedAt,
    row.assignedAt,
    row.verifiedAt,
    row.lastSeenAt,
    row.lastLogoutAt,
    row.lastLoginAt,
    row.shiftStartedAt,
    row.ratedAt,
    row.cancelledAt,
    row.createdAt,
    row.timestamp,
    row.joinedAt,
  ]
  let maxMs = 0
  for (const c of candidates) {
    if (!c) continue
    const ms = new Date(c).getTime()
    if (Number.isFinite(ms) && ms > maxMs) maxMs = ms
  }
  return maxMs
}

function pickNewerRow(a, b, tableName) {
  if (!a) return b
  if (!b) return a

  if (tableName === "service_requests") {
    const rankA = STATUS_RANK[a.status] || 0
    const rankB = STATUS_RANK[b.status] || 0
    if (rankB > rankA) return { ...a, ...b }
    if (rankA > rankB) return { ...b, ...a }
  }

  const timeA = getRowTime(a)
  const timeB = getRowTime(b)
  if (timeB >= timeA) {
    return { ...a, ...b }
  }
  return { ...b, ...a }
}

export function mergeTableRows(baseRows = [], incomingRows = [], tableName = "", deletedIds = []) {
  const deletedSet = new Set((deletedIds || []).map((id) => String(id)))
  const map = new Map()

  for (const row of Array.isArray(baseRows) ? baseRows : []) {
    const key = getRowKey(row)
    if (!key || deletedSet.has(key)) continue
    map.set(key, row)
  }

  for (const row of Array.isArray(incomingRows) ? incomingRows : []) {
    const key = getRowKey(row)
    if (!key || deletedSet.has(key)) continue
    if (!map.has(key)) {
      map.set(key, row)
    } else {
      map.set(key, pickNewerRow(map.get(key), row, tableName))
    }
  }

  const merged = Array.from(map.values())
  if (
    [
      "service_requests",
      "payment_transactions",
      "order_history_logs",
      "telemetry_logs",
      "security_alerts",
    ].includes(tableName)
  ) {
    merged.sort((x, y) => {
      const diff = getRowTime(y) - getRowTime(x)
      if (diff !== 0) return diff
      return (Number(y.id) || 0) - (Number(x.id) || 0)
    })
  }
  return merged
}

export function loadSqlDatabase() {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY)
    const legacyReqsRaw = localStorage.getItem("pluggy_requests")
    let legacyReqs = []
    if (legacyReqsRaw) {
      try {
        const parsedLegacy = JSON.parse(legacyReqsRaw)
        if (Array.isArray(parsedLegacy)) legacyReqs = parsedLegacy
      } catch {
        legacyReqs = []
      }
    }

    if (!raw) {
      const seeded = {
        ...INITIAL_SQL_TABLES,
        service_requests: mergeTableRows(
          INITIAL_SQL_TABLES.service_requests,
          legacyReqs,
          "service_requests"
        ),
      }
      safeWriteLocalStorage(DB_STORAGE_KEY, seeded)
      return seeded
    }

    const parsed = JSON.parse(raw)
    const deletedEngIds = parsed.deletedEngineerIds || []
    const defaultEngPassMap = {
      ENG001: "Pluggy@1001",
      ENG002: "Pluggy@1002",
      ENG003: "Pluggy@1003",
      ENG004: "Pluggy@1004",
    }
    const migratedEngineers = (parsed.engineers || INITIAL_SQL_TABLES.engineers)
      .filter((e) => !deletedEngIds.includes(String(e.id)))
      .map((e) => ({
        ...e,
        password:
          !e.password || e.password === "eng123"
            ? defaultEngPassMap[e.id] || `Pluggy@${String(e.id).replace(/\D/g, "") || "1005"}`
            : e.password,
      }))
    const migratedAdmins = (parsed.admins || INITIAL_SQL_TABLES.admins).map((a) => ({
      ...a,
      password: !a.password || a.password === "admin123" ? "Lakhan@Admin999" : a.password,
    }))
    return {
      resetAt: parsed.resetAt || 0,
      deletedEngineerIds: deletedEngIds,
      users: parsed.users || INITIAL_SQL_TABLES.users,
      engineers: migratedEngineers,
      admins: migratedAdmins,
      service_requests: mergeTableRows(
        parsed.service_requests || INITIAL_SQL_TABLES.service_requests,
        legacyReqs,
        "service_requests"
      ),
      payment_transactions:
        parsed.payment_transactions || INITIAL_SQL_TABLES.payment_transactions,
      order_history_logs: parsed.order_history_logs || INITIAL_SQL_TABLES.order_history_logs,
      telemetry_logs: parsed.telemetry_logs || [],
      security_alerts: parsed.security_alerts || [],
    }
  } catch {
    return INITIAL_SQL_TABLES
  }
}

function safeWriteLocalStorage(key, dbObj) {
  try {
    localStorage.setItem(key, JSON.stringify(dbObj))
    // Keep pluggy_requests in sync without duplicating heavy base64 images
    const lightRequests = (dbObj.service_requests || []).map((r) => ({
      ...r,
      faultPhotos: (r.faultPhotos || []).slice(0, 2),
      workProofPhotos: (r.workProofPhotos || []).slice(0, 2),
    }))
    localStorage.setItem("pluggy_requests", JSON.stringify(lightRequests))
    return true
  } catch (err) {
    // QuotaExceededError fallback: strip heavy base64 images from older records so bookings NEVER fail
    try {
      const compactDb = {
        ...dbObj,
        service_requests: (dbObj.service_requests || []).slice(0, 50).map((r, idx) =>
          idx < 5
            ? r
            : {
                ...r,
                faultPhotos: [],
                workProofPhotos: [],
              }
        ),
        order_history_logs: (dbObj.order_history_logs || []).slice(0, 80),
        telemetry_logs: (dbObj.telemetry_logs || []).slice(0, 60),
      }
      localStorage.removeItem("pluggy_bookings")
      localStorage.setItem(key, JSON.stringify(compactDb))
      localStorage.setItem("pluggy_requests", JSON.stringify(compactDb.service_requests))
      return true
    } catch (innerErr) {
      console.error("SQL storage fallback error", innerErr)
      return false
    }
  }
}

let isSyncingCloud = false

export async function syncWithCloudServer(options = { forceReset: false }) {
  if (typeof window === "undefined") return null
  if (isSyncingCloud && !options.forceReset) return null
  isSyncingCloud = true

  try {
    const localDb = loadSqlDatabase()
    const res = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        db: localDb,
        forceReset: Boolean(options.forceReset),
      }),
    })

    if (!res.ok) {
      isSyncingCloud = false
      return null
    }

    const data = await res.json()
    if (!data?.ok || !data?.db) {
      isSyncingCloud = false
      return null
    }

    const cloudDb = data.db
    const mergedDeletedEngIds = Array.from(
      new Set([
        ...(localDb.deletedEngineerIds || []),
        ...(cloudDb.deletedEngineerIds || []),
      ])
    )

    // If cloud had a newer resetAt, adopt cloud state
    const isCloudResetNewer = (cloudDb.resetAt || 0) > (localDb.resetAt || 0)
    const nextDb = isCloudResetNewer
      ? {
          ...INITIAL_SQL_TABLES,
          ...cloudDb,
        }
      : {
          resetAt: Math.max(localDb.resetAt || 0, cloudDb.resetAt || 0),
          deletedEngineerIds: mergedDeletedEngIds,
          users: mergeTableRows(localDb.users, cloudDb.users, "users"),
          engineers: mergeTableRows(
            localDb.engineers,
            cloudDb.engineers,
            "engineers",
            mergedDeletedEngIds
          ),
          admins: mergeTableRows(localDb.admins, cloudDb.admins, "admins"),
          service_requests: mergeTableRows(
            localDb.service_requests,
            cloudDb.service_requests,
            "service_requests"
          ),
          payment_transactions: mergeTableRows(
            localDb.payment_transactions,
            cloudDb.payment_transactions,
            "payment_transactions"
          ),
          order_history_logs: mergeTableRows(
            localDb.order_history_logs,
            cloudDb.order_history_logs,
            "order_history_logs"
          ),
          telemetry_logs: mergeTableRows(
            localDb.telemetry_logs,
            cloudDb.telemetry_logs,
            "telemetry_logs"
          ),
          security_alerts: mergeTableRows(
            localDb.security_alerts,
            cloudDb.security_alerts,
            "security_alerts"
          ),
        }

    // Check if request count or timestamps changed before firing UI update event
    const prevJson = JSON.stringify({
      r: (localDb.service_requests || []).map((x) => [x.id, x.status, x.updatedAt, x.assignedEngineerId, x.pinLocked]),
      e: (localDb.engineers || []).map((x) => [x.id, x.isOnline, x.walletBalance, x.completedCount, x.lastSeenAt]),
      p: (localDb.payment_transactions || []).length,
      l: (localDb.order_history_logs || []).length,
      t: (localDb.telemetry_logs || []).length,
      a: (localDb.security_alerts || []).map((x) => [x.id, x.status]),
    })
    const nextJson = JSON.stringify({
      r: (nextDb.service_requests || []).map((x) => [x.id, x.status, x.updatedAt, x.assignedEngineerId, x.pinLocked]),
      e: (nextDb.engineers || []).map((x) => [x.id, x.isOnline, x.walletBalance, x.completedCount, x.lastSeenAt]),
      p: (nextDb.payment_transactions || []).length,
      l: (nextDb.order_history_logs || []).length,
      t: (nextDb.telemetry_logs || []).length,
      a: (nextDb.security_alerts || []).map((x) => [x.id, x.status]),
    })

    safeWriteLocalStorage(DB_STORAGE_KEY, nextDb)
    if (prevJson !== nextJson) {
      window.dispatchEvent(new CustomEvent("pluggy:sql-updated"))
    }
    isSyncingCloud = false
    return nextDb
  } catch {
    isSyncingCloud = false
    return null
  }
}

export function saveSqlDatabase(nextDb, options = { syncCloud: true, forceReset: false }) {
  try {
    safeWriteLocalStorage(DB_STORAGE_KEY, nextDb)
    if (syncChannel) {
      syncChannel.postMessage({ type: "SQL_DB_UPDATED", timestamp: Date.now() })
    }
    window.dispatchEvent(new CustomEvent("pluggy:sql-updated"))
    if (options.syncCloud !== false) {
      syncWithCloudServer({ forceReset: Boolean(options.forceReset) })
    }
  } catch (e) {
    console.error("SQL save error", e)
  }
}

export function subscribeToSqlChanges(callback) {
  const handleStorage = (e) => {
    if (e.key === DB_STORAGE_KEY || e.key === "pluggy_requests") {
      callback(loadSqlDatabase())
    }
  }
  const handleCustom = () => {
    callback(loadSqlDatabase())
  }
  const handleBroadcast = (msg) => {
    if (msg?.data?.type === "SQL_DB_UPDATED") {
      callback(loadSqlDatabase())
    }
  }
  const handleVisibility = () => {
    if (document.visibilityState === "visible") {
      syncWithCloudServer()
    }
  }

  window.addEventListener("storage", handleStorage)
  window.addEventListener("pluggy:sql-updated", handleCustom)
  window.addEventListener("focus", handleVisibility)
  document.addEventListener("visibilitychange", handleVisibility)
  if (syncChannel) {
    syncChannel.addEventListener("message", handleBroadcast)
  }

  // Initial Cloud Pull/Push on mount + continuous 3-second Cross-Device Heartbeat
  syncWithCloudServer()
  const pollInterval = setInterval(() => {
    syncWithCloudServer()
  }, 3000)

  return () => {
    clearInterval(pollInterval)
    window.removeEventListener("storage", handleStorage)
    window.removeEventListener("pluggy:sql-updated", handleCustom)
    window.removeEventListener("focus", handleVisibility)
    document.removeEventListener("visibilitychange", handleVisibility)
    if (syncChannel) {
      syncChannel.removeEventListener("message", handleBroadcast)
    }
  }
}

export function insertSqlRow(tableName, row) {
  const db = loadSqlDatabase()
  const table = db[tableName] || []
  const updatedTable = [row, ...table]
  const nextDb = { ...db, [tableName]: updatedTable }
  saveSqlDatabase(nextDb)
  return row
}

export function executeSqlQuery(queryString = "SELECT * FROM service_requests") {
  const db = loadSqlDatabase()
  const clean = queryString.trim()
  const match = clean.match(/FROM\s+([a-zA-Z0-9_]+)/i)
  const tableName = match ? match[1].toLowerCase() : "service_requests"

  if (!db[tableName]) {
    return {
      tableName,
      rows: [],
      error: `Table '${tableName}' not found. Available tables: users, engineers, admins, service_requests, payment_transactions, order_history_logs`,
    }
  }
  return {
    table: tableName,
    tableName,
    rowCount: db[tableName].length,
    rows: db[tableName],
    error: null,
  }
}

export function resetSqlDatabaseToSeed() {
  const seeded = {
    ...INITIAL_SQL_TABLES,
    resetAt: Date.now(),
  }
  saveSqlDatabase(seeded, { syncCloud: true, forceReset: true })
  return seeded
}
