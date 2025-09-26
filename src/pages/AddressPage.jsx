import { useState } from "react"
import { useApp } from "../AppContext"
import { MapPin, Plus, Trash2, Edit } from "lucide-react"
import toast from "react-hot-toast"
import BackButton from "../components/BackButton"

export default function AddressPage() {
  const { address, setAddress } = useApp()
  const [addresses, setAddresses] = useState(
    JSON.parse(localStorage.getItem("pluggy_addresses") || "[]")
  )
  const [formAddress, setFormAddress] = useState("")
  const [editingIndex, setEditingIndex] = useState(null)

  const saveToLocal = (updated) => {
    localStorage.setItem("pluggy_addresses", JSON.stringify(updated))
    setAddresses(updated)
  }

  const handleAdd = () => {
    if (!formAddress.trim()) {
      toast.error("Enter a valid address ❌")
      return
    }
    if (editingIndex !== null) {
      const updated = [...addresses]
      updated[editingIndex] = formAddress
      saveToLocal(updated)
      setEditingIndex(null)
      toast.success("Address updated ✅")
    } else {
      const updated = [...addresses, formAddress]
      saveToLocal(updated)
      toast.success("Address added ✅")
    }
    setFormAddress("")
  }

  const handleDelete = (index) => {
    const updated = addresses.filter((_, i) => i !== index)
    saveToLocal(updated)
    toast.success("Address removed 🗑")
  }

  const handleSelect = (addr) => {
    setAddress(addr)
    toast.success("Address selected ✅")
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <BackButton />
        <h2 className="text-xl font-bold text-[#1A2A49] mb-4">My Addresses</h2>

        {/* Address Form */}
        <div className="bg-white shadow rounded-xl p-4 mb-6">
          <textarea
            value={formAddress}
            onChange={(e) => setFormAddress(e.target.value)}
            placeholder="Enter full address..."
            rows={3}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2A49]"
          />
          <button
            onClick={handleAdd}
            className="mt-3 w-full bg-[#1A2A49] text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#223a61]"
          >
            <Plus size={16} /> {editingIndex !== null ? "Update Address" : "Add Address"}
          </button>
        </div>

        {/* Saved Addresses */}
        {addresses.length === 0 ? (
          <p className="text-gray-500 text-sm">No addresses saved yet.</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border shadow-sm bg-white flex justify-between items-start ${
                  address === addr ? "border-[#1A2A49]" : "border-gray-200"
                }`}
              >
                <div className="flex items-start gap-2">
                  <MapPin size={18} className="text-[#1A2A49] mt-1" />
                  <p className="text-sm text-gray-700">{addr}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setFormAddress(addr)
                      setEditingIndex(i)
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => handleSelect(addr)}
                    className="ml-2 px-3 py-1 bg-[#1A2A49] text-white text-xs rounded-lg hover:bg-[#223a61]"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
