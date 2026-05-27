import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, api } from '../App.jsx';

export default function Login() {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await api.riderLogin(phone, pass);
      login(res.user, res.token);
    } catch (err) {
      setErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <div>
          <h1 style={{ fontFamily:'var(--font-heading)', color:'#fff', fontSize:'1.4rem', lineHeight:1.2 }}>MotoLift</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.78rem' }}>Rider Portal</p>
        </div>
      </div>
      <p className="auth-sub">Sign in with your phone number</p>
      <form onSubmit={handleSubmit}>
        {err && <div className="auth-err">{err}</div>}
        <input type="tel" placeholder="Phone number (e.g. 2547XXXXXXXX)" value={phone} onChange={e => setPhone(e.target.value)} />
        <input type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} />
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        <Link to="/activate" className="auth-link">First time? Activate your account</Link>
      </form>
    </div>
  );
}
