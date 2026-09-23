import { NavLink, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  const publicPages = ['/', '/login', '/register', '/forgot-password']
  const isPublicPage = publicPages.includes(location.pathname)

  if (isPublicPage) {
    return (
      <header className="navbar">
        <div className="container nav-inner">
          <NavLink to="/login" className="brand">
            <span className="brand-mark">CB</span>
            <span>CampusBite</span>
          </NavLink>
          <div className="nav-actions">
            <NavLink to="/login" className="btn btn-ghost">Login</NavLink>
            <NavLink to="/register" className="btn btn-primary">Create Account</NavLink>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <NavLink to="/student" className="brand">
          <span className="brand-mark">CB</span>
          <span>CampusBite</span>
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/student">Home</NavLink>
          <NavLink to="/canteens">Canteens</NavLink>
          <NavLink to="/orders">My Orders</NavLink>
          <NavLink to="/cart">Cart</NavLink>
        </nav>
        <div className="nav-actions">
          <NavLink to="/login" className="btn btn-secondary">Logout</NavLink>
        </div>
      </div>
    </header>
  )
}
