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
    // Solitaires : pas de territoire, seulement leur sous-forum de présentations
    { forum: null, presentation: '1', key: 'solitaires', sym: 'solitaires', colors: ['#a39c92', '#857e74'] }
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
  /* Cartes des forums : les données natives sont remises dans le balisage exact de la maquette.
     « Avant de s’inscrire » en cartes centrées, Présentations en grande carte, les autres en cartes à anneau. */
  var CENTERED = ['4', '5', '6'];
  function plural(n, word) { return n + ' ' + word + (parseInt(n, 10) > 1 ? 's' : ''); }
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }
  function lastPost(card) {
    var box = card.querySelector('.lgdc-fa-last__text');
    if (!box || box.dataset.empty) return null;
    var topic = Array.from(box.querySelectorAll('a[href]')).find(function (a) { return a.getAttribute('href') && !a.classList.contains('last-post-icon'); });
    if (!topic) return null;
    var who = box.querySelector('.usr_grp_clr') || box.querySelector('strong');
    var profile = who && who.closest('a[href]');
    var date = Array.from(box.childNodes).filter(function (n) { return n.nodeType === 3; }).map(function (n) { return n.textContent; }).join(' ').replace(/\s+/g, ' ').trim();
    var color = who && who.style && who.style.color || '#a39c92';
    var avatar = card.querySelector('.lgdc-fa-avatar img');
    var src = avatar && avatar.getAttribute('src');
    return {
      href: topic.getAttribute('href'), title: topic.textContent.trim(), date: date,
      name: who ? who.textContent.trim() : '', profile: profile && profile.getAttribute('href'),
      color: color, end: groupEnds[color] || color,
      avatar: src && !/\/(pp-blank|no_?avatar)[^/]*$/i.test(src) ? src : null
    };
  }
  function whoNode(last, tag) {
    var who = el(tag, 'lgdc-who', last.name);
    if (tag === 'a') who.href = last.profile || '#';
    who.style.setProperty('--g1', last.color);
    who.style.setProperty('--g2', last.end);
    return who;
  }
  function ring(last) {
    var outer = el('span', 'lgdc-ring'), inner = el('span', 'lgdc-ring__in');
    outer.style.setProperty('--g1', last ? last.color : '#a39c92');
    outer.style.setProperty('--g2', last ? last.end : '#857e74');
    if (last && last.avatar) {
      var img = el('img', 'lgdc-avatar--contain');
      img.src = last.avatar; img.alt = ''; img.loading = 'lazy';
      inner.appendChild(img);
    }
    outer.appendChild(inner);
    return outer;
  }
  function counts(card) {
    var b = card.querySelectorAll('.lgdc-cw__count b');
    return [b[0] ? b[0].textContent.trim() : '0', b[1] ? b[1].textContent.trim() : '0'];
  }
  function countLine(cls, n) {
    var p = el('p', 'lgdc-micro ' + cls);
    [[n[0], 'sujet'], [n[1], 'message']].forEach(function (pair) {
      var span = el('span'), b = el('b', null, pair[0]);
      span.append(b, ' ' + plural(pair[0], pair[1]).replace(/^\S+ /, ''));
      p.appendChild(span);
    });
    return p;
  }
  function lastLink(last) {
    var a = el('a', 'lgdc-cw__last');
    a.href = last.href;
    var meta = el('span', 'lgdc-micro');
    meta.append('par ', whoNode(last, 'span'), ', ' + last.date);
    a.append(el('span', 'lgdc-cw__topic', last.title), meta);
    return a;
  }
  document.querySelectorAll('.lgdc-fa-card').forEach(function (card) {
    var id = card.dataset.forumId;
    if (!id) return;
    var title = card.querySelector('.forumtitle');
    if (!title) return;
    var link = title.getAttribute('href'), name = title.textContent.trim();
    var unread = /(^|\s)(forum|cat)_new\b/.test(card.className);
    var last = lastPost(card), n = counts(card);
    var desc = card.querySelector('.lgdc-fa-desc');
    var subs = card.querySelector('.lgdc-fa-subs');
    var fresh;
    var clan = card.dataset.clan && clans.find(function (c) { return c.key === card.dataset.clan; });
    if (clan) {
      // territoire : « Crépuscule » en grand, le territoire en sous-titre, puis les traits (description coupée au premier point)
      fresh = el('article', 'lgdc-cw lgdc-terr');
      colors(fresh, clan);
      var tin = el('div', 'lgdc-cw__in lgdc-cw__body');
      var tid = el('div', 'lgdc-cw__head lgdc-terr__id');
      var emb = emblem(clan, true); colors(emb, clan);
      var text = desc ? desc.textContent.replace(/\s+/g, ' ').trim() : '';
      var cut = text.indexOf('. ');
      var where = cut > 0 ? text.slice(0, cut) : '', traits = cut > 0 ? text.slice(cut + 2) : text;
      var tn = el('h3', 'lgdc-cw__name'), tna = el('a', null, name.replace(/^Clan (du |de la |de l’|de l')/i, '')); tna.href = link; tn.appendChild(tna);
      var tbox = el('div'); tbox.appendChild(tn);
      if (where) tbox.appendChild(el('p', 'lgdc-micro lgdc-terr__where', where.charAt(0).toLowerCase() + where.slice(1)));
      tid.append(emb, tbox);
      tin.append(tid, countLine('lgdc-cw__count', n));
      if (traits) tin.appendChild(el('p', 'lgdc-text lgdc-terr__traits', traits.replace(/\.$/, '')));
      if (last) tin.appendChild(lastLink(last));
      if (subs && !subs.hidden && subs.firstElementChild) tin.appendChild(subs.firstElementChild);
      fresh.appendChild(tin);
    } else if (id !== '7' && !card.closest('.lgdc-fa-forums').querySelector('[data-forum-id="7"]')) {
      fresh = el('article', 'lgdc-cc');
      var cin = el('div', 'lgdc-cc__in');
      var ghost = el('h3', 'lgdc-cc__ghost'), ga = el('a', null, name); ga.href = link; ghost.appendChild(ga);
      cin.appendChild(ghost);
      var r = el('a', 'lgdc-cc__ring'); r.href = last ? last.href : link; r.setAttribute('aria-label', 'Dernier message'); r.appendChild(ring(last));
      if (!last) r.querySelector('.lgdc-ring__in').appendChild(el('i', 'ph-light ph-paw-print'));
      cin.appendChild(r);
      if (last) {
        var by = el('span', 'lgdc-micro lgdc-cc__by'); by.append('par ', whoNode(last, 'a'));
        cin.append(el('span', 'lgdc-cc__topic', last.title), by, el('span', 'lgdc-micro lgdc-cc__date', last.date));
      } else cin.appendChild(el('span', 'lgdc-cc__topic', 'aucun message pour l’instant'));
      cin.appendChild(countLine('lgdc-cc__count', n));
      if (subs && !subs.hidden && subs.firstElementChild) cin.appendChild(subs.firstElementChild);
      fresh.appendChild(cin);
    } else if (id === '7') {
      fresh = el('article', 'lgdc-frame lgdc-pres');
      var top = el('div', 'lgdc-pres__top');
      var h = el('h3', 'lgdc-clans__title'), ha = el('a', null, name); ha.href = link; h.appendChild(ha);
      top.append(h, el('p', 'lgdc-chev lgdc-chev--sm', plural(n[0], 'sujet') + ', ' + plural(n[1], 'message')));
      if (desc && !desc.hidden) { var dp = el('p', 'lgdc-text'); dp.innerHTML = desc.innerHTML; top.appendChild(dp); }
      fresh.appendChild(top);
      // les sous-forums par Clan deviennent les choix de la maquette
      var picks = el('div', 'lgdc-clans__picks');
      if (subs) subs.querySelectorAll('a').forEach(function (a) {
        var pick = el('a', 'lgdc-clans__pick'); pick.href = a.getAttribute('href');
        ['--g1', '--g2'].forEach(function (v) { pick.style.setProperty(v, a.style.getPropertyValue(v)); });
        var emblem = a.querySelector('.lgdc-ring');
        if (emblem) { emblem.classList.add('lgdc-ring--lg'); ['--g1', '--g2'].forEach(function (v) { emblem.style.setProperty(v, a.style.getPropertyValue(v)); }); pick.appendChild(emblem); }
        var label = el('span', 'lgdc-micro', a.textContent.trim());
        label.appendChild(el('br'));
        label.appendChild(el('b', 'lgdc-fa-validated', '…'));
        pick.appendChild(label);
        picks.appendChild(pick);
      });
      setTimeout(function () { validated(picks); }); // après la mise en place du cache, plus bas
      fresh.appendChild(picks);
      var foot = el('div', 'lgdc-pres__foot');
      if (last) foot.appendChild(lastLink(last));
      fresh.appendChild(foot);
    } else {
      fresh = el('article', 'lgdc-cw');
      var win = el('div', 'lgdc-cw__in'), body = el('div', 'lgdc-cw__body');
      var head = el('div', 'lgdc-cw__head'), hn = el('h3', 'lgdc-cw__name'), hna = el('a', null, name);
      hna.href = link; hn.appendChild(hna); if (last) head.appendChild(ring(last)); head.appendChild(hn);
      body.append(head, countLine('lgdc-cw__count', n));
      if (desc && !desc.hidden) { var p = el('p', 'lgdc-text'); p.innerHTML = desc.innerHTML; body.appendChild(p); }
      if (last) body.appendChild(lastLink(last));
      if (subs && !subs.hidden && subs.firstElementChild) body.appendChild(subs.firstElementChild);
      win.appendChild(body); fresh.appendChild(win);
    }
    if (unread) { fresh.classList.add('is-unread'); fresh.prepend(el('span', 'lgdc-tab', 'Nouveau')); }
    fresh.dataset.forumId = id;
    card.replaceWith(fresh);
  });
  // grilles de la maquette : trois cartes pour « Avant de s’inscrire », la grille Personnages pour Présentations
  document.querySelectorAll('.lgdc-fa-forums').forEach(function (grid) {
    var cc = grid.querySelectorAll(':scope > .lgdc-cc');
    if (cc.length && grid.querySelector('.lgdc-terr')) {
      // Assemblée et Hors des territoires : leur propre rangée sous les quatre Clans, comme dans la maquette
      var row = el('section', 'lgdc-grid lgdc-grid--cat2');
      cc.forEach(function (c) { row.appendChild(c); });
      grid.after(row);
    } else if (cc.length) grid.classList.add(CENTERED.indexOf(cc[0].dataset.forumId) >= 0 ? 'lgdc-grid--cat3' : 'lgdc-grid--cat2');
    if (grid.querySelector('.lgdc-pres')) grid.classList.add('lgdc-grid--perso');
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

  // personnages validés : membres du groupe de chaque Clan (sans le modérateur), reconnus à la couleur du choix
  function validated(picks) {
    var probe = document.createElement('span');
    function key(color) { probe.style.color = color; return probe.style.color; }
    function read(url) {
      return fetch(url, { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.text() : ''; })
        .then(function (html) { return new DOMParser().parseFromString(html, 'text/html'); });
    }
    function membersOf(doc) {
      var cards = doc.querySelectorAll('.lgdc-grp__members .lgdc-mb__name');
      if (doc.querySelector('.lgdc-fa-group')) return cards.length;
      var inMembers = false, n = 0;
      doc.querySelectorAll('table tr').forEach(function (tr) {
        if (tr.classList.contains('row3')) { inMembers = /membres/i.test(tr.textContent); return; }
        if (inMembers && tr.querySelector('a[href^="/u"]')) n++;
      });
      return n;
    }
    var cached = fresh('validated');
    var counts = cached ? Promise.resolve(cached.counts) : read('/groups').then(function (doc) {
      var groups = Array.from(doc.querySelectorAll('a[href^="/g"][style*="color"]'));
      return Promise.all(groups.map(function (a) {
        return read(a.getAttribute('href')).then(function (page) { return [key(a.style.color), membersOf(page)]; }).catch(function () { return null; });
      }));
    }).then(function (pairs) {
      var map = {};
      pairs.forEach(function (pair) { if (pair) map[pair[0]] = pair[1]; });
      remember('validated', { counts: map });
      return map;
    });
    counts.then(function (map) {
      picks.querySelectorAll('.lgdc-clans__pick').forEach(function (pick) {
        var n = map[key(pick.style.getPropertyValue('--g1'))];
        var b = pick.querySelector('.lgdc-fa-validated');
        b.textContent = n == null ? '' : n + (n > 1 ? ' validés' : ' validé');
      });
    }).catch(function () { picks.querySelectorAll('.lgdc-fa-validated').forEach(function (b) { b.textContent = ''; }); });
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
  /* Qui est en ligne : les variables natives (cachées dans #lgdc-qeel-raw) remplissent le balisage de la maquette. */
  var raw = document.getElementById('lgdc-qeel-raw');
  if (raw) (function () {
    function part(name) { return raw.querySelector('[data-raw="' + name + '"]'); }
    function numbers(node) { return node ? (node.textContent.match(/\d[\d\s  ]*/g) || []).map(function (n) { return parseInt(n.replace(/\D/g, ''), 10); }) : []; }
    function bold(node) { var b = node && node.querySelector('b, strong'); return b ? b.textContent.trim() : String(numbers(node)[0] || 0); }
    function fill(id, value) { var node = document.getElementById(id); if (node) node.textContent = value; return node; }
    var GROUPS = [
      { label: 'Staff', sym: 'staff', colors: ['#cb7a53', '#dfa283'] },
      { label: 'Crépuscule', key: 'crepuscule' }, { label: 'Hêtre', key: 'hetre' },
      { label: 'Orchidée', key: 'orchidee' }, { label: 'Brouillard', key: 'brouillard' }, { label: 'Solitaires', key: 'solitaires' }
    ].map(function (group) {
      var clan = group.key && clans.find(function (c) { return c.key === group.key; });
      if (clan) { group.colors = clan.colors; group.sym = clan.sym || 'clan-' + clan.key; }
      colorProbe.style.color = group.colors[0];
      group.color = colorProbe.style.color;
      group.people = [];
      return group;
    });
    // les pseudos natifs : lien de profil et couleur du groupe
    function people(node) {
      return node ? Array.from(node.querySelectorAll('a[href]')).filter(function (a) { return profileId(a.getAttribute('href')); }).map(function (a) {
        var colored = a.querySelector('[style*="color"]') || (a.style.color ? a : null);
        var color = colored ? colored.style.color : '';
        return { href: a.getAttribute('href'), name: a.textContent.trim(), color: color || '#a39c92', end: groupEnds[color] || color || '#857e74' };
      }) : [];
    }
    function who(person) {
      var a = el('a', 'lgdc-who', person.name); a.href = person.href;
      a.style.setProperty('--g1', person.color); a.style.setProperty('--g2', person.end);
      return a;
    }

    var online = numbers(part('online'));
    var total = online[0] || 0, invisible = online[2] || 0, guests = online[3] || 0;
    var list = people(part('list'));
    list.forEach(function (person) {
      var group = GROUPS.find(function (g) { return g.color === person.color; }) || GROUPS[GROUPS.length - 1];
      group.people.push(person);
    });
    var staff = GROUPS[0].people.length;
    fill('lgdc-qeel-total', total + ' en ligne');
    var split = document.getElementById('lgdc-qeel-split');
    if (split) [[staff, 'staff', 'staff'], [list.length - staff, 'membre', 'membres'], [invisible, 'invisible', 'invisibles'], [guests, 'invité', 'invités']].forEach(function (item) {
      split.appendChild(el('span', null, item[0] + ' ' + (item[0] > 1 ? item[2] : item[1])));
    });
    var groups = document.getElementById('lgdc-qeel-groups');
    if (groups) GROUPS.filter(function (g) { return g.people.length; }).forEach(function (group) {
      var li = el('li'), head = el('a', 'lgdc-qeel__g'), avs = el('div', 'lgdc-qeel__avs');
      colors(li, group); head.href = '/groups';
      var r = emblem({ sym: group.sym }, true); colors(r, group);
      head.append(r, el('span', 'lgdc-micro', group.label), el('b', 'lgdc-who', String(group.people.length)));
      group.people.forEach(function (person) {
        var a = el('a'); a.href = person.href; a.title = person.name; a.setAttribute('aria-label', person.name);
        var sq = el('span', 'lgdc-sq', person.name.split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase());
        sq.setAttribute('aria-hidden', 'true'); colors(sq, group);
        a.appendChild(sq); avs.appendChild(a);
        avatarOf(profileId(person.href)).then(function (src) {
          if (!src || !sq.isConnected) return;
          var img = el('img', 'lgdc-avatar--contain'); img.src = src; img.alt = ''; img.loading = 'lazy';
          sq.replaceChildren(img);
        });
      });
      li.append(head, avs); groups.appendChild(li);
    });

    var today = people(part('today'));
    fill('lgdc-today-chip', today.length + (today.length > 1 ? ' membres passés' : ' membre passé') + ' ces dernières 24 h');
    var names = document.getElementById('lgdc-today-names');
    if (names) today.forEach(function (person, i) { if (i) names.append(', '); names.appendChild(who(person)); });
    // « Le record du nombre d'utilisateurs en ligne est de 31 le Ven 30 Oct 2026 - 21:14 »
    var recordText = part('record') ? part('record').textContent.replace(/\s+/g, ' ').trim() : '';
    var record = recordText.match(/(\d+)\s+le\s+(.+)$/i);
    var recordNode = document.getElementById('lgdc-today-record');
    if (recordNode && record) {
      var when = record[2].toLowerCase().replace(/\s*-\s*(\d{1,2}):(\d{2})$/, ' à $1 h $2').replace(/^(\S{3}) /, '$1. ');
      recordNode.append('record : ', el('b', null, record[1]), ' connectés le ' + when);
    }
    function grouped(value) { var n = parseInt(String(value).replace(/\D/g, ''), 10); return isNaN(n) ? value : n.toLocaleString('fr-FR').replace(/\s/g, ' '); }
    fill('lgdc-stat-members', grouped(bold(part('users'))));
    fill('lgdc-stat-posts', grouped(bold(part('posts'))));
  })();

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
