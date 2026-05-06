import API_URL from "./config"

async function parseResponse(res) {
  const contentType = res.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    return res.json()
  }
  // If not JSON, read as text and throw it
  const text = await res.text()
  throw new Error(text || `Server error: ${res.status}`)
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  const data = await parseResponse(res)
  if (!res.ok) throw new Error(data.message || "Login failed")
  return data
}

export async function registerUser({ name, email, phone, password }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, password }),
  })
  const data = await parseResponse(res)
  if (!res.ok) throw new Error(data.message || "Registration failed")
  return data
}