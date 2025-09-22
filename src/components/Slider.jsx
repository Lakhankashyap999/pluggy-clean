import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

export default function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const sliderRef = useRef(null)

  const sliderImages = [
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
  const total = sliderImages.length

  const imagesWithClones = [...sliderImages, ...sliderImages.slice(0, visibleCount)]

  useEffect(() => {
    const handleResize = () => setVisibleCount(getVisibleCount())
    window.addEventListener("resize", handleResize)

    const interval = setInterval(() => {
      slideNext()
    }, 3000)

    return () => {
      clearInterval(interval)
      window.removeEventListener("resize", handleResize)
    }
  }, [currentIndex, visibleCount])

  const slideNext = () => {
    const nextIndex = currentIndex + 1
    if (nextIndex <= total) {
      animateSlide(nextIndex)
      setCurrentIndex(nextIndex)
    } else {
      animateSlide(nextIndex, () => {
        gsap.set(sliderRef.current, { xPercent: 0 })
        setCurrentIndex(0)
      })
    }
  }

  const animateSlide = (index, onComplete) => {
    const percentage = -(index * (100 / visibleCount))
    gsap.to(sliderRef.current, {
      xPercent: percentage,
      duration: 1.2,
      ease: "power2.inOut",
      onComplete,
    })
  }

  return (
    <div className="overflow-hidden w-full bg-gray-50 py-4 sm:py-6">
      <div ref={sliderRef} className="flex">
        {imagesWithClones.map((img, i) => (
          <div
            key={i}
            className={`px-1 sm:px-2 lg:px-3 flex-shrink-0 ${
              visibleCount === 1 ? "w-full" : visibleCount === 2 ? "w-1/2" : "w-1/3"
            }`}
          >
            <div className="rounded-xl overflow-hidden shadow-md h-40 sm:h-56 lg:h-72 bg-white">
              <img
                src={img}
                alt={`slide-${i}`}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
