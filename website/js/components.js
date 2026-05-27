const PREFIX = (() => {
  const path = window.location.pathname;
  return path.includes('/pages/') ? '..' : '.';
})();

const NAV_HTML = `
<nav>
  <a href="${PREFIX}/index.html" class="nav-logo">SOrvReign MotoLift</a>
  <button class="nav-toggle" aria-label="Menu">☰</button>
  <ul class="nav-links">
    <li><a href="${PREFIX}/index.html">Home</a></li>
    <li><a href="${PREFIX}/pages/marketplace.html">Motorcycles</a></li>
    <li><a href="${PREFIX}/pages/apply.html">Apply</a></li>
    <li><a href="${PREFIX}/pages/partners.html">Partners</a></li>
    <li><a href="${PREFIX}/pages/onboarding.html">Onboarding</a></li>
    <li><a href="${PREFIX}/pages/support.html">Support</a></li>
    <li><a href="${PREFIX}/pages/aboutus.html">About</a></li>
    <li><a href="${PREFIX}/pages/contacts.html" class="nav-cta">Contact</a></li>
  </ul>
</nav>
`;

const FOOTER_HTML = `
  <img src="${PREFIX}/images/logos/logo-sovreign.jpeg" alt="" class="footer-watermark" aria-hidden="true">
  <div class="footer-inner">
    <div class="footer-grid">
      <!-- QUICK LINKS -->
      <div class="footer-col">
        <p class="footer-tagline">Financing livelihoods, not just motorcycles.</p>
        <a href="#" class="footer-top-link" id="backToTop">↑ Back to top</a>
      </div>

      <!-- FOR RIDERS -->
      <div class="footer-col">
        <h4>For Riders</h4>
        <a href="${PREFIX}/pages/apply.html">Apply Now</a>
        <a href="${PREFIX}/pages/marketplace.html">Calculator</a>
        <a href="${PREFIX}/pages/support.html">Rider Support</a>
        <a href="${PREFIX}/pages/partners.html">Partners</a>
      </div>

      <!-- CONNECT -->
      <div class="footer-col">
        <h4>Connect</h4>
        <div class="footer-social">
          <a href="#" target="_blank" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          <a href="#" target="_blank" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
          <a href="#" target="_blank" aria-label="Twitter / X"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg></a>
          <a href="#" target="_blank" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>
          <a href="#" target="_blank" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg></a>
        </div>
        <a href="mailto:crescentkasuki@gmail.com" class="footer-contact-link">crescentkasuki@gmail.com</a>
        <a href="tel:+254717316793" class="footer-contact-link">+254 717 316 793</a>
        <a href="${PREFIX}/pages/contacts.html" class="footer-contact-link">Nairobi, Kenya</a>
      </div>

      <!-- LEGAL & MORE -->
      <div class="footer-col">
        <h4>Legal &amp; More</h4>
        <a href="${PREFIX}/pages/privacy.html">Privacy Policy</a>
        <a href="${PREFIX}/pages/terms.html">Terms of Service</a>
        <a href="${PREFIX}/pages/support.html">FAQ</a>
        <a href="${PREFIX}/pages/cookies.html">Cookie Policy</a>
      </div>
    </div>

    <div class="footer-newsletter">
      <p class="footer-newsletter-label">Stay updated on new bikes &amp; opportunities</p>
      <form class="footer-newsletter-form" onsubmit="event.preventDefault();alert('Thanks for subscribing!');">
        <input type="email" placeholder="Your email address" required>
        <button type="submit">Subscribe</button>
      </form>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2026 SOrvReign MotoLift | Empowering Mobility &amp; Employment</p>
    </div>
  </div>
`;

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('global-header');
  const footer = document.getElementById('global-footer');
  if (header) header.innerHTML = NAV_HTML;
  if (footer) footer.innerHTML = FOOTER_HTML;

  // Cookie notice
  if (!document.querySelector('.cookie-notice') && !localStorage.getItem('cookieConsent')) {
    const notice = document.createElement('div');
    notice.className = 'cookie-notice';
    notice.innerHTML =
      '<p>We use cookies to improve your experience. By continuing, you accept our <a href="' + PREFIX + '/pages/cookies.html">Cookie Policy</a>.</p>' +
      '<div class="cookie-btns">' +
      '<button class="cookie-decline" onclick="localStorage.setItem(\'cookieConsent\',\'declined\');this.closest(\'.cookie-notice\').remove()">Decline</button>' +
      '<button class="cookie-accept" onclick="localStorage.setItem(\'cookieConsent\',\'accepted\');this.closest(\'.cookie-notice\').remove()">Accept</button>' +
      '</div>';
    document.body.appendChild(notice);
  }

  // Mobile toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  // Highlight active page
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href').includes(current)) a.classList.add('active');
  });
});
