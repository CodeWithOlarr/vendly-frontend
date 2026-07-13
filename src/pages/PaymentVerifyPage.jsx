import { useEffect, useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { CheckCircle, XCircle, Loader } from "lucide-react"
import { useAuth }        from "../context/AuthContext"
import { verifyPayment }  from "../api/paymentApi"

function PaymentVerifyPage() {
  const [searchParams]          = useSearchParams()
  const navigate                = useNavigate()
  const { getToken }            = useAuth()
  const [status,  setStatus]    = useState("verifying")
  const [message, setMessage]   = useState("")

  useEffect(() => {
    async function verify() {
      const reference = searchParams.get("reference")
      if (!reference) {
        setStatus("failed")
        setMessage("No payment reference found.")
        return
      }

      try {
        await verifyPayment(reference, getToken())
        setStatus("success")
        // Redirect to homepage after 3 seconds
        setTimeout(() => navigate("/"), 3000)
      } catch (err) {
        setStatus("failed")
        setMessage(err.message)
      }
    }

    verify()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">

        {/* Verifying */}
        {status === "verifying" && (
          <div className="flex flex-col items-center gap-4">
            <Loader size={48} className="text-primary animate-spin" />
            <h2 className="text-xl font-bold text-gray-800">Verifying Payment...</h2>
            <p className="text-gray-500 text-sm">Please wait while we confirm your payment.</p>
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Payment Successful! 🎉</h2>
            <p className="text-gray-500 text-sm">
              Your order has been placed and payment confirmed.
              You will be redirected shortly.
            </p>
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Failed */}
        {status === "failed" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle size={40} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Payment Failed</h2>
            <p className="text-gray-500 text-sm">{message || "Something went wrong with your payment."}</p>
            <div className="flex gap-3">
              <Link
                to="/cart"
                className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition text-sm"
              >
                Try Again
              </Link>
              <Link
                to="/"
                className="border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold hover:border-primary hover:text-primary transition text-sm"
              >
                Go Home
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default PaymentVerifyPage