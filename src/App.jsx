import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FoodProvider } from './context/FoodContext'
import { OrderProvider } from './context/OrderContext'
import { CartProvider } from './context/CartContext'
import RequireRole from './components/RequireRole'
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
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/student" element={<RequireRole allowedRoles={['student']}><StudentDashboard /></RequireRole>} />
                  <Route path="/canteens" element={<Canteens />} />
                  <Route path="/canteens/:id/menu" element={<Menu />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/orders" element={<RequireRole allowedRoles={['student']}><Orders /></RequireRole>} />
                  <Route path="/worker" element={<RequireRole allowedRoles={['worker']}><WorkerDashboard /></RequireRole>} />
                  <Route path="/staff" element={<RequireRole allowedRoles={['worker']}><WorkerDashboard /></RequireRole>} />
                  <Route path="/admin" element={<RequireRole allowedRoles={['admin']}><AdminDashboard /></RequireRole>} />
                  <Route path="*" element={<Navigate to="/home" replace />} />
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
