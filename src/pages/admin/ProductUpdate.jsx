import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import connectionUrl from "../url";
import "../../style/admin/productupdate.css";

function ProductUpdate() {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`${connectionUrl}/api/products/${id}`);
      setFormData(res.data);
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await axios.patch(`${connectionUrl}/api/product/update/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Product Update successfully");
    navigate("/admin/product");
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`${connectionUrl}/api/product/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Product deleted successfully");
      navigate("/admin/product"); // go back to product list
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="add-update-product">
      <form onSubmit={handleSubmit}>
        <h1>Product Update</h1>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="product name"
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
        <input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
        />
        <input
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
        />

        <textarea
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
        <img src={formData.image} alt="Product Image" />
        <button type="submit">Update</button>
        <button type="button" onClick={handleDelete} className="delete-btn">
          Delete Product
        </button>
      </form>
    </div>
  );
}

export default React.memo(ProductUpdate);
