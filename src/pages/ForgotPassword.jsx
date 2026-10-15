import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [email, setEmail] = useState('')

  const handleReset = (e) => {
    e.preventDefault()
    if (!identifier || !email) return
    setSubmitted(true)
  }

  return (
    <section className="auth-section">
      <div className="auth-card">
        <span className="eyebrow">Account Recovery</span>
        <h2>Reset your password</h2>
        <p>Enter your registration number or staff ID along with your university email.</p>

        {submitted ? (
          <div className="auth-success-box">
            <div className="success-icon">✉️</div>
            <h3>Check your university inbox</h3>
            <p>
              We've dispatched a password reset link to <strong>{email}</strong> for user ID{' '}
              <strong>{identifier}</strong>.
            </p>
            <Link to="/login" className="btn btn-primary full-width">
              Return to Login
            </Link>
          </div>
        ) : (
          <form className="form-stack" onSubmit={handleReset}>
            <label>
              Registration No. / Staff ID
              <input
                type="text"
                placeholder="e.g. IT20231234 or worker001"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </label>
            <label>
              Registered University Email
              <input
                type="email"
                placeholder="e.g. student@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <button className="btn btn-primary btn-large full-width" type="submit">
              Send Recovery Link
            </button>
          </form>
        )}

        <p className="auth-switch">
          Remembered your credentials? <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </section>
  )
}
