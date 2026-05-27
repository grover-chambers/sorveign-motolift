const HISTORY = [
  { date:'2026-05-27', amount:350, method:'M-Pesa', ref:'QKJ7HX' },
  { date:'2026-05-26', amount:350, method:'M-Pesa', ref:'QKJ5MN' },
  { date:'2026-05-25', amount:700, method:'M-Pesa', ref:'QKK0PL' },
];

export default function Repayments() {
  return (
    <div style={{padding:'24px 16px 100px'}}>
      <h2 style={{marginBottom:20}}>Repayment History</h2>
      {HISTORY.map((r,i) => (
        <div key={i} style={{
          background:'#fff', borderRadius:16, padding:'16px 20px',
          marginBottom:12, display:'flex', justifyContent:'space-between',
          boxShadow:'0 2px 10px rgba(0,0,0,.05)',
        }}>
          <div>
            <p style={{fontWeight:600}}>KES {r.amount.toLocaleString()}</p>
            <p style={{fontSize:12,color:'#6b7280'}}>{r.method} · {r.ref}</p>
          </div>
          <p style={{fontSize:13,color:'#6b7280',alignSelf:'center'}}>{r.date}</p>
        </div>
      ))}
    </div>
  );
}
