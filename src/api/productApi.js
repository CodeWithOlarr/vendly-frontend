import API_URL from "./config"

// Get all products with optional filters
export async function fetchProducts({ category, search, sort, inStock } = {}) {
  const params = new URLSearchParams()
  if (category && category !== "All") params.append("category", category)
  if (search)                         params.append("search",   search)
  if (sort && sort !== "latest")      params.append("sort",     sort)
  if (inStock)                        params.append("inStock",  "true")

  const res = await fetch(`${API_URL}/products?${params.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch products")
  return res.json()
}

// Get single product by ID
export async function fetchProductById(id) {
  const res = await fetch(`${API_URL}/products/${id}`)
  if (!res.ok) throw new Error("Product not found")
  return res.json()
}