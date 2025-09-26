import { useApp } from "../AppContext"
import BackButton from "../components/BackButton"

export default function RecentPage() {
  const { recent } = useApp()

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <BackButton />
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
