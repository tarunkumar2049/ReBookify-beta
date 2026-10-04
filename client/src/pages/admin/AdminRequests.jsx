import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminRequests() {
  const [reqs, setReqs] = useState([]);
  const [status, setStatus] = useState('');
  useEffect(() => {
    api.get('/admin/requests', { params: status ? { status } : {} }).then((r) => setReqs(r.data.requests || [])).catch(() => {});
  }, [status]);
  return (
    <div>
      <h2>Request Monitoring</h2>
      <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: 10, borderRadius: 9, marginBottom: 12 }}>
        <option value="">All (Pending / Accepted / Rejected / Completed)</option>
        <option>Pending</option><option>Accepted</option><option>Rejected</option><option>Completed</option><option>Cancelled</option>
      </select>
      <div className="table-wrap"><table className="table">
        <thead><tr><th>Book</th><th>Requester</th><th>Owner</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>{reqs.map((r) => (
          <tr key={r._id}><td>{r.book_id?.title}</td><td>{r.requester_id?.name}</td><td>{r.owner_id?.name}</td><td>{r.status}</td><td>{new Date(r.created_at).toLocaleDateString()}</td></tr>
        ))}</tbody>
      </table></div>
    </div>
  );
}
