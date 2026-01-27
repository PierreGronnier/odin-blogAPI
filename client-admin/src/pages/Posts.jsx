import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllPosts,
  deletePost,
  publishPost,
  unpublishPost,
} from "../api/posts";
import {
  confirmDelete,
  showSuccess,
  showError,
  confirmPublishAction,
} from "../utils/confirm";
import Button from "../components/button/Button";
import StatusBadge from "../components/statusBadge/StatusBadge";
import "../styles/posts.css";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      const data = await getAllPosts();
      setPosts(data);
    } catch (err) {
      setError("Failed to load posts: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCreate = () => navigate("/posts/create");

  const handleEdit = (id) => navigate(`/posts/edit/${id}`);

  const handleDelete = async (id) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const isConfirmed = await confirmDelete(
      "Delete post?",
      `Are you sure you want to delete "${post.title}"?`,
    );

    if (!isConfirmed) return;

    try {
      await deletePost(id);
      setPosts(posts.filter((p) => p.id !== id));
      showSuccess(`Post "${post.title}" deleted successfully!`);
    } catch (err) {
      showError("Failed to delete post: " + err.message);
    }
  };

  const handleTogglePublish = async (id, currentStatus) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const action = currentStatus ? "unpublish" : "publish";

    const isConfirmed = await confirmPublishAction(action, post.title);
    if (!isConfirmed) return;

    try {
      if (currentStatus) {
        await unpublishPost(id);
      } else {
        await publishPost(id);
      }

      await loadPosts();
      const actionText = currentStatus ? "unpublished" : "published";
      showSuccess(`Post "${post.title}" ${actionText} successfully!`);
    } catch (err) {
      showError(`Failed to ${action} post: ` + err.message);
    }
  };

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="posts-page">
      <div className="page-header">
        <h1>Manage Posts</h1>
        <Button onClick={handleCreate} icon="+" variant="primary">
          Create New Post
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts yet. Create your first post!</p>
        </div>
      ) : (
        <div className="posts-table-container">
          <table className="posts-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className="post-title-cell">
                      <strong>{post.title}</strong>
                      <div className="post-excerpt">
                        {post.content.substring(0, 60)}...
                      </div>
                    </div>
                  </td>
                  <td>{post.author?.username || "Unknown"}</td>
                  <td>
                    <StatusBadge
                      status={post.published ? "published" : "draft"}
                    />
                  </td>
                  <td>{formatDate(post.createdAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <Button
                        variant="edit"
                        size="small"
                        onClick={() => handleEdit(post.id)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() =>
                          handleTogglePublish(post.id, post.published)
                        }
                      >
                        {post.published ? "Unpublish" : "Publish"}
                      </Button>

                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDelete(post.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
