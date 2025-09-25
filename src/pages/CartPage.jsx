// src/pages/CartPage.jsx
import { useApp } from "../AppContext"
import { useState } from "react"

export default function CartPage() {
  const { cart, address, setAddress } = useApp()
  const [tempAddress, setTempAddress] = useState("")
  const [showForm, setShowForm] = useState(false)

  const handleSave = () => {
    if (!tempAddress.trim()) return
    setAddress(tempAddress) // ✅ context + localStorage update
    setTempAddress("")
    setShowForm(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-[#1A2A49] mb-4">My Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          {/* Cart Items */}
          <ul className="space-y-2 mb-4">
            {cart.map((c, i) => (
              <li key={i} className="border p-2 rounded">
                {c.issue} — ₹{c.price}
              </li>
            ))}
          </ul>

          {/* Address Section */}
          <div className="border p-3 rounded mb-4">
            {address ? (
              <div className="flex justify-between items-center">
                <p>
                  <span className="font-semibold">Delivery Address:</span>{" "}
                  {address}
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="text-blue-600 text-sm"
                >
                  Change
                </button>
              </div>
            ) : (
              <p className="text-red-500 text-sm">
                ⚠ Please select a delivery address
              </p>
            )}

            {showForm && (
              <div className="mt-3">
                <textarea
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  placeholder="Enter your address..."
                  className="w-full border rounded px-3 py-2 text-sm"
                  rows={3}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-3 py-1 bg-gray-200 rounded text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-[#1A2A49] text-white rounded text-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
