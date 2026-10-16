/* SwanPass redesign — directory filters (Explore, Deals, Staff).
   The filter panel is a plain GET form: any change submits it, so every state is a real URL.
   Phones: the same panel opens as a bottom sheet. "Show more" appends the next page in place. */
(function () {
  'use strict';
  var U = window.SPUI, form = document.querySelector('[data-directory]');
  if (!U || !form) return;
  var $ = U.$;
  var submit = function () { if (form.requestSubmit) form.requestSubmit(); else form.submit(); };

  form.addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'city') { form.querySelectorAll('input[name="areas[]"]').forEach(function (a) { a.checked = false; }); }
    submit();
  });
  /* segmented price / rating buttons: the clicked button wins over the sticky hidden input */
  form.addEventListener('click', function (e) {
    var b = e.target.closest('.seg button[name]'); if (!b) return;
    form.querySelectorAll('input[data-sticky][name="' + b.name + '"]').forEach(function (i) { i.remove(); });
  });
  /* drop empty params so URLs stay short */
  form.addEventListener('formdata', function (e) {
    var fd = e.formData, drop = [];
    fd.forEach(function (v, k) { if (v === '' && k !== 'city') drop.push(k); if (k === 'sort' && v === 'recommended') drop.push(k); if ((k === 'price' || k === 'rating') && (v === '0')) drop.push(k); });
    drop.forEach(function (k) { fd.delete(k); });
  });

  /* phones: filters as a bottom sheet */
  var aside = $('#d-filters'), home = aside && aside.parentNode;
  $('#d-open-filters').addEventListener('click', function () {
    var m = U.openModal('d-sheet', '<div class="modal-head"><h3 style="flex:1">Filters</h3><button type="button" class="icon-btn" data-close aria-label="Close">' + U.icon('close') + '</button></div>' +
      '<div class="modal-body" id="d-sheet-body"></div><div class="sheet-foot"><a class="btn btn-ghost" href="' + form.action + '">Clear</a><button type="button" class="btn btn-red" style="flex:1" data-close>' + ($('#d-count').textContent || 'Show venues') + '</button></div>');
    var body = $('#d-sheet-body', m);
    body.appendChild(aside); aside.style.display = 'block';
    /* inputs moved out of the form keep submitting it */
    aside.querySelectorAll('input, select, button[name]').forEach(function (i) { i.setAttribute('form', form.id); });
    body.addEventListener('change', function () { submit(); });
    var restore = new MutationObserver(function () { if (!m.classList.contains('open')) { home.insertBefore(aside, home.firstChild); aside.style.display = ''; restore.disconnect(); } });
    restore.observe(m, { attributes: true, attributeFilter: ['class'] });
  });

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
