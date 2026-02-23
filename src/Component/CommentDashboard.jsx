import { collection, getDocs } from "firebase/firestore";
import { db } from "../context/Firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../context/Firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";

function CommentDashboard() {
  const [comments, setComments] = useState([]);
  const [useremail, setUseremail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get logged in user email
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUseremail(user.email);
      } else {
        setUseremail(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!useremail) return;

    const recipeRef = collection(db, "recipyuploadby_user");

    const unsubscribe = onSnapshot(recipeRef, async (recipeSnapshot) => {
      let allComments = [];

      for (const recipeDoc of recipeSnapshot.docs) {
        const recipeData = recipeDoc.data();

        if (recipeData.email === useremail) {
          const commentsRef = collection(
            db,
            "recipyuploadby_user",
            recipeDoc.id,
            "comments",
          );

          const commentSnapshot = await getDocs(commentsRef);

          const commentList = commentSnapshot.docs.map((doc) => ({
            id: doc.id,
            recipeId: recipeDoc.id,
            ...doc.data(),
            recipeImage: recipeData.imageUrl,
          }));

          allComments = [...allComments, ...commentList];
        }
      }

      setComments(allComments);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [useremail]);

  const deleteComment = async (recipeId, commentId) => {
    console.log("Deleting...");
    console.log("Recipe ID:", recipeId);
    console.log("Comment ID:", commentId);

    try {
      await deleteDoc(
        doc(db, "recipyuploadby_user", recipeId, "comments", commentId),
      );

      console.log("Deleted successfully");

      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("Delete error:", error);
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
        }}
      >
        <div className="spinner-border text-dark m-3"></div>
      </div>
    );
  }

  return (
    <div id="comment-hub-area">
      <style>
        {`
      #comment-hub-area {
        background-color: #f0f2f5 !important;
        min-height: 100vh !important;
        padding: 40px 15px !important;
        font-family: 'Segoe UI', system-ui, sans-serif !important;
      }

      .dashboard-container {
        max-width: 850px !important;
        margin: 0 auto !important;
      }

      .dashboard-title {
        font-weight: 800 !important;
        font-size: clamp(20px, 5vw, 26px) !important;
        color: #1c1e21 !important;
        margin-bottom: 30px !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
      }

      .comment-card {
        background: white !important;
        border-radius: 12px !important;
        padding: 16px !important;
        margin-bottom: 15px !important;
        display: flex !important;
        align-items: flex-start !important;
        gap: 15px !important;
        border: 1px solid #dbdbdb !important;
        position: relative !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important;
      }

      /* MOBILE RESPONSIVENESS STYLES */
      @media (max-width: 600px) {
        .comment-card {
          flex-direction: column !important; /* Stack items vertically */
          align-items: stretch !important;
        }

        .recipe-preview-box {
          width: 100% !important; /* Make recipe image wide on mobile */
          height: 120px !important;
          margin-top: 10px !important;
        }

        .delete-btn-mobile {
          width: 100% !important;
          margin-top: 10px !important;
        }
        
        .user-header-mobile {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
        }
      }

      .user-avatar {
        width: 45px !important;
        height: 45px !important;
        border-radius: 50% !important;
        object-fit: cover !important;
        flex-shrink: 0 !important;
      }

      .comment-content {
        flex: 1 !important;
      }

      .username-bold {
        font-weight: 700 !important;
        color: #1c1e21 !important;
      }

      .comment-text {
        color: #050505 !important;
        word-break: break-word !important;
      }

      .timestamp {
        font-size: 12px !important;
        color: #8e8e8e !important;
        margin-top: 4px !important;
      }

      .recipe-preview-box {
        width: 60px !important;
        height: 60px !important;
        border-radius: 8px !important;
        overflow: hidden !important;
        border: 1px solid #efefef !important;
        flex-shrink: 0 !important;
      }

      .recipe-preview-box img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      }

      .empty-state {
        text-align: center !important;
        padding: 50px !important;
        color: #8e8e8e !important;
      }
    `}
      </style>

      <div className="dashboard-container">
        <h2 className="dashboard-title">
          <i className="bi bi-chat-left-dots-fill text-primary"></i>
          Recipe Interactions
        </h2>

        {comments.map((comment) => (
          <div className="comment-card" key={comment.id}>
            {/* Wrap Avatar and Text for mobile layout */}
            <div className="user-header-mobile">
              <img
                src={
                  comment.photoURL ||
                  "https://cdn-icons-png.flaticon.com/512/17561/17561717.png"
                }
                alt="User"
                className="user-avatar"
              />
            </div>

            <div className="comment-content">
              <div className="user-info-text">
                <span className="username-bold">
                  {comment.userName || "Anonymous"}
                </span>
                <span className="comment-text"> {comment.message}</span>
              </div>
              <div className="timestamp">
                {comment.createdAt?.toDate
                  ? comment.createdAt.toDate().toLocaleString()
                  : "Just now"}
              </div>
            </div>

            {/* Recipe Preview */}
            <div className="recipe-preview-box">
              <img
                src={
                  comment.recipeImage || "https://via.placeholder.com/150/food"
                }
                alt="Recipe"
              />
            </div>

            {/* Delete Button - Fixed for Mobile */}
            <button
              className="btn btn-outline-danger btn-sm delete-btn-mobile"
              onClick={() => deleteComment(comment.recipeId, comment.id)}
            >
              <i className="bi bi-trash3 me-1"></i> Delete
            </button>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="empty-state">
            <i
              className="bi bi-chat-square-text"
              style={{ fontSize: "40px" }}
            ></i>
            <p className="mt-2">No comments on your recipes yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentDashboard;
