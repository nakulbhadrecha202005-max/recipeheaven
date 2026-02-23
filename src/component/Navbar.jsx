import React, { useState } from "react";
import "../Styles/Navbarstyle.css";
import ShinyText from "../Reactbiits/Shinytext";
import { Link } from "react-router-dom";

//logout logic of code
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../context/Firebase";

export default function Navbar() {
  const navigate = useNavigate();
  // 1. Create a state to track if menu is open
  const [isOpen, setIsOpen] = useState(false);
  const [recipeDropdownOpen, setRecipeDropdownOpen] = useState(false);
  const [AccountDropdownOpen, setAccountDropdownOpen] = useState(false);
  // 2. Toggle function
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg  py-3 ">
      <div className="container">
        <a className="navbar-brand fs-3 fw-bold" href="#">
          <ShinyText
            text="RecipeHeaven"
            speed={10}
            delay={-1}
            color="#000000"
            shineColor="#ffffffab"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
          />
          <span className="text-danger">.</span>
        </a>

        {/* 3. Update button to use toggleMenu and conditional icons */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          style={{ backgroundColor: "transparent" }}
          onClick={toggleMenu}
        >
          <span className="material-icons-outlined">
            {isOpen ? "close" : "menu"}
          </span>
        </button>

        {/* 4. Use conditional class 'show' for the collapse div */}
        <div
          className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
          id="mainNav"
        >
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/home"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/about"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setRecipeDropdownOpen(!recipeDropdownOpen);
                  setAccountDropdownOpen(false);
                }}
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Recipes
              </a>

              <ul
                className={`dropdown-menu ${recipeDropdownOpen ? "show" : ""}`}
              >
                <li>
                  <Link
                    className="dropdown-item"
                    to="/adminselectallrecipes"
                    onClick={() => {
                      setRecipeDropdownOpen(false);
                      setIsOpen(false);
                    }}
                  >
                    Admin panel
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item"
                    to="/Userercipeupload"
                    onClick={() => {
                      setRecipeDropdownOpen(false);
                      setIsOpen(false);
                    }}
                  >
                    Users Uploaded Recipies
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item"
                    to="/CommentDashboard"
                    onClick={() => {
                      setRecipeDropdownOpen(false);
                      setIsOpen(false);
                    }}
                  >
                    Comments Dashboard
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item"
                    to="/uploadrecipe"
                    onClick={() => {
                      setRecipeDropdownOpen(false);
                      setIsOpen(false);
                    }}
                  >
                    Add Recipe
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="/favorites"
                    onClick={() => {
                      setRecipeDropdownOpen(false);
                      setIsOpen(false);
                    }}
                  >
                    Your fav. recipies
                  </Link>
                </li>
              </ul>
            </li>
            {/* Account Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setRecipeDropdownOpen(false);
                  setAccountDropdownOpen(!AccountDropdownOpen);
                }}
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Account Details
              </a>

              <ul
                className={`dropdown-menu ${AccountDropdownOpen ? "show" : ""}`}
              >
                <li>
                  <Link
                    className="dropdown-item"
                    to="/login"
                    onClick={() => {
                      setAccountDropdownOpen(false);
                      setIsOpen(false);
                    }}
                  >
                    Login
                  </Link>
                </li>

                {/* signup */}
                <li>
                  <Link
                    className="dropdown-item"
                    to="/signup"
                    onClick={() => {
                      setAccountDropdownOpen(false);
                      setIsOpen(false);
                    }}
                  >
                    Signup
                  </Link>
                </li>
                {/* <li>
                  <Link
                    className="dropdown-item"
                    to="/Profileimageupload"
                    onClick={() => {
                      setAccountDropdownOpen(false);
                      setIsOpen(false);
                    }}
                  >
                    Profile image upload
                  </Link>
                </li> */}
                <li>
                  <Link
                    className="dropdown-item"
                    to="/editProfileofuser"
                    onClick={() => {
                      setAccountDropdownOpen(false);
                      setIsOpen(false);
                    }}
                  >
                    Edit Profile
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/login"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                Login
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-3 mt-lg-0 mt-4">
            <Link
              className="nav-link"
              to="/favorites"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <span className="material-icons-outlined text-danger clickable">
                favorite_border
              </span>
            </Link>

            <button
              className="btn btn-outline-danger btn-sm rounded-pill px-4 text-light"
              onClick={() => logout()}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
