/* Messagerie (maquettes mp.html et mp-lire.html) : dossier ouvert, couleurs du groupe de l'expéditeur,
   avatars de la liste (cache partagé avec l'accueil), jauge de la boîte, liens citer et éditer. */
(function () {
  'use strict';
  var page = document.querySelector('.lgdc-fa-mp');
  if (!page) return;

  var probe = document.createElement('span');
  var GROUPS = [
    { color: '#cb7a53', end: '#dfa283', sym: 'staff', name: 'Staff' },
    { color: '#8e7f9a', end: '#b59ab8', sym: 'clan-crepuscule', name: 'Clan du Crépuscule' },
    { color: '#b07a4f', end: '#c99566', sym: 'clan-hetre', name: 'Clan du Hêtre' },
    { color: '#c2a24f', end: '#d1b46a', sym: 'clan-orchidee', name: 'Clan de l’Orchidée' },
    { color: '#8a99a4', end: '#7fa39a', sym: 'clan-brouillard', name: 'Clan du Brouillard' },
    { color: '#a39c92', end: '#857e74', sym: 'solitaires', name: 'Solitaires' }
  ].map(function (g) { probe.style.color = g.color; g.key = probe.style.color; return g; });
  function groupOf(box) {
    var colored = box && box.querySelector('[style*="color"]');
    return colored ? GROUPS.find(function (g) { return g.key === colored.style.color; }) : null;
  }
  function clean(text) { return text.replace(/\s+/g, ' ').trim(); }
  function paint(node, group) {
    if (!group) return;
    node.style.setProperty('--g1', group.color);
    node.style.setProperty('--g2', group.end);
  }

  // dossier ouvert : celui de l'adresse, la boîte de réception par défaut (et pour la lecture d'un message reçu)
  var folder = (location.search.match(/folder=(\w+)/) || [])[1] || 'inbox';
  page.querySelectorAll('.lgdc-mp__folders a').forEach(function (a) {
    if (a.dataset.folder === folder) a.setAttribute('aria-current', 'page');
  });
  page.querySelectorAll('.lgdc-mp__back, .lgdc-crumbs a').forEach(function (a) { a.href = '/privmsg?folder=' + folder; });

  /* avatars : profils, avec le cache de l'accueil (une heure) */
  var CACHE_TTL = 3600000;
  var cache = {};
  try { cache = JSON.parse(sessionStorage.getItem('lgdc-recent-avatars')) || {}; } catch (e) {}
  function avatarOf(id) {
    var hit = cache[id];
    if (hit && Date.now() - hit.at < CACHE_TTL && typeof hit.src === 'string') return Promise.resolve(hit.src);
    return fetch('/u' + id, { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.text() : ''; }).then(function (html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      var img = doc.querySelector('#user_avatar img, .lgdc-prof__av img, .lgdc-fa-av img');
      var src = img ? new URL(img.getAttribute('src'), location.href).href : '';
      if (/\/(pp-blank|no_?avatar)[^/]*$/i.test(src)) src = '';
      cache[id] = { at: Date.now(), src: src };
      try { sessionStorage.setItem('lgdc-recent-avatars', JSON.stringify(cache)); } catch (e) {}
      return src;
    }).catch(function () { return ''; });
  }

  /* liste d'un dossier */
  page.querySelectorAll('.lgdc-fa-mp-row').forEach(function (row) {
    var from = row.querySelector('.lgdc-mp__from');
    paint(row, groupOf(from));
    var link = from.querySelector('a[href]');
    var name = clean(from.textContent);
    from.textContent = name;
    // message non lu : l'image native du dossier porte « new » ou « unread »
    if (/new|unread|non_lu/i.test(row.dataset.img || '')) {
      row.classList.add('is-unread');
      from.appendChild(Object.assign(document.createElement('span'), { className: 'lgdc-micro lgdc-mp__new', textContent: 'Nouveau' }));
    }
    var date = row.querySelector('.lgdc-mp__date');
    date.textContent = clean(date.textContent);
    var id = link && (link.getAttribute('href').match(/^\/u(\d+)/) || [])[1];
    var av = row.querySelector('.lgdc-mp__av');
    if (id) avatarOf(id).then(function (src) {
      if (!src) { av.textContent = name.split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2); return; }
      var img = document.createElement('img');
      img.src = src; img.alt = ''; img.className = 'lgdc-avatar--contain';
      av.appendChild(img);
    });
  });
  // une action native sans libellé ne s'affiche pas
  page.querySelectorAll('.lgdc-fa-mp-actions input[type=submit]').forEach(function (b) { if (!clean(b.value)) b.remove(); });
  var all = document.getElementById('lgdc-mp-all');
  if (all) all.addEventListener('change', function () {
    page.querySelectorAll('input[name="mark[]"]').forEach(function (box) { box.checked = all.checked; });
  });
  if (!page.querySelector('.lgdc-fa-mp-row')) {
    var tools = page.querySelector('.lgdc-mp__box .lgdc-mp__tools');
    if (tools) tools.querySelectorAll('.lgdc-mp__check, .lgdc-fa-mp-actions').forEach(function (n) { n.remove(); });
    var list = page.querySelector('.lgdc-mp__list');
    if (list) list.remove();
  }
  var pagination = page.querySelector('.lgdc-mp__tools .lgdc-forum-pagination');
  if (pagination && !clean(pagination.textContent)) pagination.remove();

  // jauge : « Votre boîte est pleine à 21% » devient 21 % dans la barre
  var size = page.querySelector('.lgdc-fa-mp-size');
  if (size) {
    var percent = parseInt((size.textContent.match(/(\d+)\s*%/) || [])[1], 10);
    var bar = page.querySelector('.lgdc-mp__bar i');
    if (!isNaN(percent) && bar) bar.style.width = Math.min(percent, 100) + '%';
    else if (bar) bar.parentNode.remove();
  }

  /* lecture d'un message */
  if (page.classList.contains('lgdc-fa-mp-read')) {
    var post = page.querySelector('.lgdc-post--mp');
    var nameBox = post.querySelector('.lgdc-fa-name');
    var group = groupOf(nameBox);
    paint(post, group);
    var profile = nameBox.querySelector('a[href^="/u"]');
    var who = document.createElement(profile ? 'a' : 'span');
    if (profile) who.href = profile.getAttribute('href');
    who.className = 'lgdc-post__name';
    who.textContent = clean(nameBox.textContent);
    nameBox.replaceWith(who);
    if (group) {
      var line = document.createElement('p');
      line.className = 'lgdc-post__clan';
      line.innerHTML = '<span class="lgdc-sym" style="--sym:var(--sym-' + group.sym + ')" aria-hidden="true"></span>';
      line.appendChild(document.createTextNode(group.name));
      who.after(line);
    }
    var avatar = post.querySelector('.lgdc-fa-av img');
    if (avatar) { avatar.removeAttribute('style'); avatar.alt = ''; }
    // la barre : noms sans couleur ni icône de profil
    post.querySelectorAll('.lgdc-post__bar b').forEach(function (b) {
      var a = b.querySelector('a[href]');
      var text = clean(b.textContent);
      if (a) { var link = document.createElement('a'); link.href = a.getAttribute('href'); link.textContent = text; b.replaceChildren(link); }
      else b.textContent = text;
    });
    var time = post.querySelector('.lgdc-post__bar time');
    if (time) time.textContent = clean(time.textContent);
    // citer et éditer : liens natifs complétés par le numéro du message (champ caché mark[])
    var mark = page.querySelector('input[type="hidden"][name="mark[]"]');
    var id = mark && mark.value;
    [['.lgdc-fa-mp-quote', 'quote'], ['.lgdc-fa-mp-edit', 'edit']].forEach(function (pair) {
      var a = page.querySelector(pair[0]);
      if (!a) return;
      if (id && page.dataset[pair[1]]) a.href = '/privmsg?mode=' + pair[1] + '&p=' + id;
      else a.remove();
    });
  }
})();
