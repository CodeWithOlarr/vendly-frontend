import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { useAuth }  from "../../context/AuthContext"
import { useToast } from "../../context/ToastContext"
import { fetchAllApplications, reviewApplication } from "../../api/vendorApplicationApi"
import { LoadingSpinner, ErrorMessage } from "../../components/StatusMessage"

function AdminVendorApplications() {
  const { getToken }              = useAuth()
  const { showToast }             = useToast()
  const [applications, setApplications] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [expanded,     setExpanded]     = useState(null)
  const [note,         setNote]         = useState("")
  const [processing,   setProcessing]   = useState(null)

  async function loadApplications() {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchAllApplications(getToken())
      setApplications(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadApplications() }, [])

  async function handleReview(id, status) {
    setProcessing(id)
    try {
      await reviewApplication(id, { status, adminNote: note }, getToken())
      showToast(
        status === "approved" ? "Vendor approved! ✅" : "Application rejected",
        status === "approved" ? "success" : "error"
      )
      setNote("")
      setExpanded(null)
      loadApplications()
    } catch (err) {
      showToast(err.message, "error")
    } finally {
      setProcessing(null)
    }
  }

  const pending  = applications.filter((a) => a.status === "pending")
  const reviewed = applications.filter((a) => a.status !== "pending")

  if (loading) return <LoadingSpinner message="Loading applications..." />
  if (error)   return <ErrorMessage message={error} onRetry={loadApplications} />

  return (
    <div className="flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Vendor Applications</h2>
          <p className="text-sm text-gray-500">
            <span className="text-yellow-600 font-semibold">{pending.length} pending</span>
            {" "}· {reviewed.length} reviewed
          </p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 border border-gray-100">
          <Clock size={40} className="mx-auto mb-3 text-gray-300" />
          <p>No vendor applications yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Header Row */}
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpanded(expanded === app._id ? null : app._id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-primary text-white flex items-center justify-center font-extrabold text-sm">
                    {app.storeName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{app.storeName}</p>
                    <p className="text-xs text-gray-500">{app.user?.name} · {app.user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold
                    ${app.status === "pending"  ? "bg-yellow-100 text-yellow-600" :
                      app.status === "approved" ? "bg-green-100 text-green-600"  :
                                                  "bg-red-100 text-red-500"}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                  {expanded === app._id
                    ? <ChevronUp size={18} className="text-gray-400" />
                    : <ChevronDown size={18} className="text-gray-400" />
                  }
                </div>
              </div>

              {/* Expanded Details */}
              {expanded === app._id && (
                <div className="border-t border-gray-100 p-5 flex flex-col gap-4">

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                      ["Category",  app.category],
                      ["Location",  app.location],
                      ["Phone",     app.phone],
                      ["Instagram", app.instagram || "Not provided"],
                      ["Applied",   new Date(app.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-xs text-gray-400 font-semibold uppercase">{label}</p>
                        <p className="text-gray-700 font-medium mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Description</p>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{app.description}</p>
                  </div>

                  {/* Action Buttons — only for pending */}
                  {app.status === "pending" && (
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-gray-500 uppercase">
                          Note to applicant (optional)
                        </label>
                        <textarea
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Add a reason for rejection or approval note..."
                          rows={2}
                          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary resize-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleReview(app._id, "approved")}
                          disabled={processing === app._id}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-green-600 transition disabled:opacity-60"
                        >
                          <CheckCircle size={16} /> Approve
                        </button>
                        <button
                          onClick={() => handleReview(app._id, "rejected")}
                          disabled={processing === app._id}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-red-600 transition disabled:opacity-60"
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Show admin note if reviewed */}
                  {app.status !== "pending" && app.adminNote && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">Admin Note</p>
                      <p className="text-sm text-gray-700">{app.adminNote}</p>
                    </div>
                  )}

                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminVendorApplications