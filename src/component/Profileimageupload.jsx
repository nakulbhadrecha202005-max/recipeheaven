// import React, { useState } from "react";
// import { getAuth, updateProfile } from "firebase/auth";

// const Profileimageupload = () => {
//   const [file, setFile] = useState(null);

//   // Upload image to Cloudinary and get URL
//   const uploadImage = async () => {
//     if (!file) {
//       console.error("No file selected for upload.");
//       return null;
//     }

//     const data = new FormData();
//     data.append("file", file);
//     data.append("upload_preset", "DishImages");
//     data.append("cloud_name", "dvoirnqw7");

//     try {
//       const res = await fetch(
//         "https://api.cloudinary.com/v1_1/dvoirnqw7/image/upload",
//         {
//           method: "POST",
//           body: data,
//         },
//       );
//       const result = await res.json();
//       return result.secure_url;
//     } catch (error) {
//       console.error("Upload error:", error);
//       return null;
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const imageUrl = await uploadImage();
//     if (!imageUrl) {
//       console.error("Failed to upload image.");
//       return;
//     }

//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (user) {
//       try {
//         await updateProfile(user, { photoURL: imageUrl });
//         console.log("Profile updated with image URL:", imageUrl);
//       } catch (error) {
//         console.error("Error updating profile:", error);
//       }
//     }
//   };

//   return (
//     <div style={{ margin: "10vw" }}>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label htmlFor="formFile" className="form-label">
//             Enter your profile image here
//           </label>
//           <input
//             className="form-control"
//             type="file"
//             accept="image/*"
//             onChange={(e) => setFile(e.target.files[0])}
//             id="formFile"
//           />
//         </div>

//         <button type="submit" className="btn btn-primary">
//           Upload Profile Image
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Profileimageupload;

import React, { useState, useRef, useEffect } from "react";
import "../Styles/profilepicupload.css";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { auth } from "../context/Firebase";
import { updateProfile } from "firebase/auth";

const ProfileImageUpload = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(
    "https://cdn-icons-png.flaticon.com/512/17561/17561717.png",
  );
  const [errormessage, setErrormessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);

  const uploadImage = async () => {
    if (!file) {
      setErrormessage("Please select an image.");
      return null;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "DishImages");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dvoirnqw7/image/upload",
        {
          method: "POST",
          body: data,
        },
      );

      const result = await res.json();
      return result.secure_url;
    } catch (error) {
      console.error(error);
      setErrormessage("Upload failed.");
      return null;
    }
  };

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser);

      if (currentUser.photoURL) {
        setImage(currentUser.photoURL);
      }
    }
  }, []);

  const handlesubmit = async (e) => {
    e.preventDefault();

    const imageUrl = await uploadImage();
    if (!imageUrl) return;

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      await updateProfile(user, { photoURL: imageUrl });

      setSuccessMessage("Profile image added successfully!");
      navigate("/login");
    }
  };

  const resetImage = () => {
    setImage("https://cdn-icons-png.flaticon.com/512/17561/17561717.png");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  return (
    <div
      id="user-profile-upload-root"
      style={{ margin: "auto", marginTop: "6vw" }}
    >
      <form onSubmit={handlesubmit}>
        <div className="card-container">
          {successMessage && (
            <p className="alert alert-success p-2 m-4 ">{successMessage}</p>
          )}
          {errormessage && (
            <p className="alert alert-danger p-2 m-4">{errormessage}</p>
          )}
          <div className="content-wrapper">
            <h5 className="title" style={{ textAlign: "left" }}>
              Account Photo
            </h5>
            <p className="subtitle" style={{ textAlign: "left" }}>
              Customize your profile appearance
            </p>

            <div className="avatar-wrapper">
              <img src={image} alt="Preview" className="profile-img" />

              <label htmlFor="user-avatar-input" className="upload-badge">
                <i className="bi bi-camera-fill"></i>
              </label>

              <input
                id="user-avatar-input"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  setFile(selectedFile);

                  if (selectedFile) {
                    const reader = new FileReader();
                    reader.onloadend = () => setImage(reader.result);
                    reader.readAsDataURL(selectedFile);
                  }
                }}
                ref={fileInputRef}
                hidden
              />
            </div>

            <div className="user-details">
              <p className="user-name"> {user?.displayName || "No Name"}</p>
              <p className="user-email"> {user?.email}</p>
            </div>

            <div className="action-buttons">
              <button type="submit" className="btn-save-profile">
                Update Profile
              </button>
              <button
                type="button"
                className="btn-remove-profile"
                onClick={resetImage}
              >
                Remove Photo
              </button>
              <Link to="/login" className="btn-remove-profile">
                Skip For Now
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileImageUpload;
