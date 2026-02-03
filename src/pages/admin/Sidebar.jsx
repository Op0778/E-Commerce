import React from "react";
import "../../style/admin/sidebar.css";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaDashcube, FaShoppingBag, FaUser } from "react-icons/fa";
import { MdDashboard, MdLogout } from "react-icons/md";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <>
      <div className="sidebar ">
        <div
          className="sidebar-item"
          onClick={() => navigate("/admin/dashboard")}
        >
          <MdDashboard /> <span>Dashboard</span>{" "}
        </div>
        <div className="sidebar-item" onClick={() => navigate("/admin/users")}>
          <FaUser /> <span>Users</span>{" "}
        </div>
        <div
          className="sidebar-item"
          onClick={() => navigate("/admin/product")}
        >
          <FaShoppingBag /> <span>Product</span>{" "}
        </div>
        <div className="sidebar-item" onClick={() => navigate("/admin/order")}>
          <FaBoxOpen /> <span>Order</span>
        </div>
        <div className="sidebar-item" onClick={() => navigate("/home")}>
          <MdLogout /> <span>Logout</span>
        </div>
      </div>
    </>
  );
}

export default React.memo(Sidebar);
