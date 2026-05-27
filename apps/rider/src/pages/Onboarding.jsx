const PLATFORMS = [
  { name:'Bolt',  status:'registered', color:'#34e0a1', icon:'⚡' },
  { name:'Glovo', status:'pending',    color:'#f9a825', icon:'🟡' },
  { name:'Uber',  status:'not_started',color:'#e2e8f0', icon:'🚗' },
  { name:'Faras', status:'not_started',color:'#e2e8f0', icon:'🛵' },
];

const label = { registered:'✅ Active', pending:'⏳ Pending', not_started:'→ Start' };

export default function Onboarding() {
  return (
    <div style={{padding:'24px 16px 100px'}}>
      <h2 style={{marginBottom:8}}>Platform Onboarding</h2>
      <p style={{color:'#6b7280',fontSize:14,marginBottom:24}}>
        Register on delivery platforms to start earning
      </p>
      {PLATFORMS.map(p => (
        <div key={p.name} style={{
          background:'#fff', borderRadius:16, padding:'20px',
          marginBottom:12, display:'flex', alignItems:'center', gap:16,
          boxShadow:'0 2px 10px rgba(0,0,0,.05)',
        }}>
          <span style={{fontSize:28}}>{p.icon}</span>
          <div style={{flex:1}}>
            <p style={{fontWeight:700}}>{p.name}</p>
            <p style={{fontSize:13,color:'#6b7280'}}>{label[p.status]}</p>
          </div>
          {p.status !== 'registered' && (
            <button style={{
              background:'var(--green)', border:'none', borderRadius:99,
              padding:'8px 18px', fontWeight:600, cursor:'pointer', fontSize:13,
            }}>Get Help</button>
          )}
        </div>
      ))}
    </div>
  );
}
