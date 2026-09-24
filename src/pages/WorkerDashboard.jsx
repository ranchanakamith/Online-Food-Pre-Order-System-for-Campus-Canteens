import { useMemo, useState } from 'react'

const initialFood = [
  { id: 1, name: 'Chicken Fried Rice', price: 650, planned: 100, prepared: 80, sold: 56, available: true },
  { id: 2, name: 'Fish Rice', price: 600, planned: 70, prepared: 60, sold: 48, available: true },
  { id: 3, name: 'Vegetable Rice', price: 500, planned: 40, prepared: 35, sold: 27, available: true },
]

const initialOrders = [
  { id: 'CB1023', student: 'IT20231234', items: 'Chicken Fried Rice ×1, Iced Coffee ×2', pickup: '12:30 PM', status: 'PREPARING' },
  { id: 'CB1024', student: 'IT20231456', items: 'Chicken Fried Rice ×2', pickup: '12:45 PM', status: 'PENDING' },
]

export default function WorkerDashboard() {
  const [foods, setFoods] = useState(initialFood)
  const [orders, setOrders] = useState(initialOrders)
  const [savedFoodId, setSavedFoodId] = useState(null)

  const totals = useMemo(() => ({
    prepared: foods.reduce((sum, food) => sum + food.prepared, 0),
    sold: foods.reduce((sum, food) => sum + food.sold, 0),
    stock: foods.reduce((sum, food) => sum + Math.max(food.prepared - food.sold, 0), 0),
  }), [foods])

  const updateFood = (id, field, value) => {
    setFoods((current) => current.map((food) => {
      if (food.id !== id) return food

      if (field === 'available') {
        return { ...food, available: value }
      }

      const numericValue = Math.max(0, Number(value) || 0)
      const updated = { ...food, [field]: numericValue }

      if (field === 'sold' && numericValue >= updated.prepared) {
        updated.available = false
      }

      if ((field === 'prepared' || field === 'sold') && updated.prepared - updated.sold > 0 && !food.available) {
        updated.available = true
      }

      return updated
    }))
  }

  const saveFood = (id) => {
    setSavedFoodId(id)
    setTimeout(() => setSavedFoodId(null), 1200)
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
          <p>Manage food prices, daily stock, availability and student orders.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><span>Orders Today</span><strong>{orders.length}</strong></div>
        <div className="stat-card"><span>Total Prepared</span><strong>{totals.prepared}</strong></div>
        <div className="stat-card"><span>Total Sold</span><strong>{totals.sold}</strong></div>
        <div className="stat-card"><span>Stock Left</span><strong>{totals.stock}</strong></div>
      </div>

      <div className="panel dashboard-panel">
        <div className="panel-title">
          <div>
            <h2>Food Management</h2>
            <p>Update price, preparation quantities and availability. Stock left is calculated automatically.</p>
          </div>
        </div>

        <div className="worker-food-table">
          <div className="worker-food-row worker-food-row-expanded worker-food-head">
            <span>Food</span>
            <span>Price (Rs.)</span>
            <span>Planned</span>
            <span>Prepared</span>
            <span>Sold</span>
            <span>Stock Left</span>
            <span>Need to Prepare</span>
            <span>Availability</span>
            <span>Action</span>
          </div>

          {foods.map((food) => {
            const stockLeft = Math.max(food.prepared - food.sold, 0)
            const need = Math.max(food.planned - food.prepared, 0)
            const isAvailable = food.available && stockLeft > 0

            return (
              <div className="worker-food-row worker-food-row-expanded" key={food.id}>
                <strong>{food.name}</strong>

                <input
                  className="table-number-input price-input"
                  type="number"
                  min="0"
                  value={food.price}
                  onChange={(e) => updateFood(food.id, 'price', e.target.value)}
                />

                <input
                  className="table-number-input"
                  type="number"
                  min="0"
                  value={food.planned}
                  onChange={(e) => updateFood(food.id, 'planned', e.target.value)}
                />

                <input
                  className="table-number-input"
                  type="number"
                  min="0"
                  value={food.prepared}
                  onChange={(e) => updateFood(food.id, 'prepared', e.target.value)}
                />

                <input
                  className="table-number-input"
                  type="number"
                  min="0"
                  value={food.sold}
                  onChange={(e) => updateFood(food.id, 'sold', e.target.value)}
                />

                <strong className={stockLeft === 0 ? 'stock-empty' : 'stock-count'}>
                  {stockLeft}
                </strong>

                <span className={need > 0 ? 'need-warning' : 'need-ok'}>
                  {need > 0 ? `${need} more` : 'Enough'}
                </span>

                <button
                  type="button"
                  className={`availability-button ${isAvailable ? 'available' : 'sold-out'}`}
                  onClick={() => updateFood(food.id, 'available', !food.available)}
                  disabled={stockLeft === 0}
                  title={stockLeft === 0 ? 'No prepared stock left' : 'Change food availability'}
                >
                  <span className="availability-dot" />
                  {isAvailable ? 'Available' : 'Sold Out'}
                </button>

                <button className="btn btn-primary worker-save-btn" onClick={() => saveFood(food.id)}>
                  {savedFoodId === food.id ? 'Saved' : 'Save'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="panel dashboard-panel">
        <div className="panel-title">
          <div>
            <h2>Student Orders</h2>
            <p>Update each order until collection is completed.</p>
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
                onClick={() => setOrders((current) => current.map((o) =>
                  o.id === order.id ? { ...o, status: nextStatus(o.status) } : o
                ))}
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
