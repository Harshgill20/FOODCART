import React, { useEffect, useState } from "react";
import { API_URL } from "../api";
import "./Menu.css";

const fallbackItems = [
  {
    id: 1,
    name: "Cheese Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    prices: { Blinkit: 59, Swiggy: 69, Zomato: 75 },
  },
  {
    id: 2,
    name: "Pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    prices: { Blinkit: 320, Swiggy: 349, Zomato: 339 },
  },
  {
    id: 3,
    name: "French Fries",
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400",
    prices: { Blinkit: 89, Swiggy: 99, Zomato: 105 },
  },
  {
    id: 4,
    name: "Pasta",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
    prices: { Blinkit: 229, Swiggy: 249, Zomato: 259 },
  },
  {
    id: 5,
    name: "Cold Coffee",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
    prices: { Blinkit: 129, Swiggy: 149, Zomato: 139 },
  },
  {
    id: 6,
    name: "Chocolate Cake",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
    prices: { Blinkit: 159, Swiggy: 179, Zomato: 169 },
  },
];

function Menu({ addToCart }) {
  const [menuItems, setMenuItems] = useState(fallbackItems);
  const [error, setError] = useState("");
  // Store selected platform for each item: { <id>: "Blinkit", ... }
  const [selectedPlatforms, setSelectedPlatforms] = useState({});

  // Load menu from the backend (falls back to built-in list if server is down)
  useEffect(() => {
    fetch(`${API_URL}/api/foods`)
      .then((res) => {
        if (!res.ok) throw new Error("Bad response");
        return res.json();
      })
      .then((data) => {
        if (data.length > 0) {
          setMenuItems(data.map((f) => ({ ...f, id: f._id })));
        }
      })
      .catch(() => setError("Could not reach the server - showing offline menu."));
  }, []);

  const selectPlatform = (itemId, platform) => {
    setSelectedPlatforms((prev) => ({ ...prev, [itemId]: platform }));
  };

  return (
    <section className="menu">
      <h2>Our Menu - Price Comparison</h2>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <div className="menu-container">
        {menuItems.map((item) => {
          const currentPlatform = selectedPlatforms[item.id] || "Blinkit";
          const currentPrice = item.prices[currentPlatform];

          return (
            <div className="menu-card" key={item.id}>
              <img src={item.image} alt={item.name} />

              <div className="menu-info">
                <h3>{item.name}</h3>

                {/* Platform Selector Buttons */}
                <div className="platform-list">
                  {Object.keys(item.prices).map((platform) => (
                    <button
                      key={platform}
                      className={currentPlatform === platform ? "active-btn" : ""}
                      onClick={() => selectPlatform(item.id, platform)}
                    >
                      {platform}: ₹{item.prices[platform]}
                    </button>
                  ))}
                </div>

                <p className="price-display">
                  ₹{currentPrice} <small>via {currentPlatform}</small>
                </p>

                <button
                  className="add-btn"
                  onClick={() => addToCart(item, currentPlatform, currentPrice)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Menu;