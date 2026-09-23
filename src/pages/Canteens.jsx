import { Link } from 'react-router-dom'
import { canteens } from '../data/mockData'

export default function Canteens() {
  return (
    <section className="section container page-top">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Campus dining</span>
          <h1>Choose a canteen</h1>
          <p>See what is open and order before you arrive.</p>
        </div>
      </div>

      <div className="search-bar">
        <input placeholder="Search canteens..." />
        <button className="btn btn-primary">Search</button>
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
                <span>View Menu →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
