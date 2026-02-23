import { useState, useEffect } from "react";
import { auth } from "../context/Firebase";
import { updateProfile, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../Styles/profileimage.css";
export default function EditProfileofuser() {
  const navigator = useNavigate();
  const [user, setUser] = useState(null);

  const defaultImage =
    "https://cdn-icons-png.flaticon.com/512/17561/17561717.png";
  const [userimage, setuserimages] = useState(defaultImage);
  const [imageFile, setImageFile] = useState(null);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const unsubscibe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUsername(currentUser?.displayName || "");
        setuserimages(currentUser?.photoURL || defaultImage);
        setUser(currentUser);
        console.log("Current user:", currentUser);
      } else {
        alert("User not found. Please log in again.");
        navigator("/login");
        console.log("Current user Error ");
      }
      setIsAuthenticating(false);
    });

    return () => unsubscibe();
  }, []);

  if (isAuthenticating) {
    return <div className="alert alert-info">Loding...</div>;
  }

  if (!user) {
    return <div className="alert alert-danger">Please Login</div>;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);

      const previewUrl = URL.createObjectURL(file);
      setuserimages(previewUrl);
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) return user?.photoURL; // No new image to upload
    const formdata = new FormData();
    formdata.append("file", imageFile);
    formdata.append("upload_preset", "DishImages"); // Replace with your Cloudinary upload preset
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dvoirnqw7/image/upload",
      {
        method: "POST",
        body: formdata,
      },
    );
    const data = await res.json();
    return data.secure_url; // Return the uploaded image URL
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    try {
      const photourl = await uploadImageToCloudinary();
      await updateProfile(user, {
        displayName: username,
        photoURL: photourl,
      });
      setuserimages(photourl);
      setImageFile(null); // Clear the selected file after upload
      alert("Photo and username updated successfully!");
    } catch (err) {
      setError("Failed to update profile: " + err.message);
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await updateProfile(user, {
        photoURL: defaultImage,
      });
      setuserimages(defaultImage);
      alert("Profile picture removed successfully!");
    } catch (err) {
      setError("Failed to remove profile picture: " + err.message);
      console.error("Error removing profile picture:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <br />
        <br />
        <form id="profile-card" className="text-center">
          {/* Error Alert */}
          {error && (
            <div
              className="alert alert-danger d-flex align-items-center"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div>{error}</div>
            </div>
          )}

          {/* Profile Picture Section */}
          <div className="avatar-section mb-4">
            <div className="avatar-wrapper">
              <img
                id="profile-image"
                src={userimage}
                alt="Profile"
                height="130px"
                width="130px"
                className="rounded-circle"
              />
            </div>
            <div className="mt-2">
              <label
                htmlFor="file-upload"
                className="btn btn-outline-secondary btn-sm "
                style={{ marginTop: "-2vw" }}
              >
                <i className="bi bi-camera me-2"></i> Change Photo
              </label>
              <input
                id="file-upload"
                type="file"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="text-start">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                <i className="bi bi-envelope-at text-muted"></i> Email Address
              </label>
              <small className="text-muted mx-2">Email cannot be changed</small>
              <input
                type="email"
                id="email"
                className="form-control readonly-input"
                value={user?.email || ""}
                readOnly
              />
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="form-label">
                <i className="bi bi-person-badge text-success"></i> Username
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* Metadata Section - Single Line */}
          <div className="card-footer bg-transparent border-0 pt-0 mb-4 d-flex flex-wrap gap-3">
            <div className="metadata-text text-muted">
              <i className="bi bi-calendar-check me-1"></i> Joined:
              <span className="ms-1 fw-bold text-dark">
                {new Date(user.metadata.creationTime).toLocaleDateString()}
              </span>
            </div>
            <div className="metadata-text text-muted">
              <i className="bi bi-clock-history me-1"></i> Last login:
              <span className="ms-1">
                {new Date(user.metadata.lastSignInTime).toLocaleString()}
              </span>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="d-grid gap-2">
            <button
              type="button"
              className="btn btn-brand-save shadow-sm"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : (
                <i className="bi bi-check2-circle me-2"></i>
              )}
              Save Changes
            </button>

            <button
              type="button"
              className="btn btn-brand-remove mt-2"
              disabled={loading}
              onClick={handleRemove}
            >
              <i className="bi bi-trash3 me-2"></i> Remove Picture
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
