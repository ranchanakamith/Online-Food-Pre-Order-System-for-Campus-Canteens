import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrderContext'
import { useAuth } from '../context/AuthContext'

export default function Cart() {
  const navigate = useNavigate()
  const { cart, updateQuantity, removeFromCart, updateItemInstructions, clearCart, subtotal, serviceFee, total } = useCart()
  const { placeOrder } = useOrders()
  const { currentUser } = useAuth()

  const [pickupTime, setPickupTime] = useState('12:30 PM')
  const [orderType, setOrderType] = useState('Takeaway')
  const [paymentMethod, setPaymentMethod] = useState('Pay at counter')
  const [orderNotes, setOrderNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    if (cart.length === 0) return

    setIsSubmitting(true)

    // Primary canteen from the first item
    const primaryCanteen = {
      name: cart[0]?.canteenName || 'Main Canteen',
      id: cart[0]?.canteenId || 1,
    }

    const newOrder = placeOrder({
      items: cart,
      canteen: primaryCanteen,
      pickupTime,
      paymentMethod,
      orderType,
      notes: orderNotes,
      studentId: currentUser?.id || 'IT20231234',
    })

    clearCart()

    setTimeout(() => {
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
            Browse your favorite campus canteens, explore delicious meal menus,
            and order beforehand to avoid long queues!
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
      <div className="section-heading">
        <div>
          <span className="eyebrow">Almost done</span>
          <h1>Your cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</h1>
          <p>Review your selected meals, adjust quantities, and set your pickup time.</p>
        </div>
        <button
          type="button"
          className="btn btn-ghost text-danger"
          onClick={clearCart}
          title="Remove all items from your cart"
        >
          Clear Cart
        </button>
      </div>

      <div className="checkout-grid">
        <div className="panel cart-items-list">
          <div className="cart-items-header">
            <h3>Selected Food Items</h3>
            <Link to="/canteens" className="text-link small-text">
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
                  <p className="cart-canteen-tag">{item.canteenName}</p>
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
              Pickup time
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
                    value="Student ID Card"
                    checked={paymentMethod === 'Student ID Card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Student ID Card Balance</span>
                </label>
                <label className="payment-radio-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online Payment"
                    checked={paymentMethod === 'Online Payment'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Online Card / QR</span>
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

            <button
              type="submit"
              className="btn btn-primary btn-large full-width place-order-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing Order...' : `Place Order · Rs. ${total.toLocaleString()}`}
            </button>
          </form>

          <div className="cart-security-badge">
            <span className="security-icon">🛡️</span>
            <span>Pre-order guaranteed freshness · Direct from campus kitchen</span>
          </div>
        </aside>
      </div>
    </section>
  )
}
