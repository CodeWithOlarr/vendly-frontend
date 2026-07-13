import { Navigate } from "react-router-dom"
import { useAuth }  from "../context/AuthContext"

function VendorGuard({ children }) {
  const { isLoggedIn, user } = useAuth()

  if (!isLoggedIn) return <Navigate to="/login"  replace />
  if (user?.role !== "vendor" && user?.role !== "admin") {
    return <Navigate to="/become-vendor" replace />
  }

  return children
}

export default VendorGuard