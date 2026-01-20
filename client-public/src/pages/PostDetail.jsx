import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../api/posts";
import { Link } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import CommentForm from "../components/CommentForm";
import "../styles/postDetail.css";
import userIcon from "../assets/author.png";
import calendarIcon from "../assets/calendar.png";
import arrowIcon from "../assets/arrow-left.png";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    getPostById(id)
      .then((data) => {
        setPost({
          ...data,
          comments: data.comments ?? [],
        });
      })
      .catch(() => {
        setNotFound(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;

  if (notFound) {
    return (
      <ErrorMessage
        title="Post not found"
        message="This post does not exist."
      />
    );
  }

  if (!post) return null;

  return (
    <div className="post-detail">
      <h1>{post.title}</h1>

      <div className="post-meta">
        <span>
          <img
            src={userIcon}
            alt="Author"
            style={{ width: "16px", marginRight: "5px" }}
          />
          by {post.author.username}
        </span>
        <span style={{ marginLeft: "1.5rem" }}>
          <img
            src={calendarIcon}
            alt="Date"
            style={{ width: "16px", marginRight: "5px" }}
          />
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <article className="post-content">{post.content}</article>

      <section className="comments">
        <h2>Comments ({post.comments.length})</h2>

        {post.comments.length === 0 && <p>No comments</p>}

        {post.comments.map((c) => (
          <div key={c.id} className="comment">
            <strong>{c.author || "Anonymous"}</strong>
            <p>{c.content}</p>
          </div>
        ))}

        <CommentForm postId={post.id} />

        <div className="back-link-container">
          <Link to="/" className="back-link">
            <img
              src={arrowIcon}
              alt="Back"
              style={{ width: "16px", marginRight: "8px" }}
            />
            Back to blog
          </Link>
        </div>
      </section>
    </div>
  );
}

export default PostDetail;
