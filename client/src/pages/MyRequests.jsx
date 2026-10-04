import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { statusColor } from '../components/BookCard';

function ReqCard({ r, onAction, mine }) {
  return (
    <div className="req-card">
      <p className="muted small">Request from: <strong style={{ color: 'var(--text)' }}>{r.requester_id?.name}</strong> • Book: <strong style={{ color: 'var(--text)' }}>{r.book_id?.title}</strong></p>
      <p>Message: {r.message || '—'}</p>
      {r.offer && <p className="muted small">Offer: {r.offer}</p>}
      <p>Status: <span className={`badge ${statusColor(r.status)}`}>{r.status}</span> <span className="muted small">{new Date(r.created_at).toLocaleString()}</span></p>
      <div className="req-actions">
        {r.status === 'Pending' && !mine && (
          <>
            <button className="btn btn-primary" onClick={() => onAction(r._id, 'Accepted')}>Accept</button>
            <button className="btn btn-ghost" onClick={() => onAction(r._id, 'Rejected')}>Reject</button>
          </>
        )}
        {r.status === 'Accepted' && (
          <>
            <button className="btn btn-primary" onClick={() => onAction(r._id, 'Completed')}>Mark Completed</button>
            <button className="btn btn-ghost" onClick={() => onAction(r._id, 'Cancelled')}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function MyRequests() {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const { notify } = useAuth();

  const load = async () => {
    const [s, r] = await Promise.all([
      api.get('/requests', { params: { type: 'sent' } }),
      api.get('/requests', { params: { type: 'received' } })
    ]);
    setSent(s.data.requests || []); setReceived(r.data.requests || []);
  };
  useEffect(() => { load(); }, []);

  const action = async (id, status) => {
    try {
      const r = await api.put(`/requests/${id}`, { status });
      notify(r.data.message);
      load();
    } catch (e) { notify(e.response?.data?.message || 'Action failed', 'error'); }
  };

  return (
    <div className="container section">
      <h1>My Requests</h1>
      <h2>Received Requests ({received.length})</h2>
      {received.length === 0 ? <div className="empty"><h3>No exchange requests yet.</h3></div> :
        received.map((r) => <ReqCard key={r._id} r={r} onAction={action} mine={false} />)}
      <h2 style={{ marginTop: 30 }}>Sent Requests ({sent.length})</h2>
      {sent.length === 0 ? <div className="empty"><h3>You haven't sent any requests.</h3></div> :
        sent.map((r) => <ReqCard key={r._id} r={r} onAction={action} mine />)}
    </div>
  );
}
