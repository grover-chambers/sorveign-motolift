import { useState, useEffect } from 'react';
import { api } from '../App.jsx';

export default function Bike() {
  const [bike, setBike] = useState(null);

  useEffect(() => {
    api.getBikes().then(list => {
      if (list.length) setBike(list[0]);
    }).catch(console.error);
  }, []);

  return (
    <div className="page">
      <div className="app-header">
        <h1>My Motorcycle</h1>
        <p className="app-header-sub">Assigned bike details</p>
      </div>

      {bike ? (
        <>
          <div className="card" style={{ textAlign:'center', padding:32 }}>
            <div className="bike-icon-large">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/>
                <line x1="9" x2="15" y1="17" y2="17"/>
                <polyline points="5 8 9 4 15 4 19 8"/><line x1="5" y1="8" x2="19" y2="8"/>
                <line x1="9" y1="4" x2="12" y2="8"/><line x1="15" y1="4" x2="12" y2="8"/>
                <line x1="12" y1="8" x2="12" y2="14"/><line x1="8" y1="14" x2="16" y2="14"/>
              </svg>
            </div>
            <h2 style={{ marginTop:12 }}>{bike.name}</h2>
            <p style={{ color:'#888', marginTop:4 }}>{bike.type === 'electric' ? '⚡ Electric' : '⛽ Petrol'}</p>
          </div>

          <div className="card-group" style={{ marginTop:0 }}>
            <div className="bike-spec">
              <span>Range</span><span>{bike.range_km} km</span>
            </div>
            <div className="bike-spec">
              <span>Top Speed</span><span>{bike.top_speed} km/h</span>
            </div>
            {bike.battery_capacity && <div className="bike-spec">
              <span>Battery</span><span>{bike.battery_capacity} kWh</span>
            </div>}
            {bike.engine_cc && <div className="bike-spec">
              <span>Engine</span><span>{bike.engine_cc} cc</span>
            </div>}
            <div className="bike-spec">
              <span>Daily Rate</span><span>KES {bike.daily_rate?.toLocaleString()}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="card" style={{ textAlign:'center', color:'#999' }}>Loading bike details...</div>
      )}
    </div>
  );
}
