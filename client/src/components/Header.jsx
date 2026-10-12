import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo"><span className="logo-mark">📚</span>ReBookify</Link>
        <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
        <nav className={`nav ${open ? 'open' : ''}`}>
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/browse" onClick={() => setOpen(false)}>Browse Books</NavLink>
          <NavLink to="/categories" onClick={() => setOpen(false)}>Categories</NavLink>
          <NavLink to="/how-it-works" onClick={() => setOpen(false)}>How It Works</NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)}>About</NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard" onClick={() => setOpen(false)}>Dashboard</NavLink>
              {user.role === 'admin' && <NavLink to="/admin" onClick={() => setOpen(false)}>Admin</NavLink>}
              <button className="btn btn-ghost" onClick={() => { logout(); nav('/'); setOpen(false); }}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setOpen(false)}>Login</NavLink>
              <NavLink to="/register" onClick={() => setOpen(false)}>Register</NavLink>
            </>
          )}
          <Link to={user ? '/books/new' : '/login'} className="btn btn-primary" onClick={() => setOpen(false)}>+ List a Book</Link>
        </nav>
      </div>
    </header>
  );
}
