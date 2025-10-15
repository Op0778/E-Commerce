import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/formStyle.css";

const UpdateProfile = () => {
  const [form, setForm] = useState({ mobile: "", address: "" });
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // ✅ Fetch user profile details
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || !token) return;

      try {
        const res = await axios.get(
          `https://ecommerce-backend-b23p.onrender.com/api/users/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setForm({
          mobile: res.data.mobile || "",
          address: res.data.address || "",
        });

        // ✅ Load saved profile pic if any
        if (res.data.profilePic) {
          setPreview(`data:image/jpeg;base64,${res.data.profilePic}`);
        }
      } catch (err) {
        console.error("Fetch Profile Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ✅ Update all fields + profile pic together
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("User not logged in");

    const formData = new FormData();
    formData.append("mobile", form.mobile);
    formData.append("address", form.address);
    if (profilePic) formData.append("profilePic", profilePic); // ✅ must match backend key

    try {
      const res = await axios.patch(
        `https://ecommerce-backend-b23p.onrender.com/api/users/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(res.data.message || "Profile updated successfully");

      if (res.data.user.profilePic) {
        setPreview(`data:image/jpeg;base64,${res.data.user.profilePic}`);
      }
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

        {/* ✅ Profile Picture Section */}
        <div className="profile-pic-section">
          {preview ? (
            <img
              src={preview}
              alt="Profile Preview"
              className="profile-pic-preview"
            />
          ) : (
            <div className="placeholder-pic">No Profile Picture</div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ marginTop: "10px" }}
          />
        </div>

        {/* ✅ Text Fields */}
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

        <button type="submit">Update Profile</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateProfile;
