import { Link } from 'react-router-dom'

export default function ForgotPassword() {
  return (
    <section className="auth-section">
      <div className="auth-card">
        <span className="eyebrow">Account Recovery</span>
        <h2>Forgot your password?</h2>
        <p>Enter your ID and registered email address.</p>

        <form className="form-stack" onSubmit={(e) => e.preventDefault()}>
          <label>
            Registration No. / Staff ID
            <input type="text" placeholder="e.g. IT20231234" required />
          </label>
          <label>
            Registered Email
            <input type="email" placeholder="your@email.com" required />
          </label>
          <button className="btn btn-primary btn-large full-width" type="submit">
            Request Password Reset
          </button>
        </form>

        <p className="auth-switch">
          Remembered your password? <Link to="/login">Back to login</Link>
        </p>
      </div>
    </section>
  )
}
