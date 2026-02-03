import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaRegHeart, FaSearch, FaBoxOpen, FaUser } from "react-icons/fa";
import { BsCart } from "react-icons/bs";
import { MdAdminPanelSettings, MdLogout } from "react-icons/md";
import "../style/shopStyle.css";
import "../style/navStyle.css";
import connectionUrl from "../pages/url";

const Navbar = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    const role = localStorage.getItem("role");

    if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      alert("Admin Access Only");
    }
  };

  const handleSearch = async () => {
    try {
      if (!searchTerm.trim()) {
        alert("Please enter a search term");
        return;
      }
      const res = await axios.get(
        `${connectionUrl}/api/products/search?q=${searchTerm}`,
      );
      setProducts(res.data);
      setSearched(true);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div className="">
      <div className="navbar">
        <div className="navbar-right">
          <div className="userLogo" onClick={() => navigate("/profile")}>
            <FaUser />
          </div>
          <div className="navbar-logo">
            <BsCart />
          </div>
          <div>
            {localStorage.getItem("role") === "admin" && (
              <div onClick={handleAdminLogin}>
                <MdAdminPanelSettings />
              </div>
            )}
          </div>
        </div>

        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>
            <FaSearch />
          </button>
        </div>

        <div className="navbar-right">
          <div onClick={() => navigate("/saved")}>
            <FaRegHeart />
          </div>
          <div onClick={() => navigate("/order")}>
            <FaBoxOpen />
          </div>

          <div onClick={() => navigate("/")}>
            <MdLogout />
          </div>
        </div>
      </div>
      <div className="navbar-down">
        <div className="navbar-bottom ">
          <div onClick={() => navigate("/profile")}>
            <FaUser />
          </div>
          <div className="navbar-logo">
            <BsCart />
          </div>
          <div className="adminLogo">
            {localStorage.getItem("role") === "admin" && (
              <div onClick={handleAdminLogin}>
                <MdAdminPanelSettings />
              </div>
            )}
          </div>
          <div onClick={() => navigate("/saved")}>
            <FaRegHeart />
          </div>
          <div onClick={() => navigate("/order")}>
            <FaBoxOpen />
          </div>

          <div onClick={() => navigate("/")}>
            <MdLogout />
          </div>
        </div>
      </div>
      <br />
      <div>
        {products.length > 0 ? (
          <div className="shop-container">
            {products.map((item) => (
              <div
                key={item.id}
                className="product-card"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <img src={item.image} alt={item.name} />
                <h4>{item.name}</h4>
                <p>⭐ {item.rating}</p>
                <h4>₹{item.price}</h4>
              </div>
            ))}
          </div>
        ) : searched ? (
          <h4>Product Not Found</h4>
        ) : null}
        <br />
      </div>
    </div>
  );
};

export default React.memo(Navbar);
