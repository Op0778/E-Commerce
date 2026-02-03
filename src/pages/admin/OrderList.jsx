import React, { useState, useEffect } from "react";
import axios from "axios";
import connectionUrl from "../url";
import "../../style/admin/userList.css";
import Sidebar from "./Sidebar";
// import { useNavigate } from "react-router-dom";

function OrderList() {
  const [orders, setOrders] = useState([]);
  



  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${connectionUrl}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Orders:", res.data);
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      }
    };


    fetchOrders();
  }, []);

  return (
    <>
      <Sidebar />

      <div className="userList">
        <h1>ORDERS LIST</h1>

        <table>
          <thead>
            <tr>
              <th>Order Id</th>
              <th>User Id</th>
              <th>Product</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.userId}</td>
                  <td>{order.productId?.name || order.productId}</td>
                  <td>{order.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default React.memo(OrderList);
