import { API_URL } from "./client";

// Login function with admin check
export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage =
        errorJson.error || errorJson.message || `Error ${response.status}`;
    } catch {
      errorMessage = errorText || `Error ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (!data.token) {
    throw new Error("No token received from server");
  }

  try {
    const payload = JSON.parse(atob(data.token.split(".")[1]));

    if (payload.role !== "ADMIN") {
      throw new Error("You must have ADMIN role to access this panel.");
    }

    localStorage.setItem("jwt_token", data.token);
    localStorage.setItem("user_name", data.user?.username || "Admin");

    return data;
  } catch (error) {
    if (error.message.includes("ADMIN role")) {
      throw error;
    }
    throw new Error("Invalid token received. Please try again.");
  }
}

// Logout function
export async function logout() {
  const token = localStorage.getItem("jwt_token");
  if (token) {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  localStorage.removeItem("jwt_token");
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_role");
}

// Token utilities
export function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export function isAdmin() {
  const token = localStorage.getItem("jwt_token");
  if (!token) return false;

  const payload = decodeToken(token);
  return payload && payload.role === "ADMIN";
}

export function getUserInfo() {
  const token = localStorage.getItem("jwt_token");
  if (!token) return null;

  const payload = decodeToken(token);
  if (!payload) return null;

  return {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    username: localStorage.getItem("user_name") || payload.email,
  };
}
