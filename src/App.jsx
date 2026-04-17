// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import BottomNavbar from "./components/BottomNavbar";
import Footer from "./components/Footer";
import LocationGate from "./components/LocationGate";
import ScrollToTop from "./components/ScrollToTop";
import Preloader from "./components/Preloader";
import BookService from "./pages/BookService";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import RequestForm from "./pages/RequestForm";
import ServiceDetail from "./pages/ServiceDetail";
import EngineerLogin from "./pages/EngineerLogin";
import EngineerDashboard from "./pages/EngineerDashboard";

// Account pages
import TrackRequests from "./pages/TrackRequests";
import CartPage from "./pages/CartPage";
import SecurityPage from "./pages/SecurityPage";
import AddressPage from "./pages/AddressPage";
import RecentPage from "./pages/RecentPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import EditProfilePage from "./pages/EditProfilePage";
import CouponsPage from "./pages/CouponsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ServicesPage from "./pages/ServicesPage";

import { useApp } from "./AppContext";

export default function App() {
  const location = useLocation();
  const { city, setCity, theme } = useApp();

  // Preloader
  const [loading, setLoading] = useState(true);

  // DARK MODE INITIALIZATION
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const handleLoad = () => setLoading(false);
    window.addEventListener("load", handleLoad);
    const timer = setTimeout(() => setLoading(false), 4500);
    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(timer);
    };
  }, []);

  // Show preloader
  if (loading) return <Preloader />;

  // City gate
  if (!city) return <LocationGate onSelect={(c) => setCity(c)} />;

  // Hide nav/footer for certain routes
  const hideNavbarRoutes = [
    "/login", 
    "/signup", 
    "/engineer-login", 
    "/engineer",
    "/account"  // ✅ ADDED - Prevent content leak
  ];
  
  const hideFooterRoutes = [
    "/login",
    "/signup",
    "/engineer-login",
    "/engineer",
    "/services",
    "/request",
    "/account",  // ✅ ADDED - Prevent content leak
  ];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);
  const hideFooter = hideFooterRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0B1120] transition-colors duration-300">
      {!hideNavbar && <Navbar />}

      <main className="flex-1">
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/book-service" element={<BookService />} />

          {/* Auth */}
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

          {/* Services */}
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/services/:category/:sub" element={<ServiceDetail />} />

          {/* Requests */}
          <Route path="/request/:service" element={<RequestForm />} />

          {/* Engineer */}
          <Route path="/engineer-login" element={<EngineerLogin />} />
          <Route path="/engineer" element={<EngineerDashboard />} />
        </Routes>
      </main>

      {!hideNavbar && location.pathname === "/" && <BottomNavbar />}
      {!hideFooter && <Footer />}

      <Toaster
        position="bottom-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          bottom: 80,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1A2A49',
            color: '#fff',
            borderRadius: '50px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          },
          success: {
            style: {
              background: '#10B981',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
            iconTheme: {
              primary: 'white',
              secondary: '#EF4444',
            },
            duration: 4000,
          },
        }}
      />
      <div id="portal-root"></div>
    </div>
  );
}