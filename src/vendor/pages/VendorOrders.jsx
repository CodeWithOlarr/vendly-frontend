import { useState, useEffect } from "react"
import { ShoppingBag, ChevronDown, ChevronUp } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { fetchVendorOrders } from "../../api/vendorDashboardApi"
import { LoadingSpinner, ErrorMessage } from "../../components/StatusMessage"

function formatPrice(amount) {
    return "₦" + amount.toLocaleString("en-NG")
}

function VendorOrders() {
    const { getToken } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [expanded, setExpanded] = useState(null)

    async function loadOrders() {
        try {
            setLoading(true)
            setError(null)
            const data = await fetchVendorOrders(getToken())
            setOrders(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadOrders() }, [])

    if (loading) return <LoadingSpinner message="Loading orders..." />
    if (error) return <ErrorMessage message={error} onRetry={loadOrders} />

    return (
        <div className="flex flex-col gap-6">

            <div>
                <h2 className="text-xl font-bold text-gray-800">My Orders</h2>
                <p className="text-sm text-gray-500">{orders.length} orders containing your products</p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 flex flex-col items-center gap-3">
                    <ShoppingBag size={40} className="text-gray-300" />
                    <h3 className="font-bold text-gray-700">No orders yet</h3>
                    <p className="text-gray-400 text-sm">Orders for your products will appear here.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                            <div
                                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition"
                                onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                            >
                                <div className="flex flex-col gap-1">
                                    <p className="font-mono text-xs text-gray-400">#{order._id.slice(-8).toUpperCase()}</p>
                                    <p className="font-bold text-gray-800">{order.user?.name || "Customer"}</p>
                                    <p className="text-xs text-gray-500">{order.user?.email}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="font-bold text-gray-800 text-sm">
                                            {formatPrice(order.items.reduce((s, i) => s + i.price * i.quantity, 0))}
                                        </p>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                      ${order.isDelivered ? "bg-green-100 text-green-600" :
                                                order.isPaid ? "bg-blue-100 text-blue-600" :
                                                    "bg-yellow-100 text-yellow-600"}`}>
                                            {order.isDelivered ? "Delivered" : order.isPaid ? "Processing" : "Pending"}
                                        </span>
                                    </div>
                                    {expanded === order._id
                                        ? <ChevronUp size={18} className="text-gray-400" />
                                        : <ChevronDown size={18} className="text-gray-400" />
                                    }
                                </div>
                            </div>

                            {expanded === order._id && (
                                <div className="border-t border-gray-100 p-5">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-3">Your Items in This Order</p>
                                    <div className="flex flex-col gap-3">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-12 h-12 rounded-xl object-cover bg-gray-100"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                                                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="text-sm font-bold text-gray-800">
                                                    {formatPrice(item.price * item.quantity)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Delivery Address</p>
                                        <div className="text-sm text-gray-600 flex flex-col gap-0.5">
                                            <p className="font-semibold">{order.deliveryAddress?.fullName}</p>
                                            <p>{order.deliveryAddress?.phone}</p>
                                            <p>{order.deliveryAddress?.address}, {order.deliveryAddress?.city}</p>
                                            <p>{order.deliveryAddress?.state}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default VendorOrders