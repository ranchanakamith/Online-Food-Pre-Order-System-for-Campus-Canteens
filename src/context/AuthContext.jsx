import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const canteenStaffAccounts = [
  {
    id: 'worker001',
    name: 'Kamal Jayawardena',
    role: 'worker',
    canteenId: 1,
    canteenName: 'Main Canteen',
    email: 'main.kitchen@campusbite.edu',
  },
  {
    id: 'worker002',
    name: 'Nimal Bandara',
    role: 'worker',
    canteenId: 2,
    canteenName: 'Engineering Canteen',
    email: 'eng.kitchen@campusbite.edu',
  },
  {
    id: 'worker003',
    name: 'Sunil Weerasinghe',
    role: 'worker',
    canteenId: 3,
    canteenName: 'Student Centre Cafe',
    email: 'cafe.kitchen@campusbite.edu',
  },
]

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('campusbite_user')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error(e)
    }
    // Default student user so the app is immediately usable without having to login repeatedly
    return {
      id: 'IT20231234',
      name: 'Kasun Perera',
      email: 'it20231234@campus.edu',
      role: 'student',
      faculty: 'Computing',
    }
  })

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('campusbite_user', JSON.stringify(currentUser))
      } else {
        localStorage.removeItem('campusbite_user')
      }
    } catch (e) {
      console.error(e)
    }
  }, [currentUser])

  const login = (loginId, password, designatedCanteenId = null) => {
    const id = (loginId || '').trim().toLowerCase()
    let user = {}

    if (id.startsWith('admin')) {
      user = {
        id: loginId.trim(),
        name: 'System Administrator',
        email: 'admin@campusbite.edu',
        role: 'admin',
      }
    } else if (id.startsWith('staff') || id.startsWith('worker')) {
      // Determine which canteen this staff member belongs to
      let targetCanteenId = designatedCanteenId

      if (!targetCanteenId) {
        if (id.includes('eng') || id.includes('002') || id === 'worker2') {
          targetCanteenId = 2
        } else if (id.includes('cafe') || id.includes('003') || id === 'worker3') {
          targetCanteenId = 3
        } else {
          targetCanteenId = 1
        }
      }

      const staffRecord =
        canteenStaffAccounts.find((s) => s.canteenId === Number(targetCanteenId)) ||
        canteenStaffAccounts[0]

      user = {
        ...staffRecord,
        id: loginId.trim() || staffRecord.id,
      }
    } else {
      user = {
        id: loginId.trim() || 'IT20231234',
        name: 'Kasun Perera',
        email: `${(loginId.trim() || 'student').toLowerCase()}@campus.edu`,
        role: 'student',
        faculty: 'Computing',
      }
    }

    setCurrentUser(user)
    return user
  }

  const switchRole = (role, canteenId = 1) => {
    if (role === 'admin') {
      setCurrentUser({
        id: 'admin001',
        name: 'System Administrator',
        email: 'admin@campusbite.edu',
        role: 'admin',
      })
    } else if (role === 'worker') {
      const staff =
        canteenStaffAccounts.find((s) => s.canteenId === Number(canteenId)) ||
        canteenStaffAccounts[0]
      setCurrentUser(staff)
    } else {
      setCurrentUser({
        id: 'IT20231234',
        name: 'Kasun Perera',
        email: 'it20231234@campus.edu',
        role: 'student',
        faculty: 'Computing',
      })
    }
  }

  const logout = () => {
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
