export default function Orders() {
  return (
    <section className="section container page-top">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Track your meal</span>
          <h1>My orders</h1>
        </div>
      </div>

      <div className="panel order-card">
        <div className="order-header">
          <div>
            <span className="small-label">Order #CB1023</span>
            <h2>Main Canteen</h2>
          </div>
          <span className="badge">Preparing</span>
        </div>

        <p>Chicken Fried Rice × 1 · Iced Coffee × 2</p>
        <div className="order-meta">
          <span><strong>Pickup:</strong> 12:30 PM</span>
          <span><strong>Total:</strong> Rs. 1,250</span>
        </div>

        <div className="timeline">
          <div className="timeline-step done"><span>✓</span><p>Placed</p></div>
          <div className="timeline-step done"><span>✓</span><p>Accepted</p></div>
          <div className="timeline-step current"><span>3</span><p>Preparing</p></div>
          <div className="timeline-step"><span>4</span><p>Ready</p></div>
          <div className="timeline-step"><span>5</span><p>Completed</p></div>
        </div>
      </div>
    </section>
  )
}
