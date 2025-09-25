import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

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

  const [[index, direction], setIndex] = useState([0, 0])

  const paginate = (dir) => {
    setIndex(([prev]) => {
      let next = prev + dir
      if (next < 0) next = images.length - 1
      if (next >= images.length) next = 0
      return [next, dir]
    })
  }

  useEffect(() => {
    const interval = setInterval(() => paginate(1), 3000)
    return () => clearInterval(interval)
  }, [])

  const variants = {
    enter: (dir) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
    }),
  }

  return (
    <div className="relative w-full overflow-hidden bg-gray-50 py-4 sm:py-6 h-56 sm:h-72 lg:h-96">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={index}
          src={images[index]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-contain rounded-xl"
        />
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <button
          onClick={() => paginate(-1)}
          className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
        >
          ‹
        </button>
        <button
          onClick={() => paginate(1)}
          className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
        >
          ›
        </button>
      </div>
    </div>
  )
}
