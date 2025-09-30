// src/components/Preloader.jsx
import { useEffect, useState } from "react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import loaderAnim from "../assets/pluggy-loader.lottie"  // ✅ import at top

export default function Preloader() {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setFadeOut(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-[#1A2A49] z-[9999] transition-opacity duration-700 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="w-44 h-44 drop-shadow-[0_0_25px_rgba(243,112,33,0.8)]">
        <DotLottieReact src={loaderAnim} loop autoplay />  {/* ✅ fixed */}
      </div>

      <h1 className="text-4xl font-extrabold text-white mt-6 animate-pulse drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]">
        PLUGGY
      </h1>
      <p className="text-gray-200 text-sm mt-3 tracking-wide animate-pulse drop-shadow-[0_0_10px_rgba(243,112,33,0.7)]">
        Connecting Services...
      </p>
    </div>
  )
}
