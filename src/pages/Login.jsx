import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    const user = login(loginId, password)

    if (user.role === 'admin') navigate('/admin')
    else if (user.role === 'worker') navigate('/worker')
    else navigate('/student')
  }

  const handleQuickLogin = (role) => {
    let id = ''
    if (role === 'admin') id = 'admin001'
    else if (role === 'worker') id = 'worker001'
    else id = 'IT20231234'

    setLoginId(id)
    setPassword('demo1234')
    const user = login(id, 'demo1234')

    if (user.role === 'admin') navigate('/admin')
    else if (user.role === 'worker') navigate('/worker')
    else navigate('/student')
  }

  return (
    <section className="auth-section">
      <div className="login-layout container">
        <div className="login-intro">
          <span className="eyebrow">Campus Food Pre-Order System</span>
          <h1>Skip the canteen queue. Collect hot meals on time.</h1>
          <p>
            An integrated smart pre-order platform connecting university students,
            canteen kitchen workers, and campus dining administrators into a seamless,
            queue-free dining ecosystem.
          </p>

          <div className="login-features-list">
            <div className="login-feature-item">
              <span className="feature-icon">⚡</span>
              <div>
                <strong>Instant Pre-Orders</strong>
                <p>Order food ahead between lectures and pick up at counter without waiting.</p>
              </div>
            </div>
            <div className="login-feature-item">
              <span className="feature-icon">👨‍🍳</span>
              <div>
                <strong>Live Kitchen Queue</strong>
                <p>Canteen staff receive and advance orders in real-time as they cook.</p>
              </div>
            </div>
            <div className="login-feature-item">
              <span className="feature-icon">📊</span>
              <div>
                <strong>Multi-Facility Admin</strong>
                <p>Centralized monitoring of campus canteens, inventory, and analytics.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <span className="eyebrow">Portal Authentication</span>
          <h2>Login to CampusBite</h2>
          <p>Enter your student registration number or staff ID.</p>

          <div className="quick-demo-login-box">
            <span className="quick-login-title">Quick Demo Logins (1-Click):</span>
            <div className="quick-login-buttons">
              <button
                type="button"
                className="btn-quick-role student"
                onClick={() => handleQuickLogin('student')}
              >
                🎓 Student
              </button>
              <button
                type="button"
                className="btn-quick-role worker"
                onClick={() => handleQuickLogin('worker')}
              >
                👨‍🍳 Kitchen Staff
              </button>
              <button
                type="button"
                className="btn-quick-role admin"
                onClick={() => handleQuickLogin('admin')}
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          <form className="form-stack" onSubmit={handleLogin}>
            <label>
              Registration No. / Staff ID
              <input
                type="text"
                placeholder="e.g. IT20231234 or worker001"
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
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button className="btn btn-primary btn-large full-width" type="submit">
              Sign In to Account
            </button>
          </form>

          <p className="auth-switch">
            Don't have a student account? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
