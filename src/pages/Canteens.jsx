import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useFood } from '../context/FoodContext'

export default function Canteens() {
  const { canteens, foods } = useFood()
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

  const getFoodCountForCanteen = (canteenId) => {
    return foods.filter(
      (f) => !f.canteenIds || f.canteenIds.length === 0 || f.canteenIds.includes(canteenId)
    ).length
  }

  return (
    <section className="section container page-top">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Campus Dining</span>
          <h1>Campus Canteens ({activeCanteens.length})</h1>
          <p>Explore daily menus and pre-order fresh meals from campus dining halls.</p>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="search-bar">
        <div className="search-input-wrapper">
          <span className="search-input-icon">🔍</span>
          <input
            placeholder="Search by canteen name, location, or cuisine..."
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

      {filteredCanteens.length === 0 ? (
        <div className="panel empty-search-panel">
          <h3>No canteens found</h3>
          <p>We couldn't find any canteen matching "{searchTerm}".</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setSearchTerm('')}
          >
            Show All Canteens
          </button>
        </div>
      ) : (
        <div className="card-grid three">
          {filteredCanteens.map((canteen) => {
            const foodCount = getFoodCountForCanteen(canteen.id)

            return (
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
                  <p className="canteen-card-loc">📍 {canteen.location}</p>
                  <p className="canteen-card-desc">{canteen.description}</p>
                  <div className="meta-row">
                    <span className="food-count-tag">{foodCount} menu items</span>
                    <span className="text-link">View Menu →</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
