import { useState, useEffect }   from "react"
import { Package, ShoppingBag, TrendingUp, Star } from "lucide-react"
import { useAuth }               from "../../context/AuthContext"
import { fetchVendorStats }      from "../../api/vendorDashboardApi"
import { LoadingSpinner, ErrorMessage } from "../../components/StatusMessage"

function formatPrice(amount) {
  return "₦" + amount.toLocaleString("en-NG")
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
        <Icon size={26} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-extrabold text-gray-800">{value}</p>
      </div>
    </div>
  )
}

function VendorDashboard() {
  const { getToken, user }        = useAuth()
  const [stats,   setStats]       = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error,   setError]       = useState(null)

  async function loadStats() {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchVendorStats(getToken())
      setStats(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStats() }, [])

  if (loading) return <LoadingSpinner message="Loading dashboard..." />
  if (error)   return <ErrorMessage message={error} onRetry={loadStats} />

  return (
    <div className="flex flex-col gap-8">

      {/* Welcome */}
      <div className="bg-gradient-to-r from-dark to-blue-900 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-extrabold">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h2>
        <p className="text-gray-300 text-sm mt-1">
          Here's how your store is performing today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Package}     label="Your Products" value={stats.totalProducts}          color="bg-blue-100 text-blue-600"   />
        <StatCard icon={ShoppingBag} label="Total Orders"  value={stats.totalOrders}            color="bg-orange-100 text-orange-600"/>
        <StatCard icon={TrendingUp}  label="Revenue"       value={formatPrice(stats.totalRevenue)} color="bg-green-100 text-green-600"  />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">Recent Orders</h2>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <ShoppingBag size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No orders yet. Add products to start selling!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Order ID</th>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Items</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {order.user?.name || "Guest"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.items?.length} item(s)
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold
                        ${order.isDelivered ? "bg-green-100 text-green-600"  :
                          order.isPaid      ? "bg-blue-100 text-blue-600"    :
                                             "bg-yellow-100 text-yellow-600"}`}>
                        {order.isDelivered ? "Delivered" : order.isPaid ? "Processing" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}

export default VendorDashboard