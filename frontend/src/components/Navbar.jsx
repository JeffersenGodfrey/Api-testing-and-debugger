import '../styles/Navbar.css';

/**
 * Navbar Component
 * Top navigation bar with app title and branding
 */
function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <h1>Jeff's Debugger</h1>
        </div>
        <div className="navbar-subtitle">
          Test & Debug APIs Instantly
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
