import { apiFetch } from "./client";

export async function getAllComments() {
  return apiFetch("/comments/admin/all");
}

export async function rejectComment(id) {
  return apiFetch(`/comments/${id}/admin/reject`, {
    method: "PUT",
  });
}

export async function approveComment(id) {
  return apiFetch(`/comments/${id}/admin/approve`, {
    method: "PUT",
  });
}

export async function deleteComment(id) {
  return apiFetch(`/comments/${id}/admin`, {
    method: "DELETE",
  });
}
