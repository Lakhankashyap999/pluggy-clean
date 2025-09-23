// src/pages/AddressPage.jsx
import { useApp } from "../AppContext"

export default function AddressPage() {
  const { user } = useApp()

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-[#1A2A49] mb-4">Your Address</h2>
      {user?.address ? (
        <p>{user.address}</p>
      ) : (
        <p className="text-gray-600">No address saved.</p>
      )}
    </div>
  )
}
