/* SwanPass redesign mockup — shared UI (header, location chooser, mega search, cards, filters).
   Plain JS, no build step. In Rails these become partials + a small Stimulus controller each. */

const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  right: '<path d="m9 6 6 6-6 6"/>',
  left: '<path d="m15 6-6 6 6 6"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  heart: '<path d="M12 20s-7.5-4.6-9.3-9.2C1.4 7.4 3.6 4 7 4c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8C19.5 15.4 12 20 12 20Z"/>',
  tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  map: '<path d="m9 4-6 2.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5L9 4Z"/><path d="M9 4v13.5M15 6.5V20"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>',
  flame: '<path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-2 2-3 4-3 6-1-1-2-2-2-4-2 2-5 5-5 8a7 7 0 0 0 7 7Z"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  locate: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>',
  route: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H16a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h7.5"/>',
  share: '<path d="M12 3v13M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3 3.9M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.5 4.5-1.1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  star: '<path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3L2.8 9.5l6.4-.9L12 2.8Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  drag: '<circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
  home: '<path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  inbox: '<path d="M3 13h5l1.5 3h5L16 13h5"/><path d="M5 5h14l2 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6l2-8Z"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  ticket: '<path d="M3 9V6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3a3 3 0 0 0 0 6v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a3 3 0 0 0 0-6Z"/><path d="M14 5v14" stroke-dasharray="2 2"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  wand: '<path d="m15 4 5 5L9 20l-5-5L15 4Z"/><path d="M19 2v3M17.5 3.5h3M5 3v2M4 4h2"/>',
};
const icon = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
const starIcon = '<svg class="star" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3L2.8 9.5l6.4-.9L12 2.8Z"/></svg>';
const tick = '<svg class="verified-tick" viewBox="0 0 24 24" aria-label="Verified"><path fill="currentColor" d="M12 1.5 14.6 4l3.6-.4.9 3.5 3.2 1.8-1.4 3.3 1.4 3.3-3.2 1.8-.9 3.5-3.6-.4L12 22.5 9.4 20l-3.6.4-.9-3.5-3.2-1.8L3.1 12 1.7 8.7l3.2-1.8.9-3.5 3.6.4L12 1.5Z"/><path d="m8 12 3 3 5-6" stroke="#0b090e" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const LOGO = '<img class="logo-img" src="https://swanpass.com/swanpass_logo_rev.png" alt="SwanPass">';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ROOT = document.currentScript ? document.currentScript.src.replace(/assets\/sp\.js.*$/, '') : './';

/* ---------- storage (every access guarded — private mode etc.) ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem('sp_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('sp_' + k, JSON.stringify(v)); } catch (e) { } },
};
const getLoc = () => store.get('loc', { country: 'th', city: 'bangkok' });
const setLoc = loc => { store.set('loc', loc); document.dispatchEvent(new CustomEvent('sp:loc', { detail: loc })); renderLocPill(); };
const cityOf = slug => CITIES.find(c => c.slug === slug);
const countryOf = code => COUNTRIES.find(c => c.code === code);
const locLabel = (loc = getLoc()) => loc.city ? cityOf(loc.city).name : loc.country ? countryOf(loc.country).name : 'All of Asia';
const locFlag = (loc = getLoc()) => loc.country ? countryOf(loc.country).flag : '🌏';
const saved = () => store.get('saved', ['don-quixote', 'jelly-pop-bangkok', 'nomo22-bangkok']);
const toggleSaved = slug => { const s = saved(); const i = s.indexOf(slug); i > -1 ? s.splice(i, 1) : s.push(slug); store.set('saved', s); return i === -1; };

/* ---------- header / footer / tab bar ---------- */
const NAV = [['search', '🔎', 'Explore', 'search.html'], ['map', '🗺️', 'Map', 'map.html'], ['deals', '🏷️', 'Deals', 'deals.html'], ['best', '🏆', 'Best', 'best.html'], ['hotels', '🏨', 'Hotels', 'hotels.html'], ['staff', '👩', 'Staff', 'staff.html'], ['guides', '📝', 'Guides', 'guides.html']];
function header(active) {
  return `<header class="hdr"><div class="wrap">
    <button class="icon-btn hamb" data-drawer aria-label="Open menu">${icon('list')}</button>
    <a class="logo" href="${ROOT}index.html" aria-label="SwanPass home">${LOGO}</a>
      <button class="loc-pill find-pill" data-open="search" aria-label="Change city or search"><span class="flag">${locFlag()}</span><span class="t">${esc(locLabel())}</span><span class="sep"></span>${icon('search')}</button>
    <nav class="nav">${NAV.map(([k, e, t, h]) => `<a href="${ROOT}${h}" class="${k === active ? 'on' : ''}"><span class="em">${e}</span>${t}</a>`).join('')}</nav>
    <div class="hdr-actions">
      <a class="btn btn-ghost btn-sm desktop-only" href="${ROOT}shop/index.html">➕ List your business</a>
      <a class="avatar" href="${ROOT}account/index.html" aria-label="Your account">AJ</a>
    </div>
  </div></header>
  <div class="drawer-ov" data-drawer-close></div>
  <aside class="drawer" aria-label="Menu">
    <div class="row between" style="margin-bottom:10px"><a class="logo" href="${ROOT}index.html">${LOGO}</a><button class="icon-btn" data-drawer-close aria-label="Close">${icon('close')}</button></div>
    <button class="loc-pill" data-open="loc" style="width:100%;max-width:none;margin-bottom:8px"><span class="flag">${locFlag()}</span><span class="t">${esc(locLabel())}</span>${icon('chevron')}</button>
    ${NAV.map(([k, e, t, h]) => `<a class="dlink ${k === active ? 'on' : ''}" href="${ROOT}${h}"><span class="em">${e}</span>${t}</a>`).join('')}
    <div class="dlabel">Categories</div>
    ${CATEGORIES.map(c => `<a class="dlink" href="${ROOT}search.html?cat=${c.slug}"><span class="em">${CAT_EMOJI[c.slug]}</span>${c.name}</a>`).join('')}
    <div class="dlabel">You</div>
    <a class="dlink" href="${ROOT}account/index.html">👤 My account</a><a class="dlink" href="${ROOT}account/index.html#saved">❤️ Saved</a><a class="dlink" href="${ROOT}account/index.html#pass">🎟️ Member pass</a>
    <div class="dlabel">Business</div>
    <a class="dlink" href="${ROOT}shop/index.html">➕ List your business</a><a class="dlink" href="#">📝 Blog</a><a class="dlink" href="#">💬 Feedback</a>
  </aside>`;
}
const CAT_EMOJI = { massage: '💋', soapy: '🧼', 'go-go': '👯', 'gentlemens-clubs': '💃', 'red-light': '📍', freelancers: '❤️', ktv: '🎤', lgbtq: '🏳️‍🌈', 'beer-bars': '🍺', nightclubs: '🪩' };

/* ---------- visitor currency: every price shows local + ≈ the visitor's own currency ----------
   production: default from Accept-Language / Cloudflare country header, saved in a cookie + member profile; rates refreshed daily */
const CURRENCIES = { USD: ['$', 33.7], GBP: ['£', 44.5], EUR: ['€', 37.7], AUD: ['A$', 22.1], CAD: ['C$', 24.6], NONE: ['', 0] };
const FX_FROM_THB = { th: 1, vn: 700, id: 450, kh: 0.028, my: 0.13, sg: 0.037 };
const getCur = () => store.get('cur', 'USD');
const approx = thb => { const [sym, rate] = CURRENCIES[getCur()] || CURRENCIES.USD; return rate ? `≈ ${sym}${Math.round(thb / rate).toLocaleString()}` : ''; };
const localPrice = (thb, country = 'th') => { const c = (countryOf(country) || {}).currency || '฿', raw = thb * (FX_FROM_THB[country] || 1), mag = Math.pow(10, Math.max(0, Math.floor(Math.log10(raw || 1)) - 1)); return c + (Math.round(raw / mag) * mag).toLocaleString(); };
const money = (thb, country = 'th') => `${localPrice(thb, country)} <span class="approx">${approx(thb)}</span>`;
const curSelect = () => `<select class="select cur-select" data-cur aria-label="Show prices in">${Object.keys(CURRENCIES).map(k => `<option value="${k}" ${getCur() === k ? 'selected' : ''}>${k === 'NONE' ? 'Local only' : k + ' ' + CURRENCIES[k][0]}</option>`).join('')}</select>`;
document.addEventListener('change', e => { if (e.target.matches('[data-cur]')) { store.set('cur', e.target.value); location.reload(); } });
const goodTag = k => GOOD_TAGS.find(t => t[0] === k);

document.addEventListener('click', e => {
  if (e.target.closest('[data-drawer]')) document.body.classList.add('drawer-open');
  if (e.target.closest('[data-drawer-close]') || (e.target.closest('.drawer [data-open]'))) document.body.classList.remove('drawer-open');
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.body.classList.remove('drawer-open'); });
function tabbar(active) {
  const t = [['search', '🔎', 'Explore', 'search.html'], ['map', '🗺️', 'Map', 'map.html'], ['deals', '🏷️', 'Deals', 'deals.html'], ['best', '🏆', 'Best', 'best.html'], ['account', '👤', 'Account', 'account/index.html']];
  return `<nav class="tabbar" aria-label="Main">${t.map(([k, e, l, h]) => `<a href="${ROOT}${h}" class="${k === active ? 'on' : ''}"><span class="em">${e}</span>${l}</a>`).join('')}</nav>`;
}
function footer() {
  const cities = CITIES.filter(c => c.count >= 20).slice(0, 8);
  return `<footer class="ftr"><div class="wrap">
    <div class="ftr-grid">
      <div><a class="logo" href="${ROOT}index.html">${LOGO}</a><p class="muted" style="max-width:34ch;margin-top:12px">The after-dark guide to Asia. Real venues, real prices, exclusive SwanPass deals.</p>
        <div class="row" style="margin-top:16px"><button class="btn btn-ghost btn-sm">${icon('globe')} English</button><button class="btn btn-ghost btn-sm">฿ THB</button></div></div>
      <div><h4>Cities</h4><ul>${cities.map(c => `<li><a href="${ROOT}place.html?city=${c.slug}">${c.name}</a></li>`).join('')}</ul></div>
      <div><h4>Categories</h4><ul>${CATEGORIES.slice(0, 7).map(c => `<li><a href="${ROOT}search.html?cat=${c.slug}">${c.name}</a></li>`).join('')}</ul></div>
      <div><h4>SwanPass</h4><ul><li><a href="${ROOT}deals.html">Deals</a></li><li><a href="${ROOT}best.html">Best of 2026</a></li><li><a href="${ROOT}guides.html">Guides & articles</a></li><li><a href="${ROOT}hotels.html">Guest-friendly hotels</a></li><li><a href="#">About</a></li></ul></div>
      <div><h4>Business</h4><ul><li><a href="${ROOT}shop/index.html">Claim your venue</a></li><li><a href="${ROOT}shop/index.html">Advertise / Featured</a></li><li><a href="#">Report a listing</a></li><li><a href="#">Feedback</a></li></ul></div>
    </div>
    <div class="legal"><span>© ${new Date().getFullYear()} SwanPass. Adults 18+ only. Listings are provided by venues and verified where marked.</span><span><a href="#">Privacy</a> · <a href="#">Terms</a></span></div>
  </div></footer>`;
}
function renderLocPill() { $$('.loc-pill').forEach(p => { p.querySelector('.flag').textContent = locFlag(); p.querySelector('.t').textContent = locLabel(); }); }

/* ---------- card ---------- */
function card(l, opts = {}) {
  const on = saved().includes(l.slug);
  const cur = (countryOf(l.country) || {}).currency || '฿';
  return `<a class="card ${l.featured ? 'is-feat' : l.verified ? 'is-ver' : ''}" href="${ROOT}listing.html?v=${l.slug}">
    <div class="card-media">
      <img loading="lazy" src="${l.img}" alt="" onerror="this.remove()">
      <div class="card-badges">${l.featured ? '<span class="badge b-feat">★ Featured</span>' : ''}${l.verified ? '<span class="badge b-ver">✓ Verified</span>' : ''}${l.isNew ? '<span class="badge b-new">New</span>' : ''}</div>
      <button class="card-save ${on ? 'on' : ''}" data-save="${l.slug}" aria-label="Save">${icon('heart')}</button>
      ${l.priceFrom ? `<span class="card-price num"><small>from</small> ${cur}${l.priceFrom.toLocaleString()}${approx(l.thb) ? `<small class="ap"> ${approx(l.thb)}</small>` : ''}</span>` : l.bar ? `<span class="card-price num"><small>beer</small> ฿${l.bar.beer}<small class="ap"> · bar fine ฿${l.bar.fine}</small></span>` : ''}
    </div>
    <div class="card-body">
      <div class="card-title"><span>${esc(l.name)}</span>${l.verified ? tick : ''}</div>
      <div class="card-meta">${l.rating ? `<span class="rating">${starIcon}${l.rating.toFixed(1)}</span><span class="num">(${l.reviews})</span><span class="dot"></span>` : '<span>No reviews yet</span><span class="dot"></span>'}<span>${CAT_EMOJI[l.catSlug] || ''} ${esc(l.cat.replace('’', "'"))}</span></div>
      <div class="card-meta"><span class="open-dot ${l.openNow ? '' : 'closed'}"></span><span>${l.openNow ? 'Open' : 'Opens ' + l.hours.opens + ':00'}</span><span class="dot"></span><span>📍 ${esc(l.areaName || l.cityName)}</span></div>
      ${l.good && l.good.length ? `<div class="card-good">${l.good.slice(0, 2).map(k => `<span>${goodTag(k)[1]} ${goodTag(k)[2]}</span>`).join('')}</div>` : ''}
      ${l.deal ? `<div class="card-deal">🏷️ ${esc(l.deal)}</div>` : ''}
    </div></a>`;
}
document.addEventListener('click', e => {
  const s = e.target.closest('[data-save]');
  if (s) { e.preventDefault(); e.stopPropagation(); s.classList.toggle('on', toggleSaved(s.dataset.save)); }
});

/* Popular Areas — linkable area grid with live counts (SEO: every chip is a crawlable /country/city/area link) */
function areaCount(citySlug, areaSlug) {
  const city = cityOf(citySlug), inCity = LISTINGS.filter(l => l.city === citySlug);
  const share = inCity.filter(l => l.area === areaSlug).length / (inCity.length || 1);
  return Math.max(1, Math.round(city.count * share));
}
function areaGrid(citySlug, limit = 12) {
  const areas = (AREAS[citySlug] || []).map(a => ({ ...a, n: areaCount(citySlug, a.slug) })).sort((a, b) => b.n - a.n).slice(0, limit);
  if (!areas.length) return '';
  return `<div class="area-grid">${areas.map(a => `<a class="area-chip" href="${ROOT}place.html?city=${citySlug}&area=${a.slug}"><span><b>${a.name}</b><small>${a.type}</small></span><span class="num">${a.n}</span></a>`).join('')}</div>`;
}

/* ------------------------------------------------------------------
   RANKING RULE (applies everywhere cards are listed — search, deals, staff,
   city/area pages, home rows, map list, search panel):
     tier 1  Featured (paid)   → tier 2  Verified   → tier 3  everyone else
   The user's sort (price, rating, newest…) only reorders cards *inside* a tier.
   Featured venues rotate daily inside tier 1 so every paying venue gets time at the top.
   ------------------------------------------------------------------ */
const tier = l => l.featured ? 0 : l.verified ? 1 : 2;
const TIER_NAMES = ['Featured', 'Verified', 'More venues'];
const DAY_SEED = new Date().toISOString().slice(0, 10);
const rotation = l => { let h = 0; for (const c of l.slug + DAY_SEED) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
const quality = l => (l.rating || 0) * 1000 + Math.min(l.reviewsNum, 999);
const score = l => (2 - tier(l)) * 1e6 + quality(l);
const tiered = within => (a, b) => tier(a) - tier(b) || within(a, b);
const SORTS = {
  recommended: ['Recommended', tiered((a, b) => tier(a) === 0 ? rotation(a) - rotation(b) : quality(b) - quality(a))],
  rating: ['Top rated', tiered((a, b) => (b.rating || 0) - (a.rating || 0) || b.reviewsNum - a.reviewsNum)],
  reviews: ['Most reviewed', tiered((a, b) => b.reviewsNum - a.reviewsNum)],
  newest: ['Newest', tiered((a, b) => b.isNew - a.isNew)],
  price: ['Price: low to high', tiered((a, b) => (a.priceFrom || 1e9) - (b.priceFrom || 1e9))],
  distance: ['Nearest', tiered((a, b) => Math.hypot(a.lat - 13.7367, a.lng - 100.5602) - Math.hypot(b.lat - 13.7367, b.lng - 100.5602))],
};
/* group a sorted list into tier sections (used by result grids) */
function withTierHeads(list, render, heads = true, inject = {}) {
  if (!heads) return list.map(l => render(l)).join('');
  let cur = -1, out = '';
  list.forEach((l, i) => { if (inject[i]) out += inject[i]; const t = tier(l); if (t !== cur) { cur = t; const n = list.filter(x => tier(x) === t).length; out += `<div class="tier-head">${t === 0 ? '<span class="badge b-feat">★ Featured</span>' : t === 1 ? '<span class="badge b-ver">✓ Verified</span>' : TIER_NAMES[2]}<small class="num">${n}</small></div>`; } out += render(l); });
  return out;
}

/* ---------- overlays ---------- */
function ensureOverlay() {
  if ($('#sp-ov')) return;
  document.body.insertAdjacentHTML('beforeend', '<div class="overlay" id="sp-ov"></div>');
  $('#sp-ov').addEventListener('click', closeAll);
}
function openModal(id, html, cls = '') {
  ensureOverlay(); closeAll();
  let m = $('#' + id);
  if (!m) { document.body.insertAdjacentHTML('beforeend', `<div class="modal ${cls}" id="${id}" role="dialog" aria-modal="true"></div>`); m = $('#' + id); }
  m.innerHTML = '<div class="grabber"></div>' + html;
  requestAnimationFrame(() => { $('#sp-ov').classList.add('open'); m.classList.add('open'); });
  document.body.style.overflow = 'hidden';
  return m;
}
function closeAll() { $$('.modal.open').forEach(m => m.classList.remove('open')); $('#sp-ov') && $('#sp-ov').classList.remove('open'); document.body.style.overflow = ''; }
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeAll();
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
});
document.addEventListener('click', e => {
  const o = e.target.closest('[data-open]'); if (!o) return;
  e.preventDefault();
  ({ loc: () => openSearch('', true), search: () => openSearch() })[o.dataset.open]?.();
  if (e.target.closest('[data-close]')) closeAll();
});
document.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeAll(); });

/* Location chooser — one global choice that scopes Explore, Map, Deals, Best and Staff */
function openLocation() {
  const loc = getLoc();
  let active = loc.country || 'th';
  const m = openModal('sp-loc', `
    <div class="modal-head">${icon('search')}<input id="loc-q" placeholder="Search a city or country" autocomplete="off"><button class="icon-btn" data-close aria-label="Close">${icon('close')}</button></div>
    <div class="loc-grid"><div class="loc-countries" id="loc-countries"></div><div class="loc-cities" id="loc-cities"></div></div>`);
  const drawCountries = () => $('#loc-countries', m).innerHTML =
    `<button class="loc-country" data-near>${icon('locate')} Near me</button>
     <button class="loc-country ${!loc.country ? 'on' : ''}" data-all>🌏 All of Asia <span class="n num">937</span></button>` +
    COUNTRIES.map(c => `<button class="loc-country ${c.code === active ? 'on' : ''}" data-c="${c.code}">${c.flag} ${c.name}${c.soon ? '<span class="soon">Soon</span>' : `<span class="n num">${c.count}</span>`}</button>`).join('');
  const drawCities = (q = '') => {
    const list = q ? CITIES.filter(c => (c.name + ' ' + countryOf(c.country).name).toLowerCase().includes(q.toLowerCase())) : CITIES.filter(c => c.country === active);
    const ct = countryOf(active);
    $('#loc-cities', m).innerHTML = q || !ct.soon ? `
      ${q ? '' : `<div class="row between" style="margin-bottom:14px"><div><div class="ms-label" style="margin:0">${ct.flag} ${ct.name}</div></div><button class="btn btn-ghost btn-sm" data-country-all="${active}">All of ${ct.name}</button></div>`}
      <div class="loc-city-grid">${list.map(c => `<button class="loc-city ${loc.city === c.slug ? 'on' : ''}" data-city="${c.slug}">${c.img ? `<img src="${c.img}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'ph'}))">` : '<span class="ph"></span>'}<span><b>${c.name}</b><span class="num">${c.count} venues</span></span></button>`).join('') || '<p class="muted">No match.</p>'}</div>`
      : `<div class="empty"><div class="display" style="font-size:34px;color:var(--text)">${ct.flag} ${ct.name}</div><p>Coming soon. Get notified when we launch.</p><button class="btn btn-red btn-sm">${icon('bell')} Notify me</button></div>`;
  };
  drawCountries(); drawCities();
  m.addEventListener('click', e => {
    const c = e.target.closest('[data-c]'); if (c) { active = c.dataset.c; drawCountries(); drawCities(); return; }
    const city = e.target.closest('[data-city]'); if (city) { const ci = cityOf(city.dataset.city); setLoc({ country: ci.country, city: ci.slug }); location.href = `${ROOT}place.html?city=${ci.slug}`; return; }
    const all = e.target.closest('[data-country-all]'); if (all) { setLoc({ country: all.dataset.countryAll, city: null }); closeAll(); return; }
    if (e.target.closest('[data-all]')) { setLoc({ country: null, city: null }); closeAll(); return; }
    if (e.target.closest('[data-near]')) { setLoc({ country: 'th', city: 'bangkok', near: true }); closeAll(); }
  });
  $('#loc-q', m).addEventListener('input', e => drawCities(e.target.value));
  setTimeout(() => $('#loc-q', m).focus(), 50);
}

/* Mega search (ClickUp "Mega Search", Nightify-style) */
function openSearch(prefill = '', focusLoc = false) {
  const loc = getLoc();
  let ctab = loc.country || 'th';
  const city = loc.city ? cityOf(loc.city) : null;
  const inScope = LISTINGS.filter(l => (!loc.country || l.country === loc.country) && (!loc.city || l.city === loc.city));
  const catCount = slug => inScope.filter(l => l.catSlug === slug).length;
  const areas = (city && AREAS[city.slug]) || [];
  const m = openModal('sp-search', `
    <div class="modal-head">${icon('search')}<input id="ms-q" placeholder="Search venues, areas, services…" autocomplete="off" value="${esc(prefill)}">
      <button class="icon-btn" data-close aria-label="Close">${icon('close')}</button></div>
    <div class="ms-where" id="ms-where"></div>
    <div class="modal-body" id="ms-body"></div>`, 'full');
  const drawWhere = () => {
    const cur = getLoc();
    $('#ms-where', m).innerHTML = `
      <div class="where-top"><span class="ms-label" style="margin:0">📍 Where</span><span class="where-links"><button data-near>📍 Near me</button><button data-allasia class="${!cur.country ? 'on' : ''}">🌏 All of Asia</button></span></div>
      <div class="ctabs">${COUNTRIES.map(c => `<button class="ctab ${c.code === ctab ? 'on' : ''}" data-ctab="${c.code}"><span class="fl">${c.flag}</span>${c.name}${c.soon ? '<small>soon</small>' : ''}</button>`).join('')}</div>
      ${countryOf(ctab).soon ? '<p class="muted" style="font-size:13px;margin:12px 0 0">Coming soon — we’ll notify you when it launches.</p>' : `<div class="cgrid">
        <button class="ccity all ${cur.country === ctab && !cur.city ? 'on' : ''}" data-allc="${ctab}"><span class="ph">${countryOf(ctab).flag}</span><span><b>All of ${countryOf(ctab).name}</b><small class="num">${countryOf(ctab).count} venues</small></span></button>
        ${CITIES.filter(c => c.country === ctab).map(c => `<button class="ccity ${cur.city === c.slug ? 'on' : ''}" data-city="${c.slug}">${c.img ? `<img src="${c.img}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'ph'}))">` : '<span class="ph"></span>'}<span><b>${c.name}</b><small class="num">${c.count} venues</small></span></button>`).join('')}</div>`}`;
  };
  drawWhere();
  m.addEventListener('click', e => {
    const t = e.target.closest('[data-ctab]'); if (t) { ctab = t.dataset.ctab; drawWhere(); return; }
    const c = e.target.closest('[data-city]'); if (c) { const ci = cityOf(c.dataset.city); setLoc({ country: ci.country, city: ci.slug }); location.href = `${ROOT}place.html?city=${ci.slug}`; return; }
    const a = e.target.closest('[data-allc]'); if (a) { setLoc({ country: a.dataset.allc, city: null }); location.href = `${ROOT}place.html?country=${a.dataset.allc}`; return; }
    if (e.target.closest('[data-allasia]')) { setLoc({ country: null, city: null }); refresh(); return; }
    if (e.target.closest('[data-near]')) { setLoc({ country: 'th', city: 'bangkok', near: true }); refresh(); }
  });
  function refresh() { closeAll(); openSearch($('#ms-q', m).value); }
  const idle = () => `
      ${areas.length ? `<p class="ms-label">Popular areas in ${city.name}</p><div class="ms-chips">${areas.map(a => `<a class="chip" href="${ROOT}place.html?city=${city.slug}&area=${a.slug}">${icon('pin')}${a.name}</a>`).join('')}</div>` : ''}
      <p class="ms-label">Browse ${city ? city.name : ''} by category</p>
      <div class="ms-chips">${CATEGORIES.map(c => `<a class="chip" href="${ROOT}search.html?cat=${c.slug}">${CAT_EMOJI[c.slug]} ${c.name}${catCount(c.slug) ? ` <span class="muted num">${catCount(c.slug)}</span>` : ''}</a>`).join('')}</div>`;
  function hit(l, q = '') {
    const name = q ? esc(l.name).replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>') : esc(l.name);
    return `<a class="ms-hit" href="${ROOT}listing.html?v=${l.slug}"><img src="${l.img}" alt="" loading="lazy"><div><div class="t">${name} ${l.verified ? tick : ''}</div><div class="s">${esc(l.cat)} · ${esc(l.areaName || l.cityName)}${l.deal ? ' · <span style="color:var(--deal)">' + esc(l.deal) + '</span>' : ''}</div></div></a>`;
  }
  const draw = q => {
    q = q.trim();
    if (!q) { $('#ms-body', m).innerHTML = idle(); return; }
    const ql = q.toLowerCase();
    const places = [...CITIES.filter(c => c.name.toLowerCase().includes(ql)).map(c => ({ t: c.name, s: countryOf(c.country).name + ' · city', h: 'place.html?city=' + c.slug })),
      ...Object.entries(AREAS).flatMap(([cs, as]) => as.filter(a => a.name.toLowerCase().includes(ql)).map(a => ({ t: a.name, s: cityOf(cs).name + ' · area', h: `place.html?city=${cs}&area=${a.slug}` })))];
    const venues = LISTINGS.filter(l => (l.name + ' ' + l.cat + ' ' + l.tags.join(' ')).toLowerCase().includes(ql)).sort((a, b) => tier(a) - tier(b) || (b.city === loc.city) - (a.city === loc.city) || quality(b) - quality(a)).slice(0, 8);
    $('#ms-body', m).innerHTML = `
      ${places.length ? `<p class="ms-label">Places</p><div class="ms-chips">${places.map(p => `<a class="chip" href="${ROOT}${p.h}">${icon('pin')}${esc(p.t)} <span class="muted">${p.s}</span></a>`).join('')}</div>` : ''}
      <p class="ms-label">Venues</p><div class="ms-results">${venues.map(v => hit(v, q)).join('') || '<p class="muted">No venues match “' + esc(q) + '”.</p>'}</div>
      <a class="btn btn-ghost btn-block" style="margin-top:14px" href="${ROOT}search.html?q=${encodeURIComponent(q)}">See all results for “${esc(q)}”</a>`;
  };
  draw(prefill);
  $('#ms-q', m).addEventListener('input', e => draw(e.target.value));
  m.addEventListener('click', e => { const t = e.target.closest('[data-q]'); if (t) { $('#ms-q', m).value = t.dataset.q; draw(t.dataset.q); } });
  setTimeout(() => $('#ms-q', m).focus(), 50);
}

/* ---------- age gate (once per browser) ---------- */
function ageGate() {
  if (store.get('age_ok', false) || location.search.includes('nogate')) return;
  document.body.insertAdjacentHTML('beforeend', `<div class="agegate" id="agegate"><div class="agegate-card">
    <div class="logo" style="justify-content:center">${LOGO}</div>
    <h2 class="display">Adults <em>only</em></h2>
    <p class="muted">SwanPass lists adult nightlife venues. Confirm you are 18 or older (or the legal age where you are) to continue.</p>
    <div class="row" style="justify-content:center;margin-top:22px"><a class="btn btn-ghost" href="https://www.google.com">Leave</a><button class="btn btn-red" id="age-yes">I'm 18 or older</button></div>
    <p class="muted" style="font-size:12px;margin-top:18px">Explicit photos are blurred until you tap them. Change this any time in your account.</p>
  </div></div>`);
  $('#age-yes').onclick = () => { store.set('age_ok', true); $('#agegate').remove(); };
}

/* mockup toolbar — not part of the product */
function mockBar() {
  document.body.insertAdjacentHTML('beforeend', `<div class="mock-bar"><a href="${ROOT}_overview.html">◧ All screens</a><button id="mb-notes">Hide notes</button></div>`);
  $('#mb-notes').onclick = e => { document.body.classList.toggle('no-notes'); e.target.textContent = document.body.classList.contains('no-notes') ? 'Show notes' : 'Hide notes'; };
}
const note = text => `<span class="note" tabindex="0" data-note="${esc(text)}">i</span>`;

/* ---------- page shell ---------- */
function shell(active, { gate = true } = {}) {
  document.body.insertAdjacentHTML('afterbegin', header(active));
  document.body.insertAdjacentHTML('beforeend', footer() + tabbar(active));
  if (gate) ageGate();
  mockBar();
}

/* ==========================================================================
   Directory engine — used by Explore (search), Deals, and Staff.
   One filter model; desktop shows it in the left column, mobile in a bottom sheet.
   ========================================================================== */
function directory({ el, title, preset = {}, render = card, gridClass = 'grid-cards', after }) {
  const params = new URLSearchParams(location.search);
  const loc = getLoc();
  const S = {
    country: loc.country, city: loc.city, areas: [], cats: params.get('cat') ? [params.get('cat')] : [],
    q: params.get('q') || '', good: [], openNow: false, deal: !!preset.deal, verified: false, isNew: false, featuredOnly: false,
    minRating: 0, price: 0, sort: params.get('sort') || 'recommended', ...preset,
  };
  const scope = l => (!S.country || l.country === S.country) && (!S.city || l.city === S.city);
  const match = (l, skip) =>
    scope(l) && (skip === 'area' || !S.areas.length || S.areas.includes(l.area)) &&
    (skip === 'cat' || !S.cats.length || S.cats.includes(l.catSlug)) &&
    (!S.q || (l.name + ' ' + l.tags.join(' ')).toLowerCase().includes(S.q.toLowerCase())) &&
    (skip === 'good' || S.good.every(g => l.good.includes(g))) && (!S.openNow || l.openNow) && (!S.deal || l.deal) && (!S.verified || l.verified) && (!S.isNew || l.isNew) &&
    (!S.featuredOnly || l.featured) && (!S.minRating || (l.rating || 0) >= S.minRating) && (!S.price || l.priceLevel === S.price);
  const results = () => LISTINGS.filter(l => match(l)).sort(SORTS[S.sort][1]);

  el.innerHTML = `
    <div class="subbar cat-subbar"><div class="wrap">
      <div class="chips" id="d-cats" style="flex:1"></div>
      <button class="btn btn-ghost btn-sm" id="d-open-filters">${icon('filter')} Filters <span id="d-fcount"></span></button>
    </div></div>
    <div class="wrap dir">
      <aside class="filters" id="d-filters" aria-label="Filters"></aside>
      <section>
        <div class="results-head">
          <div><h1 id="d-title"></h1><div class="count num" id="d-count"></div></div>
          <div class="row"><span class="sort-hint desktop-only">${note('Paid placement rule: whatever the sort, Featured venues come first, then Verified, then the rest. The sort only reorders inside each group. Featured order rotates daily so every paying venue gets time in the top spot.')} Featured & Verified always first</span><a class="btn btn-ghost btn-sm desktop-only" href="${ROOT}map.html">${icon('map')} Map</a><select class="select" id="d-sort" aria-label="Sort">${Object.entries(SORTS).map(([k, [t]]) => `<option value="${k}" ${k === S.sort ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
        </div>
        <div class="active-filters" id="d-active"></div>
        <div class="${gridClass}" id="d-grid"></div>
        <div style="text-align:center;margin-top:28px"><button class="btn btn-ghost" id="d-more">Show more</button></div>
      </section>
    </div>`;

  const filtersHTML = (nm = 'd-city') => {
    const inCountry = CITIES.filter(c => !S.country || c.country === S.country);
    const areas = (S.city && AREAS[S.city]) || [];
    const countBy = (fn, skip) => LISTINGS.filter(l => match(l, skip) && fn(l)).length;
    return `
      <details class="fgroup" open><summary>Location</summary><div class="fbody">
        <button class="btn btn-ghost btn-sm" data-open="loc" style="justify-content:flex-start">${locFlag({ country: S.country })} ${esc(S.city ? cityOf(S.city).name : S.country ? countryOf(S.country).name : 'All of Asia')} — change</button>
        ${S.country ? `<div style="margin-top:8px">${inCountry.slice(0, 6).map(c => `<label class="fcheck"><input type="radio" name="${nm}" value="${c.slug}" ${S.city === c.slug ? 'checked' : ''}>${c.name}<span class="n">${c.count}</span></label>`).join('')}
          <label class="fcheck"><input type="radio" name="${nm}" value="" ${!S.city ? 'checked' : ''}>All cities</label></div>` : ''}
        ${areas.length ? `<div class="ms-label" style="margin:12px 0 4px;font-size:10.5px">Areas in ${cityOf(S.city).name}</div>${areas.map(a => `<label class="fcheck"><input type="checkbox" data-area="${a.slug}" ${S.areas.includes(a.slug) ? 'checked' : ''}>${a.name}<span class="n">${countBy(l => l.area === a.slug, 'area')}</span></label>`).join('')}` : ''}
      </div></details>
      <details class="fgroup" open><summary>Category</summary><div class="fbody">
        ${CATEGORIES.map(c => `<label class="fcheck"><input type="checkbox" data-cat="${c.slug}" ${S.cats.includes(c.slug) ? 'checked' : ''}>${CAT_EMOJI[c.slug]} ${c.name}${c.isNew ? ' <span class="chip-new">NEW</span>' : ''}<span class="n">${countBy(l => l.catSlug === c.slug, 'cat')}</span></label>`).join('')}
      </div></details>
      <details class="fgroup" open><summary>Show only</summary><div class="fbody">
        <label class="toggle-row">Open now<input type="checkbox" class="switch" data-flag="openNow" ${S.openNow ? 'checked' : ''}></label>
        <label class="toggle-row">Has a SwanPass deal<input type="checkbox" class="switch" data-flag="deal" ${S.deal ? 'checked' : ''}></label>
        <label class="toggle-row">Verified venues<input type="checkbox" class="switch" data-flag="verified" ${S.verified ? 'checked' : ''}></label>
        <label class="toggle-row">New this month<input type="checkbox" class="switch" data-flag="isNew" ${S.isNew ? 'checked' : ''}></label>
      </div></details>
      <details class="fgroup" open><summary>Price</summary><div class="fbody">
        <div class="seg" id="d-price">${['Any', '฿', '฿฿', '฿฿฿'].map((t, i) => `<button data-price="${i}" class="${S.price === i ? 'on' : ''}">${t}</button>`).join('')}</div>
      </div></details>
      <details class="fgroup" open><summary>Rating</summary><div class="fbody">
        <div class="seg">${[[0, 'Any'], [4, '4.0+'], [4.5, '4.5+']].map(([v, t]) => `<button data-rating="${v}" class="${S.minRating === v ? 'on' : ''}">${t}</button>`).join('')}</div>
      </div></details>
      <details class="fgroup" open><summary>Good to know</summary><div class="fbody">
        ${GOOD_TAGS.map(([k, e, t]) => `<label class="fcheck"><input type="checkbox" data-good="${k}" ${S.good.includes(k) ? 'checked' : ''}>${e} ${t}<span class="n">${LISTINGS.filter(l => match(l) && (S.good.includes(k) || l.good.includes(k))).length}</span></label>`).join('')}
      </div></details>
      <details class="fgroup"><summary>Show prices in</summary><div class="fbody">${curSelect()}</div></details>`;
  };

  let limit = 36;
  const draw = () => {
    const r = results();
    $('#d-title', el).textContent = typeof title === 'function' ? title(S) : title;
    $('#d-count', el).textContent = `${r.length} venue${r.length === 1 ? '' : 's'}` + (S.city ? ` in ${cityOf(S.city).name}` : S.country ? ` in ${countryOf(S.country).name}` : ' across Asia');
    $('#d-grid', el).innerHTML = r.length ? withTierHeads(r.slice(0, limit), render, true) : `<div class="empty" style="grid-column:1/-1"><h3>No venues match</h3><p>Try removing a filter or widening the area.</p><button class="btn btn-ghost btn-sm" data-reset>Clear all filters</button></div>`;
    $('#d-more', el).style.display = r.length > limit ? '' : 'none';
    $('#d-filters', el).innerHTML = filtersHTML();
    $('#d-cats', el).innerHTML = `<button class="chip ${!S.cats.length ? 'on' : ''}" data-chipcat="">🔥 All</button>` + CATEGORIES.map(c => `<button class="chip ${S.cats.includes(c.slug) ? 'on' : ''}" data-chipcat="${c.slug}">${CAT_EMOJI[c.slug]} ${c.name}</button>`).join('');
    const act = [];
    S.areas.forEach(a => act.push([`area:${a}`, AREAS[S.city].find(x => x.slug === a).name]));
    S.cats.forEach(c => act.push([`cat:${c}`, CATEGORIES.find(x => x.slug === c).name]));
    S.good.forEach(g => act.push([`good:${g}`, goodTag(g)[2]]));
    ['openNow', 'deal', 'verified', 'isNew'].forEach(f => S[f] && !(preset[f]) && act.push([`flag:${f}`, { openNow: 'Open now', deal: 'Has deal', verified: 'Verified', isNew: 'New' }[f]]));
    if (S.minRating) act.push(['rating', S.minRating + '+ stars']);
    if (S.price) act.push(['price', '฿'.repeat(S.price)]);
    if (S.q) act.push(['q', '“' + S.q + '”']);
    $('#d-active', el).innerHTML = act.map(([k, t]) => `<button class="chip" data-rm="${k}">${esc(t)} <span class="x">✕</span></button>`).join('') + (act.length > 1 ? '<button class="chip" data-reset>Clear all</button>' : '');
    $('#d-fcount', el).textContent = act.length ? `(${act.length})` : '';
    if ($('#d-sheet-count')) $('#d-sheet-count').textContent = `Show ${r.length} venues`;
    after && after(r, S);
  };

  const onChange = e => {
    const t = e.target;
    if (t.name && t.name.startsWith('d-city')) { S.city = t.value || null; S.areas = []; }
    if (t.dataset.area) S.areas = t.checked ? [...S.areas, t.dataset.area] : S.areas.filter(a => a !== t.dataset.area);
    if (t.dataset.good) S.good = t.checked ? [...S.good, t.dataset.good] : S.good.filter(g => g !== t.dataset.good);
    if (t.dataset.cat) S.cats = t.checked ? [...S.cats, t.dataset.cat] : S.cats.filter(c => c !== t.dataset.cat);
    if (t.dataset.flag) S[t.dataset.flag] = t.checked;
    if (t.id === 'd-sort') S.sort = t.value;
    draw();
    if ($('#d-sheet-body')) $('#d-sheet-body').innerHTML = filtersHTML('d-city-m');
  };
  const onClick = e => {
    const t = e.target.closest('[data-price],[data-rating],[data-chipcat],[data-rm],[data-reset]'); if (!t) return;
    if (t.dataset.price != null) S.price = +t.dataset.price;
    if (t.dataset.rating != null) S.minRating = +t.dataset.rating;
    if (t.dataset.chipcat != null) S.cats = t.dataset.chipcat ? [t.dataset.chipcat] : [];
    if (t.dataset.rm) { const [k, v] = t.dataset.rm.split(':'); if (k === 'area') S.areas = S.areas.filter(a => a !== v); if (k === 'cat') S.cats = S.cats.filter(c => c !== v); if (k === 'good') S.good = S.good.filter(g => g !== v); if (k === 'flag') S[v] = false; if (k === 'rating') S.minRating = 0; if (k === 'price') S.price = 0; if (k === 'q') S.q = ''; }
    if (t.dataset.reset != null) Object.assign(S, { areas: [], cats: [], good: [], q: '', openNow: false, deal: !!preset.deal, verified: false, isNew: false, minRating: 0, price: 0 });
    draw();
    if ($('#d-sheet-body')) $('#d-sheet-body').innerHTML = filtersHTML('d-city-m');
  };
  el.addEventListener('change', onChange); el.addEventListener('click', onClick);
  $('#d-more', el).onclick = () => { limit += 24; draw(); };
  $('#d-open-filters', el).onclick = () => {
    const m = openModal('d-sheet', `<div class="modal-head"><h3 style="flex:1">Filters</h3><button class="icon-btn" data-close aria-label="Close">${icon('close')}</button></div>
      <div class="modal-body" id="d-sheet-body">${filtersHTML('d-city-m')}</div>
      <div class="sheet-foot"><button class="btn btn-ghost" data-reset>Clear</button><button class="btn btn-red" style="flex:1" data-close id="d-sheet-count"></button></div>`);
    m.addEventListener('change', onChange); m.addEventListener('click', onClick);
    draw();
  };
  document.addEventListener('sp:loc', e => { S.country = e.detail.country; S.city = e.detail.city; S.areas = []; draw(); });
  draw();
  return S;
}

/* ---------- Contact buttons: open the native app with a short pre-filled message ----------
   WhatsApp, SMS and LINE official accounts (@id) support pre-fill. LINE personal IDs, Telegram,
   WeChat, Zalo and KakaoTalk don't, so we open the chat and copy the message to the clipboard. */
const contactMsg = name => `Hi! I saw ${name} on SwanPass.com and would like to ask a question.`;
function contactHref(ch, v, name) {
  const t = encodeURIComponent(contactMsg(name)), num = String(v).replace(/[^\d]/g, '').replace(/^0/, '66');
  return {
    whatsapp: `https://wa.me/${num}?text=${t}`,
    line: v.startsWith('@') ? `https://line.me/R/oaMessage/${encodeURIComponent(v)}/?${t}` : `https://line.me/ti/p/~${v}`,
    telegram: `https://t.me/${v.replace('@', '')}`,
    sms: `sms:+${num}${/iPhone|iPad/.test(navigator.userAgent) ? '&' : '?'}body=${t}`,
    phone: `tel:+${num}`,
    zalo: `https://zalo.me/${num}`,
    kakao: `https://open.kakao.com/o/${v}`,
    wechat: `weixin://dl/chat?${v}`,
  }[ch];
}
const PREFILLS = ['whatsapp', 'sms'];
document.addEventListener('click', e => {
  const a = e.target.closest('[data-contact]'); if (!a) return;
  const ch = a.dataset.contact, v = a.dataset.value, name = a.dataset.venue || 'your venue';
  a.href = contactHref(ch, v, name);
  const prefilled = PREFILLS.includes(ch) || (ch === 'line' && v.startsWith('@'));
  if (!prefilled && ch !== 'phone') {
    try { navigator.clipboard.writeText(contactMsg(name)); } catch (err) { }
    const t = document.getElementById('toast') || document.body.appendChild(Object.assign(document.createElement('div'), { id: 'toast', className: 'toast' }));
    t.textContent = 'Message copied — paste it in the chat'; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2500);
  }
  /* production: also POST /listings/:id/events {type: ch} for the owner dashboard */
});

/* ---------- guest-friendly hotel row (Hotels page, city/area pages, venue pages) ---------- */
function hotelRow(h) {
  const [label, col] = GUEST[h.guest];
  return `<a class="hotel" href="#" onclick="return false"><span class="h-ic">🏨</span><div class="h-main"><b>${esc(h.name)}</b><span class="muted">${'★'.repeat(h.stars)} · ${esc(h.areaName || '')} · ${h.score.toFixed(1)}/10</span><span class="h-note">${esc(h.note)}</span></div>
    <div class="h-guest"><span class="h-badge" style="color:${col};border-color:${col}">${label}${h.guest === 'fee' ? ' ฿' + h.fee.toLocaleString() : ''}</span></div>
    <div class="h-price"><span class="num"><b>฿${h.price.toLocaleString()}</b></span><span class="approx">${approx(h.price)} / night</span><span class="btn btn-ghost btn-sm">Book →</span></div></a>`;
}
