import { Mail, Phone, MapPin } from "lucide-react"
import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="bg-dark text-gray-300 pt-12 pb-6 px-6 mt-auto">
      <div className="max-w-6xl mx-auto">

        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="text-2xl font-bold text-white">
              Shop<span className="text-primary">Hub</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nigeria's trusted multi-vendor marketplace. Shop from verified vendors across the country.
            </p>
            <div className="flex gap-3">
              <span className="text-sm font-semibold hover:text-primary cursor-pointer transition">FB</span>
              <span className="text-sm font-semibold hover:text-primary cursor-pointer transition">TW</span>
              <span className="text-sm font-semibold hover:text-primary cursor-pointer transition">IG</span>
              <span className="text-sm font-semibold hover:text-primary cursor-pointer transition">YT</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide">Quick Links</h4>
            <Link to="/"         className="text-sm hover:text-primary transition">Home</Link>
            <Link to="/products" className="text-sm hover:text-primary transition">Products</Link>
            <Link to="/vendors"  className="text-sm hover:text-primary transition">Vendors</Link>
            <Link to="/products?badge=Sale" className="text-sm hover:text-primary transition">Deals</Link>
            <Link to="/register" className="text-sm hover:text-primary transition">Join Us</Link>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide">Categories</h4>
            <Link to="/products?category=Electronics" className="text-sm hover:text-primary transition">Electronics</Link>
            <Link to="/products?category=Fashion"     className="text-sm hover:text-primary transition">Fashion</Link>
            <Link to="/products?category=Laptops"     className="text-sm hover:text-primary transition">Laptops</Link>
            <Link to="/products?category=Audio"       className="text-sm hover:text-primary transition">Audio</Link>
            <Link to="/products?category=Cameras"     className="text-sm hover:text-primary transition">Cameras</Link>
            <Link to="/products?category=Fitness"     className="text-sm hover:text-primary transition">Fitness</Link>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide">Contact Us</h4>
            <div className="flex items-center gap-2 text-sm">
              <Mail size={15} className="text-primary" />
              support@shophub.ng
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone size={15} className="text-primary" />
              +234 800 SHOPHUB
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={15} className="text-primary" />
              Lagos, Nigeria
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2026 ShopHub. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-primary transition cursor-pointer">Privacy Policy</span>
            <span className="hover:text-primary transition cursor-pointer">Terms of Service</span>
            <span className="hover:text-primary transition cursor-pointer">Cookie Policy</span>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer