import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Lock, Gift, Truck, PackageCheck } from "lucide-react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"

function formatPrice(amount) {
  return "₦" + amount.toLocaleString("en-NG")
}

function CartPage() {
  const { cartItems, removeFromCart, increaseQty, decreaseQty, cartTotal, clearCart } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center gap-5 text-center">
        <ShoppingBag size={64} className="text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-400">Looks like you haven't added anything yet.</p>
        <Link
          to="/products"
          className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  const delivery = cartTotal >= 50000 ? 0 : 2500
  const grandTotal = cartTotal + delivery

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Your Cart</h1>
          <p className="text-gray-500 text-sm mt-1">{cartItems.length} item(s) in your cart</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:underline"
          >
            Clear Cart
          </button>
          <Link
            to="/products"
            className="flex items-center gap-2 text-sm text-primary hover:underline font-semibold"
          >
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Cart Items */}
        <div className="flex-1 flex flex-col gap-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-gray-100"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl bg-gray-100"
              />

              {/* Details */}
              <div className="flex-1 flex flex-col gap-1">
                <p className="text-xs text-primary font-semibold">{item.vendor}</p>
                <h3 className="font-bold text-gray-800 text-sm leading-snug">{item.name}</h3>
                <p className="text-base font-extrabold text-gray-900 mt-1">
                  {formatPrice(item.price)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => decreaseQty(item._id)}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary hover:text-primary transition"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item._id)}
                    className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:border-primary hover:text-primary transition"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Subtotal + Remove */}
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
                <p className="font-bold text-gray-800 text-sm">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* Free Delivery Banner */}
        {cartTotal < 50000 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-3">
            <p className="text-xs text-blue-700 font-semibold flex items-center justify-center gap-2">
              <Truck className="h-4 w-4" />
              Add{" "}
              <span className="text-primary font-bold">
                {formatPrice(50000 - cartTotal)}
              </span>
              {" "}more to get FREE delivery!
            </p>
          </div>
        )}

        {cartTotal >= 50000 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3">
            <p className="text-xs text-green-700 font-semibold flex items-center justify-center gap-2">
              <PackageCheck className="h-4 w-4" />
              You qualify for FREE delivery!
            </p>
          </div>
        )}

        {/* Order Summary */}
        <div className="lg:w-80">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-5">Order Summary</h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>

                <span
                  className={`flex items-center gap-1 font-semibold ${delivery === 0 ? "text-green-500" : ""
                    }`}
                >
                  {delivery === 0 ? (
                    <>
                      <Gift className="h-4 w-4" />
                      FREE
                    </>
                  ) : (
                    formatPrice(delivery)
                  )}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-bold text-gray-800">
                <span>Total</span>
                <span className="text-primary">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full mt-6 bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition text-center block"
            >
              Proceed to Checkout
            </Link>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Lock size={14} className="text-gray-500" />
              <span>Secure checkout powered by Paystack</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CartPage