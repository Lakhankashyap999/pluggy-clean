import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Wrench, Fan, Plug, Zap } from "lucide-react"

const services = [
  { id: "ac-repair", title: "AC Services", desc: "Repair & Installation", icon: Wrench },
  { id: "fan-motor", title: "Fan & Motor", desc: "Ceiling & Exhaust Fans", icon: Fan },
  { id: "wiring", title: "Wiring", desc: "Switchboards & Circuits", icon: Plug },
  { id: "electrical", title: "Electrical", desc: "Appliances & Fittings", icon: Zap },
]

export default function OurServices() {
  const navigate = useNavigate()

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-[#1A2A49] mb-10">Our Services</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 200 }}
            onClick={() => navigate(`/services/${s.id}`)}
            className="bg-white rounded-2xl shadow-md p-6 cursor-pointer hover:shadow-lg"
          >
            <s.icon size={28} className="mx-auto text-[#1A2A49]" />
            <h3 className="font-semibold mt-4">{s.title}</h3>
            <p className="text-gray-600 text-sm">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
