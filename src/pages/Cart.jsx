import { Link } from 'react-router-dom'

export default function Cart() {
  return (
    <section className="section container page-top">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Almost done</span>
          <h1>Your cart</h1>
        </div>
      </div>

      <div className="checkout-grid">
        <div className="panel">
          <div className="cart-item">
            <div>
              <h3>Chicken Fried Rice</h3>
              <p>Main Canteen</p>
            </div>
            <div className="qty">− <strong>1</strong> +</div>
            <strong>Rs. 650</strong>
          </div>
          <div className="cart-item">
            <div>
              <h3>Iced Coffee</h3>
              <p>Main Canteen</p>
            </div>
            <div className="qty">− <strong>2</strong> +</div>
            <strong>Rs. 600</strong>
          </div>
        </div>

        <aside className="panel summary-card">
          <h2>Order Summary</h2>
          <div className="summary-row"><span>Subtotal</span><span>Rs. 1,250</span></div>
          <div className="summary-row"><span>Service fee</span><span>Rs. 0</span></div>
          <div className="summary-row total"><span>Total</span><span>Rs. 1,250</span></div>

          <label>
            Pickup time
            <select defaultValue="12:30">
              <option value="12:30">12:30 PM</option>
              <option value="12:45">12:45 PM</option>
              <option value="13:00">1:00 PM</option>
            </select>
          </label>

          <div className="payment-note">
            <strong>Payment method</strong>
            <span>Pay at counter</span>
          </div>

          <Link to="/orders" className="btn btn-primary btn-large full-width">Place Order</Link>
        </aside>
      </div>
    </section>
  )
}
