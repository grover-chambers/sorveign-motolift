import { useState } from 'react';

const faqs = [
  { q: 'How do I make a payment?', a: 'Tap "Pay Today" on your dashboard or use the Payments tab. M-Pesa will prompt you to confirm the daily amount.' },
  { q: 'What happens if I miss a payment?', a: 'Missed payments accrue a late fee. Consistent on-time payments reduce your financing term and build your credit score.' },
  { q: 'How does the platform onboarding work?', a: 'We help you register on up to 4 e-mobility platforms (Uber, Bolt, Little, Uber Eats) to maximize your daily income.' },
  { q: 'When do I own the motorcycle?', a: 'After completing all 540 daily payments (18 months). Early completion is possible with consistent payments.' },
  { q: 'Can I upgrade my motorcycle?', a: 'After Phase 1 (90 days) of on-time payments, you may qualify for an upgrade to a higher tier.' },
  { q: 'How do I contact support?', a: 'Call or WhatsApp +254717316793. You can also email crescentkasuki@gmail.com.' },
];

export default function Support() {
  const [open, setOpen] = useState(null);

  return (
    <div className="page">
      <div className="app-header">
        <h1>Support</h1>
        <p className="app-header-sub">Frequently asked questions</p>
      </div>

      <div className="card-group">
        <div className="section-title">Contact</div>
        <a href="tel:+254717316793" className="contact-row">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <span>+254 717 316 793</span>
        </a>
        <a href="mailto:crescentkasuki@gmail.com" className="contact-row">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <span>crescentkasuki@gmail.com</span>
        </a>
      </div>

      <div className="card-group" style={{ marginTop:0 }}>
        <div className="section-title">FAQ</div>
        {faqs.map((f, i) => (
          <div key={i} className={`faq-item ${open === i ? 'open' : ''}`} onClick={() => setOpen(open === i ? null : i)}>
            <div className="faq-q">
              <span>{f.q}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            {open === i && <p className="faq-a">{f.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
