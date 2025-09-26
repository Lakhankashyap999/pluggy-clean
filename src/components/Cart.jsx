import { useState } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useApp } from "../AppContext"
import PaymentPopup from "./PaymentPopup"   // ✅ import PaymentPopup

export default function Cart({
  open,
  onClose,
  items,
  labourCharge,
  discount,
  finalTotal,
}) {
  const { address, setAddress, removeFromCart, clearCart, addRequest, user } = useApp()
  const [tempAddress, setTempAddress] = useState("")
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [showPayment, setShowPayment] = useState(false)  // ✅ new state

  const handleSaveAddress = () => {
    if (!tempAddress.trim()) return
    setAddress(tempAddress)
    localStorage.setItem("pluggy_address", tempAddress)
    setTempAddress("")
    setShowAddressForm(false)
  }

  const handleCheckout = () => {
    if (!address || address.trim() === "") {
      setShowAddressForm(true)
      return
    }
    setShowPayment(true)   // ✅ open payment popup
  }

  if (!open) return null

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex justify-center items-center z-50"
          >
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl h-[90vh] flex flex-col overflow-hidden">
              
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h2 className="text-lg font-bold text-[#1A2A49]">My Cart</h2>
                <button
                  onClick={onClose}
                  className="text-gray-600 hover:text-red-600"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <p className="text-gray-600">Your cart is empty</p>
                ) : (
                  <ul className="space-y-4">
                    {items.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <div>
                          <p className="font-medium">{item.issue}</p>
                          <p className="text-sm text-gray-600">₹{item.price}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.issue)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Address Section */}
              {items.length > 0 && (
                <div className="px-6 py-3 border-t">
                  {address ? (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Delivery Address:</span>{" "}
                        {address}
                      </p>
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="text-blue-600 text-sm"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-red-500">
                      ⚠ Please add your address
                    </p>
                  )}

                  {showAddressForm && (
                    <div className="mt-3">
                      <textarea
                        value={tempAddress}
                        onChange={(e) => setTempAddress(e.target.value)}
                        placeholder="Enter your address..."
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none"
                        rows={3}
                      />
                      <div className="flex justify-end gap-3 mt-2">
                        <button
                          onClick={() => setShowAddressForm(false)}
                          className="px-4 py-1 bg-gray-200 rounded-lg text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveAddress}
                          className="px-4 py-1 bg-[#1A2A49] text-white rounded-lg text-sm"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Summary */}
              {items.length > 0 && (
                <div className="border-t px-6 py-4">
                  <div className="flex justify-between mb-2">
                    <span>Labour Charge</span>
                    <span>₹{labourCharge}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-[#1A2A49]">
                    <span>Total</span>
                    <span>₹{finalTotal}</span>
                  </div>

                  {/* Proceed Button */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCheckout}
                    className="mt-4 w-full py-3 bg-[#1A2A49] text-white rounded-lg hover:bg-[#223a61]"
                  >
                    Proceed to Checkout
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Payment Popup */}
          <PaymentPopup
            open={showPayment}
            onClose={() => setShowPayment(false)}
            amount={finalTotal}
            onSuccess={() => {
              const newRequest = {
                id: Date.now(),
                items,
                issue: items.map(i => i.issue).join(", "),
                service: items.map(i => i.service || "Service").join(", "),
                address,
                amount: finalTotal,
                status: "Pending",
                created_at: new Date().toLocaleString(),
                name: user?.name || "Guest",
              }
              addRequest(newRequest)
              clearCart()
              setShowPayment(false)
              onClose()
            }}
          />
        </>
      )}
    </AnimatePresence>
  )
}
