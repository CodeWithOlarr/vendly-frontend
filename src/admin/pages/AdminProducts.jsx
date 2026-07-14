import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, X, Check } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useToast } from "../../context/ToastContext"
import {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from "../../api/adminApi"
import ImageUpload from "../../components/ImageUpload"
import { LoadingSpinner, ErrorMessage } from "../../components/StatusMessage"

const EMPTY_FORM = {
  name: "", price: "", oldPrice: "", category: "Phones",
  vendor: "", image: "", badge: "", inStock: true, featured: false,
}

const categories = ["Phones", "Laptops", "Audio", "Fashion", "Cameras", "Watches", "Fitness", "Home & Living", "Electronics"]
const badges = ["", "Hot", "Sale", "New", "Top Rated"]

function AdminProducts() {
  const { getToken } = useAuth()
  const { showToast } = useToast()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState("")

  async function loadProducts() {
    try {
      setLoading(true)
      setError(null)
      const data = await adminGetProducts(getToken())
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProducts() }, [])

  function openCreate() {
    setForm(EMPTY_FORM)
    setEditId(null)
    setShowForm(true)
  }

  function openEdit(product) {
    setForm({
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice || "",
      category: product.category,
      vendor: product.vendor,
      image: product.image,
      badge: product.badge || "",
      inStock: product.inStock,
      featured: product.featured || false,
    })
    setEditId(product._id)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        badge: form.badge || null,
        featured: form.featured,
      }
      if (editId) {
        await adminUpdateProduct(editId, payload, getToken())
        showToast("Product updated! ✅", "success")
      } else {
        await adminCreateProduct(payload, getToken())
        showToast("Product created! ✅", "success")
      }
      setShowForm(false)
      loadProducts()
    } catch (err) {
      showToast(err.message, "error")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) return
    try {
      await adminDeleteProduct(id, getToken())
      showToast("Product deleted", "success")
      loadProducts()
    } catch (err) {
      showToast(err.message, "error")
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.vendor.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <LoadingSpinner message="Loading products..." />
  if (error) return <ErrorMessage message={error} onRetry={loadProducts} />

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Products</h2>
          <p className="text-sm text-gray-500">{products.length} total products</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary w-full max-w-sm shadow-sm"
      />

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-xl object-cover bg-gray-100"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.vendor}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">
                    ₦{product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold
                      ${product.inStock ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg h-[90vh] sm:max-h-screen overflow-y-auto shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">
                {editId ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setShowForm(false)}>
                <X size={20} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Product Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="iPhone 15 Pro Max"
                  required
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Price + Old Price */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Price (₦)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="850000"
                    required
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Old Price (₦)</label>
                  <input
                    type="number"
                    value={form.oldPrice}
                    onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                    placeholder="Optional"
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Category + Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Badge</label>
                  <select
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                  >
                    {badges.map((b) => <option key={b} value={b}>{b || "None"}</option>)}
                  </select>
                </div>
              </div>

              {/* Vendor */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Vendor</label>
                <input
                  type="text"
                  value={form.vendor}
                  onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                  placeholder="TechZone Lagos"
                  required
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Image URL */}
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
              />

              {/* In Stock */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                  className="accent-primary w-4 h-4"
                />
                <span className="text-sm font-semibold text-gray-700">In Stock</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="accent-primary w-4 h-4"
                />
                <span className="text-sm font-semibold text-gray-700">
                  ⭐ Show on Homepage
                </span>
              </label>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary text-white py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><Check size={16} /> {editId ? "Update" : "Create"}</>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminProducts