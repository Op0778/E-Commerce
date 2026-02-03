import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import connectionUrl from "../url";
import "../../style/admin/productupdate.css";

function UserUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    role: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${connectionUrl}/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData(res.data);
    };

    fetchUser();
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

    await axios.patch(
      `${connectionUrl}/api/admin/users/update/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    alert("User Update successfully");
    navigate("/admin/users");
  };

  const handleDeleteUser = async () => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;

    try {
      await axios.delete(`${connectionUrl}/api/user/remove/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("User removed successfully");
      navigate("/admin/users");
    } catch (error) {
      console.error(error);
      alert("Failed to remove user");
    }
  };

  return (
    <div className="add-update-product">
      <form onSubmit={handleSubmit}>
        <h1>User Update</h1>

        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Role"
        />
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="text"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <input
          type="number"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Mobile Number"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
        />
        <button type="submit">Update</button>
        <button type="button" onClick={handleDeleteUser} className="delete-btn">
          Remove
        </button>
      </form>
    </div>
  );
}

export default React.memo(UserUpdate);
