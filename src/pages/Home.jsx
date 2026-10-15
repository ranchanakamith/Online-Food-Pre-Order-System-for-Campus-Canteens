import { Link } from 'react-router-dom'
import { useFood } from '../context/FoodContext'

export default function Home() {
  const { canteens, foods } = useFood()
  const activeCanteens = canteens.filter((c) => c.active !== false)
  const featuredFood = foods[0] || {}

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Campus meals, without the queue</span>
            <h1>Order before you arrive.</h1>
            <p>
              Browse university canteens, customize your meals, select your preferred
              pickup window, and collect without waiting in long dining queues.
            </p>
            <div className="hero-actions">
              <Link to="/canteens" className="btn btn-primary btn-large">
                Order Food Now
              </Link>
              <Link to="/orders" className="btn btn-secondary btn-large">
                Track My Orders
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <strong>{activeCanteens.length}+</strong>
                <span>Campus Canteens</span>
              </div>
              <div>
                <strong>{foods.length}+</strong>
                <span>Daily Meals</span>
              </div>
              <div>
                <strong>Fast</strong>
                <span>Pickup Speed</span>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-top">
              <span>Next available pickup</span>
              <strong>12:30 PM</strong>
            </div>
            {featuredFood.image && (
              <img
                src={featuredFood.image}
                alt={featuredFood.name || 'Campus meal'}
              />
            )}
            <div className="hero-card-body">
              <span className="badge">Preparing</span>
              <h3>{featuredFood.name || 'Chicken Fried Rice'}</h3>
              <p>Main Canteen · Live Order #CB1023</p>
              <div className="progress-line">
                <span />
              </div>
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
            <h2>Popular dining spots</h2>
          </div>
          <Link to="/canteens" className="text-link">
            View all ({activeCanteens.length}) →
          </Link>
        </div>

        <div className="card-grid three">
          {activeCanteens.map((canteen) => (
            <Link
              to={`/canteens/${canteen.id}/menu`}
              className="canteen-card"
              key={canteen.id}
            >
              <div className="canteen-card-image-wrap">
                <img src={canteen.image} alt={canteen.name} loading="lazy" />
                <span className="canteen-badge-open">{canteen.status || 'Open'}</span>
              </div>
              <div className="card-content">
                <div className="card-row">
                  <h3>{canteen.name}</h3>
                  <span className="canteen-eta-pill">⚡ {canteen.eta}</span>
                </div>
                <p>{canteen.location}</p>
                <div className="meta-row">
                  <span>Hours: {canteen.openingTime || '07:30'}–{canteen.closingTime || '18:00'}</span>
                  <span className="text-link">View Menu →</span>
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
              <span className="eyebrow">Simple 3-Step Process</span>
              <h2>How CampusBite works</h2>
            </div>
          </div>
          <div className="steps">
            <div className="step-card">
              <span>01</span>
              <h3>Choose Canteen & Meal</h3>
              <p>Explore daily menus across faculties and select dishes according to your taste.</p>
            </div>
            <div className="step-card">
              <span>02</span>
              <h3>Pre-Order & Set Time</h3>
              <p>Add items to cart, specify preparation notes, and pick your arrival time slot.</p>
            </div>
            <div className="step-card">
              <span>03</span>
              <h3>Express Counter Pickup</h3>
              <p>Track live cooking status on your phone and collect your hot meal without queuing.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
