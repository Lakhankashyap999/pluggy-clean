// src/pages/RecentPage.jsx
import { useApp } from "../AppContext"

export default function RecentPage() {
  const { recent } = useApp() // assume context me save karte ho

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-[#1A2A49] mb-4">Recently Viewed</h2>
      {(!recent || recent.length === 0) ? (
        <p className="text-gray-600">No recently viewed services.</p>
      ) : (
        <ul className="space-y-2">
          {recent.map((item, i) => (
            <li key={i} className="border p-2 rounded">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
