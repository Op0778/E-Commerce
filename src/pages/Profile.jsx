import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import "../style/profileStyle.css";
import { useNavigate } from "react-router-dom";
import connectionUrl from "./url";

function Profile({ token }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${connectionUrl}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [token]);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile">
      {user.profilePic ? (
        <img
          src={`data:image/png;base64,${user.profilePic}`}
          alt="Profile"
          className="profile-pic"
        />
      ) : (
        <FaUserCircle size={"100px"} color="#777" />
      )}
      {console.log("profile pic is  ", user.profilePic)}
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      {user.mobile ? (
        <div>
          <p>
            <strong>Phone Number:</strong> {user.mobile}
          </p>
        </div>
      ) : (
        <div></div>
      )}
      {user.address ? (
        <div>
          <p>
            <strong>Address:</strong>
            {user.address}
          </p>
        </div>
      ) : (
        <div></div>
      )}

      <button onClick={() => navigate("/update")}>Update</button>
    </div>
  );
}

export default React.memo(Profile);
