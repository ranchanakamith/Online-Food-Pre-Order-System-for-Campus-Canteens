import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [fullName, setFullName] = useState('')
  const [regNo, setRegNo] = useState('')
  const [email, setEmail] = useState('')
  const [faculty, setFaculty] = useState('Computing')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.')
      return
    }

    setSuccess(true)

    setTimeout(() => {
      // Automatically log the new student in
      login(regNo, password, null, fullName)
      navigate('/student')
    }, 800)
  }

  return (
    <section className="auth-section">
      <div className="auth-card register-card">
        <span className="eyebrow">Student Registration</span>
        <h2>Create your account</h2>
        <p>Register with your university credentials to pre-order meals from campus canteens.</p>

        {error && <div className="auth-error-banner">⚠️ {error}</div>}
        {success && <div className="auth-success-banner">✓ Account created! Redirecting to student dashboard...</div>}

        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="form-two-column">
            <label>
              Full Name
              <input
                type="text"
                placeholder="e.g. Kasun Perera"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </label>
            <label>
              Registration Number
              <input
                type="text"
                placeholder="e.g. IT20231234"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                required
              />
            </label>
          </div>

          <label>
            University Email
            <input
              type="email"
              placeholder="e.g. it20231234@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Faculty
            <select
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
            >
              <option value="Computing">Faculty of Computing</option>
              <option value="Engineering">Faculty of Engineering</option>
              <option value="Business">Faculty of Business Management</option>
              <option value="Science">Faculty of Science</option>
              <option value="Humanities">Faculty of Humanities</option>
            </select>
          </label>

          <div className="form-two-column">
            <label>
              Password
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <label>
              Confirm Password
              <input
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
          </div>

          <button className="btn btn-primary btn-large full-width" type="submit" disabled={success}>
            {success ? 'Creating Account...' : 'Create Student Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </section>
  )
}
