import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("jwt_token"),
  );
  const [username, setUsername] = useState(localStorage.getItem("user_name"));

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(!!localStorage.getItem("jwt_token"));
      setUsername(localStorage.getItem("user_name"));
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_name");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Pierre Gronnier Blog
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {isLoggedIn ? (
          <div className="user-section">
            <span className="welcome-msg">
              Hello, <strong>{username}</strong>
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
