import { useState, useMemo, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useFood, getFoodInventory } from '../context/FoodContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function StudentDashboard() {
  const location = useLocation()
  const { canteens, foods } = useFood()
  const { cart, addToCart, updateQuantity, totalItems } = useCart()
  const { currentUser } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const categories = ['All', 'Lunch', 'Snacks', 'Drinks']

  const [searchTerm, setSearchTerm] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('search') || ''
  })

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('search')
    if (q !== null) {
      setSearchTerm(q)
    }
  }, [location.search])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const resultsEl = document.getElementById('search-food-results')
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const activeCanteens = useMemo(() => {
    return canteens.filter((c) => c.active !== false)
  }, [canteens])

  const filteredCanteens = useMemo(() => {
    if (!searchTerm.trim()) return activeCanteens
    const q = searchTerm.toLowerCase()
    return activeCanteens.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    )
  }, [activeCanteens, searchTerm])

  const filteredFoods = useMemo(() => {
    const q = searchTerm.toLowerCase().trim()
    return foods.filter((f) => {
      const matchesSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)

      const matchesCat =
        selectedCategory === 'All' || f.category === selectedCategory

      return matchesSearch && matchesCat
    })
  }, [foods, searchTerm, selectedCategory])

  const cartItemMap = useMemo(() => {
    const map = {}
    cart.forEach((item) => {
      map[`${Number(item.canteenId)}:${item.id}`] = item.quantity
    })
    return map
  }, [cart])

  return (
    <section className="section container page-top">
      {/* Clean Welcome Banner */}
      <div className="student-welcome-clean">
        <div>
          <span className="eyebrow">Student Dining Portal</span>
          <h1>Hi, {currentUser?.name?.split(' ')[0] || 'Student'} 👋</h1>
          <p>What would you like to order today?</p>
        </div>
        <div className="student-top-actions">
          <Link to="/orders" className="btn btn-secondary btn-sm">
            📦 My Orders
          </Link>
          <Link to="/cart" className="btn btn-primary btn-sm">
            🛒 Cart ({totalItems})
          </Link>
        </div>
      </div>

      {/* Clean Search Bar */}
      <form onSubmit={handleSearchSubmit} className="search-bar dashboard-search">
        <div className="search-input-wrapper">
          <span className="search-input-icon">🔍</span>
          <input
            type="text"
            placeholder="Search meals, drinks, or canteens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
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

      {/* Canteens List */}
      <div className="section-heading compact">
        <div>
          <span className="eyebrow">Campus Dining</span>
          <h2>Canteens ({filteredCanteens.length})</h2>
        </div>
        <Link to="/canteens" className="text-link">
          View all →
        </Link>
      </div>

      {filteredCanteens.length === 0 ? (
        <div className="panel empty-search-panel">
          <p>No canteens matching "{searchTerm}".</p>
        </div>
      ) : (
        <div className="card-grid three">
          {filteredCanteens.map((canteen) => (
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
                  <span>🕒 {canteen.openingTime || '07:30'}–{canteen.closingTime || '18:00'}</span>
                  <span className="text-link">Menu →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Category Pills & Meals Section */}
      <div id="search-food-results" className="section-heading compact top-gap">
        <div>
          <span className="eyebrow">Daily Specials</span>
          <h2>
            {searchTerm
              ? `Results for "${searchTerm}" (${filteredFoods.length})`
              : 'Popular Meals Today'}
          </h2>
        </div>

        {/* Clean Category Filters */}
        <div className="category-tabs mini-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={selectedCategory === cat ? 'active' : ''}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredFoods.length === 0 ? (
        <div className="panel empty-search-panel">
          <p>No meals found matching your filter.</p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('All')
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="card-grid two">
          {filteredFoods.map((food) => {
            const foodCanteen = activeCanteens.find((canteen) => food.canteenIds?.includes(Number(canteen.id))) ||
              canteens.find((canteen) => food.canteenIds?.includes(Number(canteen.id)))
            const currentQty = cartItemMap[`${Number(foodCanteen?.id)}:${food.id}`] || 0
            const inventory = getFoodInventory(food, foodCanteen?.id)
            const availableStock = Math.max(inventory.prepared - inventory.sold - inventory.reserved, 0)
            const isAvailable = Boolean(foodCanteen) && foodCanteen.active !== false && inventory.enabled && availableStock > 0

            return (
              <article className="food-card" key={food.id}>
                <div className="food-image-wrapper">
                  <img src={food.image} alt={food.name} loading="lazy" style={{ objectPosition: food.imagePosition }} />
                  {!isAvailable && <span className="food-sold-out-overlay">Sold Out</span>}
                </div>

                <div className="food-card-body">
                  <div className="food-card-meta">
                    <span className="small-label">{food.category}</span>
                    <span className="food-canteen-source-tag">📍 {foodCanteen?.name || 'Canteen unavailable'}</span>
                  </div>
                  <h3>{food.name}</h3>
                  <p>{food.description}</p>

                  <div className="card-row food-bottom">
                    <strong>Rs. {inventory.price}</strong>

                    {!isAvailable ? (
                      <button className="btn btn-secondary btn-sm" disabled>
                        Sold Out
                      </button>
                    ) : currentQty > 0 ? (
                      <div className="card-qty-control">
                        <button
                          type="button"
                          className="qty-btn small"
                          onClick={() => updateQuantity(food.id, currentQty - 1, foodCanteen.id)}
                        >
                          −
                        </button>
                        <span className="qty-number-label">{currentQty} in cart</span>
                        <button
                          type="button"
                          className="qty-btn small"
                          onClick={() => updateQuantity(food.id, currentQty + 1, foodCanteen.id)}
                          disabled={currentQty >= availableStock}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm add-cart-btn"
                        aria-label={`Add ${food.name} from ${foodCanteen?.name} to cart`}
                        onClick={() => addToCart({ ...food, price: inventory.price }, foodCanteen)}
                      >
                        + Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
