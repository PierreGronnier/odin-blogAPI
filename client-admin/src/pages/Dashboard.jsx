import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "../api/posts";
import { getAllComments } from "../api/comments";
import Button from "../components/button/Button";
import "../styles/dashboard.css";

import postsIcon from "../assets/icons/posts.png";
import commentsIcon from "../assets/icons/comments.png";
import createIcon from "../assets/icons/create.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalComments: 0,
    approvedComments: 0,
    hiddenComments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const [postsData, commentsData] = await Promise.all([
        getAllPosts(),
        getAllComments(),
      ]);

      const publishedPosts = postsData.filter((p) => p.published).length;
      const draftPosts = postsData.length - publishedPosts;

      const approvedComments = commentsData.filter((c) => c.approved).length;
      const hiddenComments = commentsData.length - approvedComments;

      setStats({
        totalPosts: postsData.length,
        publishedPosts,
        draftPosts,
        totalComments: commentsData.length,
        approvedComments,
        hiddenComments,
      });

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* En-tête */}
      <div className="dashboard-header">
        <div className="header-content">
          <h2 className="dashboard-title">Dashboard</h2>
          <p className="dashboard-subtitle">
            Overview of your blog administration
            {lastUpdated && (
              <span className="last-updated">
                Last updated: {formatDate(lastUpdated)}
              </span>
            )}
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={loadDashboardData}
          disabled={loading}
        >
          ↻ Refresh
        </Button>
      </div>

      {/* Statistiques globales */}
      <div className="global-stats">
        <h3 className="stats-title">Global Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card stat-card-primary">
            <div className="stat-card-value">{stats.totalPosts}</div>
            <div className="stat-card-label">Total Posts</div>
          </div>

          <div className="stat-card stat-card-success">
            <div className="stat-card-value">{stats.publishedPosts}</div>
            <div className="stat-card-label">Published</div>
          </div>

          <div className="stat-card stat-card-warning">
            <div className="stat-card-value">{stats.draftPosts}</div>
            <div className="stat-card-label">Drafts</div>
          </div>

          <div className="stat-card stat-card-primary">
            <div className="stat-card-value">{stats.totalComments}</div>
            <div className="stat-card-label">Total Comments</div>
          </div>

          <div className="stat-card stat-card-success">
            <div className="stat-card-value">{stats.approvedComments}</div>
            <div className="stat-card-label">Approved</div>
          </div>

          <div className="stat-card stat-card-danger">
            <div className="stat-card-value">{stats.hiddenComments}</div>
            <div className="stat-card-label">Hidden</div>
          </div>
        </div>
      </div>

      {/* Grille d'actions - 3 cartes seulement */}
      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate("/posts")}>
          <div className="card-icon posts">
            <img src={postsIcon} alt="Posts" className="icon-png" />
          </div>
          <h3>Manage Posts</h3>
          <p>
            {stats.publishedPosts} published, {stats.draftPosts} drafts
          </p>
          <div className="card-actions">
            <Button
              variant="secondary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/posts");
              }}
            >
              View All
            </Button>
          </div>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/comments")}>
          <div className="card-icon comments">
            <img src={commentsIcon} alt="Comments" className="icon-png" />
          </div>
          <h3>Moderate Comments</h3>
          <p>
            {stats.approvedComments} approved, {stats.hiddenComments} hidden
          </p>
          <div className="card-actions">
            <Button
              variant="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/comments");
              }}
            >
              Review All
            </Button>
          </div>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/posts/create")}
        >
          <div className="card-icon create">
            <img src={createIcon} alt="Create" className="icon-png" />
          </div>
          <h3>Create New Content</h3>
          <p>Start writing a new blog post</p>
          <div className="card-actions">
            <Button
              variant="edit"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/posts/create");
              }}
            >
              New Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
