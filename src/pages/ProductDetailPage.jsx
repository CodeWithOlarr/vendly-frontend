import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  ShoppingCart, Heart, Star, Truck,
  ShieldCheck, RefreshCw, Minus, Plus, Share2
} from "lucide-react"
import { useCart }     from "../context/CartContext"
import { useAuth }     from "../context/AuthContext"
import { useWishlist } from "../context/WishlistContext"
import { useToast }    from "../context/ToastContext"
import { fetchProductById, fetchProducts, fetchReviews, submitReview } from "../api/productApi"
import ProductCard from "../components/ProductCard"
import { LoadingSpinner, ErrorMessage } from "../components/StatusMessage"

function formatPrice(amount) {
  return "₦" + amount.toLocaleString("en-NG")
}

function ProductDetailPage() {
  const { id }                            = useParams()
  const { addToCart }                     = useCart()
  const { isLoggedIn, getToken }          = useAuth()
  const { toggleWishlist, isWishlisted }  = useWishlist()
  const { showToast }                     = useToast()

  const [product,      setProduct]      = useState(null)
  const [related,      setRelated]      = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [quantity,     setQuantity]     = useState(1)
  const [activeTab,    setActiveTab]    = useState("description")
  const [added,        setAdded]        = useState(false)

  // ✅ Reviews state — named reviewsList to avoid conflict with product.reviews count
  const [reviewsList,   setReviewsList]   = useState([])
  const [userRating,    setUserRating]    = useState(0)
  const [userComment,   setUserComment]   = useState("")
  const [submitting,    setSubmitting]    = useState(false)
  const [hoverRating,   setHoverRating]   = useState(0)

  const wishlisted = isWishlisted(product?._id)

  async function loadProduct() {
    try {
      setLoading(true)
      setError(null)
      const data        = await fetchProductById(id)
      setProduct(data)
      const all         = await fetchProducts({ category: data.category })
      setRelated(all.filter((p) => p._id !== data._id).slice(0, 4))
      const reviewsData = await fetchReviews(id)
      setReviewsList(reviewsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProduct()
    window.scrollTo(0, 0)
  }, [id])

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  async function handleSubmitReview(e) {
    e.preventDefault()
    if (!userRating) {
      showToast("Please select a star rating", "error")
      return
    }
    if (!userComment.trim()) {
      showToast("Please write a comment", "error")
      return
    }
    setSubmitting(true)
    try {
      const review = await submitReview(
        product._id,
        { rating: userRating, comment: userComment },
        getToken()
      )
      setReviewsList((prev) => [review, ...prev])
      setUserRating(0)
      setUserComment("")
      showToast("Review submitted! ⭐", "success")
      loadProduct()
    } catch (err) {
      showToast(err.message, "error")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner message="Loading product..." />
  if (error)   return <ErrorMessage message={error} onRetry={loadProduct} />
  if (!product) return null

  // ✅ Renamed product.reviews to reviewCount to avoid conflict with reviewsList state
  const {
    name, price, oldPrice, rating,
    reviews: reviewCount,
    vendor, image, badge, inStock, category
  } = product

  const discount = oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : null

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 flex-wrap">
        <Link to="/" className="hover:text-primary transition">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary transition">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(category)}`} className="hover:text-primary transition">
          {category}
        </Link>
        <span>/</span>
        <span className="text-gray-600 font-medium truncate max-w-xs">{name}</span>
      </div>

      {/* Main Section */}
      <div className="flex flex-col md:flex-row gap-10 mb-16">

        {/* Image */}
        <div className="flex-1">
          <div className="relative rounded-3xl overflow-hidden bg-gray-100 aspect-square">
            <img src={image} alt={name} className="w-full h-full object-cover" />
            {badge && (
              <span className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                {badge}
              </span>
            )}
            {discount && (
              <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                -{discount}% OFF
              </span>
            )}
            {!inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-white text-gray-800 font-bold px-6 py-3 rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-4">
          <Link to="/vendors" className="text-primary font-semibold text-sm hover:underline w-fit">
            {vendor}
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-800 leading-tight">{name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} size={16}
                  className={star <= Math.round(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 fill-gray-300"}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">{rating}</span>
            <span className="text-sm text-gray-400">({reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold text-gray-900">{formatPrice(price)}</span>
            {oldPrice && (
              <span className="text-lg text-gray-400 line-through">{formatPrice(oldPrice)}</span>
            )}
            {discount && (
              <span className="text-green-600 font-bold text-sm">
                You save {formatPrice(oldPrice - price)}
              </span>
            )}
          </div>

          <hr className="border-gray-200" />

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-700">Quantity:</span>
            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="text-gray-500 hover:text-primary transition"
              >
                <Minus size={16} />
              </button>
              <span className="font-bold text-gray-800 w-6 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="text-gray-500 hover:text-primary transition"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition
                ${added ? "bg-green-500 text-white" : "bg-dark text-white hover:bg-primary"}
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ShoppingCart size={18} />
              {added ? "Added to Cart! ✓" : inStock ? "Add to Cart" : "Out of Stock"}
            </button>

            <button
              onClick={() => {
                toggleWishlist(product)
                showToast(
                  wishlisted ? "Removed from wishlist" : "Added to wishlist! ❤️",
                  "success"
                )
              }}
              className={`p-3 border rounded-xl transition
                ${wishlisted
                  ? "border-red-400 text-red-500 bg-red-50"
                  : "border-gray-200 hover:border-red-400 hover:text-red-500"
                }`}
            >
              <Heart size={20} className={wishlisted ? "fill-red-500" : ""} />
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                showToast("Link copied to clipboard! 🔗", "success")
              }}
              className="p-3 border border-gray-200 rounded-xl hover:border-primary hover:text-primary transition"
            >
              <Share2 size={20} />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              { icon: Truck,       color: "bg-green-50 text-green-600",   title: "Fast Delivery",   sub: "Nationwide"    },
              { icon: ShieldCheck, color: "bg-blue-50 text-blue-600",     title: "Verified Seller", sub: "100% trusted"  },
              { icon: RefreshCw,   color: "bg-orange-50 text-orange-600", title: "Easy Returns",    sub: "7-day policy"  },
            ].map(({ icon: Icon, color, title, sub }) => (
              <div key={title} className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl p-3 text-center">
                <Icon size={20} className="text-primary" />
                <p className="text-xs font-semibold text-gray-700">{title}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {["description", "specs", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-semibold capitalize transition border-b-2 -mb-px
                ${activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab === "reviews" ? `Reviews (${reviewsList.length})` : tab}
            </button>
          ))}
        </div>

        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="text-gray-600 text-sm leading-relaxed max-w-2xl flex flex-col gap-3">
            <p>
              The <strong>{name}</strong> is one of the most sought-after products in its
              category. Sold by <strong>{vendor}</strong>, this product combines premium
              quality with outstanding performance.
            </p>
            <p>
              With a rating of <strong>{rating}/5</strong> from {reviewsList.length} verified
              reviews, you can shop with confidence.
            </p>
            <p>
              Available for nationwide delivery across Nigeria. Order today and enjoy fast,
              reliable shipping right to your doorstep.
            </p>
          </div>
        )}

        {/* Specs Tab */}
        {activeTab === "specs" && (
          <div className="max-w-lg">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["Category",     category],
                  ["Vendor",       vendor],
                  ["Availability", inStock ? "In Stock" : "Out of Stock"],
                  ["Rating",       `${rating} / 5`],
                  ["Reviews",      reviewsList.length],
                  ["Price",        formatPrice(price)],
                ].map(([label, value]) => (
                  <tr key={label} className="border-b border-gray-100">
                    <td className="py-3 pr-6 font-semibold text-gray-700 w-40">{label}</td>
                    <td className="py-3 text-gray-600">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="flex flex-col gap-6 max-w-2xl">

            {/* Average Rating Summary */}
            <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-5">
              <div className="text-center">
                <p className="text-5xl font-extrabold text-gray-800">{rating}</p>
                <div className="flex items-center gap-0.5 justify-center mt-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} size={14}
                      className={star <= Math.round(rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 fill-gray-300"}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">{reviewsList.length} reviews</p>
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                {[5,4,3,2,1].map((star) => {
                  const count = reviewsList.filter((r) => r.rating === star).length
                  const pct   = reviewsList.length
                    ? Math.round((count / reviewsList.length) * 100)
                    : 0
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-3">{star}</span>
                      <Star size={11} className="text-yellow-400 fill-yellow-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-yellow-400 h-1.5 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-6">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Write a Review */}
            {isLoggedIn ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <h3 className="font-bold text-gray-800 mb-4">Write a Review</h3>
                <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">

                  {/* Star Selector */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Your Rating</p>
                    <div className="flex gap-1 items-center">
                      {[1,2,3,4,5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none"
                        >
                          <Star
                            size={28}
                            className={star <= (hoverRating || userRating)
                              ? "text-yellow-400 fill-yellow-400 transition"
                              : "text-gray-300 fill-gray-300 transition"
                            }
                          />
                        </button>
                      ))}
                      {userRating > 0 && (
                        <span className="text-sm text-gray-500 ml-2">
                          {["","Poor","Fair","Good","Very Good","Excellent"][userRating]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">Your Review</label>
                    <textarea
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      rows={4}
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : "Submit Review ⭐"}
                  </button>

                </form>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-5 text-center flex flex-col gap-3">
                <p className="text-gray-600 text-sm">
                  You must be logged in to write a review.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link
                    to="/login"
                    className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="border border-primary text-primary px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary hover:text-white transition"
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}

            {/* Reviews List */}
            {reviewsList.length > 0 ? (
              <div className="flex flex-col gap-4">
                {reviewsList.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                          {review.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-sm text-gray-800">{review.name}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map((star) => (
                          <Star key={star} size={12}
                            className={star <= review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300 fill-gray-300"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Star size={40} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No reviews yet. Be the first to review this product!</p>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

export default ProductDetailPage