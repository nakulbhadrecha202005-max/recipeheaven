import { useState } from "react";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Home from "./component/Home";
import Login from "./component/Login";
import Layout from "./Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./component/About";
import UploadRecipe from "./component/UploadRecipe";
import RecipeDetails from "./component/RecipeDetails";
import ShowRecipeDescription from "./component/ShowRecipeDescription";
import Signup from "./component/Signup";
import Profileimageupload from "./component/Profileimageupload";
import UserProfile from "./component/UserProfile";
import EditProfileofuser from "./component/EditProfileofuser";
import EditRecipeByUserAndAdmin from "./component/EditRecipeByUserAndAdmin";
import Adminselectallrecipe from "./component/adminselectallrecipe";
import Userercipeupload from "./component/Userercipeupload";
import CommentDashboard from "./component/CommentDashboard";
import Subcllection from "./component/Subcllection";
import Favorites from "./component/Favourites";
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
