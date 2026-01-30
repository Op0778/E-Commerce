import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import connectionUrl from "../pages/url";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${connectionUrl}/api/register`, form);
      alert("Registered successfully!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  return (
    <>
      <div className="bg">
        <form onSubmit={handleSubmit} className="log-reg-form">
          <h2>Register</h2>
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <button type="submit">Register</button>
          <div className="relink">
            already Have an Account? <Link to="/">Login Now</Link>
          </div>
        </form>
      </div>
    </>
  );
}
