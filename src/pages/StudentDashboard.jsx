import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useFood } from '../context/FoodContext'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function StudentDashboard() {
  const { canteens, foods } = useFood()
  const { cart, addToCart, updateQuantity, totalItems } = useCart()
  const { currentUser } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

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
    if (!searchTerm.trim()) return foods.slice(0, 6)
    const q = searchTerm.toLowerCase()
    return foods.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    )
  }, [foods, searchTerm])

  const cartItemMap = useMemo(() => {
    const map = {}
    cart.forEach((item) => {
      map[item.id] = item.quantity
    })
    return map
  }, [cart])

  return (
    <section className="section container page-top">
      <div className="student-welcome">
        <div>
          <span className="eyebrow">Student Dashboard</span>
          <h1>Welcome, {currentUser?.name || 'Student'}!</h1>
          <p>
            Choose a canteen, pre-order your favorite meals, and pick them up hot
            and fresh without waiting in long queues.
          </p>
        </div>
        <div className="student-top-actions">
          <Link to="/orders" className="btn btn-secondary">
            📦 Track Orders
          </Link>
          <Link to="/cart" className="btn btn-primary">
            🛒 Cart ({totalItems})
          </Link>
        </div>
      </div>

      <div className="search-bar dashboard-search">
        <input
          type="text"
          placeholder="Search foods, drinks, or campus canteens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm ? (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setSearchTerm('')}
          >
            Clear
          </button>
        ) : (
          <button type="button" className="btn btn-primary">
            Search
          </button>
        )}
      </div>

      <div className="section-heading compact">
        <div>
          <span className="eyebrow">Campus Dining Locations</span>
          <h2>Canteens ({filteredCanteens.length})</h2>
        </div>
        <Link to="/canteens" className="text-link">
          View all canteens →
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
                <p>{canteen.location}</p>
                <div className="meta-row">
                  <span>Hours: {canteen.openingTime || '07:30'}–{canteen.closingTime || '18:00'}</span>
                  <span className="text-link">Explore Menu →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="section-heading compact top-gap">
        <div>
          <span className="eyebrow">Chef Recommendations</span>
          <h2>{searchTerm ? 'Matching Meals' : 'Popular meals today'}</h2>
        </div>
      </div>

      {filteredFoods.length === 0 ? (
        <div className="panel empty-search-panel">
          <p>No meals matching "{searchTerm}".</p>
        </div>
      ) : (
        <div className="card-grid two">
          {filteredFoods.map((food) => {
            const currentQty = cartItemMap[food.id] || 0
            const availableStock = Math.max(food.prepared - food.sold, 0)
            const isAvailable = food.enabled !== false && availableStock > 0
            const foodCanteen = canteens.find((c) => food.canteenIds?.includes(c.id)) || canteens[0]

            return (
              <article className="food-card" key={food.id}>
                <div className="food-image-wrapper">
                  <img src={food.image} alt={food.name} loading="lazy" />
                  {food.tag && <span className="food-tag-badge">{food.tag}</span>}
                  {!isAvailable && <span className="food-sold-out-overlay">Sold Out</span>}
                </div>

                <div className="food-card-body">
                  <div className="food-card-meta">
                    <span className="small-label">{food.category}</span>
                    <span className="food-canteen-source-tag">📍 {foodCanteen.name}</span>
                    <span className="stock-pill in-stock">{availableStock} available</span>
                  </div>
                  <h3>{food.name}</h3>
                  <p>{food.description}</p>

                  <div className="card-row food-bottom">
                    <strong>Rs. {food.price}</strong>

                    {!isAvailable ? (
                      <button className="btn btn-secondary" disabled>
                        Sold Out
                      </button>
                    ) : currentQty > 0 ? (
                      <div className="card-qty-control">
                        <button
                          type="button"
                          className="qty-btn small"
                          onClick={() => updateQuantity(food.id, currentQty - 1)}
                        >
                          −
                        </button>
                        <span className="qty-number-label">{currentQty} in cart</span>
                        <button
                          type="button"
                          className="qty-btn small"
                          onClick={() => updateQuantity(food.id, currentQty + 1)}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary add-cart-btn"
                        onClick={() => addToCart(food, foodCanteen)}
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
