export default function Footer() {
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
          <h4>For Staff</h4>
          <a href="/staff">Staff Dashboard</a>
          <a href="/admin">Admin Dashboard</a>
        </div>
      </div>
      <div className="container footer-bottom">© 2026 CampusBite. University project demo.</div>
    </footer>
  )
}
