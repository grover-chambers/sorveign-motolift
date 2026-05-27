import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../App.jsx';

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.getApplications().then(setApps).catch(console.error);
  }, []);

  const filtered = filter === 'all' ? apps : apps.filter(a => a.status === filter);

  return (
    <div>
      <div className="page-header">
        <h1>Applications</h1>
        <p className="page-desc">{apps.length} total applications received</p>
      </div>

      <div className="filter-tabs">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="filter-count">{f === 'all' ? apps.length : apps.filter(a => a.status === f).length}</span>
          </button>
        ))}
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Type</th>
            <th>Status</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(a => (
            <tr key={a.id}>
              <td className="cell-name">{a.full_name}</td>
              <td>{a.phone}</td>
              <td><span className="pill">{a.applicant_type || 'General'}</span></td>
              <td><span className={`pill ${a.status}`}>{a.status}</span></td>
              <td className="cell-date">{new Date(a.created_at).toLocaleDateString()}</td>
              <td><Link to={`/applications/${a.id}`} className="cell-link">View →</Link></td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan="6" style={{ textAlign:'center', padding:40, color:'#999' }}>No applications found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
