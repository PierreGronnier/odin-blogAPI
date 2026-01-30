export const editorConfig = {
  height: 500,
  menubar: true,

  plugins: [
    "advlist autolink lists link image charmap preview anchor",
    "searchreplace visualblocks code fullscreen codesample",
    "insertdatetime media table help wordcount",
  ].join(" "),

  toolbar:
    "undo redo | blocks | bold italic | alignleft aligncenter alignright | " +
    "bullist numlist outdent indent | link image media codesample | code help",

  codesample_languages: [
    { text: "HTML/XML", value: "markup" },
    { text: "JavaScript", value: "javascript" },
    { text: "CSS", value: "css" },
    { text: "JSX", value: "jsx" },
    { text: "TypeScript", value: "typescript" },
    { text: "JSON", value: "json" },
  ],

  media_live_embeds: false,
  extended_valid_elements:
    "iframe[src|width|height|frameborder|allowfullscreen|allow|title|style|class|sandbox|loading]",
  valid_children: "+body[iframe],+div[iframe],+p[iframe]",

  automatic_uploads: true,
  paste_data_images: true,
  image_title: true,
  image_caption: true,

  content_style: `
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      font-size: 16px; 
      line-height: 1.6;
      margin: 1rem;
      color: #333;
    }
    h1 { font-size: 2em; margin: 1em 0 0.5em; }
    h2 { font-size: 1.5em; margin: 1em 0 0.5em; }
    h3 { font-size: 1.25em; margin: 1em 0 0.5em; }
    p { margin: 1em 0; }
    img { 
      max-width: 100%; 
      height: auto;
      display: block;
      margin: 1rem auto;
    }
    iframe {
      max-width: 100%;
      display: block;
      margin: 1rem auto;
    }
    pre {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
      margin: 1rem 0;
    }
    code {
      background: #f5f5f5;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
    blockquote {
      border-left: 4px solid #48bb78;
      padding-left: 1rem;
      margin: 1.5rem 0;
      font-style: italic;
    }
  `,

  placeholder: "Write your content here...",
  branding: false,
  promotion: false,
  resize: true,
  statusbar: true,
};
