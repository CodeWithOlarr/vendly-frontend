import API_URL from "./config"

// ---- PRODUCTS ----
export async function adminGetProducts(token) {
  const res = await fetch(`${API_URL}/admin/products`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export async function adminCreateProduct(productData, token) {
  const res = await fetch(`${API_URL}/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export async function adminUpdateProduct(id, productData, token) {
  const res = await fetch(`${API_URL}/admin/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export async function adminDeleteProduct(id, token) {
  const res = await fetch(`${API_URL}/admin/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// ---- ORDERS ----
export async function adminGetOrders(token) {
  const res = await fetch(`${API_URL}/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export async function adminUpdateOrder(id, updateData, token) {
  const res = await fetch(`${API_URL}/admin/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// ---- USERS ----
export async function adminGetUsers(token) {
  const res = await fetch(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

// ---- STATS ----
export async function adminGetStats(token) {
  const res = await fetch(`${API_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}