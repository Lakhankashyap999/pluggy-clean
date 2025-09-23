// App.jsx
import { Routes, Route, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Navbar from "./components/Navbar"
import BottomNavbar from "./components/BottomNavbar"
import Footer from "./components/Footer"
import LocationGate from "./components/LocationGate"
import ScrollToTop from "./components/ScrollToTop"   // ✅ new

import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Account from "./pages/Account"
import RequestForm from "./pages/RequestForm"
import ServiceDetail from "./pages/ServiceDetail"
import EngineerLogin from "./pages/EngineerLogin"            
import EngineerDashboard from "./pages/EngineerDashboard"    

import { useApp } from "./AppContext"

export default function App() {
  const location = useLocation()
  const { city, setCity } = useApp()

  if (!city) {
    return <LocationGate onSelect={(c) => setCity(c)} />
  }

  return (
    <>
      <Navbar />
      <ScrollToTop />   {/* ✅ route change hone par page top pe jayega */}

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/request/:service" element={<RequestForm />} />
        {/* Engineer */}
        <Route path="/engineer-login" element={<EngineerLogin />} />
        <Route path="/engineer" element={<EngineerDashboard />} />
      </Routes>

      {location.pathname === "/" && <BottomNavbar />}
      <Footer />
      <Toaster position="top-right" />
      <div id="portal-root"></div>
    </>
  )
}
