import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";
import FavouriteRecipes from "./pages/Favourite";


const App = () => {
  const token = localStorage.getItem("accessToken");
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protected Routes */}
        <Route path="/favourite" element={token ? <FavouriteRecipes />:<Login/>} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
