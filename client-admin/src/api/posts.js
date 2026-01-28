import { apiFetch } from "./client";

export async function getAllPosts() {
  return apiFetch("/posts/admin/list");
}

export async function getPost(id) {
  return apiFetch(`/posts/admin/${id}`);
}

export async function createPost(data) {
  return apiFetch("/posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePost(id, data) {
  return apiFetch(`/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deletePost(id) {
  return apiFetch(`/posts/${id}`, {
    method: "DELETE",
  });
}

export async function publishPost(id) {
  return apiFetch(`/posts/${id}/publish`, {
    method: "PUT",
  });
}

export async function unpublishPost(id) {
  return apiFetch(`/posts/${id}/unpublish`, {
    method: "PUT",
  });
}

export async function adminUpdatePost(id, data) {
  return apiFetch(`/posts/${id}/admin`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
