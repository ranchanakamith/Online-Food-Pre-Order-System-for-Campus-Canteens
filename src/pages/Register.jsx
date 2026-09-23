import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Demo: Student account created successfully.')
    navigate('/login')
  }

  return (
    <section className="auth-section">
      <div className="auth-card register-card">
        <span className="eyebrow">Student Registration</span>
        <h2>Create your account</h2>
        <p>Only students can create accounts from this page.</p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="form-two-column">
            <label>
              Full Name
              <input type="text" placeholder="Your full name" required />
            </label>
            <label>
              Registration Number
              <input type="text" placeholder="e.g. IT20231234" required />
            </label>
          </div>

          <label>
            University Email
            <input type="email" placeholder="student@university.edu" required />
          </label>

          <label>
            Faculty
            <select defaultValue="">
              <option value="" disabled>Select faculty</option>
              <option>Computing</option>
              <option>Engineering</option>
              <option>Business</option>
              <option>Science</option>
              <option>Other</option>
            </select>
          </label>

          <div className="form-two-column">
            <label>
              Password
              <input type="password" placeholder="Minimum 8 characters" required />
            </label>
            <label>
              Confirm Password
              <input type="password" placeholder="Repeat password" required />
            </label>
          </div>

          <button className="btn btn-primary btn-large full-width" type="submit">
            Create Student Account
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  )
}
