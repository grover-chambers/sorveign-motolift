import { useState, useEffect } from 'react';
import { api } from '../App.jsx';

export default function Reports() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      api.getApplications(),
      api.getRiders(),
    ]).then(([apps, riders]) => {
      const totalApps = apps.length;
      const pending = apps.filter(a => a.status === 'pending').length;
      const approved = apps.filter(a => a.status === 'approved').length;
      const rejected = apps.filter(a => a.status === 'rejected').length;
      const active = riders.filter(r => r.status === 'active').length;
      const suspended = riders.filter(r => r.status === 'suspended').length;
      const graduated = riders.filter(r => r.status === 'graduated').length;
      const refugee = apps.filter(a => a.applicant_type === 'Refugee').length;
      const youth = apps.filter(a => a.applicant_type === 'Youth').length;
      const yvc = apps.filter(a => a.applicant_type === 'YVC').length;
      setStats({
        totalApps, pending, approved, rejected,
        totalRiders: riders.length, active, suspended, graduated,
        refugee, youth, yvc,
        approvalRate: totalApps > 0 ? Math.round((approved / totalApps) * 100) : 0,
      });
    }).catch(console.error);
  }, []);

  if (!stats) return <div style={{ padding:40, textAlign:'center', color:'#999' }}>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Reports</h1>
        <p className="page-desc">Program overview and metrics</p>
      </div>

      <div className="report-grid">
        <div className="detail-card">
          <h3>Applications</h3>
          <div className="stat-chart">
            <div className="bar-row">
              <span>Pending</span>
              <div className="bar-track"><div className="bar-fill pending" style={{ width:`${(stats.pending / stats.totalApps) * 100}%` }} /></div>
              <span>{stats.pending}</span>
            </div>
            <div className="bar-row">
              <span>Approved</span>
              <div className="bar-track"><div className="bar-fill approved" style={{ width:`${(stats.approved / stats.totalApps) * 100}%` }} /></div>
              <span>{stats.approved}</span>
            </div>
            <div className="bar-row">
              <span>Rejected</span>
              <div className="bar-track"><div className="bar-fill rejected" style={{ width:`${(stats.rejected / stats.totalApps) * 100}%` }} /></div>
              <span>{stats.rejected}</span>
            </div>
          </div>
          <div className="report-total">
            <span>Approval Rate</span>
            <span className="big-num">{stats.approvalRate}%</span>
          </div>
        </div>

        <div className="detail-card">
          <h3>Riders</h3>
          <div className="stat-chart">
            <div className="bar-row">
              <span>Active</span>
              <div className="bar-track"><div className="bar-fill approved" style={{ width:`${(stats.active / stats.totalRiders) * 100}%` }} /></div>
              <span>{stats.active}</span>
            </div>
            <div className="bar-row">
              <span>Suspended</span>
              <div className="bar-track"><div className="bar-fill pending" style={{ width:`${(stats.suspended / stats.totalRiders) * 100}%` }} /></div>
              <span>{stats.suspended}</span>
            </div>
            <div className="bar-row">
              <span>Graduated</span>
              <div className="bar-track"><div className="bar-fill approved" style={{ width:`${(stats.graduated / stats.totalRiders) * 100}%` }} /></div>
              <span>{stats.graduated}</span>
            </div>
          </div>
          <div className="report-total">
            <span>Total Riders</span>
            <span className="big-num">{stats.totalRiders}</span>
          </div>
        </div>

        <div className="detail-card">
          <h3>Demographics</h3>
          <div className="stat-chart">
            <div className="bar-row">
              <span>Refugee</span>
              <div className="bar-track"><div className="bar-fill navy" style={{ width:`${(stats.refugee / stats.totalApps) * 100}%` }} /></div>
              <span>{stats.refugee}</span>
            </div>
            <div className="bar-row">
              <span>Youth</span>
              <div className="bar-track"><div className="bar-fill pending" style={{ width:`${(stats.youth / stats.totalApps) * 100}%` }} /></div>
              <span>{stats.youth}</span>
            </div>
            <div className="bar-row">
              <span>YVC</span>
              <div className="bar-track"><div className="bar-fill approved" style={{ width:`${(stats.yvc / stats.totalApps) * 100}%` }} /></div>
              <span>{stats.yvc}</span>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <h3>Financial Summary</h3>
          <div className="report-total">
            <span>Total Financed</span>
            <span className="big-num">KES —</span>
          </div>
          <div className="report-total">
            <span>Total Collected</span>
            <span className="big-num">KES —</span>
          </div>
          <div className="report-total">
            <span>Outstanding</span>
            <span className="big-num">KES —</span>
          </div>
          <p style={{ marginTop:12, fontSize:'0.8rem', color:'#999' }}>Financial data will populate as riders begin making payments.</p>
        </div>
      </div>
    </div>
  );
}
