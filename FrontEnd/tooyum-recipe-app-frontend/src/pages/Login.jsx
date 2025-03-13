import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Every field is required");
      return;
    }

    try {
      const response = await fetch("https://tooyumrecipe-fullstack-website.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("accessToken", data.token);
        console.log("Access Token :-", data.token);
        window.dispatchEvent(new Event("authChange"));
        navigate("/");
        alert(data.message);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
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
            autoComplete="email" // ✅ Added this
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Password..."
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password" // ✅ Added this
          />
          <button type="submit" className="login-button">Log In</button>
        </form>
        <p className="login-footer">
          Need an account? <Link to="/signup" className="signup-link">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
