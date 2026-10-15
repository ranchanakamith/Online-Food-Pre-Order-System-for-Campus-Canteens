import { useMemo, useState } from 'react'
import { useFood } from '../context/FoodContext'
import { useOrders, statusSequence, statusLabels } from '../context/OrderContext'

const actionLabels = {
  PENDING: 'Accept Order',
  ACCEPTED: 'Start Preparing',
  PREPARING: 'Mark Ready',
  READY: 'Complete Order',
  COMPLETED: 'Completed ✓',
  CANCELLED: 'Cancelled',
}

export default function WorkerDashboard() {
  const { foods, updateFoodStock } = useFood()
  const { orders, advanceOrderStatus } = useOrders()
  const [savedFoodId, setSavedFoodId] = useState(null)
  const [orderFilter, setOrderFilter] = useState('active')

  // Filter food items relevant to Main Canteen (or all campus foods)
  const canteenFoods = useMemo(() => {
    return foods.filter((f) => !f.canteenIds || f.canteenIds.includes(1))
  }, [foods])

  const summary = useMemo(() => {
    const prepared = canteenFoods.reduce((sum, food) => sum + (food.prepared || 0), 0)
    const sold = canteenFoods.reduce((sum, food) => sum + (food.sold || 0), 0)
    const available = canteenFoods.reduce(
      (sum, food) => sum + Math.max((food.prepared || 0) - (food.sold || 0), 0),
      0
    )
    const waitingOrders = orders.filter(
      (order) => !['READY', 'COMPLETED', 'CANCELLED'].includes(order.status)
    ).length

    return { prepared, sold, available, waitingOrders }
  }, [canteenFoods, orders])

  const filteredOrders = useMemo(() => {
    if (orderFilter === 'active') {
      return orders.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.status))
    }
    if (orderFilter === 'completed') {
      return orders.filter((o) => o.status === 'COMPLETED')
    }
    return orders
  }, [orders, orderFilter])

  const saveFood = (id) => {
    setSavedFoodId(id)
    window.setTimeout(() => setSavedFoodId(null), 1400)
  }

  return (
    <section className="worker-page container">
      <header className="worker-hero">
        <div>
          <span className="eyebrow">Worker & Kitchen Portal</span>
          <h1>Main Canteen Kitchen</h1>
          <p>
            Manage live food stock portions, prices, and process student pre-orders
            in real time.
          </p>
        </div>
        <div className="worker-shift-badge">
          <span className="worker-live-dot" />
          Kitchen Live & Accepting Orders
        </div>
      </header>

      <section className="worker-summary-grid" aria-label="Today's summary">
        <article className="worker-summary-card primary">
          <span>Available now</span>
          <strong>{summary.available}</strong>
          <small>portions left to sell</small>
        </article>
        <article className="worker-summary-card">
          <span>Orders waiting</span>
          <strong className="text-warn">{summary.waitingOrders}</strong>
          <small>need kitchen attention</small>
        </article>
        <article className="worker-summary-card">
          <span>Prepared today</span>
          <strong>{summary.prepared}</strong>
          <small>total cooked portions</small>
        </article>
        <article className="worker-summary-card">
          <span>Sold today</span>
          <strong>{summary.sold}</strong>
          <small>total portions served</small>
        </article>
      </section>

      <section className="worker-section">
        <div className="worker-section-heading">
          <div>
            <span className="eyebrow">Daily Food Inventory</span>
            <h2>Today's Menu Stock</h2>
            <p>
              Changes made here instantly update the student menu. Toggle availability
              when an item runs out.
            </p>
          </div>
        </div>

        <div className="worker-food-grid">
          {canteenFoods.map((food) => {
            const availableQty = Math.max((food.prepared || 0) - (food.sold || 0), 0)
            const targetQty = food.target || 0
            const preparedQty = food.prepared || 0
            const needToPrepare = Math.max(targetQty - preparedQty, 0)
            const isAvailable = food.enabled !== false && availableQty > 0

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
                    onClick={() => updateFoodStock(food.id, 'enabled', !food.enabled)}
                    title={isAvailable ? 'Click to mark as Sold Out' : 'Click to enable availability'}
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
                    <strong>{food.sold || 0}</strong>
                    <span>Sold</span>
                  </div>
                  <div className="worker-stock-divider" />
                  <div>
                    <strong>{preparedQty}</strong>
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
                      onChange={(e) => updateFoodStock(food.id, 'price', e.target.value)}
                    />
                  </label>

                  <label>
                    Target
                    <input
                      type="number"
                      min="0"
                      value={food.target || 0}
                      onChange={(e) => updateFoodStock(food.id, 'target', e.target.value)}
                    />
                  </label>

                  <label>
                    Prepared
                    <input
                      type="number"
                      min="0"
                      value={food.prepared || 0}
                      onChange={(e) => updateFoodStock(food.id, 'prepared', e.target.value)}
                    />
                  </label>

                  <label>
                    Sold
                    <input
                      type="number"
                      min="0"
                      max={food.prepared || 0}
                      value={food.sold || 0}
                      onChange={(e) => updateFoodStock(food.id, 'sold', e.target.value)}
                    />
                  </label>
                </div>

                <div className={`worker-prepare-message ${needToPrepare > 0 ? 'needs-more' : 'enough'}`}>
                  {needToPrepare > 0
                    ? `⚠️ Prepare ${needToPrepare} more to hit target.`
                    : '✓ Target reached. No additional preparation needed.'}
                </div>

                <button
                  type="button"
                  className="btn btn-primary full-width"
                  onClick={() => saveFood(food.id)}
                >
                  {savedFoodId === food.id ? '✓ Changes Saved' : 'Save Stock'}
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
            <h2>Live Student Orders ({filteredOrders.length})</h2>
            <p>Advance each order as kitchen preparation progresses.</p>
          </div>

          <div className="worker-order-filters">
            <button
              type="button"
              className={`filter-chip ${orderFilter === 'active' ? 'active' : ''}`}
              onClick={() => setOrderFilter('active')}
            >
              Active ({orders.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.status)).length})
            </button>
            <button
              type="button"
              className={`filter-chip ${orderFilter === 'all' ? 'active' : ''}`}
              onClick={() => setOrderFilter('all')}
            >
              All Orders ({orders.length})
            </button>
            <button
              type="button"
              className={`filter-chip ${orderFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setOrderFilter('completed')}
            >
              Completed ({orders.filter((o) => o.status === 'COMPLETED').length})
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="panel empty-search-panel">
            <p>No orders currently in this queue.</p>
          </div>
        ) : (
          <div className="worker-order-list">
            {filteredOrders.map((order) => {
              const isCompleted = order.status === 'COMPLETED'
              const isCancelled = order.status === 'CANCELLED'

              return (
                <article className="worker-order-card" key={order.id}>
                  <div className="worker-order-main">
                    <div className="worker-order-id">
                      <span>Order</span>
                      <strong>#{order.id}</strong>
                      <span className="order-dining-type">
                        {order.orderType === 'Dine-in' ? '🍽️ Dine-in' : '🥡 Takeaway'}
                      </span>
                    </div>

                    <div className="worker-order-details">
                      <h3>
                        {order.itemsSummary ||
                          order.items?.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                      </h3>
                      <p>
                        Student ID: <strong>{order.student}</strong> · Total: Rs. {order.total} (
                        {order.paymentMethod || 'Pay at Counter'})
                      </p>
                      {order.notes && (
                        <p className="kitchen-special-instruction">
                          ⚠️ Note: {order.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="worker-order-side">
                    <div className="worker-pickup-time">
                      <span>Target Pickup</span>
                      <strong>{order.pickup}</strong>
                    </div>

                    <span className={`order-status status-${(order.status || 'pending').toLowerCase()}`}>
                      ● {order.status}
                    </span>

                    <button
                      type="button"
                      className={
                        isCompleted
                          ? 'btn btn-secondary'
                          : isCancelled
                          ? 'btn btn-secondary'
                          : 'btn btn-primary'
                      }
                      disabled={isCompleted || isCancelled}
                      onClick={() => advanceOrderStatus(order.id)}
                    >
                      {actionLabels[order.status] || 'Update Status'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </section>
  )
}
