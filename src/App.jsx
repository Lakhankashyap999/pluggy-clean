// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Navbar from "./components/Navbar"
import BottomNavbar from "./components/BottomNavbar"
import Footer from "./components/Footer"
import LocationGate from "./components/LocationGate"
import ScrollToTop from "./components/ScrollToTop"

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

import { useApp } from "./AppContext"

export default function App() {
  const location = useLocation()
  const { city, setCity } = useApp()

  if (!city) {
    return <LocationGate onSelect={(c) => setCity(c)} />
  }

  // ✅ Hide layout on auth pages
  const hideLayout = ["/login", "/signup", "/engineer-login"].includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col">
      {!hideLayout && <Navbar />}
      <ScrollToTop />

      {/* Main content expand karega */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
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

          {/* Services + Requests */}
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/request/:service" element={<RequestForm />} />

          {/* Engineer */}
          <Route path="/engineer-login" element={<EngineerLogin />} />
          <Route path="/engineer" element={<EngineerDashboard />} />
        </Routes>
      </main>

      {/* ✅ Bottom nav hamesha (mobile only) */}
      {!hideLayout && <BottomNavbar />}

      {/* ✅ Footer sirf home page + mobile only */}
      {!hideLayout && location.pathname === "/" && (
        <div className="sm:hidden">
          <Footer />
        </div>
      )}

      <Toaster position="top-right" />
      <div id="portal-root"></div>
    </div>
  )
}
