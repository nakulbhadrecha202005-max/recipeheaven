import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../context/Firebase";

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    // Listen for user state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in, get their info
        setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL, // This is the uploaded profile image
        });
      } else {
        // No user is signed in
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  if (!user) return <p>No user is logged in.</p>;

  return (
    <div style={{ margin: "10vw", color: "black" }}>
      <h2>User Profile</h2>
      <p>
        <strong>Name:</strong> {user.displayName}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt="Profile"
          style={{ width: "100px", borderRadius: "50%" }}
        />
      )}
    </div>
  );
};

export default UserProfile;
