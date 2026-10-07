import { redirect } from '@tanstack/react-router'
import { api } from './api'
import { queryClient } from './query-client'
import { session } from './session'
import type { LoginResponse, Role, SessionUser } from './types'

export async function login(email: string, password: string, remember: boolean) {
  const data = await api<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  })
  session.set(data.accessToken, data.user, remember)
  return data.user
}

export function logout() {
  session.clear()
  queryClient.clear()
}

export async function refreshMe() {
  const user = await api<SessionUser>('/auth/me')
  session.updateUser(user)
  return user
}

export function requireAuth(location: { href: string }) {
  if (!session.getToken()) {
    throw redirect({ to: '/login', search: { redirect: location.href } })
  }
}

export function requireRole(...roles: Array<Role>) {
  if (!session.hasRole(...roles)) throw redirect({ to: '/' })
}
