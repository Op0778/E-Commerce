import React from "react";
import Shop from "./Shop";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
const Home = () => {
  return (
    <div>
      <Navbar />
      <Shop />
      <Footer />
    </div>
  );
};

export default React.memo(Home);
