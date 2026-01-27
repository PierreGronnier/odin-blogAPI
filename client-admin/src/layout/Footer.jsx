import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Pierre Gronnier | Admin Panel</p>
    </footer>
  );
}

export default Footer;
