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

  const responseClone = response.clone();

  if (response.status === 401) {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_name");

    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }

    try {
      const errorText = await responseClone.text();
      if (errorText) {
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(
            errorData.error || errorData.message || "Unauthorized",
          );
        } catch (parseError) {
          console.warn("Failed to parse 401 error JSON:", parseError);
          throw new Error(errorText || "Unauthorized");
        }
      }
    } catch (readError) {
      console.warn("Failed to read 401 error response:", readError);
    }

    throw new Error("Unauthorized - Please login again");
  }

  const contentType = response.headers.get("content-type");

  if (response.status === 204) {
    return null;
  }

  let responseText;
  try {
    responseText = await response.text();
  } catch (error) {
    throw new Error(`Failed to read response: ${error.message}`);
  }

  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    let errorData = null;

    if (responseText && responseText.trim()) {
      try {
        errorData = JSON.parse(responseText);

        if (
          errorData.errors &&
          Array.isArray(errorData.errors) &&
          errorData.errors.length > 0
        ) {
          errorMessage = errorData.errors
            .map(
              (err) =>
                err.msg || err.message || `${err.path}: validation failed`,
            )
            .join(", ");
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === "string") {
          errorMessage = errorData;
        }
      } catch (parseError) {
        console.warn("Failed to parse error JSON:", parseError);
        errorMessage =
          responseText.length > 100
            ? `${responseText.substring(0, 100)}...`
            : responseText;
      }
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.statusText = response.statusText;
    error.url = `${API_URL}${endpoint}`;

    if (errorData) {
      error.data = errorData;
    }

    if (responseText) {
      error.responseText = responseText;
    }

    throw error;
  }

  if (contentType && contentType.includes("application/json")) {
    try {
      return JSON.parse(responseText);
    } catch (error) {
      throw new Error(`Invalid JSON response from server: ${error.message}`);
    }
  }

  return responseText;
}

export { API_URL };
