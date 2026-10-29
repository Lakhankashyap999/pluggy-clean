import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  ChevronDown,
  Sparkles,
  ArrowRight,
  Video,
  Headset,
  Receipt,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Copy,
  Check,
  QrCode,
  KeyRound,
  Wrench,
  HelpCircle,
} from "lucide-react"
import { useApp } from "../AppContext"
import toast from "react-hot-toast"

export default function ExtraSections() {
  const [openFaq, setOpenFaq] = useState(0)
  const [activeStepIdx, setActiveStepIdx] = useState(0)
  const [copiedCode, setCopiedCode] = useState(false)
  const navigate = useNavigate()
  const { user, applyCouponCode } = useApp()

  const openRateCardModal = () => {
    window.dispatchEvent(new CustomEvent("pluggy:open-rate-card", { detail: { category: "ac-repair" } }))
  }

  const openConsultModal = (tab = "video") => {
    window.dispatchEvent(new CustomEvent("pluggy:open-consult", { detail: { tab } }))
  }

  const handleAction = (path) => {
    if (user) {
      navigate(path)
    } else {
      navigate("/login")
    }
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
      stepNo: "STEP 01",
      badge: "30-Second Booking",
      icon: <Video className="w-6 h-6 text-[#F37021]" />,
      title: "Select Service, Voice Note or ₹29 Video Check",
      desc: "Appliance symptom chunein, 'Bolo & Book' par अपनी aawaz me problem batayein, ya ₹29 Video Call par senior engineer se live diagnosis karwayein.",
      customerView: "Instant upfront labour & spare part estimate before booking.",
      actionText: "Try ₹29 Video Diagnosis",
      onAction: () => openConsultModal("video"),
    },
    {
      stepNo: "STEP 02",
      badge: "Smart Dispatch",
      icon: <Headset className="w-6 h-6 text-[#F37021]" />,
      title: "Control Desk Locks Toolkit & Dispatches Tech",
      desc: "Hamari executive team fault verify karke engineer ke bag me exact spare parts (Capacitor, MCB, Gas) aur Standby Backup unit lock karti hai.",
      customerView: "Live engineer photo, police verification badge & ETA in Track page.",
      actionText: "View Live Tracking Demo",
      onAction: () => navigate("/track"),
    },
    {
      stepNo: "STEP 03",
      badge: "Anti-Fraud Execution",
      icon: <KeyRound className="w-6 h-6 text-[#F37021]" />,
      title: "Share Start PIN & Approve Official Rate Card",
      desc: "Gate par engineer ko 4-digit Start PIN dein. Agar koi spare part lagna hai, toh app ke Fixed Rate Card me official price dekh kar 1-click approve karein.",
      customerView: "Zero haggling, zero local mechanic markup on parts.",
      actionText: "Open Official Rate Card",
      onAction: () => openRateCardModal(),
    },
    {
      stepNo: "STEP 04",
      badge: "Escrow & Warranty",
      icon: <QrCode className="w-6 h-6 text-[#F37021]" />,
      title: "Share Happy PIN & Get 30-Day QR Warranty",
      desc: "Kaam poora hone aur appliance test karne ke baad hi Happy PIN share karein. Turant 30-Day Digital Health Card aur ₹0 Free Re-Visit guarantee paayein!",
      customerView: "1-Click Free Warranty Re-Visit anytime within 30 days.",
      actionText: "Browse All Services",
      onAction: () => navigate("/services"),
    },
  ]

  const faqs = [
    {
      tag: "Pricing & Rate Card",
      q: "Kya engineer ghar aakar spare parts ke extra paise maang sakta hai?",
      a: "Bilkul nahi! Pluggy par har spare part (AC Capacitor, Copper Pipe, Gas Refill, MCB, Fan Winding) ka 'Official In-App Fixed Rate Card' hai. Engineer ko apne terminal se part select karna hota hai jo aapke Track Requests page par dikhta hai—jab tak aap 'Approve Quote' nahi karte, koi part bill me add nahi ho sakta.",
    },
    {
      tag: "Standby Backup Unit",
      q: "₹99/Day Standby Backup Fan, Cooler ya Heater kaise milta hai?",
      a: "Agar aapke Ceiling Fan ki motor winding ya AC/Geyser ka PCB workshop repair ke liye 24–48 hours leta hai, toh hamara engineer turant aapko Pluggy ka High-Speed Standby Fan, Air Cooler ya Room Heater dekar jata hai taaki aapki family ko garmi ya sardi me koi dikkat na ho.",
    },
    {
      tag: "Security & Dual-PIN",
      q: "Start PIN aur Happy PIN (Dual-OTP) ka kya fayda hai?",
      a: "Har booking par aapko 2 unique 4-digit PIN milte hain: 'Start PIN' tab share karein jab verified engineer aapke ghar pahunche, aur 'Happy PIN' tabhi batayein jab kaam 100% poora ho jaye aur aap संतुष्ट hon. Isse bina kaam kiye job close hona namumkin hai.",
    },
    {
      tag: "Video Consultation",
      q: "₹29 Live Video Diagnosis kaise kaam karta hai? Kya ye refund hota hai?",
      a: "Engineer bulaane se pehle aap ₹29 me hamare Senior Master Technician se 5-minute video call par appliance dikha sakte hain. Choti setting hui toh wahin solve ho jayegi, aur agar engineer visit book karte hain toh ₹29 aapke final bill me 100% adjust (minus) ho jata hai!",
    },
    {
      tag: "Emergency & Events",
      q: "15-Min SOS aur Shaadi/Function Standby Electrician me kya farq hai?",
      a: "'15-Min SOS' achanak short-circuit, MCB जलने ya sparking ke liye hai jisme sabse nazdeeki rapid van turant pahunchti hai. 'Shaadi/Function Standby' me ek dedicated certified electrician 4 se 8 ghante aapke ghar/venue par तैनात rehta hai taaki generator, lights aur AC bina ruke chalein.",
    },
    {
      tag: "30-Day Warranty",
      q: "Repair ke baad agar dobara wahi dikkat aaye toh kya karna hoga?",
      a: "Har completed booking par aapko 30-Day QR Appliance Health Warranty milti hai. Bas 'Track Requests' page par jaakar 'Claim Free 30-Day Warranty Re-Visit (₹0)' button dabayein—priority basis par engineer bina kisi visit charge ke dobara aayega.",
    },
  ]

  return (
    <div className="space-y-14 sm:space-y-20 my-12 sm:my-16">
      {/* =====================================================================
          1. HOW PLUGGY WORKS — 4-STEP INTERACTIVE SOP JOURNEY
         ===================================================================== */}
      <section className="px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-[#F37021] text-xs font-extrabold uppercase tracking-wider bg-[#FFF3EC] px-3 py-1 rounded-full border border-orange-200">
                <Wrench size={13} /> Transparent 4-Stage Workflow
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1A2A49] mt-2 font-poppins">
                How Pluggy Works From Click to Warranty
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 max-w-2xl">
                Zero guesswork, zero mechanic haggling. Every service follows our strict 4-step Dual-PIN & Fixed Rate Card protocol.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openRateCardModal()}
                className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-[#1A2A49] text-[#1A2A49] text-xs font-bold shadow-sm transition"
              >
                📋 View Fixed Rate Card
              </button>
              <button
                onClick={() => navigate("/services")}
                className="px-4 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#e05e15] text-white text-xs font-bold shadow-sm transition"
              >
                Book Now →
              </button>
            </div>
          </div>

          {/* 4-Step Horizontal Connected Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
            {steps.map((step, index) => {
              const isSelected = activeStepIdx === index
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  onClick={() => setActiveStepIdx(index)}
                  className={`cursor-pointer rounded-3xl p-5 sm:p-6 transition-all flex flex-col justify-between border relative ${
                    isSelected
                      ? "bg-[#1A2A49] text-white border-[#1A2A49] shadow-xl -translate-y-1"
                      : "bg-white text-[#1A2A49] border-gray-200 hover:border-[#F37021]/60 shadow-sm"
                  }`}
                >
                  <div>
                    {/* Step Number & Badge */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                          isSelected
                            ? "bg-[#F37021] text-white"
                            : "bg-[#F4F6F9] text-[#1A2A49]"
                        }`}
                      >
                        {step.stepNo}
                      </span>
                      <span
                        className={`text-[11px] font-bold ${
                          isSelected ? "text-orange-300" : "text-[#F37021]"
                        }`}
                      >
                        {step.badge}
                      </span>
                    </div>

                    {/* Icon Box */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                        isSelected ? "bg-white/10" : "bg-[#FFF3EC]"
                      }`}
                    >
                      {step.icon}
                    </div>

                    <h3
                      className={`font-extrabold text-base sm:text-lg leading-snug mb-2 ${
                        isSelected ? "text-white" : "text-[#1A2A49]"
                      }`}
                    >
                      {step.title}
                    </h3>

                    <p
                      className={`text-xs leading-relaxed mb-4 ${
                        isSelected ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {step.desc}
                    </p>
                  </div>

                  <div>
                    {/* Customer Benefit Box */}
                    <div
                      className={`p-3 rounded-2xl text-[11px] font-semibold mb-3 flex items-start gap-2 ${
                        isSelected
                          ? "bg-[#223a61] text-emerald-300 border border-white/10"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-100"
                      }`}
                    >
                      <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-emerald-500" />
                      <span>{step.customerView}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        step.onAction()
                      }}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition ${
                        isSelected
                          ? "bg-[#F37021] hover:bg-[#e05e15] text-white"
                          : "bg-[#F4F6F9] hover:bg-[#1A2A49] text-[#1A2A49] hover:text-white"
                      }`}
                    >
                      <span>{step.actionText}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. FREQUENTLY ASKED QUESTIONS & 24/7 HELPDESK (2-COLUMN)
         ===================================================================== */}
      <section className="px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left Column: Support Overview & Direct Escalation Card (4 Cols) */}
            <div className="lg:col-span-4 bg-[#1A2A49] text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#F37021] bg-white/10 px-3 py-1 rounded-full">
                  <HelpCircle size={13} /> Support & Transparency
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold mt-3 mb-2 leading-tight">
                  Got Questions? We Have Honest Answers.
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                  Hum har booking me 100% transparency rakhte hain—chahe wo spare parts ka rate ho, standby fan ho, ya 30-day warranty.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="p-3.5 rounded-2xl bg-[#223a61] border border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F37021] text-white flex items-center justify-center shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">100% Money-Back Escrow</p>
                      <p className="text-[11px] text-gray-300">
                        Protected by Start PIN & Happy PIN
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#223a61] border border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <Receipt size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Official Spare Parts Rate Card</p>
                      <p className="text-[11px] text-gray-300">
                        Fixed MRP across Delhi NCR & Mumbai
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/15 space-y-2.5">
                <p className="text-xs text-gray-300 font-semibold">
                  Still need help with an appliance fault?
                </p>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                  <button
                    onClick={() => openConsultModal("video")}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#F37021] hover:bg-[#e05e15] text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <Video size={15} /> Book ₹29 Video Diagnosis
                  </button>
                  <a
                    href="tel:+919876543210"
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                  >
                    <PhoneCall size={15} /> Call 24/7 Control Desk
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Accordion List (8 Cols) */}
            <div className="lg:col-span-8 space-y-3">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-white rounded-2xl border transition overflow-hidden ${
                      isOpen
                        ? "border-[#1A2A49] shadow-md"
                        : "border-gray-200 hover:border-gray-300 shadow-sm"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full p-4 sm:p-5 text-left font-bold text-[#1A2A49] flex justify-between items-center gap-3 text-sm sm:text-base"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFF3EC] text-[#F37021] border border-orange-200 w-fit shrink-0">
                          {faq.tag}
                        </span>
                        <span>{faq.q}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isOpen ? "bg-[#1A2A49] text-white" : "bg-[#F4F6F9] text-[#1A2A49]"
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="px-4 sm:px-5 pb-4 sm:pb-5 text-gray-600 text-xs sm:text-sm leading-relaxed border-t border-gray-100 pt-3"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. PREMIUM FIRST-ORDER PROMO & PARTNER CTA BANNER
         ===================================================================== */}
      <section className="px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#1A2A49] via-[#223a61] to-[#1A2A49] rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-white/10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 text-left">
                <div className="inline-flex items-center gap-1.5 bg-[#F37021] text-white px-3.5 py-1 rounded-full text-xs font-extrabold mb-3 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" /> FIRST BOOKING OFFER • FLAT 20% OFF
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2 leading-tight">
                  Ready to Experience Zero-Headache Home Repairs?
                </h3>
                <p className="text-gray-300 text-xs sm:text-sm max-w-xl">
                  Book any AC Foam-Jet service, electrical wiring fix, fan repair, or plumbing job today and get 20% instant discount + 30-Day QR Appliance Warranty.
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center justify-end gap-3">
                {/* Interactive Coupon Copy Box */}
                <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gray-300 block">
                      Use Promo Code
                    </span>
                    <span className="font-mono font-extrabold text-lg text-[#F37021]">
                      PLUGGY20
                    </span>
                  </div>
                  <button
                    onClick={handleCopyPromo}
                    className="px-3 py-1.5 rounded-xl bg-white text-[#1A2A49] hover:bg-gray-100 text-xs font-extrabold flex items-center gap-1 transition"
                  >
                    {copiedCode ? (
                      <>
                        <Check size={14} className="text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copy
                      </>
                    )}
                  </button>
                </div>

                {/* Book Now Button */}
                <button
                  onClick={() => handleAction("/services")}
                  className="px-6 py-4 bg-[#F37021] hover:bg-[#e05e15] text-white rounded-2xl font-extrabold text-sm shadow-lg inline-flex items-center justify-center gap-2 transition shrink-0"
                >
                  <span>Book Service Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
