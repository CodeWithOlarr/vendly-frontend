import { useState, useRef, useEffect } from "react"
import { Link, useNavigate }           from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, CheckCircle, RefreshCw } from "lucide-react"
import { useToast }                    from "../context/ToastContext"
import { forgotPassword, resetPassword } from "../api/authApi"

// ===== STEP 1 — Enter Email =====
function EmailStep({ onNext }) {
  const { showToast }       = useToast()
  const [email,   setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim()) {
      setError("Email is required")
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address")
      return
    }
    setLoading(true)
    try {
      await forgotPassword(email)
      showToast("Reset code sent to your email! 📧", "success")
      onNext(email)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Mail size={28} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Forgot Password?</h2>
        <p className="text-gray-500 text-sm mt-2">
          Enter your email and we'll send you a reset code
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Email Address</label>
          <div className={`flex items-center border rounded-xl px-4 py-3 gap-2 transition
            ${error ? "border-red-400 bg-red-50" : "border-gray-200 focus-within:border-primary"}`}>
            <Mail size={17} className="text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError("") }}
              placeholder="you@example.com"
              className="outline-none text-sm text-gray-700 w-full bg-transparent"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : "Send Reset Code"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Remember your password?{" "}
        <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  )
}

// ===== STEP 2 — Enter OTP + New Password =====
function ResetStep({ email, onSuccess }) {
  const { showToast }                   = useToast()
  const [otp,         setOtp]           = useState(["", "", "", "", "", ""])
  const [password,    setPassword]      = useState("")
  const [confirm,     setConfirm]       = useState("")
  const [showPass,    setShowPass]      = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [loading,     setLoading]       = useState(false)
  const [resending,   setResending]     = useState(false)
  const [countdown,   setCountdown]     = useState(60)
  const [canResend,   setCanResend]     = useState(false)
  const [errors,      setErrors]        = useState({})
  const inputRefs                       = useRef([])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  function handleOtpChange(index, value) {
    if (!/^\d*$/.test(value)) return
    const newOtp    = [...otp]
    newOtp[index]   = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(""))
      inputRefs.current[5]?.focus()
    }
  }

  async function handleResend() {
    if (!canResend) return
    setResending(true)
    try {
      await forgotPassword(email)
      showToast("New reset code sent! 📧", "success")
      setCountdown(60)
      setCanResend(false)
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } catch (err) {
      showToast(err.message, "error")
    } finally {
      setResending(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = {}
    const otpString = otp.join("")

    if (otpString.length !== 6) newErrors.otp      = "Enter the complete 6-digit code"
    if (!password)               newErrors.password = "New password is required"
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (password !== confirm)    newErrors.confirm  = "Passwords do not match"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await resetPassword({ email, otp: otpString, newPassword: password })
      showToast("Password reset successfully! 🎉", "success")
      onSuccess()
    } catch (err) {
      setErrors({ otp: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Lock size={28} className="text-primary" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Enter Reset Code</h2>
        <p className="text-gray-500 text-sm mt-2">
          We sent a 6-digit code to <span className="text-primary font-semibold">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* OTP Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700 text-center">
            Verification Code
          </label>
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-11 h-13 text-center text-xl font-bold border-2 rounded-xl outline-none transition py-3
                  ${digit ? "border-primary bg-primary/5 text-primary" : "border-gray-200"}
                  focus:border-primary`}
              />
            ))}
          </div>
          {errors.otp && <p className="text-xs text-red-500 text-center">{errors.otp}</p>}
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">New Password</label>
          <div className={`flex items-center border rounded-xl px-4 py-3 gap-2 transition
            ${errors.password ? "border-red-400 bg-red-50" : "border-gray-200 focus-within:border-primary"}`}>
            <Lock size={17} className="text-gray-400" />
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })) }}
              placeholder="Min. 6 characters"
              className="outline-none text-sm text-gray-700 w-full bg-transparent"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-primary transition">
              {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
          <div className={`flex items-center border rounded-xl px-4 py-3 gap-2 transition
            ${errors.confirm ? "border-red-400 bg-red-50" : "border-gray-200 focus-within:border-primary"}`}>
            <Lock size={17} className="text-gray-400" />
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setErrors((p) => ({ ...p, confirm: "" })) }}
              placeholder="Repeat new password"
              className="outline-none text-sm text-gray-700 w-full bg-transparent"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-400 hover:text-primary transition">
              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.confirm && <p className="text-xs text-red-500">{errors.confirm}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : "Reset Password"}
        </button>

      </form>

      {/* Resend */}
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-1">Didn't receive the code?</p>
        {canResend ? (
          <button
            onClick={handleResend}
            disabled={resending}
            className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline mx-auto"
          >
            <RefreshCw size={14} className={resending ? "animate-spin" : ""} />
            Resend Code
          </button>
        ) : (
          <p className="text-sm text-gray-400">
            Resend in <span className="text-primary font-semibold">{countdown}s</span>
          </p>
        )}
      </div>
    </div>
  )
}

// ===== STEP 3 — Success =====
function SuccessStep() {
  return (
    <div className="flex flex-col items-center gap-5 text-center py-4">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Password Reset! 🎉</h2>
      <p className="text-gray-500 text-sm">
        Your password has been reset successfully. You can now sign in with your new password.
      </p>
      <Link
        to="/login"
        className="bg-primary text-white px-8 py-3 rounded-full font-bold text-sm hover:opacity-90 transition"
      >
        Sign In Now
      </Link>
    </div>
  )
}

// ===== MAIN PAGE =====
function ForgotPasswordPage() {
  const [step,  setStep]  = useState("email")
  const [email, setEmail] = useState("")

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

          {/* Logo */}
          <div className="text-center mb-6">
            <Link to="/" className="text-3xl font-extrabold text-dark">
              Vend<span className="text-primary">ly</span>
            </Link>
          </div>

          {/* Steps */}
          {step === "email"   && <EmailStep onNext={(e) => { setEmail(e); setStep("reset") }} />}
          {step === "reset"   && <ResetStep email={email} onSuccess={() => setStep("success")} />}
          {step === "success" && <SuccessStep />}

        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage