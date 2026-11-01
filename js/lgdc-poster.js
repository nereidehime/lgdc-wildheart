/* Rédaction (posting_body) : la boîte des smileys devient repliable ;
   le tableau natif des dés devient une liste de lignes,
   un dé et un nombre de lancers par ligne, avec « Ajouter un dé » et un bouton pour retirer une ligne.
   Les champs gardent les noms natifs (post_dice_N, nb_rolls_N) : Forumactif les lit à l'envoi comme avant. */
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

  var table = document.getElementById('list_dice');
  if (!table) return;

  // tables de la chasse (guidebook, chapitre Le système), comme dans lgdc-forum.js
  var PREY = {
    'crépuscule': [[35, 'campagnol'], [60, 'lézard'], [85, 'oiseau'], [100, 'lapin']],
    'hêtre': [[40, 'mulot'], [70, 'oiseau'], [100, 'écureuil']],
    'orchidée': [[40, 'campagnol'], [85, 'oiseau'], [100, 'lapin']],
    'brouillard': [[35, 'grenouille'], [55, 'campagnol'], [70, 'oiseau'], [100, 'poisson']]
  };
  var HUNT = {
    campagnol: [10, 7, 7, 7], mulot: [10, 7, 7, 7], grenouille: [10, 7, 10, 7], 'lézard': [10, 7, 10, 7],
    oiseau: [7, 10, 13, 7], 'écureuil': [7, 10, 13, 7], poisson: [10, 7, 13, 7], lapin: [7, 13, 13, 10]
  };
  var STEPS = ['Guetter', 'Se faufiler', 'Bondir', 'Mordre'];
  var GESTES = [['intelligence', 'volonte'], ['dexterite', 'volonte'], ['dexterite', 'intelligence'], ['puissance', 'intelligence']];
  function stepOf(name) {
    return STEPS.findIndex(function (step) { return step.toLowerCase() === String(name).trim().toLowerCase(); });
  }

  // les dés déjà choisis (aperçu, édition) : le script natif les a ajoutés au tableau au chargement
  var model = table.querySelector('select[name^="post_dice_"]');
  var options = Array.from(model.options).map(function (o) { return [o.value, o.textContent.trim()]; });
  var chosen = Array.from(table.querySelectorAll('select[name^="post_dice_"]')).map(function (select) {
    var n = select.name.slice(10);
    var rolls = table.querySelector('input[name="nb_rolls_' + n + '"]');
    return { dice: select.value, rolls: rolls ? rolls.value : '1' };
  }).filter(function (d, i) { return d.dice || i === 0; });
  var title = (table.closest('.panel').querySelector('h3') || {}).textContent || 'Lancer de dés';

  var box = document.createElement('div');
  box.className = 'lgdc-dice';
  var list = document.createElement('ol');
  list.className = 'lgdc-dice__list';
  var add = document.createElement('button');
  add.type = 'button';
  add.className = 'lgdc-dice__add';
  add.innerHTML = '<i class="ph-light ph-plus" aria-hidden="true"></i>Ajouter un dé';
  box.append(list, add);

  // renumérote les champs dans l'ordre affiché, comme le tableau natif (post_dice_0, post_dice_1…)
  function renumber() {
    Array.from(list.children).forEach(function (row, i) {
      row.querySelector('select').name = 'post_dice_' + i;
      row.querySelector('input').name = 'nb_rolls_' + i;
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
    var value = li.querySelector('select').value;
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
    var select = current.querySelector('select');
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
    // le select natif reste dans le formulaire (post_dice_N), caché derrière le bouton du sélecteur
    var select = document.createElement('select');
    select.hidden = true;
    options.forEach(function (pair) {
      var o = document.createElement('option');
      o.value = pair[0];
      o.textContent = pair[0] ? pair[1] : 'Choisir un dé';
      if (pair[0] === dice) o.selected = true;
      select.appendChild(o);
    });
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
  chosen.forEach(function (d) { list.appendChild(row(d.dice, d.rolls)); });
  add.addEventListener('click', function () {
    list.appendChild(row('', '1'));
    renumber();
    open(list.lastChild);
  });
  renumber();

  var heading = table.closest('.panel').querySelector('h3');
  if (heading) heading.textContent = title.trim().replace(/^./, function (c) { return c.toUpperCase(); });
  table.replaceWith(box);

  // difficulté et bonus du test : écrits en fin de message sous la forme [difficulté 13 +2],
  // que la fiche de résultat lit pour donner le verdict
  var TAG = /\n*\[difficulté (\d+)(?: ([+-]\d+))?(?: chasse ([^,\]]+), ([^\]]+))?\]\s*$/;
  var hunt = null;
  var form = box.closest('form');
  var area = form && form.querySelector('textarea[name="message"]');
  function editor() {
    try { return window.jQuery && area && jQuery(area).sceditor('instance'); } catch (e) { return null; }
  }
  function getText() { var ed = editor(); return ed && ed.val ? ed.val() : (area ? area.value : ''); }
  function setText(text) { var ed = editor(); if (ed && ed.val) ed.val(text); if (area) area.value = text; }
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
  // aperçu ou édition : la balise déjà écrite remplit les champs
  var found = (area ? area.value : '').match(TAG);
  if (found) { diff.value = found[1]; bonus.value = found[2] ? +found[2] : ''; mark(); }
  if (found && found[3] && HUNT[found[3]] && stepOf(found[4]) >= 0) hunt = { prey: found[3], step: stepOf(found[4]) };
  // la balise reste hors de la zone de texte : les champs la gardent, l'envoi la réécrit
  if (found) {
    var strip = function () { var text = getText(); if (TAG.test(text)) setText(text.replace(TAG, '')); };
    strip();
    setTimeout(strip, 300);
    setTimeout(strip, 1500);
  }
  if (hunt) banner('Chasse en cours : ' + hunt.prey + ', étape ' + (hunt.step + 1) + ' sur 4 : ' + STEPS[hunt.step] + '.');
  // aperçu : la balise devient une ligne lisible (les dés ne sont lancés qu'à l'envoi)
  document.querySelectorAll('.postbody .content').forEach(function (content) {
    var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    for (var t = walker.nextNode(); t; t = walker.nextNode()) {
      var m = t.textContent.match(/\[difficulté (\d+)(?: ([+-]\d+))?(?: chasse ([^,\]]+), ([^\]]+))?\]/);
      if (!m) continue;
      t.textContent = t.textContent.replace(m[0], '');
      var plan = document.createElement('p');
      plan.className = 'lgdc-roll__note lgdc-roll__plan';
      plan.textContent = (m[3] ? 'Chasse : ' + m[3] + ', ' + m[4] + '. ' : 'Test. ') + 'Difficulté ' + m[1]
        + (m[2] ? ', bonus ' + m[2] : '') + '. Les dés seront lancés à l’envoi.';
      content.appendChild(plan);
      break;
    }
  });
  if (form) form.addEventListener('submit', function () {
    var text = getText().replace(TAG, '');
    var picked = Array.from(list.querySelectorAll('select')).some(function (s) { return s.value; });
    if (picked && +diff.value > 0) {
      var b = parseInt(bonus.value, 10);
      text += '\n[difficulté ' + (+diff.value) + (b ? ' ' + (b > 0 ? '+' : '') + b : '')
        + (hunt ? ' chasse ' + hunt.prey + ', ' + STEPS[hunt.step].toLowerCase() : '') + ']';
    }
    setText(text);
  }, true);

  // chasse jouée en RP : l'éditeur retrouve dans le sujet la chasse en cours du joueur
  // (dé Chasse, puis une étape par message) et préremplit l'étape suivante
  function huntState(posts, me) {
    var state = null;
    posts.forEach(function (post) {
      var link = post.querySelector('.lgdc-post__name a[href^="/u"]');
      var id = link && (link.getAttribute('href').match(/^\/u(\d+)/) || [])[1];
      var content = post.querySelector('.content');
      if (id !== me || !content) return;
      var html = content.innerHTML;
      var rolled = html.match(/'Chasse : ([^']+)'\s*:\s*<strong>(\d+)<\/strong>/i);
      if (rolled) {
        var clan = plain(rolled[1]);
        var table = PREY[Object.keys(PREY).find(function (k) { return plain(k) === clan; })];
        var hit = table && table.find(function (step) { return +rolled[2] <= step[0]; });
        state = hit ? { prey: hit[1], step: 0, clan: clan } : null;
        return;
      }
      var tag = content.textContent.match(/\[difficulté (\d+)(?: ([+-]\d+))?(?: chasse ([^,\]]+), ([^\]]+))?\]/);
      if (!state || !tag || tag[3] !== state.prey || stepOf(tag[4]) !== state.step) return;
      var faces = [];
      html.replace(/'([^']+)'\s*:\s*<strong>([^<]+)<\/strong>/g, function (all, die, values) {
        if (/chasse|portée/i.test(die)) return;
        values.split(/[,\s]+/).forEach(function (v) { if (/^\d+$/.test(v)) faces.push(+v); });
      });
      if (!faces.length) return;
      var score = faces.reduce(function (a, b) { return a + b; }, 0) + (tag[2] ? +tag[2] : 0);
      var pair = faces.length === 2 && faces[0] === faces[1];
      if (pair && faces[0] === 1) state = null;
      else if (pair && faces[0] >= 6) state.step += 2;
      else if (score >= +tag[1]) state.step += 1;
      else state = null;
      if (state && state.step >= 4) state = null;
    });
    return state;
  }
  // après un aperçu, l'adresse n'a plus ?t= : les champs cachés du formulaire gardent le sujet et le mode
  var hidden = function (name) { var input = form && form.querySelector('input[type="hidden"][name="' + name + '"]'); return input ? input.value : ''; };
  var topic = (location.search.match(/[?&]t=(\d+)/) || [])[1] || hidden('t');
  var replying = /mode=reply/.test(location.search) || hidden('mode') === 'reply';
  var me = window._userdata && String(window._userdata.user_id);
  var empty = !Array.from(list.querySelectorAll('select')).some(function (s) { return s.value; });
  if (topic && me && me !== '-1' && replying && empty && !found) {
    var read = function (url) {
      return fetch(url, { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.text() : ''; })
        .then(function (html) { return new DOMParser().parseFromString(html, 'text/html'); });
    };
    read('/t' + topic + '-').then(function (first) {
      // la dernière page du sujet, s'il y en a plusieurs
      var last = 0;
      first.querySelectorAll('a[href]').forEach(function (a) {
        var m = a.getAttribute('href').match(new RegExp('^/t' + topic + 'p(\\d+)-'));
        if (m && +m[1] > last) last = +m[1];
      });
      return (last ? read('/t' + topic + 'p' + last + '-') : Promise.resolve(null)).then(function (end) {
        var posts = Array.from(first.querySelectorAll('article.lgdc-post'));
        if (end) posts = posts.concat(Array.from(end.querySelectorAll('article.lgdc-post')));
        return huntState(posts, me);
      });
    }).then(function (state) {
      if (!state) return;
      return read('/u' + me).then(function (profile) {
        var stats = {};
        profile.querySelectorAll('#lgdc-prof-raw > div').forEach(function (field) {
          var dt = field.querySelector('dt');
          var dd = field.querySelector('dd');
          // « d8 » ou « 8 » ; le libellé natif peut finir par « : »
          var size = dd && (dd.textContent.match(/d?(\d+)/i) || [])[1];
          if (dt && size) stats[plain(dt.textContent.replace(/[\s:]+$/, '').trim())] = 'd' + size;
        });
        prefill(state, stats);
      });
    }).catch(function () {});
  }
  function prefill(state, stats) {
    hunt = { prey: state.prey, step: state.step };
    var dice = GESTES[state.step].map(function (attr) { return stats[attr] || ''; });
    list.innerHTML = '';
    dice.forEach(function (die) {
      var pair = options.find(function (o) { return o[0] && o[1].toLowerCase() === die; });
      list.appendChild(row(pair ? pair[0] : '', '1'));
    });
    renumber();
    diff.value = HUNT[state.prey][state.step];
    var clanBonus = (state.clan === 'crepuscule' && state.step === 0) || (state.clan === 'orchidee' && state.step === 2) ? 1 : 0;
    bonus.value = clanBonus || '';
    mark();
    banner('Chasse en cours : ' + state.prey + ', étape ' + (state.step + 1) + ' sur 4 : '
      + STEPS[state.step] + '. Dés et difficulté préremplis' + (clanBonus ? ', avec le +1 du Clan.' : '.'));
  }
  function banner(text) {
    var info = document.createElement('p');
    info.className = 'lgdc-dice__hunt';
    info.innerHTML = '<span></span><button type="button">Ne pas tester ici</button>';
    info.querySelector('span').textContent = text;
    info.querySelector('button').addEventListener('click', function () {
      hunt = null;
      list.innerHTML = '';
      list.appendChild(row('', '1'));
      renumber();
      diff.value = '';
      bonus.value = '';
      mark();
      info.remove();
    });
    box.insertBefore(info, list);
  }
})();
