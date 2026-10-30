import { createContext, useContext, useEffect, useState } from 'react'
import { initialCanteens, initialFoods } from '../data/mockData'
import { MENU_VERSION_KEY, MENU_VERSION, migrateSavedMenu, migrateSavedCanteens, hasSharedPhoto } from '../data/menuCatalog'

const FoodContext = createContext()

function inventoryFromFood(food) {
  return {
    price: Math.max(0, Number(food.price) || 0),
    target: Math.max(0, Number(food.target) || 0),
    prepared: Math.max(0, Number(food.prepared) || 0),
    sold: Math.max(0, Number(food.sold) || 0),
    reserved: Math.max(0, Number(food.reserved) || 0),
    enabled: food.enabled !== false,
  }
}

function normalizeFood(food) {
  const ids = Array.isArray(food.canteenIds) && food.canteenIds.length
    ? food.canteenIds.map(Number)
    : [1]
  const inventoryByCanteen = { ...(food.inventoryByCanteen || {}) }
  ids.forEach((id) => {
    if (!inventoryByCanteen[String(id)]) inventoryByCanteen[String(id)] = inventoryFromFood(food)
    else inventoryByCanteen[String(id)] = { ...inventoryFromFood(food), ...inventoryByCanteen[String(id)] }
  })
  return { ...food, canteenIds: ids, inventoryByCanteen }
}

export function getFoodInventory(food, canteenId) {
  if (!food) return { price: 0, target: 0, prepared: 0, sold: 0, reserved: 0, enabled: false }
  const normalized = normalizeFood(food)
  return normalized.inventoryByCanteen[String(Number(canteenId))] || inventoryFromFood(food)
}

export function FoodProvider({ children }) {
  const [canteens, setCanteens] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('campusbite_canteens') || 'null')
      if (Array.isArray(saved)) return migrateSavedCanteens(saved)
    } catch (error) {
      console.error(error)
    }
    return initialCanteens
  })

  const [foods, setFoods] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('campusbite_foods') || 'null')
      if (Array.isArray(saved)) return migrateSavedMenu(saved, localStorage.getItem(MENU_VERSION_KEY)).map(normalizeFood)
    } catch (error) {
      console.error(error)
    }
    return initialFoods.map(normalizeFood)
  })

  useEffect(() => {
    try { localStorage.setItem('campusbite_canteens', JSON.stringify(canteens)) }
    catch (error) { console.error(error) }
  }, [canteens])

  useEffect(() => {
    try {
      localStorage.setItem('campusbite_foods', JSON.stringify(foods))
      localStorage.setItem(MENU_VERSION_KEY, MENU_VERSION)
    }
    catch (error) { console.error(error) }
  }, [foods])

  const updateFoodStock = (id, field, value, canteenId) => {
    const targetId = Number(canteenId)
    setFoods((current) => current.map((rawFood) => {
      if (rawFood.id !== id) return rawFood
      const food = normalizeFood(rawFood)
      const currentInventory = getFoodInventory(food, targetId)
      if (field === 'enabled') {
        return {
          ...food,
          inventoryByCanteen: {
            ...food.inventoryByCanteen,
            [String(targetId)]: { ...currentInventory, enabled: Boolean(value) },
          },
        }
      }
      const numericValue = Math.max(0, Number(value) || 0)
      const updated = { ...currentInventory, [field]: numericValue }
      if (field === 'prepared') updated.prepared = Math.max(numericValue, currentInventory.sold + currentInventory.reserved)
      if (field === 'sold') updated.sold = Math.min(numericValue, currentInventory.prepared - currentInventory.reserved)
      return {
        ...food,
        inventoryByCanteen: {
          ...food.inventoryByCanteen,
          [String(targetId)]: updated,
        },
      }
    }))
  }

  const reserveFood = (items, canteenId) => {
    const targetId = Number(canteenId)
    const canteen = canteens.find((entry) => Number(entry.id) === targetId)
    if (!canteen || canteen.active === false) return { ok: false, error: 'This canteen is currently unavailable.' }

    const quantities = new Map()
    items.forEach((item) => quantities.set(Number(item.id), (quantities.get(Number(item.id)) || 0) + Math.max(0, Number(item.quantity) || 0)))
    for (const [foodId, quantity] of quantities) {
      const food = foods.find((entry) => Number(entry.id) === foodId)
      if (!food || !food.canteenIds.includes(targetId)) return { ok: false, error: 'One or more items are not on this canteen menu.' }
      const inventory = getFoodInventory(food, targetId)
      const available = inventory.prepared - inventory.sold - inventory.reserved
      if (!inventory.enabled || quantity <= 0 || quantity > available) return { ok: false, error: food.name + ' no longer has enough stock.' }
    }

    setFoods((current) => current.map((rawFood) => {
      const quantity = quantities.get(Number(rawFood.id)) || 0
      if (!quantity) return rawFood
      const food = normalizeFood(rawFood)
      const inventory = getFoodInventory(food, targetId)
      return {
        ...food,
        inventoryByCanteen: {
          ...food.inventoryByCanteen,
          [String(targetId)]: { ...inventory, reserved: inventory.reserved + quantity },
        },
      }
    }))
    return { ok: true }
  }

  const releaseFood = (items, canteenId, complete = false) => {
    const targetId = Number(canteenId)
    const quantities = new Map()
    items.forEach((item) => quantities.set(Number(item.id), (quantities.get(Number(item.id)) || 0) + Math.max(0, Number(item.quantity) || 0)))
    setFoods((current) => current.map((rawFood) => {
      const quantity = quantities.get(Number(rawFood.id)) || 0
      if (!quantity) return rawFood
      const food = normalizeFood(rawFood)
      const inventory = getFoodInventory(food, targetId)
      const released = Math.min(quantity, inventory.reserved)
      return {
        ...food,
        inventoryByCanteen: {
          ...food.inventoryByCanteen,
          [String(targetId)]: {
            ...inventory,
            reserved: inventory.reserved - released,
            sold: inventory.sold + (complete ? released : 0),
          },
        },
      }
    }))
  }

  const addCanteen = (canteenData) => {
    const newCanteen = {
      id: Date.now(),
      status: 'Open',
      active: true,
      eta: '10–15 min',
      image: canteenData.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      description: canteenData.description || 'Newly added campus canteen dining location.',
      ...canteenData,
    }
    setCanteens((current) => [...current, newCanteen])
    return newCanteen
  }

  const toggleCanteen = (id) => {
    setCanteens((current) => current.map((canteen) => canteen.id === id
      ? { ...canteen, active: !canteen.active, status: canteen.active ? 'Closed' : 'Open' }
      : canteen))
  }

  const removeCanteen = (id) => setCanteens((current) => current.filter((canteen) => canteen.id !== id))

  const addFood = (foodData) => {
    const canteenIds = (foodData.canteenIds?.length ? foodData.canteenIds : [1]).map(Number)
    const base = {
      id: Date.now(),
      name: foodData.name || 'New Meal Item',
      price: Math.max(0, Number(foodData.price) || 100),
      target: Math.max(0, Number(foodData.target) || 30),
      prepared: Math.max(0, Number(foodData.prepared) || 0),
      sold: 0,
      enabled: true,
      category: foodData.category || 'Lunch',
      description: foodData.description || 'Freshly prepared campus canteen meal.',
      tag: foodData.tag || 'Fresh',
      canteenIds,
      image: foodData.image?.trim()
        ? foodData.image
        : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
      imagePosition: foodData.imagePosition || 'center',
      catalogPhotoId: foodData.catalogPhotoId,
      catalogImage: foodData.catalogImage,
    }
    const newFood = normalizeFood(base)
    if (canteenIds.length > 1) {
      return { error: 'Add this item to one canteen at a time, with a different photo for each canteen.' }
    }
    if (hasSharedPhoto(foods, newFood)) {
      return { error: 'Another canteen already uses this photo for that item. Choose a different photo for your canteen.' }
    }
    setFoods((current) => [newFood, ...current])
    return newFood
  }

  const removeFood = (id) => setFoods((current) => current.filter((food) => food.id !== id))

  return (
    <FoodContext.Provider value={{ canteens, foods, updateFoodStock, reserveFood, releaseFood, addCanteen, toggleCanteen, removeCanteen, addFood, removeFood }}>
      {children}
    </FoodContext.Provider>
  )
}

export function useFood() {
  const context = useContext(FoodContext)
  if (!context) throw new Error('useFood must be used within a FoodProvider')
  return context
}
