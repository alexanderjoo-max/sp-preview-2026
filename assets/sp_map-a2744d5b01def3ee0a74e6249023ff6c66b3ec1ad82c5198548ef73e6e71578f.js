/* SwanPass redesign — map (ported from mockups/redesign/map.html).
   Featured venues use their photo as the pin, Verified a blue tick; neither is ever clustered.
   List (desktop) and swipe cards (phones) follow the Featured -> Verified -> rest order. */
(function () {
  'use strict';
  var U = window.SPUI, D = window.SP_MAP;
  if (!U || !D || !window.L) return;
  var $ = U.$, $$ = U.$$, esc = U.esc, icon = U.icon, TICK = (window.SP || {}).tick || '';
  var STAR = '<svg class="star" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3L2.8 9.5l6.4-.9L12 2.8Z"/></svg>';
  var map = L.map('map', { zoomControl: false }).setView([13.735, 100.565], 13);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 19 }).addTo(map);
  var cluster = L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 46 });
  var top = L.layerGroup();
  map.addLayer(cluster); map.addLayer(top);
  var cat = '', markers = {};
  var href = function (l) { return '/sp-preview-2026/listing/' + l.slug; };
  var rating = function (l) { return '<span class="rating">' + STAR + (l.rating ? l.rating.toFixed(1) : '—') + '</span>'; };
  function pop(l) { return '<a class="pop" href="' + href(l) + '"><img src="' + esc(l.img) + '" alt=""><div><b>' + esc(l.name) + '</b><div class="card-meta">' + rating(l) + '· ' + esc(l.cat || '') + ' · ' + esc(l.area || '') + '</div>' + (l.deal ? '<div class="card-deal" style="padding:6px 0 0">' + icon('tag') + esc(l.deal) + '</div>' : '') + '</div></a>'; }
  function rowcard(l) {
    return '<a class="rowcard" data-slug="' + l.slug + '" href="' + href(l) + '"><img src="' + esc(l.img) + '" alt="" loading="lazy"><div style="min-width:0"><div class="card-title"><span>' + esc(l.name) + '</span>' + (l.verified ? TICK : '') + '</div>' +
      '<div class="card-meta">' + rating(l) + '<span>' + esc(l.cat || '') + '</span></div><div class="card-meta">' + (l.open === null || l.open === undefined ? '' : '<span class="open-dot ' + (l.open ? '' : 'closed') + '"></span>' + (l.open ? 'Open' : 'Closed') + ' · ') + esc(l.area || '') + '</div>' +
      (l.deal ? '<div class="card-deal" style="padding-top:4px">' + icon('tag') + esc(l.deal) + '</div>' : '') + '</div></a>';
  }
  function withTierHeads(list) {
    var cur = -1, out = '';
    list.forEach(function (l) {
      if (l.tier !== cur) { cur = l.tier; var n = list.filter(function (x) { return x.tier === cur; }).length; out += '<div class="tier-head">' + ['<span class="badge b-feat">★ Featured</span>', '<span class="badge b-ver">✓ Verified</span>', 'More venues'][cur] + '<small class="num">' + n + '</small></div>'; }
      out += rowcard(l);
    });
    return out;
  }
  function draw(fit) {
    var pool = D.venues.filter(function (l) { return !cat || l.cats.some(function (c) { return c.toLowerCase().indexOf(cat.toLowerCase()) === 0; }); });
    cluster.clearLayers(); top.clearLayers();
    pool.forEach(function (l) {
      var m = l.featured
        ? L.marker([l.lat, l.lng], { zIndexOffset: 1000, icon: L.divIcon({ className: '', html: '<div class="pin-photo"><img src="' + esc(l.img) + '" alt=""></div><span class="pin-label">' + esc(l.name) + '</span>', iconSize: [52, 52], iconAnchor: [26, 26] }) })
        : l.verified
          ? L.marker([l.lat, l.lng], { zIndexOffset: 500, icon: L.divIcon({ className: '', html: '<div class="pin-ver">✓</div>', iconSize: [30, 30], iconAnchor: [15, 15] }) })
          : L.marker([l.lat, l.lng], { icon: L.divIcon({ className: '', html: '<div class="pin ' + (l.deal ? 'deal' : '') + '"></div>', iconSize: [28, 28], iconAnchor: [14, 28] }) });
      m.bindPopup(pop(l), { closeButton: false });
      (l.featured || l.verified ? top : cluster).addLayer(m);
      markers[l.slug] = m;
    });
    $('#list').innerHTML = '<div class="head"><div class="row between"><div><b style="font-size:18px">' + pool.length + ' venues</b><div class="muted" style="font-size:13px">in ' + esc(D.place) + ' · Featured &amp; Verified first</div></div><a class="btn btn-ghost btn-sm" href="' + D.listPath + '">' + icon('list') + ' List view</a></div></div>' + withTierHeads(pool);
    $('#mcar').innerHTML = pool.slice(0, 15).map(rowcard).join('');
    $('#mcats').innerHTML = '<button class="chip mobile-only" id="toggle-list">' + icon('list') + ' List</button><button class="chip ' + (!cat ? 'on' : '') + '" data-mc="">All</button>' +
      D.categories.map(function (c) { return '<button class="chip ' + (cat === c.name ? 'on' : '') + '" data-mc="' + esc(c.name) + '">' + esc(c.name) + '</button>'; }).join('');
    if (fit && pool.length) {
      /* fit to the main cluster: ignore pins more than ~60 km from the median (bad coordinates in the data) */
      var med = function (a) { a = a.slice().sort(function (x, y) { return x - y; }); return a[Math.floor(a.length / 2)]; };
      var mlat = med(pool.map(function (l) { return l.lat; })), mlng = med(pool.map(function (l) { return l.lng; }));
      var near = pool.filter(function (l) { return Math.abs(l.lat - mlat) < 0.55 && Math.abs(l.lng - mlng) < 0.55; });
      map.fitBounds(L.latLngBounds((near.length ? near : pool).map(function (l) { return [l.lat, l.lng]; })).pad(0.1), { maxZoom: 15 });
    }
  }
  document.addEventListener('click', function (e) {
    var c = e.target.closest('[data-mc]'); if (c) { cat = c.dataset.mc; draw(true); }
    if (e.target.closest('#toggle-list')) $('#list').classList.toggle('open');
  });
  document.addEventListener('mouseover', function (e) {
    var r = e.target.closest('.maplist .rowcard'); if (!r || !markers[r.dataset.slug]) return;
    var m = markers[r.dataset.slug];
    if (top.hasLayer(m)) m.openPopup(); else cluster.zoomToShowLayer(m, function () { m.openPopup(); });
  });
  $('#mcar').addEventListener('scroll', function () {
    var first = $('#mcar').firstElementChild; if (!first) return;
    var i = Math.round($('#mcar').scrollLeft / (first.offsetWidth + 10)), r = $$('#mcar .rowcard')[i];
    if (r && markers[r.dataset.slug]) map.panTo(markers[r.dataset.slug].getLatLng());
  });
  draw(true);
})();
