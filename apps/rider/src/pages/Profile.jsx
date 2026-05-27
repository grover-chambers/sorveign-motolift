import { useState, useEffect } from 'react';
import { api, useAuth } from '../App.jsx';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [rider, setRider] = useState(null);

  useEffect(() => {
    api.getMyProfile().then(setRider).catch(console.error);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!rider) return <div className="page" style={{ padding: 40, textAlign:'center', color:'#888' }}>Loading...</div>;

  return (
    <div className="page">
      <div className="app-header">
        <h1>Profile</h1>
        <p className="app-header-sub">Your account details</p>
      </div>

      <div className="card" style={{ textAlign:'center', padding:32 }}>
        <div className="avatar">{rider.full_name?.split(' ').map(n => n[0]).join('')}</div>
        <h2 style={{ marginTop:12 }}>{rider.full_name}</h2>
        <p style={{ color:'#888', fontSize:'0.85rem' }}>{rider.phone}</p>
      </div>

      <div className="card-group" style={{ marginTop:0 }}>
        <div className="section-title" style={{ marginTop:16 }}>Account</div>
        <div className="profile-row"><span>Status</span><span className={`pill ${rider.status}`}>{rider.status}</span></div>
        <div className="profile-row"><span>Phase</span><span>Phase {rider.phase}</span></div>
        <div className="profile-row"><span>Plan Tier</span><span>{rider.tier || 'Standard'}</span></div>
        <div className="profile-row"><span>Days Remaining</span><span>{rider.total_days - rider.days_paid}</span></div>

        <div className="section-title" style={{ marginTop:16 }}>Financing</div>
        <div className="profile-row"><span>Daily Rate</span><span>KES {rider.daily_rate}</span></div>
        <div className="profile-row"><span>Total Financed</span><span>KES {(rider.total_financed || 0).toLocaleString()}</span></div>
        <div className="profile-row"><span>Balance</span><span style={{ color:'var(--green)', fontWeight:600 }}>KES {(rider.balance || 0).toLocaleString()}</span></div>

        <div className="section-title" style={{ marginTop:16 }}>ID</div>
        <div className="profile-row"><span>ID Number</span><span>{rider.id_number || '—'}</span></div>
        <div className="profile-row"><span>ID Type</span><span>{rider.id_type || '—'}</span></div>
      </div>

      <button className="btn-outline" onClick={handleLogout} style={{ marginTop:24 }}>
        Sign Out
      </button>
    </div>
  );
}
