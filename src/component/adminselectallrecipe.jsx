// App.js
import React, { useEffect, useState } from "react";
import { db } from "../context/Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth } from "../context/Firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";

import "../Styles/adminserrrecipes.css";
function Adminselectallrecipe() {
  const navigator = useNavigate();
  const [data, setData] = useState([]);
  const [Searchitemofuser_text, setSearchitemofuser_text] = useState("");

  const [loadingfor_username, setLoadingfor_username] = useState(true);
  const [user, setUser] = useState(null);
  const [Error, setError] = useState("");

  //checkuser authentication of user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (
        currentUser &&
        currentUser.displayName === "nakulbhadrecha" &&
        currentUser.email === "nakulbhadrecha9@gmail.com"
      ) {
        console.log("User is authenticated:", currentUser.displayName);
        setUser(currentUser.displayName);
        console.log(currentUser.email);
        // Redirect to login page or handle as needed
      } else {
        console.log("User is not authenticated. Redirecting to login page.");
        setUser(null);
        setError("Admin is not login. Denied Unauthorised access.");
        navigator("/home");
      }
      setLoadingfor_username(false);
    });
    return () => unsubscribe();
  }, []);

  async function fetchData_ofsearch(searchQuery = "") {
    setLoadingfor_username(true);
    const reference_of_collection = collection(db, "recipyuploadby_user");
    let q = query(reference_of_collection);

    if (searchQuery.trim() !== "") {
      q = query(
        reference_of_collection,
        where("Recipetitle", ">=", searchQuery),
        where("Recipetitle", "<=", searchQuery + "\uf8ff"),
      );
    }

    const querySnapshot = await getDocs(q);
    const list_ofsearchitem = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setData(list_ofsearchitem);
    setLoadingfor_username(false);
  }

  function submit_search_resultsby_user(e) {
    e.preventDefault();
    fetchData_ofsearch(Searchitemofuser_text);
  }

  async function deleterecipes(id) {
    await deleteDoc(doc(db, "recipyuploadby_user", id));
    alert("Recipe Deleted");
    navigator("/adminselectallrecipes");
    fetchData_ofsearch("");
  }

  useEffect(() => {
    fetchData_ofsearch("");
  }, []);

  if (loadingfor_username) {
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
  return (
    <div className="admin-panel-bg">
      <style>
        {`
          #social-admin-ui {
            background-color: #f0f2f5 !important;
            min-height: 100vh !important;
            padding: 20px !important;
            font-family: -apple-system, sans-serif !important;
          }

          /* SEARCH BAR - IG STYLE */
          #social-admin-ui .search-container {
            display: flex !important;
            background: white !important;
            padding: 10px !important;
            border-radius: 12px !important;
            border: 1px solid #dbdbdb !important;
            margin-bottom: 30px !important;
          }

          #social-admin-ui #recipe-search-field {
            background: #efefef !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 8px 15px !important;
            width: 100% !important;
          }

          #social-admin-ui .btn-green {
            background-color: #0095f6 !important; /* IG Blue */
            border: none !important;
            border-radius: 8px !important;
            margin-left: 10px !important;
            font-weight: 600 !important;
          }

          /* GRID & CARDS - FB FEED STYLE */
          #social-admin-ui .recipe-grid {
            display: grid !important;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
            gap: 20px !important;
          }

          #social-admin-ui .recipe-card {
            background: white !important;
            border: 1px solid #dbdbdb !important;
            border-radius: 12px !important;
            overflow: hidden !important;
          }

          #social-admin-ui .image-box img {
            width: 100% !important;
            height: 200px !important;
            object-fit: cover !important;
          }

          #social-admin-ui .card-body {
            padding: 15px !important;
          }

          #social-admin-ui .card-title {
            font-weight: 700 !important;
            font-size: 1.1rem !important;
            color: #262626 !important;
          }

          /* FOOTER ACTIONS */
          #social-admin-ui .card-footer {
            display: flex !important;
            padding: 10px !important;
            gap: 10px !important;
            background: #fafafa !important;
            border-top: 1px solid #efefef !important;
          }

          #social-admin-ui .btn-edit-action {
            background: #e4e6eb !important; /* FB Gray */
            color: #050505 !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            padding: 8px !important;
            flex: 1 !important;
          }

          #social-admin-ui .btn-delete-action {
            background: transparent !important;
            border: none !important;
            color: #ed4956 !important; /* IG Red */
            font-size: 1.2rem !important;
          }
        `}
      </style>
      <div className="admin-wrapper">
        <div className="admin-header-section" style={{ marginBottom: "20px" }}>
          <h2
            style={{
              color: "#2c3e50",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <i className="bi bi-journal-text text-success"></i>
            Recipe Admin
          </h2>
        </div>
        {Error && <div className="alert alert-danger">{Error}</div>}
        {/* Search Section - Responsive Column on Mobile */}
        <form
          className="search-container"
          onSubmit={submit_search_resultsby_user}
        >
          <div className="search-container">
            <input
              id="recipe-search-field"
              type="text"
              value={Searchitemofuser_text}
              placeholder="Find a recipe..."
              onChange={(e) => setSearchitemofuser_text(e.target.value)}
            />

            <button
              type="submit"
              className="btn btn-green"
              style={{ backgroundColor: "#2A9D8F" }}
            >
              <i className="bi bi-search m-2" style={{ color: "white" }}></i>
              <span style={{ color: "white" }}>Search</span>
            </button>
          </div>
        </form>

        {/* Grid adapts from 1 column to 3+ columns automatically */}
        <div className="recipe-grid">
          {data.map((item) => (
            <div className="recipe-card" key={item.id}>
              <div className="image-box">
                <img
                  src={
                    item.imageUrl ||
                    "https://via.placeholder.com/400x200?text=Food"
                  }
                  alt={item.Recipetitle}
                />
              </div>

              <div
                className="card-body"
                style={{ backgroundColor: "#fdfcf073" }}
              >
                <h3
                  className="card-title"
                  style={{ fontSize: "1.1rem", marginBottom: "5px" }}
                >
                  {item.Recipetitle}
                </h3>
                <p
                  className="card-desc"
                  style={{
                    fontSize: "0.85rem",
                    color: "#666",
                    marginBottom: "15px",
                  }}
                >
                  {item.Description}
                </p>

                <div className="meta-info">
                  <span>
                    <i className="bi bi-person"></i> {user}
                  </span>
                  <span>
                    <i className="bi bi-clock"></i> {item.Cookingtime}m
                  </span>
                  <span
                    style={{
                      color: item.Difficulty === "Hard" ? "#e74c3c" : "#27ae60",
                    }}
                  >
                    <i className="bi bi-reception-3"></i> {item.Difficulty}
                  </span>
                </div>
              </div>

              <div className="card-footer">
                <Link
                  to={`/EditRecipeByUserAndAdmin/${item.id}`}
                  className="btn-edit-action"
                  style={{
                    textDecoration: "none",
                    textAlign: "center",
                    flex: 1,
                    backgroundColor: "white",
                  }}
                >
                  <i className="bi bi-pencil"></i> Edit
                </Link>
                <button
                  className="btn-delete-action"
                  onClick={() => deleterecipes(item.id)}
                >
                  <i className="bi bi-trash3"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Adminselectallrecipe;
