import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const queryParams = new URLSearchParams(location.search)
  const redirect = queryParams.get('redirect')

  const handleLogin = (e) => {
    e.preventDefault()
    const user = login(loginId, password)

    if (redirect) {
      navigate(redirect)
    } else if (user.role === 'admin') {
      navigate('/admin')
    } else if (user.role === 'worker') {
      navigate('/worker')
    } else {
      navigate('/student')
    }
  }

  return (
    <section className="auth-section">
      <div className="login-layout container">
        {/* Minimal Clean Left Intro */}
        <div className="login-intro-clean">
          <div className="brand-badge-clean">
            <span className="brand-mark">CB</span>
            <span className="brand-name-lg">CampusBite</span>
          </div>

          <h1>Skip the canteen queue.<br />Pick up hot meals on time.</h1>
          <p>
            The easy online pre-order system for university canteens. Browse daily meals, pre-order ahead, and collect without waiting in lines.
          </p>

         
        </div>

        {/* Minimal Clean Login Card */}
        <div className="auth-card">
          <span className="eyebrow">Account Access</span>
          <h2>Sign In to CampusBite</h2>
          <p>Enter your student registration number or staff ID to proceed.</p>

          {redirect === '/cart' && (
            <div className="auth-notice-banner">
              🔒 Please sign in to your student account to place your order.
            </div>
          )}

          <form className="form-stack" onSubmit={handleLogin}>
            <label>
              Registration No. / Staff ID
              <input
                type="text"
                placeholder="e.g. IT20231234, worker001, admin001"
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
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <div className="form-options">
             
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button className="btn btn-primary btn-large full-width" type="submit">
              Sign In
            </button>

            
          </form>

          <div className="guest-explore-divider">
            <span>or browse first</span>
          </div>

          <Link to="/home" className="btn btn-secondary full-width btn-guest-home">
            Continue to Home Page (Browse as Guest) →
          </Link>

          <p className="auth-switch">
            Don't have a student account? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
