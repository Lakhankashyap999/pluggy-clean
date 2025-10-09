// src/components/CustomerReviews.jsx
import { motion } from "framer-motion"
import { useState } from "react"
import { CheckCircle } from "lucide-react"

const reviews = [
  {
    name: "Rohit Sharma",
    city: "Mumbai",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    text: "Excellent service! Technician arrived on time and fixed my AC within 30 minutes. Highly recommend.",
  },
  {
    name: "Sneha Kapoor",
    city: "Delhi",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
    text: "Very professional staff. I got my fan repaired at a very reasonable price. Will book again.",
  },
  {
    name: "Amit Verma",
    city: "Bengaluru",
    img: "https://randomuser.me/api/portraits/men/65.jpg",
    rating: 5,
    text: "The electrician was polite and skilled. Fixed my wiring issue safely. 5 stars!",
  },
  {
    name: "Priya Mehta",
    city: "Chennai",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4,
    text: "Booked a lighting service. The team installed my chandelier beautifully. Great work!",
  },
]

export default function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(0)

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1))
  }
  const handleNext = () => {
    setActiveIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1))
  }

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="text-sm font-semibold text-[#1A2A49] tracking-wide uppercase">
          Trusted by Our Indian Customers
        </h3>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2A49] mt-2 mb-12">
          Customer Success Stories
        </h2>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-white rounded-2xl shadow-md p-6 text-left border hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <img
                  src={r.img}
                  alt={r.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-[#1A2A49]">{r.name}</h4>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <CheckCircle size={14} className="text-green-500" /> {r.city}
                  </div>
                  <div className="text-yellow-500 text-sm mt-1">
                    {"⭐".repeat(r.rating)}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                "{r.text}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden relative">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-md p-6 text-left border mx-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={reviews[activeIndex].img}
                alt={reviews[activeIndex].name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold text-[#1A2A49]">{reviews[activeIndex].name}</h4>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <CheckCircle size={14} className="text-green-500" /> {reviews[activeIndex].city}
                </div>
                <div className="text-yellow-500 text-sm mt-1">
                  {"⭐".repeat(reviews[activeIndex].rating)}
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
              "{reviews[activeIndex].text}"
            </p>
          </motion.div>

          {/* Carousel Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            ◀
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            ▶
          </button>
        </div>
      </div>
    </section>
  )
}
