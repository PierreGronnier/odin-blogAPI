import { apiFetch } from "./client";

export function createComment(postId, data) {
  return apiFetch(`/posts/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
