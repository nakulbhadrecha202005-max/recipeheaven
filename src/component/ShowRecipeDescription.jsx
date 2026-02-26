import React from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../context/Firebase";
import { useState, useEffect } from "react";
import "../Styles/ShowRecipeDescription.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../context/Firebase";
import Comments from "./Comments";

const ShowRecipeDescription = () => {
  const { id } = useParams();
  const [data, setdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User is authenticated:", currentUser.displayName);
        setUser(currentUser.displayName);
        //console.log(user.photoURL);

        // Redirect to login page or handle as needed
      } else {
        alert("login First");
        console.log("User is not authenticated. Redirecting to login page.");
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, "recipyuploadby_user", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setdata({ id: docSnap.id, ...docSnap.data() });
        } else {
          setdata(null);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setdata(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "15vh",
          marginTop: "10vw",
        }}
      >
        <div className="spinner-border text-dark m-3"></div>
      </div>
    );
  }
  if (data === null)
    return <div className="text-center mt-5">Recipe Not Found</div>;

  return (
    <div className="rdp-page-wrapper" style={{ marginTop: "4vw" }}>
      {/* --- HERO SECTION --- */}
      <section className="rdp-hero-section">
        <div className="rdp-hero-blur"></div>
        <div className="rdp-hero-container">
          <div className="rdp-hero-content">
            <div className="mb-3">
              <span className="rdp-tag-badge">{data?.Diatcategory}</span>
              <span className="ms-3 text-white-50 small">
                {data?.createdAt?.toDate().toLocaleDateString()}
              </span>
            </div>
            <h1 className="rdp-hero-title">
              {data?.Recipetitle.split(" ")[0]}{" "}
              <span className="rdp-text-highlight">
                {data?.Recipetitle.split(" ").slice(1).join(" ")}
              </span>
            </h1>
            <p className="rdp-hero-subtitle">{data?.Description}</p>

            <div className="rdp-stats-row">
              <div className="rdp-stat-card">
                <div className="rdp-stat-label">Rating</div>
                <div className="rdp-stat-value text-warning">4.7</div>
              </div>
              <div className="rdp-stat-card">
                <div className="rdp-stat-label">Calories</div>
                <div className="rdp-stat-value">{data?.Calories}</div>
              </div>
              <div className="rdp-stat-card">
                <div className="rdp-stat-label">Time</div>
                <div className="rdp-stat-value">
                  {data.Cookingtime} &nbsp; min
                </div>
              </div>
            </div>
          </div>

          <div className="rdp-chef-card">
            <div className="rdp-img-frame">
              <img src={data.imageUrl} alt={data.Recipetitle} />
            </div>
            <div className="rdp-chef-info">
              <img
                src={
                  data.photoURL ||
                  "https://cdn-icons-png.flaticon.com/512/17561/17561717.png"
                }
                alt="Chef"
                className="rdp-chef-avatar"
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                  Curated by {user}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- DETAILS SECTION --- */}
      <div className="rdp-grid-container">
        <div className="row g-4">
          {/* Ingredients Column */}
          <div className="col-lg-4">
            <div className="rdp-content-card">
              <h4 className="rdp-section-title" style={{ fontSize: "1.5rem" }}>
                <span className="material-symbols-outlined me-2">
                  shopping_basket
                </span>
                Ingredients
              </h4>
              <ul className="list-unstyled">
                {data?.Ingredients.split(".")
                  .filter((newliine) => newliine.trim())
                  .map((ingredient, idx) => (
                    <li
                      key={idx}
                      className="py-3 border-bottom d-flex align-items-center"
                      style={{ color: "#374151", fontSize: "1rem" }}
                    >
                      <span className="rdp-text-highlight me-3">✔</span>{" "}
                      {ingredient}
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Instructions Column */}
          <div className="col-lg-8">
            <div className="rdp-content-card">
              <h4 className="rdp-section-title" style={{ fontSize: "1.5rem" }}>
                <span className="material-symbols-outlined me-2">
                  menu_book
                </span>
                Preparation
              </h4>
              {data?.Instructions.split(".")
                .filter((s) => s.trim())
                .map((step, idx) => (
                  <div key={idx} className="d-flex mb-4">
                    <div className="me-3">
                      <span className="rdp-step-number">{idx + 1}</span>
                    </div>
                    <p className="rdp-instruction-text">{step.trim()}.</p>
                  </div>
                ))}
            </div>
          </div>
          <Comments recipeId={id} />
        </div>
      </div>
    </div>
  );
};

export default ShowRecipeDescription;
