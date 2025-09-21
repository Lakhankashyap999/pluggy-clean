import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useState } from "react"

export default function FilterDrawer({ open, onClose, onApply }) {
  const [filters, setFilters] = useState({
    category: "",
    issue: "",
    price: "",
    availability: "",
    rating: "",
  })

  const menus = [
    {
      label: "AC Services",
      items: [
        "Cooling Issue",
        "Water Leakage",
        "Gas Refill",
        "Installation / Uninstallation",
        "Remote Not Working",
        "Unusual Noise",
      ],
    },
    {
      label: "Fan & Motor",
      items: [
        "Slow Speed",
        "Noise Issue",
        "Regulator Problem",
        "Exhaust Fan Repair",
        "Motor Overheating",
        "Motor Winding",
      ],
    },
    {
      label: "Wiring & Switchboards",
      items: [
        "Switch Burnt",
        "Plug Point Not Working",
        "MCB Tripping",
        "Short Circuit",
        "Socket Loose",
        "Sparking Issue",
      ],
    },
    {
      label: "Appliances",
      items: [
        "Geyser Not Heating",
        "Geyser Leakage",
        "Refrigerator Cooling Issue",
        "Washing Machine Leakage",
        "Microwave Not Heating",
        "Induction Cooktop Issue",
        "Mixer / Grinder Problem",
      ],
    },
    {
      label: "Others",
      items: [
        "Tube Light Fuse",
        "LED Flickering",
        "Fancy Light Setup",
        "Bulb Holder Issue",
        "Emergency Light Problem",
        "Inverter Battery Issue",
        "Inverter Charging Problem",
        "Doorbell Not Working",
        "CCTV Connection",
        "Wi-Fi Power Point",
        "Smart Device Setup",
      ],
    },
  ]

  const resetFilters = () => {
    setFilters({ category: "", issue: "", price: "", availability: "", rating: "" })
  }

  const handleApply = () => {
    if (!filters.category && !filters.issue && !filters.price && !filters.availability && !filters.rating) {
      alert("Please select at least one filter before applying")
      return
    }
    onApply(filters) // send filters back to Dashboard
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 cursor-pointer"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: -350 }}
            animate={{ x: 0 }}
            exit={{ x: -350 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 h-full w-[320px] bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-[#1A2A49]">Filters</h2>
              <button onClick={onClose} aria-label="Close filters">
                <X className="text-gray-600 hover:text-black" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {/* Category + Issues */}
              <div>
                <h3 className="font-semibold mb-3 text-[#1A2A49]">Service Category</h3>
                {menus.map((menu) => (
                  <div key={menu.label} className="mb-4">
                    <p className="text-sm font-medium text-gray-700">{menu.label}</p>
                    <div className="ml-3 mt-1 space-y-2 text-sm text-gray-600">
                      {menu.items.map((item) => (
                        <label key={item} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="issue"
                            className="accent-[#1A2A49]"
                            checked={filters.issue === item}
                            onChange={() =>
                              setFilters({ ...filters, category: menu.label, issue: item })
                            }
                          />
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div>
                <h3 className="font-semibold mb-3 text-[#1A2A49]">Price Range</h3>
                {["0-500", "500-1000", "1000+"].map((p) => (
                  <label
                    key={p}
                    className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="price"
                      className="accent-[#1A2A49]"
                      checked={filters.price === p}
                      onChange={() => setFilters({ ...filters, price: p })}
                    />
                    ₹{p}
                  </label>
                ))}
              </div>

              {/* Availability */}
              <div>
                <h3 className="font-semibold mb-3 text-[#1A2A49]">Availability</h3>
                {["Today", "Tomorrow", "This Week"].map((a) => (
                  <label
                    key={a}
                    className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="availability"
                      className="accent-[#1A2A49]"
                      checked={filters.availability === a}
                      onChange={() => setFilters({ ...filters, availability: a })}
                    />
                    {a}
                  </label>
                ))}
              </div>

              {/* Ratings */}
              <div>
                <h3 className="font-semibold mb-3 text-[#1A2A49]">Ratings</h3>
                {["4+", "3+"].map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="rating"
                      className="accent-[#1A2A49]"
                      checked={filters.rating === r}
                      onChange={() => setFilters({ ...filters, rating: r })}
                    />
                    ⭐ {r}
                  </label>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t flex gap-3 sticky bottom-0 bg-white">
              <button
                className="flex-1 border rounded-md py-2 hover:bg-gray-100"
                onClick={resetFilters}
              >
                Clear All
              </button>
              <button
                className="flex-1 bg-[#1A2A49] text-white rounded-md py-2 hover:bg-[#223a61]"
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
