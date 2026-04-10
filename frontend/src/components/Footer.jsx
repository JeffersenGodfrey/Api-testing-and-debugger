import '../styles/Footer.css';

/**
 * Footer Component
 * Footer information
 */
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>API testing</p>
        <p className="footer-meta">© {year} Built for learning development and deployment</p>
      </div>
    </footer>
  );
}

export default Footer;
