import { useState } from "react";
import { createComment } from "../api/comments";
import "../styles/commentForm.css";

function CommentForm({ postId, onCommentAdded }) {
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);

      const newComment = await createComment(postId, {
        content: content,
        author: token ? undefined : "Anonymous",
      });

      setContent("");

      if (onCommentAdded) onCommentAdded(newComment);
    } catch (err) {
      console.error("Erreur lors de l'envoi du commentaire :", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <h3>Add a comment</h3>
      <textarea
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Your comment..."
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}

export default CommentForm;
