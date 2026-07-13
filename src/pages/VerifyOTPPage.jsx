import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { Mail, RefreshCw, CheckCircle } from "lucide-react"
import { useAuth }  from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { verifyOTP, resendOTP } from "../api/authApi"

function VerifyOTPPage() {
  const navigate          = useNavigate()
  const location          = useLocation()
  const { login }         = useAuth()
  const { showToast }     = useToast()

  // Email passed from register/login page
  const email = location.state?.email || ""

  const [otp,       setOtp]       = useState(["", "", "", "", "", ""])
  const [loading,   setLoading]   = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [verified,  setVerified]  = useState(false)

  const inputRefs = useRef([])

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  // Redirect if no email
  useEffect(() => {
    if (!email) navigate("/register")
  }, [email])

  function handleOtpChange(index, value) {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index, e) {
    // Backspace — go to previous input
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

  async function handleVerify(e) {
    e.preventDefault()
    const otpString = otp.join("")
    if (otpString.length !== 6) {
      showToast("Please enter the complete 6-digit code", "error")
      return
    }

    setLoading(true)
    try {
      const data = await verifyOTP({ email, otp: otpString })
      login({
        name:   data.name,
        email:  data.email,
        phone:  data.phone,
        role:   data.role,
        avatar: data.name.slice(0, 2).toUpperCase(),
        token:  data.token,
      })
      setVerified(true)
      setTimeout(() => navigate("/"), 2000)
    } catch (err) {
      showToast(err.message, "error")
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (!canResend) return
    setResending(true)
    try {
      await resendOTP({ email })
      showToast("New OTP sent to your email! 📧", "success")
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

  // Success screen
  if (verified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Account Verified! 🎉</h2>
          <p className="text-gray-500 text-sm">Welcome to Vendly! Redirecting you...</p>
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-extrabold text-dark">
              Vend<span className="text-primary">ly</span>
            </Link>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mt-4 mb-3">
              <Mail size={28} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Check your email</h2>
            <p className="text-gray-500 text-sm mt-2">
              We sent a 6-digit verification code to
            </p>
            <p className="text-primary font-semibold text-sm mt-1">{email}</p>
          </div>

          {/* OTP Input */}
          <form onSubmit={handleVerify} className="flex flex-col gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-700 text-center mb-4">
                Enter verification code
              </p>
              <div className="flex gap-3 justify-center" onPaste={handlePaste}>
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
                    className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition
                      ${digit
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-gray-800"
                      } focus:border-primary`}
                  />
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : "Verify Account"}
            </button>

            {/* Resend */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="flex items-center gap-2 text-primary font-semibold text-sm hover:underline mx-auto"
                >
                  {resending ? (
                    <RefreshCw size={15} className="animate-spin" />
                  ) : (
                    <RefreshCw size={15} />
                  )}
                  Resend Code
                </button>
              ) : (
                <p className="text-sm text-gray-400">
                  Resend code in{" "}
                  <span className="text-primary font-semibold">{countdown}s</span>
                </p>
              )}
            </div>

          </form>

          {/* Wrong email */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Wrong email?{" "}
            <Link to="/register" className="text-primary hover:underline font-semibold">
              Go back
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default VerifyOTPPage