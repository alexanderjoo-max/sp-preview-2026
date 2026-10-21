/* SwanPass redesign — map (ported from mockups/redesign/map.html).
   Featured venues use their photo as the pin, Verified a blue tick; neither is ever clustered.
   List (desktop) and swipe cards (phones) follow the Featured -> Verified -> rest order. */
(function () {
  'use strict';
  var U = window.SPUI, D = window.SP_MAP;
  if (!U || !D || !window.L) return;
  var $ = U.$, $$ = U.$$, esc = U.esc, icon = U.icon, TICK = (window.SP || {}).tick || '';
  var STAR = '<svg class="star" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3L2.8 9.5l6.4-.9L12 2.8Z"/></svg>';
  var map = L.map('map', { zoomControl: false, maxZoom: 16 }).setView([13.735, 100.565], 13);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', { attribution: 'Map © Esri', maxZoom: 16 }).addTo(map);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16 }).addTo(map);
  var cluster = L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 46 });
  var top = L.layerGroup();
  map.addLayer(cluster); map.addLayer(top);
  var markers = {};
  var href = function (l) { return '/sp-preview-2026/listing/' + l.slug; };
  var rating = function (l) { return '<span class="rating">' + STAR + (l.rating ? l.rating.toFixed(1) : '—') + '</span>'; };
  /* popup: photo (badges, save, price), name, rating + reviews, category/area, open state, deal, View + Directions */
  function pop(l) {
    var badges = (l.featured ? '<span class="badge b-feat">★ Featured</span>' : '') + (l.verified ? '<span class="badge b-ver">✓ Verified</span>' : '') + (l.newly ? '<span class="badge b-new">New</span>' : '');
    var open = l.open === null || l.open === undefined ? '' : '<span><span class="open-dot ' + (l.open ? '' : 'closed') + '"></span>' + (l.open ? 'Open now' : (l.opens ? 'Opens ' + esc(l.opens) : 'Closed now')) + '</span>';
    var dir = l.dir || ('https://www.google.com/maps/dir/?api=1&destination=' + l.lat + ',' + l.lng);
    return '<div class="pop">' +
      '<a class="pop-media" href="' + href(l) + '"><img src="' + esc(l.img) + '" alt=""><span class="pop-badges">' + badges + '</span>' + (l.price ? '<span class="card-price num"><small>from</small> ' + esc(l.price) + '</span>' : '') + '</a>' +
      '<button class="card-save ' + (l.saved ? 'on' : '') + '" data-save="' + esc(l.slug) + '" aria-label="Save">' + icon('heart') + '</button>' +
      '<div class="pop-body"><a class="pop-title" href="' + href(l) + '">' + esc(l.name) + (l.verified ? TICK : '') + '</a>' +
      '<div class="card-meta">' + (l.rating ? rating(l) + '<span class="num">(' + l.reviews + ')</span>' : '<span>No reviews yet</span>') + '<span class="dot"></span><span>' + esc(l.cat || '') + '</span></div>' +
      '<div class="card-meta">' + open + (open ? '<span class="dot"></span>' : '') + '<span>' + icon('pin') + esc(l.area || '') + '</span></div>' +
      (l.deal ? '<div class="card-deal">' + icon('tag') + esc(l.deal) + '</div>' : '') +
      '<div class="pop-actions"><a class="btn btn-red btn-sm" href="' + href(l) + '">View venue</a><a class="btn btn-ghost btn-sm" href="' + esc(dir) + '" target="_blank" rel="noopener">' + icon('map') + ' Directions</a></div>' +
      '</div></div>';
  }
  function rowcard(l) {
    return '<a class="rowcard" data-slug="' + l.slug + '" href="' + href(l) + '"><img src="' + esc(l.img) + '" alt="" loading="lazy"><div style="min-width:0"><div class="card-title"><span>' + esc(l.name) + '</span>' + (l.verified ? TICK : '') + '</div>' +
      '<div class="card-meta">' + rating(l) + '<span>' + esc(l.cat || '') + '</span></div><div class="card-meta">' + (l.open === null || l.open === undefined ? '' : '<span class="open-dot ' + (l.open ? '' : 'closed') + '"></span>' + (l.open ? 'Open' : 'Closed') + ' · ') + esc(l.area || '') + '</div>' +
      (l.deal ? '<div class="card-deal" style="padding-top:4px">' + icon('tag') + esc(l.deal) + '</div>' : '') + '</div></a>';
  }
  /* phones: swipe cards over the map, synced with the pins */
  var PHONE = function () { return window.matchMedia('(max-width: 900px)').matches; };
  function mcard(l) {
    var open = l.open === null || l.open === undefined ? '' : '<span class="' + (l.open ? 'is-open' : 'is-closed') + '">' + (l.open ? 'Open now' : (l.opens ? 'Opens ' + esc(l.opens) : 'Closed')) + '</span><span class="dot"></span>';
    return '<a class="mcard" data-slug="' + esc(l.slug) + '" href="' + href(l) + '">' +
      '<span class="mc-media"><img src="' + esc(l.img) + '" alt="" loading="lazy">' +
        (l.featured ? '<span class="mc-badges"><span class="badge b-feat">★</span></span>' : '') +
        (l.price ? '<span class="mc-price num">' + esc(l.price) + '</span>' : '') +
        '<button type="button" class="card-save mc-save ' + (l.saved ? 'on' : '') + '" data-save="' + esc(l.slug) + '" aria-label="Save">' + icon('heart') + '</button></span>' +
      '<span class="mc-body"><span class="mc-title"><b>' + esc(l.name) + '</b>' + (l.verified ? TICK : '') + '</span>' +
        '<span class="mc-meta">' + (l.rating ? rating(l) + '<span class="num">(' + l.reviews + ')</span><span class="dot"></span>' : '') + '<span>' + esc(l.cat || '') + '</span></span>' +
        '<span class="mc-meta">' + open + '<span>' + esc(l.area || '') + '</span></span>' +
        (l.deal ? '<span class="mc-deal">' + icon('tag') + '<span>' + esc(l.deal) + '</span></span>' : '') + '</span>' +
      '</a>';
  }
  function focusCard(slug) {
    var c = $('#mcar .mcard[data-slug="' + slug + '"]');
    if (!c) { var v = D.venues.filter(function (x) { return x.slug === slug; })[0]; if (!v) return; $('#mcar').insertAdjacentHTML('afterbegin', mcard(v)); c = $('#mcar .mcard'); }
    $$('#mcar .mcard.on').forEach(function (x) { x.classList.remove('on'); }); c.classList.add('on');
    $('#mcar').scrollTo({ left: c.offsetLeft - 16, behavior: 'smooth' });
  }
  function withTierHeads(list) {
    var cur = -1, out = '';
    list.forEach(function (l) {
      if (l.tier !== cur && l.tier > 0) { cur = l.tier; var n = list.filter(function (x) { return x.tier === cur; }).length; out += '<div class="tier-head">' + ['<span class="badge b-feat">★ Featured</span>', '<span class="badge b-ver">✓ Verified</span>', 'More venues'][cur] + '<small class="num">' + n + '</small></div>'; }
      out += rowcard(l);
    });
    return out;
  }
  function draw(fit) {
    var pool = D.venues;
    cluster.clearLayers(); top.clearLayers();
    pool.forEach(function (l) {
      var m = l.featured
        ? L.marker([l.lat, l.lng], { zIndexOffset: 1000, icon: L.divIcon({ className: '', html: '<div class="pin-photo"><img src="' + esc(l.img) + '" alt=""></div><span class="pin-label">' + esc(l.name) + '</span>', iconSize: [52, 52], iconAnchor: [26, 26] }) })
        : l.verified
          ? L.marker([l.lat, l.lng], { zIndexOffset: 500, icon: L.divIcon({ className: '', html: '<div class="pin-ver">✓</div>', iconSize: [30, 30], iconAnchor: [15, 15] }) })
          : L.marker([l.lat, l.lng], { icon: L.divIcon({ className: '', html: '<div class="pin ' + (l.deal ? 'deal' : '') + '"></div>', iconSize: [28, 28], iconAnchor: [14, 28] }) });
      m.bindPopup(pop(l), { closeButton: false, maxWidth: 280, autoPanPadding: [20, 20] });
      /* phones: a pin tap brings up its card instead of a popup */
      m.on('click', function () { if (PHONE()) { m.closePopup(); focusCard(l.slug); } });
      (l.featured || l.verified ? top : cluster).addLayer(m);
      markers[l.slug] = m;
    });
    $('#list').innerHTML = '<div class="head"><div class="row between"><div><b style="font-size:18px">' + pool.length + ' venues</b><div class="muted" style="font-size:13px">in ' + esc(D.place) + ' · Featured &amp; Verified first</div></div>' + D.switchHtml + '</div></div>' + withTierHeads(pool);
    $('#mcar').innerHTML = pool.slice(0, 40).map(mcard).join('');
    drawBar();
    if (fit && pool.length) {
      /* fit to the main cluster: ignore pins more than ~60 km from the median (bad coordinates in the data) */
      var med = function (a) { a = a.slice().sort(function (x, y) { return x - y; }); return a[Math.floor(a.length / 2)]; };
      var mlat = med(pool.map(function (l) { return l.lat; })), mlng = med(pool.map(function (l) { return l.lng; }));
      var near = pool.filter(function (l) { return Math.abs(l.lat - mlat) < 0.55 && Math.abs(l.lng - mlng) < 0.55; });
      map.fitBounds(L.latLngBounds((near.length ? near : pool).map(function (l) { return [l.lat, l.lng]; })).pad(0.1), { maxZoom: 15 });
    }
  }

  /* ---------- filters: same panel + params as Explore; venues re-fetched, map redrawn, no reload ---------- */
  var form = $('#m-form'), panel = $('#m-filters'), mhome = $('#m-home'), sheet = null, sheetOpen = false;
  var QUICK = [['open', '🟢 Open now'], ['deal', '🏷️ Deals'], ['verified', '✓ Verified'], ['new', '✨ New']];
  var box = function (n) { return panel.querySelector('input[name="' + n + '"]'); };
  /* the panel moves into the sheet, so look things up in the panel, not the form */
  var sticky = function (n) { return panel.querySelector('input[data-sticky][name="' + n + '"]'); };
  var priceSym = function () { var m = document.cookie.match(/(?:^|;\s*)sp_cur=([^;]+)/), c = m ? decodeURIComponent(m[1]) : 'USD', cur = (window.SP && SP.currencies) || {};
    return c === 'NONE' || !cur[c] ? (D.localSym || '฿') : cur[c][0]; };
  var priceVal = function () { var h = sticky('price'); return h ? +h.value : 0; };
  var rateVal = function () { var h = sticky('rating'); return h ? +h.value : 0; };
  function query() {
    var out = new URLSearchParams();
    new FormData(form).forEach(function (v, k) {
      if (v === '' && k !== 'city') return;
      if ((k === 'price' || k === 'rating') && (v === '0' || !sticky(k))) return;
      if (k === 'price' || k === 'rating') { if (out.has(k)) return; }
      out.append(k, v);
    });
    return out.toString();
  }
  function activeCount() {
    var n = panel.querySelectorAll('input[name="cats[]"]:checked, input[name="areas[]"]:checked').length;
    QUICK.forEach(function (q) { if (box(q[0]) && box(q[0]).checked) n++; });
    return n + (priceVal() ? 1 : 0) + (rateVal() ? 1 : 0);
  }
  function drawBar() {
    var cats = [].map.call(panel.querySelectorAll('input[name="cats[]"]'), function (i) { return { slug: i.value, on: i.checked, label: i.parentNode.textContent.replace(/\d+\s*$/, '').trim() }; });
    var anyCat = cats.some(function (c) { return c.on; }), n = activeCount();
    $('#mcats').innerHTML =
      '<button type="button" class="chip mobile-only" id="toggle-list">' + icon('list') + ' List</button>' +
      '<button type="button" class="chip chip-filters ' + (n ? 'on' : '') + '" data-m-sheet>' + icon('filter') + ' Filters' + (n ? ' <span class="qn">' + n + '</span>' : '') + '</button>' +
      QUICK.filter(function (q) { return box(q[0]); }).map(function (q) { return '<button type="button" class="chip ' + (box(q[0]).checked ? 'on' : '') + '" data-m-quick="' + q[0] + '">' + q[1] + '</button>'; }).join('') +
      '<button type="button" class="chip ' + (priceVal() ? 'on' : '') + '" data-m-sheet>' + (priceVal() ? new Array(priceVal() + 1).join(priceSym()) : 'Price') + ' ' + icon('chevron') + '</button>' +
      '<button type="button" class="chip ' + (rateVal() ? 'on' : '') + '" data-m-sheet>' + (rateVal() ? '★ ' + rateVal() + '+' : 'Rating') + ' ' + icon('chevron') + '</button>' +
      '<span class="bar-sep"></span><button type="button" class="chip ' + (!anyCat ? 'on' : '') + '" data-m-cat="">All</button>' +
      cats.map(function (c) { return '<button type="button" class="chip ' + (c.on ? 'on' : '') + '" data-m-cat="' + esc(c.slug) + '">' + esc(c.label) + '</button>'; }).join('');
  }
  var busy = 0;
  function apply() {
    var q = query(), n = ++busy;
    $('#map').classList.add('loading');
    fetch(form.dataset.venuesUrl + '?' + q, { headers: { Accept: 'application/json' } }).then(function (r) { return r.json(); }).then(function (j) {
      if (n !== busy) return;
      D.venues = j.venues; D.place = j.place; D.listPath = j.listPath;
      panel.innerHTML = new DOMParser().parseFromString(j.filters, 'text/html').querySelector('#m-filters').innerHTML;
      if (sheetOpen) panel.querySelectorAll('input, select, button[name]').forEach(function (i) { i.setAttribute('form', form.id); });
      history.replaceState(null, '', form.action + (q ? '?' + q : ''));
      $('#map').classList.remove('loading');
      draw(true);
      /* the List | Map switch keeps these filters */
      $$('.view-switch a').forEach(function (a) { a.href = (a.classList.contains('on') ? form.action + (q ? '?' + q : '') : j.listPath); });
    });
  }
  function setSticky(name, val) {
    panel.querySelectorAll('input[data-sticky][name="' + name + '"]').forEach(function (i) { i.remove(); });
    if (+val) { var h = document.createElement('input'); h.type = 'hidden'; h.name = name; h.value = val; h.dataset.sticky = '1'; h.setAttribute('form', form.id); panel.appendChild(h); }
  }
  var ct = null;
  function count() {
    var btn = $('#m-sheet-go'); if (!btn) return;
    clearTimeout(ct);
    ct = setTimeout(function () {
      btn.textContent = 'Counting…';
      fetch(form.dataset.countUrl + '?' + query()).then(function (r) { return r.json(); }).then(function (j) {
        btn.textContent = j.count ? 'Show ' + j.count + (j.count === 1 ? ' venue' : ' venues') : 'No venues match';
        btn.disabled = !j.count;
      });
    }, 150);
  }
  function openSheet() {
    sheet = U.openModal('m-sheet', '<div class="modal-head"><h3 style="flex:1">Filter the map</h3><button type="button" class="icon-btn" data-close aria-label="Close">' + icon('close') + '</button></div>' +
      '<div class="modal-body" id="m-sheet-body"></div><div class="sheet-foot"><button type="button" class="btn btn-ghost" id="m-sheet-clear">Clear all</button><button type="button" class="btn btn-red" style="flex:1" id="m-sheet-go">Show ' + D.venues.length + ' venues</button></div>', 'filter-sheet');
    sheetOpen = true;
    $('#m-sheet-body', sheet).appendChild(panel);
    panel.querySelectorAll('input, select, button[name]').forEach(function (i) { i.setAttribute('form', form.id); });
    var snapshot = query(), applied = false;
    $('#m-sheet-go', sheet).onclick = function () { applied = true; U.closeAll(); if (query() !== snapshot) apply(); };
    $('#m-sheet-clear', sheet).onclick = function () {
      panel.querySelectorAll('input[type=checkbox]').forEach(function (i) { i.checked = false; });
      setSticky('price', 0); setSticky('rating', 0);
      panel.querySelectorAll('.seg').forEach(function (g) { g.querySelectorAll('button').forEach(function (x, i) { x.classList.toggle('on', i === 0); }); });
      count();
    };
    var restore = new MutationObserver(function () {
      if (sheet.classList.contains('open')) return;
      sheetOpen = false; restore.disconnect(); mhome.appendChild(panel);
      if (!applied && query() !== snapshot) apply(); else drawBar();
    });
    restore.observe(sheet, { attributes: true, attributeFilter: ['class'] });
  }
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  document.addEventListener('change', function (e) {
    if (!panel.contains(e.target)) return;
    if (e.target.name === 'city') panel.querySelectorAll('input[name="areas[]"]').forEach(function (a) { a.checked = false; });
    count();
  });
  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-m-sheet]'))) { openSheet(); return; }
    if ((t = e.target.closest('[data-m-quick]'))) { var b = box(t.dataset.mQuick); b.checked = !b.checked; drawBar(); apply(); return; }
    if ((t = e.target.closest('[data-m-cat]'))) {
      panel.querySelectorAll('input[name="cats[]"]').forEach(function (i) { i.checked = i.value === t.dataset.mCat; });
      drawBar(); apply(); return;
    }
    if ((t = e.target.closest('#m-filters .seg button[name]'))) {
      e.preventDefault();
      t.parentNode.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === t); });
      setSticky(t.name, t.value); count(); return;
    }
    if ((t = e.target.closest('#m-filters a.f-clear'))) { e.preventDefault(); $('#m-sheet-clear') && $('#m-sheet-clear').click(); return; }
    if ((t = e.target.closest('#m-filters [data-f-more]'))) { panel.classList.add('f-all'); t.remove(); }
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest('#toggle-list')) $('#list').classList.toggle('open');
  });
  document.addEventListener('mouseover', function (e) {
    var r = e.target.closest('.maplist .rowcard'); if (!r || !markers[r.dataset.slug]) return;
    var m = markers[r.dataset.slug];
    if (top.hasLayer(m)) m.openPopup(); else cluster.zoomToShowLayer(m, function () { m.openPopup(); });
  });
  /* swiping the cards moves the map to the card in view */
  var st = null;
  $('#mcar').addEventListener('scroll', function () {
    clearTimeout(st);
    st = setTimeout(function () {
      var box = $('#mcar').getBoundingClientRect(), best = null, dist = 1e9;
      $$('#mcar .mcard').forEach(function (c) { var r = c.getBoundingClientRect(), d = Math.abs(r.left - box.left - 16); if (d < dist) { dist = d; best = c; } });
      if (!best) return;
      $$('#mcar .mcard.on').forEach(function (x) { x.classList.remove('on'); }); best.classList.add('on');
      var m = markers[best.dataset.slug]; if (m) map.panTo(m.getLatLng());
    }, 120);
  });
  draw(true);
})();
