import { useState, useEffect, useCallback } from "react";
import {
  getAllComments,
  approveComment,
  rejectComment,
  deleteComment,
} from "../api/comments";
import { getAllPosts } from "../api/posts";
import Button from "../components/button/Button";
import StatusBadge from "../components/statusBadge/StatusBadge";
import { showConfirm, showSuccess, showError } from "../utils/confirm";
import "../styles/comments.css";

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "approved", "rejected"
  const [expandedPosts, setExpandedPosts] = useState({}); // {postId: true/false}

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const [commentsData, postsData] = await Promise.all([
        getAllComments(),
        getAllPosts(),
      ]);

      console.log("Comments:", commentsData);
      console.log("Posts:", postsData);

      setComments(commentsData);
      setPosts(postsData);

      const initialExpanded = {};
      postsData.forEach((post) => {
        initialExpanded[post.id] = false;
      });
      setExpandedPosts(initialExpanded);
    } catch (err) {
      console.error("Failed to load data:", err);
      showError("Failed to load data: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Organiser les commentaires par post
  const organizeCommentsByPost = () => {
    const postsMap = {};

    posts.forEach((post) => {
      postsMap[post.id] = {
        ...post,
        comments: [],
        stats: {
          total: 0,
          approved: 0,
          rejected: 0,
        },
      };
    });

    // Ajouter les commentaires à leur post
    comments.forEach((comment) => {
      const postId = comment.postId;

      if (postsMap[postId]) {
        postsMap[postId].comments.push(comment);
        postsMap[postId].stats.total++;

        if (comment.approved) {
          postsMap[postId].stats.approved++;
        } else {
          postsMap[postId].stats.rejected++;
        }
      } else {
        if (!postsMap["unknown"]) {
          postsMap["unknown"] = {
            id: "unknown",
            title: "Unknown Post",
            comments: [],
            stats: { total: 0, approved: 0, rejected: 0 },
          };
        }
        postsMap["unknown"].comments.push(comment);
        postsMap["unknown"].stats.total++;
        if (comment.approved) {
          postsMap["unknown"].stats.approved++;
        } else {
          postsMap["unknown"].stats.rejected++;
        }
      }
    });

    // Convertir en tableau et filtrer les posts sans commentaires
    let postsArray = Object.values(postsMap)
      .filter((post) => post.comments.length > 0)
      .sort((a, b) => b.stats.total - a.stats.total);

    // Appliquer le filtre global si nécessaire
    if (filter !== "all") {
      postsArray = postsArray
        .map((post) => {
          const filteredComments = post.comments.filter((comment) => {
            if (filter === "approved") return comment.approved === true;
            if (filter === "rejected") return comment.approved === false;
            return true;
          });

          return {
            ...post,
            comments: filteredComments,
            stats: {
              total: filteredComments.length,
              approved: filteredComments.filter((c) => c.approved).length,
              rejected: filteredComments.filter((c) => !c.approved).length,
            },
          };
        })
        .filter((post) => post.comments.length > 0);
    }

    return postsArray;
  };

  const postsWithComments = organizeCommentsByPost();

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Basculer l'état d'un post (ouvert/fermé)
  const togglePost = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Basculer tous les posts
  const toggleAllPosts = () => {
    const allExpanded = postsWithComments.every(
      (post) => expandedPosts[post.id],
    );
    const newState = {};
    postsWithComments.forEach((post) => {
      newState[post.id] = !allExpanded;
    });
    setExpandedPosts(newState);
  };

  // Actions sur les commentaires
  const handleApprove = async (id, e) => {
    e.stopPropagation();
    const comment = comments.find((c) => c.id === id);
    const isConfirmed = await showConfirm(
      "Approve comment",
      `Make comment from "${comment.author}" visible on the blog?`,
      "Yes, approve",
      "Cancel",
    );

    if (!isConfirmed) return;

    try {
      await approveComment(id);
      await loadData();
      showSuccess("Comment approved and visible!");
    } catch (err) {
      showError("Failed to approve comment: " + err.message);
    }
  };

  const handleReject = async (id, e) => {
    e.stopPropagation();
    const comment = comments.find((c) => c.id === id);
    const isConfirmed = await showConfirm(
      "Hide comment",
      `Hide comment from "${comment.author}" from the blog?`,
      "Yes, hide",
      "Cancel",
    );

    if (!isConfirmed) return;

    try {
      await rejectComment(id);
      await loadData();
      showSuccess("Comment hidden!");
    } catch (err) {
      showError("Failed to hide comment: " + err.message);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    const comment = comments.find((c) => c.id === id);
    const isConfirmed = await showConfirm(
      "Delete comment",
      `Permanently delete comment from "${comment.author}"? This cannot be undone.`,
      "Yes, delete",
      "Cancel",
    );

    if (!isConfirmed) return;

    try {
      await deleteComment(id);
      await loadData();
      showSuccess("Comment deleted!");
    } catch (err) {
      showError("Failed to delete comment: " + err.message);
    }
  };

  // Statistiques globales
  const globalStats = {
    total: comments.length,
    approved: comments.filter((c) => c.approved).length,
    rejected: comments.filter((c) => !c.approved).length,
    posts: postsWithComments.length,
  };

  if (loading) {
    return (
      <div className="comments-page">
        <div className="loading">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className="comments-page">
      {/* En-tête avec statistiques */}
      <div className="page-header">
        <div>
          <h1>Comment Moderation</h1>
          <div className="stats">
            <span className="stat-total">Posts: {globalStats.posts}</span>
            <span className="stat-total">Comments: {globalStats.total}</span>
            <span className="stat-approved">
              Visible: {globalStats.approved}
            </span>
            <span className="stat-rejected">
              Hidden: {globalStats.rejected}
            </span>
          </div>
        </div>

        <div className="header-actions">
          <Button variant="secondary" onClick={loadData} disabled={loading}>
            ↻ Refresh
          </Button>
          {postsWithComments.length > 0 && (
            <Button variant="secondary" onClick={toggleAllPosts}>
              {postsWithComments.every((post) => expandedPosts[post.id])
                ? "Collapse All"
                : "Expand All"}
            </Button>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="filters">
        <Button
          variant={filter === "all" ? "primary" : "secondary"}
          onClick={() => setFilter("all")}
          size="small"
        >
          All ({comments.length})
        </Button>
        <Button
          variant={filter === "approved" ? "primary" : "secondary"}
          onClick={() => setFilter("approved")}
          size="small"
        >
          Visible ({globalStats.approved})
        </Button>
        <Button
          variant={filter === "rejected" ? "primary" : "secondary"}
          onClick={() => setFilter("rejected")}
          size="small"
        >
          Hidden ({globalStats.rejected})
        </Button>
      </div>

      {/* Liste des posts avec commentaires */}
      <div className="posts-list">
        {postsWithComments.length === 0 ? (
          <div className="empty-state">
            <p>No comments found.</p>
            {filter !== "all" && (
              <Button onClick={() => setFilter("all")} variant="secondary">
                Show all comments
              </Button>
            )}
          </div>
        ) : (
          postsWithComments.map((post) => (
            <div key={post.id} className="post-section">
              {/* En-tête du post (cliquable pour expand/collapse) */}
              <div className="post-header" onClick={() => togglePost(post.id)}>
                <div className="post-header-left">
                  <div className="post-title-row">
                    <span className="expand-icon">
                      {expandedPosts[post.id] ? "▼" : "▶"}
                    </span>
                    <h3 className="post-title">{post.title}</h3>
                  </div>
                  <div className="post-stats">
                    <span className="post-stat total">
                      {post.stats.total} comments
                    </span>
                    <span className="post-stat approved">
                      {post.stats.approved} visible
                    </span>
                    <span className="post-stat rejected">
                      {post.stats.rejected} hidden
                    </span>
                  </div>
                </div>

                <div className="post-header-right">
                  <span className="post-status">
                    {expandedPosts[post.id]
                      ? "Click to collapse"
                      : "Click to expand"}
                  </span>
                </div>
              </div>

              {/* Commentaires du post (affichés seulement si le post est expanded) */}
              {expandedPosts[post.id] && (
                <div className="post-comments">
                  {post.comments.length === 0 ? (
                    <div className="no-comments">
                      No comments in this filter
                    </div>
                  ) : (
                    post.comments.map((comment) => (
                      <div key={comment.id} className="comment-card">
                        <div className="comment-content">
                          {/* En-tête du commentaire */}
                          <div className="comment-header">
                            <div className="comment-author">
                              <strong>{comment.author || "Anonymous"}</strong>
                              {comment.user && (
                                <span className="user-badge">Registered</span>
                              )}
                              {comment.email && (
                                <span className="comment-email">
                                  {" "}
                                  ({comment.email})
                                </span>
                              )}
                            </div>
                            <div className="comment-meta">
                              <span className="comment-date">
                                {formatDate(comment.createdAt)}
                              </span>
                              <StatusBadge
                                status={
                                  comment.approved ? "approved" : "rejected"
                                }
                              >
                                {comment.approved ? "Visible" : "Hidden"}
                              </StatusBadge>
                            </div>
                          </div>

                          {/* Contenu du commentaire */}
                          <div className="comment-body">
                            <p>{comment.content}</p>
                          </div>

                          {/* Actions */}
                          <div className="comment-actions">
                            {comment.approved ? (
                              <Button
                                variant="secondary"
                                size="small"
                                onClick={(e) => handleReject(comment.id, e)}
                              >
                                Hide
                              </Button>
                            ) : (
                              <Button
                                variant="primary"
                                size="small"
                                onClick={(e) => handleApprove(comment.id, e)}
                              >
                                Make Visible
                              </Button>
                            )}

                            <Button
                              variant="danger"
                              size="small"
                              onClick={(e) => handleDelete(comment.id, e)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
