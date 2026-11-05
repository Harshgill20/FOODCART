import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { API_URL } from "./api";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customer, setCustomer] = useState({ customerName: "", phone: "", address: "" });
  const [orderMsg, setOrderMsg] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  // On page load, check that the saved token is still valid
  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setUser(data.user))
      .catch(() => logout());
  }, [token]);

  const handleAuth = (newToken, newUser) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setCart([]);
  }

  // Add item to cart based on selected platform
  const addToCart = (item, platform, price) => {
    const cartItemId = `${item.id}-${platform}`;

    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prevCart.map((i) =>
          i.cartItemId === cartItemId ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prevCart,
        { cartItemId, name: item.name, platform, price, qty: 1 },
      ];
    });
  };

  // Cart totals
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Send the cart to the backend as an order
  const placeOrder = async () => {
    setOrderMsg("");
    if (!customer.customerName.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setOrderMsg("Please fill in name, phone and address.");
      return;
    }
    if (!/^\d{10}$/.test(customer.phone.trim())) {
      setOrderMsg("Phone number must be 10 digits.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...customer,
          items: cart.map(({ name, platform, price, qty }) => ({ name, platform, price, qty })),
        }),
      });
      const data = await res.json();
      if (res.status === 401) logout();
      if (!res.ok) throw new Error(data.error || "Order failed");
      setCart([]);
      setCustomer({ customerName: "", phone: "", address: "" });
      setOrderMsg(`Order placed! Total: ₹${data.total}`);
    } catch (err) {
      setOrderMsg(`Could not place order: ${err.message}`);
    }
  };

  return (
    <>
      <Header cartCount={cartCount} toggleCart={() => setIsCartOpen(!isCartOpen)} user={user} onLogout={logout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu addToCart={addToCart} />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login onAuth={handleAuth} />} />
      </Routes>

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="cart-drawer">
          <h3>Your FoodMap Cart</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.cartItemId} className="cart-item">
                <div>
                  <strong>{item.name}</strong> <small>({item.platform})</small>
                </div>
                <div>
                  ₹{item.price} × {item.qty}
                </div>
              </div>
            ))
          )}
          <h4>Total: ₹{cartTotal}</h4>
          {cart.length > 0 && !user && (
            <p>
              Please <Link to="/login" onClick={() => setIsCartOpen(false)}>login</Link> to place your order.
            </p>
          )}
          {cart.length > 0 && user && (
            <div className="checkout-form">
              <input placeholder="Your name" value={customer.customerName}
                onChange={(e) => setCustomer({ ...customer, customerName: e.target.value })} />
              <input placeholder="Phone (10 digits)" value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
              <input placeholder="Delivery address" value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
              <button onClick={placeOrder}>Place Order</button>
            </div>
          )}
          {orderMsg && <p>{orderMsg}</p>}
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            Close
          </button>
        </div>
      )}
    </>
  );
}

export default App;