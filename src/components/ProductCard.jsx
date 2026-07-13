import { ShoppingCart, Star, Heart } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useWishlist } from "../context/WishlistContext"
import { useToast } from "../context/ToastContext"
import { Link } from "react-router-dom"

function formatPrice(amount) {
  return "₦" + amount.toLocaleString("en-NG")
}

function getBadgeStyle(badge) {
  switch (badge) {
    case "Hot":       return "bg-red-500 text-white"
    case "Sale":      return "bg-primary text-white"
    case "New":       return "bg-blue-500 text-white"
    case "Top Rated": return "bg-yellow-500 text-white"
    default:          return ""
  }
}

function ProductCard({ product }) {
  const { addToCart }                   = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()
  const { showToast }                   = useToast()

  const { name, price, oldPrice, rating, reviews, vendor, image, badge, inStock } = product

  const wishlisted = isWishlisted(product._id)

  const discount = oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : null

  function handleWishlist(e) {
    e.preventDefault()
    toggleWishlist(product)
    showToast(
      wishlisted ? "Removed from wishlist" : "Added to wishlist! ❤️",
      "success"
    )
  }

  function handleAddToCart(e) {
    e.preventDefault()
    addToCart(product)
    showToast("Added to cart!", "success")
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition border border-gray-100 group overflow-hidden flex flex-col">

      {/* Image Container */}
      <Link to={`/products/${product._id}`}>
        <div className="relative overflow-hidden bg-gray-50">
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {badge && (
            <span className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full ${getBadgeStyle(badge)}`}>
              {badge}
            </span>
          )}

          {discount && (
            <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow opacity-0 group-hover:opacity-100 transition"
          >
            <Heart
              size={16}
              className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}
            />
          </button>

          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-800 text-sm font-bold px-4 py-2 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">

        <p className="text-xs text-primary font-semibold">{vendor}</p>

        <h3 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2">{name}</h3>

        <div className="flex items-center gap-1">
          <Star size={13} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-semibold text-gray-700">{rating}</span>
          <span className="text-xs text-gray-400">({reviews} reviews)</span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-base font-extrabold text-gray-900">
            {formatPrice(price)}
          </span>
          {oldPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(oldPrice)}
            </span>
          )}
        </div>

        <button
          disabled={!inStock}
          onClick={handleAddToCart}
          className="mt-auto flex items-center justify-center gap-2 bg-dark text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={16} />
          {inStock ? "Add to Cart" : "Unavailable"}
        </button>

      </div>
    </div>
  )
}

export default ProductCard