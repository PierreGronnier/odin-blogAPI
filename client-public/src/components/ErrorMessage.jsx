import "../styles/error.css";

function ErrorMessage({ title, message }) {
  return (
    <div className="error-box">
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;
