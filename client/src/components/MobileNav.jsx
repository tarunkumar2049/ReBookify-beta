import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MobileNav() {
  const { user } = useAuth();
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <NavLink to="/" end><span className="mn-icon">🏠</span>Home</NavLink>
      <NavLink to="/browse"><span className="mn-icon">🔎</span>Browse</NavLink>
      <Link to={user ? '/books/new' : '/login'} className="mn-sell"><span className="mn-fab">＋</span>Sell</Link>
      <NavLink to="/requests"><span className="mn-icon">🤝</span>Requests</NavLink>
      <NavLink to={user ? '/dashboard' : '/login'}><span className="mn-icon">👤</span>{user ? 'Account' : 'Login'}</NavLink>
    </nav>
  );
}
