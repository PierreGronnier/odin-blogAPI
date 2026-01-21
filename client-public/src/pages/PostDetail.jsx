import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import he from "he";
import { getPostById } from "../api/posts";
import { getCommentsByPostId } from "../api/comments";
import ErrorMessage from "../components/ErrorMessage";
import CommentForm from "../components/CommentForm";
import "../styles/postDetail.css";
import userIcon from "../assets/author.png";
import calendarIcon from "../assets/calendar.png";
import arrowIcon from "../assets/arrow-left.png";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    Promise.all([getPostById(id), getCommentsByPostId(id)])
      .then(([postData, commentsData]) => {
        setPost(postData);
        setComments(commentsData);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (notFound)
    return (
      <ErrorMessage
        title="Post not found"
        message="This post does not exist."
      />
    );
  if (!post) return null;

  return (
    <div className="post-detail">
      <h1>{post.title}</h1>

      <div className="post-meta">
        <span>
          <img src={userIcon} alt="Author" />
          by {post.author.username}
        </span>
        <span>
          <img src={calendarIcon} alt="Date" />
          {formatDate(post.createdAt)}
        </span>
      </div>

      <article className="post-content">{post.content}</article>

      <section className="comments">
        <h2>Comments ({comments.length})</h2>

        {comments.length === 0 && (
          <p>No comments yet. Be the first to comment!</p>
        )}

        {comments.map((c) => (
          <div key={c.id} className="comment">
            <strong>{c.author || "Anonymous"}</strong>
            <p>{he.decode(c.content)}</p>
          </div>
        ))}

        <CommentForm
          postId={post.id}
          onCommentAdded={(newComment) =>
            setComments((prev) => [newComment, ...prev])
          }
        />

        <div className="back-link-container">
          <Link to="/" className="back-link">
            <img src={arrowIcon} alt="Back" />
            Back to blog
          </Link>
        </div>
      </section>
    </div>
  );
}

export default PostDetail;
