import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { canteens, foods } from '../data/mockData'

export default function Menu() {
  const { id } = useParams()
  const canteen = canteens.find((item) => item.id === Number(id)) || canteens[0]
  const [category, setCategory] = useState('All')
  const categories = ['All', 'Lunch', 'Snacks', 'Drinks']

  const filteredFoods = useMemo(() => {
    return category === 'All' ? foods : foods.filter((food) => food.category === category)
  }, [category])

  return (
    <section className="section container page-top">
      <div className="menu-hero">
        <div>
          <span className="eyebrow">Open now</span>
          <h1>{canteen.name}</h1>
          <p>{canteen.location} · Pickup in {canteen.eta}</p>
        </div>
        <Link to="/cart" className="btn btn-primary">View Cart · Rs. 0</Link>
      </div>

      <div className="category-tabs">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? 'active' : ''}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="card-grid two">
        {filteredFoods.map((food) => (
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
