import { Mail, Phone, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-[#1A2A49] text-gray-300 mt-12"
    >
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-extrabold text-white">Pluggy</h2>
          <p className="mt-3 text-sm leading-relaxed">
            Reliable home services at your doorstep. <br />
            Quality technicians, transparent pricing, and customer trust.
          </p>

          {/* ✅ Subscribe Box Vertical */}
          <div className="mt-5 max-w-xs">
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-md">
              <Mail size={16} className="text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 text-sm text-gray-800 focus:outline-none"
              />
            </div>
            <button className="mt-3 w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-2 rounded-lg text-white font-medium text-sm hover:from-blue-700 hover:to-indigo-700 transition-all">
              Subscribe
            </button>
            <p className="text-xs text-gray-400 mt-2">
              📩 Get latest offers & service updates directly in your inbox
            </p>
          </div>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services/ac-repair" className="hover:text-white">AC Services</Link></li>
            <li><Link to="/services/fan-motor" className="hover:text-white">Fan & Motor</Link></li>
            <li><Link to="/services/wiring" className="hover:text-white">Wiring</Link></li>
            <li><Link to="/services/electrical" className="hover:text-white">Electrical</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Hapur, Uttar Pradesh, India
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> +91 09098098099
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> contact@pluggy.com
            </li>
          </ul>
        </div>
      </div>

      {/* ✅ Bottom Bar */}
      <div className="border-t border-gray-600 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} <span className="font-bold text-white">Pluggy</span>. All rights reserved.
      </div>
    </motion.footer>
  )
}
