import { useState } from "react";
import he from "he";
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/delete.png";

function CommentItem({ comment, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isAuthor =
    localStorage.getItem("user_name") ===
    (comment.author?.username || comment.author);

  const handleUpdate = async () => {
    await onUpdate(comment.id, editContent);
    setIsEditing(false);
  };

  return (
    <div className="comment">
      <div className="comment-header">
        <strong>
          {comment.author?.username || comment.author || "Anonymous"}
        </strong>

        {isAuthor && !isEditing && (
          <div className="comment-actions">
            <button
              className="comment-btn edit-btn"
              onClick={() => setIsEditing(true)}
            >
              <img src={editIcon} alt="Edit" /> Edit
            </button>
            <button
              className="comment-btn delete-btn"
              onClick={() => onDelete(comment.id)}
            >
              <img src={deleteIcon} alt="Delete" /> Delete
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="edit-mode">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className="edit-buttons">
            <button onClick={handleUpdate} className="save-btn">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p>{he.decode(comment.content)}</p>
      )}
    </div>
  );
}

export default CommentItem;
