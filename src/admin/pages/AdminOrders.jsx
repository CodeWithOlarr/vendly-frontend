import { useState, useEffect } from "react"
import { useAuth }  from "../../context/AuthContext"
import { useToast } from "../../context/ToastContext"
import { adminGetOrders, adminUpdateOrder } from "../../api/adminApi"
import { LoadingSpinner, ErrorMessage } from "../../components/StatusMessage"

function formatPrice(amount) {
  return "₦" + amount.toLocaleString("en-NG")
}

function AdminOrders() {
  const { getToken }            = useAuth()
  const { showToast }           = useToast()
  const [orders,  setOrders]    = useState([])
  const [loading, setLoading]   = useState(true)
  const [error,   setError]     = useState(null)
  const [expanded, setExpanded] = useState(null)

  async function loadOrders() {
    try {
      setLoading(true)
      setError(null)
      const data = await adminGetOrders(getToken())
      setOrders(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOrders() }, [])

  async function toggleField(order, field) {
    try {
      await adminUpdateOrder(order._id, { [field]: !order[field] }, getToken())
      showToast("Order updated! ✅", "success")
      loadOrders()
    } catch (err) {
      showToast(err.message, "error")
    }
  }

  if (loading) return <LoadingSpinner message="Loading orders..." />
  if (error)   return <ErrorMessage message={error} onRetry={loadOrders} />

  return (
    <div className="flex flex-col gap-6">

      <div>
        <h2 className="text-xl font-bold text-gray-800">Orders</h2>
        <p className="text-sm text-gray-500">{orders.length} total orders</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Paid</th>
                <th className="px-6 py-3 text-left">Delivered</th>
                <th className="px-6 py-3 text-left">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <>
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{order.user?.name || "Guest"}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleField(order, "isPaid")}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition
                          ${order.isPaid
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-red-100 text-red-500 hover:bg-red-200"
                          }`}
                      >
                        {order.isPaid ? "Paid ✓" : "Unpaid"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleField(order, "isDelivered")}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition
                          ${order.isDelivered
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                          }`}
                      >
                        {order.isDelivered ? "Delivered ✓" : "Pending"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                        className="text-primary text-xs font-semibold hover:underline"
                      >
                        {expanded === order._id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Order Details */}
                  {expanded === order._id && (
                    <tr key={`${order._id}-details`}>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50">
                        <div className="flex flex-col md:flex-row gap-6">

                          {/* Items */}
                          <div className="flex-1">
                            <p className="font-semibold text-gray-700 mb-2 text-xs uppercase">Items</p>
                            <div className="flex flex-col gap-2">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                                  <div className="flex-1">
                                    <p className="text-xs font-semibold text-gray-800">{item.name}</p>
                                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                  </div>
                                  <p className="text-xs font-bold text-gray-700">
                                    {formatPrice(item.price * item.quantity)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Delivery Address */}
                          <div>
                            <p className="font-semibold text-gray-700 mb-2 text-xs uppercase">Delivery Address</p>
                            <div className="text-xs text-gray-600 flex flex-col gap-1">
                              <p className="font-semibold">{order.deliveryAddress?.fullName}</p>
                              <p>{order.deliveryAddress?.phone}</p>
                              <p>{order.deliveryAddress?.address}</p>
                              <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</p>
                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default AdminOrders