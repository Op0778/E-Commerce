import axios from "axios";
import React, { useState } from "react";
import connectionUrl from "./url";

function ProfilePicUpload() {
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);

    await axios.post(`${connectionUrl}/api/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Profile uploaded!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button type="submit">Upload</button>
    </form>
  );
}

export default React.memo(ProfilePicUpload);
