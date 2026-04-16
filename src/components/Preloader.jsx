// src/components/Preloader.jsx
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Wrench, Fan, Zap, Plug } from "lucide-react"

const loadingMessages = [
  "Finding expert technicians...",
  "Preparing your dashboard...",
  "Almost there...",
  "Ready to serve you!",
]

export default function Preloader() {
  const [progress, setProgress] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 60)

    // Message rotation
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % loadingMessages.length)
    }, 800)

    // Fade out after 4 seconds
    const fadeTimer = setTimeout(() => setFadeOut(true), 4000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
      clearTimeout(fadeTimer)
    }
  }, [])

  const icons = [
    { Icon: Wrench, delay: 0 },
    { Icon: Fan, delay: 0.5 },
    { Icon: Zap, delay: 1 },
    { Icon: Plug, delay: 1.5 },
  ]

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#1A2A49]"
    >
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
        {/* Floating Icons */}
        <div className="flex justify-center gap-6 mb-8">
          {icons.map(({ Icon, delay }, i) => (
            <motion.div
              key={i}
              initial={{ y: 0 }}
              animate={{ y: [-10, 10, -10] }}
              transition={{
                duration: 3,
                delay: delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-white/80"
            >
              <Icon size={32} />
            </motion.div>
          ))}
        </div>

        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-white mb-3 tracking-wider"
        >
          PLUGGY
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[#F37021] text-sm font-medium mb-8"
        >
          ⚡ Expert Technicians Ready
        </motion.p>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-[#F37021] to-[#FF8C42] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Progress Percentage */}
        <motion.p
          key={progress}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/60 text-sm font-mono mb-2"
        >
          {progress}%
        </motion.p>

        {/* Loading Message */}
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-gray-300 text-sm"
        >
          {loadingMessages[messageIndex]}
        </motion.p>
      </div>
    </motion.div>
  )
}