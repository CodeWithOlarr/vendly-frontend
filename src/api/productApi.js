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

export async function fetchFeaturedProducts() {
  const res = await fetch(`${API_URL}/products?featured=true`)
  if (!res.ok) throw new Error("Failed to fetch featured products")
    return res.json()
}

// Get real product counts per category
export async function fetchCategoryCounts() {
  const res = await fetch(`${API_URL}/products/counts`)
  if (!res.ok) throw new Error("Failed to fetch category counts")
    return res.json()
}

// Get single product by ID
export async function fetchProductById(id) {
  const res = await fetch(`${API_URL}/products/${id}`)
  if (!res.ok) throw new Error("Product not found")
  return res.json()
}

// Get reviews for a product
export async function fetchReviews(productId) {
  const res = await fetch(`${API_URL}/products/${productId}/reviews`)
  if (!res.ok) throw new Error("Failed to fetch reviews")
  return res.json()
}

// Submit a review
export async function submitReview(productId, reviewData, token) {
  const res = await fetch(`${API_URL}/products/${productId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(reviewData),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Failed to submit review")
  return data
}