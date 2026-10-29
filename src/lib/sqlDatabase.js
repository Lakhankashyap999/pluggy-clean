// src/lib/sqlDatabase.js
// Relational SQL Database Engine with Persistent Tables & Real-Time Cross-Portal Sync

const DB_STORAGE_KEY = "pluggy_sql_relational_db_v2"
const SYNC_CHANNEL_NAME = "pluggy_sql_realtime_channel"

const INITIAL_SQL_TABLES = {
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
      password: "eng123",
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
      password: "eng123",
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
      password: "eng123",
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
      password: "eng123",
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
      password: "admin123",
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
}

let syncChannel = null
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    syncChannel = new BroadcastChannel(SYNC_CHANNEL_NAME)
  } catch (e) {
    syncChannel = null
  }
}

export function loadSqlDatabase() {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(INITIAL_SQL_TABLES))
      return INITIAL_SQL_TABLES
    }
    const parsed = JSON.parse(raw)
    return {
      users: parsed.users || INITIAL_SQL_TABLES.users,
      engineers: parsed.engineers || INITIAL_SQL_TABLES.engineers,
      admins: parsed.admins || INITIAL_SQL_TABLES.admins,
      service_requests: parsed.service_requests || INITIAL_SQL_TABLES.service_requests,
      payment_transactions:
        parsed.payment_transactions || INITIAL_SQL_TABLES.payment_transactions,
      order_history_logs: parsed.order_history_logs || INITIAL_SQL_TABLES.order_history_logs,
    }
  } catch (e) {
    return INITIAL_SQL_TABLES
  }
}

export function saveSqlDatabase(nextDb) {
  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(nextDb))
    if (syncChannel) {
      syncChannel.postMessage({ type: "SQL_DB_UPDATED", timestamp: Date.now() })
    }
    window.dispatchEvent(new CustomEvent("pluggy:sql-updated"))
  } catch (e) {
    console.error("SQL save error", e)
  }
}

export function subscribeToSqlChanges(callback) {
  const handleStorage = (e) => {
    if (e.key === DB_STORAGE_KEY) {
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

  window.addEventListener("storage", handleStorage)
  window.addEventListener("pluggy:sql-updated", handleCustom)
  if (syncChannel) {
    syncChannel.addEventListener("message", handleBroadcast)
  }

  return () => {
    window.removeEventListener("storage", handleStorage)
    window.removeEventListener("pluggy:sql-updated", handleCustom)
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
  saveSqlDatabase(INITIAL_SQL_TABLES)
  return INITIAL_SQL_TABLES
}
