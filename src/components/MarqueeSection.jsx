import React from "react"
import { motion } from "framer-motion"
import { ShieldCheck, Zap, Receipt, RefreshCw, QrCode, Siren, Star } from "lucide-react"

const TICKER_ITEMS = [
  { icon: <Zap size={14} className="text-[#F37021]" />, text: "15-Min Rapid SOS Dispatch" },
  { icon: <Receipt size={14} className="text-emerald-400" />, text: "100% Fixed In-App Spare Rate Card" },
  { icon: <ShieldCheck size={14} className="text-[#F37021]" />, text: "Dual-PIN Security (Start PIN + Happy PIN)" },
  { icon: <RefreshCw size={14} className="text-amber-400" />, text: "₹99/Day Standby Backup Fan & Cooler" },
  { icon: <Siren size={14} className="text-[#F37021]" />, text: "Shaadi & Function Dedicated Standby Techs" },
  { icon: <QrCode size={14} className="text-emerald-400" />, text: "30-Day QR Appliance Health Warranty" },
  { icon: <Star size={14} className="text-amber-400" />, text: "4.8★ Rated Across 12,400+ Homes" },
]

export default function MarqueeSection() {
  return (
    <div className="bg-[#1A2A49] border-y border-white/10 py-3.5 overflow-hidden select-none">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
        className="flex whitespace-nowrap items-center gap-8 w-max"
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white/90 px-3 py-1 rounded-full bg-[#223a61]/80 border border-white/10"
          >
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
