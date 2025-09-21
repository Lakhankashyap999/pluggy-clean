import { useNavigate } from "react-router-dom"

export default function FilteredResults({ filters }) {
  const navigate = useNavigate()

  // Dummy data (isko baad me API ya services.json se connect kar sakte ho)
  const allServices = [
    {
      id: 1,
      name: "AC Cooling Issue",
      category: "AC Services",
      price: 499,
      description: "Expert technicians to fix AC cooling problems.",
    },
    {
      id: 2,
      name: "Fan Regulator Fix",
      category: "Fan & Motor",
      price: 299,
      description: "Repair or replace faulty fan regulators.",
    },
    {
      id: 3,
      name: "Switchboard Repair",
      category: "Wiring & Switchboards",
      price: 399,
      description: "Fix loose, burnt, or faulty switchboards safely.",
    },
  ]

  // Filter logic (basic for now)
  const results = allServices.filter(
    (s) =>
      (!filters.category || s.category === filters.category) &&
      (!filters.issue ||
        s.name.toLowerCase().includes(filters.issue.toLowerCase())) &&
      (!filters.price || checkPrice(s.price, filters.price))
  )

  function checkPrice(price, filter) {
    if (filter === "0-500") return price <= 500
    if (filter === "500-1000") return price > 500 && price <= 1000
    if (filter === "1000+") return price > 1000
    return true
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#1A2A49] mb-6 text-center sm:text-left">
        Filtered Results
      </h2>

      {results.length === 0 ? (
        <p className="text-gray-600 text-center">
          ❌ No services found. Try different filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl shadow-sm p-6 bg-white flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <h3 className="text-lg font-semibold text-[#1A2A49]">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {item.description}
                </p>
                <p className="mt-3 font-bold text-[#1A2A49]">₹{item.price}</p>
              </div>

              <div className="mt-4">
                <button
                  onClick={() =>
                    navigate(
                      `/request/${item.name.replace(/\s+/g, "-").toLowerCase()}`
                    )
                  }
                  className="w-full py-2 rounded-lg bg-[#1A2A49] text-white hover:bg-[#223a61] transition"
                >
                  Book Now
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center sm:text-left">
                  * Labour charge needs to be paid upfront
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
