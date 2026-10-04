import { Link } from 'react-router-dom';
import { fmtPrice, coverFallback } from '../services/api';

export const statusColor = (s) => ({
  Available: 'green', Requested: 'amber', Pending: 'amber', Accepted: 'blue',
  Rejected: 'red', Completed: 'green', Cancelled: 'grey', Exchanged: 'grey', Removed: 'red'
}[s] || 'grey');

export default function BookCard({ book }) {
  const img = book.image_url || coverFallback(book.title);
  return (
    <div className="book-card">
      <Link to={`/books/${book._id}`}>
        <img src={img} alt={book.title} loading="lazy" onError={(e) => { e.target.src = coverFallback(book.title); }} />
      </Link>
      <div className="book-body">
        <div className="book-tags">
          <span className="badge">{book.category || book.category_id?.category_name}</span>
          <span className={`badge ${statusColor(book.status)}`}>{book.status}</span>
        </div>
        <Link to={`/books/${book._id}`} className="book-title">{book.title}</Link>
        <div className="muted small">{book.author} • {book.condition}</div>
        <div className="book-row">
          <strong className="price">{fmtPrice(book.price)}</strong>
          <span className="muted small">by {book.user_id?.name || 'Student'}</span>
        </div>
        <Link to={`/books/${book._id}`} className="btn btn-outline btn-block">View Details</Link>
      </div>
    </div>
  );
}
