// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useState, useEffect } from "react"

import Navbar from "./components/Navbar"
import BottomNavbar from "./components/BottomNavbar"
import Footer from "./components/Footer"
import LocationGate from "./components/LocationGate"
import ScrollToTop from "./components/ScrollToTop"
import Preloader from "./components/Preloader"
import BookService from "./pages/BookService"

import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Account from "./pages/Account"
import RequestForm from "./pages/RequestForm"
import ServiceDetail from "./pages/ServiceDetail"
import EngineerLogin from "./pages/EngineerLogin"
import EngineerDashboard from "./pages/EngineerDashboard"

// ✅ Account sub-pages
import TrackRequests from "./pages/TrackRequests"
import CartPage from "./pages/CartPage"
import SecurityPage from "./pages/SecurityPage"
import AddressPage from "./pages/AddressPage"
import RecentPage from "./pages/RecentPage"
import ChangePasswordPage from "./pages/ChangePasswordPage"
import EditProfilePage from "./pages/EditProfilePage"
import CouponsPage from "./pages/CouponsPage"
import NotificationsPage from "./pages/NotificationsPage"
import ServicesPage from "./pages/ServicesPage"

import { useApp } from "./AppContext"

export default function App() {
  const location = useLocation()
  const { city, setCity } = useApp()

  // ✅ Preloader state
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleLoad = () => setLoading(false)
    window.addEventListener("load", handleLoad)
    const timer = setTimeout(() => setLoading(false), 4500)
    return () => {
      window.removeEventListener("load", handleLoad)
      clearTimeout(timer)
    }
  }, [])

  // ✅ Show Preloader first
  if (loading) return <Preloader />

  // ✅ City gate
  if (!city) return <LocationGate onSelect={(c) => setCity(c)} />

  // ✅ Layout hide config
  const hideNavbarRoutes = ["/login", "/signup", "/engineer-login", "/engineer"]
  const hideFooterRoutes = [
    "/login",
    "/signup",
    "/engineer-login",
    "/engineer",
    "/services",
    "/request"
  ]

  const hideNavbar = hideNavbarRoutes.includes(location.pathname)
  const hideFooter = hideFooterRoutes.some((path) =>
    location.pathname.startsWith(path)
  )

  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ User Navbar hidden on engineer pages */}
      {!hideNavbar && <Navbar />}

      <main className="flex-1">
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/book-service" element={<BookService />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Account */}
          <Route path="/account" element={<Account />} />
          <Route path="/account/track" element={<TrackRequests />} />
          <Route path="/account/cart" element={<CartPage />} />
          <Route path="/account/security" element={<SecurityPage />} />
          <Route path="/account/address" element={<AddressPage />} />
          <Route path="/account/recent" element={<RecentPage />} />
          <Route path="/account/password" element={<ChangePasswordPage />} />
          <Route path="/account/edit" element={<EditProfilePage />} />
          <Route path="/account/coupons" element={<CouponsPage />} />
          <Route path="/account/notifications" element={<NotificationsPage />} />
          <Route path="/account/services" element={<ServicesPage />} />

          {/* Services + Requests */}
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/request/:service" element={<RequestForm />} />

          {/* Engineer */}
          <Route path="/engineer-login" element={<EngineerLogin />} />
          <Route path="/engineer" element={<EngineerDashboard />} />
        </Routes>
      </main>

      {/* Bottom Navbar only on home page */}
      {!hideNavbar && location.pathname === "/" && <BottomNavbar />}

      {/* Footer hidden on engineer & auth pages */}
      {!hideFooter && <Footer />}

      <Toaster position="top-right" />
      <div id="portal-root"></div>
    </div>
  )
}
