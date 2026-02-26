import React, { useState, useEffect } from "react";
import "../Styles/Home.css";
import { db } from "../context/Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Adminselectallrecipe from "./adminselectallrecipe";
import { onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { auth } from "../context/Firebase";
import { div } from "motion/react-client";
const Home = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState([]);

  const [favorites, setFavorites] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setloading(true);
      const snapshotusersrecipe = await getDocs(
        collection(db, "recipyuploadby_user"),
      );

      const userdata = snapshotusersrecipe.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setloading(false);
      setUser(userdata);
    };

    getUser();
  }, []);

  //realtime fetching all recipies
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "users", user.uid, "favorites"),
      (snapshot) => {
        const favIds = snapshot.docs.map((doc) => doc.id);
        setFavorites(favIds);
      },
    );

    return () => unsubscribe();
  }, []);

  const toggleFavorite = async (recipe) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Login first for add to cart");
      return;
    }
    const favRef = doc(db, "users", user.uid, "favorites", recipe.id);

    if (favorites.includes(recipe.id)) {
      await deleteDoc(favRef);
    } else {
      await setDoc(favRef, {
        title: recipe.Recipetitle,
        imageUrl: recipe.imageUrl,
        createdAt: new Date(),
      });
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
          color: "black",
        }}
      >
        <div className="spinner-border text-dark m-3"></div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <header
        className="hero-section mb-5"
        style={{
          background: "linear-gradient(180deg, #fff 0%, #f9fbfb 100%)",
          padding: "60px 0",
        }}
      >
        <style>
          {`
      .category-btn {
        padding: 12px 30px !important;
        border-radius: 50px !important;
        font-weight: 700 !important;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        border: 2px solid transparent !important;
        box-shadow: 0 4px 15px rgba(0,0,0,0.05) !important;
        white-space: nowrap !important;
      }

      .category-btn:hover {
        transform: translateY(-5px) !important;
        box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
      }

      /* Specific Styles for Buttons */
      .btn-satvic {
        background: #E9F5F2 !important;
        color: #2A9D8F !important;
        border-color: #2A9D8F !important;
      }

      .btn-jain {
        background: #FFF4E6 !important;
        color: #F4A261 !important;
        border-color: #F4A261 !important;
      }

      .btn-veg {
        background: #F1F8E9 !important;
        color: #558B2F !important;
        border-color: #558B2F !important;
      }

      /* Mobile adjustment for button group */
      @media (max-width: 768px) {
        .button-group-responsive {
          display: flex !important;
          flex-wrap: wrap !important;
          justify-content: center !important;
          gap: 12px !important;
        }
        .category-btn {
          width: 140px !important; /* Fixed width on mobile for symmetry */
          justify-content: center !important;
          padding: 10px 15px !important;
          font-size: 0.9rem !important;
        }
      }
    `}
        </style>

        <div className="container" style={{ marginTop: "10vh" }}>
          <div className="row align-items-center text-center text-lg-start">
            <div className="col-lg-7">
              <div className="text-secondary">
                {auth.currentUser && (
                  <div className="text-secondary">
                    Hello {auth.currentUser.displayName || ""} !
                  </div>
                )}
              </div>
              <h1
                className="display-4 fw-bold mb-4"
                style={{ letterSpacing: "-1.5px" }}
              >
                Master the Art of{" "}
                <span style={{ color: "#2A9D8F" }}>Home Cooking</span>
              </h1>
              <p className="lead text-muted mb-5">
                Join 1,000+ daily enthusiasts sharing professional-grade
                recipes. Discover meals tailored to your lifestyle.
              </p>

              {/* --- ATTRACTIVE BUTTON GROUP --- */}
              {/* <div className="button-group-responsive d-flex gap-3 mt-4">
                <button
                  className="btn category-btn btn-satvic"
                  onClick={() => fetchByCategory("Satvic")}
                >
                  <i className="bi bi-flower1"></i> Satvic
                </button>

                <button
                  className="btn category-btn btn-jain"
                  onClick={() => fetchByCategory("Jain")}
                >
                  <i className="bi bi-brightness-high"></i> Jain
                </button>

                <button
                  className="btn category-btn btn-veg"
                  onClick={() => fetchByCategory("Pure Veg")}
                >
                  <i className="bi bi-leaf"></i> Pure Veg
                </button>
                <button
                  className="btn category-btn btn-veg"
                  onClick={() => fetchAllRecipes()}
                >
                  <i className="bi bi-leaf"></i> View All
                </button>
              </div> */}
            </div>

            <div className="col-lg-5 d-none d-lg-block">
              <div className="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80"
                  className="img-fluid rounded-4 shadow-lg"
                  alt="Kitchen"
                  style={{ border: "8px solid white" }}
                />
                {/* Decorative element */}
                <div className="position-absolute bottom-0 start-0 m-3 badge bg-white text-dark p-3 shadow rounded-3">
                  <span className="fw-bold text-success">100% Healthy</span>
                  <div className="small text-muted">Curated by Experts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container pb-5">
        <div className="row g-4">
          {/* //firebase All recipe */}
          {user.map((allusers) => (
            <div key={allusers.id} className="col-12 col-md-6 col-lg-4">
              <div className="card recipe-card">
                <div className="card-img-container">
                  <img src={allusers.imageUrl} alt={allusers.Recipetitle} />
                </div>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold mb-0">{allusers.Recipetitle}</h5>
                    <span
                      className="material-icons-outlined heart-icon"
                      style={{
                        cursor: "pointer",
                        color: favorites.includes(allusers.id) ? "red" : "gray",
                      }}
                      onClick={() => toggleFavorite(allusers)}
                    >
                      {favorites.includes(allusers.id)
                        ? "favorite"
                        : "favorite_border"}
                    </span>
                  </div>
                  <p className="text-muted small mb-4">
                    {allusers.Description}
                  </p>

                  <div className="row g-2 mb-4">
                    <div className="col-4">
                      <div className="meta-pill">
                        <span className="material-icons-outlined meta-icon">
                          schedule
                        </span>
                        {allusers.Cookingtime}
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="meta-pill">
                        <span className="material-icons-outlined meta-icon">
                          local_fire_department
                        </span>
                        {allusers.Calories}
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="meta-pill">
                        <span className="material-icons-outlined meta-icon">
                          restaurant
                        </span>
                        {allusers.Difficulty}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                    <div className="d-flex align-items-center">
                      <img
                        src={
                          allusers.photoprofileOf_user ||
                          "https://cdn-icons-png.flaticon.com/512/17561/17561717.png"
                        }
                        className="author-avatar me-2 p-1"
                      />

                      <div className="small">
                        <div className="fw-bold" id="idname">
                          {allusers.username}
                        </div>
                        {/* <div
                          className="text-warning d-flex align-items-center material-iconsmain"
                          style={{ fontSize: "12px" }}
                        >
                          <span
                            className="material-icons"
                            style={{ fontSize: "14px" }}
                          >
                            star
                          </span>
                          {recipe.rating} ({recipe.reviews}) 4.5(128)
                        </div> */}
                      </div>
                    </div>
                    <button
                      className="btn btn-brand-view btn-sm"
                      onClick={() =>
                        navigate(`/showrecoipedescription/${allusers.id}`)
                      }
                    >
                      View Recipe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
