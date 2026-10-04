import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, setUser, notify } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });

  const save = async (e) => {
    e.preventDefault();
    try {
      const r = await api.put('/users/me', form);
      setUser(r.data.user);
      notify('Profile updated');
    } catch { notify('Update failed', 'error'); }
  };

  const changePw = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/change-password', pw);
      setPw({ currentPassword: '', newPassword: '' });
      notify('Password changed');
    } catch (ex) { notify(ex.response?.data?.message || 'Failed', 'error'); }
  };

  return (
    <div className="container section">
      <h1>User Profile</h1>
      <div className="profile-grid">
        <form className="form-wrap" style={{ margin: 0 }} onSubmit={save}>
          <h3>Edit Profile</h3>
          <p className="muted small">User ID: {user?._id} (protected)</p>
          <label>Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label>Email (cannot change here)</label>
          <input value={user?.email || ''} disabled />
          <label>Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <p className="muted small">Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</p>
          <button className="btn btn-primary" type="submit">Save Changes</button>
        </form>
        <form className="form-wrap" style={{ margin: 0 }} onSubmit={changePw}>
          <h3>Change Password</h3>
          <label>Current Password</label>
          <input type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
          <label>New Password</label>
          <input type="password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
          <button className="btn btn-outline" type="submit" style={{ marginTop: 12 }}>Change Password</button>
        </form>
      </div>
    </div>
  );
}
