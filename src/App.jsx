import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import CartPage from "./pages/CartPage"
import VendorsPage from "./pages/VendorsPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import VendorStorePage from "./pages/VendorStorePage"
import CheckoutPage from "./pages/CheckoutPage"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50">

        {/* Navbar always visible */}
        <Navbar />

        {/* Page content swaps here */}
        <Routes>
          <Route path="/"         element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart"     element={<CartPage />} />
          <Route path="/vendors"  element={<VendorsPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/vendors/:slug" element={<VendorStorePage/>} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>

        {/* Footer always visible */}
        <Footer />

      </div>
    </BrowserRouter>
  )
}

export default App