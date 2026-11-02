/* Groupes : la liste (maquette groupes.html) et la page d'un groupe. Chaque groupe natif est reconnu à sa couleur.
   Liste : Staff et Solitaires en bandes, les quatre Clans en cartes 2 × 2 ; un groupe inconnu garde une bande simple.
   Page d'un groupe : en-tête aux couleurs du groupe, membres en cartes comme dans la liste des membres.
   Le chef et les avatars viennent de la page du groupe et des profils, avec le cache de l'accueil. */
(function () {
  'use strict';
  var listPage = document.querySelector('.lgdc-fa-groups');
  var groupPage = document.querySelector('.lgdc-fa-group');
  if (!listPage && !groupPage) return;

  var QUOTA = 26; // places ouvertes aux joueurs dans chaque Clan
  var probe = document.createElement('span');
  // toujours dans cet ordre : Staff, Crépuscule, Hêtre, Orchidée, Brouillard, Solitaires
  var GROUPS = [
    { color: '#cb7a53', end: '#dfa283', sym: 'staff', desc: 'Les administrateurs et modérateurs du forum. Pour une question, écris-leur sur le forum ou sur le Discord.' },
    { color: '#8e7f9a', end: '#b59ab8', sym: 'clan-crepuscule', clan: true, terr: 'Les rochers du plateau', traits: 'Disciplinés, vigilants, endurants, froids & inflexibles' },
    { color: '#b07a4f', end: '#c99566', sym: 'clan-hetre', clan: true, terr: 'La futaie de hêtres', traits: 'Sages, pieux, hospitaliers, bornés & rancuniers' },
    { color: '#c2a24f', end: '#d1b46a', sym: 'clan-orchidee', clan: true, terr: 'Les prairies de la lisière', traits: 'Courageux, francs, fougueux, colériques & imprudents' },
    { color: '#8a99a4', end: '#7fa39a', sym: 'clan-brouillard', clan: true, terr: 'Les marais des vallons', traits: 'Rusés, discrets, débrouillards, sournois & opportunistes' },
    { color: '#a39c92', end: '#857e74', sym: 'solitaires', desc: 'Les chats sans Clan : solitaires, chats errants, chats domestiques.' }
  ].map(function (g, i) { probe.style.color = g.color; g.key = probe.style.color; g.rank = i; return g; });
  function known(color) { return GROUPS.find(function (g) { return g.key === color; }); }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function clean(text) { return text.replace(/\s+/g, ' ').trim(); }
  function symbol(sym) {
    var box = el('span', 'lgdc-gr__sym');
    box.innerHTML = '<span class="lgdc-sym" style="--sym:var(--sym-' + sym + ')" aria-hidden="true"></span>';
    return box;
  }
  function stat(list, label, value) {
    var row = el('div');
    var dd = el('dd', null, String(value));
    row.append(el('dt', null, label), dd);
    list.appendChild(row);
    return dd;
  }
  function plural(n) { return n > 1 ? ' membres' : ' membre'; }
  function isChef(name) { return /^Étoile\s/.test(name); }

  /* avatars : profils, avec le cache partagé avec l'accueil (une heure) */
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
  // remplit un lien d'avatar : l'image, ou les initiales quand le membre n'en a pas
  function fillAvatar(link, id, name) {
    avatarOf(id).then(function (src) {
      if (!src) {
        link.textContent = name.split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2);
        link.classList.add('lgdc-gr__initials');
        return;
      }
      var img = el('img', 'lgdc-avatar--contain');
      img.src = src; img.alt = ''; img.loading = 'lazy';
      link.replaceChildren(img);
    });
  }
  function idOf(href) { var m = /^\/u(\d+)/.exec(href || ''); return m ? m[1] : null; }

  if (listPage) {
    var raw = document.getElementById('lgdc-grs-raw');
    if (!raw) return;
    // groupes techniques de Forumactif : administrateurs (invisible, vu seulement par le staff) et compte fondateur
    var groups = Array.from(raw.querySelectorAll('li')).filter(function (li) {
      return !/^(administrateurs|compte fondateur)$/i.test(clean(li.querySelector('a').textContent));
    }).map(function (li) {
      var link = li.querySelector('a');
      var color = link.style.color;
      var count = parseInt((li.querySelector('span').textContent.match(/\d+/) || ['0'])[0], 10);
      return Object.assign({}, known(color) || { rank: 99, sym: 'solitaires', color: color || '#a39c92', end: color || '#857e74' },
        { name: clean(link.textContent), href: link.getAttribute('href'), count: count });
    }).sort(function (a, b) { return a.rank - b.rank; });

    var title = function (group) {
      var h = el('h2', 'lgdc-gr__name');
      var a = el('a', null, group.name);
      a.href = group.href;
      h.appendChild(a);
      return h;
    };
    var more = function (group) {
      var a = el('a', 'lgdc-forum-button', 'Voir les membres');
      a.href = group.href;
      return a;
    };
    var list = document.getElementById('lgdc-grs');
    var clans = el('div', 'lgdc-grs__clans');
    groups.forEach(function (group) {
      var card = el('article', 'lgdc-gr ' + (group.clan ? 'lgdc-gr--clan' : 'lgdc-gr--row'));
      card.style.setProperty('--g1', group.color);
      card.style.setProperty('--g2', group.end);
      group.avs = el('div', 'lgdc-gr__avs');
      if (group.clan) {
        var head = el('header', 'lgdc-gr__head');
        var id = el('div');
        id.append(title(group), el('p', 'lgdc-micro lgdc-gr__terr', group.terr));
        head.append(symbol(group.sym), id);
        var stats = el('dl', 'lgdc-gr__stats');
        group.show = [stat(stats, 'Membres', group.count), stat(stats, 'Places libres', Math.max(QUOTA - group.count, 0))];
        group.leader = stat(stats, 'Chef', '');
        group.leader.className = 'lgdc-gr__leader';
        group.leader.replaceChildren(el('span', 'lgdc-gr__none', '—'));
        var foot = el('div', 'lgdc-gr__foot');
        foot.append(group.avs, more(group));
        card.append(head, el('p', 'lgdc-gr__traits', group.traits), stats, foot);
        clans.appendChild(card);
      } else {
        var body = el('div', 'lgdc-gr__body');
        body.appendChild(title(group));
        if (group.desc) body.appendChild(el('p', 'lgdc-gr__desc', group.desc));
        var count = el('p', 'lgdc-gr__count');
        group.number = el('b', null, String(group.count));
        group.word = document.createTextNode(plural(group.count));
        count.append(group.number, group.word);
        card.append(symbol(group.sym), body, count, group.avs, more(group));
        list.appendChild(card);
      }
      // les Clans s'insèrent à leur place, entre le Staff et les Solitaires
      if (group.clan && !clans.isConnected) list.appendChild(clans);
    });
    raw.remove();

    groups.forEach(function (group) {
      if (!group.count || !group.href) return;
      getHTML(group.href).then(function (doc) {
        // le compte natif inclut le modérateur du groupe (le Staff, dans chaque Clan) : seuls les chats de « Membres du groupe » comptent ;
        // pour le Staff, le modérateur en fait partie. La page du groupe peut être native ou déjà habillée.
        var staff = group.sym === 'staff';
        var seen = {};
        var members = [];
        var push = function (a) {
          var id = a && idOf(a.getAttribute('href'));
          if (!id || seen[id]) return;
          seen[id] = true;
          members.push({ id: id, name: clean(a.textContent) });
        };
        if (doc.querySelector('.lgdc-fa-group')) {
          if (staff) push(doc.querySelector('.lgdc-fa-group-mod .lgdc-mb__name'));
          doc.querySelectorAll('.lgdc-grp__members .lgdc-mb__name').forEach(push);
        } else {
          var inMembers = staff;
          doc.querySelectorAll('table tr').forEach(function (tr) {
            if (tr.classList.contains('row3')) { inMembers = staff || /membres/i.test(tr.textContent); return; }
            if (inMembers) push(tr.querySelector('a[href^="/u"]'));
          });
        }
        var total = members.length;
        if (group.show) { group.show[0].textContent = total; group.show[1].textContent = Math.max(QUOTA - total, 0); }
        if (group.number) { group.number.textContent = total; group.word.textContent = plural(total); }
        if (group.leader) {
          var chef = members.find(function (m) { return isChef(m.name); });
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
          fillAvatar(a, m.id, m.name);
        });
      }).catch(function () {});
    });
    return;
  }

  /* page d'un groupe */
  var nameBox = groupPage.querySelector('.lgdc-fa-group-name');
  var colored = nameBox.querySelector('[style*="color"]');
  var group = (colored && known(colored.style.color)) || null;
  nameBox.textContent = clean(nameBox.textContent);
  if (group) {
    groupPage.style.setProperty('--g1', group.color);
    groupPage.style.setProperty('--g2', group.end);
  }
  var desc = groupPage.querySelector('.lgdc-forum-description');
  if (!clean(desc.textContent)) {
    if (group && (group.desc || group.terr)) desc.textContent = group.desc || group.terr + '. ' + group.traits + '.';
    else desc.remove();
  }
  if (group) nameBox.prepend(symbol(group.sym));

  // le modérateur : membre à part entière du Staff, simple mention dans les autres groupes
  var mod = groupPage.querySelector('.lgdc-fa-group-mod');
  var modCard = mod.querySelector('.lgdc-mb');
  var modName = modCard.querySelector('.lgdc-mb__name');
  var grid = groupPage.querySelector('.lgdc-grp__members');
  var staffGroup = group && group.sym === 'staff';
  if (clean(modName.textContent)) {
    if (staffGroup) {
      grid.prepend(modCard);
      var empty = groupPage.querySelector('.lgdc-grp__empty');
      if (empty) empty.remove();
    }
    else {
      var line = groupPage.querySelector('.lgdc-grp__status');
      var link = el('a', null, clean(modName.textContent));
      link.href = modName.getAttribute('href');
      line.append(document.createTextNode(clean(line.textContent) ? ', modéré par ' : 'Modéré par '), link);
    }
  }
  mod.remove();

  var cards = Array.from(grid.querySelectorAll('.lgdc-fa-member'));
  cards.forEach(function (card) {
    var name = card.querySelector('.lgdc-mb__name');
    var person = name.querySelector('[style*="color"]');
    var own = person && known(person.style.color);
    var shade = own || group;
    if (shade) { card.style.setProperty('--g1', shade.color); card.style.setProperty('--g2', shade.end); }
    name.textContent = clean(name.textContent);
    var id = idOf(name.getAttribute('href'));
    if (isChef(name.textContent) && !card.querySelector('.lgdc-mb__rank')) card.querySelector('.lgdc-mb__id').appendChild(el('p', 'lgdc-micro lgdc-mb__rank', 'Chef'));
    var posts = card.querySelector('.lgdc-mb__stats dd');
    posts.textContent = clean(posts.textContent) || '0';
    var av = card.querySelector('.lgdc-mb__av');
    if (id) fillAvatar(av, id, name.textContent);
  });
  // le chef en premier, comme dans les allégeances
  cards.filter(function (c) { return isChef(c.querySelector('.lgdc-mb__name').textContent); }).forEach(function (c) {
    grid.insertBefore(c, staffGroup ? grid.children[1] || null : grid.firstChild);
  });
  if (!cards.length) grid.remove();

  // en-tête : chiffres du Clan
  if (group && group.clan) {
    var members = cards.length;
    var stats = el('dl', 'lgdc-gr__stats lgdc-grp__stats');
    stat(stats, 'Membres', members);
    stat(stats, 'Places libres', Math.max(QUOTA - members, 0));
    groupPage.querySelector('.lgdc-grp__status').before(stats);
  }
  var status = groupPage.querySelector('.lgdc-grp__status');
  if (!clean(status.textContent) && !status.querySelector('a')) status.remove();
  var join = groupPage.querySelector('.lgdc-grp__join');
  if (!join.querySelector('[type=submit]')) join.remove();
  var pages = groupPage.querySelector('.lgdc-forum-end');
  if (!clean(pages.textContent)) pages.remove();
})();
