/* Liste des groupes (maquette groupes.html) : chaque groupe natif est reconnu à sa couleur.
   Staff et Solitaires en bandes, les quatre Clans en cartes 2 × 2 ; un groupe inconnu garde une bande simple.
   Le chef et les avatars viennent de la page du groupe et des profils, avec le cache de l'accueil. */
(function () {
  'use strict';
  var page = document.querySelector('.lgdc-fa-groups');
  var raw = document.getElementById('lgdc-grs-raw');
  if (!page || !raw) return;

  var QUOTA = 26; // places ouvertes aux joueurs dans chaque Clan
  var probe = document.createElement('span');
  // toujours dans cet ordre : Staff, Crépuscule, Hêtre, Orchidée, Brouillard, Solitaires
  var GROUPS = [
    { color: '#cb7a53', end: '#dfa283', sym: 'staff', desc: 'Les administrateurs et modérateurs du forum. Pour une question, un MP à l’un d’eux suffit.' },
    { color: '#8e7f9a', end: '#b59ab8', sym: 'clan-crepuscule', clan: true, terr: 'Les rochers du plateau', traits: 'Disciplinés, vigilants, endurants, froids & inflexibles' },
    { color: '#b07a4f', end: '#c99566', sym: 'clan-hetre', clan: true, terr: 'La futaie de hêtres', traits: 'Sages, pieux, hospitaliers, bornés & rancuniers' },
    { color: '#c2a24f', end: '#d1b46a', sym: 'clan-orchidee', clan: true, terr: 'Les prairies de la lisière', traits: 'Courageux, francs, fougueux, colériques & imprudents' },
    { color: '#8a99a4', end: '#7fa39a', sym: 'clan-brouillard', clan: true, terr: 'Les marais des vallons', traits: 'Rusés, discrets, débrouillards, sournois & opportunistes' },
    { color: '#a39c92', end: '#857e74', sym: 'solitaires', desc: 'Les chats sans Clan : solitaires, chats errants, chats domestiques.' }
  ].map(function (g, i) { probe.style.color = g.color; g.key = probe.style.color; g.rank = i; return g; });

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function symbol(sym) {
    var box = el('span', 'lgdc-gr__sym');
    box.innerHTML = '<span class="lgdc-sym" style="--sym:var(--sym-' + sym + ')" aria-hidden="true"></span>';
    return box;
  }
  function title(group) {
    var h = el('h2', 'lgdc-gr__name');
    var a = el('a', null, group.name);
    a.href = group.href;
    h.appendChild(a);
    return h;
  }
  function more(group) {
    var a = el('a', 'lgdc-forum-button', 'Voir les membres');
    a.href = group.href;
    return a;
  }

  var groups = Array.from(raw.querySelectorAll('li')).map(function (li) {
    var link = li.querySelector('a');
    var color = link.style.color;
    var known = GROUPS.find(function (g) { return g.key === color; });
    var count = parseInt((li.querySelector('span').textContent.match(/\d+/) || ['0'])[0], 10);
    return Object.assign({}, known || { rank: 99, sym: 'solitaires', color: color || '#a39c92', end: color || '#857e74' },
      { name: link.textContent.replace(/\s+/g, ' ').trim(), href: link.getAttribute('href'), count: count });
  }).sort(function (a, b) { return a.rank - b.rank; });

  var list = document.getElementById('lgdc-grs');
  var clans = el('div', 'lgdc-grs__clans');
  groups.forEach(function (group) {
    var card = el('article', 'lgdc-gr ' + (group.clan ? 'lgdc-gr--clan' : 'lgdc-gr--row'));
    card.style.setProperty('--g1', group.color);
    card.style.setProperty('--g2', group.end);
    var avs = el('div', 'lgdc-gr__avs');
    group.avs = avs;
    if (group.clan) {
      var head = el('header', 'lgdc-gr__head');
      var id = el('div');
      id.append(title(group), el('p', 'lgdc-micro lgdc-gr__terr', group.terr));
      head.append(symbol(group.sym), id);
      var stats = el('dl', 'lgdc-gr__stats');
      group.show = [];
      [['Membres', group.count], ['Places libres', Math.max(QUOTA - group.count, 0)]].forEach(function (pair, i) {
        var row = el('div');
        var dd = el('dd', null, String(pair[1]));
        row.append(el('dt', null, pair[0]), dd);
        stats.appendChild(row);
        group.show[i] = dd;
      });
      var chef = el('div');
      group.leader = el('dd', 'lgdc-gr__leader');
      group.leader.appendChild(el('span', 'lgdc-gr__none', '—'));
      chef.append(el('dt', null, 'Chef'), group.leader);
      stats.appendChild(chef);
      var foot = el('div', 'lgdc-gr__foot');
      foot.append(avs, more(group));
      card.append(head, el('p', 'lgdc-gr__traits', group.traits), stats, foot);
      clans.appendChild(card);
    } else {
      var body = el('div', 'lgdc-gr__body');
      body.appendChild(title(group));
      if (group.desc) body.appendChild(el('p', 'lgdc-gr__desc', group.desc));
      var count = el('p', 'lgdc-gr__count');
      group.number = el('b', null, String(group.count));
      group.word = document.createTextNode(group.count > 1 ? ' membres' : ' membre');
      count.append(group.number, group.word);
      card.append(symbol(group.sym), body, count, avs, more(group));
      list.appendChild(card);
    }
    // les Clans s'insèrent à leur place, entre le Staff et les Solitaires
    if (group.clan && !clans.isConnected) list.appendChild(clans);
  });
  raw.remove();

  /* chef et avatars : page du groupe, puis profils (cache partagé avec l'accueil, une heure) */
  var CACHE_TTL = 3600000;
  var cache = {};
  try { cache = JSON.parse(sessionStorage.getItem('lgdc-recent-avatars')) || {}; } catch (e) {}
  function remember(key, value) {
    cache[key] = Object.assign({ at: Date.now() }, value);
    try { sessionStorage.setItem('lgdc-recent-avatars', JSON.stringify(cache)); } catch (e) {}
  }
  function getHTML(url) {
    return fetch(url, { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error(url);
      return r.text();
    }).then(function (html) { return new DOMParser().parseFromString(html, 'text/html'); });
  }
  function avatarOf(id) {
    var hit = cache[id];
    if (hit && Date.now() - hit.at < CACHE_TTL && typeof hit.src === 'string') return Promise.resolve(hit.src);
    return getHTML('/u' + id).then(function (doc) {
      var img = doc.querySelector('#user_avatar img, .lgdc-prof__av img, .lgdc-fa-av img');
      var src = img ? new URL(img.getAttribute('src'), location.href).href : '';
      if (/\/(pp-blank|no_?avatar)[^/]*$/i.test(src)) src = '';
      remember(id, { src: src });
      return src;
    }).catch(function () { return ''; });
  }
  groups.forEach(function (group) {
    if (!group.count || !group.href) return;
    getHTML(group.href).then(function (doc) {
      // le compte natif inclut le modérateur du groupe (le Staff, dans chaque Clan) : seuls les chats de « Membres du groupe » comptent
      var seen = {};
      var staff = group.sym === 'staff';
      var inMembers = staff;
      var members = [];
      doc.querySelectorAll('table tr').forEach(function (tr) {
        // pour le Staff, le modérateur du groupe en fait partie
        if (tr.classList.contains('row3')) { inMembers = staff || /membres/i.test(tr.textContent); return; }
        var a = tr.querySelector('a[href^="/u"]');
        var id = a && a.getAttribute('href').slice(2);
        if (!inMembers || !id || !/^\d+$/.test(id) || seen[id]) return;
        seen[id] = true;
        members.push({ id: id, name: a.textContent.replace(/\s+/g, ' ').trim() });
      });
      var total = members.length;
      if (group.show) { group.show[0].textContent = total; group.show[1].textContent = Math.max(QUOTA - total, 0); }
      if (group.number) { group.number.textContent = total; group.word.textContent = total > 1 ? ' membres' : ' membre'; }
      if (group.leader) {
        var chef = members.find(function (m) { return /^Étoile\s/.test(m.name); });
        if (chef) {
          var link = el('a', null, chef.name);
          link.href = '/u' + chef.id;
          group.leader.replaceChildren(link);
        }
      }
      members.slice(0, 5).forEach(function (m) {
        var a = el('a');
        a.href = '/u' + m.id;
        a.title = m.name;
        group.avs.appendChild(a);
        avatarOf(m.id).then(function (src) {
          if (!src) { a.textContent = m.name.split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2); a.classList.add('lgdc-gr__initials'); return; }
          var img = el('img', 'lgdc-avatar--contain');
          img.src = src; img.alt = ''; img.loading = 'lazy';
          a.appendChild(img);
        });
      });
    }).catch(function () {});
  });
})();
