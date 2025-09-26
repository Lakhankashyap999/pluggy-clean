import { Wrench } from "lucide-react"
import BackButton from "../components/BackButton"

export default function ServicesPage() {
  const services = [
    { name: "AC Repair", desc: "AC repair, installation & gas refill" },
    { name: "Fan & Motor", desc: "Fan repair, regulator & motor winding" },
    { name: "Wiring", desc: "House wiring, short circuit & switchboards" },
    { name: "Electrical Appliances", desc: "Geyser, fridge, washing machine etc." },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <BackButton />
      <h2 className="text-xl sm:text-2xl font-bold text-[#1A2A49] mb-6 flex items-center gap-2">
        <Wrench size={22} className="text-[#1A2A49]" /> Our Services
      </h2>

      <div className="grid sm:grid-cols-2 gap-4">
        {services.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition"
          >
            <h3 className="font-semibold text-[#1A2A49]">{s.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
