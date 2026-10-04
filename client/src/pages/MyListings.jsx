import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { fmtPrice, coverFallback } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { statusColor } from '../components/BookCard';

export default function MyListings() {
  const { user, notify } = useAuth();
  const [books, setBooks] = useState([]);
  const [tab, setTab] = useState('All');
  const [del, setDel] = useState(null);

  const load = () => {
    if (!user) return;
    api.get('/books', { params: { owner: user._id, status: 'all', limit: 100 } })
      .then((r) => setBooks(r.data.books || [])).catch(() => {});
  };
  useEffect(() => { load(); }, [user]);

  const filtered = books.filter((b) => tab === 'All' ? true : b.status === tab);

  const doDelete = async () => {
    try { await api.delete(`/books/${del}`); notify('Book deleted'); setDel(null); load(); }
    catch { notify('Delete failed', 'error'); }
  };

  return (
    <div className="container section">
      <h1>My Listings</h1>
      <div className="tabs">
        {['All', 'Available', 'Requested', 'Exchanged'].map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="empty"><h3>You haven't listed any books yet.</h3><Link to="/books/new" className="btn btn-primary">List Your First Book</Link></div>
      ) : (
        <div className="book-grid">
          {filtered.map((b) => (
            <div key={b._id} className="book-card">
              <img src={b.image_url || coverFallback(b.title)} alt={b.title} onError={(e) => { e.target.src = coverFallback(b.title); }} />
              <div className="book-body">
                <span className={`badge ${statusColor(b.status)}`}>{b.status}</span>
                <strong>{b.title}</strong>
                <span className="muted small">{fmtPrice(b.price)} • {b.condition} • {new Date(b.created_at).toLocaleDateString()}</span>
                <div className="card-actions">
                  <Link to={`/books/${b._id}`} className="btn btn-ghost">View</Link>
                  <Link to={`/books/${b._id}/edit`} className="btn btn-outline">Edit</Link>
                  <button className="btn btn-danger" onClick={() => setDel(b._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {del && (
        <div className="modal-back" onClick={() => setDel(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this listing?</h3>
            <p className="muted">This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setDel(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={doDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
