import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../context/Firebase";
import RatingFromCustomertouser from "./RatingFromCustomertouser";

export default function RecipeDetails() {
  const [RecipeDetails, setRecipeDetails] = useState([]);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      const querySnapshot = await getDocs(
        collection(db, "recipyuploadby_user"),
      );
      console.log(querySnapshot.docs);
      const recipeList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(recipeList);
      setRecipeDetails(recipeList);
    };
    fetchRecipeDetails();
  }, []);
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Recipe Details</h1>

      {RecipeDetails.map((recipe) => (
        <div key={recipe.id} className="card mb-4 shadow-sm">
          <div className="card-body">
            <img
              src={recipe.imageUrl}
              alt={recipe.Recipetitle}
              className="img-fluid rounded mb-3"
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />

            <h4 className="card-title mb-3">
              <strong>Title:</strong> {recipe.Recipetitle}
            </h4>

            <p>
              <strong>Description:</strong> {recipe.Description}
            </p>
            <p>
              <strong>Ingredients:</strong> {recipe.Ingredients}
            </p>
            <p>
              <strong>Instructions:</strong>{" "}
              <p style={{ whiteSpace: "pre-line", marginTop: "1vw" }}>
                {" "}
                {recipe.Instructions}
              </p>
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(recipe.createdAt).toISOString().split("T")[0]}
            </p>
            <p>
              <strong>Diet Category:</strong> {recipe.Diatcategory}
            </p>
            <br />
            <RatingFromCustomertouser />
          </div>
        </div>
      ))}
    </div>
  );
}
