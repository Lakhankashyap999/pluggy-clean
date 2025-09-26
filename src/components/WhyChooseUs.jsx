import { motion } from "framer-motion"
import { ShieldCheck, Zap, BadgeCheck, Wallet } from "lucide-react"

const points = [
  { icon: ShieldCheck, title: "Verified Professionals", desc: "Our experts are background-checked & highly skilled." },
  { icon: Wallet, title: "Affordable Pricing", desc: "Transparent charges with no hidden fees." },
  { icon: Zap, title: "Quick Service", desc: "Get fast response & same-day service at your doorstep." },
  { icon: BadgeCheck, title: "Service Guarantee", desc: "Enjoy 30 days post-service guarantee with every job." },
]

export default function WhyChooseUs() {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
      <h3 className="text-xs sm:text-sm font-semibold text-[#1A2A49] tracking-wide uppercase">
        Why Choose Us
      </h3>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A2A49] mt-2 mb-8 sm:mb-12">
        Pluggy Advantage
      </h2>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8"
      >
        {points.map((p, i) => (
          <motion.div
            key={i}
            variants={item}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 lg:p-8 rounded-2xl shadow-md border hover:shadow-lg transition flex flex-col items-center text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1A2A49]/10 flex items-center justify-center text-[#1A2A49]">
                <p.icon size={26} />
              </div>
            </div>
            <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-[#1A2A49]">
              {p.title}
            </h4>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-2 leading-relaxed">
              {p.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
