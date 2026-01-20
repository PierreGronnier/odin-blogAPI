import { Link } from "react-router-dom";
import "../styles/postCard.css";
import userIcon from "../assets/author.png";
import calendarIcon from "../assets/calendar.png";

function PostCard({ post }) {
  return (
    <Link to={`/posts/${post.id}`} className="post-card">
      <h2>{post.title}</h2>

      <p className="post-excerpt">{post.content.slice(0, 150)}...</p>

      <div className="post-meta">
        <span>
          <img
            src={userIcon}
            alt="Author"
            style={{ width: "16px", marginRight: "5px" }}
          />
          {post.author.username}
        </span>
        <span>
          <img
            src={calendarIcon}
            alt="Date"
            style={{ width: "16px", marginRight: "5px" }}
          />
          {new Date(post.createdAt).toLocaleDateString("en-US")}
        </span>
      </div>
    </Link>
  );
}

export default PostCard;
