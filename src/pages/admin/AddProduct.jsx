import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import connectionUrl from "../url";
import "../../style/admin/productupdate.css";

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    rating: "",
    description: "",
    image: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${connectionUrl}/api/product/newproduct`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("New Product Added successfully!");
      navigate("/admin/product");
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  return (
    <div className="add-update-product">
      <form onSubmit={handleSubmit}>
        <h1>Add New Product</h1>
        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="product name"
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="category"
        />
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          placeholder="brand"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="price"
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="stock"
        />
        <input
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          placeholder="rating"
        />

        <textarea
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="description"
        ></textarea>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="image"
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default React.memo(AddProduct);
