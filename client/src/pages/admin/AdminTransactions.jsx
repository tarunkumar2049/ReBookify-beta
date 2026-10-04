import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminTransactions() {
  const [txns, setTxns] = useState([]);
  useEffect(() => {
    api.get('/admin/transactions').then((r) => setTxns(r.data.transactions || [])).catch(() => {});
  }, []);
  return (
    <div>
      <h2>Transaction Monitoring</h2>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Transaction ID</th><th>Book</th><th>Buyer</th><th>Seller</th><th>Status</th></tr></thead>
        <tbody>{txns.map((t) => (
          <tr key={t._id}><td className="muted small">{t._id.slice(-8)}</td><td>{t.book_id?.title}</td><td>{t.buyer_id?.name}</td><td>{t.seller_id?.name}</td><td>{t.status}</td></tr>
        ))}</tbody>
      </table></div>
    </div>
  );
}
