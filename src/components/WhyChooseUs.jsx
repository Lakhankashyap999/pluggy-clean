import React, { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  ShieldCheck,
  Clock,
  Receipt,
  Award,
  RefreshCw,
  Siren,
  QrCode,
  CheckCircle2,
  XCircle,
  KeyRound,
  ArrowRight,
  Users,
  Sparkles,
  Wrench,
} from "lucide-react"
export default function WhyChooseUs() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("pillars") // "pillars" | "comparison"

  const openRateCardModal = () => {
    window.dispatchEvent(new CustomEvent("pluggy:open-rate-card", { detail: { category: "ac-repair" } }))
  }

  const openConsultModal = (tab = "sos") => {
    window.dispatchEvent(new CustomEvent("pluggy:open-consult", { detail: { tab } }))
  }

  const stats = [
    {
      number: "12,400+",
      label: "Happy Families Served",
      sub: "Across Delhi NCR & Mumbai",
      icon: <Users size={20} className="text-[#F37021]" />,
    },
    {
      number: "500+",
      label: "Police-Verified Techs",
      sub: "3-Stage Skill & ID Audited",
      icon: <ShieldCheck size={20} className="text-emerald-400" />,
    },
    {
      number: "15 Mins",
      label: "SOS Rapid Dispatch",
      sub: "For Short Circuit & Event Faults",
      icon: <Clock size={20} className="text-amber-400" />,
    },
    {
      number: "100%",
      label: "Fixed Spare Rate Card",
      sub: "Zero Hidden Mechanic Markup",
      icon: <Receipt size={20} className="text-[#F37021]" />,
    },
  ]

  const pillars = [
    {
      badge: "100% Safe Entry",
      icon: <ShieldCheck className="w-6 h-6 text-[#F37021]" />,
      title: "Police & Skill Verified Engineers",
      desc: "Har Pluggy partner ka criminal background check, Aadhaar verification aur 15-point toolkit audit hota hai before onboarding.",
      highlight: "Live Gate Pass + Photo ID in Track Page",
      actionLabel: "Book Verified Tech",
      onAction: () => navigate("/services"),
    },
    {
      badge: "Anti-Fraud Pricing",
      icon: <Receipt className="w-6 h-6 text-[#F37021]" />,
      title: "In-App Official Spare Parts Rate Card",
      desc: "Local mechanic ki tarah muh-maanga daam nahi! Capacitor, Gas Refill, MCB ya Motor Winding—har part ka official fixed rate app me lock rehta hai.",
      highlight: "Approve Digital Estimate Before Work",
      actionLabel: "Check Official Rate Card",
      onAction: () => openRateCardModal(),
    },
    {
      badge: "Customer Control",
      icon: <KeyRound className="w-6 h-6 text-[#F37021]" />,
      title: "Dual-PIN Security (Start + Happy PIN)",
      desc: "Engineer tabhi job start karega jab aap 4-digit Start PIN denge, aur payment/closure tabhi hoga jab aap संतुष्ट hokar Happy PIN share karenge.",
      highlight: "100% Money-Back & Escrow Protection",
      actionLabel: "Track Active PINs",
      onAction: () => navigate("/track"),
    },
    {
      badge: "Pluggy Exclusive",
      icon: <RefreshCw className="w-6 h-6 text-[#F37021]" />,
      title: "₹99/Day Standby Backup Appliance",
      desc: "Agar aapka Fan motor ya AC PCB 24-hour workshop repair ke liye jata hai, toh garmi me pareshan mat hon—hum turant Standby Fan/Cooler lagate hain.",
      highlight: "Zero Downtime For Your Family",
      actionLabel: "Explore Appliance Care",
      onAction: () => navigate("/services/fan-motor"),
    },
    {
      badge: "Zero Panic Guarantee",
      icon: <Siren className="w-6 h-6 text-[#F37021]" />,
      title: "15-Min Emergency SOS & Shaadi Standby",
      desc: "Raat ko MCB trip ho jaye ya ghar ke function/shaadi me load sambhalna ho—Pluggy ka rapid response van aur dedicated event engineer hamesha ready hai.",
      highlight: "24/7 Control Room Priority Dispatch",
      actionLabel: "Trigger 15-Min SOS",
      onAction: () => openConsultModal("sos"),
    },
    {
      badge: "Post-Service Assurance",
      icon: <QrCode className="w-6 h-6 text-[#F37021]" />,
      title: "30-Day QR Appliance Health Warranty",
      desc: "Har repair ke baad digital health card aur 30-day warranty milti hai. Agar same issue dobara aaye, toh 1-click me ₹0 Free Re-Visit claim karein!",
      highlight: "Priority Same-Day Warranty Re-Visit",
      actionLabel: "View Warranty Hub",
      onAction: () => navigate("/track"),
    },
  ]

  const comparisonRows = [
    {
      feature: "Spare Parts Pricing",
      pluggy: "100% Fixed Official In-App Rate Card (With Bill)",
      local: "Arbitrary quotes, 2x–3x markup on capacitors & gas",
    },
    {
      feature: "Safety & Background Check",
      pluggy: "Police Verified + Digital ID Badge + Toolkit Audit",
      local: "Unknown unverified individuals, zero accountability",
    },
    {
      feature: "Job Control & Payment",
      pluggy: "Dual-PIN (Start PIN + Happy PIN after satisfaction)",
      local: "Demands cash upfront, arguments over unfinished work",
    },
    {
      feature: "Workshop Repair Downtime",
      pluggy: "Instant ₹99/day Standby Backup Fan/Cooler/Heater",
      local: "Leaves family without fan/AC for 3–5 days",
    },
    {
      feature: "Post-Repair Warranty",
      pluggy: "30-Day Digital Warranty + 1-Click ₹0 Free Re-Visit",
      local: "Stops picking up calls once they leave your gate",
    },
    {
      feature: "Pre-Visit Fault Diagnosis",
      pluggy: "₹29 Live Video Call Diagnosis (Adjusted in Final Bill)",
      local: "Charges ₹200–₹300 visit fee just to look at the fault",
    },
  ]

  return (
    <div className="w-full text-left">
      {/* 1. Top 4 Live Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8 sm:mb-10">
        {stats.map((st, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            className="bg-[#223a61]/90 border border-white/15 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg hover:border-[#F37021]/60 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                {st.number}
              </span>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                {st.icon}
              </div>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">{st.label}</p>
              <p className="text-[11px] text-gray-300 mt-0.5">{st.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. View Switcher Tabs (6 Core Pillars vs Pluggy vs Local Mechanic) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-[#223a61]/60 border border-white/10 p-3 sm:p-4 rounded-2xl">
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <div className="w-9 h-9 rounded-xl bg-[#F37021] text-white flex items-center justify-center shrink-0 hidden sm:flex">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm sm:text-base">
              The Pluggy 6-Point Gold Standard
            </h3>
            <p className="text-gray-300 text-xs">
              Built specifically to solve Indian household electrical & appliance headaches
            </p>
          </div>
        </div>

        <div className="flex items-center bg-[#1A2A49] p-1 rounded-xl border border-white/15 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("pillars")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === "pillars"
                ? "bg-[#F37021] text-white shadow"
                : "text-gray-300 hover:text-white"
            }`}
          >
            🛡️ 6 Core Guarantees
          </button>
          <button
            onClick={() => setActiveTab("comparison")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === "comparison"
                ? "bg-[#F37021] text-white shadow"
                : "text-gray-300 hover:text-white"
            }`}
          >
            ⚖️ Pluggy vs Local Mechanic
          </button>
        </div>
      </div>

      {/* 3A. 6 Core Pillars Grid */}
      {activeTab === "pillars" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {pillars.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-md flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF3EC] border border-[#F37021]/20 flex items-center justify-center group-hover:bg-[#F37021] group-hover:text-white transition-colors">
                    {React.cloneElement(item.icon, {
                      className: "w-6 h-6 text-[#F37021] group-hover:text-white transition-colors",
                    })}
                  </div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F4F6F9] text-[#1A2A49] border border-gray-200">
                    {item.badge}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-extrabold text-[#1A2A49] mb-2 leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3.5 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg mb-3">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span className="truncate">{item.highlight}</span>
                </div>

                <button
                  onClick={item.onAction}
                  className="w-full py-2 px-3 rounded-xl bg-[#F4F6F9] hover:bg-[#1A2A49] text-[#1A2A49] hover:text-white text-xs font-bold flex items-center justify-between transition"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* 3B. Pluggy vs Local Unverified Mechanic Comparison Table */
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xl"
        >
          <div className="grid grid-cols-12 bg-[#F4F6F9] border-b border-gray-200 p-4 sm:px-6 text-xs sm:text-sm font-extrabold text-[#1A2A49]">
            <div className="col-span-12 sm:col-span-4 mb-2 sm:mb-0 flex items-center gap-2">
              <Wrench size={16} className="text-[#F37021]" /> Service Parameter
            </div>
            <div className="col-span-6 sm:col-span-4 text-[#F37021] flex items-center gap-1.5">
              <ShieldCheck size={16} /> Pluggy 2.0 Guarantee
            </div>
            <div className="col-span-6 sm:col-span-4 text-gray-500 flex items-center gap-1.5">
              <XCircle size={16} /> Local Unverified Mechanic
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {comparisonRows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-12 p-4 sm:px-6 gap-3 items-center hover:bg-gray-50/80 transition"
              >
                <div className="col-span-12 sm:col-span-4 font-bold text-[#1A2A49] text-xs sm:text-sm">
                  {row.feature}
                </div>
                <div className="col-span-12 sm:col-span-4 bg-emerald-50/90 border border-emerald-200 rounded-xl p-2.5 sm:p-3 flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-bold text-emerald-950">{row.pluggy}</span>
                </div>
                <div className="col-span-12 sm:col-span-4 bg-red-50/70 border border-red-100 rounded-xl p-2.5 sm:p-3 flex items-start gap-2">
                  <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-red-900">{row.local}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#FFF3EC] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-orange-200">
            <p className="text-xs sm:text-sm font-bold text-[#1A2A49]">
              💡 Stop taking risks with expensive appliances and home wiring. Book a certified Pluggy Engineer today!
            </p>
            <button
              onClick={() => navigate("/services")}
              className="px-5 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#e05e15] text-white text-xs font-bold shrink-0 shadow-sm transition"
            >
              Explore All 64+ Services →
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
