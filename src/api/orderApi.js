import API_URL from "./config"

export async function placeOrder(orderData, token) {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Failed to place order")
  return data
}

export async function fetchMyOrders(token) {
  const res = await fetch(`${API_URL}/orders/mine`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Failed to fetch orders")
  return data
}