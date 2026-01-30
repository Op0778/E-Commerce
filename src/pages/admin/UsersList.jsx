import React, { useState, useEffect } from "react";
import axios from "axios";
import connectionUrl from "../url";
import "../../style/admin/userList.css";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

function UsersList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${connectionUrl}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("User : ", res.data);
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching user:", err);
        setUsers([]);
      }
    };
    fetchUsers();
  }, []);
  return (
    <>
      <div>
        <Sidebar />
      </div>
      <div className="userList">
        <h1>USERS LIST</h1>
        <button onClick={() => navigate("/register")}>Add User</button>
        <table>
          <thead>
            <tr>
              <th>User Id</th>
              <th>Username</th>
              <th>Role</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/admin/user/update/${user._id}`)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  User not found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default React.memo(UsersList);
