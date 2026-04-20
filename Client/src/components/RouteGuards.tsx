import { Navigate } from 'react-router-dom'
import { getAuthProfile, isAuthenticated } from '../utils/auth'
import type { ReactNode } from 'react'

type GuardProps = {
  children: ReactNode
}

export function GuestOnly({ children }: GuardProps) {
  const profile = getAuthProfile()
  if (isAuthenticated() && profile?.role) {
    return <Navigate to={`/${profile.role}/home`} replace />
  }
  return <>{children}</>
}

export function RequireAuth({ children }: GuardProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}
