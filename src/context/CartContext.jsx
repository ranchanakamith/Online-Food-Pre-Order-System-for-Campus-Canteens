import { createContext, useContext, useEffect, useState } from 'react'
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
    const targetCanteenName = canteen?.name || 'Main Canteen'
    const targetCanteen = canteens.find((entry) => Number(entry.id) === targetCanteenId)
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
    const currentCanteenId = Number(cart[0]?.canteenId)
    const sameCanteen = cart.length > 0 && currentCanteenId === targetCanteenId
    const existingQuantity = sameCanteen
      ? cart.filter((item) => Number(item.id) === Number(food.id)).reduce((sum, item) => sum + Number(item.quantity || 0), 0)
      : 0
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
    if (!sameCanteen) {
      if (cart.length > 0) showToast('Previous items were cleared because orders must come from one canteen.', 'info')
      setCart([item])
    } else {
      const existing = cart.find((entry) => Number(entry.id) === Number(food.id))
      setCart(existing
        ? cart.map((entry) => Number(entry.id) === Number(food.id)
            ? { ...entry, quantity: Number(entry.quantity) + requested, price: inventory.price }
            : entry)
        : [...cart, item])
    }
    showToast('Added ' + food.name + ' to ' + targetCanteenName + ' cart!')
  }

  const updateQuantity = (itemId, newQty) => {
    const item = cart.find((entry) => Number(entry.id) === Number(itemId))
    if (!item) return
    if (newQty <= 0) {
      removeFromCart(itemId)
      return
    }
    const food = foods.find((entry) => Number(entry.id) === Number(itemId))
    const inventory = getFoodInventory(food, item.canteenId)
    if (newQty > inventory.prepared - inventory.sold - inventory.reserved) {
      showToast('There is not enough stock for ' + item.name + '.', 'error')
      return
    }
    setCart((previous) => previous.map((entry) =>
      Number(entry.id) === Number(itemId) ? { ...entry, quantity: newQty, price: inventory.price } : entry
    ))
  }

  const removeFromCart = (itemId) => {
    const item = cart.find((entry) => Number(entry.id) === Number(itemId))
    setCart((previous) => previous.filter((entry) => Number(entry.id) !== Number(itemId)))
    if (item) showToast('Removed ' + item.name + ' from cart', 'info')
  }

  const updateItemInstructions = (itemId, instructions) => {
    setCart((previous) => previous.map((item) =>
      Number(item.id) === Number(itemId) ? { ...item, instructions } : item
    ))
  }

  const changeCartCanteen = (newCanteenId, newCanteenName, newPrices = {}) => {
    setCart((previous) => previous.map((item) => ({
      ...item,
      canteenId: Number(newCanteenId),
      canteenName: newCanteenName,
      price: newPrices[item.id] ?? item.price,
    })))
    showToast('Order assigned to ' + newCanteenName, 'info')
  }

  const clearCart = () => setCart([])

  const activeCartCanteen = cart.length > 0
    ? { id: Number(cart[0].canteenId), name: cart[0].canteenName }
    : null
  const totalItems = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0)
  const serviceFee = 0
  const total = subtotal + serviceFee

  return (
    <CartContext.Provider value={{
      cart, activeCartCanteen, addToCart, updateQuantity, removeFromCart,
      updateItemInstructions, changeCartCanteen, clearCart,
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
