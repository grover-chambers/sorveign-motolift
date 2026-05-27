import { NavLink } from 'react-router-dom';
import { useAuth } from '../App.jsx';
import { useNavigate } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard',
    svg: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { to: '/applications', label: 'Applications',
    svg: <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  { to: '/riders', label: 'Riders',
    svg: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { to: '/payments', label: 'Payments',
    svg: <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/><path d="M9 16h6"/></svg> },
  { to: '/bikes', label: 'Bikes',
    svg: <svg viewBox="0 0 24 24"><circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="3"/><path d="M4 17h2l2-8h3l3 5h4a3 3 0 013 3v0"/><path d="M10 9l-2 4"/><path d="M17 9l-2 4"/><line x1="12" y1="5" x2="14" y2="9"/></svg> },
  { to: '/reports', label: 'Reports',
    svg: <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
        <div>
          <h1>MotoLift <span className="badge">Admin</span></h1>
        </div>
      </div>
      <nav className="sidebar-nav">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'}>
            {l.svg}
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="admin-info">
          <span>{user?.name || 'Admin'}</span>
          <button className="logout-btn" onClick={() => { logout(); nav('/login'); }}>Sign Out</button>
        </div>
      </div>
    </aside>
  );
}
