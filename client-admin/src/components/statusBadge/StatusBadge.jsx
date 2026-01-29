import "./statusBadge.css";

export default function StatusBadge({ status = "draft", children }) {
  const getDefaultText = () => {
    if (status === "published") return "Published";
    if (status === "draft") return "Draft";
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";
    if (status === "pending") return "Pending";
    return status;
  };

  return (
    <span className={`status-badge status-${status}`}>
      {children || getDefaultText()}
    </span>
  );
}
