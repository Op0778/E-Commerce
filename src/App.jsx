import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import SavedProduct from "./pages/SavedProduct";
import Orders from "./pages/Orders";
import UpdateProfile from "./pages/UpdateProfile";
import ProfilePicUpload from "./pages/ProfilePicUpload";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (t, id) => {
    setToken(t);
    localStorage.setItem("token", t);
    localStorage.setItem("userId", id);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            token ? <Home onLogout={handleLogout} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/profile"
          element={token ? <Profile token={token} /> : <Navigate to="/" />}
        />
        <Route path="/upload" element={<ProfilePicUpload />} />
        <Route
          path="/update"
          element={token ? <UpdateProfile /> : <Navigate to="/" />}
        />
        <Route path="/product" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail token={token} />} />
        <Route
          path="/saved"
          element={token ? <SavedProduct /> : <Navigate to="/" />}
        />
        <Route path="/order" element={<Orders />} />
      </Routes>
    </>
  );
}

export default App;
