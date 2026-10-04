import { Link } from 'react-router-dom';
export default function HowItWorks() {
  return (
    <div className="container section">
      <h1 className="center">How It Works</h1>
      <p className="center muted">Find a Book → Connect with the Owner → Exchange → Reuse</p>
      <h2>Want to buy / exchange a book?</h2>
      <div className="steps">
        <div className="step"><div className="num">1</div><h4>Find a Book</h4><p className="muted small">Search by title, author, category or keyword.</p></div>
        <div className="step"><div className="num">2</div><h4>View Details</h4><p className="muted small">Check price, condition and seller.</p></div>
        <div className="step"><div className="num">3</div><h4>Send Request</h4><p className="muted small">Send a request to the owner.</p></div>
        <div className="step"><div className="num">4</div><h4>Complete Exchange</h4><p className="muted small">Once accepted, complete the exchange.</p></div>
      </div>
      <h2 style={{ marginTop: 36 }}>Want to sell a book?</h2>
      <div className="steps cols-5">
        {['Create account', 'Add book', 'Receive request', 'Accept request', 'Complete transaction'].map((t, i) => (
          <div className="step" key={t}><div className="num">{i + 1}</div><h4>{t}</h4></div>
        ))}
      </div>
      <div className="center" style={{ marginTop: 26 }}>
        <Link to="/browse" className="btn btn-primary">Start Browsing</Link>{' '}
        <Link to="/register" className="btn btn-accent">Create Account</Link>
      </div>
    </div>
  );
}
