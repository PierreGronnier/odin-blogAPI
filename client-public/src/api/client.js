export const API_URL = process.env.REACT_APP_API_URL;

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("jwt_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const res = await fetch(`${API_URL}${endpoint}`, config);

  if (res.status === 401) {
    localStorage.removeItem("jwt_token");
    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login";
      return;
    }
    const errorText = await res.text();
    throw new Error(errorText || "Invalid credentials");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "An error has occurred");
  }

  if (res.status === 204) {
    return null;
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  return res.text();
}
