import API_URL from "./config"

export async function fetchVendorStats(token) {
  const res = await fetch(`${API_URL}/vendor/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export async function fetchVendorProducts(token) {
  const res = await fetch(`${API_URL}/vendor/products`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export async function createVendorProduct(productData, token) {
  const res = await fetch(`${API_URL}/vendor/products`, {
    method:  "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export async function updateVendorProduct(id, productData, token) {
  const res = await fetch(`${API_URL}/vendor/products/${id}`, {
    method:  "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export async function deleteVendorProduct(id, token) {
  const res = await fetch(`${API_URL}/vendor/products/${id}`, {
    method:  "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export async function fetchVendorOrders(token) {
  const res = await fetch(`${API_URL}/vendor/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}