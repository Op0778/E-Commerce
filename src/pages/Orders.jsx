import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderTracking from "./OrderTracking";
import connectionUrl from "./url";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem(
          "token",
          (req, res) => res.data.token
        );
        const userId = localStorage.getItem("userId");
        if (!token) {
          alert("Please login to view your orders");
          return;
        }

        const res = await axios.get(`${connectionUrl}/api/orders/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(res.data);
      } catch (err) {
        console.error(
          "Error fetching orders:",
          err.response?.data || err.message
        );
      }
    };

    fetchOrders();
  }, []);

  if (orders.length === 0) return <h2>No orders yet</h2>;

  return (
    <div>
      <h1>Your Orders</h1>
      {[...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((order) => (
          <div key={order._id} className="order-product">
            <h2>{order.productId?.name}</h2>
            <img
              src={order.productId?.image}
              alt={order.productId?.name}
              width="150"
            />
            <p>Brand: {order.productId?.brand}</p>
            <p>Price: ₹{order.productId?.price}</p>
            <p>Quantity: {order.quantity}</p>
            <p>Status: {order.status}</p>
            <OrderTracking order={order} />
          </div>
        ))}
    </div>
  );
};

export default React.memo(Orders);
