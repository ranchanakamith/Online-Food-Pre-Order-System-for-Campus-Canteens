import { Link } from 'react-router-dom'
import { canteens, foods } from '../data/mockData'

export default function StudentDashboard() {
  return (
    <section className="section container page-top">
      <div className="student-welcome">
        <div>
          <span className="eyebrow">Student Dashboard</span>
          <h1>What would you like to eat today?</h1>
          <p>Choose a canteen, pre-order your meal and collect it without waiting in line.</p>
        </div>
        <Link to="/orders" className="btn btn-secondary">Track My Orders</Link>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search food or canteen..." />
        <button className="btn btn-primary">Search</button>
      </div>

      <div className="section-heading compact">
        <div>
          <span className="eyebrow">Available now</span>
          <h2>Canteens</h2>
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
                <span>{canteen.eta}</span>
                <span>View menu →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="section-heading compact top-gap">
        <div>
          <span className="eyebrow">Popular today</span>
          <h2>Popular meals</h2>
        </div>
      </div>

      <div className="card-grid two">
        {foods.slice(0, 4).map((food) => (
          <article className="food-card" key={food.id}>
            <img src={food.image} alt={food.name} />
            <div className="food-card-body">
              <span className="small-label">{food.category}</span>
              <h3>{food.name}</h3>
              <p>{food.description}</p>
              <div className="card-row food-bottom">
                <strong>Rs. {food.price}</strong>
                <button className="btn btn-primary">Add to Cart</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
