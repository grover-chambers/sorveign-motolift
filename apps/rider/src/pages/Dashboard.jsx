import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, api } from '../App.jsx';

function ProgressRing({ pct }) {
  const r = 28, circ = 2 * Math.PI * r;
  const dash = circ * pct / 100;
  return (
    <div className="progress-ring">
      <svg width="68" height="68" viewBox="0 0 68 68">
        <circle cx="34" cy="34" r={r} fill="none" stroke="#e8e4dc" strokeWidth="5"/>
        <circle cx="34" cy="34" r={r} fill="none" stroke="var(--green)" strokeWidth="5"
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"/>
      </svg>
      <span>{pct}%</span>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [rider, setRider] = useState(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    api.getMyProfile().then(setRider).catch(console.error);
  }, []);

  if (!rider) return <div className="page" style={{ padding: 40, textAlign:'center', color:'#888' }}>Loading...</div>;

  const progress = Math.round((rider.days_paid / rider.total_days) * 100);
  const remaining = rider.total_days - rider.days_paid;
  const platformsCount = rider.rider_platforms ? rider.rider_platforms.filter(p => p.status === 'registered').length : 0;

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => setPaying(false), 2000);
  };

  return (
    <div className="page">
      <div className="app-header">
        <p className="app-header-sub">Welcome back,</p>
        <h1>{rider.full_name?.split(' ')[0] || 'Rider'}</h1>
      </div>

      <div className="card-group">
        <div className="card">
          <div className="progress-wrap">
            <ProgressRing pct={progress} />
            <div className="progress-info">
              <h3>{rider.bike_id || 'Motorcycle'}</h3>
              <p>Phase {rider.phase} · Day {rider.days_paid} of {rider.total_days}</p>
              <p style={{ fontSize:'0.75rem', color:'var(--green)', marginTop:4, fontWeight:600 }}>
                {remaining} days until ownership
              </p>
            </div>
          </div>
        </div>

        <div className="card-row">
          <div className="stat-card">
            <p className="stat-label">Balance</p>
            <p className="stat-value">KES {(rider.balance || 0).toLocaleString()}</p>
            <p className="stat-sub">{rider.daily_rate}/day</p>
          </div>
          <div className="stat-card accent">
            <p className="stat-label">Daily Rate</p>
            <p className="stat-value">KES {rider.daily_rate}</p>
            <p className="stat-sub" style={{ color:'rgba(255,255,255,0.6)' }}>Today's payment</p>
          </div>
        </div>

        <Link to="/platforms" style={{ textDecoration:'none' }}>
          <div className="card" style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontWeight:600, fontSize:'0.85rem', color:'var(--navy)' }}>Platform Onboarding</p>
              <p style={{ fontSize:'0.78rem', color:'#888' }}>{platformsCount} of 4 platforms registered</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </Link>

        <button className="btn-pay" onClick={handlePay} disabled={paying} style={{ marginTop:4 }}>
          <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          {paying ? 'Processing...' : `Pay Today (KES ${rider.daily_rate})`}
        </button>
      </div>
    </div>
  );
}
