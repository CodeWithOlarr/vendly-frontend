import { BrowserRouter, Routes, Route } from "react-router-dom"
import { lazy, Suspense }               from "react"
import { useAuth }                      from "./context/AuthContext"
import { Loader }                       from "lucide-react"

import Navbar        from "./components/Navbar"
import Footer        from "./components/Footer"
import ChatWidget    from "./components/ChatWidget"
import CookieConsent from "./components/CookieConsent"
import ScrollToTop   from "./components/ScrollToTop"
import AdminGuard    from "./admin/AdminGuard"
import VendorGuard   from "./vendor/VendorGuard"

const HomePage               = lazy(() => import("./pages/HomePage"))
const ProductsPage           = lazy(() => import("./pages/ProductsPage"))
const ProductDetailPage      = lazy(() => import("./pages/ProductDetailPage"))
const CartPage               = lazy(() => import("./pages/CartPage"))
const VendorsPage            = lazy(() => import("./pages/VendorsPage"))
const LoginPage              = lazy(() => import("./pages/LoginPage"))
const RegisterPage           = lazy(() => import("./pages/RegisterPage"))
const VendorStorePage        = lazy(() => import("./pages/VendorStorePage"))
const CheckoutPage           = lazy(() => import("./pages/CheckoutPage"))
const WishlistPage           = lazy(() => import("./pages/WishlistPage"))
const BecomeVendorPage       = lazy(() => import("./pages/BecomeVendorPage"))
const VerifyOTPPage          = lazy(() => import("./pages/VerifyOTPPage"))
const ProfilePage            = lazy(() => import("./pages/ProfilePage"))
const ForgotPasswordPage     = lazy(() => import("./pages/ForgotPasswordPage"))
const TermsPage              = lazy(() => import("./pages/TermsPage"))
const PrivacyPolicyPage      = lazy(() => import("./pages/PrivacyPolicyPage"))
const RefundPolicyPage       = lazy(() => import("./pages/RefundPolicyPage"))
const FAQPage                = lazy(() => import("./pages/FAQPage"))
const AboutPage              = lazy(() => import("./pages/AboutPage"))
const AdminLayout            = lazy(() => import("./admin/AdminLayout"))
const AdminDashboard         = lazy(() => import("./admin/pages/AdminDashboard"))
const AdminProducts          = lazy(() => import("./admin/pages/AdminProducts"))
const AdminOrders            = lazy(() => import("./admin/pages/AdminOrders"))
const AdminUsers             = lazy(() => import("./admin/pages/AdminUsers"))
const AdminVendorApplications = lazy(() => import("./admin/pages/AdminVendorApplications"))
const VendorLayout           = lazy(() => import("./vendor/VendorLayout"))
const VendorDashboard        = lazy(() => import("./vendor/pages/VendorDashboard"))
const VendorProducts         = lazy(() => import("./vendor/pages/VendorProducts"))
const VendorOrders           = lazy(() => import("./vendor/pages/VendorOrders"))

// Page loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader size={28} className="text-primary animate-spin" />
    </div>
  )
}

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
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* ADMIN ROUTES */}
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

          {/* VENDOR ROUTES */}
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

          {/* STORE ROUTES */}
          <Route path="/*" element={
            <div className="min-h-screen flex flex-col bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/"                element={<HomePage />}           />
                <Route path="/products"        element={<ProductsPage />}       />
                <Route path="/products/:id"    element={<ProductDetailPage />}  />
                <Route path="/cart"            element={<CartPage />}           />
                <Route path="/wishlist"        element={<WishlistPage />}       />
                <Route path="/vendors"         element={<VendorsPage />}        />
                <Route path="/vendors/:slug"   element={<VendorStorePage />}    />
                <Route path="/become-vendor"   element={<BecomeVendorPage />}   />
                <Route path="/login"           element={<LoginPage />}          />
                <Route path="/register"        element={<RegisterPage />}       />
                <Route path="/verify-otp"      element={<VerifyOTPPage />}      />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/profile"         element={<ProfilePage />}        />
                <Route path="/checkout"        element={<CheckoutPage />}       />
                <Route path="/about"           element={<AboutPage />}          />
                <Route path="/terms"           element={<TermsPage />}          />
                <Route path="/privacy-policy"  element={<PrivacyPolicyPage />}  />
                <Route path="/refund-policy"   element={<RefundPolicyPage />}   />
                <Route path="/faq"             element={<FAQPage />}            />
              </Routes>
              <Footer />
              <ChatWidget />
              <CookieConsent />
            </div>
          } />

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App