import React, { useEffect, useState } from "react";
import { db } from "../context/Firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const auth = getAuth();
  const navigate = useNavigate();

  // --- SIMPLE INTERNAL CSS ---
  const styles = {
    headerTitle: {
      marginTop: "10vh",
      fontSize: "2rem",
      color: "#198754", // Bootstrap Success
      borderBottom: "2px solid #f1f1f1",
      paddingBottom: "15px",
    },
    recipeCard: {
      border: "1px solid #e1e1e1",
      borderRadius: "12px",
      transition: "0.3s",
      overflow: "hidden",
    },
    recipeImage: {
      height: "200px",
      objectFit: "cover",
      width: "100%",
    },
    cardBody: {
      padding: "20px",
    },
    title: {
      fontSize: "1.2rem",
      marginBottom: "15px",
      color: "#222",
    },
    btnView: {
      borderRadius: "6px",
      padding: "6px 15px",
      fontSize: "0.9rem",
      fontWeight: "500",
    },
    btnRemove: {
      borderRadius: "6px",
      padding: "6px 12px",
      backgroundColor: "#fff",
      color: "#dc3545",
      border: "1px solid #dc3545",
    },
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = onSnapshot(
      collection(db, "users", user.uid, "favorites"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFavorites(data);
      },
    );

    return () => unsubscribe();
  }, [auth.currentUser]);

  const removeFromCart = async (id) => {
    const user = auth.currentUser;
    if (!user) return;
    await deleteDoc(doc(db, "users", user.uid, "favorites", id));
  };

  return (
    <div className="container py-5">
      <div className="mb-5 d-flex align-items-center justify-content-between">
        <h2 className="fw-bold" style={styles.headerTitle}>
          <i className="bi bi-cart-check me-2"></i>My Cart Recipes
        </h2>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center p-5 bg-light rounded-3">
          <p className="text-muted fs-5">No recipes added yet...</p>
        </div>
      ) : (
        <div className="row g-4">
          {favorites.map((item) => (
            <div key={item.id} className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm h-100" style={styles.recipeCard}>
                <img
                  src={item.imageUrl}
                  style={styles.recipeImage}
                  alt={item.title}
                />

                <div className="card-body" style={styles.cardBody}>
                  <h5 className="fw-bold" style={styles.title}>
                    {item.title}
                  </h5>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <button
                      className="btn btn-outline-success"
                      style={styles.btnView}
                      onClick={() =>
                        navigate(`/showrecoipedescription/${item.id}`)
                      }
                    >
                      <i className="bi bi-eye me-1"></i> View Details
                    </button>

                    <button
                      className="btn btn-sm shadow-none"
                      style={styles.btnRemove}
                      onClick={() => removeFromCart(item.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
