import { Wrench, Droplets, Sparkles, ShieldCheck } from "lucide-react"
import BackButton from "../components/BackButton"

export default function ServicesPage() {
  const categories = [
    {
      title: "Electrical Services",
      services: [
        {
          name: "AC Repair",
          desc: "AC repair, installation & gas refill",
          icon: <Wrench size={22} className="text-[#1A2A49]" />,
        },
        {
          name: "Fan & Motor",
          desc: "Fan repair, regulator & motor winding",
          icon: <Wrench size={22} className="text-[#1A2A49]" />,
        },
        {
          name: "Wiring",
          desc: "House wiring, short circuit & switchboards",
          icon: <Wrench size={22} className="text-[#1A2A49]" />,
        },
      ],
    },
    {
      title: "Home Cleaning",
      services: [
        {
          name: "Deep Cleaning",
          desc: "Kitchen, bathroom & full home cleaning",
          icon: <Sparkles size={22} className="text-[#1A2A49]" />,
        },
        {
          name: "Water Tank Cleaning",
          desc: "Professional water tank & sump cleaning",
          icon: <Droplets size={22} className="text-[#1A2A49]" />,
        },
      ],
    },
    {
      title: "Safety & Maintenance",
      services: [
        {
          name: "Pest Control",
          desc: "Protect your home from insects & pests",
          icon: <ShieldCheck size={22} className="text-[#1A2A49]" />,
        },
      ],
    },
  ]

  return (
    <div className="main-container max-w-5xl mx-auto px-4 py-6">
      <BackButton />

      {/* Page Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-[#1A2A49] mb-6 flex items-center gap-2">
        <Wrench size={22} className="text-[#1A2A49]" /> Our Services
      </h2>

      {/* Service Categories */}
      {categories.map((cat, i) => (
        <div key={i} className="mb-10">
          <h3 className="text-lg font-semibold text-[#1A2A49] mb-4">
            {cat.title}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cat.services.map((s, j) => (
              <div
                key={j}
                className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition flex flex-col"
              >
                <div className="flex items-center gap-3 mb-2">
                  {s.icon}
                  <h4 className="font-semibold text-[#1A2A49]">{s.name}</h4>
                </div>
                <p className="text-sm text-gray-600 flex-1">{s.desc}</p>
                <button className="mt-4 px-4 py-2 bg-[#1A2A49] text-white rounded-lg text-sm hover:bg-[#223a61] self-start">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* FAQ / Info Section */}
      <div className="mt-12 bg-gray-50 border rounded-xl p-6">
        <h3 className="font-semibold text-[#1A2A49] mb-3">
          Why choose Pluggy Services?
        </h3>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
          <li>Certified and background-verified professionals</li>
          <li>Transparent pricing with no hidden charges</li>
          <li>Flexible scheduling at your convenience</li>
          <li>Guaranteed service satisfaction</li>
        </ul>
      </div>
    </div>
  )
}
