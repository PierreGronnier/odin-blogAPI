import "./statusBadge.css";

export default function StatusBadge({ status = "draft", children }) {
  return (
    <span className={`status-badge status-${status}`}>
      {children || (status === "published" ? "Published" : "Draft")}
    </span>
  );
}
