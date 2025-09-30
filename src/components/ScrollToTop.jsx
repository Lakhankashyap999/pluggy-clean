// src/components/ScrollToTop.jsx
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // ✅ Force disable auto scroll restore
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }
    // ✅ Always scroll to top on route change
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
