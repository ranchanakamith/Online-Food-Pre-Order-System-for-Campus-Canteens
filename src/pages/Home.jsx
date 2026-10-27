import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFood } from '../context/FoodContext'

export default function Home() {
  const navigate = useNavigate()
  const { canteens, foods } = useFood()
  const [homeSearch, setHomeSearch] = useState('')
  const activeCanteens = canteens.filter((c) => c.active !== false)
  const featuredFood = foods[0] || {
    name: 'Chicken Fried Rice',
    price: 650,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=80',
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (homeSearch.trim()) {
      navigate(`/student?search=${encodeURIComponent(homeSearch.trim())}`)
    }
  }

  const quickFilter = (term) => {
    navigate(`/student?search=${encodeURIComponent(term)}`)
  }

  return (
    <>
      {/* Clean Minimal Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Smart Campus Dining</span>
            <h1>Skip the queue.<br />Pre-order campus meals.</h1>
            <p>
              Browse canteen menus, order ahead between lectures, and collect fresh hot meals without waiting in line.
            </p>

            {/* Clean Integrated Search Bar */}
            <form onSubmit={handleSearch} className="hero-search-form">
              <div className="search-input-wrapper">
                <span className="search-input-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search meals, snacks, drinks..."
                  value={homeSearch}
                  onChange={(e) => setHomeSearch(e.target.value)}
                />
                {homeSearch && (
                  <button
                    type="button"
                    className="clear-search-btn"
                    onClick={() => setHomeSearch('')}
                    title="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
              <button type="submit" className="btn btn-primary search-action-btn">
                Search
              </button>
            </form>

            {/* Quick Search Chips */}
            <div className="hero-quick-chips">
              <span>Popular:</span>
              <button type="button" onClick={() => quickFilter('Rice')}>Rice & Curry</button>
              <button type="button" onClick={() => quickFilter('Kottu')}>Kottu</button>
              <button type="button" onClick={() => quickFilter('Sandwich')}>Sandwiches</button>
              <button type="button" onClick={() => quickFilter('Coffee')}>Iced Coffee</button>
            </div>

            <div className="hero-actions-clean">
              <Link to="/canteens" className="btn btn-primary">
                Browse Canteens →
              </Link>
              <Link to="/orders" className="btn btn-secondary">
                Track Orders
              </Link>
            </div>
          </div>

          {/* Minimal Featured Food Card */}
          <div className="hero-card-clean">
            <div className="hero-card-image-wrap">
              <img
                src={featuredFood.image}
                alt={featuredFood.name}
              />
              <span className="hero-canteen-pill">Main Canteen · ⚡ 10–15 min</span>
            </div>
            <div className="hero-card-content">
              <div>
                <h3>{featuredFood.name}</h3>
                <p>Freshly prepared daily with choice ingredients.</p>
              </div>
              <div className="hero-card-footer">
                <strong>Rs. {featuredFood.price}</strong>
                <Link to="/canteens/1/menu" className="btn btn-primary btn-sm">
                  Order Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Canteens Section */}
      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Campus Dining Halls</span>
            <h2>Select a Canteen</h2>
            <p>Order directly from your nearest dining location.</p>
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
                <p>📍 {canteen.location}</p>
                <div className="meta-row">
                  <span>🕒 {canteen.openingTime || '07:30'} – {canteen.closingTime || '18:00'}</span>
                  <span className="text-link">Menu →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works - Minimal 3-step grid */}
      <section className="section section-soft">
        <div className="container">
          <div className="section-heading center">
            <div>
              <span className="eyebrow">Fast & Simple</span>
              <h2>How CampusBite Works</h2>
            </div>
          </div>
          <div className="steps-clean">
            <div className="step-card-clean">
              <span className="step-number">01</span>
              <h3>Choose Meal</h3>
              <p>Explore canteen menus across campus and select your favorite dish.</p>
            </div>
            <div className="step-card-clean">
              <span className="step-number">02</span>
              <h3>Pre-Order & Set Time</h3>
              <p>Select your desired pickup window between lectures.</p>
            </div>
            <div className="step-card-clean">
              <span className="step-number">03</span>
              <h3>Express Counter Pickup</h3>
              <p>Collect your hot meal at the counter without waiting in line.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
