import { useState } from "react";
import { register } from "../api/register";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await register(username, email, password);

      if (data && data.token) {
        localStorage.setItem("jwt_token", data.token);
        localStorage.setItem("user_name", data.user.username);
        window.dispatchEvent(new Event("authChange"));
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      try {
        const apiError = JSON.parse(err.message);
        const message =
          apiError.errors?.[0]?.msg ||
          apiError.message ||
          "Error during registration";
        setError(message);
      } catch {
        setError(err.message || "Error during registration");
      }
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h3>Create an Account</h3>

        {error && <p className="error-message">{error}</p>}

        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
