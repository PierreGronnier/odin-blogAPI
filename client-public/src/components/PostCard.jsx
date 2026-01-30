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

  const getCleanExcerpt = (html, maxLength = 150) => {
    if (!html) return "";

    const textWithoutTags = html.replace(/<[^>]*>/g, "");

    const cleanText = textWithoutTags.replace(/\s+/g, " ").trim();

    if (cleanText.length <= maxLength) return cleanText;

    const truncated = cleanText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");

    return lastSpace > 0
      ? truncated.substring(0, lastSpace) + "..."
      : truncated + "...";
  };

  return (
    <Link to={`/posts/${post.id}`} className="post-card">
      <h2>{post.title}</h2>

      <p className="post-excerpt">{getCleanExcerpt(post.content)}</p>

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
