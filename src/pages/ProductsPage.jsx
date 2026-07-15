import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react"
import ProductCard from "../components/ProductCard"
import { fetchProducts } from "../api/productApi"
import { ProductCardSkeleton } from "../components/Skeleton"
import { LoadingSpinner, ErrorMessage } from "../components/StatusMessage"

const categories = ["All", "Phones", "Laptops", "Audio", "Fashion", "Cameras", "Watches", "Fitness", "Home & Living", "Electronics"]

const sortOptions = [
  { label: "Latest", value: "latest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Most Reviews", value: "reviews" },
]

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get("search") || ""
  const activeCategory = searchParams.get("category") || "All"
  const sortBy = searchParams.get("sort") || "latest"

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [maxPrice, setMaxPrice] = useState(1500000)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  async function loadProducts() {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchProducts({ category: activeCategory, search, sort: sortBy })
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [search, activeCategory, sortBy])

  function updateParams(changes) {
    const current = {
      search: searchParams.get("search") || "",
      category: searchParams.get("category") || "",
      sort: searchParams.get("sort") || "",
      ...changes,
    }
    const next = {}
    if (current.search) next.search = current.search
    if (current.category && current.category !== "All") next.category = current.category
    if (current.sort && current.sort !== "latest") next.sort = current.sort
    setSearchParams(next, { replace: true })
  }

  function setSearch(value) { updateParams({ search: value }) }
  function setActiveCategory(value) { updateParams({ category: value }) }
  function setSortBy(value) { updateParams({ sort: value }) }

  function resetFilters() {
    setSearchParams({}, { replace: true })
    setMaxPrice(1500000)
    setInStockOnly(false)
  }

  const filtered = useMemo(() => {
    let result = [...products]
    result = result.filter((p) => p.price <= maxPrice)
    if (inStockOnly) result = result.filter((p) => p.inStock)
    return result
  }, [products, maxPrice, inStockOnly])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {activeCategory === "All" ? "All Products" : activeCategory}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Showing <span className="font-semibold text-primary">{filtered.length}</span> products
        </p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 gap-2 shadow-sm">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, vendors, categories..."
            className="outline-none text-sm text-gray-700 w-full bg-transparent"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X size={16} className="text-gray-400 hover:text-red-500" />
            </button>
          )}
        </div>

        <div className="relative flex-shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm text-gray-700 shadow-sm outline-none cursor-pointer w-full"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-dark text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary transition"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm flex flex-col sm:flex-row gap-6">
          <div className="flex-1">
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Max Price: <span className="text-primary">₦{maxPrice.toLocaleString("en-NG")}</span>
            </label>
            <input
              type="range" min={10000} max={1500000} step={10000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>₦10,000</span><span>₦1,500,000</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 justify-center">
            <label className="text-sm font-semibold text-gray-700">Availability</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm text-gray-600">In Stock Only</span>
            </label>
          </div>

          <div className="flex items-end">
            <button onClick={resetFilters} className="text-sm text-red-500 hover:underline font-semibold">
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition
              ${activeCategory === cat
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products */}
      {loading && <LoadingSpinner message="Loading products..." />}
      {error && <ErrorMessage message={error} onRetry={loadProducts} />}

      {!loading && !error && (
        filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Search size={52} className="text-gray-300" />
            <h3 className="text-xl font-bold text-gray-600">No products found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
            <button
              onClick={resetFilters}
              className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition"
            >
              Clear Filters
            </button>
          </div>
        )
      )}

    </div>
  )
}

export default ProductsPage