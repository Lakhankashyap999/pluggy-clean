// src/components/Cart.jsx
import { useState } from "react"
import { X, ShoppingBag, Trash2, MapPin, ArrowRight, Shield, Package } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useApp } from "../AppContext"
import PaymentPopup from "./PaymentPopup"
import toast from "react-hot-toast"

export default function Cart({ open, onClose }) {
  const { cart, removeFromCart, clearCart, addRequest, user, address, setAddress } = useApp()
  const [tempAddress, setTempAddress] = useState("")
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0), 0)
  const labourCharge = cart.length > 0 ? 50 : 0
  const discount = cart.length >= 3 ? subtotal * 0.15 : cart.length === 2 ? subtotal * 0.1 : 0
  const finalTotal = subtotal + labourCharge - discount

  const handleSaveAddress = () => {
    if (!tempAddress.trim()) {
      toast.error("Please enter address")
      return
    }
    setAddress(tempAddress)
    localStorage.setItem("pluggy_address", tempAddress)
    setTempAddress("")
    setShowAddressForm(false)
    toast.success("Address saved")
  }

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login first!")
      return
    }
    if (!address || address.trim() === "") {
      setShowAddressForm(true)
      return
    }
    setShowPayment(true)
  }

  const handlePaymentSuccess = (transactionId) => {
    const newRequest = {
      id: Date.now(),
      transactionId: transactionId,
      items: cart,
      issue: cart.map(i => i.issue).join(", "),
      service: cart.map(i => i.service || i.subcategory).join(", "),
      address: address,
      amount: finalTotal,
      status: "PENDING_EXECUTIVE",
      createdAt: new Date().toISOString(),
      userName: user?.name || "Guest",
      userPhone: user?.phone || "",
      userEmail: user?.email || "",
    }
    addRequest(newRequest)
    clearCart()
    setShowPayment(false)
    onClose()
    toast.success("Booking confirmed!")
  }

  const handleRemoveItem = (item) => {
    removeFromCart(item.issue)
    toast.success("Item removed")
  }

  if (!open) return null

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end font-inter"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col"
            >
              {/* Mobile Drag Handle */}
              <div className="sm:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3" />

              {/* Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#1A2A49] to-[#F37021] rounded-xl flex items-center justify-center shadow-md">
                    <ShoppingBag size={16} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[#1A2A49] font-poppins">Your Cart</h2>
                    {cart.length > 0 && (
                      <p className="text-xs text-gray-500">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
                    )}
                  </div>
                </div>
                <button onClick={onClose} className="p-2 -mr-2 sm:mr-0 hover:bg-gray-100 rounded-full transition">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto bg-gray-50/50">
                {cart.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center h-full px-6 py-12 text-center"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-full flex items-center justify-center mb-5 shadow-md">
                      <Package size={40} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#1A2A49] font-poppins mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 text-sm mb-6">Add services to get started</p>
                    <button 
                      onClick={onClose}
                      className="px-6 py-3 bg-gradient-to-r from-[#1A2A49] to-[#223a61] text-white rounded-full font-medium hover:shadow-lg transition text-sm"
                    >
                      Browse Services
                    </button>
                  </motion.div>
                ) : (
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <AnimatePresence>
                      {cart.map((item, index) => (
                        <motion.div
                          key={`${item.issue}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.03 }}
                          className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#F37021]/30 transition-all group"
                        >
                          <div className="flex items-start gap-2 sm:gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition flex-shrink-0">
                              <span className="text-xl sm:text-2xl">
                                {item.categoryKey === "ac-repair" ? "❄️" : 
                                 item.categoryKey === "fan-motor" ? "🌀" : 
                                 item.categoryKey === "wiring" ? "⚡" : "🔌"}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-[#1A2A49] text-sm truncate">{item.issue}</h4>
                              <p className="text-xs text-gray-500 mt-0.5 truncate">{item.service || item.subcategory || "Service"}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[#F37021] font-bold text-sm">₹{item.price}</span>
                                {item.originalPrice && (
                                  <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                                )}
                              </div>
                            </div>
                            <button 
                              onClick={() => handleRemoveItem(item)}
                              className="p-2 sm:p-3 -mr-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition flex-shrink-0"
                            >
                              <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 sm:p-5 pb-6 sm:pb-8 space-y-3 sm:space-y-4 shadow-lg safe-bottom">
                  {/* Address Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-semibold text-[#1A2A49] flex items-center gap-1.5">
                        <MapPin size={15} className="text-[#F37021]" /> Delivery Address
                      </label>
                      {address && !showAddressForm && (
                        <button 
                          onClick={() => {
                            setTempAddress(address)
                            setShowAddressForm(true)
                          }} 
                          className="text-xs text-[#F37021] font-medium hover:underline"
                        >
                          Change
                        </button>
                      )}
                    </div>
                    
                    {address && !showAddressForm ? (
                      <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-700 border border-gray-100">
                        {address}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <textarea
                          value={tempAddress}
                          onChange={(e) => setTempAddress(e.target.value)}
                          placeholder="Enter your complete address..."
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:border-transparent resize-none bg-gray-50 min-h-[70px]"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button 
                            onClick={handleSaveAddress} 
                            className="flex-1 py-2.5 bg-[#1A2A49] text-white rounded-xl text-sm font-medium hover:bg-[#223a61] transition active:scale-[0.98]"
                          >
                            Save Address
                          </button>
                          {address && (
                            <button 
                              onClick={() => {
                                setShowAddressForm(false)
                                setTempAddress("")
                              }} 
                              className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal ({cart.length})</span>
                      <span className="font-medium text-gray-800">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Labour Charge</span>
                      <span className="font-medium text-gray-800">₹{labourCharge}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Bundle Discount</span>
                        <span className="font-medium text-green-600">-₹{Math.round(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="font-bold text-[#1A2A49] text-base">Total</span>
                      <span className="font-bold text-[#F37021] text-lg sm:text-xl">₹{finalTotal}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={!address}
                    className={`w-full py-3.5 rounded-full font-semibold text-white flex items-center justify-center gap-2 transition-all text-sm sm:text-base ${
                      address 
                        ? "bg-gradient-to-r from-[#F37021] to-[#FF8C42] hover:shadow-lg active:scale-[0.98]" 
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Proceed to Checkout <ArrowRight size={18} />
                  </button>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-3 text-[10px] sm:text-xs text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Shield size={11} className="text-green-600" /> Secure
                    </span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block" />
                    <span>30-Day Warranty</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block" />
                    <span>Free Cancellation</span>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Popup */}
      <PaymentPopup
        open={showPayment}
        onClose={() => setShowPayment(false)}
        amount={finalTotal}
        onSuccess={handlePaymentSuccess}
      />
    </>
  )
}