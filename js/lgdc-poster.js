/* Rédaction (posting_body) : la boîte des smileys devient repliable ;
   les dés du forum remplacent le module natif : une ligne par dé, avec « Ajouter un dé »,
   et le lancer est écrit en balise dans le message (la fiche du sujet calcule les résultats). */
(function () {
  'use strict';
  var page = document.querySelector('.lgdc-fa-posting');
  if (!page) return;

  // smileys : la boîte reste à côté de l'éditeur, repliable ; le choix est retenu dans ce navigateur
  var smileys = page.querySelector('#smiley-box');
  if (smileys) {
    var KEY = 'lgdc-smileys-closed';
    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'lgdc-smileys__toggle';
    toggle.innerHTML = '<span>Smileys</span><i class="ph-light ph-caret-left lgdc-smileys__caret" aria-hidden="true"></i>';
    toggle.setAttribute('aria-controls', 'smileyContainer');
    var set = function (closed) {
      smileys.classList.toggle('is-closed', closed);
      toggle.setAttribute('aria-expanded', String(!closed));
      try { localStorage.setItem(KEY, closed ? '1' : ''); } catch (e) {}
    };
    var closed = false;
    try { closed = localStorage.getItem(KEY) === '1'; } catch (e) {}
    toggle.addEventListener('click', function () { set(!smileys.classList.contains('is-closed')); });
    smileys.prepend(toggle);
    set(closed);
    // la grille est une iframe du forum (même domaine) : on y retire la liste « Voir plus de smileys »
    var frame = smileys.querySelector('iframe');
    var dress = function () {
      try {
        var doc = frame.contentDocument;
        if (!doc || !doc.head || doc.getElementById('lgdc-smileys-style')) return;
        var style = doc.createElement('style');
        style.id = 'lgdc-smileys-style';
        style.textContent = 'select { display: none !important; } body { margin: 0; background: transparent; }' +
          ' html { scrollbar-width: thin; scrollbar-color: #cfc8bd transparent; }' +
          ' ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-thumb { background: #cfc8bd; border-radius: 8px; }';
        doc.head.appendChild(style);
      } catch (e) {}
    };
    if (frame) { frame.addEventListener('load', dress); dress(); }
  }

  // lancer de dés du forum : l'éditeur écrit une balise en fin de message ([lancer d8 d6 difficulté 13 +2],
  // [chasse Orchidée d8 d12 …], [portée]) et la fiche du sujet calcule les dés à partir des numéros
  // du message, du sujet et du compte. Le module natif de Forumactif n'est plus utilisé.
  var area = document.querySelector('textarea[name="message"]');
  var form = area && area.closest('form');
  if (!form) return;
  var table = document.getElementById('list_dice');

  // chasse en un seul lancer : les deux attributs de chaque étape (guidebook, Les gestes)
  var GESTES = [['intelligence', 'volonte'], ['dexterite', 'volonte'], ['dexterite', 'intelligence'], ['puissance', 'intelligence']];
  var TERRITORIES = ['Crépuscule', 'Hêtre', 'Orchidée', 'Brouillard'];
  var options = [['', 'Choisir un dé'], ['d4', 'd4'], ['d6', 'd6'], ['d8', 'd8'], ['d10', 'd10'], ['d12', 'd12']]
    .concat(TERRITORIES.map(function (t) { return ['chasse ' + t, 'Chasse : ' + t]; }))
    .concat([['portée', 'Portée']]);
  var title = 'Lancer de dés';

  var box = document.createElement('div');
  box.className = 'lgdc-dice';
  var list = document.createElement('ol');
  list.className = 'lgdc-dice__list';
  var add = document.createElement('button');
  add.type = 'button';
  add.className = 'lgdc-dice__add';
  add.innerHTML = '<i class="ph-light ph-plus" aria-hidden="true"></i>Ajouter un dé';
  box.append(list, add);

  // numéro de chaque ligne et bouton pour la retirer
  function renumber() {
    Array.from(list.children).forEach(function (row, i) {
      row.querySelector('.lgdc-dice__n').textContent = String(i + 1);
      row.querySelector('.lgdc-dice__remove').hidden = list.children.length < 2;
    });
  }
  // sélecteur des dés, comme la boîte des smileys : recherche et dés rangés par famille
  function family(name) {
    if (/^d\d+$/i.test(name)) return 'Dés';
    if (/^chasse/i.test(name)) return 'Chasse';
    if (/portée/i.test(name)) return 'Portée';
    return 'Autres';
  }
  var CLANS = ['crépuscule', 'hêtre', 'orchidée', 'brouillard'];
  function rank(name) {
    var i = CLANS.findIndex(function (clan) { return name.toLowerCase().indexOf(clan) >= 0; });
    return i < 0 ? 9 : i;
  }
  function plain(text) { return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
  var picker = document.createElement('div');
  picker.className = 'lgdc-dice__picker';
  picker.hidden = true;
  var search = document.createElement('input');
  search.type = 'search';
  search.className = 'lgdc-dice__search';
  search.placeholder = 'Chercher un dé';
  search.setAttribute('aria-label', 'Chercher un dé');
  var groups = document.createElement('div');
  groups.className = 'lgdc-dice__groups';
  var empty = document.createElement('p');
  empty.className = 'lgdc-micro lgdc-dice__empty';
  empty.textContent = 'Aucun dé';
  empty.hidden = true;
  picker.append(search, groups, empty);
  var current = null;
  ['Dés', 'Chasse', 'Portée', 'Autres'].forEach(function (fam) {
    var items = options.filter(function (pair) { return pair[0] && family(pair[1]) === fam; });
    items.sort(function (x, y) { return rank(x[1]) - rank(y[1]); });
    if (!items.length) return;
    var group = document.createElement('section');
    group.className = 'lgdc-dice__group';
    var h = document.createElement('p');
    h.className = 'lgdc-micro';
    h.textContent = fam;
    var grid = document.createElement('div');
    grid.className = 'lgdc-dice__grid';
    items.forEach(function (pair) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'lgdc-dice__chip';
      chip.dataset.value = pair[0];
      chip.textContent = pair[1];
      chip.addEventListener('click', function () { choose(pair[0]); });
      grid.appendChild(chip);
    });
    group.append(h, grid);
    groups.appendChild(group);
  });
  function dieName(value) {
    var pair = options.find(function (o) { return o[0] && o[0] === value; });
    return pair ? pair[1] : 'Choisir un dé';
  }
  function filter() {
    var q = plain(search.value.trim());
    var any = false;
    groups.querySelectorAll('.lgdc-dice__group').forEach(function (group) {
      var shown = 0;
      group.querySelectorAll('.lgdc-dice__chip').forEach(function (chip) {
        chip.hidden = q && plain(chip.textContent).indexOf(q) < 0;
        if (!chip.hidden) shown++;
      });
      group.hidden = !shown;
      any = any || shown > 0;
    });
    empty.hidden = any;
  }
  function open(li) {
    current = li;
    li.appendChild(picker);
    picker.hidden = false;
    search.value = '';
    filter();
    var value = li.querySelector('.lgdc-dice__value').value;
    groups.querySelectorAll('.lgdc-dice__chip').forEach(function (chip) { chip.classList.toggle('is-on', chip.dataset.value === value); });
    search.focus();
  }
  function close() {
    if (!current) return;
    picker.hidden = true;
    var button = current.querySelector('.lgdc-dice__pick');
    current = null;
    if (button) button.focus();
  }
  function choose(value) {
    if (!current) return;
    var select = current.querySelector('.lgdc-dice__value');
    select.value = value;
    current.querySelector('.lgdc-dice__pick span').textContent = dieName(value);
    close();
  }
  search.addEventListener('input', filter);
  search.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'Enter') {
      e.preventDefault();
      var first = groups.querySelector('.lgdc-dice__chip:not([hidden])');
      if (first) choose(first.dataset.value);
    }
  });
  picker.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.preventDefault(); close(); } });
  document.addEventListener('click', function (e) {
    if (current && !current.contains(e.target)) close();
  });

  function row(dice, rolls) {
    var li = document.createElement('li');
    li.className = 'lgdc-dice__row';
    var n = document.createElement('span');
    n.className = 'lgdc-dice__n';
    // le dé choisi, gardé dans un champ caché sans nom (rien n'est envoyé à Forumactif)
    var select = document.createElement('input');
    select.type = 'hidden';
    select.className = 'lgdc-dice__value';
    select.value = dice || '';
    var pick = document.createElement('button');
    pick.type = 'button';
    pick.className = 'lgdc-dice__pick';
    pick.setAttribute('aria-haspopup', 'true');
    pick.innerHTML = '<span></span><i class="ph-light ph-caret-down" aria-hidden="true"></i>';
    pick.querySelector('span').textContent = dieName(dice);
    pick.addEventListener('click', function (e) {
      e.stopPropagation();
      if (current === li) close(); else open(li);
    });
    var label = document.createElement('label');
    label.className = 'lgdc-micro lgdc-dice__rolls';
    var input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.max = '99';
    input.value = rolls || '1';
    label.append(input, document.createTextNode(' lancer(s)'));
    var remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'lgdc-dice__remove';
    remove.setAttribute('aria-label', 'Retirer ce dé');
    remove.innerHTML = '<i class="ph-light ph-x" aria-hidden="true"></i>';
    remove.addEventListener('click', function () { if (current === li) close(); li.remove(); renumber(); });
    li.append(n, select, pick, label, remove);
    return li;
  }
  list.appendChild(row('', '1'));
  add.addEventListener('click', function () {
    list.appendChild(row('', '1'));
    renumber();
    open(list.lastChild);
  });
  renumber();

  if (table && table.closest('.panel')) {
    var heading = table.closest('.panel').querySelector('h3');
    if (heading) heading.textContent = title;
    table.replaceWith(box);
  } else {
    var panel = document.createElement('div');
    panel.className = 'panel lgdc-dice-panel';
    panel.innerHTML = '<h3>' + title + '</h3>';
    panel.appendChild(box);
    (area.closest('.panel') || area).after(panel);
  }

  // la balise du lancer, en fin de message
  var TAG = /\n*\[(lancer|chasse|portée)([^\]]*)\]\s*$/i;
  function editor() {
    try { return window.jQuery && jQuery(area).sceditor('instance'); } catch (e) { return null; }
  }
  function getText() { var ed = editor(); return ed && ed.val ? ed.val() : area.value; }
  function setText(text) { var ed = editor(); if (ed && ed.val) ed.val(text); area.value = text; }
  var test = document.createElement('div');
  test.className = 'lgdc-dice__test';
  test.innerHTML = '<label class="lgdc-micro">Difficulté <input type="number" min="1" max="99" class="lgdc-dice__diff" placeholder="—"></label>'
    + '<span class="lgdc-dice__levels"></span>'
    + '<label class="lgdc-micro">Bonus <input type="number" min="-20" max="20" class="lgdc-dice__bonus" placeholder="0"></label>';
  var diff = test.querySelector('.lgdc-dice__diff');
  var bonus = test.querySelector('.lgdc-dice__bonus');
  [[7, 'Facile'], [10, 'Moyen'], [13, 'Difficile'], [16, 'Très difficile']].forEach(function (level) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'lgdc-dice__level';
    b.textContent = level[1];
    b.title = 'Difficulté ' + level[0];
    b.addEventListener('click', function () { diff.value = diff.value === String(level[0]) ? '' : level[0]; mark(); });
    test.querySelector('.lgdc-dice__levels').appendChild(b);
  });
  function mark() {
    test.querySelectorAll('.lgdc-dice__level').forEach(function (b) { b.classList.toggle('is-on', b.title === 'Difficulté ' + diff.value); });
  }
  diff.addEventListener('input', mark);
  box.insertBefore(test, add);

  // les lignes choisies → la balise
  function tag() {
    var rows = Array.from(list.children).map(function (li) {
      return { die: li.querySelector('.lgdc-dice__value').value, rolls: Math.max(1, Math.min(99, parseInt(li.querySelector('.lgdc-dice__rolls input').value, 10) || 1)) };
    }).filter(function (r) { return r.die; });
    if (!rows.length) return '';
    var dice = [];
    rows.forEach(function (r) { if (/^d\d+$/.test(r.die)) for (var n = 0; n < r.rolls; n++) dice.push(r.die); });
    var hunt = rows.find(function (r) { return /^chasse /.test(r.die); });
    if (hunt) return '[chasse ' + hunt.die.slice(7) + (dice.length ? ' ' + dice.slice(0, 8).join(' ') : '') + ']';
    if (rows.some(function (r) { return r.die === 'portée'; })) return '[portée]';
    if (!dice.length) return '';
    var b = parseInt(bonus.value, 10);
    return '[lancer ' + dice.join(' ') + (+diff.value > 0 ? ' difficulté ' + (+diff.value) + (b ? ' ' + (b > 0 ? '+' : '') + b : '') : '') + ']';
  }
  // la balise → les lignes (aperçu, édition d'un message)
  function restore(kind, inner) {
    var words = inner.trim().split(/\s+/).filter(Boolean);
    list.innerHTML = '';
    if (/^portée$/i.test(kind)) list.appendChild(row('portée', '1'));
    else {
      if (/^chasse$/i.test(kind)) {
        var territory = TERRITORIES.find(function (t) { return plain(t) === plain(words[0] || ''); });
        list.appendChild(row(territory ? 'chasse ' + territory : '', '1'));
        words = words.slice(1);
      }
      var d = words.indexOf('difficulté');
      if (d >= 0) { diff.value = words[d + 1] || ''; bonus.value = words[d + 2] ? parseInt(words[d + 2], 10) : ''; words = words.slice(0, d); }
      words.filter(function (w) { return /^d\d+$/.test(w); }).forEach(function (w) { list.appendChild(row(w, '1')); });
    }
    if (!list.children.length) list.appendChild(row('', '1'));
    renumber();
    mark();
  }
  var found = area.value.match(TAG);
  if (found) {
    restore(found[1], found[2]);
    var strip = function () { var text = getText(); if (TAG.test(text)) setText(text.replace(TAG, '')); };
    strip();
    setTimeout(strip, 300);
    setTimeout(strip, 1500);
  }
  // aperçu : le message n'a pas encore de numéro, les dés seront lancés à l'envoi ;
  // revue du sujet : les lancers déjà postés se lisent dans le sujet
  document.querySelectorAll('.postbody .content, .lgdc-fa-posting .content').forEach(function (content) {
    var preview = content.previousElementSibling && content.previousElementSibling.classList.contains('h3');
    var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    var texts = [];
    for (var t = walker.nextNode(); t; t = walker.nextNode()) if (/\[(lancer|chasse|portée)[^\]]*\]/i.test(t.textContent)) texts.push(t);
    texts.forEach(function (text) {
      text.textContent = text.textContent.replace(/\[(lancer|chasse|portée)([^\]]*)\]/gi, function (all, kind, inner) {
        if (!preview) return '(lancer de dés, à voir dans le sujet)';
        return (/^chasse/i.test(kind) ? 'Chasse :' + inner.replace(/ d\d+/g, '') : /^portée/i.test(kind) ? 'Portée' : 'Lancer :' + inner)
          + '. Les dés seront lancés à l’envoi.';
      });
    });
  });
  form.addEventListener('submit', function () {
    var text = getText().replace(TAG, '');
    var line = tag();
    setText(line ? text + '\n' + line : text);
  }, true);

  // « Lancer une chasse » : le dé Chasse du territoire, puis les deux dés de chaque étape,
  // lus dans les attributs du profil ; la fiche du message déroule la chasse
  var me = window._userdata && String(window._userdata.user_id);
  var stats = null;
  function loadStats() {
    if (stats) return stats;
    stats = fetch('/u' + me, { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.text() : ''; }).then(function (html) {
      var found = {};
      new DOMParser().parseFromString(html, 'text/html').querySelectorAll('#lgdc-prof-raw > div').forEach(function (field) {
        var dt = field.querySelector('dt');
        var dd = field.querySelector('dd');
        // « d8 » ou « 8 » ; le libellé natif peut finir par « : »
        var size = dd && (dd.textContent.match(/d?(\d+)/i) || [])[1];
        if (dt && size) found[plain(dt.textContent.replace(/[\s:]+$/, '').trim())] = 'd' + size;
      });
      return found;
    }).catch(function () { return {}; });
    return stats;
  }
  function huntWith(territory, attrs) {
    var chasse = options.find(function (o) { return o[0] && /^chasse/i.test(o[1]) && plain(o[1]).indexOf(plain(territory)) >= 0; });
    list.innerHTML = '';
    list.appendChild(row(chasse ? chasse[0] : '', '1'));
    GESTES.forEach(function (pair) {
      pair.forEach(function (attr) {
        var die = options.find(function (o) { return o[0] && o[1].toLowerCase() === attrs[attr]; });
        list.appendChild(row(die ? die[0] : '', '1'));
      });
    });
    renumber();
    diff.value = '';
    bonus.value = '';
    mark();
  }
  if (me && me !== '-1') {
    var hunt = document.createElement('div');
    hunt.className = 'lgdc-dice__hunt';
    hunt.innerHTML = '<span class="lgdc-micro">Lancer une chasse</span>';
    TERRITORIES.forEach(function (territory) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'lgdc-dice__level';
      b.textContent = territory;
      b.title = 'Chasse sur le territoire du ' + territory;
      b.addEventListener('click', function () { loadStats().then(function (attrs) { huntWith(territory, attrs); }); });
      hunt.appendChild(b);
    });
    box.insertBefore(hunt, list);
  }
})();
