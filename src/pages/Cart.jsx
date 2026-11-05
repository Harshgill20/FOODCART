import React from "react";
import "./Cart.css";

function Cart({ cart, updateQuantity, closeCart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-overlay">
      <div className="cart-modal">
        <div className="cart-header">
          <h3>Your Shopping Cart</h3>
          <button className="close-btn" onClick={closeCart}>✕</button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div>
                  <h4>{item.name}</h4>
                  <p>₹{item.price} x {item.quantity}</p>
                </div>
                <div className="qty-controls">
                  <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <h4>Total: ₹{total}</h4>
            <button className="checkout-btn">Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;