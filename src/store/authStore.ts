import { create } from 'zustand'

interface User {
  email: string
  nickname: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  register: (email: string, nickname: string, password: string) => boolean
  logout: () => void
}

const USERS_KEY = 'auth-users'
const SESSION_KEY = 'auth-session'

function getUsers(): Record<string, { nickname: string; password: string }> {
  try {
    const data = localStorage.getItem(USERS_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

function saveUsers(users: Record<string, { nickname: string; password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function getSession(): User | null {
  try {
    const data = localStorage.getItem(SESSION_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

function saveSession(user: User) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: getSession(),
  isAuthenticated: getSession() !== null,

  login: (email, password) => {
    const users = getUsers()
    const record = users[email]
    if (!record || record.password !== password) {
      return false
    }
    const user: User = { email, nickname: record.nickname }
    saveSession(user)
    set({ user, isAuthenticated: true })
    return true
  },

  register: (email, nickname, password) => {
    const users = getUsers()
    if (users[email]) {
      return false
    }
    users[email] = { nickname, password }
    saveUsers(users)
    const user: User = { email, nickname }
    saveSession(user)
    set({ user, isAuthenticated: true })
    return true
  },

  logout: () => {
    clearSession()
    set({ user: null, isAuthenticated: false })
  },
}))