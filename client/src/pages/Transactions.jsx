import { useEffect, useState } from 'react';
import api from '../services/api';
import { statusColor } from '../components/BookCard';

export default function Transactions() {
  const [txns, setTxns] = useState([]);
  const [status, setStatus] = useState('');
  const load = () => {
    api.get('/transactions', { params: status ? { status } : {} }).then((r) => setTxns(r.data.transactions)).catch(() => {});
  };
  useEffect(() => { load(); }, [status]);

  return (
    <div className="container section">
      <h1>Transaction History</h1>
      <div className="toolbar">
        <span className="muted">{txns.length} transaction(s)</span>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: 9, borderRadius: 9 }}>
          <option value="">All statuses</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      {txns.length === 0 ? <div className="empty"><h3>Your transaction history is empty.</h3></div> : (
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Transaction ID</th><th>Book</th><th>Buyer</th><th>Seller</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>{txns.map((t) => (
            <tr key={t._id}>
              <td className="muted small">{t._id.slice(-8)}</td>
              <td>{t.book_id?.title}</td><td>{t.buyer_id?.name}</td><td>{t.seller_id?.name}</td>
              <td><span className={`badge ${statusColor(t.status)}`}>{t.status}</span></td>
              <td>{new Date(t.created_at).toLocaleString()}</td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </div>
  );
}
