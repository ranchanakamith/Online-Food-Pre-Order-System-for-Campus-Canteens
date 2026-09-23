import { useState } from 'react'

const initialCanteens = [
  { id: 1, name: 'Main Canteen', location: 'Near Main Library', openingTime: '08:00', closingTime: '17:00', active: true },
  { id: 2, name: 'Engineering Canteen', location: 'Engineering Faculty', openingTime: '08:00', closingTime: '16:30', active: true },
]

export default function AdminDashboard() {
  const [canteens, setCanteens] = useState(initialCanteens)
  const [form, setForm] = useState({ name: '', location: '', openingTime: '08:00', closingTime: '17:00' })

  const addCanteen = (e) => {
    e.preventDefault()
    setCanteens(current => [...current, { id: Date.now(), ...form, active: true }])
    setForm({ name: '', location: '', openingTime: '08:00', closingTime: '17:00' })
  }

  const removeCanteen = (id) => {
    setCanteens(current => current.filter(c => c.id !== id))
  }

  const toggleCanteen = (id) => {
    setCanteens(current => current.map(c => c.id === id ? { ...c, active: !c.active } : c))
  }

  return (
    <section className="section container page-top">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">Administrator</span>
          <h1>Admin Dashboard</h1>
          <p>Manage canteens, workers, students and the overall system.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><span>Total Canteens</span><strong>{canteens.length}</strong></div>
        <div className="stat-card"><span>Workers</span><strong>12</strong></div>
        <div className="stat-card"><span>Students</span><strong>350</strong></div>
        <div className="stat-card"><span>Today's Orders</span><strong>120</strong></div>
      </div>

      <div className="admin-layout">
        <div className="panel">
          <div className="panel-title">
            <div><h2>Add Canteen</h2><p>Create a new canteen location.</p></div>
          </div>

          <form className="form-stack" onSubmit={addCanteen}>
            <label>
              Canteen Name
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </label>
            <label>
              Location
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
            </label>
            <div className="form-two-column">
              <label>
                Opening Time
                <input type="time" value={form.openingTime} onChange={e => setForm({...form, openingTime: e.target.value})} />
              </label>
              <label>
                Closing Time
                <input type="time" value={form.closingTime} onChange={e => setForm({...form, closingTime: e.target.value})} />
              </label>
            </div>
            <button className="btn btn-primary" type="submit">Add Canteen</button>
          </form>
        </div>

        <div className="panel">
          <div className="panel-title">
            <div><h2>Canteen Management</h2><p>Enable, disable or remove canteens.</p></div>
          </div>

          <div className="management-list">
            {canteens.map(canteen => (
              <div className="management-item" key={canteen.id}>
                <div>
                  <h3>{canteen.name}</h3>
                  <p>{canteen.location}</p>
                  <small>{canteen.openingTime} - {canteen.closingTime}</small>
                </div>

                <div className="management-actions">
                  <span className={canteen.active ? 'status-open' : 'status-disabled'}>
                    {canteen.active ? 'Active' : 'Disabled'}
                  </span>
                  <button className="btn btn-secondary" onClick={() => toggleCanteen(canteen.id)}>
                    {canteen.active ? 'Disable' : 'Enable'}
                  </button>
                  <button className="btn btn-danger" onClick={() => removeCanteen(canteen.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
