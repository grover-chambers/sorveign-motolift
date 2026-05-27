import { useState, useEffect } from 'react';
import { api } from '../App.jsx';

export default function Payments() {
  const [riders, setRiders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [repayments, setRepayments] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.getRiders().then(setRiders).catch(console.error);
  }, []);

  const loadRepayments = async (riderId) => {
    setSelected(riderId);
    try {
      const data = await api.getRiderRepayments(riderId);
      setRepayments(data);
    } catch {
      setRepayments([]);
    }
  };

  const filtered = filter === 'all' ? repayments : repayments.filter(r => r.status === filter);

  return (
    <div>
      <div className="page-header">
        <h1>Payments</h1>
        <p className="page-desc">Track rider repayments</p>
      </div>

      <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
        <div className="detail-card" style={{ flex:'0 0 280px' }}>
          <h3>Riders</h3>
          <div className="rider-list">
            {riders.map(r => (
              <div
                key={r.id}
                className={`rider-list-item ${selected === r.id ? 'active' : ''}`}
                onClick={() => loadRepayments(r.id)}
              >
                <span>{r.full_name}</span>
                <span className="pill" style={{ fontSize:'0.7rem' }}>{r.status}</span>
              </div>
            ))}
            {riders.length === 0 && <p style={{ color:'#999', textAlign:'center', padding:16 }}>No riders</p>}
          </div>
        </div>

        <div className="detail-card" style={{ flex:1 }}>
          <h3>Repayment History</h3>
          {!selected ? (
            <p style={{ color:'#999', padding:20 }}>Select a rider to view payments</p>
          ) : (
            <>
              <div className="filter-tabs" style={{ marginBottom:16 }}>
                {['all', 'paid', 'pending', 'missed'].map(f => (
                  <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
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
                  {filtered.map(r => (
                    <tr key={r.id}>
                      <td>{r.day_number}</td>
                      <td>KES {r.amount?.toLocaleString()}</td>
                      <td><span className={`pill ${r.status}`}>{r.status}</span></td>
                      <td>{new Date(r.due_date).toLocaleDateString()}</td>
                      <td>{r.paid_date ? new Date(r.paid_date).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan="5" style={{ textAlign:'center', padding:40, color:'#999' }}>No payments found</td></tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
