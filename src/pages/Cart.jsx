import { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrderContext'
import { useAuth } from '../context/AuthContext'
import { useFood, getFoodInventory } from '../context/FoodContext'

export default function Cart() {
  const navigate = useNavigate()
  const {
    cart,
    updateQuantity,
    removeFromCart,
    updateItemInstructions,
    changeCartCanteen,
    clearCart,
    subtotal,
    serviceFee,
    total,
    showToast,
  } = useCart()
  const { placeOrder } = useOrders()
  const { currentUser } = useAuth()
  const { canteens, foods } = useFood()

  // Track the target canteen for this order
  const [selectedCanteenId, setSelectedCanteenId] = useState(() => {
    return cart.length > 0 && cart[0]?.canteenId ? Number(cart[0].canteenId) : 1
  })

  useEffect(() => {
    if (cart.length > 0 && cart[0]?.canteenId) {
      setSelectedCanteenId(Number(cart[0].canteenId))
    }
  }, [cart])

  const targetCanteen = useMemo(() => {
    return (
      canteens.find((c) => c.id === Number(selectedCanteenId)) || {
        id: selectedCanteenId,
        name:
          selectedCanteenId === 2
            ? 'Engineering Canteen'
            : selectedCanteenId === 3
            ? 'Student Centre Cafe'
            : 'Main Canteen',
        location: 'Campus Dining Hall',
      }
    )
  }, [canteens, selectedCanteenId])

  const [pickupTime, setPickupTime] = useState('12:30 PM')
  const [orderType, setOrderType] = useState('Takeaway')
  const [paymentMethod, setPaymentMethod] = useState('Pay at counter')
  const [orderNotes, setOrderNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submittingRef = useRef(false)

  const handleCanteenSwitch = (newId) => {
    const target = canteens.find((canteen) => Number(canteen.id) === Number(newId))
    if (!target || target.active === false) {
      showToast('That canteen is currently unavailable.', 'error')
      return
    }

    const prices = {}
    const canMove = cart.every((item) => {
      const food = foods.find((entry) => Number(entry.id) === Number(item.id))
      if (!food || !food.canteenIds.includes(Number(newId))) return false
      const inventory = getFoodInventory(food, newId)
      prices[item.id] = inventory.price
      return inventory.enabled &&
        inventory.prepared - inventory.sold - inventory.reserved >= Number(item.quantity)
    })
    if (!canMove) {
      showToast('This canteen does not offer every cart item or does not have enough stock.', 'error')
      return
    }

    setSelectedCanteenId(Number(newId))
    changeCartCanteen(newId, target.name, prices)
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    if (cart.length === 0 || submittingRef.current) return

    if (currentUser?.role !== 'student') {
      navigate('/login?redirect=/cart')
      return
    }

    submittingRef.current = true
    setIsSubmitting(true)

    // Route order explicitly to the selected canteen
    const newOrder = placeOrder({
      items: cart,
      canteen: {
        id: Number(selectedCanteenId),
        name: targetCanteen.name,
      },
      pickupTime,
      paymentMethod,
      orderType,
      notes: orderNotes,
      studentId: currentUser.id,
    })

    if (newOrder?.error) {
      showToast(newOrder.error, 'error')
      submittingRef.current = false
      setIsSubmitting(false)
      return
    }

    clearCart()

    setTimeout(() => {
      submittingRef.current = false
      setIsSubmitting(false)
      navigate('/orders')
    }, 400)
  }

  if (cart.length === 0) {
    return (
      <section className="section container page-top">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Shopping Cart</span>
            <h1>Your cart is empty</h1>
            <p>You haven't added any meals or drinks to your pre-order cart yet.</p>
          </div>
        </div>

        <div className="panel empty-cart-card">
          <div className="empty-cart-icon">🛒</div>
          <h2>No items in your cart</h2>
          <p>
            Choose your canteen, explore available meals, and place your pre-order to skip the queue!
          </p>
          <div className="empty-cart-actions">
            <Link to="/canteens" className="btn btn-primary btn-large">
              Browse Canteens
            </Link>
            <Link to="/student" className="btn btn-secondary btn-large">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section container page-top">
      {/* Clean Canteen Destination Pill */}
      <div className="cart-canteen-pill">
        <span>📍 Preparing at <strong>{targetCanteen.name}</strong> ({targetCanteen.location})</span>
        <Link to={`/canteens/${selectedCanteenId}/menu`} className="text-link small-text">
          + Add more items
        </Link>
      </div>

      <div className="section-heading">
        <div>
          <span className="eyebrow">Checkout Review</span>
          <h1>Your Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</h1>
        </div>
        <button
          type="button"
          className="btn btn-ghost text-danger btn-sm"
          onClick={clearCart}
          title="Remove all items from your cart"
        >
          Clear Cart
        </button>
      </div>

      <div className="checkout-grid">
        <div className="panel cart-items-list">
          <div className="cart-items-header">
            <h3>Selected Food Items ({targetCanteen.name})</h3>
            <Link to={`/canteens/${selectedCanteenId}/menu`} className="text-link small-text">
              + Add more items
            </Link>
          </div>

          {cart.map((item) => {
            const itemTotal = item.price * item.quantity

            return (
              <div className="cart-item" key={item.id}>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-thumbnail"
                  />
                )}
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="cart-canteen-tag">📍 {targetCanteen.name}</p>
                  <span className="cart-unit-price">Rs. {item.price} each</span>

                  <div className="cart-instructions-wrapper">
                    <input
                      type="text"
                      className="cart-instruction-input"
                      placeholder="Special instructions (e.g. less chili, no onions)..."
                      value={item.instructions || ''}
                      onChange={(e) => updateItemInstructions(item.id, e.target.value)}
                    />
                  </div>
                </div>

                <div className="qty-controls">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label={`Decrease ${item.name} quantity`}
                  >
                    −
                  </button>
                  <strong className="qty-number">{item.quantity}</strong>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label={`Increase ${item.name} quantity`}
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-actions">
                  <strong className="cart-item-price">Rs. {itemTotal.toLocaleString()}</strong>
                  <button
                    type="button"
                    className="btn-remove-item"
                    onClick={() => removeFromCart(item.id)}
                    title={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <aside className="panel summary-card">
          <h2>Order Summary</h2>

          {/* Explicit Canteen Selector for the student to confirm/change */}
          <div className="cart-canteen-selector-box">
            <label>
              Canteen Kitchen (Order Destination)
              <select
                value={selectedCanteenId}
                onChange={(e) => handleCanteenSwitch(Number(e.target.value))}
                className="cart-canteen-select"
              >
                {canteens.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.location})
                  </option>
                ))}
              </select>
            </label>
            <small className="selector-tip">
              Order will route exclusively to <strong>{targetCanteen.name}</strong> kitchen staff.
            </small>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>Rs. {subtotal.toLocaleString()}</strong>
          </div>
          <div className="summary-row">
            <span>Service fee (Campus Pickup)</span>
            <span className="text-free">FREE (Rs. 0)</span>
          </div>
          <div className="summary-row total">
            <span>Total Payable</span>
            <strong className="total-amount">Rs. {total.toLocaleString()}</strong>
          </div>

          <form className="order-preferences-form" onSubmit={handlePlaceOrder}>
            <label>
              Estimated Pickup time
              <select
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
              >
                <option value="In 10–15 min">ASAP (In 10–15 min)</option>
                <option value="12:15 PM">12:15 PM</option>
                <option value="12:30 PM">12:30 PM</option>
                <option value="12:45 PM">12:45 PM</option>
                <option value="1:00 PM">1:00 PM</option>
                <option value="1:15 PM">1:15 PM</option>
                <option value="1:30 PM">1:30 PM</option>
                <option value="2:00 PM">2:00 PM</option>
              </select>
            </label>

            <label>
              Dining Option
              <div className="radio-pill-group">
                <button
                  type="button"
                  className={`radio-pill ${orderType === 'Takeaway' ? 'active' : ''}`}
                  onClick={() => setOrderType('Takeaway')}
                >
                  🥡 Takeaway
                </button>
                <button
                  type="button"
                  className={`radio-pill ${orderType === 'Dine-in' ? 'active' : ''}`}
                  onClick={() => setOrderType('Dine-in')}
                >
                  🍽️ Dine-in
                </button>
              </div>
            </label>

            <div className="payment-options">
              <label>Payment Method</label>
              <p className="payment-note">This demo supports pay-at-counter orders only.</p>
              <div className="payment-choice-list">
                <label className="payment-radio-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Pay at counter"
                    checked={paymentMethod === 'Pay at counter'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash / Pay at Counter</span>
                </label>
                <label className="payment-radio-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Student ID Card"
                    disabled
                  />
                  <span>Student ID Card (not configured)</span>
                </label>
                <label className="payment-radio-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online Payment"
                    disabled
                  />
                  <span>Online payment (not configured)</span>
                </label>
              </div>
            </div>

            <label>
              Additional Note for Kitchen (Optional)
              <input
                type="text"
                placeholder="e.g., Pack separately, extra serviettes"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />
            </label>

            {!currentUser ? (
              <div className="login-required-box">
                <div className="login-required-header">
                  <span className="login-required-icon">🔒</span>
                  <div>
                    <h4>Login Required to Place Order</h4>
                    <p>You must be signed in to your student account to place this order and track preparation.</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-large full-width"
                  onClick={() => navigate('/login?redirect=/cart')}
                >
                  Sign In to Place Order
                </button>
                <div className="login-required-help">
                  <span>Don't have an account?</span>{' '}
                  <Link to="/register">Create an account</Link>
                </div>
              </div>
            ) : (
              <button
                type="submit"
                className="btn btn-primary btn-large full-width place-order-btn"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Routing to Kitchen...'
                  : `Place Order to ${targetCanteen.name} · Rs. ${total.toLocaleString()}`}
              </button>
            )}
          </form>

          <div className="cart-security-badge">
            <span className="security-icon">🛡️</span>
            <span>Order routes directly to {targetCanteen.name} kitchen queue</span>
          </div>
        </aside>
      </div>
    </section>
  )
}
