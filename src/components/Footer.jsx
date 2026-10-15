import { Link, useLocation } from 'react-router-dom'

export default function Footer() {
  const location = useLocation()

  if (location.pathname.startsWith('/worker') || location.pathname.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">
            <span className="brand-mark small">CB</span>
            <h3>CampusBite</h3>
          </div>
          <p>
            An intelligent online pre-order system designed for university campuses.
            Eliminate long lunch queues, save valuable lecture intervals, and enjoy fresh,
            hygienic campus meals.
          </p>
        </div>
        <div>
          <h4>Student Portal</h4>
          <Link to="/student">Dashboard</Link>
          <Link to="/canteens">Campus Canteens</Link>
          <Link to="/orders">Order Tracking</Link>
          <Link to="/cart">My Cart</Link>
        </div>
        <div>
          <h4>Staff & Management</h4>
          <Link to="/worker">Canteen Kitchen Portal</Link>
          <Link to="/admin">Campus Admin Portal</Link>
          <Link to="/login">Sign In / Switch Role</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 CampusBite · University Web Development Module Project</span>
        <span className="footer-status-pill">● System Operational</span>
      </div>
    </footer>
  )
}
