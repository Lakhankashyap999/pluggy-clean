import React, { useState } from "react"
import {
  Mail,
  Phone,
  MapPin,
  Zap,
  ShieldCheck,
  Receipt,
  Video,
  Siren,
  Wrench,
  LayoutDashboard,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  QrCode,
  Send,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { CATEGORIES_CATALOG } from "../data/servicesCatalog"
import toast from "react-hot-toast"

export default function Footer() {
  const navigate = useNavigate()
  const [emailInput, setEmailInput] = useState("")

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!emailInput.trim() || !emailInput.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }
    toast.success("Subscribed! Flat 20% coupon PLUGGY20 sent to your inbox.")
    setEmailInput("")
  }

  const openRateCardModal = () => {
    window.dispatchEvent(
      new CustomEvent("pluggy:open-rate-card", { detail: { category: "ac-repair" } })
    )
  }

  const openConsultModal = (tab = "video") => {
    window.dispatchEvent(new CustomEvent("pluggy:open-consult", { detail: { tab } }))
  }

  const serviceCities = [
    "Delhi NCR",
    "Noida & Greater Noida",
    "Indirapuram & Ghaziabad",
    "Gurugram",
    "Mumbai & Navi Mumbai",
    "Thane",
    "Hapur",
    "Faridabad",
  ]

  return (
    <footer className="bg-[#1A2A49] text-gray-300 border-t border-white/10 pb-20 md:pb-0">
      {/* 1. Top 4-Pillar Quick Action Strip inside Footer */}
      <div className="bg-[#132038] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <button
              onClick={() => openConsultModal("sos")}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#223a61]/80 hover:bg-[#223a61] border border-white/10 hover:border-[#F37021] text-left transition group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#F37021] text-white flex items-center justify-center shrink-0 shadow">
                <Siren size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white group-hover:text-[#F37021] transition flex items-center gap-1">
                  15-Min Emergency SOS <ArrowUpRight size={13} />
                </p>
                <p className="text-[11px] text-gray-300 truncate">
                  Short circuit, MCB trip & sparking rescue
                </p>
              </div>
            </button>

            <button
              onClick={openRateCardModal}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#223a61]/80 hover:bg-[#223a61] border border-white/10 hover:border-[#F37021] text-left transition group"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow">
                <Receipt size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white group-hover:text-[#F37021] transition flex items-center gap-1">
                  Official Spare Rate Card <ArrowUpRight size={13} />
                </p>
                <p className="text-[11px] text-gray-300 truncate">
                  100% Fixed MRP on gas, capacitors & MCBs
                </p>
              </div>
            </button>

            <button
              onClick={() => openConsultModal("video")}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#223a61]/80 hover:bg-[#223a61] border border-white/10 hover:border-[#F37021] text-left transition group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#F37021] text-white flex items-center justify-center shrink-0 shadow">
                <Video size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white group-hover:text-[#F37021] transition flex items-center gap-1">
                  ₹29 Video Diagnosis Call <ArrowUpRight size={13} />
                </p>
                <p className="text-[11px] text-gray-300 truncate">
                  5-min master tech check (adjusted in bill)
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate("/track")}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#223a61]/80 hover:bg-[#223a61] border border-white/10 hover:border-[#F37021] text-left transition group"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow">
                <QrCode size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-white group-hover:text-[#F37021] transition flex items-center gap-1">
                  Track Order & Dual-PINs <ArrowUpRight size={13} />
                </p>
                <p className="text-[11px] text-gray-300 truncate">
                  Start PIN, Happy PIN & 30-Day QR Warranty
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main 12-Column Mega Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10">
          {/* Col 1 (4 Cols): Brand, Trust Architecture & Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#F37021] flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                ⚡
              </div>
              <div>
                <span className="text-2xl font-extrabold text-white tracking-tight block leading-none">
                  Pluggy<span className="text-[#F37021]">.</span>
                </span>
                <span className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">
                  Home Electrical & Appliance Care
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              India’s most transparent doorstep electrical, AC, and home appliance service platform. Powered by Police-Verified Engineers, In-App Fixed Spare Rate Cards, ₹99/day Standby Backup Units, and Dual-PIN Escrow Security.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#223a61] text-white px-2.5 py-1 rounded-lg border border-white/10">
                <ShieldCheck size={13} className="text-emerald-400" /> Police Verified Techs
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#223a61] text-white px-2.5 py-1 rounded-lg border border-white/10">
                <CheckCircle2 size={13} className="text-[#F37021]" /> 30-Day QR Warranty
              </span>
            </div>

            {/* Newsletter Subscription Box */}
            <form onSubmit={handleSubscribe} className="pt-2">
              <label className="block text-xs font-extrabold text-white uppercase tracking-wider mb-2">
                📩 Get Seasonal AC & Wiring Maintenance Alerts + ₹150 Voucher
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-3.5 py-2.5 shadow-inner">
                  <Mail size={15} className="text-gray-400 shrink-0" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full text-xs sm:text-sm text-[#1A2A49] font-medium focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#e05e15] text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shrink-0 shadow transition"
                >
                  <Send size={14} /> Join
                </button>
              </div>
            </form>
          </div>

          {/* Col 2 (3 Cols): All 8 Service Departments */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Zap size={15} className="text-[#F37021]" /> All 8 Service Departments
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {CATEGORIES_CATALOG.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/services/${cat.slug}`}
                    className="text-gray-300 hover:text-[#F37021] transition flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.emoji || cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                    <span className="text-[11px] text-gray-400 group-hover:text-white">
                      ₹{cat.startingPrice}+
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 (2 Cols): Customer Hub & Portals */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4">
              Customer & Partner Hub
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/services" className="text-gray-300 hover:text-[#F37021] transition">
                  All 64+ Services Storefront
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-gray-300 hover:text-[#F37021] transition">
                  Track Live Booking & PINs
                </Link>
              </li>
              <li>
                <button
                  onClick={openRateCardModal}
                  className="text-left text-gray-300 hover:text-[#F37021] transition"
                >
                  Official Spare Parts Rate Card
                </button>
              </li>
              <li>
                <button
                  onClick={() => openConsultModal("standby")}
                  className="text-left text-gray-300 hover:text-[#F37021] transition"
                >
                  Shaadi & Event Standby Tech
                </button>
              </li>
              <li>
                <Link
                  to="/account/coupons"
                  className="text-gray-300 hover:text-[#F37021] transition"
                >
                  Offers & Coupon Codes
                </Link>
              </li>
              <li className="pt-2 border-t border-white/10">
                <Link
                  to="/engineer"
                  className="inline-flex items-center gap-1.5 text-orange-300 hover:text-[#F37021] font-bold transition"
                >
                  <Wrench size={13} /> Engineer Field Terminal
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-emerald-300 hover:text-emerald-400 font-bold transition"
                >
                  <LayoutDashboard size={13} /> Executive Control Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 (3 Cols): 24/7 Control Room & Active Cities */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              24/7 Dispatch Control Desk
            </h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#F37021] shrink-0 mt-0.5" />
                <span>
                  Pluggy Operations Hub, Sector 62, Noida & Indirapuram, Delhi NCR, India
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-[#F37021] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white font-bold">
                  +91 98765 43210 (24/7 SOS Helpline)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-[#F37021] shrink-0" />
                <a href="mailto:support@pluggy.in" className="hover:text-white">
                  support@pluggy.in
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-300 text-xs font-semibold">
                <Clock size={15} className="shrink-0" />
                <span>Standard Hours: 7:00 AM – 11:00 PM | SOS: 24×7</span>
              </div>
            </div>

            {/* Cities Served Pills */}
            <div className="pt-2">
              <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                Active Service Zones
              </p>
              <div className="flex flex-wrap gap-1.5">
                {serviceCities.map((c) => (
                  <span
                    key={c}
                    className="text-[11px] bg-[#223a61] text-gray-200 px-2.5 py-1 rounded-lg border border-white/10"
                  >
                    📍 {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright & Payment Security Bar */}
      <div className="bg-[#0F172A] border-t border-white/10 py-4 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} <span className="font-extrabold text-white">Pluggy Technologies</span>. All rights reserved. Built with Anti-Fraud Rate Card & Dual-PIN Security.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-gray-300">
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">
              🔒 100% Escrow Protected
            </span>
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">
              UPI / GPay / PhonePe
            </span>
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">
              Pay After Happy-PIN
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
