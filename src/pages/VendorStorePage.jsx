import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Star, MapPin, Package, ShieldCheck, ArrowLeft, Calendar } from "lucide-react"
import { fetchVendorBySlug } from "../api/vendorApi"
import { fetchProducts } from "../api/productApi"
import ProductCard from "../components/ProductCard"
import { LoadingSpinner, ErrorMessage } from "../components/StatusMessage"

function VendorStorePage() {
  const { slug }                    = useParams()
  const [vendor,   setVendor]       = useState(null)
  const [products, setProducts]     = useState([])
  const [loading,  setLoading]      = useState(true)
  const [error,    setError]        = useState(null)

  async function loadVendor() {
    try {
      setLoading(true)
      setError(null)
      const vendorData    = await fetchVendorBySlug(slug)
      setVendor(vendorData)
      const allProducts   = await fetchProducts()
      setProducts(allProducts.filter((p) => p.vendor === vendorData.name))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVendor()
    window.scrollTo(0, 0)
  }, [slug])

  if (loading) return <LoadingSpinner message="Loading vendor store..." />
  if (error)   return <ErrorMessage message={error} onRetry={loadVendor} />
  if (!vendor) return null

  const { name, category, location, rating, reviews, sales, verified, description, banner, avatar, color, joined } = vendor

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <Link to="/vendors" className="flex items-center gap-2 text-sm text-primary hover:underline font-semibold mb-6">
        <ArrowLeft size={16} /> Back to Vendors
      </Link>

      {/* Banner */}
      <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden mb-16">
        <img src={banner} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className={`absolute bottom-0 left-6 translate-y-1/2 w-20 h-20 rounded-2xl ${color} text-white flex items-center justify-center text-2xl font-extrabold shadow-xl border-4 border-white`}>
          {avatar}
        </div>
        {verified && (
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 text-green-600 text-xs font-bold px-3 py-1.5 rounded-full">
            <ShieldCheck size={13} /> Verified Vendor
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-gray-800">{name}</h1>
          <p className="text-primary font-semibold text-sm">{category}</p>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <MapPin size={14} /> {location}
          </div>
          <p className="text-sm text-gray-500 max-w-xl leading-relaxed mt-1">{description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 min-w-fit">
          {[
            { icon: Star,     label: "Rating",  value: `${rating}/5`          },
            { icon: Package,  label: "Reviews", value: reviews                },
            { icon: Package, label: "Products", value: vendor.productCount || 0 },
            { icon: Calendar, label: "Since",   value: joined                 },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-gray-50 rounded-2xl p-4 text-center flex flex-col items-center gap-1">
              <Icon size={18} className="text-primary" />
              <p className="text-lg font-extrabold text-gray-800">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Products by {name}
          <span className="text-base font-normal text-gray-400 ml-2">({products.length} items)</span>
        </h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <Package size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No products listed by this vendor yet.</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default VendorStorePage