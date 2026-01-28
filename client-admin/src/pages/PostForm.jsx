import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPost, updatePost, getPost } from "../api/posts";
import { isAdmin } from "../api/auth";
import { showSuccess, showError, showConfirm } from "../utils/confirm";
import Button from "../components/button/Button";
import "../styles/postForm.css";

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id && id !== "create";

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    published: false,
  });

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (isEditMode) {
      loadPost();
    }
  }, [id]);

  async function loadPost() {
    try {
      setFormLoading(true);
      const post = await getPost(id);
      setFormData({
        title: post.title || "",
        content: post.content || "",
        published: post.published || false,
      });
      setFieldErrors({ title: "", content: "" });
    } catch (err) {
      console.error("Load post error:", err);
      showError("Failed to load post: " + err.message);
      navigate("/posts");
    } finally {
      setFormLoading(false);
    }
  }

  const validateFrontend = () => {
    const newErrors = { title: "", content: "" };
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
      isValid = false;
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
      isValid = false;
    } else if (formData.content.length < 10) {
      newErrors.content = "Content must be at least 10 characters";
      isValid = false;
    }

    setFieldErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateFrontend()) {
      return;
    }

    if (isEditMode) {
      const isConfirmed = await showConfirm(
        isAdmin() ? "Update post as admin?" : "Update post?",
        "Are you sure you want to save these changes?",
        "Save Changes",
        "Cancel",
      );
      if (!isConfirmed) return;
    }

    setLoading(true);
    setFieldErrors({ title: "", content: "" });

    try {
      if (isEditMode) {
        await updatePost(id, formData);
        showSuccess("Post updated successfully!");
      } else {
        await createPost(formData);
        showSuccess("Post created successfully!");
      }

      navigate("/posts");
    } catch (err) {
      console.error("Submit error:", err);

      if (err.data?.errors) {
        const newErrors = { title: "", content: "" };

        err.data.errors.forEach((error) => {
          if (error.path === "title") {
            newErrors.title = error.msg;
          } else if (error.path === "content") {
            newErrors.content = error.msg;
          }
        });

        setFieldErrors(newErrors);

        if (err.data.errors[0]?.msg) {
          showError(err.data.errors[0].msg);
        }
      } else {
        showError(err.message || "Failed to save post");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = () => {
    if (formData.title || formData.content) {
      const confirmCancel = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?",
      );
      if (!confirmCancel) return;
    }
    navigate("/posts");
  };

  if (formLoading) {
    return (
      <div className="post-form-page">
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  return (
    <div className="post-form-page">
      <div className="page-header">
        <h1>{isEditMode ? "Edit Post" : "Create New Post"}</h1>
        {isEditMode && isAdmin() && (
          <div className="admin-badge">Editing as Administrator</div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title"
            disabled={loading || formLoading}
            className={fieldErrors.title ? "input-error" : ""}
          />
          {fieldErrors.title && (
            <div className="field-error">{fieldErrors.title}</div>
          )}
          <div className="input-hint">
            {formData.title.length}/200 characters
          </div>
        </div>

        {/* Content Field */}
        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your post content..."
            rows={12}
            disabled={loading || formLoading}
            className={fieldErrors.content ? "input-error" : ""}
          />
          {fieldErrors.content && (
            <div className="field-error">{fieldErrors.content}</div>
          )}
          <div className="char-info">
            <div className="char-count">
              {formData.content.length} characters
            </div>
            <div className="char-requirement">Minimum: 10 characters</div>
          </div>
        </div>

        {/* Published Field */}
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              disabled={loading || formLoading}
            />
            Publish this post
          </label>
          <small>
            {formData.published
              ? "Post will be visible to the public"
              : "Post will be saved as draft"}
          </small>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={loading || formLoading}
          >
            {loading
              ? isEditMode
                ? "Saving..."
                : "Creating..."
              : isEditMode
                ? "Update Post"
                : "Create Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
