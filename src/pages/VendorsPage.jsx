import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, Star, ShieldCheck, MapPin, Package, ArrowRight } from "lucide-react"
import { fetchVendors } from "../api/vendorApi"
import { VendorCardSkeleton } from "../components/Skeleton"
import { LoadingSpinner, ErrorMessage } from "../components/StatusMessage"

function VendorCard({ vendor }) {
  const { name, slug, category, location, rating, reviews, sales, verified, description, banner, avatar, color } = vendor

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
      <div className="relative h-32 overflow-hidden">
        <img src={banner} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className={`absolute bottom-0 left-4 translate-y-1/2 w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center text-lg font-extrabold shadow-lg border-2 border-white`}>
          {avatar}
        </div>
        {verified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 text-green-600 text-xs font-bold px-2 py-1 rounded-full">
            <ShieldCheck size={12} /> Verified
          </div>
        )}
      </div>

      <div className="pt-10 px-4 pb-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-extrabold text-gray-800 text-base">{name}</h3>
            <p className="text-xs text-primary font-semibold">{category}</p>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-gray-700">{rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400">
          <MapPin size={13} /> {location}
        </div>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1">
            <Package size={13} className="text-primary" />
            <span><strong className="text-gray-700">{vendor.productCount || 0}</strong> products</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={13} className="text-primary" />
            <span><strong className="text-gray-700">{reviews}</strong> reviews</span>
          </div>
        </div>

        <Link
          to={`/vendors/${slug}`}
          className="mt-auto flex items-center justify-center gap-2 bg-dark text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary transition"
        >
          Visit Store <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  )
}

function VendorsPage() {
  const [search, setSearch] = useState("")
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function loadVendors() {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchVendors(search)
      setVendors(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVendors()
  }, [search])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">Our Vendors</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Shop from <span className="text-primary font-semibold">verified vendors</span> across Nigeria
        </p>
      </div>

      <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 gap-2 shadow-sm max-w-lg mx-auto mb-10">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vendors by name, category or location..."
          className="outline-none text-sm text-gray-700 w-full bg-transparent"
        />
      </div>

      {loading && <LoadingSpinner message="Loading vendors..." />}
      {error && <ErrorMessage message={error} onRetry={loadVendors} />}

      {!loading && !error && (
        vendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <VendorCard key={vendor._id} vendor={vendor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No vendors found for "{search}"</p>
          </div>
        )
      )}
    </div>
  )
}

export default VendorsPage