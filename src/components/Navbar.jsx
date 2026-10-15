import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { totalItems } = useCart()
  const { currentUser, logout, switchRole } = useAuth()

  const publicPages = ['/login', '/register', '/forgot-password']
  const isPublicAuthPage = publicPages.includes(location.pathname)
  const isWorkerPage = location.pathname.startsWith('/worker') || location.pathname.startsWith('/staff')
  const isAdminPage = location.pathname.startsWith('/admin')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (isPublicAuthPage) {
    return (
      <header className="navbar">
        <div className="container nav-inner">
          <NavLink to="/" className="brand">
            <span className="brand-mark">CB</span>
            <span>CampusBite</span>
          </NavLink>
          <div className="nav-actions">
            <NavLink to="/" className="btn btn-ghost">Home</NavLink>
            <NavLink to="/login" className="btn btn-ghost">Login</NavLink>
            <NavLink to="/register" className="btn btn-primary">Create Account</NavLink>
          </div>
        </div>
      </header>
    )
  }

  if (isWorkerPage) {
    return (
      <header className="navbar">
        <div className="container nav-inner">
          <NavLink to="/worker" className="brand">
            <span className="brand-mark">CB</span>
            <span>CampusBite</span>
          </NavLink>
          <div className="role-nav-badge worker-badge">
            <span className="live-pulse" />
            Kitchen Staff Portal
          </div>
          <div className="nav-actions">
            <button
              type="button"
              className="btn btn-ghost role-switch-btn"
              onClick={() => {
                switchRole('student')
                navigate('/student')
              }}
              title="Switch to Student View"
            >
              🎓 Switch to Student
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>
    )
  }

  if (isAdminPage) {
    return (
      <header className="navbar">
        <div className="container nav-inner">
          <NavLink to="/admin" className="brand">
            <span className="brand-mark">CB</span>
            <span>CampusBite</span>
          </NavLink>
          <div className="role-nav-badge admin-badge">
            🛡️ Administrator Portal
          </div>
          <div className="nav-actions">
            <button
              type="button"
              className="btn btn-ghost role-switch-btn"
              onClick={() => {
                switchRole('student')
                navigate('/student')
              }}
              title="Switch to Student View"
            >
              🎓 Switch to Student
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>
    )
  }

  // Student / General Visitor Navbar
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <NavLink to="/student" className="brand">
          <span className="brand-mark">CB</span>
          <span>CampusBite</span>
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/student" end>
            Home
          </NavLink>
          <NavLink to="/canteens">Canteens</NavLink>
          <NavLink to="/orders">My Orders</NavLink>
          <NavLink to="/cart" className="cart-nav-link">
            <span>Cart</span>
            {totalItems > 0 && <span className="nav-cart-badge">{totalItems}</span>}
          </NavLink>
        </nav>

        <div className="nav-actions">
          <div className="user-profile-chip" title="Current logged in student">
            <span className="user-avatar-initial">
              {currentUser?.name ? currentUser.name.charAt(0) : 'S'}
            </span>
            <span className="user-chip-name">{currentUser?.name || 'Student'}</span>
          </div>

          <div className="quick-portal-switcher">
            <NavLink to="/worker" className="btn btn-ghost small-btn" title="Open Kitchen Portal">
              👨‍🍳 Worker
            </NavLink>
            <NavLink to="/admin" className="btn btn-ghost small-btn" title="Open Admin Portal">
              🛡️ Admin
            </NavLink>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
