import { useState } from "react";
import { auth, db } from "../context/Firebase";
import { Navigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";


function RatingFromCustomertouser() {
  const [comment, setComment] = useState("");

  const submitinsertcommentofuser = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!auth.currentUser) {
      return (
        <div className="alert alert-warning m-auto">
          Login to add a comments.........
        </div>
      );
    }
    if (!comment.trim()) return;

    await addDoc(collection(db, "recipyuploadby_user", recipe.id, "comments"), {
      userId: auth.currentUser.uid,
      userName: auth.currentUser.displayName,
      userEmail: auth.currentUser.email,
      commentText: comment,
      createdAt: new Date(),
    });
    console.log("Submitted Comment:", comment);
    setComment(""); // Clear the textarea after submission
  };
  return (
    <div className="mt-4">
      <h5>Add Comment</h5>

      <textarea
        className="form-control mb-2"
        rows="3"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button
        className="btn btn-primary btn-sm"
        onClick={submitinsertcommentofuser}
      >
        Submit Comment
      </button>
    </div>
  );
}

export default RatingFromCustomertouser;
