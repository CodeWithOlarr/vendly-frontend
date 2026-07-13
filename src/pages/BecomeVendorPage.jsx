import { useState, useEffect }  from "react"
import { Link, useNavigate }    from "react-router-dom"
import {
  Store, MapPin, Phone, Tag,
  AtSign, FileText, CheckCircle,
  Clock, XCircle, ArrowRight
} from "lucide-react"
import { useAuth }  from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { submitVendorApplication, fetchMyApplication } from "../api/vendorApplicationApi"
import { LoadingSpinner } from "../components/StatusMessage"

const categories = [
  "Electronics & Gadgets",
  "Fashion & Clothing",
  "Phones & Accessories",
  "Laptops & Computers",
  "Audio & Music",
  "Cameras & Photography",
  "Watches & Jewelry",
  "Home & Living",
  "Fitness & Sports",
  "Food & Beverages",
  "Beauty & Personal Care",
  "Books & Education",
  "Other",
]

function StatusCard({ application }) {
  const statusConfig = {
    pending: {
      icon:    Clock,
      color:   "text-yellow-500",
      bg:      "bg-yellow-50 border-yellow-200",
      title:   "Application Under Review",
      message: "Your vendor application is being reviewed by our team. We'll notify you via email within 2-3 business days.",
    },
    approved: {
      icon:    CheckCircle,
      color:   "text-green-500",
      bg:      "bg-green-50 border-green-200",
      title:   "Application Approved!",
      message: "Congratulations! Your vendor application has been approved. You can now access your Vendor Dashboard.",
    },
    rejected: {
      icon:    XCircle,
      color:   "text-red-500",
      bg:      "bg-red-50 border-red-200",
      title:   "Application Not Approved",
      message: "Unfortunately your application was not approved at this time.",
    },
  }

  const config = statusConfig[application.status]
  const Icon   = config.icon

  return (
    <div className={`rounded-2xl border p-6 flex flex-col gap-4 ${config.bg}`}>
      <div className="flex items-center gap-3">
        <Icon size={28} className={config.color} />
        <h3 className="font-bold text-gray-800 text-lg">{config.title}</h3>
      </div>
      <p className="text-gray-600 text-sm">{config.message}</p>

      {application.adminNote && (
        <div className="bg-white rounded-xl p-3 border border-gray-200">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Admin Note</p>
          <p className="text-sm text-gray-700">{application.adminNote}</p>
        </div>
      )}

      <div className="bg-white rounded-xl p-4 text-sm flex flex-col gap-2">
        <p className="font-bold text-gray-700 text-xs uppercase mb-1">Your Application</p>
        <div className="flex justify-between">
          <span className="text-gray-500">Store Name</span>
          <span className="font-semibold text-gray-800">{application.storeName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Category</span>
          <span className="font-semibold text-gray-800">{application.category}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Location</span>
          <span className="font-semibold text-gray-800">{application.location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Applied</span>
          <span className="font-semibold text-gray-800">
            {new Date(application.createdAt).toLocaleDateString("en-NG", {
              day: "numeric", month: "short", year: "numeric"
            })}
          </span>
        </div>
      </div>

      {application.status === "approved" && (
        <Link
          to="/vendor/dashboard"
          className="flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition"
        >
          Go to Vendor Dashboard <ArrowRight size={16} />
        </Link>
      )}
    </div>
  )
}

function BecomeVendorPage() {
  const { isLoggedIn, getToken, user } = useAuth()
  const { showToast }                 = useToast()
  const navigate                      = useNavigate()

  const [application, setApplication] = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [submitting,  setSubmitting]  = useState(false)

  const [form, setForm] = useState({
    storeName:   "",
    category:    categories[0],
    location:    "",
    description: "",
    phone:       user?.phone || "",
    instagram:   "",
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false)
      return
    }
    async function checkApplication() {
      try {
        const data = await fetchMyApplication(getToken())
        setApplication(data)
      } catch {
        setApplication(null)
      } finally {
        setLoading(false)
      }
    }
    checkApplication()
  }, [isLoggedIn])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  function validate() {
    const newErrors = {}
    if (!form.storeName.trim())   newErrors.storeName   = "Store name is required"
    if (!form.location.trim())    newErrors.location    = "Location is required"
    if (!form.description.trim()) newErrors.description = "Description is required"
    else if (form.description.trim().length < 50)
      newErrors.description = "Description must be at least 50 characters"
    if (!form.phone.trim())       newErrors.phone       = "Phone number is required"
    return newErrors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setSubmitting(true)
    try {
      const data = await submitVendorApplication(form, getToken())
      setApplication(data)
      showToast("Application submitted! We'll review it soon.", "success")
    } catch (err) {
      showToast(err.message, "error")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading..." />

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-dark to-blue-900 text-white rounded-3xl p-8 md:p-12 mb-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 flex flex-col gap-4">
          <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full w-fit border border-primary/30">
            Vendor Program
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
            Sell on Vendly and <br />
            <span className="text-primary">Grow your Business</span>
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Join hundreds of verified vendors selling to customers across Nigeria.
            Apply today and start your journey.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {[
              { label: "Active Vendors",  value: "100+"  },
              { label: "Products Listed", value: "5,000+" },
              { label: "Happy Customers", value: "20,000+" },
              { label: "Cities Covered",  value: "36"    },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-xl font-extrabold text-white">{value}</p>
                <p className="text-xs text-gray-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="grid grid-cols-2 gap-3 max-w-xs w-full">
            {[
              { icon: CheckCircle, text: "Free to apply"         },
              { icon: CheckCircle, text: "Set your own prices"   },
              { icon: CheckCircle, text: "Nationwide reach"      },
              { icon: CheckCircle, text: "Fast Paystack payouts" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="bg-white/10 rounded-xl p-4 flex items-center gap-2">
                <Icon size={16} className="text-primary flex-shrink-0" />
                <p className="text-xs text-white font-semibold">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Not logged in */}
      {!isLoggedIn ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center flex flex-col gap-4 items-center">
          <Store size={48} className="text-gray-300" />
          <h2 className="text-xl font-bold text-gray-800">Sign in to Apply</h2>
          <p className="text-gray-500 text-sm">You need a Vendly account to apply as a vendor.</p>
          <div className="flex gap-3">
            <Link to="/login"    className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition text-sm">Sign In</Link>
            <Link to="/register" className="border border-primary text-primary px-6 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition text-sm">Register</Link>
          </div>
        </div>
      ) : user?.role === "vendor" ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center flex flex-col gap-4 items-center">
          <CheckCircle size={48} className="text-green-500" />
          <h2 className="text-xl font-bold text-gray-800">You're already a Vendor!</h2>
          <p className="text-gray-500 text-sm">You have full vendor access on Vendly.</p>
          <Link to="/vendor/dashboard" className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition text-sm flex items-center gap-2">
            Go to Vendor Dashboard <ArrowRight size={16} />
          </Link>
        </div>
      ) : application ? (
        <div className="max-w-lg mx-auto">
          <StatusCard application={application} />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Form */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Vendor Application Form</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Store Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Store size={15} className="text-primary" /> Store Name
                  </label>
                  <input
                    type="text"
                    name="storeName"
                    value={form.storeName}
                    onChange={handleChange}
                    placeholder="e.g. TechZone Lagos"
                    className={`border rounded-xl px-4 py-3 text-sm outline-none transition
                      ${errors.storeName ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-primary"}`}
                  />
                  {errors.storeName && <p className="text-xs text-red-500">{errors.storeName}</p>}
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Tag size={15} className="text-primary" /> Business Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin size={15} className="text-primary" /> Business Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Ikeja, Lagos"
                    className={`border rounded-xl px-4 py-3 text-sm outline-none transition
                      ${errors.location ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-primary"}`}
                  />
                  {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Phone size={15} className="text-primary" /> Business Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="08012345678"
                    className={`border rounded-xl px-4 py-3 text-sm outline-none transition
                      ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-primary"}`}
                  />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>

                {/* Instagram */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <AtSign size={15} className="text-primary" /> Instagram Handle
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={form.instagram}
                    onChange={handleChange}
                    placeholder="@yourbusiness"
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileText size={15} className="text-primary" /> Business Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Tell us about your business, what you sell, your experience, etc. (minimum 50 characters)"
                    rows={4}
                    className={`border rounded-xl px-4 py-3 text-sm outline-none resize-none transition
                      ${errors.description ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-primary"}`}
                  />
                  <div className="flex justify-between">
                    {errors.description
                      ? <p className="text-xs text-red-500">{errors.description}</p>
                      : <span />
                    }
                    <p className={`text-xs ${form.description.length < 50 ? "text-gray-400" : "text-green-500"}`}>
                      {form.description.length}/50 min
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : "Submit Application"}
                </button>

              </form>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="lg:w-72 flex flex-col gap-4">

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-4">How it works</h3>
              <div className="flex flex-col gap-4">
                {[
                  { step: "1", title: "Submit Application",   desc: "Fill in your store details and submit" },
                  { step: "2", title: "Admin Review",         desc: "Our team reviews within 2-3 business days" },
                  { step: "3", title: "Get Approved",         desc: "Receive email confirmation of approval" },
                  { step: "4", title: "Start Selling",        desc: "Access your dashboard and add products" },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{title}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <h3 className="font-bold text-gray-800 mb-3 text-sm">Requirements</h3>
              <div className="flex flex-col gap-2">
                {[
                  "Valid Nigerian business",
                  "Verified Vendly account",
                  "Quality products to sell",
                  "Responsive to customers",
                  "Honour delivery timelines",
                ].map((req) => (
                  <div key={req} className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-primary flex-shrink-0" />
                    <p className="text-xs text-gray-600">{req}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default BecomeVendorPage