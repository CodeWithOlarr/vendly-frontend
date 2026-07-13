import { Link } from "react-router-dom"
import {
  Shield, Truck, RefreshCw, Users,
  Target, Eye, Heart, Award,
  MapPin, Mail, Phone, ArrowRight
} from "lucide-react"

function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Hero */}
      <div className="bg-gradient-to-r from-dark to-blue-900 rounded-3xl p-8 md:p-14 text-white mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About Vendly</h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
          Nigeria's trusted multi-vendor marketplace connecting buyers with
          verified sellers across the country since 2024.
        </p>
      </div>

      {/* Our Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 items-center">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-extrabold text-gray-800">Our Story</h2>
          <p className="text-gray-600 leading-relaxed">
            Vendly was founded with a simple mission to make online shopping
            safe, easy and accessible for every Nigerian. We noticed that buyers
            struggled to find trustworthy sellers online, and sellers struggled
            to reach customers beyond their local area.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We built Vendly to bridge that gap. By carefully vetting every vendor
            on our platform, we ensure that every product you buy meets our strict
            quality standards. Whether you are in Lagos, Abuja, Port Harcourt or
            anywhere across Nigeria, Vendly brings the market to you.
          </p>
          <Link
            to="/vendors"
            className="flex items-center gap-2 text-primary font-semibold hover:underline w-fit"
          >
            Meet our vendors <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Users,  label: "Registered Users",  value: "10,000+"  },
            { icon: Award,  label: "Verified Vendors",  value: "100+"     },
            { icon: Shield, label: "Secure Payments",   value: "100%"     },
            { icon: MapPin, label: "States Covered",    value: "36"       },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Icon size={22} className="text-primary" />
              </div>
              <p className="text-2xl font-extrabold text-gray-800">{value}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission, Vision, Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          {
            icon:  Target,
            title: "Our Mission",
            color: "bg-blue-50 text-blue-600",
            text:  "To empower Nigerian entrepreneurs by providing a trusted digital marketplace where they can reach millions of customers across the country.",
          },
          {
            icon:  Eye,
            title: "Our Vision",
            color: "bg-purple-50 text-purple-600",
            text:  "To become Africa's most trusted e-commerce marketplace, setting the standard for quality, safety and customer satisfaction.",
          },
          {
            icon:  Heart,
            title: "Our Values",
            color: "bg-red-50 text-red-500",
            text:  "Trust, transparency, and excellence. We believe every Nigerian deserves access to quality products at fair prices from verified sellers.",
          },
        ].map(({ icon: Icon, title, color, text }) => (
          <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
              <Icon size={22} />
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-3">{title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      {/* Why Choose Us */}
      <div className="mb-16">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-8">Why Choose Vendly?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon:  Shield,
              title: "Verified Vendors",
              desc:  "Every seller on Vendly goes through a strict vetting process before they can list products.",
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon:  Truck,
              title: "Fast Delivery",
              desc:  "We partner with reliable logistics companies to ensure your orders arrive on time nationwide.",
              color: "bg-green-50 text-green-600",
            },
            {
              icon:  RefreshCw,
              title: "Easy Returns",
              desc:  "Not satisfied? Our 7-day return policy makes it easy to get a refund or replacement.",
              color: "bg-orange-50 text-orange-600",
            },
            {
              icon:  Heart,
              title: "Customer First",
              desc:  "Our support team is available 24/7 to help you with any questions or concerns.",
              color: "bg-red-50 text-red-500",
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mx-auto mb-4`}>
                <Icon size={24} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gray-50 rounded-3xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Get in Touch</h2>
        <p className="text-gray-500 text-sm mb-6">Have questions? We would love to hear from you.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          {[
            { icon: Mail,  text: "noreply.vendly@gmail.com"   },
            { icon: Phone, text: "+234 912 088 7991"   },
            { icon: MapPin,text: "Lagos, Nigeria"       },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100">
              <Icon size={16} className="text-primary" />
              <span className="text-sm font-semibold text-gray-700">{text}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center mt-6">
          <Link
            to="/become-vendor"
            className="bg-primary text-white px-6 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition"
          >
            Become a Vendor
          </Link>
          <Link
            to="/products"
            className="border border-primary text-primary px-6 py-3 rounded-full font-semibold text-sm hover:bg-primary hover:text-white transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>

    </div>
  )
}

export default AboutPage