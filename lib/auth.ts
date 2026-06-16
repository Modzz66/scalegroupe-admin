import { USERS, User } from './mock-data'

export function login(email: string, password: string): User | null {
  const user = USERS.find(u => u.email === email && u.password === password)
  if (user && typeof window !== 'undefined') localStorage.setItem('sg_user', JSON.stringify(user))
  return user || null
}

export function logout() {
  if (typeof window !== 'undefined') localStorage.removeItem('sg_user')
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('sg_user')
  return stored ? JSON.parse(stored) : null
}

export function requireAuth(role?: 'ADMIN' | 'KUNDE'): User | null {
  const user = getCurrentUser()
  if (!user) { window.location.href = '/login'; return null }
  if (role && user.role !== role) {
    window.location.href = user.role === 'ADMIN' ? '/admin' : '/kunde'
    return null
  }
  return user
}
