import { createContext, useContext, useState, useEffect } from 'react'
import { initialCanteens, initialFoods } from '../data/mockData'

const FoodContext = createContext()

export function FoodProvider({ children }) {
  const [canteens, setCanteens] = useState(() => {
    try {
      const saved = localStorage.getItem('campusbite_canteens')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error(e)
    }
    return initialCanteens
  })

  const [foods, setFoods] = useState(() => {
    try {
      const saved = localStorage.getItem('campusbite_foods')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error(e)
    }
    return initialFoods
  })

  useEffect(() => {
    try {
      localStorage.setItem('campusbite_canteens', JSON.stringify(canteens))
    } catch (e) {
      console.error(e)
    }
  }, [canteens])

  useEffect(() => {
    try {
      localStorage.setItem('campusbite_foods', JSON.stringify(foods))
    } catch (e) {
      console.error(e)
    }
  }, [foods])

  const updateFoodStock = (id, field, value) => {
    setFoods((current) =>
      current.map((food) => {
        if (food.id !== id) return food

        if (field === 'enabled') {
          return { ...food, enabled: value }
        }

        const numericValue = Math.max(0, Number(value) || 0)
        const updated = { ...food, [field]: numericValue }

        if (field === 'sold' && numericValue > updated.prepared) {
          updated.sold = updated.prepared
        }

        return updated
      })
    )
  }

  const addCanteen = (canteenData) => {
    const newCanteen = {
      id: Date.now(),
      status: 'Open',
      active: true,
      eta: '10–15 min',
      image:
        canteenData.image ||
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
      description: canteenData.description || 'Newly added campus canteen dining location.',
      ...canteenData,
    }
    setCanteens((current) => [...current, newCanteen])
    return newCanteen
  }

  const toggleCanteen = (id) => {
    setCanteens((current) =>
      current.map((c) =>
        c.id === id
          ? {
              ...c,
              active: !c.active,
              status: c.active ? 'Closed' : 'Open',
            }
          : c
      )
    )
  }

  const removeCanteen = (id) => {
    setCanteens((current) => current.filter((c) => c.id !== id))
  }

  const addFood = (foodData) => {
    const newFood = {
      id: Date.now(),
      name: foodData.name || 'New Meal Item',
      price: Math.max(0, Number(foodData.price) || 100),
      target: Math.max(0, Number(foodData.target) || 30),
      prepared: Math.max(0, Number(foodData.prepared) || 30),
      sold: 0,
      enabled: true,
      category: foodData.category || 'Lunch',
      description: foodData.description || 'Freshly prepared campus canteen meal.',
      tag: foodData.tag || 'Fresh',
      canteenIds: foodData.canteenIds && foodData.canteenIds.length > 0 ? foodData.canteenIds : [1],
      image:
        foodData.image && foodData.image.trim() !== ''
          ? foodData.image
          : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
    }
    setFoods((current) => [newFood, ...current])
    return newFood
  }

  const removeFood = (id) => {
    setFoods((current) => current.filter((f) => f.id !== id))
  }

  return (
    <FoodContext.Provider
      value={{
        canteens,
        foods,
        updateFoodStock,
        addCanteen,
        toggleCanteen,
        removeCanteen,
        addFood,
        removeFood,
      }}
    >
      {children}
    </FoodContext.Provider>
  )
}

export function useFood() {
  const context = useContext(FoodContext)
  if (!context) {
    throw new Error('useFood must be used within a FoodProvider')
  }
  return context
}
