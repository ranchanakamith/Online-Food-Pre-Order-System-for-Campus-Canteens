import { useLocation } from 'react-router-dom'

export default function Footer() {
  const location = useLocation()

  if (location.pathname.startsWith('/worker') || location.pathname.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>CampusBite</h3>
          <p>Pre-order your campus meals and spend less time waiting in line.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <a href="/canteens">Canteens</a>
          <a href="/orders">My Orders</a>
          <a href="/login">Login</a>
        </div>
        <div>
          <h4>Access</h4>
          <a href="/login">Worker Login</a>
          <a href="/login">Admin Login</a>
        </div>
      </div>
      <div className="container footer-bottom">© 2026 CampusBite. University project demo.</div>
    </footer>
  )
}
