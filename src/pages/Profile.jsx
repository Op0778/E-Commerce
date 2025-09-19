import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import "../style/profileStyle.css";
import { useNavigate } from "react-router-dom";

function Profile({ token }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
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
      <h2>
        <FaUserCircle size={"100px"} />
      </h2>

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
      {/* <div>
        <strong>Favorites:</strong>
        {user.favorites && user.favorites.length > 0 ? (
          <ul>
            {user.favorites.map((fav) => (
              <li key={fav._id}>
                {fav.name} – ₹{fav.price}
              </li>
            ))}
          </ul>
        ) : (
          <p>No favorites yet</p>
        )}
      </div> */}
    </div>
  );
}

export default Profile;
