import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

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

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoggedIn, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}