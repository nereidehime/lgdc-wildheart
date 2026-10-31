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
    { forum: '13', presentation: '24', key: 'brouillard', colors: ['#8a99a4', '#7fa39a'] },
    // Solitaires : pas de territoire. Mettre le numéro de leur sous-forum de présentations dès qu’il existe ;
    // en attendant, il est reconnu à son nom.
    { forum: null, presentation: null, name: /solitaire/i, key: 'solitaires', sym: 'solitaires', colors: ['#a39c92', '#857e74'] }
  ];

  function presentationOf(link) {
    var id = forumId(link.href);
    return clans.find(function (item) {
      return (item.presentation && item.presentation === id) || (!item.presentation && item.name && item.name.test(link.textContent));
    });
  }

  function emblem(clan, ring) {
    var symbol = document.createElement('span');
    symbol.className = 'lgdc-sym lgdc-fa-emblem';
    symbol.style.setProperty('--sym', 'var(--sym-' + (clan.sym || 'clan-' + clan.key) + ')');
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
    var clan = id && clans.find(function (item) { return item.forum === id; });
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
      function order(link) { return clans.indexOf(presentationOf(link)); }
      var first = order(a), second = order(b);
      return (first < 0 ? clans.length : first) - (second < 0 ? clans.length : second);
    });
    var list = document.createElement('ul');
    list.className = 'lgdc-btns';
    links.forEach(function (link) {
      if (id === '7') {
        var item = presentationOf(link);
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
  var CACHE_TTL = 3600000; // une heure
  var avatarRequests = new Map();
  var memberRequests = new Map();
  var avatarCache = {};
  try { avatarCache = JSON.parse(sessionStorage.getItem('lgdc-recent-avatars')) || {}; } catch (e) {}
  function remember(key, value) {
    avatarCache[key] = Object.assign({at: Date.now()}, value);
    try { sessionStorage.setItem('lgdc-recent-avatars', JSON.stringify(avatarCache)); } catch (e) {}
  }
  function fresh(key) {
    var entry = avatarCache[key];
    return entry && Date.now() - entry.at < CACHE_TTL ? entry : null;
  }
  function imageUrl(value, base) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      var url = new URL(value, base);
      if (!/^https?:$/.test(url.protocol)) return null;
      // l'image par défaut de Forumactif n'est pas un avatar
      return /\/(pp-blank|no_?avatar)[^/]*$/i.test(url.pathname) ? null : url.href;
    } catch (e) { return null; }
  }
  function profileId(href) {
    try {
      var url = new URL(href, location.href);
      return url.origin === location.origin && /^\/u\d+$/.test(url.pathname) ? url.pathname.slice(2) : null;
    } catch (e) { return null; }
  }
  // sans lien de profil (session invitée), le numéro du membre se retrouve dans la liste des membres
  function memberId(name) {
    var key = 'n:' + name.toLowerCase();
    var cached = fresh(key);
    if (cached) return Promise.resolve(cached.id || null);
    if (memberRequests.has(key)) return memberRequests.get(key);
    var url = new URL('/memberlist?mode=joined&order=ASC&submit=Ok&username=' + encodeURIComponent(name), location.href).href;
    var request = fetch(url, {credentials: 'same-origin'}).then(function (response) {
      if (!response.ok) throw new Error('Liste des membres indisponible');
      return response.text();
    }).then(function (html) {
      var page = new DOMParser().parseFromString(html, 'text/html');
      var match = Array.from(page.querySelectorAll('a[href]')).find(function (a) {
        return profileId(a.getAttribute('href')) && a.textContent.trim().toLowerCase() === name.toLowerCase();
      });
      var id = match ? profileId(match.getAttribute('href')) : null;
      remember(key, {id: id});
      return id;
    }).catch(function () { return null; });
    memberRequests.set(key, request);
    return request;
  }
  function avatarOf(id) {
    var base = new URL('/u' + id, location.href).href;
    var user = window._userdata;
    if (user && String(user.user_id) === id && typeof user.avatar === 'string') {
      var current = new DOMParser().parseFromString(user.avatar, 'text/html').querySelector('img');
      if (current) return Promise.resolve(imageUrl(current.getAttribute('src'), base));
    }
    var cached = fresh(id);
    if (cached && typeof cached.src === 'string') return Promise.resolve(imageUrl(cached.src, base));
    if (avatarRequests.has(id)) return avatarRequests.get(id);
    var request = fetch(base, {credentials: 'same-origin'}).then(function (response) {
      if (!response.ok) throw new Error('Profil indisponible');
      return response.text();
    }).then(function (html) {
      var page = new DOMParser().parseFromString(html, 'text/html');
      var avatar = page.querySelector('#user_avatar img, .lgdc-prof__av img');
      var src = avatar && imageUrl(avatar.getAttribute('src'), base);
      remember(id, {src: src || ''});
      return src;
    }).catch(function () { return null; });
    avatarRequests.set(id, request);
    return request;
  }
  // link : lien natif vers le profil s'il existe ; name : pseudo affiché ; member : le pseudo est celui d'un membre
  function avatarFor(link, name, member) {
    if (link) {
      var id = profileId(link.getAttribute('href'));
      return id ? avatarOf(id) : Promise.resolve(null);
    }
    if (!member || !name) return Promise.resolve(null);
    return memberId(name).then(function (found) { return found ? avatarOf(found) : null; });
  }
  document.querySelectorAll('.lgdc-recent-topics .lgdc-posts').forEach(function (list) {
    list.setAttribute('tabindex', '0');
    list.setAttribute('aria-label', 'Les dix derniers messages');
    list.querySelectorAll('li').forEach(function (row) {
      var meta = row.querySelector('.lgdc-micro');
      var author = meta && (meta.querySelector('.lgdc-who') || meta.querySelector('.lgdc-recent-author a') || meta.querySelector('.lgdc-recent-author'));
      if (!author) return;
      var name = author.textContent.trim();
      // un membre garde la couleur de son groupe dans une balise ; un invité n'est que du texte
      var member = author.matches('a') || author.dataset.member === 'true' || Boolean(author.querySelector('.usr_grp_clr, [style*="color"], strong'));
      if (member) author.dataset.member = 'true';
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
        meta.replaceChildren(document.createTextNode('par\u00a0'), author, document.createTextNode(', ' + date));
        author.classList.remove('lgdc-recent-author');
      }
      if (meta.firstChild && meta.firstChild.nodeType === 3 && /^\s*par\s*$/i.test(meta.firstChild.textContent)) meta.firstChild.textContent = 'par\u00a0';
      var square = row.querySelector('.lgdc-sq');
      if (!square) { square = document.createElement('span'); square.className = 'lgdc-sq'; row.prepend(square); }
      square.setAttribute('aria-hidden', 'true');
      if (!square.querySelector('img')) square.replaceChildren();
      square.style.setProperty('--g1', color);
      square.style.setProperty('--g2', end);
      avatarFor(author.matches('a') ? author : author.querySelector('a[href]'), name, member).then(function (src) {
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
