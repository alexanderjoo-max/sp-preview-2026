/* SwanPass redesign — directory filters (Explore, Deals, Staff).
   The filters are a plain GET form, so every state is a real URL (and works without JS).
   With JS, results update in place (no page reload) and the URL follows along.
   Desktop: every change applies at once. Phones/tablets: the same panel opens as a bottom
   sheet where picks are staged and the button shows a live "Show N venues" count. */
(function () {
  'use strict';
  var U = window.SPUI, form = document.querySelector('[data-directory]');
  if (!U || !form) return;
  var $ = U.$;
  var aside = $('#d-filters'), home = aside && aside.parentNode, sheet = null, sheetOpen = false;
  var staged = function () { return sheetOpen; };

  /* drop empty params so URLs stay short */
  form.addEventListener('formdata', function (e) {
    var fd = e.formData, drop = [];
    fd.forEach(function (v, k) { if (v === '' && k !== 'city') drop.push(k); if (k === 'sort' && v === 'recommended') drop.push(k); if ((k === 'price' || k === 'rating') && (v === '0')) drop.push(k); });
    drop.forEach(function (k) { fd.delete(k); });
  });
  var query = function (submitter) {
    var fd = submitter ? new FormData(form, submitter) : new FormData(form), seen = {}, out = new URLSearchParams();
    /* a clicked price/rating button wins over the hidden "sticky" value */
    fd.forEach(function (v, k) { if (k === 'price' || k === 'rating') { seen[k] = v; return; } out.append(k, v); });
    Object.keys(seen).forEach(function (k) { if (seen[k] !== '0') out.append(k, seen[k]); });
    return out.toString();
  };

  /* fetch the filtered page and swap in the parts that change */
  var busy = 0;
  function load(url, push) {
    var n = ++busy, section = $('.dir > section');
    section.classList.add('loading');
    var closed = [].map.call(aside.querySelectorAll('.fgroup'), function (d) { return !d.open; });
    var showAll = aside.classList.contains('f-all'), top = aside.scrollTop;
    fetch(url, { headers: { Accept: 'text/html' } }).then(function (r) { return r.text(); }).then(function (html) {
      if (n !== busy) return;
      var doc = new DOMParser().parseFromString(html, 'text/html');
      [['#d-cats'], ['#d-filters'], ['.dir > section']].forEach(function (sel) {
        var a = $(sel[0]), b = doc.querySelector(sel[0]); if (a && b) a.innerHTML = b.innerHTML;
      });
      var fc = doc.querySelector('#d-fcount'); if (fc) $('#d-fcount').textContent = fc.textContent;
      aside.querySelectorAll('.fgroup').forEach(function (d, i) { if (closed[i]) d.open = false; });
      aside.classList.toggle('f-all', showAll); aside.scrollTop = top;
      if (staged()) aside.querySelectorAll('input, select, button[name]').forEach(function (i) { i.setAttribute('form', form.id); });
      document.title = doc.title;
      if (push !== false) history.pushState({ dir: 1 }, '', url);
      $('.dir > section').classList.remove('loading');
      if (window.scrollY > $('.dir').offsetTop) window.scrollTo({ top: $('.dir').offsetTop - 120, behavior: 'smooth' });
    }).catch(function () { location.href = url; });
  }
  var apply = function (submitter) { load(form.action + '?' + query(submitter)); };
  window.addEventListener('popstate', function () { load(location.href, false); });

  form.addEventListener('submit', function (e) { e.preventDefault(); if (!staged()) apply(e.submitter); });
  form.addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'city') { form.querySelectorAll('input[name="areas[]"]').forEach(function (a) { a.checked = false; }); }
    if (!staged()) apply();
  });
  document.addEventListener('change', function (e) { if (staged() && aside.contains(e.target)) { if (e.target.name === 'city') aside.querySelectorAll('input[name="areas[]"]').forEach(function (a) { a.checked = false; }); count(); } });

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-ajax]');
    if (a && !e.metaKey && !e.ctrlKey) { e.preventDefault(); load(a.href); return; }
    var more = e.target.closest('[data-f-more]');
    if (more) { aside.classList.add('f-all'); more.remove(); return; }
    var q = e.target.closest('[data-quick]');
    if (q) { var box = aside.querySelector('input[name="' + q.dataset.quick + '"]'); if (box) { box.checked = !box.checked; q.classList.toggle('on', box.checked); apply(); } return; }
    if (e.target.closest('[data-open-sheet], #d-open-filters')) { openSheet(); return; }
    /* price / rating buttons */
    var b = e.target.closest('.seg button[name]');
    if (b && aside.contains(b)) {
      form.querySelectorAll('input[data-sticky][name="' + b.name + '"]').forEach(function (i) { i.remove(); });
      if (staged()) {
        e.preventDefault();
        b.parentNode.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
        var h = document.createElement('input'); h.type = 'hidden'; h.name = b.name; h.value = b.value; h.dataset.sticky = '1'; h.setAttribute('form', form.id); aside.appendChild(h);
        count();
      }
    }
  });

  /* phone sheet: live count on the button */
  var ct = null;
  function count() {
    var btn = $('#d-sheet-go'); if (!btn) return;
    clearTimeout(ct);
    ct = setTimeout(function () {
      btn.textContent = 'Counting…';
      fetch(form.dataset.countUrl + '?' + query() + '&preset=' + form.dataset.preset).then(function (r) { return r.json(); }).then(function (j) {
        btn.textContent = j.count ? 'Show ' + j.count + (j.count === 1 ? ' venue' : ' venues') : 'No venues match';
        btn.disabled = !j.count;
      });
    }, 150);
  }
  function openSheet() {
    sheet = U.openModal('d-sheet', '<div class="modal-head"><h3 style="flex:1">Filters</h3><button type="button" class="icon-btn" data-close aria-label="Close">' + U.icon('close') + '</button></div>' +
      '<div class="modal-body" id="d-sheet-body"></div><div class="sheet-foot"><button type="button" class="btn btn-ghost" id="d-sheet-clear">Clear all</button><button type="button" class="btn btn-red" style="flex:1" id="d-sheet-go">' + U.esc(($('#d-count') || {}).textContent ? 'Show ' + $('#d-count').textContent.split(' in ')[0].split(' across ')[0] : 'Show venues') + '</button></div>');
    sheetOpen = true;
    var body = $('#d-sheet-body', sheet);
    body.appendChild(aside); aside.style.display = 'block';
    /* inputs moved out of the form keep belonging to it */
    aside.querySelectorAll('input, select, button[name]').forEach(function (i) { i.setAttribute('form', form.id); });
    var snapshot = query(), applied = false;
    $('#d-sheet-go', sheet).onclick = function () { var q = query(); applied = true; U.closeAll(); if (q !== snapshot) load(form.action + '?' + q); };
    $('#d-sheet-clear', sheet).onclick = function () {
      aside.querySelectorAll('input[type=checkbox]').forEach(function (i) { i.checked = false; });
      aside.querySelectorAll('input[data-sticky]').forEach(function (i) { i.remove(); });
      aside.querySelectorAll('.seg').forEach(function (g) { g.querySelectorAll('button').forEach(function (x, i) { x.classList.toggle('on', i === 0); }); });
      count();
    };
    var restore = new MutationObserver(function () { if (!sheet.classList.contains('open')) { sheetOpen = false; home.insertBefore(aside, home.firstChild); aside.style.display = ''; restore.disconnect();
      /* closed without applying: put the panel back to what the page shows */
      if (!applied && query() !== snapshot) load(location.href, false); } });
    restore.observe(sheet, { attributes: true, attributeFilter: ['class'] });
  }

  /* show more: fetch the next page and append its cards */
  document.addEventListener('click', function (e) {
    var more = e.target.closest('#d-more'); if (!more) return;
    e.preventDefault();
    var url = more.href + (more.href.indexOf('?') > -1 ? '&' : '?') + 'after_tier=' + more.dataset.lastTier;
    more.textContent = 'Loading…';
    fetch(url, { headers: { Accept: 'text/html' } }).then(function (r) { return r.text(); }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var grid = $('#d-grid');
      [].slice.call(doc.querySelectorAll('#d-grid > *')).forEach(function (n) { grid.appendChild(document.importNode(n, true)); });
      var next = doc.querySelector('#d-more');
      if (next) { more.href = next.getAttribute('href'); more.dataset.lastTier = next.dataset.lastTier; more.textContent = 'Show more'; }
      else more.parentNode.remove();
    });
  });
})();

/* Staff tiles: in Safe view the first tap reveals the photo, the second opens the venue */
document.addEventListener('click', function (e) {
  var s = e.target.closest('a.staff');
  if (s && document.body.classList.contains('safe') && !s.classList.contains('revealed')) { e.preventDefault(); s.classList.add('revealed'); }
});
