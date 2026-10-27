import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()
const DEMO_PASSWORD = 'campusbite123'

export const canteenStaffAccounts = [
  { id: 'worker001', name: 'Kamal Jayawardena', role: 'worker', canteenId: 1, canteenName: 'Main Canteen', email: 'main.kitchen@campusbite.edu' },
  { id: 'worker002', name: 'Nimal Bandara', role: 'worker', canteenId: 2, canteenName: 'Engineering Canteen', email: 'eng.kitchen@campusbite.edu' },
  { id: 'worker003', name: 'Sunil Weerasinghe', role: 'worker', canteenId: 3, canteenName: 'Student Centre Cafe', email: 'cafe.kitchen@campusbite.edu' },
]

export const demoCredentials = [
  { id: 'IT20231234', role: 'student', password: DEMO_PASSWORD, name: 'Kasun Perera', email: 'it20231234@campus.edu', faculty: 'Computing' },
  { id: 'worker001', role: 'worker', password: DEMO_PASSWORD },
  { id: 'worker002', role: 'worker', password: DEMO_PASSWORD },
  { id: 'worker003', role: 'worker', password: DEMO_PASSWORD },
  { id: 'admin001', role: 'admin', password: DEMO_PASSWORD, name: 'System Administrator', email: 'admin@campusbite.edu' },
]

function readAccounts() {
  try {
    const value = JSON.parse(localStorage.getItem('campusbite_accounts') || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function publicUser(account) {
  const { passwordHash, passwordSalt, ...user } = account
  return { ...user, role: 'student' }
}

async function hashPassword(password, salt) {
  const bytes = new TextEncoder().encode(salt + ':' + password)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function restoreUser() {
  try {
    const saved = JSON.parse(localStorage.getItem('campusbite_user') || 'null')
    if (!saved?.id) return null
    const id = String(saved.id).toLowerCase()
    const demo = demoCredentials.find((account) => account.id.toLowerCase() === id)
    if (demo?.role === 'student') {
      return { id: demo.id, role: 'student', name: demo.name, email: demo.email, faculty: demo.faculty }
    }
    if (demo) return null
    const account = readAccounts().find((entry) => entry.id.toLowerCase() === id)
    return account ? publicUser(account) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(restoreUser)

  useEffect(() => {
    try {
      if (currentUser) localStorage.setItem('campusbite_user', JSON.stringify(currentUser))
      else localStorage.removeItem('campusbite_user')
    } catch (error) {
      console.error(error)
    }
  }, [currentUser])

  const login = async (loginId, password) => {
    const id = String(loginId || '').trim().toLowerCase()
    const demo = demoCredentials.find((account) => account.id.toLowerCase() === id)
    if (demo && password === demo.password) {
      const user = demo.role === 'worker'
        ? canteenStaffAccounts.find((staff) => staff.id === demo.id)
        : { id: demo.id, role: demo.role, name: demo.name, email: demo.email, faculty: demo.faculty }
      setCurrentUser(user)
      return user
    }

    const account = readAccounts().find((entry) => entry.id.toLowerCase() === id)
    if (!account || !password) return null
    const suppliedHash = await hashPassword(password, account.passwordSalt)
    if (suppliedHash !== account.passwordHash) return null
    const user = publicUser(account)
    setCurrentUser(user)
    return user
  }

  const registerStudent = async ({ name, id, email, faculty, password }) => {
    const normalizedId = String(id || '').trim()
    const normalizedEmail = String(email || '').trim().toLowerCase()
    if (!normalizedId || !normalizedEmail || !name?.trim()) throw new Error('Please complete all required account fields.')
    if (password.length < 6) throw new Error('Password must be at least 6 characters long.')
    if (/^(admin|staff|worker)/i.test(normalizedId)) throw new Error('Choose a student registration number, not a staff or admin ID.')

    const accounts = readAccounts()
    const lowerId = normalizedId.toLowerCase()
    if (demoCredentials.some((entry) => entry.id.toLowerCase() === lowerId) || accounts.some((entry) => entry.id.toLowerCase() === lowerId)) {
      throw new Error('An account with this registration number already exists.')
    }
    if (accounts.some((entry) => entry.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email already exists.')
    }

    const passwordSalt = Array.from(crypto.getRandomValues(new Uint8Array(16))).map((byte) => byte.toString(16).padStart(2, '0')).join('')
    const account = {
      id: normalizedId,
      name: name.trim(),
      email: normalizedEmail,
      faculty,
      role: 'student',
      passwordSalt,
      passwordHash: await hashPassword(password, passwordSalt),
    }
    localStorage.setItem('campusbite_accounts', JSON.stringify([...accounts, account]))
    const user = publicUser(account)
    setCurrentUser(user)
    return user
  }

  const logout = () => setCurrentUser(null)

  return (
    <AuthContext.Provider value={{ currentUser, login, registerStudent, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
