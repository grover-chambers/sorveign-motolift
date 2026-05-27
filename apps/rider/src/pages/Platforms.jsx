import { useState, useEffect } from 'react';
import { api } from '../App.jsx';

const platformLogos = {
  'Uber': 'https://logo.clearbit.com/uber.com',
  'Bolt': 'https://logo.clearbit.com/bolt.eu',
  'Little': 'https://logo.clearbit.com/little.biz',
  'Uber Eats': 'https://logo.clearbit.com/ubereats.com',
};

export default function Platforms() {
  const [rider, setRider] = useState(null);

  useEffect(() => {
    api.getMyProfile().then(setRider).catch(console.error);
  }, []);

  const defaultPlatforms = [
    { name: 'Uber', description: 'Ride-hailing & taxi service', status: 'pending' },
    { name: 'Bolt', description: 'Ride-hailing & delivery', status: 'pending' },
    { name: 'Little', description: 'Ride-hailing & courier', status: 'pending' },
    { name: 'Uber Eats', description: 'Food delivery', status: 'pending' },
  ];

  const platforms = rider?.rider_platforms?.length
    ? rider.rider_platforms
    : defaultPlatforms;

  return (
    <div className="page">
      <div className="app-header">
        <h1>Platform Onboarding</h1>
        <p className="app-header-sub">Register to start earning</p>
      </div>

      <div className="card info-card">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" style={{ flexShrink:0 }}>
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <p style={{ fontSize:'0.82rem', color:'#666', lineHeight:1.5 }}>
          Register on all platforms to maximize your daily earnings and accelerate your path to ownership.
        </p>
      </div>

      <div className="card-group" style={{ marginTop:0 }}>
        {platforms.map((p, i) => (
          <div key={i} className={`platform-card ${p.status}`}>
            <img src={platformLogos[p.name]} alt={p.name} className="platform-logo" onError={e => e.target.style.display='none'} />
            <div className="platform-info">
              <h3>{p.name}</h3>
              <p>{p.description}</p>
            </div>
            <span className={`platform-status ${p.status}`}>
              {p.status === 'registered' ? '✓ Registered' : p.status === 'pending' ? 'Pending' : p.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
