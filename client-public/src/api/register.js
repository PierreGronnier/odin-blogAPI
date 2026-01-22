import { apiFetch } from "./client";

export function register(username, email, password) {
  return apiFetch(`/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
}
