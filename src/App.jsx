import { Routes, Route, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useState, useEffect } from "react"

import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Account from "./pages/Account"
import RequestForm from "./pages/RequestForm"
import ServiceDetail from "./pages/ServiceDetail"

import Navbar from "./components/Navbar"
import BottomNavbar from "./components/BottomNavbar"
import Footer from "./components/Footer"   // ✅ Footer import
import LocationGate from "./components/LocationGate"

export default function App() {
  const [city, setCity] = useState(null)
  const [user, setUser] = useState(null)
  const location = useLocation() // ✅ current route

  useEffect(() => {
    const saved = localStorage.getItem("pluggy_city")
    if (saved) {
      try {
        setCity(JSON.parse(saved))
      } catch {
        setCity(saved)
      }
    }
    const storedUser = localStorage.getItem("pluggy_user")
    if (storedUser) setUser(JSON.parse(storedUser))
  }, [])

  if (!city) {
    return (
      <LocationGate
        onSelect={(c) => {
          localStorage.setItem("pluggy_city", JSON.stringify(c))
          setCity(c)
        }}
      />
    )
  }

  return (
    <>
      <Navbar city={city} setCity={setCity} user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/account" element={<Account user={user} setUser={setUser} />} />
        <Route path="/request/:service" element={<RequestForm />} />
      </Routes>

      {/* ✅ Bottom Navbar sirf Home page par */}
      {location.pathname === "/" && <BottomNavbar />}

      {/* ✅ Footer sabhi pages par */}
      <Footer />

      <Toaster position="top-right" />
      <div id="portal-root"></div>
    </>
  )
}
