import API_URL from "./config"

export async function sendMessage(messages) {
  const res = await fetch(`${API_URL}/chat`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ messages }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || "Chat failed")
  return data
}