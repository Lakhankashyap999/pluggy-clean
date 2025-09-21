import { ShieldCheck, Zap, BadgeCheck, Wallet } from "lucide-react"

const points = [
  {
    icon: ShieldCheck,
    title: "Verified Professionals",
    desc: "Our experts are background-checked & highly skilled.",
  },
  {
    icon: Wallet,
    title: "Affordable Pricing",
    desc: "Transparent charges with no hidden fees.",
  },
  {
    icon: Zap,
    title: "Quick Service",
    desc: "Get fast response & same-day service at your doorstep.",
  },
  {
    icon: BadgeCheck,
    title: "Service Guarantee",
    desc: "Enjoy 30 days post-service guarantee with every job.",
  },
]

export default function WhyChooseUs() {
  return (
    <div className="text-center">
      <h3 className="text-sm font-semibold text-[#1A2A49] tracking-wide uppercase">
        Why Choose Us
      </h3>
      <h2 className="text-3xl font-bold text-[#1A2A49] mt-2 mb-10">
        Pluggy Advantage
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {points.map((p, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition"
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#1A2A49]/10 flex items-center justify-center text-[#1A2A49]">
                <p.icon size={26} />
              </div>
            </div>
            <h4 className="text-lg font-semibold text-[#1A2A49]">{p.title}</h4>
            <p className="text-sm text-gray-600 mt-2">{p.desc}</p>
        
          </div>
        ))}
      </div>
    </div>
  )
}
