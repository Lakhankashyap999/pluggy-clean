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

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {services.map((s, i) => (
        <motion.div
          key={i}
          variants={item}
          whileHover={{ y: -6, scale: 1.04 }}
          transition={{ type: "spring", stiffness: 220 }}
          onClick={() => navigate(`/services/${s.id}`)}
          className="bg-white rounded-2xl shadow-md hover:shadow-xl p-5 sm:p-6 cursor-pointer flex flex-col items-center text-center border border-gray-100"
        >
          <div className="h-14 w-14 flex items-center justify-center rounded-full bg-[#1A2A49]/10 mb-4">
            <s.icon size={28} className="text-[#1A2A49]" />
          </div>
          <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-[#1A2A49]">
            {s.title}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm mt-2">{s.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}
