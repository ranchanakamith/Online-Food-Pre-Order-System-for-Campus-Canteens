import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('campusbite_cart')
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.error(e)
    }
    // Pre-populate with 2 realistic items initially so cart is not empty on first load if user visits directly
    return [
      {
        id: 1,
        name: 'Chicken Fried Rice',
        price: 650,
        category: 'Lunch',
        canteenId: 1,
        canteenName: 'Main Canteen',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=80',
        quantity: 1,
        instructions: 'Less chili paste',
      },
      {
        id: 8,
        name: 'Iced Coffee Deluxe',
        price: 300,
        category: 'Drinks',
        canteenId: 1,
        canteenName: 'Main Canteen',
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1000&q=80',
        quantity: 2,
        instructions: '',
      },
    ]
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
    }, 3200)
  }

  const addToCart = (food, canteen = null, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === food.id)
      if (existing) {
        return prev.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        )
      }
      return [
        ...prev,
        {
          id: food.id,
          name: food.name,
          price: food.price,
          category: food.category,
          image: food.image,
          canteenId: canteen ? canteen.id : (food.canteenIds?.[0] || 1),
          canteenName: canteen ? canteen.name : 'Main Canteen',
          quantity: qty,
          instructions: '',
        },
      ]
    })
    showToast(`Added ${food.name} to cart!`)
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

  const clearCart = () => {
    setCart([])
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const serviceFee = 0
  const total = subtotal + serviceFee

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        updateItemInstructions,
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
