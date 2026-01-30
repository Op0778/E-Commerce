import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck } from "react-icons/fa";
import "../style/OrderTracking.css";
import connectionUrl from "./url";

const steps = ["Placed", "Shipped", "Nearby", "Out for Delivery", "Delivered"];

function OrderTracking({ order }) {
  const [status, setStatus] = useState(order?.status ?? "Placed");

  // compute index of current status (0..steps.length-1)
  const currentIndex = Math.max(0, steps.indexOf(status));

  useEffect(() => {
    if (!order?._id) return;

    const token = localStorage.getItem("token");

    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `${connectionUrl}/api/orders/${order._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStatus(res.data.status);
      } catch (err) {
        console.error("Error fetching order status:", err);
      }
    };

    fetchStatus();
    let interval = null;
    if (status !== "Delivered") {
      interval = setInterval(fetchStatus, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [order?._id, status]);

  const fillPercent =
    steps.length > 1 ? (currentIndex / (steps.length - 1)) * 100 : 0;

  return (
    <div className="progress-wrapper">
      <div className="progress-line">
        <div
          className="progress-line-fill"
          style={{
            width: `${fillPercent}%`,
          }}
        />
      </div>

      <div className="progress-steps">
        {steps.map((label, idx) => {
          const completed = idx <= currentIndex || status === "Delivered";
          return (
            <div className="step" key={label}>
              <div className={`circle ${completed ? "completed" : ""}`}>
                {completed ? <FaCheck /> : idx + 1}
              </div>
              <div className="label">{label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(OrderTracking);
