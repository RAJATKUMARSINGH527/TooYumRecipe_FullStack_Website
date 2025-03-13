import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Show loading state

    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://tooyumrecipe-fullstack-website.onrender.com/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await response.json();
      console.log("Response received:", data);

      if (response.ok) {
        alert(data.message);
        navigate("/login");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("An error occurred. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-icon">💬</div>
        <h2 className="signup-title">Create an account</h2>
        <p className="signup-subtitle">Discover and share delicious recipes!</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSignup}>
          <label>Username</label>
          <input
            type="text"
            className="signup-input"
            placeholder="Username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <label>Email Address</label>
          <input
            type="email"
            className="signup-input"
            placeholder="Email Address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <label>Password</label>
          <input
            type="password"
            className="signup-input"
            placeholder="Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <label>Confirm Password</label>
          <input
            type="password"
            className="signup-input"
            placeholder="Confirm Password..."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="signup-footer">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
