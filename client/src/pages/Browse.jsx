import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import BookCard from '../components/BookCard';

const CONDITIONS = ['', 'New', 'Like New', 'Good', 'Acceptable', 'Old'];
const SORTS = [
  ['newest', 'Newest'], ['price-asc', 'Price: Low to High'],
  ['price-desc', 'Price: High to Low'], ['title-asc', 'Title A–Z']
];

export default function Browse() {
  const [params, setParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [cats, setCats] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const condition = params.get('condition') || '';
  const listing_type = params.get('listing_type') || '';
  const minPrice = params.get('minPrice') || '';
  const maxPrice = params.get('maxPrice') || '';
  const sort = params.get('sort') || 'newest';
  const page = Number(params.get('page') || 1);

  const set = (k, v) => {
    const p = new URLSearchParams(params);
    if (!v) p.delete(k); else p.set(k, v);
    p.delete('page');
    setParams(p);
  };

  useEffect(() => {
    api.get('/categories').then((r) => setCats(r.data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    api.get('/books', { params: { q, category, condition, listing_type, minPrice, maxPrice, sort, page, limit: 12 } })
      .then((r) => { setBooks(r.data.books); setTotal(r.data.total); setPages(r.data.pages); })
      .catch(() => {});
  }, [q, category, condition, listing_type, minPrice, maxPrice, sort, page]);

  return (
    <div className="container section">
      <h2>Browse Books</h2>
      <button className="btn btn-ghost" style={{ display: 'none' }} />
      <div className="toolbar">
        <span className="muted">{total} result{total === 1 ? '' : 's'}{q && <> for “<strong>{q}</strong>”</>}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => setShowFilters(!showFilters)}>☰ Filters</button>
          <select value={sort} onChange={(e) => set('sort', e.target.value)} style={{ padding: 9, borderRadius: 9 }}>
            {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>
      <div className="browse-layout">
        <aside className="filters" style={{ display: showFilters ? 'block' : undefined }} id="filterPanel">
          <h3>Filters</h3>
          <label>Search</label>
          <input value={q} onChange={(e) => set('q', e.target.value)} placeholder="Python, Java…" />
          <label>Category</label>
          <select value={category} onChange={(e) => set('category', e.target.value)}>
            <option value="">All categories</option>
            {cats.map((c) => <option key={c._id} value={c.category_name}>{c.category_name}</option>)}
          </select>
          <label>Condition</label>
          <select value={condition} onChange={(e) => set('condition', e.target.value)}>
            <option value="">Any condition</option>
            {CONDITIONS.filter(Boolean).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <label>Listing type</label>
          <select value={listing_type} onChange={(e) => set('listing_type', e.target.value)}>
            <option value="">Sell + Exchange</option>
            <option value="Sell">Sell</option>
            <option value="Exchange">Exchange</option>
            <option value="Both">Both</option>
          </select>
          <label>Min price (₹)</label>
          <input type="number" value={minPrice} onChange={(e) => set('minPrice', e.target.value)} placeholder="0" />
          <label>Max price (₹)</label>
          <input type="number" value={maxPrice} onChange={(e) => set('maxPrice', e.target.value)} placeholder="2000" />
          <button className="btn btn-ghost btn-block" onClick={() => setParams({})}>Clear filters</button>
        </aside>
        <div>
          {books.length === 0 ? (
            <div className="empty">
              <h3>No books found</h3>
              <p className="muted">We couldn't find any books matching your search.<br />Try a different title, author, category, or keyword.</p>
            </div>
          ) : (
            <div className="book-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginTop: 0 }}>
              {books.map((b) => <BookCard key={b._id} book={b} />)}
            </div>
          )}
          {pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={`btn ${p === page ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => { const sp = new URLSearchParams(params); sp.set('page', p); setParams(sp); }}>{p}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`@media(max-width:960px){#filterPanel{display:${showFilters ? 'block' : 'none'}} .book-grid{grid-template-columns:1fr 1fr !important}}@media(max-width:640px){.book-grid{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}
