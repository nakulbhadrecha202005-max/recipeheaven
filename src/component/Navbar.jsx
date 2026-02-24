import React, { useState } from "react";
import "../Styles/Navbarstyle.css";
import ShinyText from "../Reactbiits/ShinyText";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../context/Firebase";
import { useEffect } from "react";

import { onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [recipeDropdownOpen, setRecipeDropdownOpen] = useState(false);
  const [AccountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User logged in:", currentUser.email);
        setUser(currentUser);
      } else {
        console.log("User logged out");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <nav className="navbar navbar-expand-lg py-3">
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

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
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

            {/* Recipes Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setRecipeDropdownOpen(!recipeDropdownOpen);
                  setAccountDropdownOpen(false);
                }}
              >
                Recipes
              </a>

              <ul
                className={`dropdown-menu ${recipeDropdownOpen ? "show" : ""}`}
              >
                <li>
                  <Link className="dropdown-item" to="/adminselectallrecipes">
                    Admin panel
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="/Userercipeupload">
                    Users Uploaded Recipes
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="/CommentDashboard">
                    Comments Dashboard
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="/uploadrecipe">
                    Add Recipe
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="/favorites">
                    Your fav. recipes
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
              >
                Account Details
              </a>

              <ul
                className={`dropdown-menu ${AccountDropdownOpen ? "show" : ""}`}
              >
                <li>
                  <Link className="dropdown-item" to="/login">
                    Login
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="/signup">
                    Signup
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="/editProfileofuser">
                    Edit Profile
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3 mt-lg-0 mt-4">
            <Link className="nav-link" to="/favorites">
              <span className="material-icons-outlined text-danger clickable">
                favorite_border
              </span>
            </Link>

            {auth.currentUser ? (
              <button
                className="btn btn-outline-danger btn-sm rounded-pill px-4 text-light"
                onClick={logout}
              >
                Sign Out
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
