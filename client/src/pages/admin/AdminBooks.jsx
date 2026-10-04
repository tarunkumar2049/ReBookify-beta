import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const { notify } = useAuth();
  const load = () => api.get('/admin/books', { params: { q, status } }).then((r) => setBooks(r.data.books || [])).catch(() => {});
  useEffect(() => { load(); }, []);
  const remove = async (id) => {
    if (!confirm('Remove this inappropriate listing?')) return;
    await api.delete(`/admin/books/${id}`);
    notify('Listing removed'); load();
  };
  return (
    <div>
      <h2>Book Management</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search books…" style={{ flex: 1, padding: 10, borderRadius: 9, border: '1.5px solid var(--border)' }} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: 10, borderRadius: 9 }}>
          <option value="">All</option><option>Available</option><option>Requested</option><option>Exchanged</option>
        </select>
        <button className="btn btn-primary" onClick={load}>Search</button>
      </div>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Title</th><th>Author</th><th>Owner</th><th>Price</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>{books.map((b) => (
          <tr key={b._id}><td>{b.title}</td><td>{b.author}</td><td>{b.user_id?.name}<br /><span className="muted small">{b.user_id?.email}</span></td>
            <td>₹{b.price}</td><td>{b.status}</td>
            <td><button className="btn btn-danger" onClick={() => remove(b._id)}>Remove</button></td></tr>
        ))}</tbody>
      </table></div>
    </div>
  );
}
