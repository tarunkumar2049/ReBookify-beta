import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import BookCard from '../components/BookCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [cats, setCats] = useState([]);
  const [q, setQ] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    api.get('/books', { params: { limit: 8 } }).then((r) => setFeatured(r.data.books || [])).catch(() => {});
    api.get('/categories').then((r) => setCats((r.data.categories || []).slice(0, 8))).catch(() => {});
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <h1>Give Your Books a Second Life.</h1>
            <p className="sub">Buy, sell, and exchange books with students around you. Save money, discover great books, and reduce waste.</p>
            <div className="hero-cta">
              <Link to="/browse" className="btn btn-primary">Browse Books</Link>
              <Link to="/books/new" className="btn btn-accent">Sell a Book</Link>
            </div>
            <form className="searchbar" onSubmit={(e) => { e.preventDefault(); nav(`/browse?q=${encodeURIComponent(q)}`); }}>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search books by title, author, category or keyword..." />
              <button className="btn btn-primary" type="submit">Search</button>
            </form>
            <div className="hero-stats">
              <div><strong>1000+</strong><br /><span className="muted">Books listed</span></div>
              <div><strong>500+</strong><br /><span className="muted">Students</span></div>
              <div><strong>🌱 Eco</strong><br /><span className="muted">Friendly reuse</span></div>
            </div>
          </div>
          <div className="hero-art">
            <img src="https://picsum.photos/seed/study1/400/600" alt="books" />
            <img src="https://picsum.photos/seed/study2/400/600" alt="students" />
            <img src="https://picsum.photos/seed/study3/400/600" alt="library" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="center">Why ReBookify?</h2>
          <p className="center muted">Affordable, centralized and sustainable book exchange for students.</p>
          <div className="cards4">
            <div className="feature-card"><div className="icon">💰</div><h3>Save Money</h3><p className="muted">Find affordable used textbooks and study materials.</p></div>
            <div className="feature-card"><div className="icon">🤝</div><h3>Easy Exchange</h3><p className="muted">Connect directly with other students.</p></div>
            <div className="feature-card"><div className="icon">🌱</div><h3>Reduce Waste</h3><p className="muted">Give unused books a second life.</p></div>
            <div className="feature-card"><div className="icon">⚡</div><h3>Find Books Faster</h3><p className="muted">Search and filter listings from one centralized platform.</p></div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2>Browse by Category</h2>
          <div className="cat-grid">
            {(cats || []).map((c) => (
              <Link key={c._id} to={`/browse?category=${encodeURIComponent(c.category_name)}`} className="cat-card">
                <div className="icon">{c.icon || '📚'}</div>
                <h4 style={{ margin: '8px 0 4px' }}>{c.category_name}</h4>
                <span className="muted small">{c.bookCount} books</span>
              </Link>
            ))}
          </div>
          <div className="center" style={{ marginTop: 18 }}><Link to="/categories" className="btn btn-outline">View All Categories</Link></div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2>Featured Books</h2>
          <div className="book-grid">
            {(featured || []).map((b) => <BookCard key={b._id} book={b} />)}
          </div>
          {featured.length === 0 && <div className="empty"><h3>No books yet</h3><p className="muted">Be the first to list a book.</p></div>}
          <div className="center" style={{ marginTop: 20 }}><Link to="/browse" className="btn btn-primary">View All Books</Link></div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="eco">
            <h2>One Book Can Have More Than One Reader.</h2>
            <p>Reusing books reduces waste. Students save money. Unused books help other students. Peer-to-peer exchange encourages sustainable consumption.</p>
            <Link to="/about" className="btn btn-accent">Learn More</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="center">How It Works</h2>
          <div className="steps">
            <div className="step"><div className="num">1</div><h4>Find a Book</h4><p className="muted small">Search by title, author, category or keyword.</p></div>
            <div className="step"><div className="num">2</div><h4>View Details</h4><p className="muted small">Check price, condition and seller.</p></div>
            <div className="step"><div className="num">3</div><h4>Send Request</h4><p className="muted small">Send a request to the owner.</p></div>
            <div className="step"><div className="num">4</div><h4>Complete Exchange</h4><p className="muted small">Once accepted, complete the exchange.</p></div>
          </div>
          <div className="center" style={{ marginTop: 18 }}><Link to="/how-it-works" className="btn btn-outline">See Full Guide</Link></div>
        </div>
      </section>
    </>
  );
}
