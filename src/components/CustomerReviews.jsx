// src/components/CustomerReviews.jsx
import { useState } from "react"
import { motion } from "framer-motion"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"

const reviews = [
  { name: "Rohit Sharma", location: "Mumbai", rating: 5, text: "Excellent service! Technician arrived on time and fixed my AC within 30 minutes. Highly recommend.", date: "2 days ago", avatar: "R" },
  { name: "Sneha Kapoor", location: "Delhi", rating: 4, text: "Very professional staff. I got my fan repaired at a very reasonable price. Will book again.", date: "5 days ago", avatar: "S" },
  { name: "Amit Verma", location: "Bengaluru", rating: 5, text: "The electrician was polite and skilled. Fixed my wiring issue safely. 5 stars!", date: "1 week ago", avatar: "A" },
  { name: "Priya Mehta", location: "Chennai", rating: 4, text: "Booked a lighting service. The team installed my chandelier beautifully. Great work!", date: "2 weeks ago", avatar: "P" },
]

export default function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextReview = () => setCurrentIndex((prev) => (prev + 1) % reviews.length)
  const prevReview = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Mobile Carousel */}
      <div className="lg:hidden relative">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-gradient-to-br from-[#1A2A49] to-[#223a61] rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-xl"
        >
          <Quote size={24} className="text-[#F37021] mb-3 opacity-50" />
          <p className="text-sm sm:text-base leading-relaxed mb-4">"{reviews[currentIndex].text}"</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#F37021] to-[#FF8C42] rounded-full flex items-center justify-center font-bold text-white">
              {reviews[currentIndex].avatar}
            </div>
            <div>
              <p className="font-semibold">{reviews[currentIndex].name}</p>
              <p className="text-gray-300 text-xs sm:text-sm">{reviews[currentIndex].location}</p>
            </div>
            <div className="ml-auto flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={i < reviews[currentIndex].rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"} />
              ))}
            </div>
          </div>
        </motion.div>

        <button onClick={prevReview} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <ChevronLeft size={18} className="text-[#1A2A49]" />
        </button>
        <button onClick={nextReview} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
          <ChevronRight size={18} className="text-[#1A2A49]" />
        </button>

        <div className="flex justify-center gap-1.5 mt-4">
          {reviews.map((_, i) => (
            <button key={i} onClick={() => setCurrentIndex(i)} className={`h-1.5 rounded-full transition-all ${i === currentIndex ? "w-6 bg-[#F37021]" : "w-1.5 bg-gray-300"}`} />
          ))}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:grid grid-cols-2 gap-6">
        {reviews.map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-[#1A2A49] to-[#223a61] rounded-3xl p-6 text-white shadow-xl"
          >
            <Quote size={28} className="text-[#F37021] mb-4 opacity-50" />
            <p className="text-base leading-relaxed mb-5">"{review.text}"</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F37021] to-[#FF8C42] rounded-full flex items-center justify-center font-bold text-white text-lg">
                {review.avatar}
              </div>
              <div>
                <p className="font-semibold">{review.name}</p>
                <p className="text-gray-300 text-sm">{review.location} • {review.date}</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} className={j < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"} />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}