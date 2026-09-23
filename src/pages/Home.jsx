import { Link } from 'react-router-dom'
import { canteens, foods } from '../data/mockData'

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Campus meals, without the queue</span>
            <h1>Order before you arrive.</h1>
            <p>
              Browse campus canteens, choose your meal, select a pickup time,
              and collect it when it is ready.
            </p>
            <div className="hero-actions">
              <Link to="/canteens" className="btn btn-primary btn-large">Order Food</Link>
              <Link to="/orders" className="btn btn-secondary btn-large">Track Order</Link>
            </div>
            <div className="hero-stats">
              <div><strong>3+</strong><span>Canteens</span></div>
              <div><strong>20+</strong><span>Meals</span></div>
              <div><strong>Fast</strong><span>Pickup</span></div>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-top">
              <span>Next pickup</span>
              <strong>12:30 PM</strong>
            </div>
            <img
              src={foods[0].image}
              alt="Chicken fried rice"
            />
            <div className="hero-card-body">
              <span className="badge">Preparing</span>
              <h3>{foods[0].name}</h3>
              <p>Main Canteen · Order #CB1023</p>
              <div className="progress-line"><span /></div>
              <div className="progress-labels">
                <span>Accepted</span>
                <span>Ready soon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Choose a canteen</span>
            <h2>Popular on campus</h2>
          </div>
          <Link to="/canteens" className="text-link">View all →</Link>
        </div>

        <div className="card-grid three">
          {canteens.map((canteen) => (
            <Link to={`/canteens/${canteen.id}/menu`} className="canteen-card" key={canteen.id}>
              <img src={canteen.image} alt={canteen.name} />
              <div className="card-content">
                <div className="card-row">
                  <h3>{canteen.name}</h3>
                  <span className="status-open">{canteen.status}</span>
                </div>
                <p>{canteen.location}</p>
                <div className="meta-row">
                  <span>Pickup in {canteen.eta}</span>
                  <span>View Menu →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-heading center">
            <div>
              <span className="eyebrow">Simple process</span>
              <h2>How it works</h2>
            </div>
          </div>
          <div className="steps">
            <div className="step-card"><span>01</span><h3>Choose</h3><p>Select a canteen and browse available meals.</p></div>
            <div className="step-card"><span>02</span><h3>Pre-order</h3><p>Add items to your cart and choose a pickup time.</p></div>
            <div className="step-card"><span>03</span><h3>Collect</h3><p>Track your order and collect it when marked ready.</p></div>
          </div>
        </div>
      </section>
    </>
  )
}
