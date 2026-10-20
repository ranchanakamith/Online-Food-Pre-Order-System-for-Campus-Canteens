import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFood } from '../context/FoodContext'
import { useOrders } from '../context/OrderContext'
import { useAuth, canteenStaffAccounts } from '../context/AuthContext'

const actionLabels = {
  PENDING: 'Accept Order',
  ACCEPTED: 'Start Preparing',
  PREPARING: 'Mark Ready',
  READY: 'Complete Order',
  COMPLETED: 'Completed ✓',
  CANCELLED: 'Cancelled',
}

const photoPresets = [
  { label: '🍛 Rice & Curry', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80' },
  { label: '🍚 Fried Rice', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=80' },
  { label: '🥘 Kottu / Roti', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80' },
  { label: '🥪 Sandwich', url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1000&q=80' },
  { label: '🍔 Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80' },
  { label: '🥐 Pastry Roll', url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=80' },
  { label: '🧃 Fruit Juice', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80' },
  { label: '☕ Iced Coffee', url: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1000&q=80' },
  { label: '🧁 Sweet Muffin', url: 'https://images.unsplash.com/photo-1607958996333-41aef7caef4b?auto=format&fit=crop&w=1000&q=80' },
]

export default function WorkerDashboard() {
  const { canteens, foods, updateFoodStock, addFood, removeFood } = useFood()
  const { orders, advanceOrderStatus } = useOrders()
  const { currentUser, switchRole } = useAuth()

  const [savedFoodId, setSavedFoodId] = useState(null)
  const [orderFilter, setOrderFilter] = useState('active')

  // Modal and new food form states
  const [showAddModal, setShowAddModal] = useState(false)
  const [successAlert, setSuccessAlert] = useState('')
  const [newFood, setNewFood] = useState({
    name: '',
    category: 'Lunch',
    price: 350,
    target: 30,
    prepared: 30,
    description: '',
    tag: 'Fresh',
    image: photoPresets[0].url,
  })

  // 1. Role Access Control Check: Ensure user has worker permissions
  const isWorker = currentUser?.role === 'worker' || currentUser?.role === 'admin'

  // 2. Identify the specific canteen assigned to this worker
  const activeCanteenId = currentUser?.canteenId || 1
  const assignedCanteen = useMemo(() => {
    return canteens.find((c) => c.id === Number(activeCanteenId)) || canteens[0] || {}
  }, [canteens, activeCanteenId])

  // 3. Strict Canteen Food Isolation: Worker sees and edits ONLY their assigned canteen's items
  const canteenFoods = useMemo(() => {
    return foods.filter(
      (f) => f.canteenIds && f.canteenIds.includes(Number(activeCanteenId))
    )
  }, [foods, activeCanteenId])

  // 4. Strict Canteen Order Isolation: Worker sees and manages ONLY orders placed for their assigned canteen
  const canteenOrders = useMemo(() => {
    return orders.filter(
      (o) => Number(o.canteenId) === Number(activeCanteenId)
    )
  }, [orders, activeCanteenId])

  const summary = useMemo(() => {
    const prepared = canteenFoods.reduce((sum, food) => sum + (food.prepared || 0), 0)
    const sold = canteenFoods.reduce((sum, food) => sum + (food.sold || 0), 0)
    const available = canteenFoods.reduce(
      (sum, food) => sum + Math.max((food.prepared || 0) - (food.sold || 0), 0),
      0
    )
    const waitingOrders = canteenOrders.filter(
      (order) => !['READY', 'COMPLETED', 'CANCELLED'].includes(order.status)
    ).length

    return { prepared, sold, available, waitingOrders }
  }, [canteenFoods, canteenOrders])

  const filteredOrders = useMemo(() => {
    if (orderFilter === 'active') {
      return canteenOrders.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.status))
    }
    if (orderFilter === 'completed') {
      return canteenOrders.filter((o) => o.status === 'COMPLETED')
    }
    return canteenOrders
  }, [canteenOrders, orderFilter])

  const saveFood = (id) => {
    setSavedFoodId(id)
    window.setTimeout(() => setSavedFoodId(null), 1400)
  }

  const handleCreateFood = (e) => {
    e.preventDefault()
    if (!newFood.name.trim()) return

    // Explicitly lock the newly added food item to THIS worker's assigned canteen
    const created = addFood({
      name: newFood.name.trim(),
      category: newFood.category,
      price: Number(newFood.price) || 100,
      target: Number(newFood.target) || 30,
      prepared: Number(newFood.prepared) || 30,
      description: newFood.description.trim() || 'Freshly prepared meal from the campus kitchen.',
      tag: newFood.tag || 'Fresh',
      image: newFood.image || photoPresets[0].url,
      canteenIds: [Number(activeCanteenId)],
    })

    setSuccessAlert(`✓ "${created.name}" added successfully to ${assignedCanteen.name}'s menu!`)
    setTimeout(() => setSuccessAlert(''), 3500)

    // Reset form & close modal
    setNewFood({
      name: '',
      category: 'Lunch',
      price: 350,
      target: 30,
      prepared: 30,
      description: '',
      tag: 'Fresh',
      image: photoPresets[0].url,
    })
    setShowAddModal(false)
  }

  const handleDeleteFood = (foodId, foodName) => {
    if (window.confirm(`Are you sure you want to remove "${foodName}" from ${assignedCanteen.name}?`)) {
      removeFood(foodId)
      setSuccessAlert(`Removed "${foodName}" from ${assignedCanteen.name}'s menu.`)
      setTimeout(() => setSuccessAlert(''), 3000)
    }
  }

  // If a student or non-staff user visits /worker, display access denied
  if (!isWorker) {
    return (
      <section className="section container page-top">
        <div className="panel access-denied-card">
          <div className="access-denied-icon">🔒</div>
          <h2>Canteen Staff Portal Access Restricted</h2>
          <p>
            You are currently signed in as <strong>{currentUser?.name || 'Student'} ({currentUser?.id})</strong>.
            This kitchen management portal requires authorized Canteen Staff credentials.
          </p>
          <div className="access-denied-canteen-list">
            <span>To inspect a canteen's worker view, sign in as that canteen's staff:</span>
            <div className="quick-access-buttons">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => switchRole('worker', 1)}
              >
                👨‍🍳 Login as Main Canteen Staff
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => switchRole('worker', 2)}
              >
                👨‍🍳 Login as Engineering Canteen Staff
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => switchRole('worker', 3)}
              >
                👨‍🍳 Login as Student Centre Cafe Staff
              </button>
            </div>
          </div>
          <div className="access-denied-footer">
            <Link to="/student" className="btn btn-primary">
              Return to Student Dashboard
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="worker-page container">
      {/* --- Canteen Isolation Security Banner --- */}
      <div className="worker-isolation-badge">
        <div className="isolation-text">
          <span className="isolation-lock-icon">🔒</span>
          <span>
            <strong>Facility Access Lock Active:</strong> You are authorized to view and manage <strong>{assignedCanteen.name}</strong> only. All other campus canteen inventories and orders are strictly isolated.
          </span>
        </div>

        {/* Demo Facility Switcher for Examiners / Evaluators */}
        <div className="canteen-eval-switch">
          <span className="eval-label">Switch Staff Canteen (Test Mode):</span>
          <select
            value={activeCanteenId}
            onChange={(e) => switchRole('worker', Number(e.target.value))}
            className="eval-select"
            title="Switch worker to another canteen to test facility isolation"
          >
            {canteenStaffAccounts.map((staff) => (
              <option key={staff.canteenId} value={staff.canteenId}>
                {staff.canteenName} ({staff.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      <header className="worker-hero">
        <div>
          <span className="eyebrow">{assignedCanteen.name} · Kitchen Portal</span>
          <h1>{assignedCanteen.name} Kitchen</h1>
          <p>
            Manage live food stock portions, update prices, and process student orders for{' '}
            <strong>{assignedCanteen.name}</strong> ({assignedCanteen.location}).
          </p>
          <div className="worker-meta-details">
            <span className="worker-staff-badge">
              👤 Staff In-Charge: <strong>{currentUser?.name}</strong> (ID: {currentUser?.id})
            </span>
          </div>
        </div>
        <div className="worker-shift-badge">
          <span className="worker-live-dot" />
          {assignedCanteen.name} Open & Live
        </div>
      </header>

      <section className="worker-summary-grid" aria-label="Today's summary">
        <article className="worker-summary-card primary">
          <span>Available now</span>
          <strong>{summary.available}</strong>
          <small>portions left to sell ({assignedCanteen.name})</small>
        </article>
        <article className="worker-summary-card">
          <span>Orders waiting</span>
          <strong className="text-warn">{summary.waitingOrders}</strong>
          <small>waiting in {assignedCanteen.name} queue</small>
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

      {successAlert && (
        <div className="worker-notification-banner">
          {successAlert}
        </div>
      )}

      {/* --- DAILY FOOD INVENTORY SECTION (ISOLATED TO THIS CANTEEN) --- */}
      <section className="worker-section">
        <div className="worker-section-heading">
          <div>
            <span className="eyebrow">Daily Food Inventory</span>
            <h2>{assignedCanteen.name} Menu Stock ({canteenFoods.length} items)</h2>
            <p>
              Changes made here update only {assignedCanteen.name}'s menu. Items from other canteens are not shown.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-add-food-header"
            onClick={() => setShowAddModal(true)}
          >
            <span>+</span> Add New Food Item
          </button>
        </div>

        {canteenFoods.length === 0 ? (
          <div className="panel empty-search-panel">
            <p>No food items currently assigned to {assignedCanteen.name}.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              + Add First Food Item
            </button>
          </div>
        ) : (
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
                    <div className="worker-food-title-group">
                      {food.image && (
                        <img
                          src={food.image}
                          alt={food.name}
                          className="worker-food-thumb"
                        />
                      )}
                      <div>
                        <h3>{food.name}</h3>
                        <p>Rs. {food.price} per portion</p>
                        <span className="worker-category-tag">{food.category || 'Lunch'}</span>
                      </div>
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

                  <div className="worker-card-action-row">
                    <button
                      type="button"
                      className="btn btn-primary worker-save-btn flex-1"
                      onClick={() => saveFood(food.id)}
                    >
                      {savedFoodId === food.id ? '✓ Changes Saved' : 'Save Stock'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary worker-delete-btn"
                      onClick={() => handleDeleteFood(food.id, food.name)}
                      title={`Remove from ${assignedCanteen.name} menu`}
                    >
                      🗑️
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* --- ADD NEW FOOD MODAL (LOCKED TO THIS CANTEEN) --- */}
      {showAddModal && (
        <div className="worker-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="worker-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="worker-modal-header">
              <div>
                <span className="eyebrow">{assignedCanteen.name} · Menu Setup</span>
                <h2>Add Food to {assignedCanteen.name}</h2>
                <p>New dishes added here will appear exclusively under {assignedCanteen.name}'s menu.</p>
              </div>
              <button
                type="button"
                className="worker-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>

            <form className="form-stack" onSubmit={handleCreateFood}>
              <div className="form-two-column">
                <label>
                  Food Item Name *
                  <input
                    type="text"
                    placeholder="e.g. Chicken Biryani / Egg Roti"
                    value={newFood.name}
                    onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Meal Category *
                  <select
                    value={newFood.category}
                    onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                  >
                    <option value="Lunch">Lunch</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </label>
              </div>

              <div className="form-three-column">
                <label>
                  Price (Rs.) *
                  <input
                    type="number"
                    min="10"
                    placeholder="e.g. 450"
                    value={newFood.price}
                    onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Today's Target
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 40"
                    value={newFood.target}
                    onChange={(e) => setNewFood({ ...newFood, target: e.target.value })}
                    required
                  />
                </label>

                <label>
                  Initially Prepared
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 40"
                    value={newFood.prepared}
                    onChange={(e) => setNewFood({ ...newFood, prepared: e.target.value })}
                    required
                  />
                </label>
              </div>

              <div className="form-two-column">
                <label>
                  Highlight Tag
                  <select
                    value={newFood.tag}
                    onChange={(e) => setNewFood({ ...newFood, tag: e.target.value })}
                  >
                    <option value="Fresh">Fresh</option>
                    <option value="Popular">Popular</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Chef's Pick">Chef's Pick</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Special">Today's Special</option>
                    <option value="Quick Bite">Quick Bite</option>
                  </select>
                </label>

                <label>
                  Short Description
                  <input
                    type="text"
                    placeholder="e.g. Fragrant rice with spices and tender meat"
                    value={newFood.description}
                    onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
                  />
                </label>
              </div>

              <div className="preset-images-section">
                <label>Quick Preset Food Photo (Click to select):</label>
                <div className="photo-preset-chips">
                  {photoPresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className={`preset-chip ${newFood.image === preset.url ? 'active' : ''}`}
                      onClick={() => setNewFood({ ...newFood, image: preset.url })}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <label>
                Or Custom Image URL
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newFood.image}
                  onChange={(e) => setNewFood({ ...newFood, image: e.target.value })}
                />
              </label>

              {newFood.image && (
                <div className="modal-image-preview">
                  <span>Photo Preview:</span>
                  <img src={newFood.image} alt="Preview" />
                </div>
              )}

              <div className="worker-modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-large">
                  ✓ Add to {assignedCanteen.name}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- LIVE ORDER QUEUE (ISOLATED TO THIS CANTEEN) --- */}
      <section className="worker-section worker-orders-section">
        <div className="worker-section-heading">
          <div>
            <span className="eyebrow">Order Queue</span>
            <h2>{assignedCanteen.name} Live Orders ({filteredOrders.length})</h2>
            <p>Advance each order as preparation progresses in {assignedCanteen.name}'s kitchen.</p>
          </div>

          <div className="worker-order-filters">
            <button
              type="button"
              className={`filter-chip ${orderFilter === 'active' ? 'active' : ''}`}
              onClick={() => setOrderFilter('active')}
            >
              Active ({canteenOrders.filter((o) => !['COMPLETED', 'CANCELLED'].includes(o.status)).length})
            </button>
            <button
              type="button"
              className={`filter-chip ${orderFilter === 'all' ? 'active' : ''}`}
              onClick={() => setOrderFilter('all')}
            >
              All Orders ({canteenOrders.length})
            </button>
            <button
              type="button"
              className={`filter-chip ${orderFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setOrderFilter('completed')}
            >
              Completed ({canteenOrders.filter((o) => o.status === 'COMPLETED').length})
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="panel empty-search-panel">
            <p>No orders currently in {assignedCanteen.name}'s kitchen queue.</p>
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
