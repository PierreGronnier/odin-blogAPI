import { useState } from "react";
import { createComment } from "../api/comments";
import "../styles/commentForm.css";

function CommentForm({ postId, onCommentAdded }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("jwt_token");
  const storedName = localStorage.getItem("user_name");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);

      const commentData = {
        content: content.trim(),
        author: token ? storedName : "Anonymous",
      };

      const newComment = await createComment(postId, commentData);

      setContent("");
      if (onCommentAdded) onCommentAdded(newComment);
    } catch (err) {
      console.error("Erreur :", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <h3>Leave a comment</h3>
      <p className="user-status">
        Posting as: <strong>{token ? storedName : "Anonymous"}</strong>
      </p>

      <textarea
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment here..."
        disabled={loading}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Post Comment"}
      </button>

      {!token && (
        <p className="auth-hint">
          Want to be able to edit your comments later?{" "}
          <a href="/login">Login here</a>.
        </p>
      )}
    </form>
  );
}

export default CommentForm;
