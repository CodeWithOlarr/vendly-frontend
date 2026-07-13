import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { adminGetUsers } from "../../api/adminApi"
import { LoadingSpinner, ErrorMessage } from "../../components/StatusMessage"

function AdminUsers() {
  const { getToken }          = useAuth()
  const [users,   setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [search,  setSearch]  = useState("")

  async function loadUsers() {
    try {
      setLoading(true)
      setError(null)
      const data = await adminGetUsers(getToken())
      setUsers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUsers() }, [])

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <LoadingSpinner message="Loading users..." />
  if (error)   return <ErrorMessage message={error} onRetry={loadUsers} />

  return (
    <div className="flex flex-col gap-6">

      <div>
        <h2 className="text-xl font-bold text-gray-800">Users</h2>
        <p className="text-sm text-gray-500">{users.length} registered users</p>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
        className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary w-full max-w-sm shadow-sm"
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold
                      ${user.role === "admin"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-gray-100 text-gray-600"
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {new Date(user.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
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

export default AdminUsers