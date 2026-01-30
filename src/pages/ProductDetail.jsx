import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaHome, FaRegHeart, FaMoneyBillWave } from "react-icons/fa";
import { MdLocalShipping, MdReplay, MdSupportAgent } from "react-icons/md";
import "../style/productDetailsStyle.css";
import connectionUrl from "./url";

const ProductDetail = ({ token }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${connectionUrl}/api/products/${id}`);
        setProduct(res.data);
      } catch (e) {
        console.error("Error fetching product:", e);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${connectionUrl}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to place an order");
        return;
      }

      const res = await axios.post(
        `${connectionUrl}/api/orders`,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message);
    } catch (err) {
      console.error("Order Error:", err.response?.data || err.message);
      alert("Failed to place order");
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;
  if (!product) return <h2>No product details available</h2>;

  return (
    <div className="product-details">
      <div className="product">
        <h1>{product.name}</h1>
        <img src={product.image} alt={product.name} />
        <p>Brand: {product.brand}</p>
        <h3>Price: ₹{product.price}</h3>
        <p>Rating: ⭐ {product.rating}</p>
        <p>{product.description}</p>
      </div>

      <div className="delivery-details">
        <div>
          <FaHome /> HOME {user ? user.address : "Not Available"}
        </div>
        <div>
          <MdLocalShipping /> Delivery By
        </div>
      </div>

      <div className="product-return">
        <section>
          <MdReplay /> 10 days return
        </section>
        <section>
          <FaMoneyBillWave /> Cash On Delivery
        </section>
        <section>
          <MdSupportAgent /> Customer Support
        </section>
      </div>

      <div className="highlight">
        <h1>Product Highlights</h1>
        <table>
          <tbody>
            <tr>
              <td>Brand</td>
              <td>{product.brand}</td>
            </tr>
            <tr>
              <td>Price</td>
              <td>₹{product.price}</td>
            </tr>
            <tr>
              <td>Rating</td>
              <td>⭐ {product.rating}</td>
            </tr>
            <tr>
              <td>Stock Available</td>
              <td>{product.stock}</td>
            </tr>
          </tbody>
        </table>
        <p>{product.description}</p>
      </div>

      <div className="order-btn">
        <button onClick={handleOrder}>Order Now</button>
      </div>
    </div>
  );
};

export default React.memo(ProductDetail);
