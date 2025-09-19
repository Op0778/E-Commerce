import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/formStyle.css";

const UpdateProfile = () => {
  const [form, setForm] = useState({ mobile: "", address: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Get userId and token from localStorage
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // ✅ Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || !token) return;

      try {
        const res = await axios.put(`http://localhost:5000/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // populate form with existing data
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //   const userId = localStorage.getItem("userId"); // must exist
  //   const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) return alert("User not logged in");

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/users/update/${userId}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
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
          />
        </div>
        <div>
          <label>Address: </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateProfile;
