import { useState } from 'react';
import { useAuth, api } from '../App.jsx';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await api.login(email, pass);
      login(res.user, res.token);
    } catch (err) {
      setErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          <div>
            <h1>MotoLift</h1>
            <p className="login-sub">Admin Portal</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {err && <div className="form-error">{err}</div>}
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="admin@motolift.co.ke" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter password" value={pass} onChange={e => setPass(e.target.value)} required />
          </div>
          <button type="submit" className="btn" disabled={loading} style={{ width:'100%' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
