import React from "react";
import appLogo from "../images/ashokaLogo.png";
import cartLogo from "../images/cartLogo.png";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <>
      <nav className="navbar-container">
        <div className="navbar">
          <Link to="/" className="app-logo-container">
            <img
              src={appLogo}
              alt="Cart"
              className="logo"
            />
            <h1 className="app-title">zomashoka</h1>
          </Link>
          <div className="dropdown">
            <Link to="/" className="item-link">
              HOME <IoMdArrowDropdown className="dropdown-icon" />
            </Link>
            <Link to="/pizzas" className="item-link">
              SEARCH
            </Link>
          </div>
          <Link to="/cart">
            <div className="cart-logo-container">
              <button className="cart-btn" title="Orders">
                <img src={cartLogo} alt="cart-logo" className="cart-logo" />
              </button>
            </div>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
