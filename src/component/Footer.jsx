import React from "react";
import "../style/footerStyle.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="disclaimer">
          This project is for demonstration purposes only and is not a real
          e-commerce website.
        </p>
        <small className="copyright">
          &copy; {new Date().getFullYear()} E-Commerce. All rights reserved.
        </small>
      </div>
    </footer>
  );
}
