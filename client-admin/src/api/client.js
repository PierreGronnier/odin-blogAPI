const API_URL = import.meta.env.VITE_API_URL;

// Generic API fetch function with JWT handling
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("jwt_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_name");
    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  const contentType = response.headers.get("content-type");
  if (response.status === 204) {
    return null;
  }

  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(`Server returned non-JSON: ${text.substring(0, 100)}`);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || `Error ${response.status}`);
  }

  return data;
}

export { API_URL };
