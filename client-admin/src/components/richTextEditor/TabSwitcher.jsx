import "./editorStyles.css";
import editIcon from "../../assets/icons/create.png";
import previewIcon from "../../assets/icons/eye.png";

export default function TabSwitcher({ activeTab, onTabChange, disabled }) {
  return (
    <div className="editor-tabs">
      <button
        type="button"
        className={`tab-btn ${activeTab === "edit" ? "active" : ""}`}
        onClick={() => onTabChange("edit")}
        disabled={disabled}
      >
        <img src={editIcon} alt="Edit" /> Edit
      </button>
      <button
        type="button"
        className={`tab-btn ${activeTab === "preview" ? "active" : ""}`}
        onClick={() => onTabChange("preview")}
        disabled={disabled}
      >
        <img src={previewIcon} alt="Edit" /> Preview
      </button>
    </div>
  );
}
