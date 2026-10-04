import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { fmtPrice, coverFallback } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { statusColor } from '../components/BookCard';
import BookCard from '../components/BookCard';

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [sellerBooks, setSellerBooks] = useState([]);
  const [msg, setMsg] = useState('');
  const [offer, setOffer] = useState('');
  const [showReq, setShowReq] = useState(false);
  const { user, notify } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    api.get(`/books/${id}`).then((r) => { setBook(r.data.book); setSellerBooks(r.data.sellerBooks || []); }).catch(() => {});
  }, [id]);

  const sendRequest = async (e) => {
    e.preventDefault();
    if (!user) { nav('/login'); return; }
    try {
      await api.post('/requests', { book_id: id, message: msg, offer });
      notify('Request sent');
      setShowReq(false);
      nav('/requests');
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to send request', 'error');
    }
  };

  if (!book) return <div className="container section"><p className="muted">Loading…</p></div>;
  const isOwner = user && (book.user_id?._id === user._id || book.user_id === user._id);

  return (
    <div className="container section">
      <Link to="/browse" className="muted">← Back to browse</Link>
      <div className="detail-grid" style={{ marginTop: 16 }}>
        <img className="cover" src={book.image_url || coverFallback(book.title)} alt={book.title}
          onError={(e) => { e.target.src = coverFallback(book.title); }} />
        <div className="detail-card">
          <div className="book-tags">
            <span className="badge">{book.category || book.category_id?.category_name}</span>
            <span className="badge">{book.condition}</span>
            <span className={`badge ${statusColor(book.status)}`}>{book.status}</span>
          </div>
          <h1 style={{ margin: '10px 0 4px' }}>{book.title}</h1>
          <p className="muted">by {book.author}</p>
          <h2 className="price">{fmtPrice(book.price)}</h2>
          <p><strong>Seller:</strong> {book.user_id?.name || 'Student'} • Member since {book.user_id?.created_at ? new Date(book.user_id.created_at).getFullYear() : '—'}</p>
          <h3>Description</h3>
          <p className="muted">{book.description || 'No description provided.'}</p>
          <div className="detail-actions">
            {!isOwner && book.status === 'Available' && (
              <>
                <button className="btn btn-primary" onClick={() => { if (!user) nav('/login'); else { setShowReq(true); } }}>Buy / Request Book</button>
                <button className="btn btn-accent" onClick={() => { if (!user) nav('/login'); else setShowReq(true); }}>Send Exchange Request</button>
              </>
            )}
            {isOwner && <Link to={`/books/${book._id}/edit`} className="btn btn-outline">Edit Listing</Link>}
          </div>
          {!user && <p className="muted small" style={{ marginTop: 10 }}>Please <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>login</Link> to send a request.</p>}
        </div>
      </div>

      {sellerBooks.length > 0 && (
        <div style={{ marginTop: 34 }}>
          <h3>More from this seller</h3>
          <div className="book-grid">{sellerBooks.map((b) => <BookCard key={b._id} book={b} />)}</div>
        </div>
      )}

      {showReq && (
        <div className="modal-back" onClick={() => setShowReq(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Send Exchange Request</h3>
            <p className="muted small">Book: <strong>{book.title}</strong></p>
            <form onSubmit={sendRequest}>
              <div className="form-wrap" style={{ boxShadow: 'none', padding: 0, margin: 0 }}>
                <label>Message</label>
                <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="I would like to exchange this book…" required />
                <label>Offer (optional)</label>
                <input value={offer} onChange={(e) => setOffer(e.target.value)} placeholder="e.g. Will exchange with Operating Systems book" />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowReq(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Send Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
