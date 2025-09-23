// src/pages/CartPage.jsx
import { useApp } from "../AppContext"

export default function CartPage() {
  const { cart } = useApp()

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-[#1A2A49] mb-4">My Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <ul className="space-y-2">
          {cart.map((c, i) => (
            <li key={i} className="border p-2 rounded">
              {c.issue} — ₹{c.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
