/* SwanPass redesign — interactive parts of the shared UI (ported from mockups/redesign/assets/sp.js).
   Page content is rendered by Rails; this file only drives: drawer, "More" menu, search panel +
   location chooser, save buttons, footer language/currency pickers, age gate and cookie bar.
   Data comes from window.SP (rendered by shared/sp/_data). Location is a cookie so Rails can read it. */
(function () {
  'use strict';
  var SP = window.SP || { countries: [], cities: [], contact: {} };
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return [].slice.call((el || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>'
  };
  if (SP.icons) ICONS = SP.icons;
  var icon = function (n) { return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[n] || '') + '</svg>'; };
  var TICK = SP.tick || '';

  /* ---------- cookies ---------- */
  function getCookie(k) { var m = document.cookie.match('(?:^|; )' + k + '=([^;]*)'); return m ? decodeURIComponent(m[1]) : null; }
  function setCookie(k, v, days) { document.cookie = k + '=' + encodeURIComponent(v) + ';path=/;max-age=' + (days * 86400) + ';samesite=lax'; }

  /* ---------- location: cookie "sp_loc" = "th/bangkok" | "th" | "" (All of Asia) ---------- */
  var cityOf = function (slug) { return SP.cities.filter(function (c) { return c.slug === slug; })[0]; };
  var countryOf = function (code) { return SP.countries.filter(function (c) { return c.code === code; })[0]; };
  function getLoc() {
    var v = getCookie('sp_loc');
    if (v === null) { var home = cityOf(SP.homeCity || 'bangkok'); return home ? { country: home.country, city: home.slug } : { country: null, city: null }; }
    var p = v.split('/'); return { country: p[0] || null, city: p[1] || null, near: p[2] === 'near' };
  }
  function setLoc(loc) { setCookie('sp_loc', [loc.country || '', loc.city || '', loc.near ? 'near' : ''].join('/').replace(/\/+$/, ''), 365); }

  /* Pages can be cached, so the header pill is refreshed from the cookie in the browser. */
  function renderLocPill() {
    var loc = getLoc(), c = loc.city && cityOf(loc.city), co = loc.country && countryOf(loc.country);
    var label = c ? c.name : co ? co.name : 'All of Asia', flag = co ? co.flag : '🌏';
    $$('.loc-pill').forEach(function (p) { var t = $('.t', p), f = $('.flag', p); if (t) t.textContent = label; if (f) f.textContent = flag; });
  }
  renderLocPill();

  /* After picking a place: list pages stay put and reload for the new place; everywhere else goes to the place page. */
  function goPlace(loc) {
    if (document.body.dataset.spStay === '1') {
      /* list-type pages stay put and show the chosen place; the place is in the address so links can be shared */
      if (window.spStayUrl) { location.href = window.spStayUrl(loc); return; }
      var q = loc.city ? '?city=' + encodeURIComponent(loc.city) : loc.country ? '?city=&country=' + encodeURIComponent(loc.country) : '?city=';
      location.href = location.pathname + q; return;
    }
    if (loc.city) location.href = '/sp-preview-2026/cities/' + loc.city;
    else if (loc.country) location.href = '/sp-preview-2026/country/' + loc.country;
    else location.href = '/sp-preview-2026/listing?all=1';
  }

  /* ---------- drawer + "More" menu ---------- */
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-drawer]')) document.body.classList.add('drawer-open');
    if (e.target.closest('[data-drawer-close]') || e.target.closest('.drawer [data-open]')) document.body.classList.remove('drawer-open');
    $$('.nav-more[open]').forEach(function (d) { if (!d.contains(e.target)) d.removeAttribute('open'); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { document.body.classList.remove('drawer-open'); $$('.nav-more[open]').forEach(function (d) { d.removeAttribute('open'); }); closeAll(); }
    if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
  });

  /* ---------- modals ---------- */
  function ensureOverlay() {
    if ($('#sp-ov')) return;
    document.body.insertAdjacentHTML('beforeend', '<div class="overlay" id="sp-ov"></div>');
    $('#sp-ov').addEventListener('click', closeAll);
  }
  function openModal(id, html, cls) {
    ensureOverlay(); closeAll();
    var m = $('#' + id);
    if (!m) { document.body.insertAdjacentHTML('beforeend', '<div class="modal ' + (cls || '') + '" id="' + id + '" role="dialog" aria-modal="true"></div>'); m = $('#' + id); }
    m.innerHTML = '<div class="grabber"></div>' + html;
    requestAnimationFrame(function () { $('#sp-ov').classList.add('open'); m.classList.add('open'); });
    document.body.style.overflow = 'hidden';
    return m;
  }
  function closeAll() { $$('.modal.open').forEach(function (m) { m.classList.remove('open'); }); if ($('#sp-ov')) $('#sp-ov').classList.remove('open'); document.body.style.overflow = ''; }
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) { closeAll(); return; }
    var o = e.target.closest('[data-open]'); if (!o) return;
    e.preventDefault(); openSearch('', o.dataset.open === 'loc');
  });

  /* ---------- search panel + location chooser ---------- */
  function openSearch(prefill) {
    prefill = prefill || '';
    var loc = getLoc();
    var ctab = loc.country || 'th';
    var mstep = 'home';
    var m = openModal('sp-search',
      '<div class="modal-head">' + icon('search') + '<input id="ms-q" placeholder="Search venues, areas, services…" autocomplete="off" value="' + esc(prefill) + '">' +
      '<button class="icon-btn" data-close aria-label="Close">' + icon('close') + '</button></div>' +
      '<div class="ms-where" id="ms-where"></div><div class="modal-body" id="ms-body"></div>', 'full');
    var total = SP.countries.reduce(function (a, c) { return a + (c.count || 0); }, 0);

    function drawWhere() {
      var cur = getLoc(), co = countryOf(ctab) || SP.countries[0];
      var cities = SP.cities.filter(function (c) { return c.country === ctab; });
      var big = cities.filter(function (c) { return c.count >= 20; }), small = cities.filter(function (c) { return c.count < 20; });
      var top = SP.cities.filter(function (c) { return c.img && c.count > 0; }).sort(function (a, b) { return b.count - a.count; }).slice(0, 6);
      var cb = function (c, flag) {
        return '<button class="cb ' + (cur.city === c.slug ? 'on' : '') + '" data-city="' + c.slug + '">' + (c.img ? '<img src="' + c.img + '" alt="" loading="lazy">' : '') +
          '<span class="in"><b>' + (flag ? (countryOf(c.country) || {}).flag + ' ' : '') + esc(c.name) + '</b><small class="num">' + c.count + ' venues' + (!flag && c.deals ? ' · ' + c.deals + ' deals' : '') + '</small></span></button>';
      };
      $('#ms-where', m).innerHTML = '<div class="where2 step-' + mstep + '">' +
        '<div class="mtop"><div class="csmall-h" style="margin-top:0">Top cities</div><div class="cbig">' + top.map(function (c) { return cb(c, true); }).join('') + '</div><div class="csmall-h">All countries</div></div>' +
        '<nav class="cnav" aria-label="Country">' +
          '<button class="cn ' + (cur.near ? 'on' : '') + '" data-near><span class="fl">📍</span><span class="nm">Near me</span></button>' +
          '<button class="cn ' + (!cur.country ? 'on' : '') + '" data-allasia><span class="fl">🌏</span><span class="nm">All of Asia</span><span class="n num">' + total + '</span></button>' +
          '<div class="cn-sep"></div>' +
          SP.countries.map(function (c) {
            return '<button class="cn ' + (c.code === ctab ? 'sel' : '') + ' ' + (c.soon ? 'soon' : '') + '" data-ctab="' + c.code + '"><span class="fl">' + c.flag + '</span><span class="nm">' + esc(c.name) + '</span>' +
              (c.soon ? '<span class="soon-tag">Soon</span>' : '<span class="n num">' + c.count + '</span>') + '<span class="chev">›</span></button>';
          }).join('') +
        '</nav>' +
        '<section class="cpane"><div class="cpane-head"><button class="cback" data-cback>‹ All countries</button><div><b>' + co.flag + ' ' + esc(co.name) + '</b>' + (co.soon ? '' : '<span class="muted num"> · ' + co.count + ' venues</span>') + '</div>' +
          (co.soon ? '' : '<button class="link-arrow" data-allc="' + ctab + '">All of ' + esc(co.name) + '</button>') + '</div>' +
          (co.soon
            ? '<div class="soon-box"><b>' + esc(co.name) + ' is coming soon.</b><p class="muted">We’re adding venues now. Follow us on LINE <a href="' + SP.contact.lineUrl + '" target="_blank" rel="noopener" style="color:var(--gold)">' + SP.contact.line + '</a> to hear when it opens.</p></div>'
            : '<div class="cbig">' + big.map(function (c) { return cb(c, false); }).join('') + '</div>' +
              (small.length ? '<div class="csmall-h">More cities</div><div class="csmall">' + small.map(function (c) { return '<button class="cs ' + (cur.city === c.slug ? 'on' : '') + '" data-city="' + c.slug + '"><span>' + esc(c.name) + '</span><span class="muted num">' + c.count + '</span></button>'; }).join('') + '</div>' : '')) +
        '</section></div>';
    }
    drawWhere();

    m.addEventListener('click', function (e) {
      var t = e.target.closest('[data-ctab]'); if (t) { ctab = t.dataset.ctab; mstep = 'cities'; drawWhere(); return; }
      if (e.target.closest('[data-cback]')) { mstep = 'home'; drawWhere(); return; }
      var c = e.target.closest('[data-city]'); if (c) { var ci = cityOf(c.dataset.city); var l = { country: ci.country, city: ci.slug }; setLoc(l); goPlace(l); return; }
      var a = e.target.closest('[data-allc]'); if (a) { var lc = { country: a.dataset.allc, city: null }; setLoc(lc); goPlace(lc); return; }
      if (e.target.closest('[data-allasia]')) { setLoc({ country: null, city: null }); goPlace({}); return; }
      if (e.target.closest('[data-near]')) { nearMe(); }
    });

    var timer = null, seq = 0;
    function hit(l, q) {
      var name = esc(l.name);
      if (q) name = name.replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>');
      var tags = l.tags || [];
      return '<a class="ms-hit" href="' + l.page + '"><img src="' + esc(l.img) + '" alt="" loading="lazy"><div><div class="t">' + name + ' ' + (tags.indexOf('verified') > -1 ? TICK : '') + '</div>' +
        '<div class="s">' + esc(l.cat_name || '') + ' · ' + esc(l.district || l.city || '') + (l.promo && l.promo_msg ? ' · <span style="color:var(--deal)">' + esc(l.promo_msg) + '</span>' : '') + '</div></div></a>';
    }
    function draw(q) {
      q = q.trim();
      var body = $('#ms-body', m);
      if (!q) { body.innerHTML = ''; return; }
      var ql = q.toLowerCase();
      var places = SP.cities.filter(function (c) { return c.name.toLowerCase().indexOf(ql) > -1; })
        .map(function (c) { return { t: c.name, s: ((countryOf(c.country) || {}).name || '') + ' · city', h: '/sp-preview-2026/cities/' + c.slug }; });
      var head = places.length ? '<p class="ms-label">Places</p><div class="ms-chips">' + places.map(function (p) { return '<a class="chip" href="' + p.h + '">' + icon('pin') + esc(p.t) + ' <span class="muted">' + p.s + '</span></a>'; }).join('') + '</div>' : '';
      var foot = '<a class="btn btn-ghost btn-block" style="margin-top:14px" href="/sp-preview-2026/listing?all=1&query=' + encodeURIComponent(q) + '">See all results for “' + esc(q) + '”</a>';
      body.innerHTML = head + '<p class="ms-label">Venues</p><div class="ms-results"><p class="muted">Searching…</p></div>' + foot;
      clearTimeout(timer);
      var my = ++seq;
      timer = setTimeout(function () {
        fetch('/sp-preview-2026/listing?format=json&all=1&query=' + encodeURIComponent(q), { headers: { Accept: 'application/json' } })
          .then(function (r) { return r.ok ? r.json() : { resources: [] }; })
          .catch(function () { return { resources: [] }; })
          .then(function (d) {
            if (my !== seq) return;
            var cur = getLoc();
            var list = (d.resources || []).sort(function (a, b) {
              var ta = a.featured ? 0 : a.verified ? 1 : 2, tb = b.featured ? 0 : b.verified ? 1 : 2;
              return ta - tb || ((b.regions || []).indexOf((cityOf(cur.city) || {}).name) > -1) - ((a.regions || []).indexOf((cityOf(cur.city) || {}).name) > -1);
            }).slice(0, 8);
            var res = $('.ms-results', body); if (!res) return;
            res.innerHTML = list.map(function (l) { return hit(l, q); }).join('') || '<p class="muted">No venues match “' + esc(q) + '”.</p>';
          });
      }, 200);
    }
    draw(prefill);
    $('#ms-q', m).addEventListener('input', function (e) { draw(e.target.value); });
    $('#ms-q', m).addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.value.trim()) location.href = '/sp-preview-2026/listing?all=1&query=' + encodeURIComponent(e.target.value.trim()); });
    setTimeout(function () { $('#ms-q', m).focus(); }, 50);
  }

  /* Near me: nearest city with venues */
  function nearMe() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(function (pos) {
      var best = null, bd = 1e9;
      SP.cities.forEach(function (c) {
        if (c.lat == null || !c.count) return;
        var d = Math.hypot(c.lat - pos.coords.latitude, c.lng - pos.coords.longitude);
        if (d < bd) { bd = d; best = c; }
      });
      if (!best) return;
      var l = { country: best.country, city: best.slug, near: true }; setLoc(l); goPlace(l);
    });
  }

  /* ---------- save (heart) on cards: existing POST /listing/:id/favorite ---------- */
  document.addEventListener('click', function (e) {
    var s = e.target.closest('[data-save]'); if (!s) return;
    e.preventDefault(); e.stopPropagation();
    if (!SP.signedIn) { location.href = '/sp-preview-2026/users/sign_in'; return; }
    var token = ($('meta[name="csrf-token"]') || {}).content;
    fetch('/sp-preview-2026/listing/' + s.dataset.save + '/favorite', { method: 'POST', headers: { 'X-CSRF-Token': token, Accept: 'application/json' } })
      .then(function (r) { if (r.ok) s.classList.toggle('on'); });
  });

  /* ---------- footer pickers: language (page translator) + currency ---------- */
  var LANGS = [['en', '🇬🇧', 'English'], ['de', '🇩🇪', 'Deutsch'], ['fr', '🇫🇷', 'Français'], ['es', '🇪🇸', 'Español'], ['ru', '🇷🇺', 'Русский'], ['zh-CN', '🇨🇳', '中文'], ['ja', '🇯🇵', '日本語'], ['ko', '🇰🇷', '한국어'], ['th', '🇹🇭', 'ไทย'], ['vi', '🇻🇳', 'Tiếng Việt']];
  var CUR = SP.currencies || {};
  function getLang() { var m = (getCookie('googtrans') || '').match(/^\/en\/(.+)$/); return m ? m[1] : 'en'; }
  function setLang(code) {
    var expire = code === 'en' ? 'expires=Thu, 01 Jan 1970 00:00:00 GMT;' : '';
    document.cookie = 'googtrans=/en/' + code + ';path=/;' + expire;
    document.cookie = 'googtrans=/en/' + code + ';path=/;domain=' + location.hostname + ';' + expire;
    location.reload();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-pick]'); if (!b) return;
    var lang = b.dataset.pick === 'lang';
    var curCode = getCookie('sp_cur') || 'USD';
    var items = lang ? LANGS.map(function (l) { return [l[0], l[1] + ' ' + l[2], getLang() === l[0]]; })
      : Object.keys(CUR).map(function (k) { return [k, k === 'NONE' ? '฿ THB — baht only' : CUR[k][0] + ' ' + k + ' — baht + ≈ ' + k, curCode === k]; });
    var m = openModal('pick', '<div class="modal-head"><h3 style="flex:1">' + (lang ? 'Language' : 'Show prices in') + '</h3><button class="icon-btn" data-close aria-label="Close">' + icon('close') + '</button></div>' +
      '<div class="modal-body"><div class="pick-grid">' + items.map(function (i) { return '<button class="pick ' + (i[2] ? 'on' : '') + '" data-set-' + (lang ? 'lang' : 'cur') + '="' + i[0] + '">' + i[1] + (i[2] ? ' ✓' : '') + '</button>'; }).join('') + '</div>' +
      (lang ? '' : '<p class="muted" style="font-size:12.5px;margin:14px 0 0">Venues are always priced in local currency. The ≈ amount uses today’s rate.</p>') + '</div>');
    m.addEventListener('click', function (ev) {
      var l = ev.target.closest('[data-set-lang]'), c = ev.target.closest('[data-set-cur]');
      if (l) setLang(l.dataset.setLang);
      if (c) { setCookie('sp_cur', c.dataset.setCur, 365); location.reload(); }
    });
  });

  /* ---------- Safe view: staff photos blurred until tapped. One remembered setting (cookie "sp_safe"). ---------- */
  function getSafe() { return getCookie('sp_safe') !== '0'; }
  function applySafe() {
    var on = getSafe();
    document.body.classList.toggle('safe', on);
    if (on) $$('.revealed').forEach(function (e) { e.classList.remove('revealed'); });
    $$('[data-safe-toggle]').forEach(function (i) { i.checked = on; });
  }
  document.addEventListener('change', function (e) {
    if (e.target.matches('[data-safe-toggle]')) { setCookie('sp_safe', e.target.checked ? '1' : '0', 365); applySafe(); }
  });
  applySafe();

  /* ---------- age gate (same "ageOk" cookie as the old site, 1 day) ---------- */
  var gate = $('#agegate');
  if (gate) {
    if (getCookie('ageOk')) gate.remove();
    else $('#age-yes').addEventListener('click', function () { setCookie('ageOk', '1', 1); gate.remove(); });
  }

  /* ---------- cookie consent (PDPA): essential always; analytics only after "Accept all" ---------- */
  function cookieBar(force) {
    if (!force && getCookie('sp_consent')) return;
    var old = $('#cookie-bar'); if (old) old.remove();
    document.body.insertAdjacentHTML('beforeend', '<div class="cookie-bar" id="cookie-bar" role="dialog" aria-label="Cookies">' +
      '<p>We use essential cookies to make SwanPass work (age check, login, your settings). With your OK we also use analytics cookies to see which pages help people. No advertising cookies. <a href="/sp-preview-2026/privacy-policy#cookies">Details</a></p>' +
      '<div class="cb-btns"><button class="btn btn-ghost btn-sm" data-consent="essential">Essential only</button><button class="btn btn-red btn-sm" data-consent="all">Accept all</button></div></div>');
  }
  document.addEventListener('click', function (e) {
    var c = e.target.closest('[data-consent]');
    if (c) {
      setCookie('sp_consent', c.dataset.consent + '|' + new Date().toISOString(), 365);
      $('#cookie-bar').remove();
      if (c.dataset.consent === 'all' && window.spLoadAnalytics) window.spLoadAnalytics();
    }
    if (e.target.closest('[data-cookie-settings]')) { e.preventDefault(); cookieBar(true); }
  });
  cookieBar(false);

  function toast(text) {
    var t = $('#toast') || document.body.appendChild(Object.assign(document.createElement('div'), { id: 'toast', className: 'toast' }));
    t.textContent = text; t.classList.add('show'); setTimeout(function () { t.classList.remove('show'); }, 2500);
  }

  window.spOpenSearch = openSearch;
  window.SPUI = { getSafe: getSafe, $: $, $$: $$, esc: esc, icon: icon, openModal: openModal, closeAll: closeAll, toast: toast, getCookie: getCookie, setCookie: setCookie };
})();
