import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../style/formStyle.css";
import connectionUrl from "../pages/url";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${connectionUrl}/api/login`, form);

      const token = res.data.token;
      const userId = res.data.user._id;
      const role = res.data.user.role;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);

      onLogin(token, userId, role);
      console.log("token : ", token, "userId : ", userId, "role : ", role);
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  return (
    <>
      <div className="bg">
        <form onSubmit={handleSubmit} className="log-reg-form">
          <h2>Login</h2>
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <button type="submit">Login</button>
          <div className="relink">
            I don't Have an Account? <Link to="/register">Register Now</Link>
          </div>
        </form>
      </div>
    </>
  );
}
