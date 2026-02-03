import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/formStyle.css";
import connectionUrl from "./url";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const [form, setForm] = useState({ mobile: "", address: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // ✅ Fetch user profile details
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || !token) return;

      try {
        const res = await axios.get(`${connectionUrl}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setForm({
          mobile: res.data.mobile || "",
          address: res.data.address || "",
        });
      } catch (err) {
        console.error("Fetch Profile Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  // ✅ Handle input text changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Update profile text details
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("User not logged in");

    try {
      const res = await axios.patch(
        `${connectionUrl}/api/users/update/${userId}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setMessage(res.data.message || "Profile updated successfully");
      alert("Profile Updated Successfully");
      navigate("/profile");
    } catch (err) {
      console.error("Update Error:", err);
      setMessage("Failed to update profile");
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="bg">
      <form onSubmit={handleSubmit} className="log-reg-form">
        <h2>Update Profile</h2>

        <div>
          <label>Mobile: </label>
          <input
            type="text"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="Enter new mobile number"
          />
        </div>

        <div>
          <label>Address: </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter new address"
          />
        </div>

        <button type="submit">Update</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default React.memo(UpdateProfile);
