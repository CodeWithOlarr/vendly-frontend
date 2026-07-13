import API_URL from "./config"

export async function initializePayment(orderId, token) {
  const res = await fetch(`${API_URL}/payment/initialize`, {
    method:  "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${token}`,
    },
    body: JSON.stringify({ orderId }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Payment initialization failed")
  return data
}

export async function verifyPayment(reference, token) {
  const res = await fetch(`${API_URL}/payment/verify`, {
    method:  "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${token}`,
    },
    body: JSON.stringify({ reference }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Payment verification failed")
  return data
}