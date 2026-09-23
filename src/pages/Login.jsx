import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    const id = loginId.trim().toLowerCase()

    if (id.startsWith('admin')) navigate('/admin')
    else if (id.startsWith('staff') || id.startsWith('worker')) navigate('/worker')
    else navigate('/student')
  }

  return (
    <section className="auth-section">
      <div className="login-layout container">
        <div className="login-intro">
          <span className="eyebrow">Campus Food Pre-Order System</span>
          <h1>Skip the queue. Collect when ready.</h1>
          <p>
            Students can pre-order meals, workers can manage food preparation
            and orders, and administrators can manage the system.
          </p>
        </div>

        <div className="auth-card">
          <span className="eyebrow">Welcome back</span>
          <h2>Login to CampusBite</h2>
          <p>Enter your registration number or staff ID.</p>

          <form className="form-stack" onSubmit={handleLogin}>
            <label>
              Registration No. / Staff ID
              <input
                type="text"
                placeholder="e.g. IT20231234"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
              />
            </label>

            <label>
              Password
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <div className="form-options">
              <label className="remember-row">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button className="btn btn-primary btn-large full-width" type="submit">
              Login
            </button>
          </form>

          <div className="demo-login-note">
            <strong>Temporary demo login</strong>
            <span>Student: any registration number</span>
            <span>Worker: worker001</span>
            <span>Admin: admin001</span>
          </div>

          <p className="auth-switch">
            Don't have a student account? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
