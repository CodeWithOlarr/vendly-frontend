import { createContext, useContext, useState, useEffect } from "react"
import { fetchMe } from "../api/authApi"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  // ✅ On app load — check if token exists and verify with backend
  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("shophub_token")
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const data = await fetchMe(token)
        setUser({
          name:   data.name,
          email:  data.email,
          phone:  data.phone,
          role:   data.role,
          avatar: data.name.slice(0, 2).toUpperCase(),
          token:  data.token,
        })
      } catch {
        // Token invalid or expired — clear it
        localStorage.removeItem("shophub_token")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  function login(userData) {
    setUser(userData)
    localStorage.setItem("shophub_token", userData.token)
  }

  function logout() {
    setUser(null)
    localStorage.removeItem("shophub_token")
  }

  function register(userData) {
    setUser(userData)
    localStorage.setItem("shophub_token", userData.token)
  }

  function getToken() {
    return localStorage.getItem("shophub_token")
  }

  const isLoggedIn = user !== null
  const isAdmin    = user?.role === "admin"

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      register,
      isLoggedIn,
      isAdmin,
      getToken,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}