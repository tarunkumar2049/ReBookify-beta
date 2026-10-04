import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { fmtPrice, coverFallback } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { statusColor } from '../components/BookCard';

export default function Dashboard() {
  const { user, notify } = useAuth();
  const [books, setBooks] = useState([]);
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [txns, setTxns] = useState([]);
  const [del, setDel] = useState(null);
  const nav = useNavigate();

  const load = async () => {
    if (!user) return;
    try {
      const [b, s, r, t] = await Promise.all([
        api.get('/books', { params: { owner: user._id, status: 'all', limit: 50 } }),
        api.get('/requests', { params: { type: 'sent' } }),
        api.get('/requests', { params: { type: 'received' } }),
        api.get('/transactions'),
      ]);
      setBooks(b.data.books); setSent(s.data.requests); setReceived(r.data.requests); setTxns(t.data.transactions.slice(0, 5));
    } catch {}
  };

  useEffect(() => { load(); }, [user]);

  const doDelete = async () => {
    try { await api.delete(`/books/${del}`); notify('Book deleted'); setDel(null); load(); }
    catch { notify('Delete failed', 'error'); }
  };

  const pending = [...sent, ...received].filter((x) => x.status === 'Pending').length;
  const accepted = [...sent, ...received].filter((x) => x.status === 'Accepted').length;

  return (
    <div className="container section">
      <h1>Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
      <div className="stat-grid">
        <div className="stat"><span className="muted">Active Listings</span><strong>{books.filter((b) => b.status === 'Available').length}</strong></div>
        <div className="stat"><span className="muted">Pending Requests</span><strong>{pending}</strong></div>
        <div className="stat"><span className="muted">Accepted Requests</span><strong>{accepted}</strong></div>
        <div className="stat"><span className="muted">Completed Transactions</span><strong>{txns.filter((t) => t.status === 'Completed').length}</strong></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Listings</h2>
        <Link to="/books/new" className="btn btn-primary">+ List a Book</Link>
      </div>
      {books.length === 0 ? (
        <div className="empty"><h3>You haven't listed any books yet.</h3><Link to="/books/new" className="btn btn-primary">List Your First Book</Link></div>
      ) : (
        <div className="book-grid">
          {books.slice(0, 4).map((b) => (
            <div key={b._id} className="book-card">
              <img src={b.image_url || coverFallback(b.title)} alt={b.title} onError={(e) => { e.target.src = coverFallback(b.title); }} />
              <div className="book-body">
                <span className={`badge ${statusColor(b.status)}`}>{b.status}</span>
                <strong>{b.title}</strong>
                <span className="muted small">{fmtPrice(b.price)} • {b.condition}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Link to={`/books/${b._id}`} className="btn btn-ghost" style={{ flex: 1, textAlign: 'center' }}>View</Link>
                  <Link to={`/books/${b._id}/edit`} className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>Edit</Link>
                  <button className="btn btn-danger" onClick={() => setDel(b._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <p><Link to="/my-listings" style={{ color: 'var(--primary)', fontWeight: 700 }}>View all listings →</Link></p>

      <h2>Recent Requests</h2>
      {[...received, ...sent].length === 0 ? (
        <div className="empty"><h3>No exchange requests yet.</h3><p className="muted">Requests you send or receive will appear here.</p></div>
      ) : (
        [...received, ...sent].slice(0, 3).map((r) => (
          <div key={r._id} className="req-card">
            <strong>{r.book_id?.title}</strong> • {r.requester_id?.name} → {r.owner_id?.name}{' '}
            <span className={`badge ${statusColor(r.status)}`}>{r.status}</span>
          </div>
        ))
      )}
      <p><Link to="/requests" style={{ color: 'var(--primary)', fontWeight: 700 }}>Manage requests →</Link></p>

      <h2>Recent Transactions</h2>
      {txns.length === 0 ? (
        <div className="empty"><h3>Your transaction history is empty.</h3></div>
      ) : (
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Book</th><th>Buyer</th><th>Seller</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>{txns.map((t) => (
            <tr key={t._id}><td>{t.book_id?.title}</td><td>{t.buyer_id?.name}</td><td>{t.seller_id?.name}</td>
              <td><span className={`badge ${statusColor(t.status)}`}>{t.status}</span></td>
              <td>{new Date(t.created_at).toLocaleDateString()}</td></tr>
          ))}</tbody>
        </table></div>
      )}

      {del && (
        <div className="modal-back" onClick={() => setDel(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this listing?</h3>
            <p className="muted">This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" onClick={() => setDel(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={doDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
