import { useState } from "react";
import { createComment } from "../api/comments";
import "../styles/commentForm.css";

function CommentForm({ postId }) {
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createComment(postId, {
      content,
      author: token ? undefined : "Anonymous",
    });

    setContent("");
  };

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <h3>Add a comment</h3>

      <textarea
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Your comment..."
      />

      <button type="submit">Submit</button>
    </form>
  );
}

export default CommentForm;
