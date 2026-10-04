import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import api from '../../services/api';

export default function AdminLayout() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api.get('/admin/stats').then((r) => setStats(r.data.stats)).catch(() => {});
  }, []);
  return (
    <div className="container section">
      <h1>Admin Dashboard</h1>
      {stats && (
        <div className="stat-grid">
          <div className="stat"><span className="muted">Total Users</span><strong>{stats.totalUsers}</strong></div>
          <div className="stat"><span className="muted">Total Books</span><strong>{stats.totalBooks}</strong></div>
          <div className="stat"><span className="muted">Available Books</span><strong>{stats.availableBooks}</strong></div>
          <div className="stat"><span className="muted">Pending Requests</span><strong>{stats.pendingRequests}</strong></div>
          <div className="stat"><span className="muted">Completed Txns</span><strong>{stats.completedTxns}</strong></div>
          <div className="stat"><span className="muted">Categories</span><strong>{stats.totalCategories}</strong></div>
        </div>
      )}
      <div className="admin-layout">
        <nav className="admin-nav">
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/books">Books</NavLink>
          <NavLink to="/admin/categories">Categories</NavLink>
          <NavLink to="/admin/requests">Requests</NavLink>
          <NavLink to="/admin/transactions">Transactions</NavLink>
        </nav>
        <div><Outlet /></div>
      </div>
    </div>
  );
}
