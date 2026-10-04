import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const { notify } = useAuth();
  const load = () => api.get('/admin/users', { params: { q } }).then((r) => setUsers(r.data.users)).catch(() => {});
  useEffect(() => { load(); }, []);
  const remove = async (id) => {
    if (!confirm('Remove this user and their listings?')) return;
    try { await api.delete(`/admin/users/${id}`); notify('User removed'); load(); }
    catch (e) { notify(e.response?.data?.message || 'Failed', 'error'); }
  };
  return (
    <div>
      <h2>User Management</h2>
      <form onSubmit={(e) => { e.preventDefault(); load(); }} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users…" style={{ flex: 1, padding: 10, borderRadius: 9, border: '1.5px solid var(--border)' }} />
        <button className="btn btn-primary">Search</button>
      </form>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>User ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Registered</th><th>Action</th></tr></thead>
        <tbody>{users.map((u) => (
          <tr key={u._id}><td className="muted small">{u._id.slice(-8)}</td><td>{u.name}</td><td>{u.email}</td><td>{u.phone}</td>
            <td>{new Date(u.created_at).toLocaleDateString()}</td>
            <td><button className="btn btn-danger" onClick={() => remove(u._id)}>Remove</button></td></tr>
        ))}</tbody>
      </table></div>
    </div>
  );
}
