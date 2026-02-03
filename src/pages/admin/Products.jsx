import React, { useEffect, useState } from "react";
import axios from "axios";
import connectionUrl from "../url";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import "../../style/admin/products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${connectionUrl}/api/products`);
        console.log("Product : ", res.data);
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching product:", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);
  return (
    <>
      <div>
        <Sidebar />
      </div>
      <div className="productList">
        <h1>PRODUCTS</h1>
        <button onClick={() => navigate("/admin/product/newproduct")}>
          Add Product
        </button>
        <table>
          <thead>
            <tr>
              <th>Product Id</th>
              <th>Product Name</th>
              <th>Product Image</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>
                    <img src={product.image} alt="product image" />
                  </td>
                  <td>{product.price}</td>
                  <td>
                    <button
                      onClick={() =>
                        navigate(`/admin/product/update/${product._id}`)
                      }
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  product not found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default React.memo(Products);
