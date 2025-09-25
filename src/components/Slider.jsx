import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

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
  const [transitioning, setTransitioning] = useState(true)
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

    const interval = setInterval(() => slideNext(), 4000)
    return () => {
      window.removeEventListener("resize", update)
      clearInterval(interval)
    }
  }, [currentIndex])

  const slideNext = () => {
    const next = currentIndex + 1
    if (next <= total) {
      setCurrentIndex(next)
      setTransitioning(true)
    } else {
      setCurrentIndex(next)
      setTransitioning(true)
      setTimeout(() => {
        setTransitioning(false)
        setCurrentIndex(0)
      }, 1000)
    }
  }

  const slidePrev = () => {
    const prev = currentIndex - 1
    if (prev < 0) {
      setCurrentIndex(total - 1)
    } else {
      setCurrentIndex(prev)
    }
    setTransitioning(true)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-gray-50 py-4 sm:py-6"
    >
      <motion.div
        className="flex"
        animate={{ x: -currentIndex * slideWidth }}
        transition={
          transitioning ? { duration: 1, ease: "easeInOut" } : { duration: 0 }
        }
      >
        {imagesWithClones.map((img, i) => (
          <div
            key={i}
            style={{ flex: `0 0 ${100 / visibleCount}%` }}
            className="px-2"
          >
            {/* aspect-ratio box to avoid white gap */}
            <div className="rounded-xl overflow-hidden shadow-md aspect-[16/9] bg-black">
              <img
                src={img}
                alt={`slide-${i}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* nav buttons */}
      <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4">
        <button
          onClick={slidePrev}
          className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
        >
          ‹
        </button>
        <button
          onClick={slideNext}
          className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
        >
          ›
        </button>
      </div>
    </div>
  )
}
