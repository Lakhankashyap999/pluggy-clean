import { X } from "lucide-react"

export default function Cart({
  open,
  onClose,
  items,
  labourCharge,
  discount,
  finalTotal,
  onRemove,
  onProceed,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-[#1A2A49]">My Cart</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-600">
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
                <li
                  key={i}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{item.issue}</p>
                    <p className="text-sm text-gray-600">₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => onRemove(item.issue)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

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
            <button
              onClick={onProceed}
              className="mt-4 w-full py-3 bg-[#1A2A49] text-white rounded-lg hover:bg-[#223a61]"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
