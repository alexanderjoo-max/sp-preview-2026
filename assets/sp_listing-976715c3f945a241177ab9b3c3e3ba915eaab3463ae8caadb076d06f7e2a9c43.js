/* SwanPass redesign — venue page interactions (ported from mockups/redesign/listing.html + sp.js).
   Gallery + full-screen viewer, safe view, contact buttons with a pre-filled message,
   review form (existing POST /listing/:id/reviews), helpful votes, more reviews, scroll-spy, map. */
(function () {
  'use strict';
  var U = window.SPUI, P = window.SP_PDP;
  if (!U || !P) return;
  var $ = U.$, $$ = U.$$, esc = U.esc, icon = U.icon;
  var token = function () { return ($('meta[name="csrf-token"]') || {}).content; };
  var SETS = { venue: P.sets.venue || [], staff: P.sets.staff || [] };
  var safeToggle = function () { return '<label class="safe-toggle"><input type="checkbox" class="switch" data-safe-toggle ' + (U.getSafe() ? 'checked' : '') + '> Safe view</label>'; };

  /* ---------- gallery: grid of all photos -> full-screen viewer ---------- */
  function openGallery(tab, index) {
    var m = U.openModal('gal', '', 'full gal');
    var tabs = Object.keys(SETS).filter(function (k) { return SETS[k].length; });
    if (tabs.indexOf(tab) < 0) tab = tabs[0];
    if (index === undefined) index = null;
    var safe = function () { return document.body.classList.contains('safe'); };
    function head() {
      return '<div class="gal-head"><div class="chips">' + tabs.map(function (k) { return '<button class="chip ' + (k === tab ? 'on' : '') + '" data-gtab="' + k + '">' + (k === 'venue' ? 'Venue' : 'Staff') + ' · ' + SETS[k].length + '</button>'; }).join('') + '</div>' +
        (tab === 'staff' ? safeToggle() : '') + (index != null ? '<button class="btn btn-ghost btn-sm" data-ggrid>' + icon('grid') + ' All photos</button>' : '') +
        '<button class="icon-btn" data-close aria-label="Close gallery">' + icon('close') + '</button></div>';
    }
    function grid() {
      return '<div class="gal-grid">' + SETS[tab].map(function (u, i) {
        var blur = tab === 'staff' && safe();
        return '<button class="gal-th ' + (blur ? 'blur' : '') + '" data-gi="' + i + '" aria-label="Photo ' + (i + 1) + '"><img src="' + esc(u) + '" alt="" loading="lazy">' + (blur ? '<span class="g-reveal">' + icon('eye') + '</span>' : '') + '</button>';
      }).join('') + '</div>';
    }
    function viewer() {
      return '<div class="gal-view"><div class="gal-track" id="gal-track">' + SETS[tab].map(function (u) { return '<div class="gal-slide"><img src="' + esc(u) + '" alt="" loading="lazy"></div>'; }).join('') + '</div>' +
        '<button class="gal-nav prev" data-gstep="-1" aria-label="Previous photo">‹</button><button class="gal-nav next" data-gstep="1" aria-label="Next photo">›</button><span class="gal-n num" id="gal-n"></span></div>';
    }
    function draw() {
      m.innerHTML = head() + (index == null ? grid() : viewer());
      if (index != null) {
        var tr = $('#gal-track', m); tr.scrollLeft = index * tr.clientWidth;
        var upd = function () { index = Math.round(tr.scrollLeft / tr.clientWidth); $('#gal-n', m).textContent = (index + 1) + ' / ' + SETS[tab].length; };
        tr.addEventListener('scroll', upd, { passive: true }); upd();
      }
    }
    function go(d) { var tr = $('#gal-track', m); if (!tr) return; var n = Math.max(0, Math.min(SETS[tab].length - 1, index + d)); tr.scrollTo({ left: n * tr.clientWidth, behavior: 'smooth' }); }
    m.addEventListener('change', function (e) { if (e.target.matches('[data-safe-toggle]')) setTimeout(draw); });
    m.onclick = function (e) {
      var t = e.target.closest('[data-gtab]'); if (t) { tab = t.dataset.gtab; index = null; draw(); return; }
      if (e.target.closest('[data-ggrid]')) { index = null; draw(); return; }
      var s = e.target.closest('[data-gstep]'); if (s) { go(+s.dataset.gstep); return; }
      var th = e.target.closest('[data-gi]'); if (th) { if (th.classList.contains('blur')) { th.classList.remove('blur'); return; } index = +th.dataset.gi; draw(); }
    };
    var key = function (e) { if (!m.classList.contains('open')) return document.removeEventListener('keydown', key); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    document.addEventListener('keydown', key);
    draw();
  }
  document.addEventListener('click', function (e) {
    var og = e.target.closest('[data-open-gal]'); if (og) { openGallery(og.dataset.openGal); return; }
    var s = e.target.closest('.staff, .gallery button'); if (!s) return;
    e.preventDefault();
    if ((s.classList.contains('staff') || s.classList.contains('g-staff')) && document.body.classList.contains('safe') && !s.classList.contains('revealed')) { s.classList.add('revealed'); return; }
    openGallery(s.dataset.set || 'staff', +(s.dataset.i || 0));
  });
  var gal = $('#gallery');
  if (gal) gal.addEventListener('scroll', function (e) { var i = Math.round(e.target.scrollLeft / e.target.clientWidth) + 1; var c = $('.gal-count'); if (c) c.textContent = i + ' / ' + gal.children.length; });

  /* ---------- contact buttons: open the app with a short pre-filled message ----------
     WhatsApp, SMS and LINE official accounts (@id) support pre-fill. LINE personal IDs, Telegram,
     WeChat, Zalo and KakaoTalk don't, so we open the chat and copy the message to the clipboard. */
  var contactMsg = function (name) { return 'Hi! I saw ' + name + ' on SwanPass.com and would like to ask a question.'; };
  function contactHref(ch, v, name) {
    var t = encodeURIComponent(contactMsg(name)), num = String(v).replace(/[^\d]/g, '').replace(/^0/, '66');
    return {
      whatsapp: 'https://wa.me/' + num + '?text=' + t,
      line: v.charAt(0) === '@' ? 'https://line.me/R/oaMessage/' + encodeURIComponent(v) + '/?' + t : 'https://line.me/ti/p/~' + v,
      telegram: 'https://t.me/' + v.replace('@', ''),
      sms: 'sms:+' + num + (/iPhone|iPad/.test(navigator.userAgent) ? '&' : '?') + 'body=' + t,
      phone: 'tel:+' + num,
      zalo: 'https://zalo.me/' + num,
      kakao: 'https://open.kakao.com/o/' + v,
      wechat: 'weixin://dl/chat?' + v
    }[ch];
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-contact]'); if (!a) return;
    var ch = a.dataset.contact, v = a.dataset.value, name = a.dataset.venue || 'your venue';
    a.href = contactHref(ch, v, name);
    var prefilled = ch === 'whatsapp' || ch === 'sms' || (ch === 'line' && v.charAt(0) === '@');
    if (!prefilled && ch !== 'phone') {
      try { navigator.clipboard.writeText(contactMsg(name)); } catch (err) { /* clipboard blocked */ }
      U.toast('Message copied — paste it in the chat');
    }
    if (window.dataLayer) window.dataLayer.push({ event: 'venue_contact', channel: ch, venue: P.slug });
    track(ch);
  });
  /* owner dashboard counts (no personal data) */
  function track(kind) {
    var url = '/sp-preview-2026/listing/' + P.slug + '/event?kind=' + encodeURIComponent(kind);
    if (navigator.sendBeacon) navigator.sendBeacon(url); else fetch(url, { method: 'POST', keepalive: true });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href*="google.com/maps"]'); if (a) track('directions');
    var w = e.target.closest('#hours a[href^="http"]:not([data-contact])'); if (w) track('website');
  });

  /* ---------- review your visit (existing endpoint; new optional fields) ---------- */
  var TAGS = [['🗣️', 'English-speaking staff'], ['🌙', 'Open until dawn'], ['✅', 'No hidden fees'], ['💳', 'Card accepted'], ['🏨', 'Guest-friendly hotel nearby'], ['💰', 'Value for money'], ['⚠️', 'Charged extra']];
  var COUNTRIES = [['GB', '🇬🇧 UK'], ['US', '🇺🇸 USA'], ['AU', '🇦🇺 Australia'], ['DE', '🇩🇪 Germany'], ['CA', '🇨🇦 Canada'], ['', 'Other / hide']];
  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-review]')) return;
    if (!P.signedIn) { location.href = '/sp-preview-2026/users/sign_in'; return; }
    var m = U.openModal('rv', '<div class="modal-head"><h3 style="flex:1">Review your visit to ' + esc(P.name) + '</h3><button class="icon-btn" data-close aria-label="Close">' + icon('close') + '</button></div>' +
      '<div class="modal-body rv-form">' +
        '<label>How was it?</label><div class="stars-in">' + [1, 2, 3, 4, 5].map(function (n) { return '<button data-star="' + n + '">★</button>'; }).join('') + '</div>' +
        '<label>What did you pay? <span class="muted" style="font-weight:500">(helps the next visitor)</span></label><div class="row" style="gap:8px"><input class="input" id="rv-paid" inputmode="numeric" placeholder="฿2,400" style="max-width:140px"><span class="muted" style="font-size:13px">incl. tip?</span><div class="seg" id="rv-tip"><button class="on" data-v="0">No</button><button data-v="1">Yes</button></div></div>' +
        '<label>Was it…</label><div class="chips" style="flex-wrap:wrap" id="rv-tags">' + TAGS.map(function (t) { return '<button class="chip" data-tag="' + esc(t[1]) + '">' + t[0] + ' ' + t[1] + '</button>'; }).join('') + '</div>' +
        '<label>Your visit</label><div class="row" style="gap:8px;flex-wrap:wrap"><div class="seg" id="rv-visit"><button class="on" data-v="First visit">First visit</button><button data-v="Been before">Been before</button><button data-v="Regular">Regular</button></div>' +
          '<select class="select" id="rv-country">' + COUNTRIES.map(function (c) { return '<option value="' + c[0] + '">' + c[1] + '</option>'; }).join('') + '</select></div>' +
        '<label>Tell the story <span class="muted" style="font-weight:500">(300+ characters becomes a Trip report)</span></label><textarea class="input" id="rv-text" rows="4" style="width:100%;height:auto;padding:10px" placeholder="When you went, what you chose, how it went…"></textarea>' +
        '<p class="muted" id="rv-err" style="color:var(--red);margin:8px 0 0"></p>' +
      '</div><div class="sheet-foot"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-red" style="flex:1" data-post>Post review</button></div>');
    var stars = 0;
    m.addEventListener('click', function (ev) {
      var st = ev.target.closest('[data-star]'); if (st) { stars = +st.dataset.star; $$('[data-star]', m).forEach(function (b) { b.classList.toggle('on', +b.dataset.star <= stars); }); return; }
      var sg = ev.target.closest('.seg button'); if (sg) { $$('button', sg.parentNode).forEach(function (b) { b.classList.toggle('on', b === sg); }); return; }
      var tg = ev.target.closest('[data-tag]'); if (tg) { tg.classList.toggle('on'); return; }
      if (!ev.target.closest('[data-post]')) return;
      var text = $('#rv-text', m).value.trim(), err = $('#rv-err', m);
      if (!stars) { err.textContent = 'Pick a star rating.'; return; }
      if (text.length < 20) { err.textContent = 'Tell the next visitor a little more (20+ characters).'; return; }
      var paid = parseInt($('#rv-paid', m).value.replace(/[^\d]/g, ''), 10);
      var body = { review: {
        rating: stars, message: text, title: text.length > 60 ? text.slice(0, 57) + '…' : text, name: P.userName || 'Member',
        paid_amount: isNaN(paid) ? null : paid, paid_incl_tip: $('#rv-tip .on', m).dataset.v === '1',
        tags: $$('[data-tag].on', m).map(function (b) { return b.dataset.tag; }),
        visit_type: $('#rv-visit .on', m).dataset.v, reviewer_country: $('#rv-country', m).value || null
      } };
      fetch('/sp-preview-2026/listing/' + P.slug + '/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-CSRF-Token': token() }, body: JSON.stringify(body) })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (!res.ok) { err.textContent = (res.d.errors || ['Could not post your review.']).join(' '); return; }
          U.closeAll(); U.toast('Thanks — your review is live'); setTimeout(function () { location.reload(); }, 900);
        });
    });
  });

  /* ---------- helpful votes + more reviews (existing endpoints) ---------- */
  document.addEventListener('click', function (e) {
    var h = e.target.closest('[data-helpful]');
    if (h && !h.disabled) {
      h.disabled = true;
      fetch('/sp-preview-2026/listing/' + P.slug + '/reviews/' + h.dataset.helpful + '/helpful', { method: 'POST', headers: { Accept: 'application/json', 'X-CSRF-Token': token() } })
        .then(function (r) { return r.ok ? r.json() : null; }).then(function (d) { if (d) $('span', h).textContent = d.helpful; });
      return;
    }
    var more = e.target.closest('[data-more-reviews]'); if (!more) return;
    var page = +more.dataset.page;
    fetch('/sp-preview-2026/listing/' + P.slug + '/reviews?page=' + page, { headers: { Accept: 'application/json' } }).then(function (r) { return r.json(); }).then(function (d) {
      var html = (d.resources || []).filter(function (r) { return !document.querySelector('[data-helpful="' + r.id + '"]'); }).map(function (r) {
        var n = Math.round(r.rating || 0);
        return '<div class="review"><div class="who"><span class="av">' + esc((r.display_name || '').slice(0, 2)) + '</span><span>' + esc(r.display_name) + '<div class="muted" style="font-size:12px;font-weight:500">' + new Date(r.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) + '</div></span><span class="stars" style="margin-left:auto">' + '★'.repeat(n) + '☆'.repeat(5 - n) + '</span></div><p>' + esc(r.message) + '</p><div class="muted" style="font-size:12.5px;margin-top:4px"><button class="muted" data-helpful="' + r.id + '">Helpful (<span>' + (r.helpful || 0) + '</span>)</button></div></div>';
      }).join('');
      more.insertAdjacentHTML('beforebegin', html);
      if (!d.meta || page >= d.meta.total_pages) more.remove(); else more.dataset.page = page + 1;
    });
  });

  /* ---------- member actions: check in, add to list, message the venue, Q&A ---------- */
  var post = function (url, data, method) {
    return fetch(url, { method: method || 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-CSRF-Token': token() }, body: JSON.stringify(data || {}) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); });
  };
  var needLogin = function () { if (!P.signedIn) { location.href = '/sp-preview-2026/users/sign_in'; return true; } return false; };
  var close = function () { return '<button class="icon-btn" data-close aria-label="Close">' + icon('close') + '</button>'; };

  document.addEventListener('click', function (e) {
    var ci = e.target.closest('[data-checkin]');
    if (ci) {
      if (needLogin()) return;
      var sendCheckin = function (onSite) {
        post('/sp-preview-2026/listing/' + P.slug + '/checkin', { on_site: onSite }).then(function (res) {
          if (res.d.already) { ci.textContent = '✓ Checked in today'; return; }
          ci.textContent = '✓ Checked in'; ci.classList.add('on');
          var lv = res.d.level, nx = res.d.next;
          U.openModal('ci', '<div class="modal-head"><h3 style="flex:1">' + (res.d.level_up ? 'Level up!' : 'Checked in') + '</h3>' + close() + '</div>' +
            '<div class="modal-body" style="text-align:center"><div style="font-size:64px;line-height:1">' + lv[1] + '</div>' +
            '<h2 style="margin:10px 0 4px">' + (res.d.level_up ? 'You’re now a ' + esc(lv[2]) + '!' : res.d.count + ' check-ins') + '</h2>' +
            '<p class="muted" style="margin:0">' + (nx ? (nx[0] - res.d.count) + ' more to become ' + nx[1] + ' ' + esc(nx[2]) : 'You’re at the top. Respect.') + '</p>' +
            '<p style="margin:18px 0 0"><a class="btn btn-red" href="#reviews" data-close>How was ' + esc(P.name) + '? Write a review</a></p>' +
            '<p class="muted" style="font-size:12px;margin:12px 0 0">Only you can see your check-ins.' + (onSite ? ' 📍 Checked in on site.' : '') + '</p></div>');
        });
      };
      /* on-site mark only when the phone shares a location within ~300 m of the venue */
      var mapEl = $('#pdp-map');
      if (navigator.geolocation && mapEl) {
        navigator.geolocation.getCurrentPosition(function (pos) {
          var dLat = (pos.coords.latitude - +mapEl.dataset.lat) * 111000, dLng = (pos.coords.longitude - +mapEl.dataset.lng) * 111000 * Math.cos(pos.coords.latitude * Math.PI / 180);
          sendCheckin(Math.hypot(dLat, dLng) < 300);
        }, function () { sendCheckin(false); }, { timeout: 5000, maximumAge: 60000 });
      } else sendCheckin(false);
      return;
    }

    if (e.target.closest('[data-addlist]')) {
      if (needLogin()) return;
      var m = U.openModal('al', '<div class="modal-head"><h3 style="flex:1">Add to a list</h3>' + close() + '</div><div class="modal-body">' +
        (P.lists || []).map(function (l) { return '<label class="fcheck" style="padding:10px 0"><input type="checkbox" data-list="' + l.id + '" ' + (l.has ? 'checked' : '') + '><b>' + esc(l.name) + '</b></label>'; }).join('') +
        '<div class="row" style="gap:8px;margin-top:12px"><input class="input" id="al-new" placeholder="New list name…" style="flex:1"><button class="btn btn-ghost btn-sm" id="al-create">Create</button></div>' +
        '<label style="display:block;margin-top:14px;font-size:13px;font-weight:600">Private note</label><input class="input" id="al-note" placeholder="e.g. ask for the deal, go before 6pm" style="width:100%;margin-top:6px"></div>' +
        '<div class="sheet-foot"><button class="btn btn-red" style="flex:1" data-close>Done</button></div>');
      m.addEventListener('change', function (ev) {
        var cb = ev.target.closest('[data-list]'); if (!cb) return;
        var l = (P.lists || []).filter(function (x) { return String(x.id) === cb.dataset.list; })[0]; if (l) l.has = cb.checked;
        if (cb.checked) post('/sp-preview-2026/account/lists/' + cb.dataset.list + '/add', { listing_id: P.listingId, note: $('#al-note', m).value || undefined });
        else post('/sp-preview-2026/account/lists/' + cb.dataset.list + '/remove', { listing_id: P.listingId }, 'DELETE');
      });
      $('#al-create', m).onclick = function () {
        var name = $('#al-new', m).value.trim(); if (!name) return;
        post('/sp-preview-2026/account/lists', { name: name, listing_id: P.listingId }).then(function (res) { P.lists = (P.lists || []).concat([{ id: res.d.id, name: res.d.name, has: true }]); U.closeAll(); U.toast('Added to “' + name + '”'); });
      };
      return;
    }

    if (e.target.closest('[data-msg]')) {
      if (needLogin()) return;
      var mm = U.openModal('msg', '<div class="modal-head"><h3 style="flex:1">Message ' + esc(P.name) + '</h3>' + close() + '</div>' +
        '<div class="modal-body rv-form"><label style="margin-top:0">About</label><div class="chips" style="flex-wrap:wrap">' + (P.topics || []).map(function (t, i) { return '<button class="chip ' + (i ? '' : 'on') + '" data-topic>' + esc(t) + '</button>'; }).join('') + '</div>' +
        '<label>Message</label><textarea class="input" id="msg-body" rows="4" style="width:100%;height:auto;padding:10px" placeholder="Hi! I saw ' + esc(P.name) + ' on SwanPass…"></textarea>' +
        '<p class="muted" style="font-size:13px;margin:10px 0 0">Replies arrive in your SwanPass inbox, and we email you when one comes in.</p>' +
        '<p class="muted" style="font-size:12.5px;margin:12px 0 0">The venue is notified by email and replies here. Your phone number isn’t shared.</p></div>' +
        '<div class="sheet-foot"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-red" style="flex:1" data-sendmsg>Send message</button></div>');
      mm.onclick = function (ev) {
        var t = ev.target.closest('[data-topic]'); if (t) { $$('[data-topic]', mm).forEach(function (x) { x.classList.toggle('on', x === t); }); return; }
        if (!ev.target.closest('[data-sendmsg]')) return;
        var body = $('#msg-body', mm).value.trim(); if (!body) return;
        post('/sp-preview-2026/listing/' + P.slug + '/message', { topic: $('[data-topic].on', mm).textContent, body: body }).then(function (res) {
          if (!res.ok) { U.toast((res.d.errors || ['Could not send.']).join(' ')); return; }
          U.closeAll(); U.toast('Sent — ' + P.name + ' has been notified. Replies appear in your account.');
        });
      };
      return;
    }

    var ask = e.target.closest('[data-ask]'), ans = e.target.closest('[data-answer]');
    if (ask || ans) {
      if (needLogin()) return;
      var qm = U.openModal('ask', '<div class="modal-head"><h3 style="flex:1">' + (ask ? 'Ask a question' : 'Answer') + '</h3>' + close() + '</div>' +
        '<div class="modal-body rv-form"><label style="margin-top:0">' + (ask ? 'Your question about ' + esc(P.name) : 'Your answer') + '</label><textarea class="input" id="qa-body" rows="3" style="width:100%;height:auto;padding:10px" placeholder="' + (ask ? 'e.g. Do they take cards? Is it busy on Friday nights?' : 'What you know from your visit…') + '"></textarea>' +
        '<p class="muted" style="font-size:12.5px;margin:10px 0 0">Public. No phone numbers, prices for “extras” or personal info — those are removed.</p></div>' +
        '<div class="sheet-foot"><button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-red" style="flex:1" data-postqa>Post</button></div>');
      $('[data-postqa]', qm).onclick = function () {
        var body = $('#qa-body', qm).value.trim(); if (!body) return;
        var url = ask ? '/sp-preview-2026/listing/' + P.slug + '/questions' : '/questions/' + ans.dataset.answer + '/answers';
        post(url, { body: body }).then(function (res) {
          if (!res.ok) { U.toast((res.d.errors || ['Could not post.']).join(' ')); return; }
          U.closeAll(); U.toast('Posted'); setTimeout(function () { location.hash = '#qa'; location.reload(); }, 600);
        });
      };
    }
  });

  /* ---------- share + copy address ---------- */
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-share]')) {
      if (navigator.share) navigator.share({ title: P.name, url: location.href }).catch(function () {});
      else { try { navigator.clipboard.writeText(location.href); } catch (err) { /* */ } U.toast('Link copied'); }
    }
    var c = e.target.closest('[data-copy]'); if (c) { try { navigator.clipboard.writeText(c.dataset.copy); } catch (err) { /* */ } U.toast('Address copied'); }
  });

  /* ---------- scroll-spy for the anchor chips ---------- */
  var links = $$('#anchors a');
  if ('IntersectionObserver' in window && links.length) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id); }); }); }, { rootMargin: '-40% 0px -55% 0px' });
    $$('.blk, #nearby').forEach(function (s) { io.observe(s); });
  }

  /* ---------- long descriptions fold behind "Read more" ---------- */
  var about = $('#about-text'), more = $('#about-more');
  if (about && more && about.scrollHeight > 320) {
    about.classList.add('clamped'); more.hidden = false;
    more.onclick = function () { var c = about.classList.toggle('clamped'); more.textContent = c ? 'Read more ▾' : 'Show less ▴'; };
  }

  /* ---------- map ---------- */
  function initMap() {
    var el = $('#pdp-map'); if (!el || !window.L) return;
    var lat = +el.dataset.lat, lng = +el.dataset.lng;
    var map = L.map(el, { scrollWheelZoom: false, zoomControl: false }).setView([lat, lng], 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
    L.marker([lat, lng], { icon: L.divIcon({ className: '', html: '<div style="width:46px;height:46px;border-radius:50%;border:3px solid var(--red);overflow:hidden;box-shadow:0 0 0 6px rgba(255,59,82,.25);background:var(--surface-2)">' + (el.dataset.img ? '<img src="' + esc(el.dataset.img) + '" style="width:100%;height:100%;object-fit:cover">' : '') + '</div>', iconSize: [46, 46], iconAnchor: [23, 23] }) }).addTo(map);
  }
  if (window.L) initMap(); else window.addEventListener('load', initMap);
})();
