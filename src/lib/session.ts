import { useSyncExternalStore } from 'react'
import type { Role, SessionUser } from './types'

const TOKEN_KEY = 'contractors.token'
const USER_KEY = 'contractors.user'

interface Session {
  token: string | null
  user: SessionUser | null
}

const listeners = new Set<() => void>()
let current: Session = read()

function storages() {
  return typeof window === 'undefined' ? [] : [localStorage, sessionStorage]
}

function read(): Session {
  for (const storage of storages()) {
    const token = storage.getItem(TOKEN_KEY)
    const user = storage.getItem(USER_KEY)
    if (token && user) return { token, user: JSON.parse(user) as SessionUser }
  }
  return { token: null, user: null }
}

function emit() {
  listeners.forEach((l) => l())
}

export const session = {
  get: () => current,
  getToken: () => current.token,
  getUser: () => current.user,

  set(token: string, user: SessionUser, remember: boolean) {
    this.clear(false)
    const storage = remember ? localStorage : sessionStorage
    storage.setItem(TOKEN_KEY, token)
    storage.setItem(USER_KEY, JSON.stringify(user))
    current = { token, user }
    emit()
  },

  updateUser(user: SessionUser) {
    if (!current.token) return
    const storage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage
    storage.setItem(USER_KEY, JSON.stringify(user))
    current = { ...current, user }
    emit()
  },

  clear(notify = true) {
    for (const storage of storages()) {
      storage.removeItem(TOKEN_KEY)
      storage.removeItem(USER_KEY)
    }
    current = { token: null, user: null }
    if (notify) emit()
  },

  hasRole: (...roles: Array<Role>) =>
    !!current.user && roles.includes(current.user.role),

  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export function useSession() {
  return useSyncExternalStore(session.subscribe, session.get, session.get)
}
