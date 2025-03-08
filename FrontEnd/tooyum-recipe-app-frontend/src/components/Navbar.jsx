import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const navigate = useNavigate();

  // Listen for authentication changes
  useEffect(() => {
    const updateAuthState = () => {
      setToken(localStorage.getItem("accessToken"));
    };

    window.addEventListener("storage", updateAuthState); // Detects localStorage changes
    window.addEventListener("authChange", updateAuthState); // Custom event

    return () => {
      window.removeEventListener("storage", updateAuthState);
      window.removeEventListener("authChange", updateAuthState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    alert("You have been logged out successfully.");

    // Notify components of auth change
    window.dispatchEvent(new Event("authChange"));

    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
        TOOYUM
      </Link>

      {/* Mobile Menu Button */}
      <button
        className="menu-button"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      {/* Navigation Links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
        </li>

        {token ? (
          <>
            <li>
              <Link to="/favourite" onClick={() => setMenuOpen(false)}>
                Favourite Recipes
              </Link>
            </li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                Signup
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
