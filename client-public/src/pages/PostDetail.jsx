import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPostById } from "../api/posts";
import {
  getCommentsByPostId,
  deleteComment,
  updateComment,
} from "../api/comments";
import ErrorMessage from "../components/ErrorMessage";
import CommentForm from "../components/CommentForm";
import CommentItem from "../components/CommentItem";
import "../styles/postDetail.css";
import userIcon from "../assets/author.png";
import calendarIcon from "../assets/calendar.png";
import arrowIcon from "../assets/arrow-left.png";
import Swal from "sweetalert2";

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

  const handleDelete = (commentId) => {
    Swal.fire({
      title: "Delete comment?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#db5461",
      cancelButtonColor: "#8aa29e",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteComment(commentId);
          setComments((prev) => prev.filter((c) => c.id !== commentId));
          Swal.fire({
            title: "Deleted!",
            icon: "success",
            timer: 1000,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error("Erreur suppression:", err);
          setComments((prev) => prev.filter((c) => c.id !== commentId));
        }
      }
    });
  };

  const handleUpdate = async (commentId, newContent) => {
    try {
      await updateComment(commentId, { content: newContent });
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, content: newContent } : c,
        ),
      );
    } catch (err) {
      console.error("Erreur modification:", err);
      Swal.fire("Error", "Could not update comment", "error");
    }
  };

  useEffect(() => {
    setLoading(true);
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
          <img src={userIcon} alt="Author" /> by {post.author.username}
        </span>
        <span>
          <img src={calendarIcon} alt="Date" /> {formatDate(post.createdAt)}
        </span>
      </div>

      <article className="post-content">{post.content}</article>

      <section className="comments">
        <h2>Comments ({comments.length})</h2>

        {comments.length === 0 && <p>No comments yet.</p>}

        {comments.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}

        <CommentForm
          postId={post.id}
          onCommentAdded={(newComment) =>
            setComments((prev) => [newComment, ...prev])
          }
        />

        <div className="back-link-container">
          <Link to="/" className="back-link">
            <img src={arrowIcon} alt="Back" /> Back to blog
          </Link>
        </div>
      </section>
    </div>
  );
}

export default PostDetail;
