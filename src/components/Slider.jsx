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

  // ✅ responsive visible count
  const getVisibleCount = () => {
    if (window.innerWidth < 640) return 1 // mobile
    if (window.innerWidth < 1024) return 2 // tablet
    return 3 // desktop
  }

  const [visibleCount, setVisibleCount] = useState(getVisibleCount())
  const total = sliderImages.length

  // ✅ clone images for infinite loop
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
      duration: 1.5,
      ease: "power2.inOut",
      onComplete,
    })
  }

  return (
    <div className="overflow-hidden w-full bg-gray-50 py-6 sm:py-8">
      <div ref={sliderRef} className="flex">
        {imagesWithClones.map((img, i) => (
          <div
            key={i}
            className={`px-2 sm:px-3 lg:px-4 flex-shrink-0 ${
              visibleCount === 1 ? "w-full" : visibleCount === 2 ? "w-1/2" : "w-1/3"
            }`}
          >
            <div className="rounded-2xl overflow-hidden shadow-lg h-48 sm:h-64 lg:h-80">
              <img
                src={img}
                alt={`slide-${i}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
