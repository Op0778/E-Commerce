import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import "../../style/admin/dashboard.css";
import connectionUrl from "../url";
import InventoryBarChart from "../../component/InventoryBarChart";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const stocks = useMemo(
    () => products.map((product) => Number(product.stock || 0)),
    [products],
  );
  const prices = useMemo(
    () => products.map((product) => Number(product.price || 0)),
    [products],
  );

  // const stocks = products.map((product) => Number(product.stock || 0));
  // const prices = products.map((product) => Number(product.price || 0));

  const minStock = stocks.length ? Math.min(...stocks) : 0;
  const maxStock = stocks.length ? Math.max(...stocks) : 0;

  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  // 👉 Find products for min/max
  const minStockProduct = useMemo(() => {
    return products.reduce(
      (min, p) =>
        Number(p.stock || 0) < Number(min?.stock ?? Infinity) ? p : min,
      null,
    );
  }, [products]);

  const maxStockProduct = useMemo(() => {
    return products.reduce(
      (max, p) =>
        Number(p.stock || 0) > Number(max?.stock ?? -Infinity) ? p : max,
      null,
    );
  }, [products]);

  const minPriceProduct = useMemo(() => {
    return products.reduce(
      (min, p) =>
        Number(p.price || 0) < Number(min?.price ?? Infinity) ? p : min,
      null,
    );
  }, [products]);

  const maxPriceProduct = useMemo(() => {
    return products.reduce(
      (max, p) =>
        Number(p.price || 0) > Number(max?.price ?? -Infinity) ? p : max,
      null,
    );
  }, [products]);

  const countContent = [
    {
      name: "Total Users",
      count: users.length,
      path: "/admin/users",
      type: "user",
    },
    {
      name: "Total Products",
      count: products.length,
      path: "/admin/product",
      type: "product",
    },
    {
      name: "Total Order",
      count: orders.length,
      path: "/admin/order",
      type: "order",
    },
    {
      name: "Minimum stock",
      count: minStock,
      type: "min",
      path: minStockProduct?._id
        ? `/admin/product/update/${minStockProduct._id}`
        : null,
    },
    {
      name: "Maximum stock",
      count: maxStock,
      type: "max",
      path: maxStockProduct?._id
        ? `/admin/product/update/${maxStockProduct._id}`
        : null,
    },
    {
      name: "Minimum price",
      count: minPrice,
      path: minPriceProduct?._id
        ? `/admin/product/update/${minPriceProduct._id}`
        : null,
    },
    {
      name: "Maximum price",
      count: maxPrice,
      path: maxPriceProduct?._id
        ? `/admin/product/update/${maxPriceProduct._id}`
        : null,
    },
  ];

  /*  Product wise Stock  */
  const productStockData = products.map((p) => ({
    name: p.name,
    stock: Number(p.stock || 0),
  }));

  /*  Category wise Stock  */
  const categoryStockMap = {};
  products.forEach((p) => {
    const category = p.category || "Others";
    const stock = Number(p.stock || 0);
    categoryStockMap[category] = (categoryStockMap[category] || 0) + stock;
  });

  const categoryStockData = Object.keys(categoryStockMap).map((cat) => ({
    category: cat,
    stock: categoryStockMap[cat],
  }));

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${connectionUrl}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Users :", res.data);
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
      }
    };

    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${connectionUrl}/api/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Products :", res.data);
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      }
    };

    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${connectionUrl}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Orders :", res.data);
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      }
    };
    fetchUsers();
    fetchProducts();
    fetchOrders();
  }, []);

  return (
    <>
      <Sidebar />

      <div className="dashboard-container">
        <h1 className="dashboard-title">DASHBOARD</h1>

        <div className="dashboard-data">
          {countContent.map((item, index) => (
            <div
              className={`dashboard-card ${item.type}`}
              key={index}
              onClick={() => navigate(item.path)}
            >
              <h3>{item.name}</h3>
              <p>{item.count}</p>
            </div>
          ))}
        </div>
        <div className="dashboard-data">
          <InventoryBarChart
            title="Inventory – Product Wise Stock"
            data={productStockData}
            xKey="name"
          />

          <InventoryBarChart
            title="Inventory – Category Wise Stock"
            data={categoryStockData}
            xKey="category"
          />
        </div>
      </div>
    </>
  );
}

export default React.memo(Dashboard);
