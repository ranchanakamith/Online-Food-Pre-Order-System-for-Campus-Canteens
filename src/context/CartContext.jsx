import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  // Start with empty cart so no previous canteen items contaminate orders
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('campusbite_cart')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error(e)
    }
    return []
  })

  const [toast, setToast] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem('campusbite_cart', JSON.stringify(cart))
    } catch (e) {
      console.error(e)
    }
  }, [cart])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3500)
  }

  const addToCart = (food, canteen = null, qty = 1) => {
    // Determine the exact target canteen for this item
    const targetCanteenId = canteen
      ? Number(canteen.id)
      : (food.canteenIds && food.canteenIds.length > 0 ? Number(food.canteenIds[0]) : 1)

    const targetCanteenName = canteen
      ? canteen.name
      : (targetCanteenId === 2 ? 'Engineering Canteen' : targetCanteenId === 3 ? 'Student Centre Cafe' : 'Main Canteen')

    setCart((prev) => {
      // 1. Single-Canteen Order Rule:
      // If cart already has items from a different canteen, clear previous items and start fresh for this canteen
      const existingCanteenId = prev[0]?.canteenId
      if (prev.length > 0 && existingCanteenId && Number(existingCanteenId) !== targetCanteenId) {
        showToast(
          `Switched to ${targetCanteenName}. Previous cart items from ${prev[0].canteenName} cleared.`,
          'info'
        )
        return [
          {
            id: food.id,
            name: food.name,
            price: Number(food.price),
            category: food.category,
            image: food.image,
            canteenId: targetCanteenId,
            canteenName: targetCanteenName,
            quantity: qty,
            instructions: '',
          },
        ]
      }

      // 2. Same Canteen: If item already exists, increment quantity
      const existing = prev.find((item) => item.id === food.id)
      if (existing) {
        return prev.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      }

      // 3. New item for this canteen
      return [
        ...prev,
        {
          id: food.id,
          name: food.name,
          price: Number(food.price),
          category: food.category,
          image: food.image,
          canteenId: targetCanteenId,
          canteenName: targetCanteenName,
          quantity: qty,
          instructions: '',
        },
      ]
    })

    showToast(`Added ${food.name} to ${targetCanteenName} cart!`)
  }

  const updateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQty } : item
      )
    )
  }

  const removeFromCart = (itemId) => {
    const item = cart.find((i) => i.id === itemId)
    setCart((prev) => prev.filter((i) => i.id !== itemId))
    if (item) {
      showToast(`Removed ${item.name} from cart`, 'info')
    }
  }

  const updateItemInstructions = (itemId, instructions) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, instructions } : item
      )
    )
  }

  const changeCartCanteen = (newCanteenId, newCanteenName) => {
    setCart((prev) =>
      prev.map((item) => ({
        ...item,
        canteenId: Number(newCanteenId),
        canteenName: newCanteenName,
      }))
    )
    showToast(`Order assigned to ${newCanteenName}`, 'info')
  }

  const clearCart = () => {
    setCart([])
  }

  const activeCartCanteen = cart.length > 0
    ? { id: Number(cart[0].canteenId), name: cart[0].canteenName }
    : null

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const serviceFee = 0
  const total = subtotal + serviceFee

  return (
    <CartContext.Provider
      value={{
        cart,
        activeCartCanteen,
        addToCart,
        updateQuantity,
        removeFromCart,
        updateItemInstructions,
        changeCartCanteen,
        clearCart,
        totalItems,
        subtotal,
        serviceFee,
        total,
        toast,
        hideToast: () => setToast(null),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
