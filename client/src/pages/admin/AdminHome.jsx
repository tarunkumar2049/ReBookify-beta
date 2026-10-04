import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminHome() {
  const [charts, setCharts] = useState(null);
  useEffect(() => {
    api.get('/admin/stats').then((r) => setCharts(r.data.charts)).catch(() => {});
  }, []);
  const bar = (items) => {
    if (!items || !items.length) return <p className="muted">No data in last 30 days.</p>;
    const max = Math.max(...items.map((i) => i.count));
    return (
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 120 }}>
        {items.slice(-14).map((d) => (
          <div key={d._id} title={`${d._id}: ${d.count}`} style={{ width: 26, height: `${(d.count / max) * 100 + 4}px`, background: 'var(--primary)', borderRadius: 6 }} />
        ))}
      </div>
    );
  };
  return (
    <div>
      <h2>Overview</h2>
      <div className="profile-grid" style={{ gap: 16 }}>
        <div className="req-card"><h4>New users (last 30 days)</h4>{bar(charts?.newUsers)}</div>
        <div className="req-card"><h4>New listings (last 30 days)</h4>{bar(charts?.newListings)}</div>
      </div>
      <div className="req-card"><h4>Transactions by status</h4>
        {(charts?.txns || []).map((t) => <p key={t._id}>{t._id}: <strong>{t.count}</strong></p>)}
      </div>
    </div>
  );
}
