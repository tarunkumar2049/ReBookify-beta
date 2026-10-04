import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>📚 ReBookify</h3>
          <p>Buy. Sell. Exchange. Reuse.</p>
          <p className="muted">Find the books you need. Give your old books a new home.</p>
        </div>
        <div>
          <h4>Marketplace</h4>
          <Link to="/browse">Browse Books</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/books/new">Sell a Book</Link>
        </div>
        <div>
          <h4>Company</h4>
          <Link to="/about">About</Link>
          <Link to="/how-it-works">How It Works</Link>
          <Link to="/future-scope">Future Scope</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
      </div>
      <div className="footer-bottom">© 2026 ReBookify • Student Book Exchange Platform • No payments / chat in v1 (see Future Scope)</div>
    </footer>
  );
}
