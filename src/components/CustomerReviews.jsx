// src/components/CustomerReviews.jsx
import { motion } from "framer-motion"

const reviews = [
  {
    name: "Rohit Sharma",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    text: "Excellent service! Technician arrived on time and fixed my AC within 30 minutes. Highly recommend.",
  },
  {
    name: "Sneha Kapoor",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
    text: "Very professional staff. I got my fan repaired at a very reasonable price. Will book again.",
  },
  {
    name: "Amit Verma",
    img: "https://randomuser.me/api/portraits/men/65.jpg",
    rating: 5,
    text: "The electrician was polite and skilled. Fixed my wiring issue safely. 5 stars!",
  },
  {
    name: "Priya Mehta",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4,
    text: "Booked a lighting service. The team installed my chandelier beautifully. Great work!",
  },
]

export default function CustomerReviews() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h3 className="text-sm font-semibold text-[#1A2A49] tracking-wide uppercase">
          What Our Customers Say
        </h3>
        <h2 className="text-3xl font-bold text-[#1A2A49] mt-2 mb-12">
          Trusted by Happy Customers
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-white rounded-2xl shadow-md p-6 text-left border hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={r.img}
                  alt={r.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-[#1A2A49]">{r.name}</h4>
                  <div className="text-yellow-500 text-sm">
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
      </div>
    </section>
  )
}
