import React from "react";
import { useState } from "react";
import "../Styles/Loginstyle.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../context/Firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [Firebaseerror, setFirebaseerror] = useState("");

  const [Erroremail, setErroremail] = useState("");
  const [ErrorPassword, setErrorPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (email.trim() === "") {
      setLoading(false);
      setErroremail("--Email Required");
      return;
      //setLoading(true);
    }
    if (password.trim().length < 6 && password.trim().length() > 16) {
      setLoading(false);
      setErrorPassword("--Password Required (6-13)");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Success! Welcome to the kitchen.");
      navigate("/home");
    } catch (error) {
      setFirebaseerror(
        "Upps! Something Went Wrong , Please Enter a Valid Email and Password. ",
      );
      console.log("Firebase LoginAuth Error : ", error.message);
      navigate("/login");
    }
    setLoading(false);
  };
  return (
    <>
      <div className="login-page">
        {/* Decorative background blobs */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>

        <div className="container d-flex align-items-center justify-content-center min-vh-100">
          <div className="card login-card animate-fade-in">
            <div className="row g-0">
              {/* Left side: Brand Image */}
              <div className="col-lg-6 d-none d-lg-block side-banner">
                <div className="banner-content">
                  <h1 className="display-5 fw-bold text-white">
                    Unlock Your Inner Chef
                  </h1>
                  <p className="text-white-50">
                    Discover, Create, and Share delicious recipes with our
                    community.
                  </p>
                </div>
              </div>

              {/* Right side: Login Form */}
              <div className="col-lg-6 p-4 p-md-5 containerofinput bg-white">
                {/* <div className="brand-logo mb-4">
                  <span className="material-symbols-outlined me-2"></span>
                  <span className="brand-name">RecipeHeaven</span>
                </div> */}

                <h2 className="fw-bold mb-2">
                  RecipeHeaven
                  <span className="text-danger" style={{ margin: "0px" }}>
                    .
                  </span>
                </h2>
                <p className="text-muted mb-4">
                  Login access all features of this website.
                </p>

                <form className="login-form">
                  <div className="mb-3 custom-input-group">
                    <label className="form-label">Email Address</label>{" "}
                    {Erroremail && (
                      <label className="mx-2 p-2 text-danger ">
                        {Erroremail}
                      </label>
                    )}
                    <input
                      type="email"
                      className="form-control"
                      placeholder="name@example.com"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="mb-4 custom-input-group">
                    <label className="form-label">Password</label>
                    {ErrorPassword && (
                      <label className="mx-2 p-2 text-danger ">
                        {ErrorPassword}
                      </label>
                    )}
                    <input
                      type="password"
                      className="form-control"
                      placeholder="••••••••"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleLogin}
                    className="btn btn-brand w-100 py-3 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                {message && (
                  <div className="alert alert-success animate-slide-up">
                    {message}
                  </div>
                )}
                {Firebaseerror && (
                  <div className="alert alert-danger animate-slide-up">
                    {Firebaseerror}
                  </div>
                )}
                <div className="text-center mt-4">
                  <p className="small text-muted">
                    New here?{" "}
                    <Link
                      to="/Signup"
                      className="text-brand fw-bold text-decoration-none"
                    >
                      Signup?
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
