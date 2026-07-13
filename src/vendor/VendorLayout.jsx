import { useState }            from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  LayoutDashboard, Package,
  ShoppingBag, LogOut, Menu,
  X, ChevronRight, Store
} from "lucide-react"
import { useAuth } from "../context/AuthContext"

const navLinks = [
  { to: "/vendor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/vendor/products",  icon: Package,          label: "Products"  },
  { to: "/vendor/orders",    icon: ShoppingBag,      label: "Orders"    },
]

function VendorLayout({ children }) {
  const location                      = useLocation()
  const navigate                      = useNavigate()
  const { user, logout }              = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate("/")
  }

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-dark text-white flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:flex
      `}>

        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-700 flex items-center justify-between">
          <Link to="/" className="text-xl font-extrabold">
            Vend<span className="text-primary">ly</span>
            <span className="text-xs font-normal text-gray-400 ml-2">Vendor</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Store Info */}
        <div className="px-4 py-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-extrabold text-sm">
              {user?.avatar}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">Vendor Account</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {navLinks.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition
                  ${active
                    ? "bg-primary text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
              >
                <Icon size={18} />
                {label}
                {active && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            )
          })}

          {/* Back to store */}
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:bg-gray-800 hover:text-white transition mt-2"
          >
            <Store size={18} /> View Store
          </Link>
        </nav>

        {/* Logout */}
        <div className="px-4 py-5 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition px-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">
            {navLinks.find((l) => l.to === location.pathname)?.label || "Vendor"}
          </h1>
          <Link to="/" className="ml-auto text-sm text-primary hover:underline font-semibold">
            ← View Store
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>

      </div>
    </div>
  )
}

export default VendorLayout