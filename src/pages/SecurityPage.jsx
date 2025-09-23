// src/pages/SecurityPage.jsx
import { useApp } from "../AppContext"
import { Edit } from "lucide-react"

export default function SecurityPage() {
  const { user } = useApp()

  if (!user) return <p>Please log in first.</p>

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-[#1A2A49] mb-4">Login & Security</h2>
      <div className="border rounded-lg p-4 bg-white shadow">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <button className="mt-3 flex items-center gap-2 text-[#1A2A49] hover:underline">
          <Edit size={16}/> Edit
        </button>
      </div>
    </div>
  )
}
