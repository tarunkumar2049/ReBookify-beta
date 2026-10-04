import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CONDITIONS = ['New', 'Like New', 'Good', 'Acceptable', 'Old'];

export default function BookForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', category: '', price: '', condition: 'Good', description: '', image_url: '', listing_type: 'Both' });
  const [err, setErr] = useState('');
  const { notify } = useAuth();
  const nav = useNavigate();
  const set = (k, v) => setForm({ ...form, [k]: v });

  useEffect(() => {
    api.get('/categories').then((r) => {
      setCats(r.data.categories || []);
      if (!isEdit && r.data.categories[0]) setForm((f) => ({ ...f, category: f.category || r.data.categories[0].category_name }));
    }).catch(() => {});
    if (isEdit) {
      api.get(`/books/${id}`).then((r) => {
        const b = r.data.book;
        setForm({
          title: b.title, author: b.author, category: b.category || b.category_id?.category_name || '',
          price: b.price, condition: b.condition, description: b.description || '',
          image_url: b.image_url || '', listing_type: b.listing_type || 'Both'
        });
      }).catch(() => setErr('Failed to load listing'));
    }
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!form.title || !form.author || !form.price) { setErr('Title, author and price are required'); return; }
    try {
      if (isEdit) {
        await api.put(`/books/${id}`, { ...form, price: Number(form.price) });
        notify('Book updated');
      } else {
        await api.post('/books', { ...form, price: Number(form.price) });
        notify('Book listed successfully');
      }
      nav('/my-listings');
    } catch (ex) { setErr(ex.response?.data?.message || 'Save failed'); }
  };

  return (
    <div className="container">
      <form className="form-wrap wide" onSubmit={submit}>
        <h2>{isEdit ? 'Edit Listing' : 'List a Book'} 📚</h2>
        <p className="muted">Status: <strong>Available</strong> on publish</p>
        {err && <div className="error">{err}</div>}
        <label>Book Title</label>
        <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Data Structures" />
        <label>Author</label>
        <input value={form.author} onChange={(e) => set('author', e.target.value)} placeholder="e.g. Seymour Lipschutz" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label>Category</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)}>
              {(cats || []).map((c) => <option key={c._id} value={c.category_name}>{c.category_name}</option>)}
            </select>
          </div>
          <div>
            <label>Price (₹)</label>
            <input type="number" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} placeholder="450" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label>Condition</label>
            <select value={form.condition} onChange={(e) => set('condition', e.target.value)}>
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label>Listing type</label>
            <select value={form.listing_type} onChange={(e) => set('listing_type', e.target.value)}>
              <option value="Both">Sell + Exchange</option>
              <option value="Sell">Sell only</option>
              <option value="Exchange">Exchange only</option>
            </select>
          </div>
        </div>
        <label>Description</label>
        <textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Edition, pages, markings, pickup info…" />
        <label>Book Image URL</label>
        <input value={form.image_url} onChange={(e) => set('image_url', e.target.value)} placeholder="https://… (optional)" />
        {form.image_url && <img src={form.image_url} alt="preview" style={{ width: 120, borderRadius: 10, marginTop: 8 }} onError={(e) => { e.target.style.display = 'none'; }} />}
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button type="button" className="btn btn-ghost" onClick={() => nav(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary">{isEdit ? 'Save Changes' : 'Publish Listing'}</button>
        </div>
      </form>
    </div>
  );
}
