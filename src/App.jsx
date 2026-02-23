import { useState } from "react";
import Navbar from "./Component/Navbar";
import Footer from "./Component/Footer";
import Home from "./Component/Home";
import Login from "./Component/Login";
import Layout from "./Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./Component/About";
import UploadRecipe from "./Component/UploadRecipe";
import RecipeDetails from "./Component/RecipeDetails";
import ShowRecipeDescription from "./Component/ShowRecipeDescription";
import Signup from "./Component/Signup";
import Profileimageupload from "./Component/Profileimageupload";
import UserProfile from "./Component/UserProfile";
import EditProfileofuser from "./Component/EditProfileofuser";
import EditRecipeByUserAndAdmin from "./Component/EditRecipeByUserAndAdmin";
import Adminselectallrecipe from "./Component/adminselectallrecipe";
import Userercipeupload from "./Component/Userercipeupload";
import CommentDashboard from "./Component/CommentDashboard";
import Subcllection from "./Component/Subcllection";
import Favorites from "./Component/Favourites";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/uploadrecipe" element={<UploadRecipe />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* <Route path="/recipeDetails" element={<RecipeDetails />} />*/}
            <Route
              path="/showrecoipedescription/:id"
              element={<ShowRecipeDescription />}
            />
            <Route
              path="/Profileimageupload"
              element={<Profileimageupload />}
            />
            <Route path="/userProfile" element={<UserProfile />} />
            <Route path="/editProfileofuser" element={<EditProfileofuser />} />
            <Route
              path="/EditRecipeByUserAndAdmin/:id"
              element={<EditRecipeByUserAndAdmin />}
            />
            <Route
              path="/adminselectallrecipes"
              element={<Adminselectallrecipe />}
            />
            <Route path="/Userercipeupload" element={<Userercipeupload />} />
            <Route path="/CommentDashboard" element={<CommentDashboard />} />
            <Route path="/subcollection" element={<Subcllection />} />
            <Route path="/favorites" element={<Favorites />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
