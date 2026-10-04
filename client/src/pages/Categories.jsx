import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Categories() {
  const [cats, setCats] = useState([]);
  useEffect(() => {
    api.get('/categories').then((r) => setCats(r.data.categories || [])).catch(() => {});
  }, []);
  return (
    <div className="container section">
      <h2>Book Categories</h2>
      <p className="muted">Categories are loaded dynamically from MongoDB.</p>
      <div className="cat-grid">
        {(cats || []).map((c) => (
          <Link key={c._id} to={`/browse?category=${encodeURIComponent(c.category_name)}`} className="cat-card">
            <div className="icon">{c.icon || '📚'}</div>
            <h4 style={{ margin: '8px 0 4px' }}>{c.category_name}</h4>
            <p className="muted small">{c.description}</p>
            <span className="badge green">{c.bookCount} available</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
