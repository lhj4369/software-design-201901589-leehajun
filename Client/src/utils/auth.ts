import type { AuthUserProfile } from '../types/profile'

export type UserRole = 'teacher' | 'student' | 'parent'

const AUTH_TOKEN_KEY = 'school_auth_token'
const AUTH_PROFILE_KEY = 'school_auth_profile'

export function saveAuthSession(token: string, profile: AuthUserProfile) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  localStorage.setItem(AUTH_PROFILE_KEY, JSON.stringify(profile))
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_PROFILE_KEY)
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function getAuthProfile(): AuthUserProfile | null {
  const raw = localStorage.getItem(AUTH_PROFILE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUserProfile
  } catch {
    return null
  }
}

export function isAuthenticated() {
  return Boolean(getAuthToken())
}
