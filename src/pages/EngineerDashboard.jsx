// src/pages/EngineerDashboard.jsx
import { useState, useMemo } from "react";
import { useApp } from "../AppContext";
import { Wrench, PlusCircle, CheckCircle, LogOut, Phone } from "lucide-react";

export default function EngineerDashboard() {
  const { engineer, requests, setRequests, updateUserRequest } = useApp();

  const [expandedRequest, setExpandedRequest] = useState(null);
  const [newIssue, setNewIssue] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // ✅ Toast
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ✅ Update request status
  const updateRequestStatus = (id, newStatus) => {
    const updated = requests.map((req) =>
      req.id === id ? { ...req, status: newStatus } : req
    );
    setRequests(updated);
  };

  // ✅ Add/Edit/Delete Issue
  const handleAddIssue = (reqId) => {
    if (!newIssue || !newPrice) return showToast("Enter issue & price");
    const updated = requests.map((req) => {
      if (req.id === reqId) {
        const updatedIssues = [
          ...(req.selectedIssues || []),
          { issue: newIssue, price: parseInt(newPrice) },
        ];
        const newTotal =
          updatedIssues.reduce((sum, i) => sum + i.price, 0) + 50;
        const updatedReq = { ...req, selectedIssues: updatedIssues, amount: newTotal };
        if (updateUserRequest) updateUserRequest(reqId, updatedIssues, newTotal);
        return updatedReq;
      }
      return req;
    });
    setRequests(updated);
    setNewIssue(""); setNewPrice("");
    showToast("✅ Issue added");
  };

  const handleEditIssue = (reqId, index, updatedIssue, updatedPrice) => {
    const updated = requests.map((req) => {
      if (req.id === reqId) {
        const updatedIssues = [...req.selectedIssues];
        updatedIssues[index] = { issue: updatedIssue, price: parseInt(updatedPrice) };
        const newTotal =
          updatedIssues.reduce((sum, i) => sum + i.price, 0) + 50;
        const updatedReq = { ...req, selectedIssues: updatedIssues, amount: newTotal };
        if (updateUserRequest) updateUserRequest(reqId, updatedIssues, newTotal);
        return updatedReq;
      }
      return req;
    });
    setRequests(updated);
    showToast("✏️ Issue updated");
  };

  const handleDeleteIssue = (reqId, index) => {
    const updated = requests.map((req) => {
      if (req.id === reqId) {
        const updatedIssues = [...req.selectedIssues];
        updatedIssues.splice(index, 1);
        const newTotal =
          updatedIssues.reduce((sum, i) => sum + i.price, 0) + 50;
        const updatedReq = { ...req, selectedIssues: updatedIssues, amount: newTotal };
        if (updateUserRequest) updateUserRequest(reqId, updatedIssues, newTotal);
        return updatedReq;
      }
      return req;
    });
    setRequests(updated);
    showToast("🗑️ Issue removed");
  };

  // ✅ Filtered & searched
  const filteredRequests = useMemo(() => {
    return requests
      .filter((r) => (filterStatus === "All" ? true : r.status === filterStatus))
      .filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.phone.includes(search) ||
          r.service.toLowerCase().includes(search.toLowerCase())
      );
  }, [requests, search, filterStatus]);

  // ✅ Stats
  const stats = useMemo(() => {
    const total = requests.length;
    const confirmed = requests.filter((r) => r.status === "Confirmed").length;
    const inProgress = requests.filter((r) => r.status === "In Progress").length;
    const completed = requests.filter((r) => r.status === "Completed").length;
    const earnings = requests.reduce((sum, r) => sum + (r.amount || 0), 0);
    return { total, confirmed, inProgress, completed, earnings };
  }, [requests]);

  // ✅ Engineer login check
  if (!engineer) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Please log in as Engineer
      </div>
    );
  }

  // ✅ Priority color
  const getPriorityColor = (priority) => {
    if (priority === "High") return "bg-red-200 text-red-800";
    if (priority === "Medium") return "bg-yellow-200 text-yellow-800";
    return "bg-green-200 text-green-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      {/* Header */}
      <div className="bg-[#1A2A49] text-white px-6 py-4 flex flex-col sm:flex-row justify-between items-center shadow-md rounded-lg mb-6 gap-4">
        <h1 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
          <Wrench size={20} /> Engineer Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm sm:text-base opacity-90">
            Welcome, {engineer.name} 👨‍🔧
          </span>
          <button
            onClick={() => { localStorage.removeItem("engineer"); window.location.href = "/engineer-login"; }}
            className="bg-white text-[#1A2A49] px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center gap-1"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow p-4 rounded-lg text-center">
          <p className="text-gray-500 text-sm">Total Requests</p>
          <h2 className="text-2xl font-bold">{stats.total}</h2>
        </div>
        <div className="bg-white shadow p-4 rounded-lg text-center">
          <p className="text-gray-500 text-sm">In Progress</p>
          <h2 className="text-2xl font-bold">{stats.inProgress}</h2>
        </div>
        <div className="bg-white shadow p-4 rounded-lg text-center">
          <p className="text-gray-500 text-sm">Completed</p>
          <h2 className="text-2xl font-bold">{stats.completed}</h2>
        </div>
        <div className="bg-white shadow p-4 rounded-lg text-center">
          <p className="text-gray-500 text-sm">Earnings</p>
          <h2 className="text-2xl font-bold">₹{stats.earnings}</h2>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by service, user, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/2"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/4"
        >
          <option value="All">All Status</option>
          <option value="Confirmed">Confirmed</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Requests Table / Cards */}
      {filteredRequests.length === 0 ? (
        <div className="text-gray-600 text-center mt-12">No requests found.</div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((r) => (
            <div key={r.id} className="bg-white p-4 rounded-lg shadow flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
              <div className="flex-1">
                <h3 className="font-semibold text-[#1A2A49]">{r.service}</h3>
                <p className="text-sm text-gray-500">{r.name} | {r.phone}</p>
                <p className="mt-1 font-medium">Amount: ₹{r.amount || 0}</p>
                <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(r.priority || "Low")}`}>
                  {r.priority || "Low"}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 items-center">
                <select
                  value={r.status}
                  onChange={(e) => updateRequestStatus(r.id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option>Confirmed</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
                <button
                  onClick={() => setExpandedRequest(expandedRequest === r.id ? null : r.id)}
                  className="bg-[#1A2A49] text-white px-3 py-1 rounded hover:bg-[#223a61] text-sm"
                >
                  {expandedRequest === r.id ? "Close" : "Manage Issues"}
                </button>
                <a href={`tel:${r.phone}`} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-1 text-sm">
                  <Phone size={14} /> Call
                </a>
              </div>
            </div>
          ))}

          {/* Expanded Issues */}
          {expandedRequest && filteredRequests
            .filter((r) => r.id === expandedRequest)
            .map((req) => (
              <div key={req.id} className="bg-white p-4 rounded-lg shadow mt-2">
                <h4 className="font-semibold text-[#1A2A49] mb-2">Issues for {req.name}</h4>
                {req.selectedIssues?.length > 0 ? req.selectedIssues.map((issue, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-2 items-center mb-2">
                    <input
                      type="text"
                      value={issue.issue}
                      onChange={(e) => handleEditIssue(req.id, idx, e.target.value, issue.price)}
                      className="border p-2 rounded flex-1"
                    />
                    <input
                      type="number"
                      value={issue.price}
                      onChange={(e) => handleEditIssue(req.id, idx, issue.issue, e.target.value)}
                      className="border p-2 rounded w-24 text-center"
                    />
                    <button
                      onClick={() => handleDeleteIssue(req.id, idx)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )) : <p className="text-gray-500 italic">No issues added yet</p>}

                {/* Add New Issue */}
                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                  <input
                    type="text"
                    placeholder="Issue name"
                    value={newIssue}
                    onChange={(e) => setNewIssue(e.target.value)}
                    className="border p-2 rounded flex-1"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="border p-2 rounded w-24"
                  />
                  <button
                    onClick={() => handleAddIssue(req.id)}
                    className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 flex items-center gap-1"
                  >
                    <PlusCircle size={16} /> Add
                  </button>
                </div>
              </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#1A2A49] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle size={16} /> {toast}
        </div>
      )}
    </div>
  );
}
