import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { onSnapshot, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../context/Firebase";
import { auth } from "../context/Firebase";

import { useState, useEffect } from "react";
import "../Styles/Comments.css";
import { useNavigate } from "react-router-dom";

export default function Comments({ recipeId }) {
  const navigator = useNavigate();

  const [loadingfor_username, setLoadingfor_username] = useState(true);
  const [user, setUser] = useState("");
  const [Email, setEmail] = useState("");
  const [UserId, setUserId] = useState("");
  const [Message, setMessage] = useState("");
  const [Error, setError] = useState("");

  const [Userimages, setUserimages] = useState([]);

  const [comments, setComments] = useState([]);
  //checkuser authentication of user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User is authenticated:", currentUser.displayName);
        setUserimages(currentUser.photoURL);
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

  useEffect(() => {
    if (!recipeId) return;

    const q = query(
      collection(db, "recipyuploadby_user", recipeId, "comments"),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setComments(commentList);
    });

    return () => unsubscribe();
  }, [recipeId]);

  const handlePostComment = async () => {
    try {
      if (!Message.trim()) {
        setError("Comment cannot be empty");
        return;
      }

      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("User not logged in");
        return;
      }

      // reference to subcollection
      const commentsRef = collection(
        db,
        "recipyuploadby_user", // parent collection
        recipeId, // parent document ID
        "comments", // subcollection
      );

      const defaultPhotoURL =
        "https://cdn-icons-png.flaticon.com/512/17561/17561717.png";

      await addDoc(commentsRef, {
        message: Message,
        userName: currentUser.displayName,
        email: currentUser.email,
        userId: currentUser.uid,
        photoURL:
          currentUser.photoURL && currentUser.photoURL.trim() !== ""
            ? currentUser.photoURL
            : defaultPhotoURL,
        createdAt: serverTimestamp(),
      });

      setMessage("");
      //alert("Comment added successfully");
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };
  if (!recipeId) {
    console.log("recipeId undefined");
    return;
  }

  return (
    <>
      <div className="comment-section">
        <div className="comment-form">
          <h3 className="form-title text-muted ">Leave a comment for chef</h3>
          <div className="input-wrapper">
            <textarea
              className="comment-textarea"
              placeholder="Write your comment here..."
              onChange={(e) => setMessage(e.target.value)}
              rows="3"
            ></textarea>
            <div className="form-footer">
              <button
                type="submit"
                onClick={handlePostComment}
                className="submit-btn"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>

        <h3 id="commentsTitle" className="text-muted">
          Comments
        </h3>
        {comments.length === 0 && (
          <p className="text-muted ">No comments yet....</p>
        )}
        <div className="comment-container">
          {comments.map((comment) => (
            <div className="comment-wrapper" key={comment.id}>
              <img
                src={
                  comment?.photoURL ||
                  "https://cdn-icons-png.flaticon.com/512/17561/17561717.png"
                }
                onError={(e) => {
                  e.currentTarget.src =
                    "https://cdn-icons-png.flaticon.com/512/17561/17561717.png";
                }}
                className="comment-avatar"
                alt="user avatar"
              />

              <div className="comment-content">
                <div className="comment-bubble">
                  <div className="comment-header">
                    <span className="comment-username">{comment.userName}</span>
                    <span className="comment-date">
                      {comment.createdAt?.toDate().toLocaleDateString()}
                    </span>
                  </div>
                  <p className="comment-message">{comment.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
