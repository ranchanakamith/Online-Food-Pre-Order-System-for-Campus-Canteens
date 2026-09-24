import { useMemo, useState } from 'react'

const initialFood = [
  { id: 1, name: 'Chicken Fried Rice', price: 100, target: 6, prepared: 4, sold: 2, enabled: true },
  { id: 2, name: 'Fish Rice', price: 600, target: 70, prepared: 60, sold: 48, enabled: true },
  { id: 3, name: 'Vegetable Rice', price: 500, target: 40, prepared: 35, sold: 27, enabled: true },
]

const initialOrders = [
  { id: 'CB1023', student: 'IT20231234', items: 'Chicken Fried Rice ×1, Iced Coffee ×2', pickup: '12:30 PM', status: 'PREPARING' },
  { id: 'CB1024', student: 'IT20231456', items: 'Chicken Fried Rice ×2', pickup: '12:45 PM', status: 'PENDING' },
  { id: 'CB1025', student: 'IT20231502', items: 'Vegetable Rice ×1', pickup: '1:00 PM', status: 'READY' },
]

const statusSequence = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED']

const actionLabels = {
  PENDING: 'Accept Order',
  ACCEPTED: 'Start Preparing',
  PREPARING: 'Mark Ready',
  READY: 'Complete Order',
  COMPLETED: 'Completed',
}

export default function WorkerDashboard() {
  const [foods, setFoods] = useState(initialFood)
  const [orders, setOrders] = useState(initialOrders)
  const [savedFoodId, setSavedFoodId] = useState(null)

  const summary = useMemo(() => {
    const prepared = foods.reduce((sum, food) => sum + food.prepared, 0)
    const sold = foods.reduce((sum, food) => sum + food.sold, 0)
    const available = foods.reduce((sum, food) => sum + Math.max(food.prepared - food.sold, 0), 0)
    const waitingOrders = orders.filter((order) => !['READY', 'COMPLETED'].includes(order.status)).length

    return { prepared, sold, available, waitingOrders }
  }, [foods, orders])

  const updateFood = (id, field, value) => {
    setFoods((current) => current.map((food) => {
      if (food.id !== id) return food

      if (field === 'enabled') {
        return { ...food, enabled: value }
      }

      const numericValue = Math.max(0, Number(value) || 0)
      const updated = { ...food, [field]: numericValue }

      if (field === 'sold' && numericValue > updated.prepared) {
        updated.sold = updated.prepared
      }

      return updated
    }))
  }

  const saveFood = (id) => {
    setSavedFoodId(id)
    window.setTimeout(() => setSavedFoodId(null), 1200)
  }

  const advanceOrder = (id) => {
    setOrders((current) => current.map((order) => {
      if (order.id !== id || order.status === 'COMPLETED') return order
      const currentIndex = statusSequence.indexOf(order.status)
      return { ...order, status: statusSequence[currentIndex + 1] }
    }))
  }

  return (
    <section className="worker-page container">
      <header className="worker-hero">
        <div>
          <span className="eyebrow">Worker Portal</span>
          <h1>Main Canteen</h1>
          <p>Update today's food stock and complete student orders from one simple dashboard.</p>
        </div>
        <div className="worker-shift-badge">
          <span className="worker-live-dot" />
          Canteen Open
        </div>
      </header>

      <section className="worker-summary-grid" aria-label="Today's summary">
        <article className="worker-summary-card primary">
          <span>Available now</span>
          <strong>{summary.available}</strong>
          <small>food portions left</small>
        </article>
        <article className="worker-summary-card">
          <span>Orders waiting</span>
          <strong>{summary.waitingOrders}</strong>
          <small>need worker attention</small>
        </article>
        <article className="worker-summary-card">
          <span>Prepared today</span>
          <strong>{summary.prepared}</strong>
          <small>total portions</small>
        </article>
        <article className="worker-summary-card">
          <span>Sold today</span>
          <strong>{summary.sold}</strong>
          <small>total portions</small>
        </article>
      </section>

      <section className="worker-section">
        <div className="worker-section-heading">
          <div>
            <span className="eyebrow">Food Stock</span>
            <h2>Today's food</h2>
            <p>Change only the values you need. Available quantity is calculated automatically.</p>
          </div>
        </div>

        <div className="worker-food-grid">
          {foods.map((food) => {
            const availableQty = Math.max(food.prepared - food.sold, 0)
            const needToPrepare = Math.max(food.target - food.prepared, 0)
            const isAvailable = food.enabled && availableQty > 0

            return (
              <article className="worker-food-card" key={food.id}>
                <div className="worker-food-card-top">
                  <div>
                    <h3>{food.name}</h3>
                    <p>Rs. {food.price} per portion</p>
                  </div>

                  <button
                    type="button"
                    className={`worker-status-toggle ${isAvailable ? 'is-available' : 'is-sold-out'}`}
                    onClick={() => updateFood(food.id, 'enabled', !food.enabled)}
                    disabled={availableQty === 0}
                  >
                    <span />
                    {isAvailable ? 'Available' : 'Sold Out'}
                  </button>
                </div>

                <div className="worker-stock-highlight">
                  <div>
                    <strong>{availableQty}</strong>
                    <span>Available</span>
                  </div>
                  <div className="worker-stock-divider" />
                  <div>
                    <strong>{food.sold}</strong>
                    <span>Sold</span>
                  </div>
                  <div className="worker-stock-divider" />
                  <div>
                    <strong>{food.prepared}</strong>
                    <span>Prepared</span>
                  </div>
                </div>

                <div className="worker-edit-grid">
                  <label>
                    Price (Rs.)
                    <input
                      type="number"
                      min="0"
                      value={food.price}
                      onChange={(e) => updateFood(food.id, 'price', e.target.value)}
                    />
                  </label>

                  <label>
                    Today's Target
                    <input
                      type="number"
                      min="0"
                      value={food.target}
                      onChange={(e) => updateFood(food.id, 'target', e.target.value)}
                    />
                  </label>

                  <label>
                    Prepared
                    <input
                      type="number"
                      min="0"
                      value={food.prepared}
                      onChange={(e) => updateFood(food.id, 'prepared', e.target.value)}
                    />
                  </label>

                  <label>
                    Sold
                    <input
                      type="number"
                      min="0"
                      max={food.prepared}
                      value={food.sold}
                      onChange={(e) => updateFood(food.id, 'sold', e.target.value)}
                    />
                  </label>
                </div>

                <div className={`worker-prepare-message ${needToPrepare > 0 ? 'needs-more' : 'enough'}`}>
                  {needToPrepare > 0
                    ? `Prepare ${needToPrepare} more to reach today's target.`
                    : 'Target reached. No additional preparation needed.'}
                </div>

                <button className="btn btn-primary full-width" onClick={() => saveFood(food.id)}>
                  {savedFoodId === food.id ? 'Changes Saved' : 'Save Changes'}
                </button>
              </article>
            )
          })}
        </div>
      </section>

      <section className="worker-section worker-orders-section">
        <div className="worker-section-heading">
          <div>
            <span className="eyebrow">Order Queue</span>
            <h2>Student orders</h2>
            <p>The action button always shows what you should do next.</p>
          </div>
        </div>

        <div className="worker-order-list">
          {orders.map((order) => (
            <article className="worker-order-card" key={order.id}>
              <div className="worker-order-main">
                <div className="worker-order-id">
                  <span>Order</span>
                  <strong>#{order.id}</strong>
                </div>

                <div className="worker-order-details">
                  <h3>{order.items}</h3>
                  <p>Student {order.student}</p>
                </div>
              </div>

              <div className="worker-order-side">
                <div className="worker-pickup-time">
                  <span>Pickup</span>
                  <strong>{order.pickup}</strong>
                </div>

                <span className={`order-status status-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>

                <button
                  className={order.status === 'COMPLETED' ? 'btn btn-secondary' : 'btn btn-primary'}
                  disabled={order.status === 'COMPLETED'}
                  onClick={() => advanceOrder(order.id)}
                >
                  {actionLabels[order.status]}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
