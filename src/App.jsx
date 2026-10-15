import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FoodProvider } from './context/FoodContext'
import { OrderProvider } from './context/OrderContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toast from './components/Toast'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import StudentDashboard from './pages/StudentDashboard'
import Canteens from './pages/Canteens'
import Menu from './pages/Menu'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import WorkerDashboard from './pages/WorkerDashboard'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <AuthProvider>
      <FoodProvider>
        <OrderProvider>
          <CartProvider>
            <div className="app-shell">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/student" element={<StudentDashboard />} />
                  <Route path="/canteens" element={<Canteens />} />
                  <Route path="/canteens/:id/menu" element={<Menu />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/worker" element={<WorkerDashboard />} />
                  <Route path="/staff" element={<WorkerDashboard />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
              </main>
              <Footer />
              <Toast />
            </div>
          </CartProvider>
        </OrderProvider>
      </FoodProvider>
    </AuthProvider>
  )
}
