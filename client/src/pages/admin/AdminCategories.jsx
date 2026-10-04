import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ category_name: '', description: '', icon: '📚' });
  const [edit, setEdit] = useState(null);
  const { notify } = useAuth();
  const load = () => api.get('/categories').then((r) => setCats(r.data.categories || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (edit) { await api.put(`/categories/${edit}`, form); notify('Category updated'); }
      else { await api.post('/categories', form); notify('Category added'); }
      setForm({ category_name: '', description: '', icon: '📚' }); setEdit(null); load();
    } catch (ex) { notify(ex.response?.data?.message || 'Failed', 'error'); }
  };
  const remove = async (id) => {
    if (!confirm('Delete category?')) return;
    try { await api.delete(`/categories/${id}`); notify('Category deleted'); load(); }
    catch (e) { notify(e.response?.data?.message || 'Failed', 'error'); }
  };

  return (
    <div>
      <h2>Category Management</h2>
      <form onSubmit={submit} className="req-card" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input value={form.category_name} onChange={(e) => setForm({ ...form, category_name: e.target.value })} placeholder="Category name" required style={{ padding: 10, borderRadius: 9, border: '1.5px solid var(--border)', flex: 1 }} />
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" style={{ padding: 10, borderRadius: 9, border: '1.5px solid var(--border)', flex: 2 }} />
        <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Icon" style={{ width: 70, padding: 10, borderRadius: 9, border: '1.5px solid var(--border)' }} />
        <button className="btn btn-primary">{edit ? 'Update' : 'Add category'}</button>
        {edit && <button type="button" className="btn btn-ghost" onClick={() => { setEdit(null); setForm({ category_name: '', description: '', icon: '📚' }); }}>Cancel</button>}
      </form>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Name</th><th>Description</th><th>Usage (available)</th><th>Actions</th></tr></thead>
        <tbody>{cats.map((c) => (
          <tr key={c._id}><td>{c.icon} {c.category_name}</td><td>{c.description}</td><td>{c.bookCount}</td>
            <td style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-outline" onClick={() => { setEdit(c._id); setForm({ category_name: c.category_name, description: c.description, icon: c.icon }); }}>Edit</button>
              <button className="btn btn-danger" onClick={() => remove(c._id)}>Delete</button>
            </td></tr>
        ))}</tbody>
      </table></div>
    </div>
  );
}
