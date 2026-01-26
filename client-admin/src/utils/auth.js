// src/utils/auth.js

// Décoder le token JWT pour obtenir le payload
export function decodeToken(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (error) {
    console.error("Erreur lors du décodage du token:", error);
    return null;
  }
}

// Vérifier si l'utilisateur est authentifié et a le rôle admin
export function isAdmin() {
  const token = localStorage.getItem("jwt_token");
  if (!token) return false;

  const payload = decodeToken(token);
  if (!payload) return false;

  return payload.role === "ADMIN";
}

// Récupérer les infos de l'utilisateur depuis le token
export function getUserInfo() {
  const token = localStorage.getItem("jwt_token");
  if (!token) return null;

  const payload = decodeToken(token);
  if (!payload) return null;

  return {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    // Note: le username n'est pas dans le token par défaut, on le stocke dans localStorage
    username: localStorage.getItem("user_name"),
  };
}

// Déconnexion
export function logout() {
  // Appel API pour invalider le token côté serveur (optionnel mais recommandé)
  // On ne bloque pas la déconnexion si l'appel échoue
  const token = localStorage.getItem("jwt_token");
  if (token) {
    fetch("http://localhost:3001/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch(console.error);
  }

  // Nettoyage local
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_role");
}
