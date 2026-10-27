import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireRole({ allowedRoles, children }) {
  const { currentUser } = useAuth()
  const location = useLocation()

  if (!currentUser) {
    const destination = location.pathname + location.search
    return <Navigate to={'/login?redirect=' + encodeURIComponent(destination)} replace />
  }
  if (!allowedRoles.includes(currentUser.role)) {
    const home = currentUser.role === 'worker' ? '/worker' : currentUser.role === 'admin' ? '/admin' : '/student'
    return <Navigate to={home} replace />
  }
  return children
}
