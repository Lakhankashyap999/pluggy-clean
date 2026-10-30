// src/pages/CartPage.jsx
import { useApp } from "../AppContext"
import { useState } from "react"
import BackButton from "../components/BackButton"
import { Trash2, MapPin, ShoppingBag, Package } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import PaymentPopup from "../components/PaymentPopup"
import FaultMediaUpload from "../components/FaultMediaUpload"
import toast from "react-hot-toast"

export default function CartPage() {
  const { cart, address, setAddress, city, setCart, clearCart, addRequest, user, appliedCoupon } = useApp()
  const [tempAddress, setTempAddress] = useState(address || "")
  const [showForm, setShowForm] = useState(!address)
  const [showPayment, setShowPayment] = useState(false)
  const navigate = useNavigate()

  const subtotal = cart.reduce((sum, c) => sum + Number(c.price || 0), 0)
  const labourCharge = subtotal > 0 ? 50 : 0
  const baseDiscount = subtotal > 500 ? 100 : 0
  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.round((subtotal * appliedCoupon.value) / 100)
      : appliedCoupon.value
    : 0
  const discount = Math.max(baseDiscount, couponDiscount)
  const finalTotal = Math.max(0, subtotal + labourCharge - discount)

  const resolveEffectiveAddress = () => {
    const candidate = (tempAddress || "").trim() || (address || "").trim() || city || "Delhi NCR"
    if (candidate && candidate !== address) {
      setAddress(candidate)
      localStorage.setItem("pluggy_address", candidate)
    }
    return candidate
  }

  const handleSave = () => {
    if (!tempAddress.trim()) {
      toast.error("Please enter your address")
      return
    }
    setAddress(tempAddress.trim())
    localStorage.setItem("pluggy_address", tempAddress.trim())
    setShowForm(false)
    toast.success("Address saved")
  }

  const removeItem = (index) => {
    const updated = cart.filter((_, i) => i !== index)
    setCart(updated)
    localStorage.setItem("pluggy_cart", JSON.stringify(updated))
    toast.success("Item removed")
  }

  const handleCheckout = () => {
    resolveEffectiveAddress()
    setShowPayment(true)
  }

  const handleInstantBookPayLater = () => {
    const finalAddr = resolveEffectiveAddress()
    const newRequest = {
      id: Date.now(),
      transactionId: `PLG${Date.now().toString().slice(-8)}`,
      paymentMethod: "PAY_AFTER_SERVICE",
      paymentChannel: "Pay After Happy-PIN Satisfaction",
      paymentStatus: "PAY_ON_COMPLETION",
      items: cart,
      issue: cart.map((c) => c.issue || c.name).join(", "),
      service: [...new Set(cart.map((c) => c.service || c.categoryName || c.subcategory || c.name || "Service"))].join(", "),
      address: finalAddr,
      userAddress: finalAddr,
      amount: finalTotal,
      status: "PENDING_EXECUTIVE",
      createdAt: new Date().toISOString(),
      userName: user?.name || "Pluggy Customer",
      userPhone: user?.phone || "+91 9876543210",
      userEmail: user?.email || "customer@pluggy.in",
    }
    addRequest(newRequest)
    clearCart()
    toast.success("Booking Confirmed & Sent to Admin Control Desk! ✅")
    navigate("/track")
  }

  return (
    <div className="main-container max-w-4xl mx-auto px-4 py-6">
      <BackButton />
      <h2 className="text-xl sm:text-2xl font-bold text-[#1A2A49] mb-6 mt-2 flex items-center gap-2">
        <ShoppingBag size={22} className="text-[#F37021]" /> My Cart
      </h2>

      {cart.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={36} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Your cart is empty</h3>
          <p className="text-gray-500 text-sm mb-5">
            Add some services to your cart and come back here to checkout.
          </p>
          <Link
            to="/book-service"
            className="px-6 py-2.5 bg-[#1A2A49] text-white rounded-lg hover:bg-[#223a61] text-sm font-medium shadow-md"
          >
            Explore Services
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((c, i) => (
              <div
                key={i}
                className="bg-white border rounded-xl shadow-sm p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold text-[#1A2A49]">{c.issue}</h3>
                  <p className="text-sm text-gray-500">{c.service || c.subcategory || "Selected Service"}</p>
                  <p className="text-sm font-bold text-[#F37021] mt-1">₹{c.price}</p>
                </div>
                <button
                  onClick={() => removeItem(i)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary Box */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 h-fit">
            <h3 className="font-semibold text-[#1A2A49] mb-4">Price Summary</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Labour Charges</span>
                <span>₹{labourCharge}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount {appliedCoupon ? `(${appliedCoupon.code})` : ""}</span>
                  <span>- ₹{discount}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-base text-[#1A2A49]">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            {/* Address Section */}
            <div className="mt-6">
              <h4 className="font-semibold text-[#1A2A49] mb-2 flex items-center gap-2">
                <MapPin size={16} className="text-[#F37021]" /> Delivery Address
              </h4>
              {address ? (
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{address}</p>
                  <button
                    onClick={() => {
                      setTempAddress(address)
                      setShowForm(true)
                    }}
                    className="text-[#F37021] font-medium text-xs hover:underline ml-2"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <p className="text-red-500 text-sm">⚠ Please add your address</p>
              )}

              {showForm && (
                <div className="mt-3">
                  <textarea
                    value={tempAddress}
                    onChange={(e) => setTempAddress(e.target.value)}
                    placeholder="Enter your address..."
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    rows={3}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setShowForm(false)}
                      className="px-3 py-1.5 bg-gray-200 rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-1.5 bg-[#1A2A49] text-white rounded-lg text-sm"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <FaultMediaUpload />
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-2.5">
              <button
                onClick={handleInstantBookPayLater}
                className="w-full bg-[#F37021] text-white py-3 rounded-xl hover:bg-[#e05e15] font-extrabold text-sm shadow"
              >
                ⚡ Instant Book Now (Pay After Service)
              </button>
              <button
                onClick={handleCheckout}
                className="w-full bg-[#1A2A49] text-white py-2.5 rounded-xl hover:bg-[#223a61] font-bold text-sm shadow"
              >
                💳 Pay Online & Checkout (₹{finalTotal})
              </button>
              <Link
                to="/"
                className="w-full inline-block text-center border border-[#1A2A49] py-2 rounded-xl text-[#1A2A49] hover:bg-gray-50 text-sm font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Payment Popup */}
      <PaymentPopup
        open={showPayment}
        onClose={() => setShowPayment(false)}
        amount={finalTotal}
        onSuccess={(transactionId, paymentMeta = {}) => {
          const newRequest = {
            id: Date.now(),
            transactionId: transactionId || paymentMeta?.transactionId || `PLG${Date.now().toString().slice(-8)}`,
            paymentMethod: paymentMeta?.paymentMethod || "UPI",
            paymentChannel: paymentMeta?.paymentChannel || "Pluggy Instant UPI",
            paymentStatus:
              paymentMeta?.paymentMethod === "PAY_AFTER_SERVICE"
                ? "PAY_ON_COMPLETION"
                : "ESCROW_HELD",
            items: cart,
            issue: cart.map((c) => c.issue).join(", "),
            service: [...new Set(cart.map((c) => c.service || c.subcategory || "Service"))].join(", "),
            address,
            userAddress: address,
            amount: finalTotal,
            status: "PENDING_EXECUTIVE",
            createdAt: new Date().toISOString(),
            userName: user?.name || "Pluggy Customer",
            userPhone: user?.phone || "+91 9876543210",
            userEmail: user?.email || "customer@pluggy.in",
          }

          addRequest(newRequest)
          clearCart()
          setShowPayment(false)
          toast.success("Booking confirmed!")
          navigate("/track")
        }}
      />
    </div>
  )
}
