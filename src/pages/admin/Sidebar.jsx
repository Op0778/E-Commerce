import React from "react";
import "../../style/admin/sidebar.css";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  return (
    <>
      <div className="sidebar ">
        <div onClick={() => navigate("/admin/dashboard")}>Dashboard</div>
        <div onClick={() => navigate("/admin/users")}>Users</div>
        <div onClick={() => navigate("/admin/product")}>Product</div>
        <div onClick={() => navigate("/home")}>Logout</div>
      </div>
    </>
  );
}

export default React.memo(Sidebar);
