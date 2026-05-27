import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../App.jsx';

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [tier, setTier] = useState('Standard');
  const [bikeId, setBikeId] = useState('');
  const [bikes, setBikes] = useState([]);
  const [action, setAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.getApplication(id).then(setApp).catch(console.error);
    api.getBikes().then(setBikes).catch(console.error);
  }, [id]);

  const handleApprove = async () => {
    setLoading(true);
    setAction('approve');
    try {
      const res = await api.approveApplication(id, { tier, bike_id: bikeId || undefined });
      setResult(res);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setAction('reject');
    setLoading(true);
    try {
      await api.rejectApplication(id);
      setResult({ message: 'Application rejected' });
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!app) return <div style={{ padding:40, textAlign:'center', color:'#999' }}>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button className="btn-outline" onClick={() => navigate('/applications')} style={{ padding:'6px 12px', fontSize:'0.85rem' }}>← Back</button>
          <h1>{app.full_name}</h1>
          <span className={`pill ${app.status}`} style={{ fontSize:'0.75rem' }}>{app.status}</span>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Personal Information</h3>
          <div className="detail-row"><span>Full Name</span><span>{app.full_name}</span></div>
          <div className="detail-row"><span>Phone</span><span>{app.phone}</span></div>
          <div className="detail-row"><span>Email</span><span>{app.email || '—'}</span></div>
          <div className="detail-row"><span>ID Number</span><span>{app.id_number}</span></div>
          <div className="detail-row"><span>ID Type</span><span>{app.id_type}</span></div>
          <div className="detail-row"><span>Applicant Type</span><span className="pill">{app.applicant_type}</span></div>
          {app.applicant_type === 'Refugee' && (
            <div className="detail-row"><span>UNHCR Registration</span><span>{app.unhcr_number || '—'}</span></div>
          )}
          {app.applicant_type === 'Youth' && (
            <div className="detail-row"><span>Youth Affiliation</span><span>{app.youth_affiliation || '—'}</span></div>
          )}
          {app.applicant_type === 'YVC' && (
            <div className="detail-row"><span>YVC Member</span><span>{app.is_yvc_member ? 'Yes' : 'No'}</span></div>
          )}
        </div>

        <div className="detail-card">
          <h3>Application Details</h3>
          <div className="detail-row"><span>Motorcycle Type</span><span>{app.motorcycle_type}</span></div>
          <div className="detail-row"><span>License Status</span><span>{app.license_status}</span></div>
          <div className="detail-row"><span>Driving Experience</span><span>{app.driving_experience || '—'}</span></div>
          <div className="detail-row"><span>Location</span><span>{app.location || '—'}</span></div>
          {app.referral_code && <div className="detail-row"><span>Referral Code</span><span>{app.referral_code}</span></div>}
          <div className="detail-row"><span>Submitted</span><span>{new Date(app.created_at).toLocaleDateString()}</span></div>
        </div>

        {app.status === 'pending' && !result && (
          <div className="detail-card" style={{ gridColumn:'1 / -1' }}>
            <h3>Decision</h3>
            <div className="approve-form">
              <div className="form-group">
                <label>Financing Tier</label>
                <select value={tier} onChange={e => setTier(e.target.value)}>
                  <option value="Starter">Starter (75%)</option>
                  <option value="Standard">Standard (79.5%)</option>
                  <option value="Plus">Plus (84%)</option>
                  <option value="Pro">Pro (88.5%)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Bike Assignment (optional)</label>
                <select value={bikeId} onChange={e => setBikeId(e.target.value)}>
                  <option value="">Auto-assign</option>
                  {bikes.map(b => <option key={b.id} value={b.id}>{b.name} — KES {b.daily_rate}/day</option>)}
                </select>
              </div>
              <div className="action-btns" style={{ display:'flex', gap:12 }}>
                <button className="btn" style={{ background:'var(--green)', color:'#fff' }} onClick={handleApprove} disabled={loading}>
                  {loading && action === 'approve' ? 'Processing...' : '✓ Approve & Create Account'}
                </button>
                <button className="btn btn-outline" style={{ borderColor:'#e74c3c', color:'#e74c3c' }} onClick={handleReject} disabled={loading}>
                  {loading && action === 'reject' ? 'Rejecting...' : '✗ Reject'}
                </button>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className={`detail-card result-card ${result.error ? 'error' : 'success'}`} style={{ gridColumn:'1 / -1' }}>
            {result.error ? (
              <>
                <h3 style={{ color:'#e74c3c' }}>Error</h3>
                <p>{result.error}</p>
              </>
            ) : (
              <>
                <h3 style={{ color:'var(--green)' }}>✓ Approved</h3>
                {result.phone && <p><strong>Phone:</strong> {result.phone}</p>}
                {result.temp_password && (
                  <p style={{ marginTop:8 }}>
                    <strong>Temporary Password:</strong> <code style={{ background:'var(--cream)', padding:'4px 8px', borderRadius:4, fontSize:'1rem' }}>{result.temp_password}</code>
                  </p>
                )}
                <p style={{ marginTop:12, fontSize:'0.85rem', color:'#888' }}>Share this password with the rider — they'll use it to activate their account in the rider app.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
