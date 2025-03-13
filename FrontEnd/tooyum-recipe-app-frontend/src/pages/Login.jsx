import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Show loader

    if (!email || !password) {
      setError("Every field is required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://tooyumrecipe-fullstack-website.onrender.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      // Log response details for debugging
      console.log("Waiting for response...");
      const data = await response.json();
      console.log("Response received:", data);

      if (response.ok) {
        localStorage.setItem("accessToken", data.token);
        console.log("Access Token:", data.token);
        window.dispatchEvent(new Event("authChange"));
        navigate("/");
        alert(data.message);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please check your internet connection and try again.");
    } finally {
      setLoading(false); // Hide loader after response
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-icon">
          <span>💬</span>
        </div>
        <h2 className="login-title">Welcome back!</h2>
        <p className="login-subtitle">We're so excited to see you again!</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Email Address..."
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={loading} // Disable input while loading
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Password..."
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={loading} // Disable input while loading
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <p className="login-footer">
          Need an account?{" "}
          <Link to="/signup" className="signup-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
