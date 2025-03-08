import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      // If no token, redirect to login
      if (!token) {
        navigate("/login");
        return;
      }

      // If user data exists in localStorage, don't fetch again
      if (user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        const data = await response.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data)); // Save user data locally

        // Dummy recent activity (Replace with real API call if available)
        setRecentActivity([
          { id: 1, action: "Saved a new recipe", date: "March 5, 2025" },
          { id: 2, action: "Updated profile details", date: "March 3, 2025" },
          { id: 3, action: "Liked a recipe", date: "March 1, 2025" },
        ]);
      } catch (err) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, user]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="dashboard-container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="dashboard-content">
          {/* User Profile Section */}
          <h2>Welcome, {user.username}! 🎉</h2>
          <p>Email: {user.email}</p>
          <p>Role: {user.role || "User"}</p>

          {/* Recent Activity Section */}
          <h3>Recent Activity</h3>
          <ul className="recent-activity">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <li key={activity.id}>
                  <span>{activity.action}</span>
                  <small>{activity.date}</small>
                </li>
              ))
            ) : (
              <p>No recent activity.</p>
            )}
          </ul>

          {/* Action Buttons */}
          <div className="dashboard-buttons">
            <button className="settings-button">⚙️ Settings</button>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
