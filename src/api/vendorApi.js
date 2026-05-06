import API_URL from "./config"

// Get all vendors
export async function fetchVendors(search = "") {
  const params = new URLSearchParams()
  if (search) params.append("search", search)

  const res = await fetch(`${API_URL}/vendors?${params.toString()}`)
  if (!res.ok) throw new Error("Failed to fetch vendors")
  return res.json()
}

// Get single vendor by slug
export async function fetchVendorBySlug(slug) {
  const res = await fetch(`${API_URL}/vendors/${slug}`)
  if (!res.ok) throw new Error("Vendor not found")
  return res.json()
}