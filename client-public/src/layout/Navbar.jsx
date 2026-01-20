import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span style={{ color: "#DB5461" }}>Pierre</span>
        <span style={{ color: "#686963", marginLeft: "0.3rem" }}>Gronnier</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
      </div>
    </nav>
  );
}

export default Navbar;
