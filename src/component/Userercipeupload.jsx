import React, { useEffect, useState } from "react";
import { db } from "../context/Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth } from "../context/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";

import "../Styles/adminserrrecipes.css";

function Userrecipeupload() {
  const navigator = useNavigate();
  const [data, setData] = useState([]);
  const [Searchitemofuser_text, setSearchitemofuser_text] = useState("");
  const [loadingfor_username, setLoadingfor_username] = useState(true);
  const [user, setUser] = useState(null);
  const [Error, setError] = useState("");

  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email) {
        setUser(currentUser.displayName);
      } else {
        setUser(null);
        setError("Unauthorized access. Redirecting...");
        navigator("/home");
      }

      setLoadingfor_username(false);
    });
    return () => unsubscribe();
  }, [navigator]);

  async function fetchData_ofsearch(searchQuery = "") {
    setLoadingfor_username(true);
    const userEmail = auth.currentUser.email;
    const reference_of_collection = collection(db, "recipyuploadby_user");
    let q = query(reference_of_collection);

    if (searchQuery.trim() !== "") {
      q = query(
        reference_of_collection,
        where("email", "==", userEmail),
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
    setLoadingfor_username(false);
  }

  function submit_search_resultsby_user(e) {
    e.preventDefault();
    fetchData_ofsearch(Searchitemofuser_text);
  }

  async function deleterecipes(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?",
    );
    if (confirmDelete) {
      await deleteDoc(doc(db, "recipyuploadby_user", id));
      fetchData_ofsearch("");
    }
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
          height: "100vh",
        }}
      >
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="admin-panel-bg" id="user-dashboard-area">
      <style>
        {`
          /* TARGET ONLY THIS component USING THE ID */
          #user-dashboard-area {
            background-color: #f0f2f5 !important;
            min-height: 100vh !important;
            padding: 30px 15px !important;
            display: block !important;
            width: 100% !important;
            font-family: -apple-system, system-ui, sans-serif !important;
          }

          #user-dashboard-area .admin-wrapper {
            max-width: 1100px !important;
            margin: 0 auto !important;
          }

          /* Header Styling */
          #user-dashboard-area .user-welcome-header {
            text-align: center !important;
            margin-bottom: 40px !important;
          }

          #user-dashboard-area .user-welcome-header h2 {
            font-weight: 800 !important;
            font-size: 2.4rem !important;
            color: #1c1e21 !important;
            letter-spacing: -1px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 12px !important;
          }

          #user-dashboard-area .recipe-stats-pill {
            display: inline-block !important;
            background: #0095f6 !important;
            color: white !important;
            padding: 6px 16px !important;
            border-radius: 20px !important;
            font-size: 0.9rem !important;
            font-weight: 600 !important;
            margin-top: 10px !important;
            box-shadow: 0 4px 12px rgba(0,149,246,0.3) !important;
          }

          /* Search Bar Isolation */
          #user-dashboard-area .search-wrapper-custom {
            max-width: 550px !important;
            margin: 0 auto 50px auto !important;
          }

          #user-dashboard-area .search-container {
            display: flex !important;
            background: white !important;
            border-radius: 50px !important;
            padding: 6px 6px 6px 22px !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08) !important;
            border: 1px solid #dbdbdb !important;
            width: 100% !important;
          }

          #user-dashboard-area #recipe-search-field {
            border: none !important;
            flex: 1 !important;
            outline: none !important;
            font-size: 1rem !important;
            background: transparent !important;
            color: #1c1e21 !important;
          }

          #user-dashboard-area .btn-green {
            background-color: #0095f6 !important;
            border: none !important;
            border-radius: 50px !important;
            padding: 10px 25px !important;
            transition: all 0.2s !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          /* Grid Isolation */
          #user-dashboard-area .recipe-grid {
            display: grid !important;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
            gap: 25px !important;
            width: 100% !important;
          }

          /* Card Logic */
          #user-dashboard-area .recipe-card {
            background: white !important;
            border-radius: 12px !important;
            border: 1px solid #dbdbdb !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            transition: transform 0.3s ease !important;
          }

          #user-dashboard-area .recipe-card:hover {
            transform: translateY(-8px) !important;
            box-shadow: 0 12px 25px rgba(0,0,0,0.1) !important;
          }

          #user-dashboard-area .image-box {
            position: relative !important;
            height: 200px !important;
          }

          #user-dashboard-area .image-box img {
            height: 100% !important;
            width: 100% !important;
            object-fit: cover !important;
          }

          #user-dashboard-area .difficulty-badge {
            position: absolute !important;
            top: 12px !important;
            right: 12px !important;
            padding: 5px 12px !important;
            border-radius: 6px !important;
            font-size: 0.7rem !important;
            font-weight: 800 !important;
            text-transform: uppercase !important;
            background: white !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
          }

          #user-dashboard-area .card-body {
            padding: 20px !important;
            flex-grow: 1 !important;
            background: white !important; /* Forces background to be white if leakage occurs */
          }

          #user-dashboard-area .card-title {
            font-weight: 700 !important;
            color: #262626 !important;
            margin-bottom: 8px !important;
            font-size: 1.25rem !important;
          }

          #user-dashboard-area .card-desc {
            color: #737373 !important;
            font-size: 0.9rem !important;
            height: 42px !important;
            overflow: hidden !important;
            margin-bottom: 15px !important;
            line-height: 1.4 !important;
          }

          #user-dashboard-area .meta-info {
            display: flex !important;
            justify-content: space-between !important;
            border-top: 1px solid #efefef !important;
            padding-top: 15px !important;
            color: #8e8e8e !important;
            font-size: 0.85rem !important;
          }

          /* Footer Buttons */
          #user-dashboard-area .card-footer {
            display: flex !important;
            padding: 12px 15px !important;
            background: #fafafa !important;
            border-top: 1px solid #efefef !important;
            gap: 10px !important;
          }

          #user-dashboard-area .btn-edit-action {
            background: #0095f6 !important;
            color: white !important;
            border-radius: 8px !important;
            text-decoration: none !important;
            padding: 8px !important;
            font-size: 0.9rem !important;
            font-weight: 600 !important;
            flex: 1 !important;
            text-align: center !important;
          }

          #user-dashboard-area .btn-delete-action {
            background: #efefef !important;
            color: #262626 !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 8px 12px !important;
            transition: background 0.2s !important;
          }

          #user-dashboard-area .btn-delete-action:hover {
            background: #ed4956 !important;
            color: white !important;
          }

/* --- ULTIMATE SEARCH BAR FIX --- */
#user-dashboard-area .search-wrapper-custom {
  max-width: 600px !important;
  margin: 0 auto 30px auto !important;
  padding: 0 15px !important; /* Proper gutter for mobile */
  width: 100% !important;
  box-sizing: border-box !important;
}

#user-dashboard-area .search-container {
  display: flex !important;
  flex-direction: row !important; /* Force side-by-side */
  flex-wrap: nowrap !important;   /* STOP the button from going to next line */
  align-items: center !important;
  background: white !important;
  border-radius: 50px !important;
  padding: 4px 4px 4px 20px !important; 
  box-shadow: 0 8px 20px rgba(0,0,0,0.06) !important;
  border: 1px solid #e0e0e0 !important;
  width: 100% !important;
  height: 54px !important; /* Fixed height makes it look premium */
  box-sizing: border-box !important;
}

#user-dashboard-area #recipe-search-field {
  background: transparent !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  font-size: 16px !important; 
  color: #333 !important;
  flex: 1 !important;        /* Grow to fill all space */
  min-width: 50px !important; /* Let it shrink small */
  height: 100% !important;
  padding: 0 !important;
}

#user-dashboard-area .btn-green {
  /* This setup forces a perfect circle that NEVER squishes */
  background-color: #198754 !important;
  color: white !important;
  border: none !important;
  border-radius: 50% !important;
  
  width: 44px !important;
  height: 44px !important;
  min-width: 44px !important; /* Lock width */
  max-width: 44px !important;
  
  flex-shrink: 0 !important;   /* Absolute priority: DO NOT SHRINK */
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;
  margin-left: 10px !important;
  cursor: pointer !important;
}

/* Specific Mobile Adjustment */
@media (max-width: 576px) {
  #user-dashboard-area .search-container {
    height: 48px !important; /* Slightly slimmer on small phones */
    padding-left: 15px !important;
  }
  #user-dashboard-area .btn-green {
    width: 38px !important;
    height: 38px !important;
    min-width: 38px !important;
    max-width: 38px !important;
  }
  #user-dashboard-area #recipe-search-field {
    font-size: 15px !important; /* Perfect for mobile viewing */
  }
}
        `}
      </style>

      <div className="admin-wrapper">
        <div className="user-welcome-header">
          <div className="recipe-stats-pill">
            {data.length} Dishes Created by {user}
          </div>
        </div>

        {Error && <div className="alert alert-danger shadow-sm">{Error}</div>}

        <div className="search-wrapper-custom">
          <form
            className="search-container"
            onSubmit={submit_search_resultsby_user}
          >
            <input
              id="recipe-search-field"
              type="text"
              value={Searchitemofuser_text}
              placeholder="Search your kitchen..."
              onChange={(e) => setSearchitemofuser_text(e.target.value)}
            />
            <button type="submit" className="btn btn-green">
              <i className="bi bi-search text-white"></i>
            </button>
          </form>
        </div>

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
                <span
                  className="difficulty-badge"
                  style={{
                    color: item.Difficulty === "Hard" ? "#e74c3c" : "#27ae60",
                  }}
                >
                  {item.Difficulty}
                </span>
              </div>

              <div className="card-body">
                <h3 className="card-title">{item.Recipetitle}</h3>
                <p className="card-desc">{item.Description}</p>

                <div className="meta-info">
                  <span>
                    <i className="bi bi-person-circle"></i> {user}
                  </span>
                  <span>
                    <i className="bi bi-stopwatch"></i> {item.Cookingtime} mins
                  </span>
                </div>
              </div>

              <div className="card-footer">
                <Link
                  to={`/EditRecipeByUserAndAdmin/${item.id}`}
                  className="btn-edit-action"
                >
                  Edit Recipe
                </Link>
                {item.updatedBy === auth.currentUser.email && (
                  <button onClick={() => deleterecipes(recipe.id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Userrecipeupload;
