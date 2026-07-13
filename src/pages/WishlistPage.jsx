import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useWishlist } from "../context/WishlistContext"
import { useCart }     from "../context/CartContext"
import { useToast }    from "../context/ToastContext"

function formatPrice(amount) {
  return "₦" + amount.toLocaleString("en-NG")
}

function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart }                         = useCart()
  const { showToast }                         = useToast()

  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center gap-5 text-center">
        <Heart size={64} className="text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-700">Your wishlist is empty</h2>
        <p className="text-gray-400">Save products you love and come back to them later.</p>
        <Link
          to="/products"
          className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>
        <p className="text-gray-500 text-sm mt-1">
          <span className="text-primary font-semibold">{wishlistItems.length}</span> saved items
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group"
          >
            {/* Image */}
            <Link to={`/products/${product._id}`} className="relative overflow-hidden bg-gray-50">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-white text-gray-800 text-sm font-bold px-4 py-2 rounded-full">
                    Out of Stock
                  </span>
                </div>
              )}
            </Link>

            {/* Body */}
            <div className="p-4 flex flex-col gap-2 flex-1">
              <p className="text-xs text-primary font-semibold">{product.vendor}</p>
              <Link to={`/products/${product._id}`}>
                <h3 className="text-sm font-bold text-gray-800 leading-snug line-clamp-2 hover:text-primary transition">
                  {product.name}
                </h3>
              </Link>
              <p className="text-base font-extrabold text-gray-900 mt-1">
                {formatPrice(product.price)}
              </p>

              {/* Actions */}
              <div className="flex gap-2 mt-auto">
                <button
                  disabled={!product.inStock}
                  onClick={() => {
                    addToCart(product)
                    showToast("Added to cart! 🛒", "success")
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-dark text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={14} />
                  {product.inStock ? "Add to Cart" : "Unavailable"}
                </button>

                <button
                  onClick={() => {
                    removeFromWishlist(product._id)
                    showToast("Removed from wishlist", "success")
                  }}
                  className="p-2.5 border border-gray-200 rounded-xl hover:border-red-400 hover:text-red-500 transition"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default WishlistPage