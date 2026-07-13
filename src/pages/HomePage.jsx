import { useState, useEffect } from "react"
import { ArrowRight, Tag, Truck, ShieldCheck, RefreshCw } from "lucide-react"
import { Link } from "react-router-dom"
import CategoryCard from "../components/CategoryCard"
import ProductCard from "../components/ProductCard"
import { LoadingSpinner, ErrorMessage } from "../components/StatusMessage"
import { fetchProducts, fetchCategoryCounts, fetchFeaturedProducts } from "../api/productApi"
import categories from "../data/categories"

function HomePage() {
  const [products, setProducts] = useState([])
  const [categoryCounts, setCategoryCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function loadData() {
    try {
      setLoading(true)
      setError(null)
      const [productsData, countsData] = await Promise.all([
        fetchFeaturedProducts(),
        fetchCategoryCounts(),
      ])
      setProducts(productsData)
      setCategoryCounts(countsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  return (
    <main>

      {/* HERO */}
      <section className="bg-gradient-to-r from-dark to-gray-800 text-white px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">

          <div className="flex-1 flex flex-col gap-5">
            <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full w-fit">
              New Arrivals Every Day
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Shop Smarter, <br />
              <span className="text-primary">Live Better</span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg max-w-md">
              Discover thousands of products from trusted vendors across Nigeria.
              Electronics, Fashion, Gadgets and more all in one place.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/products"
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link
                to="/vendors"
                className="flex items-center gap-2 border border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-dark transition"
              >
                Browse Vendors
              </Link>
            </div>
          </div>

          <div className="flex-1 flex justify-center md:justify-end">
            <div className="bg-white text-dark rounded-3xl p-8 flex flex-col gap-5 w-full max-w-sm shadow-2xl">
              <h3 className="font-bold text-lg text-gray-800">Why Vendly?</h3>
              {[
                { icon: ShieldCheck, color: "bg-blue-100 text-blue-600", title: "Verified Vendors", sub: "Every seller is vetted & trusted" },
                { icon: Truck, color: "bg-green-100 text-green-600", title: "Fast Delivery", sub: "Nationwide delivery across Nigeria" },
                { icon: RefreshCw, color: "bg-orange-100 text-orange-600", title: "Easy Returns", sub: "7-day hassle-free returns" },
                { icon: Tag, color: "bg-pink-100 text-pink-600", title: "Best Prices", sub: "Compare prices across vendors" },
              ].map(({ icon: Icon, color, title, sub }) => (
                <div key={title} className="flex items-center gap-3">
                  <div className={`${color} p-2 rounded-xl`}><Icon size={22} /></div>
                  <div>
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-xs text-gray-500">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>
            <p className="text-gray-500 text-sm mt-1">Find exactly what you're looking for</p>
          </div>
          <Link to="/products" className="flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              icon={category.icon}
              color={category.color}
              count={categoryCounts[category.name]}
            />
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
              <p className="text-gray-500 text-sm mt-1">Handpicked deals just for you</p>
            </div>
            <Link to="/products" className="flex items-center gap-1 text-primary text-sm font-semibold hover:underline">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading && <LoadingSpinner message="Loading products..." />}
          {error && <ErrorMessage message={error} onRetry={loadData} />}

          {!loading && !error && (
            products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">No featured products yet. Check back soon!</p>
              </div>
            )
          )}
        </div>
      </section>

    </main>
  )
}

export default HomePage