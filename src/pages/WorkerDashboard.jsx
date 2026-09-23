import { useState } from 'react'

const initialFood = [
  { id: 1, name: 'Chicken Fried Rice', planned: 100, prepared: 80, sold: 56, available: true },
  { id: 2, name: 'Fish Rice', planned: 70, prepared: 60, sold: 48, available: true },
  { id: 3, name: 'Vegetable Rice', planned: 40, prepared: 35, sold: 27, available: true },
]

const initialOrders = [
  { id: 'CB1023', student: 'IT20231234', items: 'Chicken Fried Rice ×1, Iced Coffee ×2', pickup: '12:30 PM', status: 'PREPARING' },
  { id: 'CB1024', student: 'IT20231456', items: 'Chicken Fried Rice ×2', pickup: '12:45 PM', status: 'PENDING' },
]

export default function WorkerDashboard() {
  const [foods, setFoods] = useState(initialFood)
  const [orders, setOrders] = useState(initialOrders)

  const updateFood = (id, field, value) => {
    setFoods((current) =>
      current.map((food) =>
        food.id === id
          ? { ...food, [field]: field === 'available' ? value : Math.max(0, Number(value) || 0) }
          : food
      )
    )
  }

  const nextStatus = (status) => {
    const sequence = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED']
    return sequence[Math.min(sequence.indexOf(status) + 1, sequence.length - 1)]
  }

  return (
    <section className="section container page-top">
      <div className="dashboard-title">
        <div>
          <span className="eyebrow">Worker Dashboard</span>
          <h1>Main Canteen</h1>
          <p>Manage today's preparation, availability and orders.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><span>Orders Today</span><strong>{orders.length}</strong></div>
        <div className="stat-card"><span>Pending</span><strong>{orders.filter(o => o.status === 'PENDING').length}</strong></div>
        <div className="stat-card"><span>Preparing</span><strong>{orders.filter(o => o.status === 'PREPARING').length}</strong></div>
        <div className="stat-card"><span>Completed</span><strong>{orders.filter(o => o.status === 'COMPLETED').length}</strong></div>
      </div>

      <div className="panel dashboard-panel">
        <div className="panel-title">
          <div>
            <h2>Today's Food Preparation</h2>
            <p>Remaining and required amounts are calculated automatically.</p>
          </div>
        </div>

        <div className="worker-food-table">
          <div className="worker-food-row worker-food-head">
            <span>Food</span><span>Planned</span><span>Prepared</span><span>Sold</span>
            <span>Remaining</span><span>Need to Prepare</span><span>Available</span>
          </div>

          {foods.map((food) => {
            const remaining = Math.max(food.prepared - food.sold, 0)
            const need = Math.max(food.planned - food.prepared, 0)

            return (
              <div className="worker-food-row" key={food.id}>
                <strong>{food.name}</strong>
                <input className="table-number-input" type="number" value={food.planned}
                  onChange={(e) => updateFood(food.id, 'planned', e.target.value)} />
                <input className="table-number-input" type="number" value={food.prepared}
                  onChange={(e) => updateFood(food.id, 'prepared', e.target.value)} />
                <span>{food.sold}</span>
                <strong>{remaining}</strong>
                <span className={need > 0 ? 'need-warning' : 'need-ok'}>
                  {need > 0 ? `${need} more` : 'Enough'}
                </span>
                <label className="switch-row">
                  <input type="checkbox" checked={food.available}
                    onChange={(e) => updateFood(food.id, 'available', e.target.checked)} />
                  <span>{food.available ? 'Available' : 'Sold Out'}</span>
                </label>
              </div>
            )
          })}
        </div>
      </div>

      <div className="panel dashboard-panel">
        <div className="panel-title">
          <div>
            <h2>Student Orders</h2>
            <p>Update orders until they are completed.</p>
          </div>
        </div>

        <div className="order-table">
          <div className="order-row worker-order-row worker-food-head">
            <span>Order</span><span>Student</span><span>Items</span><span>Pickup</span><span>Status</span><span>Action</span>
          </div>

          {orders.map((order) => (
            <div className="order-row worker-order-row" key={order.id}>
              <strong>#{order.id}</strong>
              <span>{order.student}</span>
              <span>{order.items}</span>
              <span>{order.pickup}</span>
              <span className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</span>
              <button
                className="btn btn-secondary"
                disabled={order.status === 'COMPLETED'}
                onClick={() =>
                  setOrders(current => current.map(o =>
                    o.id === order.id ? { ...o, status: nextStatus(o.status) } : o
                  ))
                }
              >
                {order.status === 'COMPLETED' ? 'Completed' : 'Next Status'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
