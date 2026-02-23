import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../context/Firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [SucessMessage, setSuccessMessage] = useState("");
  const [strength, setStrength] = useState(0);

  const calculateStrength = (pwd) => {
    let score = 0;

    if (pwd.length >= 6) score += 20;
    if (pwd.length >= 10) score += 20;
    if (/[A-Z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 20;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 20;

    return score;
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setStrength(calculateStrength(pwd));
  };
  
  const getColor = () => {
    if (strength <= 40) return "bg-danger";
    if (strength <= 70) return "bg-warning";
    return "bg-success";
  };
  const Signup_2 = async (e) => {
    e.preventDefault();
    // ... (Your existing logic remains exactly the same)
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (
      trimmedEmail === "" ||
      trimmedUsername === "" ||
      trimmedPassword === ""
    ) {
      setMessage("Enter Empty Fields All Fields");
      return;
    }

    if (trimmedUsername.length < 7 || trimmedUsername.length > 18) {
      setMessage("Username should be between 7-18 characters");
      return;
    }

    if (trimmedPassword.length < 7 || trimmedPassword.length > 14) {
      setMessage("Password should be between 7-14 characters");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        trimmedPassword,
      );
      await updateProfile(userCredential.user, {
        displayName: trimmedUsername,
      });
      setSuccessMessage(
        `Congratulations ${trimmedUsername}, your signup was successful.`,
      );
      navigate("/profileimageupload");
      setMessage("");
      setEmail("");
      setUsername("");
      setPassword("");
    } catch (error) {
      setSuccessMessage("");
      setMessage("Database Connection Error: " + error.message);
    }
  };
  return (
    <div className="login-page">
      {/* Decorative background blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div
        className="container d-flex align-items-center justify-content-center min-vh-100"
        style={{ marginTop: "3vw" }}
      >
        <div className="card login-card animate-fade-in">
          <div className="row g-0">
            {/* Left Side Banner (Same as Login) */}
            <div className="col-lg-6 d-none d-lg-block side-banner">
              <div className="banner-content">
                <h1 className="display-5 fw-bold text-white">
                  Join Our Recipe Community
                </h1>
                <p className="text-white-50">
                  Create your account and start sharing delicious recipes.
                </p>
              </div>
            </div>

            {/* Right Side Signup Form */}
            <div className="col-lg-6 p-4 p-md-5 containerofinput bg-white">
              <h2 className="fw-bold mb-2">
                RecipeHeaven
                <span className="text-danger" style={{ margin: "0px" }}>
                  .
                </span>
              </h2>

              <p className="text-muted mb-4">
                Create your account to access all features.
              </p>

              {message && (
                <div className="alert alert-danger animate-slide-up">
                  {message}
                </div>
              )}

              {SucessMessage && (
                <div className="alert alert-success animate-slide-up">
                  {SucessMessage}
                </div>
              )}

              <form onSubmit={Signup_2}>
                {/* Username */}
                <div className="mb-3 custom-input-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="7-18 characters"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="mb-3 custom-input-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div className="mb-4 custom-input-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="7-14 characters"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <span className="text-muted">Password strength</span>
                <div className="progress" style={{ marginBottom: "2vw" }}>
                  <div
                    className={`progress-bar ${getColor()}`}
                    role="progressbar"
                    style={{ width: `${strength}%` }}
                    aria-valuenow={strength}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>

                <button type="submit" className="btn btn-brand w-100 py-3 mb-3">
                  Create Account
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="small text-muted">
                  Already have an account?{" "}
                  <Link
                    to="/Login"
                    className="text-brand fw-bold text-decoration-none"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
