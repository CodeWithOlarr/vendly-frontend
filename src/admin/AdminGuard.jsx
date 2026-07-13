import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function AdminGuard({ children }) {
  const { isLoggedIn, isAdmin } = useAuth()

  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (!isAdmin)    return <Navigate to="/"      replace />

  return children
}

export default AdminGuard