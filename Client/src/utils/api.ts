import { getAuthToken } from './auth'

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = getAuthToken()
  const headers = new Headers(init.headers)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  const body = init.body
  if (body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  return fetch(path, { ...init, headers })
}
