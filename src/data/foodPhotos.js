// Approved menu photos. Attribution and licenses: /food-photo-credits.html
import photo1 from '../assets/food/chicken-fried-rice.jpg'
import photo2 from '../assets/food/chicken-kottu.jpg'
import photo3 from '../assets/food/sri-lankan-rice-curry.jpg'
import photo4 from '../assets/food/veggie-club-sandwich.jpg'
import photo5 from '../assets/food/crispy-chicken-burger.jpg'
import photo6 from '../assets/food/egg-vegetable-roti-roll.jpg'
import photo7 from '../assets/food/string-hoppers-breakfast-set.jpg'
import photo8 from '../assets/food/iced-coffee-deluxe.jpg'
import photo9 from '../assets/food/fresh-lime-mint-cooler.jpg'
import photo10 from '../assets/food/chocolate-lava-muffin.jpg'

import photo11 from '../assets/food/egg-hoppers.jpg'
import photo12 from '../assets/food/coconut-roti.jpg'
import photo13 from '../assets/food/chicken-noodles.jpg'
import photo14 from '../assets/food/fish-cutlets.jpg'
import photo15 from '../assets/food/vegetable-samosa.jpg'
import photo16 from '../assets/food/creamy-cheese-pasta.jpg'
import photo17 from '../assets/food/fresh-fruit-salad.jpg'
import photo18 from '../assets/food/chocolate-milkshake.jpg'

export const foodPhotos = {
  1: { name: "Chicken Fried Rice", image: photo1, position: "center", previousImage: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=80" },
  2: { name: "Chicken Kottu", image: photo2, position: "center", previousImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=80" },
  3: { name: "Sri Lankan Rice & Curry", image: photo3, position: "center 55%", previousImage: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80" },
  4: { name: "Veggie Club Sandwich", image: photo4, position: "center 72%", previousImage: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1000&q=80" },
  5: { name: "Crispy Chicken Burger", image: photo5, position: "center", previousImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80" },
  6: { name: "Egg & Vegetable Roti Roll", image: photo6, position: "center", previousImage: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1000&q=80" },
  7: { name: "String Hoppers Breakfast Set", image: photo7, position: "center", previousImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=80" },
  8: { name: "Iced Coffee Deluxe", image: photo8, position: "center", previousImage: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1000&q=80" },
  9: { name: "Fresh Lime & Mint Cooler", image: photo9, position: "center", previousImage: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80" },
  10: { name: "Chocolate Lava Muffin", image: photo10, position: "center", previousImage: "https://images.unsplash.com/photo-1607958996333-41aef7caef4b?auto=format&fit=crop&w=1000&q=80" },
  11: { name: "Egg Hoppers", image: photo11, position: "center" },
  12: { name: "Coconut Roti", image: photo12, position: "center 78%" },
  13: { name: "Chicken Noodles", image: photo13, position: "center" },
  14: { name: "Fish Cutlets", image: photo14, position: "center" },
  15: { name: "Vegetable Samosa", image: photo15, position: "center" },
  16: { name: "Creamy Cheese Pasta", image: photo16, position: "center 82%" },
  17: { name: "Fresh Fruit Salad", image: photo17, position: "center" },
  18: { name: "Chocolate Milkshake", image: photo18, position: "center" },
}

// Upgrade only the original catalog photos. Stock, prices, notes and custom
// photos stay intact. catalogImage rebases managed URLs after a new Vite build.
export function applyFoodPhoto(food) {
  const presetPhoto = foodPhotos[Number(food.catalogPhotoId)]
  const seedPhoto = foodPhotos[Number(food.id)]
  const photo = presetPhoto || (seedPhoto?.name === food.name ? seedPhoto : null)
  if (!photo) return food
  const isCatalogPhoto = !food.image || food.image === photo.previousImage ||
    food.image === photo.image || food.image === food.catalogImage
  if (!isCatalogPhoto) return food
  return { ...food, image: photo.image, imagePosition: photo.position, catalogImage: photo.image }
}
