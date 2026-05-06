import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ShoppingBag, MapPin, Phone, User, ArrowLeft, CheckCircle } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { placeOrder } from "../api/orderApi"

function formatPrice(amount) {
  return "₦" + amount.toLocaleString("en-NG")
}

// Reusable input field
function Field({ label, name, value, onChange, placeholder, icon: Icon, error, type = "text" }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className={`flex items-center border rounded-xl px-4 py-3 gap-2 transition
        ${error ? "border-red-400 bg-red-50" : "border-gray-200 focus-within:border-primary"}`}>
        {Icon && <Icon size={17} className="text-gray-400" />}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="outline-none text-sm text-gray-700 w-full bg-transparent"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

function CheckoutPage() {
  const navigate          = useNavigate()
  const { cartItems, cartTotal, clearCart } = useCart()
  const { isLoggedIn, getToken, user }      = useAuth()

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone:    user?.phone || "",
    address:  "",
    city:     "",
    state:    "",
  })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState(null)

  const delivery   = 2500
  const tax        = Math.round(cartTotal * 0.075)
  const grandTotal = cartTotal + delivery + tax

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  function validate() {
    const newErrors = {}
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!form.phone.trim())    newErrors.phone    = "Phone number is required"
    if (!form.address.trim())  newErrors.address  = "Address is required"
    if (!form.city.trim())     newErrors.city     = "City is required"
    if (!form.state.trim())    newErrors.state    = "State is required"
    return newErrors
  }

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 flex flex-col items-center gap-5 text-center">
        <ShoppingBag size={56} className="text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-700">Sign in to Checkout</h2>
        <p className="text-gray-400 text-sm">You need to be logged in to place an order.</p>
        <div className="flex gap-3">
          <Link to="/login" className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
            Sign In
          </Link>
          <Link to="/register" className="border border-primary text-primary px-6 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition">
            Register
          </Link>
        </div>
      </div>
    )
  }

  // Empty cart
  if (cartItems.length === 0 && !success) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 flex flex-col items-center gap-5 text-center">
        <ShoppingBag size={56} className="text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
        <Link to="/products" className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">
          Start Shopping
        </Link>
      </div>
    )
  }

  // Success Screen
  if (success) {
    return (
      <div className="max-w-lg mx-auto px-6 py-20 flex flex-col items-center gap-5 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Order Placed! 🎉</h2>
        <p className="text-gray-500 text-sm">
          Your order has been successfully placed and is being processed.
          You'll receive a confirmation shortly.
        </p>
        {orderId && (
          <div className="bg-gray-50 rounded-2xl px-6 py-4 text-sm text-gray-600 w-full">
            <p className="font-semibold text-gray-800 mb-1">Order ID</p>
            <p className="font-mono text-xs break-all text-primary">{orderId}</p>
          </div>
        )}
        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            to="/products"
            className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold hover:border-primary hover:text-primary transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          product:  item._id,
          name:     item.name,
          image:    item.image,
          price:    item.price,
          quantity: item.quantity,
        })),
        deliveryAddress: {
          fullName: form.fullName,
          phone:    form.phone,
          address:  form.address,
          city:     form.city,
          state:    form.state,
        },
        totalPrice:    grandTotal,
        deliveryPrice: delivery,
        taxPrice:      tax,
      }

      const token = getToken()
      const order = await placeOrder(orderData, token)
      setOrderId(order._id)
      clearCart()
      setSuccess(true)
    } catch (err) {
      setErrors({ submit: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/cart" className="flex items-center gap-2 text-sm text-primary hover:underline font-semibold">
          <ArrowLeft size={16} /> Back to Cart
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left — Delivery Form */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

            <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              Delivery Information
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <Field
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                icon={User}
                error={errors.fullName}
              />

              <Field
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="08012345678"
                icon={Phone}
                error={errors.phone}
              />

              <Field
                label="Delivery Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="12 Awolowo Road, Ikoyi"
                icon={MapPin}
                error={errors.address}
              />

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Lagos"
                  error={errors.city}
                />
                <Field
                  label="State"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Lagos State"
                  error={errors.state}
                />
              </div>

              {/* Payment Method */}
              <div className="mt-2">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Method</h3>
                <div className="flex items-center gap-3 border border-primary bg-primary/5 rounded-xl px-4 py-3">
                  <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Pay with Paystack</span>
                  <span className="ml-auto text-xs text-gray-400">Cards, Bank Transfer, USSD</span>
                </div>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <p className="text-sm text-red-500 text-center">{errors.submit}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Placing Order...
                  </>
                ) : `Place Order — ${formatPrice(grandTotal)}`}
              </button>

            </form>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className="lg:w-96">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">

            <h2 className="text-lg font-bold text-gray-800 mb-5">
              Order Summary
              <span className="text-sm font-normal text-gray-400 ml-2">({cartItems.length} items)</span>
            </h2>

            {/* Items */}
            <div className="flex flex-col gap-3 mb-5 max-h-64 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-bold text-gray-800 flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="flex flex-col gap-3 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-semibold">{formatPrice(delivery)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (7.5%)</span>
                <span className="font-semibold">{formatPrice(tax)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-bold text-gray-800">
                <span>Total</span>
                <span className="text-primary">{formatPrice(grandTotal)}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default CheckoutPage