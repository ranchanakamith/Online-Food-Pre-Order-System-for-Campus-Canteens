import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOrders, statusSequence, statusLabels } from '../context/OrderContext'
import { useCart } from '../context/CartContext'

export default function Orders() {
  const { orders, cancelOrder } = useOrders()
  const { addToCart } = useCart()
  const [filter, setFilter] = useState('all')

  const filteredOrders = orders.filter((order) => {
    if (filter === 'active') {
      return ['PENDING', 'ACCEPTED', 'PREPARING', 'READY'].includes(order.status)
    }
    if (filter === 'completed') {
      return order.status === 'COMPLETED'
    }
    return true
  })

  const getStepIndex = (status) => {
    return statusSequence.indexOf(status)
  }

  const handleReorder = (order) => {
    if (!order.items) return
    order.items.forEach((item) => {
      addToCart(item, { name: order.canteen, id: order.canteenId }, item.quantity)
    })
  }

  return (
    <section className="section container page-top">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Track your meals</span>
          <h1>My orders ({orders.length})</h1>
          <p>Real-time order progress and pickup notifications from campus canteens.</p>
        </div>
        <Link to="/canteens" className="btn btn-primary">
          + Place New Order
        </Link>
      </div>

      <div className="order-filter-tabs">
        <button
          type="button"
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Orders ({orders.length})
        </button>
        <button
          type="button"
          className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active Orders ({orders.filter((o) => ['PENDING', 'ACCEPTED', 'PREPARING', 'READY'].includes(o.status)).length})
        </button>
        <button
          type="button"
          className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({orders.filter((o) => o.status === 'COMPLETED').length})
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="panel empty-cart-card">
          <div className="empty-cart-icon">📦</div>
          <h2>No orders found</h2>
          <p>You do not have any {filter !== 'all' ? filter : ''} orders yet.</p>
          <div className="empty-cart-actions">
            <Link to="/canteens" className="btn btn-primary btn-large">
              Browse Canteens
            </Link>
          </div>
        </div>
      ) : (
        <div className="orders-stack">
          {filteredOrders.map((order) => {
            const currentStepIdx = getStepIndex(order.status)
            const meta = statusLabels[order.status] || {
              label: order.status,
              badgeClass: 'badge',
            }

            return (
              <div className="panel order-card enhanced-order-card" key={order.id}>
                <div className="order-header">
                  <div>
                    <div className="order-id-badge-row">
                      <span className="small-label">Order #{order.id}</span>
                      <span className="order-type-tag">
                        {order.orderType === 'Dine-in' ? '🍽️ Dine-in' : '🥡 Takeaway'}
                      </span>
                      {order.createdAt && (
                        <span className="order-time-text">
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>
                    <h2>{order.canteen}</h2>
                  </div>

                  <div className="order-status-badge-wrap">
                    <span className={`status-badge-lg ${meta.badgeClass}`}>
                      ● {meta.label}
                    </span>
                  </div>
                </div>

                <div className="order-items-summary-box">
                  <div className="items-list-text">
                    <strong>Items: </strong>
                    {order.itemsSummary ||
                      order.items?.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                  </div>
                  {order.notes && (
                    <p className="order-kitchen-note">
                      📝 <em>Note: {order.notes}</em>
                    </p>
                  )}
                </div>

                <div className="order-meta">
                  <span>
                    <strong>Pickup Time:</strong> {order.pickup}
                  </span>
                  <span>
                    <strong>Payment:</strong> {order.paymentMethod || 'Pay at Counter'}
                  </span>
                  <span>
                    <strong>Total:</strong> Rs. {order.total?.toLocaleString()}
                  </span>
                </div>

                {order.status !== 'CANCELLED' ? (
                  <div className="timeline-container">
                    <div className="timeline">
                      <div
                        className={`timeline-step ${
                          currentStepIdx >= 0 ? (currentStepIdx === 0 ? 'current' : 'done') : ''
                        }`}
                      >
                        <span>{currentStepIdx > 0 ? '✓' : '1'}</span>
                        <p>Placed</p>
                      </div>
                      <div
                        className={`timeline-step ${
                          currentStepIdx >= 1 ? (currentStepIdx === 1 ? 'current' : 'done') : ''
                        }`}
                      >
                        <span>{currentStepIdx > 1 ? '✓' : '2'}</span>
                        <p>Accepted</p>
                      </div>
                      <div
                        className={`timeline-step ${
                          currentStepIdx >= 2 ? (currentStepIdx === 2 ? 'current' : 'done') : ''
                        }`}
                      >
                        <span>{currentStepIdx > 2 ? '✓' : '3'}</span>
                        <p>Preparing</p>
                      </div>
                      <div
                        className={`timeline-step ${
                          currentStepIdx >= 3 ? (currentStepIdx === 3 ? 'current' : 'done') : ''
                        }`}
                      >
                        <span>{currentStepIdx > 3 ? '✓' : '4'}</span>
                        <p>Ready</p>
                      </div>
                      <div
                        className={`timeline-step ${
                          currentStepIdx === 4 ? 'done current' : ''
                        }`}
                      >
                        <span>{currentStepIdx === 4 ? '✓' : '5'}</span>
                        <p>Collected</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="cancelled-banner">
                    ⚠️ This order was cancelled.
                  </div>
                )}

                <div className="order-card-bottom-actions">
                  {order.status === 'PENDING' && (
                    <button
                      type="button"
                      className="btn btn-secondary text-danger"
                      onClick={() => cancelOrder(order.id)}
                    >
                      Cancel Order
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleReorder(order)}
                  >
                    🔁 Order Again
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
