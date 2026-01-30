const sanitizeHtml = require("sanitize-html");

// Configuration pour les posts (HTML riche)
const postSanitizeOptions = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "br",
    "hr",
    "div",
    "span",
    "section",
    "article",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "strike",
    "sub",
    "sup",
    "code",
    "ul",
    "ol",
    "li",
    "blockquote",
    "pre",
    "a",
    "img",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "iframe",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel", "title", "class"],
    img: [
      "src",
      "alt",
      "title",
      "width",
      "height",
      "style",
      "class",
      "loading",
    ],
    div: ["class", "style"],
    span: ["class", "style"],
    p: ["class", "style"],
    h1: ["class", "style"],
    h2: ["class", "style"],
    h3: ["class", "style"],
    h4: ["class", "style"],
    h5: ["class", "style"],
    h6: ["class", "style"],
    table: ["border", "cellpadding", "cellspacing", "class", "style"],
    td: ["colspan", "rowspan", "class", "style"],
    th: ["colspan", "rowspan", "class", "style"],
    code: ["class"],
    iframe: [
      "src",
      "width",
      "height",
      "frameborder",
      "allow",
      "allowfullscreen",
      "allowpaymentrequest",
      "title",
      "class",
      "style",
      "sandbox",
      "scrolling",
      "marginwidth",
      "marginheight",
    ],
  },
  allowedSchemes: ["http", "https", "ftp", "mailto"],
  allowedSchemesByTag: {
    img: ["http", "https", "data"],
    a: ["http", "https", "mailto"],
    iframe: ["http", "https"],
  },
  allowedClasses: {
    "*": [
      "align-left",
      "align-right",
      "align-center",
      "align-justify",
      "mce*",
      "tox-*",
      "language-*",
      "hljs*",
    ],
  },
  transformTags: {
    a: function (tagName, attribs) {
      // Sécuriser les liens externes
      if (attribs.href && attribs.href.startsWith("http")) {
        attribs.target = attribs.target || "_blank";
        attribs.rel = "noopener noreferrer nofollow";
      }
      return { tagName: tagName, attribs: attribs };
    },
    img: function (tagName, attribs) {
      // S'assurer que les images ont un alt
      if (!attribs.alt) {
        attribs.alt = "Image";
      }
      // Ajouter lazy loading
      attribs.loading = attribs.loading || "lazy";
      return { tagName: tagName, attribs: attribs };
    },
  },
  exclusiveFilter: function (frame) {
    // Filtrer les éléments vides
    return (
      (frame.tag === "div" || frame.tag === "span") &&
      !frame.text.trim() &&
      !Object.keys(frame.attribs).length
    );
  },
};

// Configuration pour les commentaires (plus stricte)
const commentSanitizeOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "code",
    "ul",
    "ol",
    "li",
    "blockquote",
    "pre",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    code: ["class"],
  },
  allowedSchemes: ["http", "https"],
  transformTags: {
    a: function (tagName, attribs) {
      if (attribs.href && attribs.href.startsWith("http")) {
        attribs.target = "_blank";
        attribs.rel = "noopener noreferrer nofollow";
      }
      return { tagName: tagName, attribs: attribs };
    },
  },
};

// Configuration générale (pour tous les autres champs)
const generalSanitizeOptions = {
  allowedTags: [],
  allowedAttributes: {},
  textFilter: function (text) {
    // Échapper les caractères HTML dans le texte brut
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  },
};

// Middleware principal
const sanitizeHtmlMiddleware = (req, res, next) => {
  // Fonction pour nettoyer récursivement un objet
  const sanitizeObject = (obj, options) => {
    if (obj === null || obj === undefined) {
      return obj;
    }

    // Si c'est une chaîne, la nettoyer
    if (typeof obj === "string") {
      return sanitizeHtml(obj, options);
    }

    // Si c'est un tableau, nettoyer chaque élément
    if (Array.isArray(obj)) {
      return obj.map((item) => sanitizeObject(item, options));
    }

    // Si c'est un objet, nettoyer récursivement
    if (typeof obj === "object") {
      const cleanObj = {};
      for (const [key, value] of Object.entries(obj)) {
        cleanObj[key] = sanitizeObject(value, options);
      }
      return cleanObj;
    }

    // Pour les autres types (nombres, booléens), les laisser tel quel
    return obj;
  };

  // Appliquer la sanitisation au body
  if (req.body && typeof req.body === "object") {
    let options = generalSanitizeOptions;

    // Routes pour les posts (HTML riche autorisé)
    if (
      req.path.includes("/posts") &&
      (req.method === "POST" || req.method === "PUT" || req.method === "PATCH")
    ) {
      const cleanBody = { ...req.body };

      for (const [key, value] of Object.entries(cleanBody)) {
        if (key === "content") {
          cleanBody[key] = sanitizeHtml(value, postSanitizeOptions);
        } else {
          cleanBody[key] = sanitizeObject(value, generalSanitizeOptions);
        }
      }

      req.body = cleanBody;
    }
    // Routes pour les commentaires (HTML limité)
    else if (
      req.path.includes("/comments") &&
      (req.method === "POST" || req.method === "PUT" || req.method === "PATCH")
    ) {
      const cleanBody = { ...req.body };

      for (const [key, value] of Object.entries(cleanBody)) {
        if (key === "content") {
          cleanBody[key] = sanitizeHtml(value, commentSanitizeOptions);
        } else {
          cleanBody[key] = sanitizeObject(value, generalSanitizeOptions);
        }
      }

      req.body = cleanBody;
    } else {
      req.body = sanitizeObject(req.body, generalSanitizeOptions);
    }
  }

  if (req.query && typeof req.query === "object") {
    req.query = sanitizeObject(req.query, generalSanitizeOptions);
  }

  next();
};

module.exports = sanitizeHtmlMiddleware;
