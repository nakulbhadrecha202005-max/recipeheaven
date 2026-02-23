import React, { useState } from "react";
import "../Styles/UploadRecipe.css"; // Make sure this contains the CSS from my previous response
import { db } from "../context/Firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

//chek user auth
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../context/Firebase";

const UploadRecipe = () => {
  const navigate = useNavigate();

  const [Recipetitle, setRecipetitle] = useState("");
  const [Diatcategory, setDiatcategory] = useState("Veg");
  const [Cookingtime, setCookingtime] = useState("");
  const [Calories, setCalories] = useState("");
  const [Difficulty, setDifficulty] = useState("Easy");
  const [Description, setDescription] = useState("");
  const [Ingredients, setIngredients] = useState("");
  const [Instructions, setInstructions] = useState("");
  const [recipeImage, setRecipeImage] = useState(null);
  const [UserLoginCheck, setUserLoginCheck] = useState("");
  const [Error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const logout = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setUserLoginCheck("Login please to upload your Recipe!!");
        setTimeout(() => {
          navigate("/login");
        }, 7000);
      }
    });
    return () => logout();
  }, []);

  const seterrrofunctionuser = () => {
    setUserLoginCheck("Login please to upload your Recipe!!");
  };
  const handleFileUpload = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "DishImages");
    data.append("cloud_name", "dvoirnqw7");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dvoirnqw7/image/upload",
      {
        method: "POST",
        body: data,
      },
    );

    return await res.json();
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setError("");

    // --- Validation Logic ---
    if (Recipetitle.trim() === "") {
      setError("Recipe Title is Required");
      return;
    }
    if (Recipetitle.trim().length < 5) {
      setError("Min. 5 length Required in Recipe title.");
      return;
    }
    if (!Diatcategory) {
      setError("Please select a Dietary Category");
      return;
    }
    if (Cookingtime.trim() === "") {
      setError("Cooking Time is required");
      return;
    }
    if (Calories.trim() === "") {
      setError("Valid Calories are required");
      return;
    }
    if (isNaN(Calories)) {
      setError("Calories must be required");
      return;
    }
    if (Description.trim().length < 10) {
      setError("Description must be at least 10 characters");
      return;
    }
    if (Ingredients.trim().length < 10) {
      setError("Ingredients must be at least 10 characters");
      return;
    }
    if (Instructions.trim().length < 15) {
      setError("Instructions must be at least 15 characters");
      return;
    }

    setLoading(true);
    try {
      const imageresponse = await handleFileUpload(recipeImage);

      if (!imageresponse.secure_url) {
        throw new Error("Image Upload fail.");
      }
      const docRef = await addDoc(collection(db, "recipyuploadby_user"), {
        email: auth.currentUser.email,
        username: auth.currentUser.displayName,
        photoprofileOf_user: auth.currentUser.photoURL,
        Recipetitle,
        Diatcategory,
        Cookingtime,
        Calories,
        Difficulty,
        Description,
        Ingredients,
        Instructions,
        imageUrl: imageresponse.secure_url,
        createdAt: serverTimestamp(),
      });

      console.log("Document written with ID: ", docRef.id);
      //alert("Recipe Published Successfully!");

      // Reset Form
      setRecipetitle("");
      setCookingtime("");
      setCalories("");
      setDescription("");
      setIngredients("");
      setInstructions("");
      setRecipeImage(null);
    } catch (e) {
      console.error("Error adding document: ", e);
      setError("Recipe or image upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper d-flex align-items-center justify-content-center p-3 p-md-5">
      <div className="main-card bg-white shadow-lg overflow-hidden">
        <div className="row g-0">
          {/* Sidebar Section */}
          <div className="col-lg-4 sidebar-section d-flex flex-column justify-content-between p-5 text-white position-relative">
            <div className="overlay"></div>
            <div className="position-relative z-1">
              <span className="badge-new text-uppercase">New Recipe</span>
              <h2 className="display-5 fw-extrabold mt-4">
                Share your <br />
                culinary art.
              </h2>
            </div>
            <div className="position-relative z-1 d-flex align-items-center opacity-75 small">
              <span className="material-symbols-outlined me-2">
                restaurant_menu
              </span>
              Design inspired by organic kitchens.
            </div>
          </div>

          {/* Form Section */}
          <div className="col-lg-8 p-4 p-md-5">
            {UserLoginCheck && (
              <div className="alert alert-warning">{UserLoginCheck}</div>
            )}
            <form onSubmit={handlesubmit} className="recipe-form">
              {/* Basic Info */}
              <section className="">
                <h3 className="h5 fw-bold text-dark mb-4 d-flex align-items-center">
                  <span className="material-symbols-outlined me-2 text-emerald">
                    info
                  </span>
                  Basic Information
                </h3>
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted">
                      Recipe Title
                    </label>
                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="e.g. Traditional Jain Dal Baati"
                      value={Recipetitle}
                      onChange={(e) => setRecipetitle(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted">
                      Short Description
                    </label>
                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="A brief one-line catchphrase"
                      value={Description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted mb-3">
                      Dietary Category
                    </label>
                    <div className="row g-2">
                      {["Veg", "Satvic", "Jain"].map((diet) => (
                        <div className="col-6 col-md-3" key={diet}>
                          <input
                            type="radio"
                            name="diet"
                            id={diet}
                            className="btn-check"
                            checked={Diatcategory === diet}
                            onChange={() => setDiatcategory(diet)}
                          />
                          <label
                            className="btn btn-outline-custom w-100 p-3 d-flex flex-column align-items-center"
                            htmlFor={diet}
                          >
                            <span className="material-symbols-outlined mb-1">
                              {diet === "Veg"
                                ? "eco"
                                : diet === "Satvic"
                                  ? "sunny"
                                  : diet === "Jain"
                                    ? "psychology_alt"
                                    : "compost"}
                            </span>
                            <span className="text-uppercase tiny-font fw-bold">
                              {diet}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <hr className="my-5 opacity-10" />

              {/* Recipe Content */}
              <section className="mb-5 recipecontent-section">
                <h3 className="h5 fw-bold text-dark mb-4 d-flex align-items-center">
                  <span className="material-symbols-outlined me-2 text-emerald">
                    tapas
                  </span>
                  Recipe Content
                </h3>
                <div className="mb-4">
                  <label className="form-label fw-bold small text-muted">
                    Ingredients
                  </label>
                  <textarea
                    className="form-control custom-input"
                    rows="3"
                    placeholder="2 cups flour. 1 cup sugar."
                    value={Ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                  ></textarea>
                </div>
                <div>
                  <label className="form-label fw-bold small text-muted">
                    Preparation Steps
                  </label>
                  <textarea
                    className="form-control custom-input"
                    rows="4"
                    placeholder="Step 1: Boil the water..."
                    value={Instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  ></textarea>
                </div>
              </section>

              <hr className="my-5 opacity-10" />

              {/* Difficulty & Time */}
              <section className="mb-5 difficulty-time-section">
                <h3 className="h5 fw-bold text-dark mb-4 d-flex align-items-center">
                  <span className="material-symbols-outlined me-2 text-emerald">
                    timer
                  </span>
                  Difficulty & Time
                </h3>
                <div className="row g-4">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-bold small text-muted mb-3">
                      Difficulty Level
                    </label>
                    <div className="row g-2">
                      {["Easy", "Medium", "Hard"].map((level) => (
                        <div className="col-4" key={level}>
                          <input
                            type="radio"
                            name="level"
                            id={level}
                            className="btn-check"
                            checked={Difficulty === level}
                            onChange={() => setDifficulty(level)}
                          />
                          <label
                            className="btn btn-outline-custom w-100 py-2 fw-semibold"
                            htmlFor={level}
                          >
                            {level}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-bold small text-muted">
                      Calories
                    </label>
                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="e.g. 250"
                      value={Calories}
                      onChange={(e) => setCalories(e.target.value)}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted">
                      Cooking Time (mins)
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control custom-input border-end-0"
                        placeholder="45"
                        value={Cookingtime}
                        onChange={(e) => setCookingtime(e.target.value)}
                      />
                      <span
                        className="input-group-text bg-light border-start-0 text-muted small px-3"
                        style={{
                          borderRadius: "0 1rem 1rem 0",
                          border: "2px solid #f3f4f6",
                          borderLeft: "none",
                        }}
                      >
                        mins
                      </span>
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold small text-muted">
                      Cover Image of Your Recipe Dish :{" "}
                    </label>
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control custom-input border-end-0"
                        accept="image/*"
                        onChange={(e) => setRecipeImage(e.target.files[0])}
                        required
                      />
                    </div>
                  </div>
                </div>
              </section>
              {Error && (
                <div className="alert alert-danger mb-4 small fw-bold">
                  {Error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-dark w-100 py-3 fw-bold rounded-4 shadow-sm publish-btn d-flex align-items-center justify-content-center"
              >
                {loading ? "Publishing..." : "Publish Recipe"}
                <span className="material-symbols-outlined ms-2">send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadRecipe;
