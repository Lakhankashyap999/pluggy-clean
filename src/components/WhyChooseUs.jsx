import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  ShieldCheck,
  Clock,
  Receipt,
  RefreshCw,
  Siren,
  QrCode,
  CheckCircle2,
  XCircle,
  KeyRound,
  Users,
} from "lucide-react"

export default function WhyChooseUs() {
  const [activeTab, setActiveTab] = useState("pillars")

  const stats = [
    {
      number: "12,400+",
      label: "Happy Families",
      icon: <Users size={18} className="text-[#F37021]" />,
    },
    {
      number: "500+",
      label: "Police-Verified Techs",
      icon: <ShieldCheck size={18} className="text-emerald-400" />,
    },
    {
      number: "15 Mins",
      label: "SOS Rapid Response",
      icon: <Clock size={18} className="text-amber-400" />,
    },
    {
      number: "100%",
      label: "Fixed Spare Rate Card",
      icon: <Receipt size={18} className="text-[#F37021]" />,
    },
  ]

  const pillars = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#F37021]" />,
      title: "Police & Skill Verified Techs",
      desc: "Every engineer undergoes criminal background verification, Aadhaar check, and a 15-point toolkit audit.",
    },
    {
      icon: <Receipt className="w-6 h-6 text-[#F37021]" />,
      title: "Official Spare Parts Rate Card",
      desc: "Zero overcharging! Every capacitor, gas refill, and MCB has a fixed official rate locked inside the app.",
    },
    {
      icon: <KeyRound className="w-6 h-6 text-[#F37021]" />,
      title: "Dual-PIN Escrow Security",
      desc: "Share the Start PIN on arrival and the Happy PIN only after your appliance is tested and you are 100% satisfied.",
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-[#F37021]" />,
      title: "₹99/Day Standby Backup Unit",
      desc: "If your fan motor or PCB goes for 24-hour workshop repair, our engineer installs an instant backup fan/cooler.",
    },
    {
      icon: <Siren className="w-6 h-6 text-[#F37021]" />,
      title: "15-Min SOS & Shaadi Standby",
      desc: "Rapid emergency van for midnight short-circuits and dedicated standby electricians for home events.",
    },
    {
      icon: <QrCode className="w-6 h-6 text-[#F37021]" />,
      title: "30-Day QR Health Warranty",
      desc: "Every repair includes a 30-day digital warranty with 1-click ₹0 free re-visit directly from Track Requests.",
    },
  ]

  const comparisonRows = [
    {
      feature: "Spare Parts Pricing",
      pluggy: "100% Fixed Official In-App Rate Card",
      local: "Arbitrary quotes, 2x–3x markup on parts",
    },
    {
      feature: "Safety & Verification",
      pluggy: "Police Verified + Digital ID Badge",
      local: "Unverified individuals, zero accountability",
    },
    {
      feature: "Payment & Job Control",
      pluggy: "Dual-PIN (Share Happy PIN after satisfaction)",
      local: "Demands cash upfront, unfinished work",
    },
    {
      feature: "Workshop Repair Downtime",
      pluggy: "Instant ₹99/day Standby Backup Fan/Cooler",
      local: "Leaves family without fan/AC for 3–5 days",
    },
    {
      feature: "Post-Repair Warranty",
      pluggy: "30-Day Warranty + 1-Click ₹0 Free Re-Visit",
      local: "Stops answering calls after leaving gate",
    },
  ]

  return (
    <div className="w-full text-left">
      {/* 1. Compact 4 Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map((st, idx) => (
          <div
            key={idx}
            className="bg-[#223a61] border border-white/10 rounded-2xl p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-white">{st.number}</p>
              <p className="text-xs text-gray-300 font-medium mt-0.5">{st.label}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              {st.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 2. Clean View Switcher */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-[#132038] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab("pillars")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === "pillars"
                ? "bg-[#F37021] text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            🛡️ 6 Core Guarantees
          </button>
          <button
            onClick={() => setActiveTab("comparison")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === "comparison"
                ? "bg-[#F37021] text-white"
                : "text-gray-300 hover:text-white"
            }`}
          >
            ⚖️ Pluggy vs Local Mechanic
          </button>
        </div>
      </div>

      {/* 3A. Clean 6 Pillars (Horizontal Swipe on Mobile, 3-Col Grid on Desktop) */}
      {activeTab === "pillars" ? (
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto no-scrollbar snap-x pb-2">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="min-w-[260px] md:min-w-0 snap-start bg-white rounded-2xl p-5 border border-gray-200 shadow-xs"
            >
              <div className="w-11 h-11 rounded-xl bg-[#FFF3EC] flex items-center justify-center mb-3.5">
                {item.icon}
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-[#1A2A49] mb-1.5">
                {item.title}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      ) : (
        /* 3B. Clean Comparison Table */
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-md"
        >
          <div className="divide-y divide-gray-100">
            {comparisonRows.map((row, i) => (
              <div key={i} className="grid grid-cols-12 p-3.5 sm:px-6 gap-2.5 items-center">
                <div className="col-span-12 sm:col-span-4 font-extrabold text-[#1A2A49] text-xs sm:text-sm">
                  {row.feature}
                </div>
                <div className="col-span-12 sm:col-span-4 bg-emerald-50 rounded-xl p-2.5 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-emerald-950">{row.pluggy}</span>
                </div>
                <div className="col-span-12 sm:col-span-4 bg-red-50 rounded-xl p-2.5 flex items-center gap-2">
                  <XCircle size={15} className="text-red-500 shrink-0" />
                  <span className="text-xs text-red-900">{row.local}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
