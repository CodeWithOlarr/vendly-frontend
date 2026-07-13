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
import WishlistPage from "./pages/WishlistPage"
import AdminGuard from "./admin/AdminGuard"
import AdminLayout from "./admin/AdminLayout"
import AdminDashboard from "./admin/pages/AdminDashboard"
import AdminProducts from "./admin/pages/AdminProducts"
import AdminOrders from "./admin/pages/AdminOrders"
import AdminUsers from "./admin/pages/AdminUsers"
import BecomeVendorPage from "./pages/BecomeVendorPage"
import AdminVendorApplications from "./admin/pages/AdminVendorApplications"
import VendorGuard from "./vendor/VendorGuard"
import VendorLayout from "./vendor/VendorLayout"
import VendorDashboard from "./vendor/pages/VendorDashboard"
import VendorProducts from "./vendor/pages/VendorProducts"
import VendorOrders from "./vendor/pages/VendorOrders"
import VerifyOTPPage from "./pages/VerifyOTPPage"
import ProfilePage from "./pages/ProfilePage"
import ChatWidget from "./components/ChatWidget"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import TermsPage from "./pages/TermsPage"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import RefundPolicyPage from "./pages/RefundPolicyPage"
import FAQPage from "./pages/FAQPage"
import AboutPage from "./pages/AboutPage"
import CookieConsent from "./components/CookieConsent"
import { useAuth } from "./context/AuthContext"
import { Loader } from "lucide-react"

function App() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader size={36} className="text-primary animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Loading Vendly...</p>
        </div>
      </div>
    )
  }
  return (
    <BrowserRouter>
      <Routes>

        {/* ===== ADMIN ROUTES — no Navbar/Footer ===== */}
        <Route path="/admin" element={
          <AdminGuard>
            <AdminLayout><AdminDashboard /></AdminLayout>
          </AdminGuard>
        } />
        <Route path="/admin/products" element={
          <AdminGuard>
            <AdminLayout><AdminProducts /></AdminLayout>
          </AdminGuard>
        } />
        <Route path="/admin/orders" element={
          <AdminGuard>
            <AdminLayout><AdminOrders /></AdminLayout>
          </AdminGuard>
        } />
        <Route path="/admin/users" element={
          <AdminGuard>
            <AdminLayout><AdminUsers /></AdminLayout>
          </AdminGuard>
        } />
        <Route path="/admin/vendor-applications" element={
          <AdminGuard>
            <AdminLayout><AdminVendorApplications /></AdminLayout>
          </AdminGuard>
        } />

        <Route path="/vendor/dashboard" element={
          <VendorGuard>
            <VendorLayout><VendorDashboard /></VendorLayout>
          </VendorGuard>
        } />
        <Route path="/vendor/products" element={
          <VendorGuard>
            <VendorLayout><VendorProducts /></VendorLayout>
          </VendorGuard>
        } />
        <Route path="/vendor/orders" element={
          <VendorGuard>
            <VendorLayout><VendorOrders /></VendorLayout>
          </VendorGuard>
        } />

        {/* ===== STORE ROUTES — with Navbar/Footer ===== */}
        <Route path="/*" element={
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/verify-otp" element={<VerifyOTPPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/vendors" element={<VendorsPage />} />
              <Route path="/vendors/:slug" element={<VendorStorePage />} />
              <Route path="/become-vendor" element={<BecomeVendorPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/refund-policy" element={<RefundPolicyPage />} />
              <Route path="/faq" element={<FAQPage />} />
            </Routes>
            <Footer />
            <ChatWidget />
            <CookieConsent />
          </div>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App