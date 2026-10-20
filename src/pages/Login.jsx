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

  const handleQuickLogin = (role, canteenId = 1) => {
    let id = ''
    if (role === 'admin') {
      id = 'admin001'
    } else if (role === 'worker') {
      if (canteenId === 2) id = 'worker002'
      else if (canteenId === 3) id = 'worker003'
      else id = 'worker001'
    } else {
      id = 'IT20231234'
    }

    setLoginId(id)
    setPassword('demo1234')
    const user = login(id, 'demo1234', canteenId)

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
            queue-free dining ecosystem with role-based canteen facility access control.
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
              <span className="feature-icon">🔒</span>
              <div>
                <strong>Isolated Kitchen Portals</strong>
                <p>Each canteen's staff has exclusive access to their own food inventory and orders.</p>
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
            <span className="quick-login-title">Quick Demo Logins (1-Click Role Switch):</span>
            <div className="quick-login-buttons-stacked">
              <button
                type="button"
                className="btn-quick-role student"
                onClick={() => handleQuickLogin('student')}
              >
                🎓 Student (Kasun)
              </button>

              <div className="quick-worker-group">
                <span className="quick-group-label">Canteen Staff (Facility-Restricted):</span>
                <div className="quick-worker-grid">
                  <button
                    type="button"
                    className="btn-quick-role worker"
                    onClick={() => handleQuickLogin('worker', 1)}
                    title="Login as Main Canteen Kitchen Staff"
                  >
                    👨‍🍳 Main Canteen
                  </button>
                  <button
                    type="button"
                    className="btn-quick-role worker"
                    onClick={() => handleQuickLogin('worker', 2)}
                    title="Login as Engineering Canteen Kitchen Staff"
                  >
                    👨‍🍳 Eng Canteen
                  </button>
                  <button
                    type="button"
                    className="btn-quick-role worker"
                    onClick={() => handleQuickLogin('worker', 3)}
                    title="Login as Student Centre Cafe Staff"
                  >
                    👨‍🍳 Cafe Staff
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="btn-quick-role admin"
                onClick={() => handleQuickLogin('admin')}
              >
                🛡️ System Administrator
              </button>
            </div>
          </div>

          <form className="form-stack" onSubmit={handleLogin}>
            <label>
              Registration No. / Staff ID
              <input
                type="text"
                placeholder="e.g. IT20231234, worker001, worker002"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
              />
              <span className="input-helper-text">
                Staff IDs: <code>worker001</code> (Main), <code>worker002</code> (Engineering), <code>worker003</code> (Cafe)
              </span>
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
