import React from "react";
import { useState, useEffect } from "react";
import { db } from "../context/Firebase";
import { useParams } from "react-router-dom";
import { auth } from "../context/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, getDoc, query, where, doc } from "firebase/firestore";
import { updateDoc, serverTimestamp } from "firebase/firestore";

export default function EditRecipeByUserAndAdmin() {
  const { id } = useParams();
  const navigator = useNavigate();
  const [loading, setloading] = useState(false);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [Allrecipedata, setAllrecipedata] = useState(null); // Initialize as null

  // Input states
  const [Recipetitle, setRecipetitle] = useState("");
  const [Description, setRecipedescription] = useState("");
  const [Ingredients, setIngredients] = useState(""); // Fixed name
  const [Instructions, setInstructions] = useState("");
  const [difficulty, setDifficulty] = useState(""); // Use this one only
  const [DiatCategory_forradiobutton, setDiatCategory_forradiobutton] =
    useState("");
  const [Cookingtime, setCookingtime] = useState("");
  const [Calories, setCalories] = useState("");
  const [preview, setPreview] = useState(
    "https://c8.alamy.com/comp/2HT184P/letter-rh-restaurant-logo-with-chef-hat-spoon-and-fork-template-restaurant-logo-on-letter-rh-barbecue-cafe-logo-vector-2HT184P.jpg",
  );

  useEffect(() => {
    setloading(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User is authenticated:", currentUser.email);
        setloading(false);
      } else {
        console.log("User is not authenticated. Redirecting to login page.");

        setTimeout(() => {
          <div className="alert alert-danger">
            Login to access full website features
          </div>;
        }, 3000);
        navigator("/login");
        setloading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetch_recipe_details = async () => {
      try {
        setloading(true);
        const docRef = doc(db, "recipyuploadby_user", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAllrecipedata(data);

          // Map database fields to your local state
          setRecipetitle(data.Recipetitle || "");
          setRecipedescription(data.Description || "");
          setIngredients(data.Ingredients || "");
          setInstructions(data.Instructions || "");
          setCookingtime(data.Cookingtime || "");
          setCalories(data.Calories || "");
          setDifficulty(data.Difficulty || ""); // Matches DB key
          setDiatCategory_forradiobutton(data.Diatcategory || "");
          if (data.imageUrl) setPreview(data.imageUrl);
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setloading(false);
      }
    };
    fetch_recipe_details();
  }, [id]);

  const uploadImageToCloudinary = async () => {
    if (!image) return Allrecipedata.imageUrl;

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "DishImages"); // change this
    formData.append("cloud_name", "dvoirnqw7"); // change this

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dvoirnqw7/image/upload`, // FIXED cloud name
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await response.json();

      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return Allrecipedata.imageUrl;
    }
  };
  const updateallrecipedata = async (e) => {
    e.preventDefault();
    setloading(true);

    try {
      const imageUrl = await uploadImageToCloudinary();
      const recipeRef = doc(db, "recipyuploadby_user", id);

      await updateDoc(recipeRef, {
        Recipetitle,
        Description,
        Ingredients,
        Instructions, // FIXED: Now using the state variable
        Difficulty: difficulty, // FIXED: Using the radio button state
        Diatcategory: DiatCategory_forradiobutton,
        Cookingtime,
        Calories,
        imageUrl,
        updatedAt: serverTimestamp(), // Better to use updatedAt for edits
        updatedBy: auth.currentUser.email,
      });

      alert("Recipe Updated Successfully");
      navigator(-1); // Go back to previous page
    } catch (err) {
      console.error(err);
      alert("Error updating recipe: " + err.message);
    } finally {
      setloading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "15vh",
          marginTop: "10vw",
          marginBottom: "10vw",
        }}
      >
        <div className="spinner-border text-dark m-3"></div>
      </div>
    );
  }

  if (Allrecipedata === null)
    return (
      <div className="text-center text-primary" style={{ margin: "20vw" }}>
        Loading Please wait....
      </div>
    );

  const handleimagechange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className="recipe-edit-wrapper py-5"
      id="containeredit_profile"
      style={{ marginTop: "10vw" }}
    >
      <form
        className="container shadow-lg p-4 p-md-5 rounded-4 bg-white formwidth"
        onSubmit={updateallrecipedata}
        style={{ maxWidth: "90vw" }}
      >
        {Allrecipedata && (
          <div key={Allrecipedata.id}>
            <div className="d-flex align-items-center mb-4">
              <i className="bi bi-pencil-square text-warning fs-1 me-3"></i>
              <div>
                <h2 className="fw-bold mb-0 text-muted">Edit Your Recipe</h2>
                <p className="text-muted">
                  Keep your audience updated with the latest steps.
                </p>
              </div>
            </div>

            <hr className="mb-4" />

            <div className="row g-4">
              {/* Image Section */}
              <div className="col-12 text-center mb-2">
                <div className="image-preview-container position-relative d-inline-block">
                  <img
                    src={preview}
                    alt="Recipe Preview"
                    className="img-thumbnail shadow-sm mb-3"
                    style={{
                      width: "40vw",
                      height: "30vw",
                      objectFit: "cover",
                      borderRadius: "2rem",
                    }}
                  />
                  <div className="mt-2">
                    <label
                      htmlFor="image"
                      className="btn btn-outline-warning btn-sm"
                    >
                      <i className="bi bi-camera-fill me-2"></i> Change Cover
                      Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleimagechange}
                      className="form-control d-none"
                      id="image"
                    />
                  </div>
                </div>
              </div>

              {/* Title and Description */}
              <div className="col-12">
                <label htmlFor="Recipetitle" className="form-label fw-semibold">
                  <i className="bi bi-type text-primary me-2"></i>Recipe Title
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg border-2"
                  id="Recipetitle"
                  placeholder="e.g. Spicy Paneer Tikka"
                  value={Recipetitle}
                  onChange={(e) => setRecipetitle(e.target.value)}
                />
              </div>

              <div className="col-12">
                <label
                  htmlFor="Recipedescription"
                  className="form-label fw-semibold"
                >
                  <i className="bi bi-card-text text-primary me-2"></i>Short
                  Description
                </label>
                <textarea
                  className="form-control border-2"
                  id="Recipedescription"
                  rows="3"
                  value={Description}
                  onChange={(e) => setRecipedescription(e.target.value)}
                />
              </div>

              {/* Cooking Details Row */}
              <div className="col-md-6">
                <label htmlFor="Cookingtime" className="form-label fw-semibold">
                  <i className="bi bi-clock-history text-warning me-2"></i>
                  Cooking Time (mins)
                </label>
                <input
                  type="number"
                  className="form-control border-2"
                  id="Cookingtime"
                  value={Cookingtime}
                  onChange={(e) => setCookingtime(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="Calories" className="form-label fw-semibold">
                  <i className="bi bi-fire text-danger me-2"></i>Calories
                </label>
                <input
                  type="number"
                  className="form-control border-2"
                  id="Calories"
                  value={Calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>

              {/* Ingredients & Instructions */}
              <div className="col-12">
                <label htmlFor="Ingredients" className="form-label fw-semibold">
                  <i className="bi bi-list-check text-success me-2"></i>
                  Steps of Cooking
                </label>
                <textarea
                  className="form-control border-2 bg-light"
                  rows="4"
                  value={Ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  id="Ingredients"
                />
              </div>

              {/* Category Section */}
              <div className="col-md-6">
                <label className="form-label fw-bold d-block mb-3">
                  Difficulty Level
                </label>
                <div className="btn-group w-100" role="group">
                  {["Easy", "Medium", "Hard"].map((lvl) => (
                    <React.Fragment key={lvl}>
                      <input
                        type="radio"
                        className="btn-check"
                        name="Difficulty"
                        id={lvl}
                        value={lvl}
                        checked={difficulty === lvl}
                        onChange={(e) => setDifficulty(e.target.value)}
                      />
                      <label
                        className="btn btn-outline-secondary"
                        htmlFor={lvl}
                      >
                        {lvl}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold d-block mb-3">
                  Diet Category
                </label>
                <div className="btn-group w-100" role="group">
                  {["Satvik", "Veg", "Jain"].map((cat) => (
                    <React.Fragment key={cat}>
                      <input
                        type="radio"
                        className="btn-check"
                        name="dietCategory"
                        id={cat}
                        value={cat}
                        checked={DiatCategory_forradiobutton === cat}
                        onChange={(e) =>
                          setDiatCategory_forradiobutton(e.target.value)
                        }
                      />
                      <label className="btn btn-outline-success" htmlFor={cat}>
                        {cat}
                      </label>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Date and Error */}
              <div className="col-12 mt-3 text-left">
                <small className="text-muted d-block mb-2">
                  <i className="bi bi-calendar-event me-2"></i>
                  Created on:{" "}
                  {Allrecipedata.createdAt
                    ? typeof Allrecipedata.createdAt.toDate === "function"
                      ? Allrecipedata.createdAt
                          .toDate()
                          .toLocaleDateString("en-GB")
                      : new Date(Allrecipedata.createdAt).toLocaleDateString(
                          "en-GB",
                        )
                    : "No date"}
                </small>
                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}
              </div>

              <div className="col-12 mt-4">
                <button
                  type="submit"
                  className="btn btn-warning btn-lg w-100 fw-bold text-white shadow-sm py-3"
                >
                  <i className="bi bi-cloud-upload-fill me-2"></i> Save Changes
                </button>
                <br />
                <br />
                <button className="btn btn-primary w-100 fw-bold text-white shadow-sm py-3 ">
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
