import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { totalItems } = useCart()
  const { currentUser, logout } = useAuth()

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
          <NavLink to="/home" className="brand">
            <span className="brand-mark">CB</span>
            <span>CampusBite</span>
          </NavLink>
          <div className="nav-actions">
            <NavLink to="/home" className="btn btn-ghost">Home</NavLink>
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
            Kitchen Staff Portal {currentUser?.canteenName ? `· ${currentUser.canteenName}` : ''}
          </div>
          <div className="nav-actions">
            <div className="user-profile-chip">
              <span className="user-avatar-initial">👨‍🍳</span>
              <span className="user-chip-name">{currentUser?.name || 'Staff Member'}</span>
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
            <div className="user-profile-chip">
              <span className="user-avatar-initial">🛡️</span>
              <span className="user-chip-name">{currentUser?.name || 'Admin'}</span>
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

  // Student / General Visitor Navbar
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <NavLink to={currentUser ? '/student' : '/home'} className="brand">
          <span className="brand-mark">CB</span>
          <span>CampusBite</span>
        </NavLink>

        <nav className="nav-links">
          <NavLink to={currentUser ? '/student' : '/home'} end>
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
          {currentUser ? (
            <>
              <div className="user-profile-chip" title={`Signed in as ${currentUser.name}`}>
                <span className="user-avatar-initial">
                  {currentUser.name ? currentUser.name.charAt(0) : 'S'}
                </span>
                <span className="user-chip-name">{currentUser.name}</span>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-ghost">
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-primary">
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
