import React from "react";
import "./Navbar.css";
import AboutApp from "./AboutApp/AboutApp";
import MyPatterns from "./MyPatterns/MyPatterns";
import Profile from "./Profile/Profile";

export default function Navbar() {
  return (
    <nav>
      <div className="navbar-box">
        <img src="/images/drumgrid-logo.svg" className="navbar-logo-image" alt="drumgrid logo" />
        <span className="navbar-logo-text">drumgrid</span>
        <div className="navbar-text">
          <span className="navbar-link-padding">
            <AboutApp />
          </span>
          <span className="navbar-link-padding">
            <MyPatterns />
          </span>
          <span className="navbar-link-padding">
            <Profile />
          </span>
        </div>
      </div>
    </nav>
  );
}
