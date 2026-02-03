import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../style/shopStyle.css";
import connectionUrl from "./url";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]); // store product IDs
  const navigate = useNavigate();

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${connectionUrl}/api/products`);
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Fetch user favorites from DB
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const res = await axios.get(`${connectionUrl}/api/saved/${userId}`);
        // store only IDs to use with includes
        setFavorites(res.data.map((prod) => prod._id));
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };
    fetchFavorites();
  }, []);

  // Toggle favorite (add/remove in DB)
  const toggleFavorite = async (productId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const res = await axios.post(
        `${connectionUrl}/api/favorites/${productId}`,
        { userId },
      );
      // Update local state with updated favorites from DB
      setFavorites(res.data.favorites);
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  if (products.length === 0) return <h3>No products available</h3>;

  return (
    <div className="shop-container">
      {products.map((item) => (
        <div
          key={item._id}
          className="product-card"
          onClick={() => navigate(`/product/${item._id}`)}
        >
          <div
            className="favorite-icon"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item._id);
            }}
          >
            {favorites?.includes(item._id) ? (
              <FaHeart color="red" />
            ) : (
              <FaRegHeart color="gray" />
            )}
          </div>

          <img src={item.image} alt={item.name} />
          <h4>{item.name}</h4>
          <p>⭐ {item.rating}</p>
          <h4>₹{item.price}</h4>
        </div>
      ))}
    </div>
  );
};

export default React.memo(Shop);
