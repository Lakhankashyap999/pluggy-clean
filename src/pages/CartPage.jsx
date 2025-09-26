import { useApp } from "../AppContext"
import { useState } from "react"
import BackButton from "../components/BackButton"
import { Trash2, MapPin, ShoppingBag } from "lucide-react"

export default function CartPage() {
  const { cart, address, setAddress, setCart } = useApp()
  const [tempAddress, setTempAddress] = useState("")
  const [showForm, setShowForm] = useState(false)

  // Calculate totals
  const subtotal = cart.reduce((sum, c) => sum + (c.price || 0), 0)
  const labourCharge = subtotal > 0 ? 50 : 0
  const discount = subtotal > 500 ? 100 : 0
  const finalTotal = subtotal + labourCharge - discount

  const handleSave = () => {
    if (!tempAddress.trim()) return
    setAddress(tempAddress)
    localStorage.setItem("pluggy_address", tempAddress)
    setTempAddress("")
    setShowForm(false)
  }

  const removeItem = (index) => {
    const updated = cart.filter((_, i) => i !== index)
    setCart(updated)
    localStorage.setItem("pluggy_cart", JSON.stringify(updated))
  }

  return (
    <div className="main-container max-w-4xl mx-auto px-4 py-6">
      <BackButton />
      <h2 className="text-xl sm:text-2xl font-bold text-[#1A2A49] mb-6 flex items-center gap-2">
        <ShoppingBag size={22} /> My Cart
      </h2>

      {cart.length === 0 ? (
        // ✅ Empty Cart
        <div className="text-center py-16 bg-white rounded-xl shadow">
          <img
            src="https://illustrations.popsy.co/gray/empty-cart.svg"
            alt="Empty cart"
            className="w-48 mx-auto mb-6"
          />
          <h3 className="text-lg font-semibold text-gray-800">Your cart is empty</h3>
          <p className="text-gray-500 text-sm mb-5">
            Add some services to your cart and come back here to checkout.
          </p>
          <a
            href="/"
            className="px-6 py-2 bg-[#1A2A49] text-white rounded-lg hover:bg-[#223a61] text-sm font-medium shadow-md"
          >
            Explore Services
          </a>
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
                  <p className="text-sm text-gray-500">{c.service || "Selected Service"}</p>
                  <p className="text-sm font-medium text-gray-700 mt-1">₹{c.price}</p>
                </div>
                <button
                  onClick={() => removeItem(i)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary Box */}
          <div className="bg-white rounded-xl shadow-md p-5 h-fit">
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
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- ₹{discount}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-[#1A2A49]">
                <span>Total</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            {/* Address Section */}
            <div className="mt-6">
              <h4 className="font-semibold text-[#1A2A49] mb-2 flex items-center gap-2">
                <MapPin size={16} /> Delivery Address
              </h4>
              {address ? (
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-700">{address}</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="text-blue-600 text-xs hover:underline"
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

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <button className="w-full bg-[#1A2A49] text-white py-2 rounded-lg hover:bg-[#223a61] shadow">
                Proceed to Checkout
              </button>
              <a
                href="/"
                className="w-full inline-block text-center border border-[#1A2A49] py-2 rounded-lg text-[#1A2A49] hover:bg-gray-50 text-sm"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
