/* Adaptation du DOM natif ; aucune activité de démonstration n’est injectée. */
(function () {
  'use strict';

  function forumId(href) {
    try {
      var url = new URL(href, location.href);
      var match = url.origin === location.origin && url.pathname.match(/^\/f(\d+)(?:-|$)/);
      return match ? match[1] : null;
    } catch (e) { return null; }
  }

  var clans = [
    { forum: '10', presentation: '21', key: 'crepuscule', colors: ['#8e7f9a', '#b59ab8'] },
    { forum: '11', presentation: '22', key: 'hetre', colors: ['#b07a4f', '#c99566'] },
    { forum: '12', presentation: '23', key: 'orchidee', colors: ['#c2a24f', '#d1b46a'] },
    { forum: '13', presentation: '24', key: 'brouillard', colors: ['#8a99a4', '#7fa39a'] }
  ];

  function emblem(clan, ring) {
    var symbol = document.createElement('span');
    symbol.className = 'lgdc-sym lgdc-fa-emblem';
    symbol.style.setProperty('--sym', 'var(--sym-clan-' + clan.key + ')');
    symbol.setAttribute('aria-hidden', 'true');
    if (!ring) return symbol;
    var outer = document.createElement('span');
    outer.className = 'lgdc-ring';
    var inner = document.createElement('span');
    inner.className = 'lgdc-ring__in';
    inner.appendChild(symbol);
    outer.appendChild(inner);
    return outer;
  }

  function colors(element, clan) {
    element.style.setProperty('--g1', clan.colors[0]);
    element.style.setProperty('--g2', clan.colors[1]);
  }

  document.querySelectorAll('.lgdc-fa-card').forEach(function (card) {
    var id = forumId(card.dataset.forumUrl);
    if (id) card.dataset.forumId = id;
    var clan = clans.find(function (item) { return item.forum === id; });
    if (clan) {
      card.dataset.clan = clan.key;
      colors(card, clan);
      card.querySelector('.lgdc-cw__head').prepend(emblem(clan, false));
    }

    var description = card.querySelector('.lgdc-fa-desc');
    if (description && !description.textContent.trim() && !description.querySelector('img,iframe,video,audio,form')) description.hidden = true;
    var last = card.querySelector('.lgdc-fa-last__text');
    if (last) {
      last.querySelectorAll('a').forEach(function (link) {
        if (!link.getAttribute('href')) link.remove();
      });
      if (!last.textContent.trim()) {
        last.textContent = 'Aucun message pour le moment.';
        last.dataset.empty = 'true';
      }
    }

    var subforums = card.querySelector('.lgdc-fa-subs');
    if (!subforums) return;
    var links = Array.from(subforums.querySelectorAll('a')).filter(function (a) { return forumId(a.href); });
    if (!links.length) { subforums.hidden = true; return; }
    if (id === '7') links.sort(function (a, b) {
      function order(link) { return clans.findIndex(function (item) { return item.presentation === forumId(link.href); }); }
      var first = order(a), second = order(b);
      return (first < 0 ? clans.length : first) - (second < 0 ? clans.length : second);
    });
    var list = document.createElement('ul');
    list.className = 'lgdc-btns';
    links.forEach(function (link) {
      if (id === '7') {
        var item = clans.find(function (clan) { return clan.presentation === forumId(link.href); });
        if (item) { colors(link, item); link.prepend(emblem(item, true)); }
      }
      var li = document.createElement('li');
      li.appendChild(link);
      list.appendChild(li);
    });
    subforums.replaceChildren(list);
  });

  /* Le widget fournit les données ; ce passage reprend la ligne de la maquette. */
  var groupEnds = {};
  var colorProbe = document.createElement('span');
  clans.map(function (clan) { return clan.colors; }).concat([
    ['#a39c92', '#857e74'], ['#cb7a53', '#dfa283']
  ]).forEach(function (pair) {
    colorProbe.style.color = pair[0];
    groupEnds[colorProbe.style.color] = pair[1];
  });
  var avatarRequests = new Map();
  var avatarCache = {};
  try { avatarCache = JSON.parse(sessionStorage.getItem('lgdc-recent-avatars')) || {}; } catch (e) {}
  function imageUrl(value, base) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try { var url = new URL(value, base); return /^https?:$/.test(url.protocol) ? url.href : null; }
    catch (e) { return null; }
  }
  function avatarFor(link) {
    if (!link) return Promise.resolve(null);
    var profile;
    try { profile = new URL(link.getAttribute('href'), location.href); } catch (e) { return Promise.resolve(null); }
    if (profile.origin !== location.origin || !/^\/u\d+$/.test(profile.pathname)) return Promise.resolve(null);
    var id = profile.pathname.slice(2);
    var user = window._userdata;
    if (user && String(user.user_id) === id && typeof user.avatar === 'string') {
      var current = new DOMParser().parseFromString(user.avatar, 'text/html').querySelector('img');
      if (current) return Promise.resolve(imageUrl(current.getAttribute('src'), profile.href));
    }
    var cached = avatarCache[id];
    if (cached && Date.now() - cached.at < 300000 && typeof cached.src === 'string') return Promise.resolve(imageUrl(cached.src, profile.href));
    if (avatarRequests.has(id)) return avatarRequests.get(id);
    var request = fetch(profile.href, {credentials: 'same-origin'}).then(function (response) {
      if (!response.ok) throw new Error('Profil indisponible');
      return response.text();
    }).then(function (html) {
      var page = new DOMParser().parseFromString(html, 'text/html');
      var avatar = page.querySelector('#user_avatar img, .lgdc-prof__av img');
      var src = avatar && imageUrl(avatar.getAttribute('src'), profile.href);
      if (src) {
        avatarCache[id] = {src: src, at: Date.now()};
        try { sessionStorage.setItem('lgdc-recent-avatars', JSON.stringify(avatarCache)); } catch (e) {}
      }
      return src;
    }).catch(function () { return null; });
    avatarRequests.set(id, request);
    return request;
  }
  document.querySelectorAll('.lgdc-recent-topics .lgdc-posts').forEach(function (list) {
    list.setAttribute('tabindex', '0');
    list.setAttribute('aria-label', 'Les dix derniers messages');
    list.querySelectorAll('li').forEach(function (row) {
      var meta = row.querySelector('.lgdc-micro');
      var author = meta && (meta.querySelector('.lgdc-who') || meta.querySelector('.lgdc-recent-author a') || meta.querySelector('.lgdc-recent-author'));
      if (!author) return;
      var name = author.textContent.trim();
      var nativeColor = author.querySelector('[style*="color"]');
      var color = nativeColor && nativeColor.style.color || author.style.getPropertyValue('--g1') || '#a39c92';
      var end = groupEnds[color] || color;
      author.classList.add('lgdc-who');
      if (author.children.length) author.textContent = name;
      author.style.setProperty('--g1', color);
      author.style.setProperty('--g2', end);
      // Compatibilité avec le template déjà installé : la date redevient du texte sur la même ligne.
      var legacyTime = meta.querySelector('.lgdc-recent-time');
      if (legacyTime) {
        var date = legacyTime.textContent.trim();
        meta.replaceChildren(document.createTextNode('par '), author, document.createTextNode(', ' + date));
        author.classList.remove('lgdc-recent-author');
      }
      var square = row.querySelector('.lgdc-sq');
      if (!square) { square = document.createElement('span'); square.className = 'lgdc-sq'; row.prepend(square); }
      square.setAttribute('aria-hidden', 'true');
      if (!square.querySelector('img')) square.replaceChildren();
      square.style.setProperty('--g1', color);
      square.style.setProperty('--g2', end);
      avatarFor(author.matches('a') ? author : null).then(function (src) {
        if (!src || !square.isConnected) return;
        var image = document.createElement('img');
        image.src = src;
        image.alt = '';
        image.loading = 'lazy';
        image.decoding = 'async';
        square.replaceChildren(image);
      });
    });
  });
})();
