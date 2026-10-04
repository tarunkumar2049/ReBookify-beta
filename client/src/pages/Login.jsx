import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!email || !password) { setErr('Email and password are required'); return; }
    try {
      const u = await login(email, password);
      nav(u.role === 'admin' ? '/admin' : '/dashboard');
    } catch (ex) { setErr(ex.response?.data?.message || 'Login failed'); }
  };

  return (
    <div className="container">
      <form className="form-wrap" onSubmit={submit}>
        <h2>Welcome back 👋</h2>
        <p className="muted">Login to your ReBookify account</p>
        {err && <div className="error">{err}</div>}
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        <button className="btn btn-primary btn-block" type="submit">Login</button>
        <p className="center muted">No account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Create Account</Link></p>
        <p className="muted small center">Demo: demo@student.com / demo1234 • Admin: admin@rebookify.com / admin123</p>
      </form>
    </div>
  );
}
