import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../App.jsx';

export default function Riders() {
  const [riders, setRiders] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.getRiders().then(setRiders).catch(console.error);
  }, []);

  const filtered = filter === 'all' ? riders : riders.filter(r => r.status === filter);

  return (
    <div>
      <div className="page-header">
        <h1>Riders</h1>
        <p className="page-desc">{riders.length} registered riders</p>
      </div>

      <div className="filter-tabs">
        {['all', 'active', 'suspended', 'graduated'].map(f => (
          <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="filter-count">{f === 'all' ? riders.length : riders.filter(r => r.status === f).length}</span>
          </button>
        ))}
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Phase</th>
            <th>Tier</th>
            <th>Daily Rate</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.id}>
              <td className="cell-name">{r.full_name}</td>
              <td>{r.phone}</td>
              <td>Phase {r.phase}</td>
              <td>{r.tier || 'Standard'}</td>
              <td>KES {r.daily_rate}</td>
              <td><span className={`pill ${r.status}`}>{r.status}</span></td>
              <td><Link to={`/riders/${r.id}`} className="cell-link">View →</Link></td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan="7" style={{ textAlign:'center', padding:40, color:'#999' }}>No riders found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
