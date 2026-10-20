import { createContext, useContext, useState, useEffect } from 'react'

const OrderContext = createContext()

const initialSeedOrders = [
  {
    id: 'CB1023',
    student: 'IT20231234',
    canteen: 'Main Canteen',
    canteenId: 1,
    itemsSummary: 'Chicken Fried Rice ×1, Iced Coffee Deluxe ×2',
    items: [
      { id: 1, name: 'Chicken Fried Rice', price: 650, quantity: 1 },
      { id: 8, name: 'Iced Coffee Deluxe', price: 300, quantity: 2 },
    ],
    total: 1250,
    pickup: '12:30 PM',
    orderType: 'Takeaway',
    paymentMethod: 'Pay at Counter',
    status: 'PREPARING',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 'CB1024',
    student: 'IT20231456',
    canteen: 'Main Canteen',
    canteenId: 1,
    itemsSummary: 'Chicken Kottu ×2',
    items: [
      { id: 2, name: 'Chicken Kottu', price: 700, quantity: 2 },
    ],
    total: 1400,
    pickup: '12:45 PM',
    orderType: 'Dine-in',
    paymentMethod: 'Student ID Card',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 'CB1025',
    student: 'IT20231502',
    canteen: 'Engineering Canteen',
    canteenId: 2,
    itemsSummary: 'Veggie Club Sandwich ×1, Fresh Lime Cooler ×1',
    items: [
      { id: 4, name: 'Veggie Club Sandwich', price: 350, quantity: 1 },
      { id: 9, name: 'Fresh Lime & Mint Cooler', price: 250, quantity: 1 },
    ],
    total: 600,
    pickup: '1:00 PM',
    orderType: 'Takeaway',
    paymentMethod: 'Pay at Counter',
    status: 'READY',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: 'CB1026',
    student: 'IT20231678',
    canteen: 'Student Centre Cafe',
    canteenId: 3,
    itemsSummary: 'Crispy Chicken Burger ×1, Chocolate Lava Muffin ×1',
    items: [
      { id: 5, name: 'Crispy Chicken Burger', price: 550, quantity: 1 },
      { id: 10, name: 'Chocolate Lava Muffin', price: 280, quantity: 1 },
    ],
    total: 830,
    pickup: '1:15 PM',
    orderType: 'Takeaway',
    paymentMethod: 'Online Payment',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
]

export const statusSequence = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED']

export const statusLabels = {
  PENDING: { label: 'Pending', step: 1, badgeClass: 'badge-warn', nextAction: 'Accept Order' },
  ACCEPTED: { label: 'Accepted', step: 2, badgeClass: 'badge', nextAction: 'Start Preparing' },
  PREPARING: { label: 'Preparing', step: 3, badgeClass: 'badge', nextAction: 'Mark Ready' },
  READY: { label: 'Ready for Pickup', step: 4, badgeClass: 'badge-ready', nextAction: 'Complete Order' },
  COMPLETED: { label: 'Completed', step: 5, badgeClass: 'badge-done', nextAction: 'Finished' },
  CANCELLED: { label: 'Cancelled', step: 0, badgeClass: 'badge-danger', nextAction: null },
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('campusbite_orders')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Ensure canteenId is always a number for every saved order
        return parsed.map((o) => ({
          ...o,
          canteenId: Number(o.canteenId || (o.canteen?.includes('Engineering') ? 2 : o.canteen?.includes('Cafe') ? 3 : 1)),
        }))
      }
    } catch (e) {
      console.error(e)
    }
    return initialSeedOrders
  })

  useEffect(() => {
    try {
      localStorage.setItem('campusbite_orders', JSON.stringify(orders))
    } catch (e) {
      console.error(e)
    }
  }, [orders])

  const placeOrder = ({ items, canteen, pickupTime, paymentMethod, orderType, notes, studentId }) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const newOrderId = `CB${randomSuffix}`

    const itemsSummary = items
      .map((item) => `${item.name} ×${item.quantity}`)
      .join(', ')

    const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)

    // Strict numerical Canteen ID resolution
    const orderCanteenId = Number(
      canteen?.id !== undefined
        ? canteen.id
        : items[0]?.canteenId !== undefined
        ? items[0].canteenId
        : 1
    )

    const orderCanteenName =
      canteen?.name ||
      items[0]?.canteenName ||
      (orderCanteenId === 2
        ? 'Engineering Canteen'
        : orderCanteenId === 3
        ? 'Student Centre Cafe'
        : 'Main Canteen')

    const newOrder = {
      id: newOrderId,
      student: studentId || 'IT20231234',
      canteen: orderCanteenName,
      canteenId: orderCanteenId,
      itemsSummary,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: Number(i.price),
        quantity: i.quantity,
        instructions: i.instructions || '',
      })),
      total,
      pickup: pickupTime || '12:30 PM',
      orderType: orderType || 'Takeaway',
      paymentMethod: paymentMethod || 'Pay at Counter',
      notes: notes || '',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    }

    setOrders((current) => [newOrder, ...current])
    return newOrder
  }

  const advanceOrderStatus = (orderId) => {
    setOrders((current) =>
      current.map((order) => {
        if (order.id !== orderId || order.status === 'COMPLETED' || order.status === 'CANCELLED') {
          return order
        }
        const currentIndex = statusSequence.indexOf(order.status)
        if (currentIndex === -1 || currentIndex === statusSequence.length - 1) return order
        return { ...order, status: statusSequence[currentIndex + 1] }
      })
    )
  }

  const cancelOrder = (orderId) => {
    setOrders((current) =>
      current.map((order) => {
        if (order.id !== orderId) return order
        return { ...order, status: 'CANCELLED' }
      })
    )
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        advanceOrderStatus,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider')
  }
  return context
}
