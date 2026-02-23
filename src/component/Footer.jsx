import React from "react";
import "../Styles/Footerstyle.css"; // Ensure this path is correct
import ShinyText from "../Reactbiits/Shinytext";
export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="row g-5">
          {/* Brand Section */}
          <div className="col-lg-5 col-md-12">
            <a
              href="#"
              className="fs-2 text-white text-decoration-none fw-bold Footer-brand"
            >
              <ShinyText
                text="RecipeHeaven"
                speed={4}
                delay={-1}
                color="#2A9D8F"
                shineColor="#ffffff"
                spread={120}
                direction="left"
                yoyo={false}
                pauseOnHover={false}
                disabled={false}
              />
              <span className="text-danger">.</span>
            </a>
            <p className="mt-3 mb-4">
              Helping home cooks find joy in the kitchen since 2024. Simple
              recipes, gourmet taste.
            </p>
          </div>

          {/* Links Section 1 */}
          <div className="col-lg-2 col-6">
            <h6 className="text-white fw-bold mb-4">Quick Links</h6>
            <nav>
              <a href="#" className="footer-link">
                Latest Recipes
              </a>
              <a href="#" className="footer-link">
                Cooking Tips
              </a>
              <a href="#" className="footer-link">
                About Us
              </a>
            </nav>
          </div>

          {/* Links Section 2 */}
          <div className="col-lg-2 col-6">
            <h6 className="text-white fw-bold mb-4">Legal</h6>
            <nav>
              <a href="#" className="footer-link">
                Privacy Policy
              </a>
              <a href="#" className="footer-link">
                Terms of Use
              </a>
              <a href="#" className="footer-link">
                Cookie Policy
              </a>
            </nav>
          </div>

          {/* Newsletter Section */}
          <div className="col-lg-3 col-md-12">
            <h6 className="text-white fw-bold mb-4">Get Our Newsletter</h6>
            <div className="d-flex shadow-sm">
              <input
                type="email"
                className="form-control"
                placeholder="Your Email"
                aria-label="Email for newsletter"
              />
              <button className="btn btn-danger px-3">
                <span className="material-icons-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-top mt-5 pt-4 text-center">
          <p className="small">
            &copy; {new Date().getFullYear()} RecipeHeaven Brand. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
