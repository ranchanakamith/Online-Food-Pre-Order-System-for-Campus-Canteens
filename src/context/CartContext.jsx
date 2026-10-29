import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useFood, getFoodInventory } from './FoodContext'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { foods, canteens } = useFood()
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('campusbite_cart') || '[]')
      return Array.isArray(saved) ? saved : []
    } catch (error) {
      console.error(error)
      return []
    }
  })
  const [toast, setToast] = useState(null)
  const cartRef = useRef(cart)

  // Read the latest cart even when several items are added in one event (reorder).
  const updateCart = (update) => {
    const next = update(cartRef.current)
    cartRef.current = next
    setCart(next)
  }

  const matchesItem = (item, itemId, canteenId) =>
    Number(item.id) === Number(itemId) && Number(item.canteenId) === Number(canteenId)

  useEffect(() => {
    try { localStorage.setItem('campusbite_cart', JSON.stringify(cart)) }
    catch (error) { console.error(error) }
  }, [cart])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    window.setTimeout(() => setToast(null), 3500)
  }

  const addToCart = (food, canteen = null, qty = 1) => {
    const targetCanteenId = canteen
      ? Number(canteen.id)
      : Number(food.canteenIds?.[0] || 1)
    const targetCanteen = canteens.find((entry) => Number(entry.id) === targetCanteenId)
    const targetCanteenName = targetCanteen?.name || canteen?.name
    const menuFood = foods.find((entry) => Number(entry.id) === Number(food.id))
    if (!targetCanteen || targetCanteen.active === false) {
      showToast('This canteen is currently unavailable.', 'error')
      return
    }
    if (!menuFood || !menuFood.canteenIds.includes(targetCanteenId)) {
      showToast('This meal is not offered by that canteen.', 'error')
      return
    }

    const inventory = getFoodInventory(menuFood, targetCanteenId)
    const existingQuantity = cartRef.current
      .filter((item) => matchesItem(item, food.id, targetCanteenId))
      .reduce((sum, item) => sum + Number(item.quantity || 0), 0)
    const available = inventory.prepared - inventory.sold - inventory.reserved
    const requested = Math.max(1, Number(qty) || 1)
    if (!inventory.enabled || existingQuantity + requested > available) {
      showToast('There is not enough stock for ' + food.name + '.', 'error')
      return
    }

    const item = {
      id: food.id,
      name: food.name,
      price: inventory.price,
      category: food.category,
      image: food.image,
      canteenId: targetCanteenId,
      canteenName: targetCanteenName,
      quantity: requested,
      instructions: '',
    }
    updateCart((previous) => {
      const existing = previous.find((entry) => matchesItem(entry, food.id, targetCanteenId))
      return existing
        ? previous.map((entry) => matchesItem(entry, food.id, targetCanteenId)
            ? { ...entry, quantity: Number(entry.quantity) + requested, price: inventory.price }
            : entry)
        : [...previous, item]
    })
    showToast('Added ' + food.name + ' from ' + targetCanteenName + ' to your cart!')
  }

  const updateQuantity = (itemId, newQty, canteenId) => {
    const item = cartRef.current.find((entry) => matchesItem(entry, itemId, canteenId))
    if (!item) return
    if (newQty <= 0) {
      removeFromCart(itemId, canteenId)
      return
    }
    const food = foods.find((entry) => Number(entry.id) === Number(itemId))
    const inventory = getFoodInventory(food, item.canteenId)
    const canteen = canteens.find((entry) => Number(entry.id) === Number(canteenId))
    if (!canteen || canteen.active === false || !food?.canteenIds.includes(Number(canteenId)) || !inventory.enabled ||
        newQty > inventory.prepared - inventory.sold - inventory.reserved) {
      showToast('There is not enough stock for ' + item.name + '.', 'error')
      return
    }
    updateCart((previous) => previous.map((entry) =>
      matchesItem(entry, itemId, canteenId) ? { ...entry, quantity: newQty, price: inventory.price } : entry
    ))
  }

  const removeFromCart = (itemId, canteenId) => {
    const item = cartRef.current.find((entry) => matchesItem(entry, itemId, canteenId))
    updateCart((previous) => previous.filter((entry) => !matchesItem(entry, itemId, canteenId)))
    if (item) showToast('Removed ' + item.name + ' from cart', 'info')
  }

  const updateItemInstructions = (itemId, instructions, canteenId) => {
    updateCart((previous) => previous.map((item) =>
      matchesItem(item, itemId, canteenId) ? { ...item, instructions } : item
    ))
  }

  const clearCart = () => updateCart(() => [])
  const clearCanteenCart = (canteenId) => updateCart((previous) =>
    previous.filter((item) => Number(item.canteenId) !== Number(canteenId))
  )

  const activeCartCanteen = cart.length > 0 && cart.every((item) => Number(item.canteenId) === Number(cart[0].canteenId))
    ? { id: Number(cart[0].canteenId), name: cart[0].canteenName }
    : null
  const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0)
  const serviceFee = 0
  const total = subtotal + serviceFee

  return (
    <CartContext.Provider value={{
      cart, activeCartCanteen, addToCart, updateQuantity, removeFromCart,
      updateItemInstructions, clearCart, clearCanteenCart,
      totalItems, subtotal, serviceFee, total, toast, showToast,
      hideToast: () => setToast(null),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
