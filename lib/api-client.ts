const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

interface RequestOptions extends RequestInit {
  token?: string
}

export async function apiCall<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((fetchOptions.headers as Record<string, string>) || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `API Error: ${response.status}`)
  }

  return response.json()
}

export async function apiLogin(email: string, password: string) {
  const formData = new FormData()
  formData.append("username", email)
  formData.append("password", password)

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Invalid credentials")
  }

  return response.json()
}
