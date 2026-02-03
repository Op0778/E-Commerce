import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import connectionUrl from "./url";

function SavedProduct() {
  const [saved, setSaved] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  //  Fetch saved products
  useEffect(() => {
    if (!userId || !token) return;

    const fetchSaved = async () => {
      try {
        const res = await axios.get(`${connectionUrl}/api/saved/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSaved(res.data);
      } catch (err) {
        console.error("Error fetching saved products:", err);
      }
    };

    fetchSaved();
  }, [userId, token]);

  //  Toggle save/remove product
  const toggleSave = async (productId, isSaved) => {
    try {
      if (isSaved) {
        // Remove product
        await axios.delete(
          `${connectionUrl}/api/remove/${userId}/${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSaved((prev) => prev.filter((p) => p._id !== productId));
      } else {
        // Save product
        await axios.post(
          `${connectionUrl}/api/users/${userId}/save`,
          { productId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // re-fetch after saving
        const res = await axios.get(`${connectionUrl}/api/saved/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSaved(res.data);
      }
    } catch (err) {
      console.error("Save/Remove Error:", err.response?.data || err.message);
    }
  };

  if (!saved || saved.length === 0) return <h2>No saved products yet</h2>;

  return (
    <div>
      <h1>Your Saved Products</h1>
      {saved.map((p) => (
        <div
          key={p._id}
          style={{
            border: "1px solid #ccc",
            margin: "10px",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/product/${p._id}`)}
        >
          <img src={p.image} alt={p.name} width="100" />
          <div style={{ flex: 1 }}>
            <h2>{p.name}</h2>
            <p>Price: ₹{p.price}</p>
          </div>

          {/* Heart button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSave(p._id, true);
            }}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <FaHeart color="red" size={24} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default React.memo(SavedProduct);
