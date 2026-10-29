import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  ChevronDown,
  Sparkles,
  ArrowRight,
  Video,
  Headset,
  QrCode,
  KeyRound,
  PhoneCall,
  Copy,
  Check,
} from "lucide-react"
import { useApp } from "../AppContext"
import toast from "react-hot-toast"

export default function ExtraSections() {
  const [openFaq, setOpenFaq] = useState(0)
  const [copiedCode, setCopiedCode] = useState(false)
  const navigate = useNavigate()
  const { applyCouponCode } = useApp()

  const openConsultModal = (tab = "video") => {
    window.dispatchEvent(new CustomEvent("pluggy:open-consult", { detail: { tab } }))
  }

  const handleCopyPromo = () => {
    navigator.clipboard.writeText("PLUGGY20")
    setCopiedCode(true)
    applyCouponCode?.("PLUGGY20")
    toast.success("Coupon PLUGGY20 copied & applied!")
    setTimeout(() => setCopiedCode(false), 2500)
  }

  const steps = [
    {
      stepNo: "01",
      icon: <Video className="w-5 h-5 text-[#F37021]" />,
      title: "Select Service or ₹29 Video Check",
      desc: "Choose your appliance service, record a voice note, or show the fault on a ₹29 live video call.",
    },
    {
      stepNo: "02",
      icon: <Headset className="w-5 h-5 text-[#F37021]" />,
      title: "Control Desk Locks Toolkit",
      desc: "Our executive confirms the fault, packs exact spare parts + backup unit, and dispatches a verified tech.",
    },
    {
      stepNo: "03",
      icon: <KeyRound className="w-5 h-5 text-[#F37021]" />,
      title: "Share Start PIN & Approve Rate Card",
      desc: "Share your 4-digit Start PIN on arrival and approve any required spare part from the fixed in-app rate card.",
    },
    {
      stepNo: "04",
      icon: <QrCode className="w-5 h-5 text-[#F37021]" />,
      title: "Share Happy PIN & Get 30d Warranty",
      desc: "Share the Happy PIN only after 100% satisfaction and unlock your 30-Day Free Re-Visit QR Warranty.",
    },
  ]

  const faqs = [
    {
      q: "Can the engineer ask for extra money for spare parts?",
      a: "No! Every spare part (Capacitor, Gas Refill, MCB, Motor Winding) has a fixed official price in the Pluggy Rate Card. You approve quotes directly in your Track Requests page.",
    },
    {
      q: "How does the ₹99/day Standby Backup Fan or Cooler work?",
      a: "If your fan motor or appliance PCB needs 24-hour workshop repair, our engineer leaves a Pluggy Standby Fan, Cooler, or Heater at your home so your family stays comfortable.",
    },
    {
      q: "What is Dual-PIN (Start PIN + Happy PIN) security?",
      a: "Every booking generates two 4-digit PINs: share the Start PIN when the verified engineer arrives, and share the Happy PIN only after the repair is completed to your satisfaction.",
    },
    {
      q: "Is the ₹29 Video Diagnosis fee adjusted in the final bill?",
      a: "Yes! If you book a doorstep visit after your ₹29 live video call with our master technician, the ₹29 is 100% deducted from your final service bill.",
    },
    {
      q: "How do I claim my 30-Day Free Warranty Re-Visit?",
      a: "Open your Track Requests page and tap 'Claim Free 30-Day Warranty Re-Visit (₹0)' on any completed booking for priority same-day dispatch.",
    },
  ]

  return (
    <div className="space-y-12 sm:space-y-16 py-12 sm:py-16">
      {/* 1. HOW IT WORKS — CLEAN 4-STEP HORIZONTAL FLOW */}
      <section className="px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-[#F37021] text-xs font-extrabold uppercase tracking-wider">
              Simple 4-Step Process
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#1A2A49] mt-1 font-poppins">
              How Pluggy Works
            </h2>
          </div>

          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto no-scrollbar snap-x pb-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className="min-w-[245px] md:min-w-0 snap-start bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF3EC] flex items-center justify-center">
                      {step.icon}
                    </div>
                    <span className="text-xs font-extrabold text-gray-400">STEP {step.stepNo}</span>
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-[#1A2A49] mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. CLEAN 2-COLUMN FAQ & HELPDESK */}
      <section className="px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Card (4 Cols) */}
          <div className="lg:col-span-4 bg-[#1A2A49] text-white rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <span className="text-[#F37021] text-xs font-extrabold uppercase tracking-wider">
                24/7 Support Desk
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold mt-1 mb-2">
                Frequently Asked Questions
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                Everything you need to know about our fixed spare parts rate card, standby backup units, and Dual-PIN security.
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-white/15">
              <button
                onClick={() => openConsultModal("video")}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F37021] hover:bg-[#e05e15] text-white text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Video size={14} /> Book ₹29 Video Diagnosis
              </button>
              <a
                href="tel:+919876543210"
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <PhoneCall size={14} /> Call 24/7 Helpline
              </a>
            </div>
          </div>

          {/* Right Accordion (8 Cols) */}
          <div className="lg:col-span-8 space-y-2.5">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-4 text-left font-bold text-[#1A2A49] flex justify-between items-center gap-3 text-xs sm:text-sm"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isOpen ? "rotate-180 text-[#F37021]" : "text-gray-400"
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 pb-4 text-gray-600 text-xs leading-relaxed border-t border-gray-100 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. COMPACT PROMO BANNER */}
      <section className="px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#1A2A49] to-[#223a61] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-1 bg-[#F37021] text-white px-3 py-0.5 rounded-full text-[11px] font-extrabold mb-2">
              <Sparkles size={12} /> FIRST BOOKING OFFER
            </span>
            <h3 className="text-lg sm:text-2xl font-extrabold">
              Get Flat 20% OFF on Your First Doorstep Service
            </h3>
            <p className="text-gray-300 text-xs mt-1">
              Valid on all 8 categories including AC servicing, electrical wiring & appliance repair.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 flex items-center gap-3">
              <span className="font-mono font-extrabold text-sm text-[#F37021]">PLUGGY20</span>
              <button
                onClick={handleCopyPromo}
                className="px-2.5 py-1 rounded-lg bg-white text-[#1A2A49] text-xs font-extrabold flex items-center gap-1"
              >
                {copiedCode ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copiedCode ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <button
              onClick={() => navigate("/services")}
              className="px-5 py-3 bg-[#F37021] hover:bg-[#e05e15] text-white rounded-xl font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 transition"
            >
              <span>Book Now</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
