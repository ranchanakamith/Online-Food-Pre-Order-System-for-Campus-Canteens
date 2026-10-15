import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

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

  const login = (loginId, password) => {
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
      user = {
        id: loginId.trim(),
        name: 'Main Canteen Staff',
        email: 'canteen.staff@campusbite.edu',
        role: 'worker',
        canteenId: 1,
        canteenName: 'Main Canteen',
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

  const switchRole = (role) => {
    if (role === 'admin') {
      setCurrentUser({
        id: 'admin001',
        name: 'System Administrator',
        email: 'admin@campusbite.edu',
        role: 'admin',
      })
    } else if (role === 'worker') {
      setCurrentUser({
        id: 'worker001',
        name: 'Main Canteen Staff',
        email: 'staff@campusbite.edu',
        role: 'worker',
        canteenId: 1,
        canteenName: 'Main Canteen',
      })
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
