import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, api } from '../App.jsx';

export default function Activate() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (pass !== confirm) return setErr('Passwords do not match');
    if (pass.length < 6) return setErr('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await api.activate(phone, pass);
      login(res.user, res.token);
      navigate('/');
    } catch (err) {
      setErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <h1 style={{ fontFamily:'var(--font-heading)', color:'#fff', fontSize:'1.4rem', marginBottom:8 }}>Activate Account</h1>
      <p className="auth-sub">Set your password to get started</p>
      <form onSubmit={handleSubmit}>
        {err && <div className="auth-err">{err}</div>}
        <input type="tel" placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)} />
        <input type="password" placeholder="New password" value={pass} onChange={e => setPass(e.target.value)} />
        <input type="password" placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} />
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Activating...' : 'Activate'}</button>
        <Link to="/login" className="auth-link">Already have an account? Sign in</Link>
      </form>
    </div>
  );
}
