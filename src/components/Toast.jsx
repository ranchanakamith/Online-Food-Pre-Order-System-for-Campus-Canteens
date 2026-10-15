import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Toast() {
  const { toast, hideToast } = useCart()

  if (!toast) return null

  return (
    <div className={`toast-notification ${toast.type || 'success'}`}>
      <div className="toast-icon">✓</div>
      <div className="toast-body">
        <span>{toast.message}</span>
        {toast.type !== 'info' && (
          <Link to="/cart" className="toast-link" onClick={hideToast}>
            View Cart →
          </Link>
        )}
      </div>
      <button
        type="button"
        className="toast-close"
        onClick={hideToast}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  )
}
