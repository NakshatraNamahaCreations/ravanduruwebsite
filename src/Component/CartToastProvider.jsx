// CartToastProvider.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
import './CartIcon.css'

const CartToastCtx = createContext(null);
export const useCartToast = () => useContext(CartToastCtx);

export default function CartToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showCartToast = useCallback((item) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [{ id, ...item }, ...prev]);
    // auto-dismiss after 3.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = (id) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <CartToastCtx.Provider value={{ showCartToast }}>
      {children}
      {/* Toast stack (top-right, just below navbar) */}
      <div className="cart-toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className="cart-toast slide-in">
            <div className="cart-toast-header">
              <span className="tick">✓</span>
              <span className="title">ADDED TO BAG</span>
              <button className="close" onClick={() => dismiss(t.id)}>×</button>
            </div>
            <div className="cart-toast-body">
              <img src={t.image} alt={t.name} className="thumb" />
              <div className="info">
                <div className="name">{t.name}</div>
                <div className="meta">
                  {t.size ? <>Size: {t.size} / </> : null}
                  Qty: {t.qty ?? 1}
                </div>
                <div className="price">₹{Number(t.price).toLocaleString("en-IN")}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CartToastCtx.Provider>
  );
}
