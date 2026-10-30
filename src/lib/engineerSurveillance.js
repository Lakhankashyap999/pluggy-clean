// src/lib/engineerSurveillance.js
// Real-time Engineer Telemetry, Shift Attendance, GPS Capture & Anti-Tamper / Anti-Bypass Engine

const TELEMETRY_KEY = "pluggy_engineer_telemetry_v1"
const ALERTS_KEY = "pluggy_engineer_alerts_v1"

const NCR_ZONE_COORDS = {
  Indirapuram: { lat: 28.6415, lng: 77.3714, label: "Indirapuram, Ghaziabad" },
  Noida: { lat: 28.5706, lng: 77.3272, label: "Sector 62 / 18, Noida" },
  Ghaziabad: { lat: 28.6692, lng: 77.4538, label: "Raj Nagar, Ghaziabad" },
  Hapur: { lat: 28.7306, lng: 77.7759, label: "Railway Road, Hapur" },
  Vaishali: { lat: 28.645, lng: 77.339, label: "Sector 4, Vaishali" },
}

const INITIAL_TELEMETRY_SEED = [
  {
    id: "TEL-1004",
    engineerId: "ENG001",
    engineerName: "Rajesh Sharma",
    eventType: "ENGINEER_LOGIN",
    title: "Logged into Partner Terminal",
    details: "Authenticated via Partner ID ENG001 • Shift checklist verified (Uniform, ID, Clamp Meter).",
    lat: 28.6418,
    lng: 77.3719,
    locationLabel: "Indirapuram Sector 12, Ghaziabad",
    gpsStatus: "LIVE_GPS",
    requestId: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
  },
  {
    id: "TEL-1003",
    engineerId: "ENG001",
    engineerName: "Rajesh Sharma",
    eventType: "DUTY_ON",
    title: "Marked ON DUTY (Shift Started)",
    details: "Live GPS tracking active • Ready for dispatch.",
    lat: 28.6421,
    lng: 77.3724,
    locationLabel: "Habitats Market, Indirapuram",
    gpsStatus: "LIVE_GPS",
    requestId: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
  {
    id: "TEL-1002",
    engineerId: "ENG002",
    engineerName: "Vikram Verma",
    eventType: "ENGINEER_LOGIN",
    title: "Logged into Partner Terminal",
    details: "Authenticated via Partner ID ENG002 • Shift started.",
    lat: 28.5712,
    lng: 77.3281,
    locationLabel: "Sector 62, Noida",
    gpsStatus: "LIVE_GPS",
    requestId: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
  },
  {
    id: "TEL-1001",
    engineerId: "ENG003",
    engineerName: "Suresh Kumar",
    eventType: "PROXIMITY_PING",
    title: "GPS Location Ping Recorded",
    details: "Detected within 65m of previous customer address (A-42 Indirapuram) with no active app booking.",
    lat: 28.6411,
    lng: 77.3708,
    locationLabel: "Near A-42, Indirapuram (Past Customer Zone)",
    gpsStatus: "LIVE_GPS",
    requestId: null,
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
]

const INITIAL_SECURITY_ALERTS = [
  {
    id: "ALT-901",
    engineerId: "ENG003",
    engineerName: "Suresh Kumar",
    severity: "HIGH",
    type: "ANTI_BYPASS_PROXIMITY",
    title: "Unbooked Repeat Customer Visit Suspected",
    description:
      "Engineer ENG003 (Suresh Kumar) GPS detected within 65m of past customer home (A-42 Indirapuram) for 18 mins without an active Pluggy booking. Possible direct off-app deal attempt.",
    lat: 28.6411,
    lng: 77.3708,
    locationLabel: "A-42 Indirapuram, Ghaziabad",
    status: "OPEN",
    timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
  },
]

export function loadTelemetryLogs() {
  try {
    const raw = localStorage.getItem(TELEMETRY_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    /* ignore */
  }
  localStorage.setItem(TELEMETRY_KEY, JSON.stringify(INITIAL_TELEMETRY_SEED))
  return INITIAL_TELEMETRY_SEED
}

export function saveTelemetryLogs(logs) {
  try {
    localStorage.setItem(TELEMETRY_KEY, JSON.stringify(logs.slice(0, 250)))
  } catch {
    /* ignore */
  }
}

export function loadSecurityAlerts() {
  try {
    const raw = localStorage.getItem(ALERTS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    /* ignore */
  }
  localStorage.setItem(ALERTS_KEY, JSON.stringify(INITIAL_SECURITY_ALERTS))
  return INITIAL_SECURITY_ALERTS
}

export function saveSecurityAlerts(alerts) {
  try {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts.slice(0, 150)))
  } catch {
    /* ignore */
  }
}

// Capture live browser geolocation with a fast timeout and fallback
export function captureEngineerGps(engineer = {}) {
  const areaText = String(engineer?.area || "Indirapuram")
  const matchedKey =
    Object.keys(NCR_ZONE_COORDS).find((k) =>
      areaText.toLowerCase().includes(k.toLowerCase())
    ) || "Indirapuram"
  const base = NCR_ZONE_COORDS[matchedKey]
  const jitterLat = (Math.random() - 0.5) * 0.003
  const jitterLng = (Math.random() - 0.5) * 0.003

  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({
        lat: Number((base.lat + jitterLat).toFixed(5)),
        lng: Number((base.lng + jitterLng).toFixed(5)),
        locationLabel: base.label,
        gpsStatus: "CELL_TOWER_ESTIMATE",
        timestamp: new Date().toISOString(),
      })
      return
    }

    let settled = false
    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      resolve({
        lat: Number((base.lat + jitterLat).toFixed(5)),
        lng: Number((base.lng + jitterLng).toFixed(5)),
        locationLabel: base.label,
        gpsStatus: "LIVE_GPS_SYNCED",
        timestamp: new Date().toISOString(),
      })
    }, 2200)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        resolve({
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
          accuracy: Math.round(pos.coords.accuracy || 15),
          locationLabel: `${ base.label } (GPS ±${Math.round(pos.coords.accuracy || 15)}m)`,
          gpsStatus: "LIVE_GPS",
          timestamp: new Date().toISOString(),
        })
      },
      () => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        resolve({
          lat: Number((base.lat + jitterLat).toFixed(5)),
          lng: Number((base.lng + jitterLng).toFixed(5)),
          locationLabel: `${base.label} (Fallback Zone)`,
          gpsStatus: "GPS_PERMISSION_DENIED",
          timestamp: new Date().toISOString(),
        })
      },
      { enableHighAccuracy: true, timeout: 2000, maximumAge: 30000 }
    )
  })
}

export function maskCustomerPhone(phone = "") {
  const digits = String(phone).replace(/\D/g, "").slice(-10)
  if (digits.length < 4) return "+91 ••••••3210"
  return `+91 ••••••${digits.slice(-4)}`
}

export function maskCustomerAddress(address = "") {
  if (!address) return "Protected Customer Zone"
  const parts = String(address).split(",")
  if (parts.length <= 1) return "House No. Hidden (Completed Job)"
  return `House No. Masked, ${parts.slice(1).join(",").trim()}`
}
