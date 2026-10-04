import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [err, setErr] = useState('');
  const { register } = useAuth();
  const nav = useNavigate();
  const set = (k, v) => setForm({ ...form, [k]: v });

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!form.name || !form.email || !form.phone || !form.password) { setErr('All fields are required'); return; }
    if (form.password.length < 6) { setErr('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { setErr('Passwords do not match'); return; }
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      nav('/dashboard');
    } catch (ex) { setErr(ex.response?.data?.message || 'Registration failed'); }
  };

  return (
    <div className="container">
      <form className="form-wrap" onSubmit={submit}>
        <h2>Create your account 🎓</h2>
        <p className="muted">Join the student book exchange community</p>
        {err && <div className="error">{err}</div>}
        <label>Full Name</label>
        <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Aarav Sharma" />
        <label>Email</label>
        <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@college.edu" />
        <label>Phone Number</label>
        <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" />
        <label>Password</label>
        <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Min. 6 characters" />
        <label>Confirm Password</label>
        <input type="password" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} placeholder="Repeat password" />
        <button className="btn btn-primary btn-block" type="submit">Create Account</button>
        <p className="center muted">Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Login</Link></p>
      </form>
    </div>
  );
}
