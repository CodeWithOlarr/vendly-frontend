import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
    User, Mail, Phone, Lock, Eye, EyeOff,
    ShoppingBag, CheckCircle, Clock, Truck,
    Package, ChevronDown, ChevronUp, LogOut,
    Pencil, Save, X
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { updateProfile, changePassword } from "../api/authApi"
import { fetchMyOrders } from "../api/orderApi"
import { OrderRowSkeleton, ProfileSkeleton } from "../components/Skeleton"
import { LoadingSpinner, ErrorMessage } from "../components/StatusMessage"

function formatPrice(amount) {
    return "₦" + amount.toLocaleString("en-NG")
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })
}

function OrderStatusBadge({ isPaid, isDelivered }) {
    if (isDelivered) return (
        <span className="flex items-center gap-1 bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full">
            <CheckCircle size={12} /> Delivered
        </span>
    )
    if (isPaid) return (
        <span className="flex items-center gap-1 bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
            <Truck size={12} /> Paid & Processing
        </span>
    )
    return (
        <span className="flex items-center gap-1 bg-yellow-100 text-yellow-600 text-xs font-bold px-3 py-1 rounded-full">
            <Clock size={12} /> Pending Payment
        </span>
    )
}

// ===== PROFILE INFO TAB =====
// Added `loading` to props to render the ProfileSkeleton when data is fetching
function ProfileTab({ user, getToken, onUserUpdate, loading }) {
    const { showToast } = useToast()
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" })
    const [saving, setSaving] = useState(false)

    // Sync form state when user changes (e.g. after loading completes)
    useEffect(() => {
        if (user) {
            setForm({ name: user.name, phone: user.phone || "" })
        }
    }, [user])

    if (loading) return <ProfileSkeleton />

    async function handleSave() {
        setSaving(true)
        try {
            const data = await updateProfile(form, getToken())
            onUserUpdate(data)
            setEditing(false)
            showToast("Profile updated! ✅", "success")
        } catch (err) {
            showToast(err.message, "error")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">Personal Information</h2>
                {!editing ? (
                    <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-2 text-sm text-primary hover:underline font-semibold"
                    >
                        <Pencil size={15} /> Edit
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setEditing(false)}
                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                        >
                            <X size={15} /> Cancel
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-4">

                {/* Avatar */}
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-extrabold">
                        {user.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 text-lg">{user.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <User size={15} className="text-primary" /> Full Name
                    </label>
                    {editing ? (
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                        />
                    ) : (
                        <p className="text-gray-800 text-sm bg-gray-50 px-4 py-2.5 rounded-xl">{user.name}</p>
                    )}
                </div>

                {/* Email — not editable */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Mail size={15} className="text-primary" /> Email Address
                    </label>
                    <p className="text-gray-500 text-sm bg-gray-50 px-4 py-2.5 rounded-xl flex items-center justify-between">
                        {user.email}
                        <span className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded-full">Verified</span>
                    </p>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Phone size={15} className="text-primary" /> Phone Number
                    </label>
                    {editing ? (
                        <input
                            type="text"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                        />
                    ) : (
                        <p className="text-gray-800 text-sm bg-gray-50 px-4 py-2.5 rounded-xl">
                            {user.phone || "Not provided"}
                        </p>
                    )}
                </div>

                {/* Save Button */}
                {editing && (
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition disabled:opacity-70"
                    >
                        {saving ? (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <><Save size={16} /> Save Changes</>
                        )}
                    </button>
                )}

            </div>
        </div>
    )
}

// ===== PASSWORD FIELD =====
function PasswordField({ label, field, form, setForm, show, setShow }) {
    const fieldKey = field === "current"
        ? "currentPassword"
        : field === "new"
            ? "newPassword"
            : "confirmPassword"

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 gap-2 focus-within:border-primary transition">
                <Lock size={16} className="text-gray-400" />
                <input
                    type={show[field] ? "text" : "password"}
                    value={form[fieldKey]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [fieldKey]: e.target.value }))}
                    placeholder="••••••••"
                    className="outline-none text-sm text-gray-700 w-full bg-transparent"
                />
                <button
                    type="button"
                    onClick={() => setShow((prev) => ({ ...prev, [field]: !prev[field] }))}
                    className="text-gray-400 hover:text-primary transition"
                >
                    {show[field] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        </div>
    )
}

// ===== PASSWORD TAB =====
function PasswordTab({ getToken }) {
    const { showToast } = useToast()
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const [show, setShow] = useState({ current: false, new: false, confirm: false })
    const [saving, setSaving] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        if (form.newPassword !== form.confirmPassword) {
            showToast("New passwords do not match", "error")
            return
        }
        if (form.newPassword.length < 6) {
            showToast("New password must be at least 6 characters", "error")
            return
        }
        setSaving(true)
        try {
            await changePassword({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            }, getToken())
            showToast("Password changed successfully! 🔒", "success")
            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
        } catch (err) {
            showToast(err.message, "error")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-lg font-bold text-gray-800">Change Password</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <PasswordField
                    label="Current Password"
                    field="current"
                    form={form}
                    setForm={setForm}
                    show={show}
                    setShow={setShow}
                />
                <PasswordField
                    label="New Password"
                    field="new"
                    form={form}
                    setForm={setForm}
                    show={show}
                    setShow={setShow}
                />
                <PasswordField
                    label="Confirm Password"
                    field="confirm"
                    form={form}
                    setForm={setForm}
                    show={show}
                    setShow={setShow}
                />

                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition disabled:opacity-70 mt-2"
                >
                    {saving ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <><Lock size={16} /> Update Password</>
                    )}
                </button>

            </form>
        </div>
    )
}

// ===== ORDERS TAB =====
function OrdersTab({ getToken }) {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [expanded, setExpanded] = useState(null)

    async function loadOrders() {
        try {
            setLoading(true)
            setError(null)
            const data = await fetchMyOrders(getToken())
            setOrders(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadOrders() }, [])

    if (loading) return (
        <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => <OrderRowSkeleton key={i} />)}
        </div>
    )
    if (error) return <ErrorMessage message={error} onRetry={loadOrders} />

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
                <ShoppingBag size={52} className="text-gray-300" />
                <h3 className="text-lg font-bold text-gray-600">No orders yet</h3>
                <p className="text-gray-400 text-sm">Your order history will appear here.</p>
                <Link
                    to="/products"
                    className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition"
                >
                    Start Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-800">
                Order History
                <span className="text-sm font-normal text-gray-400 ml-2">({orders.length} orders)</span>
            </h2>

            {orders.map((order) => (
                <div key={order._id} className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">

                    {/* Order Header */}
                    <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                    >
                        <div className="flex flex-col gap-1">
                            <p className="text-xs text-gray-400 font-mono">
                                #{order._id.slice(-8).toUpperCase()}
                            </p>
                            <p className="text-sm font-bold text-gray-800">{formatPrice(order.totalPrice)}</p>
                            <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <OrderStatusBadge isPaid={order.isPaid} isDelivered={order.isDelivered} />
                            {expanded === order._id
                                ? <ChevronUp size={18} className="text-gray-400" />
                                : <ChevronDown size={18} className="text-gray-400" />
                            }
                        </div>
                    </div>

                    {/* Order Details */}
                    {expanded === order._id && (
                        <div className="border-t border-gray-200 p-4 flex flex-col gap-4">

                            {/* Items */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase mb-3">Items Ordered</p>
                                <div className="flex flex-col gap-3">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                                                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-bold text-gray-800 flex-shrink-0">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Delivery Address</p>
                                <div className="bg-white rounded-xl p-3 text-sm text-gray-600 flex flex-col gap-1">
                                    <p className="font-semibold text-gray-800">{order.deliveryAddress?.fullName}</p>
                                    <p>{order.deliveryAddress?.phone}</p>
                                    <p>{order.deliveryAddress?.address}</p>
                                    <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</p>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Price Breakdown</p>
                                <div className="bg-white rounded-xl p-3 flex flex-col gap-2 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(order.totalPrice - order.deliveryPrice)}</span>
                                    </div>

                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery</span>
                                        <span
                                            className={order.deliveryPrice === 0 ? "text-green-500 font-semibold" : ""}
                                        >
                                            {order.deliveryPrice === 0
                                                ? "FREE"
                                                : formatPrice(order.deliveryPrice)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between font-bold text-gray-800 border-t border-gray-100 pt-2">
                                        <span>Total</span>
                                        <span className="text-primary">{formatPrice(order.totalPrice)}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

// ===== MAIN PROFILE PAGE =====
function ProfilePage() {
    const { user, isLoggedIn, logout, getToken, login } = useAuth()
    const { showToast } = useToast()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("profile")

    const tabs = [
        { id: "profile", icon: User, label: "Profile" },
        { id: "orders", icon: ShoppingBag, label: "Order History" },
        { id: "password", icon: Lock, label: "Change Password" },
    ]

    function handleLogout() {
        logout()
        navigate("/")
        showToast("Logged out successfully", "success")
    }

    function handleUserUpdate(data) {
        login({
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: data.role,
            avatar: data.name.slice(0, 2).toUpperCase(),
            token: data.token,
        })
    }

    if (!isLoggedIn) {
        return (
            <div className="max-w-lg mx-auto px-6 py-20 flex flex-col items-center gap-5 text-center">
                <User size={56} className="text-gray-300" />
                <h2 className="text-2xl font-bold text-gray-700">Sign in to view profile</h2>
                <div className="flex gap-3">
                    <Link to="/login" className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition">Sign In</Link>
                    <Link to="/register" className="border border-primary text-primary px-6 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition">Register</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your profile and orders</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-semibold border border-red-200 px-4 py-2 rounded-full hover:bg-red-50 transition"
                >
                    <LogOut size={15} /> Logout
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">

                {/* Sidebar Tabs */}
                <div className="md:w-56 flex flex-row md:flex-col gap-2">
                    {tabs.map(({ id, icon: Icon, label }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition text-left w-full
                ${activeTab === id
                                    ? "bg-primary text-white shadow-sm"
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                                }`}
                        >
                            <Icon size={17} />
                            <span className="hidden sm:block">{label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    {activeTab === "profile" && (
                        <ProfileTab 
                            user={user} 
                            getToken={getToken} 
                            onUserUpdate={handleUserUpdate} 
                            loading={!user} // Show loading skeleton if user data isn't loaded yet
                        />
                    )}
                    {activeTab === "orders" && <OrdersTab getToken={getToken} />}
                    {activeTab === "password" && <PasswordTab getToken={getToken} />}
                </div>

            </div>
        </div>
    )
}

export default ProfilePage