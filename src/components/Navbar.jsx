import { useState } from "react"
import { ShoppingCart, Search, Menu, X, User, Heart, Flame } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useWishlist } from "../context/WishlistContext"

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const { cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  const { user, logout, isLoggedIn, isAdmin } = useAuth()
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (searchText.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchText.trim())}`)
      setSearchText("")
      setMenuOpen(false)
    }
  }

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate("/")
  }

  return (
    <nav className="bg-dark text-white px-6 py-4 shadow-lg sticky top-0 z-50">

      {/* Top Row */}
      <div className="flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-primary tracking-wide">
          Vend<span className="text-white">ly</span>
        </Link>

        {/* Search Bar - hidden on mobile */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/3"
        >
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search products, vendors..."
            className="outline-none text-gray-700 text-sm w-full bg-transparent"
          />
          <button type="submit" className="text-primary ml-2">
            <Search size={16} strokeWidth={2.5} />
          </button>
        </form>

        {/* Right Icons */}
        <div className="flex items-center gap-5">

          {/* Wishlist Icon */}
          <Link to="/wishlist" className="relative cursor-pointer">
            <Heart size={22} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative cursor-pointer">
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth Buttons - desktop */}
          <div className="hidden md:flex gap-3 items-center">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:opacity-80 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    {user.avatar}
                  </div>
                  <span className="text-sm font-semibold">
                    {user.name.split(" ")[0]}
                  </span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-xs bg-primary text-white px-2 py-1 rounded-full hover:opacity-90 transition"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="text-xs text-gray-300 hover:text-red-400 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <button className="flex items-center gap-1.5 border border-primary text-primary px-4 py-1.5 rounded-full text-sm hover:bg-primary hover:text-white transition">
                    <User size={14} /> Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="bg-primary text-white px-4 py-1.5 rounded-full text-sm hover:opacity-90 transition">
                    Register
                  </button>
                </Link>
                <Link to="/become-vendor" className="hover:text-primary transition">Sell on Vendly</Link>
              </>
            )}
          </div>

          {/* Hamburger - mobile only */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>
      </div>

      {/* ===== MOBILE MENU WITH SLIDE TRANSITION ===== */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
        ${menuOpen ? "max-h-screen opacity-100 mt-4" : "max-h-0 opacity-0"}`}
      >
        <div className="flex flex-col gap-3 pb-4">

          {/* Mobile Search */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white rounded-full px-4 py-2"
          >
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search products..."
              className="outline-none text-gray-700 text-sm w-full bg-transparent"
            />
            <button type="submit" className="text-primary ml-2">
              <Search size={16} strokeWidth={2.5} />
            </button>
          </form>

          {/* Mobile Nav Links */}
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-sm hover:text-primary transition py-1">Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="text-sm hover:text-primary transition py-1">All Products</Link>
          <Link to="/products?category=Electronics" onClick={() => setMenuOpen(false)} className="text-sm hover:text-primary transition py-1">Electronics</Link>
          <Link to="/products?category=Fashion" onClick={() => setMenuOpen(false)} className="text-sm hover:text-primary transition py-1">Fashion</Link>
          <Link to="/vendors" onClick={() => setMenuOpen(false)} className="text-sm hover:text-primary transition py-1">Vendors</Link>
          <Link
            to="/wishlist"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 text-sm hover:text-primary transition py-1"
          >
            <Heart size={16} />
            Wishlist
          </Link>
          {/* ✅ Show user info if logged in, auth buttons if not */}
          {isLoggedIn ? (
            <div className="flex flex-col gap-3 border-t border-gray-700 pt-3 mt-1">
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                  {user.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </Link>

              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="text-sm hover:text-primary transition py-1"
              >
                My Profile & Orders
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm bg-primary text-white px-4 py-2 rounded-full text-center font-semibold hover:opacity-90 transition"
                >
                  Admin Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-sm text-red-400 hover:text-red-300 transition text-left"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3 mt-1 border-t border-gray-700 pt-3">
              <Link to="/login" className="w-full" onClick={() => setMenuOpen(false)}>
                <button className="flex items-center justify-center gap-1.5 border border-primary text-primary px-4 py-1.5 rounded-full text-sm w-full hover:bg-primary hover:text-white transition">
                  <User size={14} /> Login
                </button>
              </Link>
              <Link to="/register" className="w-full" onClick={() => setMenuOpen(false)}>
                <button className="bg-primary text-white px-4 py-1.5 rounded-full text-sm w-full hover:opacity-90 transition">
                  Register
                </button>
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* Bottom Nav Links - desktop only */}
      <div className="hidden md:flex gap-6 mt-3 text-sm text-gray-300 border-t border-gray-600 pt-3">
        <Link to="/" className="hover:text-primary transition">Home</Link>
        <Link to="/products?category=Electronics" className="hover:text-primary transition">Electronics</Link>
        <Link to="/products?category=Fashion" className="hover:text-primary transition">Fashion</Link>
        <Link to="/products?category=Phones" className="hover:text-primary transition">Phones</Link>
        <Link to="/products?category=Laptops" className="hover:text-primary transition">Laptops</Link>
        <Link to="/products?category=Audio" className="hover:text-primary transition">Audio</Link>
        <Link to="/vendors" className="hover:text-primary transition">Vendors</Link>
        <Link
          to="/products?badge=Sale"
          className="flex items-center gap-1 hover:text-primary transition"
        >
          <Flame size={16} />
          Deals
        </Link>      </div>

    </nav>
  )
}

export default Navbar