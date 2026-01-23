import { apiFetch } from "./client";

export function createComment(postId, data) {
  return apiFetch(`/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      postId,
    }),
  });
}

export function getCommentsByPostId(postId) {
  return apiFetch(`/comments?postId=${postId}`);
}

export function deleteComment(commentId) {
  return apiFetch(`/comments/${commentId}`, {
    method: "DELETE",
  });
}

export function updateComment(commentId, data) {
  return apiFetch(`/comments/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
