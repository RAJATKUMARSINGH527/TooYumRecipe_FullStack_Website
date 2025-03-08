import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  // Update auth state when token changes in localStorage
  useEffect(() => {
    const updateAuthState = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("authChange", updateAuthState);
    return () => {
      window.removeEventListener("authChange", updateAuthState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    alert("You have been logged out successfully.");

    // Notify Navbar to update without refresh
    window.dispatchEvent(new Event("authChange"));

    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo">TOOYUM🍽</Link>

      {/* Mobile Menu Button */}
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✖" : "☰"}
      </button>

      {/* Navigation Links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        
        {token ? (
          <>
            <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
            <li>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/signup" onClick={() => setMenuOpen(false)}>Signup</Link></li>
            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
