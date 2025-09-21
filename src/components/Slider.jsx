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

  const visibleCount = 3
  const total = sliderImages.length

  // ✅ Clone: first 3 images ko last me add kiya for infinite loop
  const imagesWithClones = [...sliderImages, ...sliderImages.slice(0, visibleCount)]

  useEffect(() => {
    const interval = setInterval(() => {
      slideNext()
    }, 3000) // har 3 sec me move hoga

    return () => clearInterval(interval)
  }, [currentIndex])

  const slideNext = () => {
    const nextIndex = currentIndex + 1

    if (nextIndex <= total) {
      animateSlide(nextIndex)
      setCurrentIndex(nextIndex)
    } else {
      animateSlide(nextIndex, () => {
        // ✅ Reset bina jhatke
        gsap.set(sliderRef.current, { xPercent: 0 })
        setCurrentIndex(0)
      })
    }
  }

  const animateSlide = (index, onComplete) => {
    const percentage = -(index * (100 / visibleCount)) // ek card = 100/3 %
    gsap.to(sliderRef.current, {
      xPercent: percentage,
      duration: 1.5,
      ease: "power2.inOut",
      onComplete,
    })
  }

  return (
    <div className="overflow-hidden w-full bg-gray-50 py-8">
      <div ref={sliderRef} className="flex">
        {imagesWithClones.map((img, i) => (
          <div
            key={i}
            className="w-1/3 flex-shrink-0 px-4 cursor-pointer"
          >
            <img
              src={img}
              alt={`slide-${i}`}
              className="h-60 w-full object-contain rounded-xl shadow-md bg-white"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
