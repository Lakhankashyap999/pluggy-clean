import { useState } from "react"
import { motion } from "framer-motion"
import { CalendarCheck, Wrench, CheckCircle2, Star, ChevronDown } from "lucide-react"

export default function ExtraSections() {
  const [openIndex, setOpenIndex] = useState(null)

  const steps = [
    {
      icon: CalendarCheck,
      title: "Book Service",
      desc: "Choose the service you need and book instantly through our app.",
    },
    {
      icon: Wrench,
      title: "Technician Assigned",
      desc: "A verified professional is assigned and arrives at your doorstep.",
    },
    {
      icon: CheckCircle2,
      title: "Service Completed",
      desc: "Your work is done quickly, safely and with quality assurance.",
    },
    {
      icon: Star,
      title: "Pay & Review",
      desc: "Make secure payment and leave your feedback to help us improve.",
    },
  ]

  const faqs = [
    { q: "How do I book a service?", a: "Simply choose your desired service from the homepage, fill in your details, and confirm the booking." },
    { q: "Are your technicians verified?", a: "Yes, all our technicians go through a strict background check and are trained professionals." },
    { q: "What payment methods do you accept?", a: "We support UPI, Credit/Debit Cards, Netbanking, and Cash on Delivery." },
    { q: "Do you provide service guarantee?", a: "Yes, we offer a 30-day service guarantee for all repairs and installations." },
  ]

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  }

  const item = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="space-y-20">
      {/* Timeline */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-sm font-semibold text-[#1A2A49] tracking-wide uppercase">
            Process
          </h3>
          <h2 className="text-3xl font-bold text-[#1A2A49]">How It Works</h2>
          <p className="text-gray-600 mt-2">
            Simple steps to get your service done without any hassle
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-[#1A2A49] to-[#223a61] transform -translate-x-1/2"></div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            {steps.map((step, i) => {
              const Icon = step.icon
              const isLeft = i % 2 === 0
              return (
                <motion.div
                  key={i}
                  variants={item}
                  className={`relative flex items-center ${isLeft ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`w-full md:w-5/12 p-6 rounded-xl shadow bg-white border ${
                      isLeft ? "text-left" : "text-right"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-[#1A2A49] text-white">
                        <Icon size={22} />
                      </div>
                      <h3 className="text-lg font-semibold text-[#1A2A49]">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h3 className="text-sm font-semibold text-[#1A2A49] tracking-wide uppercase">
            Support
          </h3>
          <h2 className="text-3xl font-bold text-[#1A2A49]">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border rounded-lg shadow-sm bg-white overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex justify-between items-center w-full px-4 py-3 text-left text-[#1A2A49] font-medium"
              >
                {faq.q}
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 pb-4 text-sm text-gray-600"
                >
                  {faq.a}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#1A2A49] to-[#223a61] rounded-2xl shadow-lg text-white p-10 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h2 className="text-2xl font-bold">
              Ready to experience hassle-free services?
            </h2>
            <p className="text-gray-200 mt-2">
              Book your first service today and enjoy 20% OFF with code{" "}
              <span className="bg-white text-[#1A2A49] px-2 py-0.5 rounded">
                PLUG20
              </span>
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white text-[#1A2A49] font-semibold rounded-lg shadow hover:bg-gray-100"
          >
            Book a Service
          </motion.button>
        </motion.div>
      </section>
    </div>
  )
}
