// src/App.jsx
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
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
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

// Account & Tracking pages
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("pluggy_theme", "light");
  }, [theme]);

  useEffect(() => {
    const handleLoad = () => setLoading(false);
    window.addEventListener("load", handleLoad);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(timer);
    };
  }, []);

  if (loading) return <Preloader />;
  if (!city) return <LocationGate onSelect={(c) => setCity(c)} />;

  const hideNavbarRoutes = ["/login", "/signup", "/engineer-login", "/admin-login", "/account"];
  const hideFooterRoutes = ["/login", "/signup", "/engineer-login", "/admin-login", "/engineer", "/account"];

  const hideNavbar = hideNavbarRoutes.includes(location.pathname);
  const hideFooter = hideFooterRoutes.some((path) => location.pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen bg-[#F4F6F9] dark:bg-[#0B1120] transition-colors duration-300">
      {!hideNavbar && <Navbar />}

      <main className="flex-1">
        <ScrollToTop />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/book-service" element={<BookService />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />
          <Route path="/track" element={<TrackRequests />} />
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
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:category" element={<ServiceDetail />} />
          <Route path="/services/:category/:sub" element={<ServiceDetail />} />
          <Route path="/request/:service" element={<RequestForm />} />
          <Route path="/engineer-login" element={<EngineerLogin />} />
          <Route path="/engineer" element={<EngineerDashboard />} />
          <Route path="/engineer-dashboard" element={<EngineerDashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!hideFooter && <BottomNavbar />}
      {!hideFooter && <Footer />}

      <Toaster
        position="bottom-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{ bottom: 85 }}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1A2A49",
            color: "#fff",
            borderRadius: "50px",
            padding: "10px 16px",
            fontSize: "13px",
            fontWeight: "500",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            maxWidth: "340px",
          },
          success: {
            style: { background: "#10B981" },
            iconTheme: { primary: "white", secondary: "#10B981" },
          },
          error: {
            style: { background: "#EF4444" },
            iconTheme: { primary: "white", secondary: "#EF4444" },
            duration: 4000,
          },
        }}
      />
      <div id="portal-root"></div>
    </div>
  );
}
