import { useState, useMemo } from 'react'
import { useFood } from '../context/FoodContext'
import { useOrders } from '../context/OrderContext'

export default function AdminDashboard() {
  const { canteens, addCanteen, toggleCanteen, removeCanteen, foods } = useFood()
  const { orders } = useOrders()

  const [form, setForm] = useState({
    name: '',
    location: '',
    openingTime: '08:00',
    closingTime: '17:00',
    description: '',
  })
  const [successMessage, setSuccessMessage] = useState('')

  const stats = useMemo(() => {
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
    const activeCanteens = canteens.filter((c) => c.active !== false).length

    return {
      canteensCount: canteens.length,
      activeCanteens,
      foodsCount: foods.length,
      totalOrders,
      totalRevenue,
    }
  }, [canteens, foods, orders])

  const handleAddCanteen = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.location.trim()) return

    addCanteen(form)
    setForm({
      name: '',
      location: '',
      openingTime: '08:00',
      closingTime: '17:00',
      description: '',
    })

    setSuccessMessage('✓ Canteen added successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  return (
    <section className="section container page-top">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">Campus Administrator</span>
          <h1>System Admin Dashboard</h1>
          <p>
            Monitor canteen facilities, manage dining locations, and oversee campus-wide
            orders and revenue.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Active Canteens</span>
          <strong>{stats.activeCanteens} / {stats.canteensCount}</strong>
        </div>
        <div className="stat-card">
          <span>Menu Food Items</span>
          <strong>{stats.foodsCount}</strong>
        </div>
        <div className="stat-card">
          <span>Total Orders</span>
          <strong>{stats.totalOrders}</strong>
        </div>
        <div className="stat-card">
          <span>Total Revenue</span>
          <strong className="text-success">Rs. {stats.totalRevenue.toLocaleString()}</strong>
        </div>
      </div>

      {successMessage && <div className="admin-alert-banner">{successMessage}</div>}

      <div className="admin-layout">
        <div className="panel">
          <div className="panel-title">
            <div>
              <h2>Register New Canteen</h2>
              <p>Add a newly approved canteen facility to the campus pre-order network.</p>
            </div>
          </div>

          <form className="form-stack" onSubmit={handleAddCanteen}>
            <label>
              Canteen Facility Name
              <input
                placeholder="e.g. Science Faculty Cafeteria"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>

            <label>
              Campus Location
              <input
                placeholder="e.g. Science Faculty Ground Floor"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </label>

            <div className="form-two-column">
              <label>
                Opening Time
                <input
                  type="time"
                  value={form.openingTime}
                  onChange={(e) => setForm({ ...form, openingTime: e.target.value })}
                />
              </label>
              <label>
                Closing Time
                <input
                  type="time"
                  value={form.closingTime}
                  onChange={(e) => setForm({ ...form, closingTime: e.target.value })}
                />
              </label>
            </div>

            <label>
              Description / Cuisine Type
              <input
                placeholder="e.g. South Asian curries, sandwiches, and fresh smoothies"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>

            <button className="btn btn-primary" type="submit">
              + Add Canteen Facility
            </button>
          </form>
        </div>

        <div className="panel">
          <div className="panel-title">
            <div>
              <h2>Manage Canteen Facilities ({canteens.length})</h2>
              <p>Toggle operational status or remove facilities.</p>
            </div>
          </div>

          <div className="management-list">
            {canteens.map((canteen) => (
              <div className="management-item" key={canteen.id}>
                <div>
                  <div className="management-item-header">
                    <h3>{canteen.name}</h3>
                    <span
                      className={`status-badge-sm ${
                        canteen.active !== false ? 'status-open' : 'status-disabled'
                      }`}
                    >
                      {canteen.active !== false ? '● Active' : '○ Disabled'}
                    </span>
                  </div>
                  <p className="management-location">📍 {canteen.location}</p>
                  <small>
                    Operating Hours: {canteen.openingTime || '07:30'} –{' '}
                    {canteen.closingTime || '18:00'}
                  </small>
                </div>

                <div className="management-actions">
                  <button
                    type="button"
                    className={`btn ${
                      canteen.active !== false ? 'btn-secondary' : 'btn-primary'
                    }`}
                    onClick={() => toggleCanteen(canteen.id)}
                  >
                    {canteen.active !== false ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeCanteen(canteen.id)}
                  >
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
