import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../App.jsx';

export default function RiderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rider, setRider] = useState(null);
  const [repayments, setRepayments] = useState([]);
  const [edit, setEdit] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getRider(id).then(setRider).catch(console.error);
    api.getRiderRepayments(id).then(setRepayments).catch(() => {});
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateRider(id, edit);
      setRider({ ...rider, ...edit });
      setEdit(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!rider) return <div style={{ padding:40, textAlign:'center', color:'#999' }}>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button className="btn-outline" onClick={() => navigate('/riders')} style={{ padding:'6px 12px', fontSize:'0.85rem' }}>← Back</button>
          <h1>{rider.full_name}</h1>
          <span className={`pill ${rider.status}`} style={{ fontSize:'0.75rem' }}>{rider.status}</span>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom:24 }}>
        <div className="stat-card"><p className="stat-number">Phase {rider.phase}</p><p className="stat-label">Current Phase</p></div>
        <div className="stat-card"><p className="stat-number">{rider.daily_rate}</p><p className="stat-label">Daily Rate (KES)</p></div>
        <div className="stat-card"><p className="stat-number">{rider.days_paid}/{rider.total_days}</p><p className="stat-label">Days Paid</p></div>
        <div className="stat-card"><p className="stat-number">KES {(rider.balance || 0).toLocaleString()}</p><p className="stat-label">Balance</p></div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h3>Account Details</h3>
          <div className="detail-row"><span>Phone</span><span>{rider.phone}</span></div>
          <div className="detail-row"><span>Tier</span><span>{rider.tier || 'Standard'}</span></div>
          <div className="detail-row"><span>Total Financed</span><span>KES {(rider.total_financed || 0).toLocaleString()}</span></div>
          <div className="detail-row"><span>Bike</span><span>{rider.bike_id || 'Not assigned'}</span></div>
        </div>

        <div className="detail-card">
          <h3>Edit Details</h3>
          {edit === null ? (
            <button className="btn btn-outline" onClick={() => setEdit({
              daily_rate: rider.daily_rate,
              phase: rider.phase,
              status: rider.status,
              tier: rider.tier || 'Standard',
              balance: rider.balance,
            })}>Edit Rider</button>
          ) : (
            <div className="edit-form">
              <div className="form-group">
                <label>Daily Rate (KES)</label>
                <input type="number" value={edit.daily_rate} onChange={e => setEdit({ ...edit, daily_rate: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Phase</label>
                <select value={edit.phase} onChange={e => setEdit({ ...edit, phase: Number(e.target.value) })}>
                  <option value={1}>Phase 1</option>
                  <option value={2}>Phase 2</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={edit.status} onChange={e => setEdit({ ...edit, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="graduated">Graduated</option>
                </select>
              </div>
              <div className="form-group">
                <label>Tier</label>
                <select value={edit.tier} onChange={e => setEdit({ ...edit, tier: e.target.value })}>
                  <option value="Starter">Starter (75%)</option>
                  <option value="Standard">Standard (79.5%)</option>
                  <option value="Plus">Plus (84%)</option>
                  <option value="Pro">Pro (88.5%)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Balance (KES)</label>
                <input type="number" value={edit.balance} onChange={e => setEdit({ ...edit, balance: Number(e.target.value) })} />
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button className="btn" style={{ background:'var(--green)', color:'#fff' }} onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button className="btn btn-outline" onClick={() => setEdit(null)}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <div className="detail-card" style={{ gridColumn:'1 / -1' }}>
          <h3>Recent Payments</h3>
          {repayments.length === 0 ? (
            <p style={{ color:'#999' }}>No payments recorded yet</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Paid Date</th>
                </tr>
              </thead>
              <tbody>
                {repayments.slice(0, 20).map(r => (
                  <tr key={r.id}>
                    <td>{r.day_number}</td>
                    <td>KES {r.amount?.toLocaleString()}</td>
                    <td><span className={`pill ${r.status}`}>{r.status}</span></td>
                    <td>{new Date(r.due_date).toLocaleDateString()}</td>
                    <td>{r.paid_date ? new Date(r.paid_date).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
