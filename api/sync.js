// api/sync.js
// Vercel Serverless Real-Time Cross-Device SQL Sync Engine
// Syncs bookings, engineers, payments, audit logs, GPS telemetry & security alerts
// across Customer phones, Engineer phones, and Admin Control Desk devices.

import fs from "fs";
import path from "path";

const TMP_FILE = path.join("/tmp", "pluggy_cloud_sql_db_v2.json");

const STATUS_RANK = {
  PENDING_EXECUTIVE: 1,
  EXECUTIVE_VERIFIED: 2,
  ENGINEER_ASSIGNED: 3,
  IN_PROGRESS: 4,
  COMPLETED: 5,
  CANCELLED: 6,
};

function getRowKey(row) {
  if (!row || typeof row !== "object") return null;
  return String(
    row.id ?? row.txnId ?? row.transactionId ?? row.logId ?? ""
  ).trim();
}

function getRowTime(row) {
  if (!row || typeof row !== "object") return 0;
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
  ];
  let maxMs = 0;
  for (const c of candidates) {
    if (!c) continue;
    const ms = new Date(c).getTime();
    if (Number.isFinite(ms) && ms > maxMs) maxMs = ms;
  }
  return maxMs;
}

function pickNewerRow(a, b, tableName) {
  if (!a) return b;
  if (!b) return a;

  if (tableName === "service_requests") {
    const rankA = STATUS_RANK[a.status] || 0;
    const rankB = STATUS_RANK[b.status] || 0;
    if (rankB > rankA) return { ...a, ...b };
    if (rankA > rankB) return { ...b, ...a };
  }

  const timeA = getRowTime(a);
  const timeB = getRowTime(b);
  if (timeB >= timeA) {
    return { ...a, ...b };
  }
  return { ...b, ...a };
}

function mergeTableRows(baseRows = [], incomingRows = [], tableName = "", deletedIds = []) {
  const deletedSet = new Set((deletedIds || []).map((id) => String(id)));
  const map = new Map();

  for (const row of Array.isArray(baseRows) ? baseRows : []) {
    const key = getRowKey(row);
    if (!key || deletedSet.has(key)) continue;
    map.set(key, row);
  }

  for (const row of Array.isArray(incomingRows) ? incomingRows : []) {
    const key = getRowKey(row);
    if (!key || deletedSet.has(key)) continue;
    if (!map.has(key)) {
      map.set(key, row);
    } else {
      map.set(key, pickNewerRow(map.get(key), row, tableName));
    }
  }

  const merged = Array.from(map.values());
  // Sort newest first for requests, payments, logs, alerts, telemetry
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
      const diff = getRowTime(y) - getRowTime(x);
      if (diff !== 0) return diff;
      const numX = Number(x.id) || 0;
      const numY = Number(y.id) || 0;
      return numY - numX;
    });
  }
  return merged;
}

function loadCloudState() {
  if (globalThis.__PLUGGY_CLOUD_DB__) {
    return globalThis.__PLUGGY_CLOUD_DB__;
  }
  try {
    if (fs.existsSync(TMP_FILE)) {
      const raw = fs.readFileSync(TMP_FILE, "utf8");
      const parsed = JSON.parse(raw);
      globalThis.__PLUGGY_CLOUD_DB__ = parsed;
      return parsed;
    }
  } catch {
    // ignore tmp read error
  }
  const initial = {
    resetAt: 0,
    updatedAt: Date.now(),
    deletedEngineerIds: [],
    users: [],
    engineers: [],
    admins: [],
    service_requests: [],
    payment_transactions: [],
    order_history_logs: [],
    telemetry_logs: [],
    security_alerts: [],
  };
  globalThis.__PLUGGY_CLOUD_DB__ = initial;
  return initial;
}

function saveCloudState(state) {
  globalThis.__PLUGGY_CLOUD_DB__ = state;
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(state), "utf8");
  } catch {
    // ignore tmp write error
  }
}

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const current = loadCloudState();

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      db: current,
      serverTime: new Date().toISOString(),
    });
  }

  if (req.method === "POST") {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const incoming = body.db || body || {};

    // If Admin triggered a hard database reset
    if (body.forceReset && incoming.resetAt && incoming.resetAt > (current.resetAt || 0)) {
      const resetState = {
        resetAt: incoming.resetAt,
        updatedAt: Date.now(),
        deletedEngineerIds: [],
        users: incoming.users || [],
        engineers: incoming.engineers || [],
        admins: incoming.admins || [],
        service_requests: incoming.service_requests || [],
        payment_transactions: incoming.payment_transactions || [],
        order_history_logs: incoming.order_history_logs || [],
        telemetry_logs: incoming.telemetry_logs || [],
        security_alerts: incoming.security_alerts || [],
      };
      saveCloudState(resetState);
      return res.status(200).json({
        ok: true,
        db: resetState,
        serverTime: new Date().toISOString(),
      });
    }

    const mergedDeletedEngineers = Array.from(
      new Set([
        ...(current.deletedEngineerIds || []),
        ...(incoming.deletedEngineerIds || []),
      ])
    );

    const nextState = {
      resetAt: Math.max(current.resetAt || 0, incoming.resetAt || 0),
      updatedAt: Date.now(),
      deletedEngineerIds: mergedDeletedEngineers,
      users: mergeTableRows(current.users, incoming.users, "users"),
      engineers: mergeTableRows(
        current.engineers,
        incoming.engineers,
        "engineers",
        mergedDeletedEngineers
      ),
      admins: mergeTableRows(current.admins, incoming.admins, "admins"),
      service_requests: mergeTableRows(
        current.service_requests,
        incoming.service_requests,
        "service_requests"
      ).slice(0, 150),
      payment_transactions: mergeTableRows(
        current.payment_transactions,
        incoming.payment_transactions,
        "payment_transactions"
      ).slice(0, 200),
      order_history_logs: mergeTableRows(
        current.order_history_logs,
        incoming.order_history_logs,
        "order_history_logs"
      ).slice(0, 250),
      telemetry_logs: mergeTableRows(
        current.telemetry_logs,
        incoming.telemetry_logs,
        "telemetry_logs"
      ).slice(0, 200),
      security_alerts: mergeTableRows(
        current.security_alerts,
        incoming.security_alerts,
        "security_alerts"
      ).slice(0, 100),
    };

    saveCloudState(nextState);
    return res.status(200).json({
      ok: true,
      db: nextState,
      serverTime: new Date().toISOString(),
    });
  }

  return res.status(405).json({ ok: false, error: "Method not allowed" });
}
