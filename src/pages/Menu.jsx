import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFood, getFoodInventory } from '../context/FoodContext'
import { useCart } from '../context/CartContext'

export default function Menu() {
  const { id } = useParams()
  const { canteens, foods } = useFood()
  const { cart, addToCart, updateQuantity, total, totalItems } = useCart()

  const canteen = useMemo(() => {
    return canteens.find((item) => item.id === Number(id)) || canteens[0] || {}
  }, [canteens, id])

  const [category, setCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const categories = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Drinks']

  // Filter foods for this canteen and category/search
  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      // Must belong to this canteen (or have canteenIds including this id, or default to all if empty)
      const matchesCanteen =
        !food.canteenIds || food.canteenIds.length === 0 || food.canteenIds.includes(canteen.id)

      const matchesCategory = category === 'All' || food.category === category

      const matchesSearch =
        searchQuery.trim() === '' ||
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.description.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCanteen && matchesCategory && matchesSearch
    })
  }, [foods, canteen.id, category, searchQuery])

  // Map cart items by food ID for quick quantity lookup
  const cartItemMap = useMemo(() => {
    const map = {}
    if (cart[0] && Number(cart[0].canteenId) === Number(canteen.id)) {
      cart.forEach((item) => { map[item.id] = item.quantity })
    }
    return map
  }, [cart, canteen.id])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const foodListEl = document.getElementById('menu-items-grid')
    if (foodListEl) {
      foodListEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="section container page-top">
      <div className="breadcrumb-nav">
        <Link to="/student">Home</Link>
        <span>/</span>
        <Link to="/canteens">Canteens</Link>
        <span>/</span>
        <strong>{canteen.name || 'Canteen Menu'}</strong>
      </div>

      <div className="menu-hero">
        <div className="menu-hero-info">
          <div className="menu-hero-status-row">
            <span className={`status-badge ${canteen.status === 'Open' ? 'status-open' : 'status-disabled'}`}>
              ● {canteen.status || 'Open'}
            </span>
            <span className="opening-hours-tag">
              🕒 {canteen.openingTime || '07:30'} – {canteen.closingTime || '18:00'}
            </span>
          </div>
          <h1>{canteen.name}</h1>
          <p className="canteen-location-text">
            📍 {canteen.location} · ⚡ Estimated Pickup in {canteen.eta}
          </p>
          {canteen.description && <p className="canteen-desc">{canteen.description}</p>}
        </div>

        <div className="menu-hero-action">
          <Link to="/cart" className="btn btn-primary view-cart-pill">
            <span>🛒 View Cart</span>
            <strong>Rs. {total.toLocaleString()}</strong>
            {totalItems > 0 && <span className="cart-pill-count">{totalItems}</span>}
          </Link>
        </div>
      </div>

      <div className="menu-controls-row">
        <div className="category-tabs">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? 'active' : ''}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="menu-search-form">
          <div className="search-input-wrapper">
            <span className="search-input-icon">🔍</span>
            <input
              type="text"
              placeholder="Search items (e.g. rice, juice)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
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
      </div>

      {filteredFoods.length === 0 ? (
        <div className="panel empty-menu-card">
          <h3>No meals found</h3>
          <p>We couldn't find any items matching "{searchQuery}" in this category.</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setCategory('All')
              setSearchQuery('')
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div id="menu-items-grid" className="card-grid two">
          {filteredFoods.map((food) => {
            const inventory = getFoodInventory(food, canteen.id)
            const availableStock = Math.max(inventory.prepared - inventory.sold - inventory.reserved, 0)
            const isAvailable = canteen.active !== false && inventory.enabled && availableStock > 0
            const currentQtyInCart = cartItemMap[food.id] || 0

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
                    {isAvailable ? (
                      <span className="stock-pill in-stock">{availableStock} available</span>
                    ) : (
                      <span className="stock-pill out-of-stock">Sold Out</span>
                    )}
                  </div>

                  <h3>{food.name}</h3>
                  <p>{food.description}</p>

                  <div className="card-row food-bottom">
                    <strong className="food-price-text">Rs. {inventory.price}</strong>

                    {!isAvailable ? (
                      <button className="btn btn-secondary" disabled>
                        Sold Out
                      </button>
                    ) : currentQtyInCart > 0 ? (
                      <div className="card-qty-control">
                        <button
                          type="button"
                          className="qty-btn small"
                          onClick={() => updateQuantity(food.id, currentQtyInCart - 1)}
                          title="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="qty-number-label">{currentQtyInCart} in cart</span>
                        <button
                          type="button"
                          className="qty-btn small"
                          onClick={() => updateQuantity(food.id, currentQtyInCart + 1)}
                          disabled={currentQtyInCart >= availableStock}
                          title="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary add-cart-btn"
                        onClick={() => addToCart({ ...food, price: inventory.price }, canteen)}
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
