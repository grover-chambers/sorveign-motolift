import { useState, useEffect } from 'react';
import { api } from '../App.jsx';

export default function Bikes() {
  const [bikes, setBikes] = useState([]);

  useEffect(() => {
    api.getBikes().then(setBikes).catch(console.error);
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Motorcycles</h1>
        <p className="page-desc">{bikes.length} available models</p>
      </div>

      <div className="filter-tabs">
        {['all', 'electric', 'petrol'].map(f => (
          <button key={f} className={`filter-tab active`} onClick={() => {}}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bikes-grid">
        {bikes.map(b => (
          <div key={b.id} className="bike-card">
            <div className="bike-card-header">
              <h3>{b.name}</h3>
              <span className="pill">{b.type}</span>
            </div>
            <div className="bike-specs">
              {b.range_km && <div className="spec"><span>Range</span><span>{b.range_km} km</span></div>}
              {b.top_speed && <div className="spec"><span>Top Speed</span><span>{b.top_speed} km/h</span></div>}
              {b.battery_capacity && <div className="spec"><span>Battery</span><span>{b.battery_capacity} kWh</span></div>}
              {b.engine_cc && <div className="spec"><span>Engine</span><span>{b.engine_cc} cc</span></div>}
              <div className="spec"><span>Daily Rate</span><span>KES {b.daily_rate?.toLocaleString()}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
