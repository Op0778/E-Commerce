import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
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
import AdminRoute from "./pages/admin/AdminRoute";
import Dashboard from "./pages/admin/Dashboard";
import UserList from "./pages/admin/UsersList";
import Products from "./pages/admin/Products";
import ProductUpdate from "./pages/admin/ProductUpdate";
import AddProduct from "./pages/admin/AddProduct";
import UserUpdate from "./pages/admin/UserUpdate";
import OrderList from "./pages/admin/OrderList";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (t, id, role) => {
    setToken(t);
    localStorage.setItem("token", t);
    localStorage.setItem("userId", id);
    localStorage.setItem("role", role);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
  };

  return (
    <>
      {/* <Navbar /> */}
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
        <Route path="/admin" element={<AdminRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="user/update/:id" element={<UserUpdate />} />
          <Route path="product" element={<Products />} />
          <Route path="product/update/:id" element={<ProductUpdate />} />
          <Route path="product/newproduct" element={<AddProduct />} />
          <Route path="order" element={<OrderList/>}/>
        </Route>
      </Routes>
      {/* <Footer /> */}
    </>
  );
}

export default App;
