import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../App.jsx';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      api.getApplications(),
      api.getRiders(),
      api.getRiderRepayments('summary'),
    ]).then(([applications, riders]) => {
      const total = applications.length;
      const pending = applications.filter(a => a.status === 'pending').length;
      const approved = applications.filter(a => a.status === 'approved').length;
      const rejected = applications.filter(a => a.status === 'rejected').length;
      const active = riders.filter(r => r.status === 'active').length;
      setStats({ total, pending, approved, rejected, totalRiders: riders.length, active });
    }).catch(console.error);
  }, []);

  const cards = [
    { label: 'Pending Applications', value: stats?.pending ?? '—', color: 'var(--gold)', link: '/applications' },
    { label: 'Approved', value: stats?.approved ?? '—', color: 'var(--green)', link: '/riders' },
    { label: 'Active Riders', value: stats?.active ?? '—', color: 'var(--navy)', link: '/riders' },
    { label: 'Total Applications', value: stats?.total ?? '—', color: '#666', link: '/applications' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-desc">Overview of your MotoLift program</p>
      </div>
      <div className="stat-grid">
        {cards.map((c, i) => (
          <Link to={c.link} key={i} className="stat-card" style={{ borderLeft:`4px solid ${c.color}` }}>
            <p className="stat-number">{c.value}</p>
            <p className="stat-label">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="chart-section" style={{ marginTop:32 }}>
        <div className="section-header">
          <h2>Monthly Collections</h2>
          <select className="filter-select"><option>Last 6 months</option><option>Last 12 months</option></select>
        </div>
        <div className="chart-placeholder">
          <div className="bar-chart">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="bar-group">
                <div className="bar" style={{ height: `${60 + Math.random() * 80}px` }} />
                <span className="bar-label">{['Jul','Aug','Sep','Oct','Nov','Dec'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-section" style={{ marginTop:24 }}>
        <div className="section-header">
          <h2>Applicant Demographics</h2>
        </div>
        <div className="chart-placeholder">
          <div className="pie-placeholder">
            <div className="pie-segment" style={{ transform:'rotate(0deg)', background:'var(--navy)', clipPath:'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)' }} />
            <div className="pie-segment" style={{ transform:'rotate(180deg)', background:'var(--gold)', clipPath:'polygon(50% 50%, 50% 0%, 80% 0%, 80% 50%)' }} />
            <div className="pie-segment" style={{ transform:'rotate(252deg)', background:'var(--green)', clipPath:'polygon(50% 50%, 50% 0%, 70% 0%, 70% 50%)' }} />
          </div>
          <div className="pie-legend">
            <div><span style={{ background:'var(--navy)' }} />Refugee</div>
            <div><span style={{ background:'var(--gold)' }} />Youth</div>
            <div><span style={{ background:'var(--green)' }} />YVC</div>
          </div>
        </div>
      </div>
    </div>
  );
}
