import { NavLink } from 'react-router-dom';

const links = [
  {
    to: '/', label: 'Home',
    svg: <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
  },
  {
    to: '/payments', label: 'Pay',
    svg: <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
  },
  {
    to: '/bike', label: 'Bike',
    svg: <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="3"/><path d="M4 17h2l2-8h3l3 5h4a3 3 0 013 3v0"/><path d="M10 9l-2 4"/><path d="M17 9l-2 4"/><line x1="12" y1="5" x2="14" y2="9"/></svg>
  },
  {
    to: '/support', label: 'Support',
    svg: <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
  },
  {
    to: '/profile', label: 'Profile',
    svg: <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {links.map(l => (
        <NavLink key={l.to} to={l.to} end={l.to === '/'}>
          {l.svg}
          <span>{l.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
