/**
 * API Client Configuration
 * Centralized API client setup with error handling and interceptors
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

// Request interceptor
function addAuthToken(headers: Headers) {
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('auth_token')
    : null
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  return headers
}

// Error handling
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP ${response.status}: ${response.statusText}`
    }))
    throw new Error(error.message || 'API request failed')
  }
  return response.json()
}

/**
 * Generic fetch wrapper
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const headers = new Headers(options.headers || {})
  
  // Add default headers
  headers.set('Content-Type', 'application/json')
  
  // Add auth token
  addAuthToken(headers)
  
  const response = await fetch(url, {
    ...options,
    headers,
  })
  
  return handleResponse<T>(response)
}

/**
 * GET request
 */
export const apiGet = <T,>(endpoint: string) =>
  apiClient<T>(endpoint, { method: 'GET' })

/**
 * POST request
 */
export const apiPost = <T,>(endpoint: string, data: unknown) =>
  apiClient<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })

/**
 * PUT request
 */
export const apiPut = <T,>(endpoint: string, data: unknown) =>
  apiClient<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

/**
 * PATCH request
 */
export const apiPatch = <T,>(endpoint: string, data: unknown) =>
  apiClient<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

/**
 * DELETE request
 */
export const apiDelete = <T,>(endpoint: string) =>
  apiClient<T>(endpoint, { method: 'DELETE' })
