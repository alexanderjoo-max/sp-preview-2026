/* Back-office shell (Admin / Venue portal / Member account) */
function appShell({ area, active, title, actions = '' }) {
  const NAV = {
    admin: [['Overview', 'home', 'index.html', 'dash'], ['Inbox', 'inbox', 'index.html#inbox', 'inbox', 7], ['Listings', 'list', 'index.html#listings', 'listings', 937], ['New listing', 'plus', 'listing-edit.html?new=1', 'new'], ['label', 'Content'], ['Deals', 'tag', '#', 'deals'], ['Best of', 'trophy', '#', 'best'], ['Areas & cities', 'pin', '#', 'areas'], ['Categories', 'grid', '#', 'cats'], ['Blog', 'edit', '#', 'blog'], ['label', 'People'], ['Reviews', 'star', '#', 'reviews', 12], ['Venue owners', 'users', '#', 'owners'], ['Members', 'user', '#', 'members'], ['label', 'System'], ['Settings', 'settings', '#', 'settings']],
    shop: [['Dashboard', 'chart', 'index.html', 'dash'], ['My listing', 'edit', '../admin/listing-edit.html?owner=1', 'edit'], ['Photos', 'image', '#', 'photos'], ['Deal', 'tag', '#', 'deal'], ['Reviews', 'star', '#', 'reviews', 2], ['label', 'Grow'], ['Get Featured', 'sparkle', '#upgrade', 'upgrade'], ['Team access', 'users', '#', 'team'], ['Settings', 'settings', '#', 'settings']],
  }[area];
  const tag = { admin: 'Admin', shop: 'Venue' }[area];
  const side = `<aside class="app-side" id="app-side"><a class="logo" href="../index.html">${LOGO}<small>${tag}</small></a>
    ${NAV.map(n => n[0] === 'label' ? `<div class="side-label">${n[1]}</div>` : `<a class="side-link ${n[3] === active ? 'on' : ''}" href="${n[2]}">${icon(n[1])}${n[0]}${n[4] ? `<span class="count ${n[4] > 99 ? 'soft' : ''}">${n[4]}</span>` : ''}</a>`).join('')}
    <div style="margin-top:auto;padding:12px 10px 0;border-top:1px solid var(--line)"><div class="row"><span class="avatar" style="width:32px;height:32px;font-size:12px">${area === 'shop' ? 'DQ' : 'AJ'}</span><div style="font-size:13px;line-height:1.3"><b>${area === 'shop' ? 'Don Quixote' : 'Alexander Joo'}</b><div class="muted" style="font-size:12px">${area === 'shop' ? 'Owner · Bangkok' : 'Super admin'}</div></div></div></div>
  </aside>`;
  document.body.insertAdjacentHTML('afterbegin', `<div class="app">${side}<div class="app-main"><div class="topbar"><button class="icon-btn menu-btn" onclick="document.getElementById('app-side').classList.toggle('open')" aria-label="Menu">${icon('list')}</button><h1>${title}</h1><span class="spacer"></span>${actions}</div><div class="app-body" id="body"></div></div></div><div class="toast" id="toast"></div>`);
  mockBar();
}
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2200); }
const ROOT_FIX = () => { };
