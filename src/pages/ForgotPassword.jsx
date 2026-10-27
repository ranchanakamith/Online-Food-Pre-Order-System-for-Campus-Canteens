import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  return (
    <section className="auth-section">
      <div className="auth-card">
        <span className="eyebrow">Account Recovery</span>
        <h2>Password reset</h2>
        <p>Password reset is not connected in this browser demo.</p>
        <div className="auth-notice-banner">
          No reset email will be sent. Ask the system administrator to reset a real account.
        </div>
        <Link to="/login" className="btn btn-primary full-width">
          Return to Login
        </Link>
      </div>
    </section>
  )
}
