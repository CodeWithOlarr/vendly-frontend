import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { registerUser } from "../api/authApi"
import { useToast } from "../context/ToastContext"

function Field({ label, name, value, onChange, type = "text", placeholder, icon: Icon, rightEl, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className={`flex items-center border rounded-xl px-4 py-3 gap-2 transition
        ${error ? "border-red-400 bg-red-50" : "border-gray-200 focus-within:border-primary"}`}>
        <Icon size={17} className="text-gray-400" />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="outline-none text-sm text-gray-700 w-full bg-transparent"
        />
        {rightEl}
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  )
}

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { showToast } = useToast()

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirm: ""
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  function validate() {
    const newErrors = {}
    if (!form.name.trim())
      newErrors.name = "Full name is required"
    if (!form.email.trim())
      newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email address"
    if (!form.phone.trim())
      newErrors.phone = "Phone number is required"
    else if (!/^(\+234|0)[789]\d{9}$/.test(form.phone.replace(/\s/g, "")))
      newErrors.phone = "Enter a valid Nigerian phone number"
    if (!form.password)
      newErrors.password = "Password is required"
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters"
    if (!form.confirm)
      newErrors.confirm = "Please confirm your password"
    else if (form.confirm !== form.password)
      newErrors.confirm = "Passwords do not match"
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
      const data = await registerUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      })
      // ✅ Redirect to OTP page with email
      navigate("/verify-otp", { state: { email: form.email } })
      showToast("Check your email for OTP! 📧", "success")
    } catch (err) {
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
            <p className="text-gray-500 text-sm mt-2">Create your free account today</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <Field label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" icon={User} error={errors.name} />
            <Field label="Email Address" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" icon={Mail} error={errors.email} />
            <Field label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="08012345678" icon={Phone} error={errors.phone} />

            <Field
              label="Password" name="password" value={form.password}
              onChange={handleChange} type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters" icon={Lock} error={errors.password}
              rightEl={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-primary transition">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />

            <Field
              label="Confirm Password" name="confirm" value={form.confirm}
              onChange={handleChange} type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password" icon={Lock} error={errors.confirm}
              rightEl={
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-400 hover:text-primary transition">
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />

            <p className="text-xs text-gray-400 text-center mt-1">
              By registering you agree to our{" "}
              <span className="text-primary cursor-pointer hover:underline">Terms of Service</span>
              {" "}and{" "}
              <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition disabled:opacity-70 flex items-center justify-center gap-2 mt-1"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : "Create Account"}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default RegisterPage