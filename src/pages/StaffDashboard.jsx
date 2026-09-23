const statCards = [
  ['45', "Today's Orders"],
  ['6', 'Pending'],
  ['8', 'Preparing'],
  ['31', 'Completed'],
]

export default function StaffDashboard() {
  return (
    <section className="section container page-top">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">Staff area</span>
          <h1>Canteen Dashboard</h1>
          <p>Main Canteen · Today</p>
        </div>
        <button className="btn btn-primary">+ Add Food</button>
      </div>

      <div className="stats-grid">
        {statCards.map(([value, label]) => (
          <div className="stat-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-title">
          <div><h2>Live orders</h2><p>Update each order as preparation progresses.</p></div>
        </div>

        <div className="order-table">
          <div className="order-row order-row-head">
            <span>Order</span><span>Items</span><span>Pickup</span><span>Status</span><span>Action</span>
          </div>
          <div className="order-row">
            <span>#CB1023</span>
            <span>Fried Rice ×1, Coffee ×2</span>
            <span>12:30 PM</span>
            <span><span className="badge">Preparing</span></span>
            <span><button className="btn btn-secondary">Mark Ready</button></span>
          </div>
          <div className="order-row">
            <span>#CB1024</span>
            <span>Chicken Kottu ×2</span>
            <span>12:45 PM</span>
            <span><span className="badge badge-warn">Pending</span></span>
            <span><button className="btn btn-primary">Accept</button></span>
          </div>
        </div>
      </div>
    </section>
  )
}
