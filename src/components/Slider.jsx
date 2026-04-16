// src/components/Slider.jsx
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Slider() {
  const images = [
    "/image/frontpage.png",
    "/image/first.jpg",
    "/image/second.jpg",
    "/image/third.jpg",
    "/image/fourth.jpg",
    "/image/five.jpg",
    "/image/six.jpg",
  ]

  const getVisibleCount = () => {
    if (window.innerWidth < 640) return 1
    if (window.innerWidth < 1024) return 2
    return 3
  }

  const [visibleCount, setVisibleCount] = useState(getVisibleCount())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef(null)
  const [slideWidth, setSlideWidth] = useState(0)

  const total = images.length
  const imagesWithClones = [...images, ...images.slice(0, visibleCount)]

  useEffect(() => {
    const update = () => {
      setVisibleCount(getVisibleCount())
      if (containerRef.current) {
        setSlideWidth(containerRef.current.offsetWidth / getVisibleCount())
      }
    }
    update()
    window.addEventListener("resize", update)

    return () => window.removeEventListener("resize", update)
  }, [])

  useEffect(() => {
    if (isHovered) return
    
    const interval = setInterval(() => {
      slideNext()
    }, 5000) // 5 seconds for relaxed viewing
    
    return () => clearInterval(interval)
  }, [currentIndex, isHovered])

  const slideNext = () => {
    setCurrentIndex(prev => prev + 1)
  }

  const slidePrev = () => {
    setCurrentIndex(prev => (prev - 1 + total) % total)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  // Reset index when reaching cloned images
  useEffect(() => {
    if (currentIndex >= total) {
      setTimeout(() => {
        setCurrentIndex(0)
      }, 500)
    }
  }, [currentIndex, total])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-gradient-to-b from-gray-50 to-white py-6 sm:py-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slider Container */}
      <motion.div
        className="flex"
        animate={{ x: -currentIndex * slideWidth }}
        transition={{ 
          duration: 0.8, 
          ease: [0.25, 0.1, 0.25, 1.0] // Smooth easing
        }}
      >
        {imagesWithClones.map((img, i) => (
          <div
            key={i}
            style={{ flex: `0 0 ${100 / visibleCount}%` }}
            className="px-2 sm:px-3"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              
              {/* Image */}
              <img
                src={img}
                alt={`slide-${i}`}
                className="w-full h-full object-cover aspect-[16/9] group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-20" />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Premium Navigation Arrows */}
      <button
        onClick={slidePrev}
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:shadow-xl hover:scale-110 transition-all duration-300 border border-white/50"
      >
        <ChevronLeft size={22} className="text-[#1A2A49] ml-[-2px]" />
      </button>
      
      <button
        onClick={slideNext}
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:shadow-xl hover:scale-110 transition-all duration-300 border border-white/50"
      >
        <ChevronRight size={22} className="text-[#1A2A49] mr-[-2px]" />
      </button>

      {/* Premium Dots Indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className="group relative"
          >
            <span
              className={`block w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentIndex % total
                  ? "w-8 bg-[#F37021]"
                  : "bg-gray-400/60 hover:bg-gray-600"
              }`}
            />
            {/* Pulse Effect for Active Dot */}
            {i === currentIndex % total && (
              <span className="absolute inset-0 rounded-full bg-[#F37021] animate-ping opacity-40" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}