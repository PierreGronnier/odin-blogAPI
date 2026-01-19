import { apiFetch } from "./client";

export function getPosts() {
  return apiFetch("/posts");
}

export function getPostById(id) {
  return apiFetch(`/posts/${id}`);
}
