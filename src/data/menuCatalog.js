import { initialCanteens, initialFoods } from './mockData'
import { applyFoodPhoto } from './foodPhotos'

export const MENU_VERSION_KEY = 'campusbite_menu_version'
export const MENU_VERSION = 'canteen-menus-2026-10-30'

const previousCanteenDescriptions = {
  1: 'The central campus dining hall offering authentic Sri Lankan rice & curry, kottu, short eats, and hot drinks.',
  2: 'Popular among engineering students for quick savory snacks, fried rice, fresh fruit juices, and iced beverages.',
  3: 'Cozy campus cafe with toasted gourmet sandwiches, healthy rolls, espresso coffee, and fresh pastries.',
}

export function migrateSavedMenu(savedFoods, version) {
  const updated = savedFoods.map((food) => {
    const seed = initialFoods.find((entry) => Number(entry.id) === Number(food.id) && entry.name === food.name)
    const migrated = version !== MENU_VERSION && seed
      ? { ...food, canteenIds: [...seed.canteenIds] }
      : food
    // Keep all inventory snapshots, including kitchens fulfilling older orders.
    return applyFoodPhoto(migrated)
  })
  if (version !== MENU_VERSION) {
    const existingIds = new Set(updated.map((food) => Number(food.id)))
    initialFoods.filter((food) => food.id >= 11 && !existingIds.has(Number(food.id)))
      .forEach((food) => updated.push(food))
  }
  return updated
}

export function migrateSavedCanteens(savedCanteens) {
  return savedCanteens.map((canteen) => {
    const seed = initialCanteens.find((entry) => Number(entry.id) === Number(canteen.id) && entry.name === canteen.name)
    return seed && canteen.description === previousCanteenDescriptions[canteen.id]
      ? { ...canteen, description: seed.description }
      : canteen
  })
}

const normalizedName = (name) => String(name || '').trim().replace(/\s+/g, ' ').toLowerCase()

export function hasSharedPhoto(foods, newFood) {
  return foods.some((food) => {
    const sameName = normalizedName(food.name) === normalizedName(newFood.name)
    const otherCanteen = food.canteenIds.some((id) => !newFood.canteenIds.includes(Number(id)))
    const samePhoto = food.image === newFood.image ||
      (food.catalogPhotoId != null && Number(food.catalogPhotoId) === Number(newFood.catalogPhotoId))
    return sameName && otherCanteen && samePhoto
  })
}
