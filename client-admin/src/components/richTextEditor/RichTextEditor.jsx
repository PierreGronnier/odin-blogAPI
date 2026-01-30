import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";
import "./editorStyles.css";
import { editorConfig } from "./editorConfig";

export default function RichTextEditor({
  value,
  onChange,
  disabled = false,
  error = false,
  placeholder = "Write your content here...",
}) {
  const editorRef = useRef(null);

  return (
    <div className={`rich-text-editor ${error ? "editor-error" : ""}`}>
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={value}
        onEditorChange={onChange}
        init={{
          ...editorConfig,
          placeholder: placeholder,
          content_style: `
            ${editorConfig.content_style}
            .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
              color: #718096;
              font-style: italic;
            }
          `,
        }}
        disabled={disabled}
      />
    </div>
  );
}
