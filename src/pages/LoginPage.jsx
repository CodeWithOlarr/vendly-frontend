import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, ShoppingBag } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { loginUser } from "../api/authApi"

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  function validate() {
    const newErrors = {}
    if (!form.email.trim())
      newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email address"
    if (!form.password)
      newErrors.password = "Password is required"
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters"
    return newErrors
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
      const data = await loginUser({ email: form.email, password: form.password })

      // ✅ If account needs verification redirect to OTP page
      if (data.needsVerification) {
        navigate("/verify-otp", { state: { email: data.email } })
        return
      }

      login({
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        avatar: data.name.slice(0, 2).toUpperCase(),
        token: data.token,
      })
      navigate("/")
    } catch (err) {
      // ✅ Handle unverified from error response
      if (err.message.includes("not verified")) {
        navigate("/verify-otp", { state: { email: form.email } })
        return
      }
      setErrors({ email: err.message })
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-extrabold text-dark">
              Vend<span className="text-primary">ly</span>
            </Link>
            <p className="text-gray-500 text-sm mt-2">Welcome back! Sign in to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <div className={`flex items-center border rounded-xl px-4 py-3 gap-2 transition
                ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200 focus-within:border-primary"}`}>
                <Mail size={17} className="text-gray-400" />
                <input
                  type="text"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="outline-none text-sm text-gray-700 w-full bg-transparent"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline"> Forgot password? </Link>
              </div>
              <div className={`flex items-center border rounded-xl px-4 py-3 gap-2 transition
                ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200 focus-within:border-primary"}`}>
                <Lock size={17} className="text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="outline-none text-sm text-gray-700 w-full bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-primary transition"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : "Sign In"}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs text-gray-400">or continue with</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          {/* Demo Login */}
          <button
            onClick={() => setForm({ email: "demo@vendly.ng", password: "demo123" })}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition"
          >
            <ShoppingBag size={17} />
            Use Demo Account
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create one free
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default LoginPage