import { useState } from "react";
import { login } from "../api/login";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);

      if (data && data.token) {
        localStorage.setItem("jwt_token", data.token);
        localStorage.setItem("user_name", data.user.username);

        window.dispatchEvent(new Event("authChange"));
        navigate("/");
      } else {
        setError("Invalid server response.");
      }
    } catch (err) {
      try {
        const apiError = JSON.parse(err.message);
        const message =
          apiError.errors?.[0]?.msg ||
          apiError.message ||
          "Incorrect email or password";
        setError(message);
      } catch {
        setError("Incorrect email or password");
      }
      console.error("Connection problem", err);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h3>Login</h3>

        {error && <p className="error-message">{error}</p>}

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

        <button type="submit">Login</button>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
