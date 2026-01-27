import { useNavigate, NavLink } from "react-router-dom";
import { logout, getUserInfo } from "../api/auth";
import { showConfirm } from "../utils/confirm";
import Button from "../components/button/Button";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const userInfo = getUserInfo();

  const handleLogout = async () => {
    const isConfirmed = await showConfirm(
      "Logout?",
      "Are you sure you want to logout?",
      "Yes, logout",
      "Cancel",
    );

    if (!isConfirmed) return;

    logout();
    navigate("/login");
  };

  return (
    <header className="dashboard-header">
      <h1>Admin Panel</h1>

      <nav className="dashboard-nav">
        <ul className="nav-links">
          <li>
            <NavLink to="/" end>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/posts">Posts</NavLink>
          </li>
          <li>
            <NavLink to="/comments">Comments</NavLink>
          </li>
        </ul>

        <div className="user-section">
          <span className="welcome-message">
            Hello, <strong>{userInfo?.username}</strong>
          </span>

          <Button onClick={handleLogout} variant="danger">
            Logout
          </Button>
        </div>
      </nav>
    </header>
  );
}
