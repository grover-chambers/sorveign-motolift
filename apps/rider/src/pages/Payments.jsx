import { useState, useEffect } from 'react';
import { api } from '../App.jsx';

export default function Payments() {
  const [repayments, setRepayments] = useState([]);

  useEffect(() => {
    api.getMyRepayments().then(setRepayments).catch(console.error);
  }, []);

  const paid = repayments.filter(r => r.status === 'paid').length;
  const missed = repayments.filter(r => r.status === 'missed').length;
  const pending = repayments.filter(r => r.status === 'pending').length;

  return (
    <div className="page">
      <div className="app-header">
        <h1>Payments</h1>
        <p className="app-header-sub">Repayment history</p>
      </div>

      <div className="card-row" style={{ marginBottom: 16 }}>
        <div className="stat-card" style={{ background:'var(--green)', color:'#fff' }}>
          <p className="stat-label">Paid</p>
          <p className="stat-value">{paid}</p>
        </div>
        <div className="stat-card" style={{ background:'var(--gold)', color:'var(--navy)' }}>
          <p className="stat-label">Missed</p>
          <p className="stat-value">{missed}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Pending</p>
          <p className="stat-value">{pending}</p>
        </div>
      </div>

      <div className="card-group" style={{ marginTop:0 }}>
        <div className="section-title">All Payments</div>
        {repayments.length === 0 ? (
          <div className="card" style={{ textAlign:'center', color:'#999' }}>No payments recorded yet</div>
        ) : (
          repayments.map((r, i) => (
            <div className="repayment-item" key={r.id || i}>
              <div>
                <p className="repay-day">Day {r.day_number}</p>
                <p className="repay-date">{new Date(r.due_date).toLocaleDateString()}</p>
              </div>
              <div style={{ textAlign:'right' }}>
                <p className={`repay-status ${r.status}`}>{r.status === 'paid' ? '✓' : r.status === 'missed' ? '✗' : '○'}</p>
                <p className="repay-amount">KES {r.amount?.toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
