import React, { useEffect, useState } from "react";
import { collectionGroup, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../context/Firebase";

export default function subcllection() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const unsubscribe = onSnapshot(
        collectionGroup(db, "comments"),
        (snapshot) => {
          const list = snapshot.docs.map((doc) => doc.data());
          setComments(list);
        },
      );

      return () => unsubscribe();
    });
  }, []);

  return (
    <div style={{ margin: "10vw", color: "black" }}>
      <h2>Comments</h2>

      {comments.length === 0 ? (
        <p>No comments found</p>
      ) : (
        comments.map((c, i) => (
          <div key={i}>
            <b>{c.userName}</b>: {c.message}
            <br />
            {c.email}
            <hr />
          </div>
        ))
      )}
    </div>
  );
}
