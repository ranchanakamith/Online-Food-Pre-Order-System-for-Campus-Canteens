import { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrderContext'
import { useAuth } from '../context/AuthContext'
import { useFood } from '../context/FoodContext'

export default function Cart() {
  const navigate = useNavigate()
  const {
    cart,
    updateQuantity,
    removeFromCart,
    updateItemInstructions,
    clearCart,
    clearCanteenCart,
    serviceFee,
    showToast,
  } = useCart()
  const { placeOrder } = useOrders()
  const { currentUser } = useAuth()
  const { canteens, foods } = useFood()

  const canteenGroups = useMemo(() => {
    const groups = new Map()
    cart.forEach((item) => {
      const id = Number(item.canteenId)
      if (!groups.has(id)) {
        const canteen = canteens.find((entry) => Number(entry.id) === id)
        groups.set(id, { id, name: canteen?.name || item.canteenName, location: canteen?.location, items: [], subtotal: 0 })
      }
      const group = groups.get(id)
      group.items.push(item)
      group.subtotal += Number(item.price) * Number(item.quantity)
    })
    return [...groups.values()]
  }, [cart, canteens])

  // Each kitchen receives only its own items; the other groups stay in the cart.
  const [selectedCanteenId, setSelectedCanteenId] = useState(() => {
    return cart.length > 0 && cart[0]?.canteenId ? Number(cart[0].canteenId) : 1
  })

  useEffect(() => {
    if (canteenGroups.length > 0 && !canteenGroups.some((group) => group.id === selectedCanteenId)) {
      setSelectedCanteenId(canteenGroups[0].id)
    }
  }, [canteenGroups, selectedCanteenId])

  const targetCanteen = canteenGroups.find((group) => group.id === selectedCanteenId) || canteenGroups[0]
  const checkoutItems = targetCanteen?.items || []
  const subtotal = targetCanteen?.subtotal || 0
  const total = subtotal + serviceFee

  const [pickupTime, setPickupTime] = useState('12:30 PM')
  const [orderType, setOrderType] = useState('Takeaway')
  const [paymentMethod, setPaymentMethod] = useState('Pay at counter')
  const [orderNotes, setOrderNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submittingRef = useRef(false)

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    if (checkoutItems.length === 0 || submittingRef.current) return

    if (currentUser?.role !== 'student') {
      navigate('/login?redirect=/cart')
      return
    }

    submittingRef.current = true
    setIsSubmitting(true)

    // Route order explicitly to the selected canteen
    const newOrder = placeOrder({
      items: checkoutItems,
      canteen: {
        id: targetCanteen.id,
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

    clearCanteenCart(targetCanteen.id)
    const hasOtherCanteens = canteenGroups.length > 1
    if (hasOtherCanteens) {
      showToast('Order placed for ' + targetCanteen.name + '. Your other canteen items are still in the cart.')
    }

    setTimeout(() => {
      submittingRef.current = false
      setIsSubmitting(false)
      if (!hasOtherCanteens) navigate('/orders')
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
      {/* Keep the checkout destination visible while browsing the combined cart. */}
      <div className="cart-canteen-pill">
        <span>📍 Checking out from <strong>{targetCanteen.name}</strong>{targetCanteen.location && ` (${targetCanteen.location})`}</span>
        <Link to={`/canteens/${targetCanteen.id}/menu`} className="text-link small-text">
          + Add more items
        </Link>
      </div>

      <div className="section-heading">
        <div>
          <span className="eyebrow">Checkout Review</span>
          <h1>Your Cart ({cart.reduce((sum, item) => sum + Number(item.quantity), 0)} items)</h1>
          {canteenGroups.length > 1 && <p>Items from {canteenGroups.length} canteens. Place a separate order for each canteen.</p>}
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
          {canteenGroups.map((group) => (
            <div key={group.id}>
              <div className="cart-items-header">
                <h3>{group.name} · Rs. {group.subtotal.toLocaleString()}</h3>
                <Link to={`/canteens/${group.id}/menu`} className="text-link small-text">
                  + Add more items
                </Link>
              </div>

              {group.items.map((item) => {
                const itemTotal = item.price * item.quantity
                const offeredHere = foods.some((food) => Number(food.id) === Number(item.id) &&
                  food.canteenIds.includes(Number(item.canteenId)))

                return (
                  <div className="cart-item" key={`${item.canteenId}:${item.id}`}>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-thumbnail"
                        style={{ objectPosition: item.imagePosition }}
                      />
                    )}
                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <p className="cart-canteen-tag">📍 {group.name}</p>
                      {!offeredHere && <p className="text-danger small-text">No longer on this canteen's menu. Remove this item before checkout.</p>}
                      <span className="cart-unit-price">Rs. {item.price} each</span>

                      <div className="cart-instructions-wrapper">
                        <input
                          type="text"
                          className="cart-instruction-input"
                          placeholder="Special instructions (e.g. less chili, no onions)..."
                          value={item.instructions || ''}
                          onChange={(e) => updateItemInstructions(item.id, e.target.value, item.canteenId)}
                        />
                      </div>
                    </div>

                    <div className="qty-controls">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.canteenId)}
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        −
                      </button>
                      <strong className="qty-number">{item.quantity}</strong>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.canteenId)}
                        disabled={!offeredHere}
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
                        onClick={() => removeFromCart(item.id, item.canteenId)}
                        title={`Remove ${item.name} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <aside className="panel summary-card">
          <h2>Order Summary · {targetCanteen.name}</h2>

          {/* Select an existing group without moving items between kitchens. */}
          <div className="cart-canteen-selector-box">
            <label>
              Canteen to check out
              <select
                value={targetCanteen.id}
                onChange={(e) => setSelectedCanteenId(Number(e.target.value))}
                disabled={isSubmitting}
                className="cart-canteen-select"
              >
                {canteenGroups.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · Rs. {c.subtotal.toLocaleString()}
                  </option>
                ))}
              </select>
            </label>
            <small className="selector-tip">
              This order includes only <strong>{targetCanteen.name}</strong> items. Other canteen items stay in your cart.
            </small>
          </div>

          <div className="summary-row">
            <span>{targetCanteen.name} subtotal</span>
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
