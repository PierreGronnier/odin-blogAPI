import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <main className="dashboard-main">
      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate("/posts")}>
          <div className="card-icon">📝</div>
          <h3>Manage Posts</h3>
          <p>Create, edit, or delete blog posts</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/comments")}>
          <div className="card-icon">💬</div>
          <h3>Moderate Comments</h3>
          <p>Approve, reject, or delete comments</p>
        </div>
      </div>
    </main>
  );
}
