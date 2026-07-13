import API_URL from "./config"

export async function submitVendorApplication(data, token) {
  const res = await fetch(`${API_URL}/vendor-applications`, {
    method:  "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  const result = await res.json()
  if (!res.ok) throw new Error(result.message || "Failed to submit application")
  return result
}

export async function fetchMyApplication(token) {
  const res = await fetch(`${API_URL}/vendor-applications/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const result = await res.json()
  if (!res.ok) throw new Error(result.message || "Failed to fetch application")
  return result
}

export async function fetchAllApplications(token) {
  const res = await fetch(`${API_URL}/vendor-applications`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const result = await res.json()
  if (!res.ok) throw new Error(result.message || "Failed to fetch applications")
  return result
}

export async function reviewApplication(id, data, token) {
  const res = await fetch(`${API_URL}/vendor-applications/${id}`, {
    method:  "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  const result = await res.json()
  if (!res.ok) throw new Error(result.message || "Failed to update application")
  return result
}