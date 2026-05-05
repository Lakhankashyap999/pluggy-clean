// src/components/WhyChooseUs.jsx
import { motion } from "framer-motion"
import { Shield, Zap, Wallet, Award, Clock, ThumbsUp, Users, Star } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Verified Experts",
    desc: "Background checked & certified professionals",
    color: "bg-blue-50 text-blue-600",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    icon: Zap,
    title: "Same Day Service",
    desc: "Quick response within hours",
    color: "bg-amber-50 text-amber-600",
    gradient: "from-amber-500 to-amber-600"
  },
  {
    icon: Wallet,
    title: "Upfront Pricing",
    desc: "No hidden charges, pay only what's quoted",
    color: "bg-emerald-50 text-emerald-600",
    gradient: "from-emerald-500 to-emerald-600"
  },
  {
    icon: Award,
    title: "30-Day Warranty",
    desc: "Free service if issue persists",
    color: "bg-purple-50 text-purple-600",
    gradient: "from-purple-500 to-purple-600"
  }
]

const stats = [
  { value: "10K+", label: "Happy Customers", icon: Users },
  { value: "500+", label: "Expert Technicians", icon: Award },
  { value: "4.8", label: "Average Rating", icon: Star },
  { value: "24/7", label: "Support Available", icon: Clock },
]

export default function WhyChooseUs() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Stats Row - Mobile Friendly */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
          >
            <stat.icon size={24} className="text-[#F37021] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-white/70">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Features Grid - Clean Mobile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -3 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:border-white/40 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition`}>
                <feature.icon size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white text-lg mb-1">{feature.title}</h4>
                <p className="text-white/70 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex items-center justify-center gap-2 text-white/60 text-xs"
      >
        <ThumbsUp size={14} />
        <span>Trusted by 10,000+ families across Mumbai</span>
      </motion.div>
    </div>
  )
}