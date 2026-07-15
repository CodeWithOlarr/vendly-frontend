import { useState, useEffect } from "react"
import { Package, ShoppingBag, Users, TrendingUp, Store } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { adminGetStats } from "../../api/adminApi"
import { StatsSkeleton } from "../../components/Skeleton"
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

function AdminDashboard() {
  const { getToken }          = useAuth()
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  async function loadStats() {
    try {
      setLoading(true)
      setError(null)
      const data = await adminGetStats(getToken())
      setStats(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStats() }, [])

  if (loading) return <StatsSkeleton />
  if (error)   return <ErrorMessage message={error} onRetry={loadStats} />

  return (
    <div className="flex flex-col gap-8">

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package}     label="Total Products" value={stats.totalProducts}          color="bg-blue-100 text-blue-600"   />
        <StatCard icon={ShoppingBag} label="Total Orders"   value={stats.totalOrders}            color="bg-orange-100 text-orange-600"/>
        <StatCard icon={Users}       label="Total Users"    value={stats.totalUsers}             color="bg-purple-100 text-purple-600"/>
        <StatCard icon={TrendingUp}  label="Total Revenue"  value={formatPrice(stats.totalRevenue)} color="bg-green-100 text-green-600"  />
        <StatCard icon={Store} label="Pending Applications" value={stats.pendingApplications || 0} color="bg-yellow-100 text-yellow-600" />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Paid</th>
                <th className="px-6 py-3 text-left">Delivered</th>
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
                  <td className="px-6 py-4 font-bold text-gray-800">
                    {formatPrice(order.totalPrice)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold
                      ${order.isPaid ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold
                      ${order.isDelivered ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
                      {order.isDelivered ? "Delivered" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default AdminDashboard