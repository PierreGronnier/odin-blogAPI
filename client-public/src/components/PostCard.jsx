import { Link } from "react-router-dom";
import "../styles/postCard.css";
import userIcon from "../assets/author.png";
import calendarIcon from "../assets/calendar.png";

function PostCard({ post }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Link to={`/posts/${post.id}`} className="post-card">
      <h2>{post.title}</h2>

      <p className="post-excerpt">{post.content.slice(0, 150)}...</p>

      <div className="post-meta">
        <span>
          <img src={userIcon} alt="Author" />
          {post.author.username}
        </span>
        <span>
          <img src={calendarIcon} alt="Date" />
          {formatDate(post.createdAt)}
        </span>
      </div>
    </Link>
  );
}

export default PostCard;
