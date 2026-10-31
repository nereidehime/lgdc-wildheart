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
  function row(dice, rolls) {
    var li = document.createElement('li');
    li.className = 'lgdc-dice__row';
    var n = document.createElement('span');
    n.className = 'lgdc-dice__n';
    var select = document.createElement('select');
    select.setAttribute('aria-label', 'Dé');
    options.forEach(function (pair) {
      var o = document.createElement('option');
      o.value = pair[0];
      o.textContent = pair[0] ? pair[1] : 'Choisir un dé';
      if (pair[0] === dice) o.selected = true;
      select.appendChild(o);
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
    remove.addEventListener('click', function () { li.remove(); renumber(); });
    li.append(n, select, label, remove);
    return li;
  }
  chosen.forEach(function (d) { list.appendChild(row(d.dice, d.rolls)); });
  add.addEventListener('click', function () {
    list.appendChild(row('', '1'));
    renumber();
    list.lastChild.querySelector('select').focus();
  });
  renumber();

  var heading = table.closest('.panel').querySelector('h3');
  if (heading) heading.textContent = title.trim().replace(/^./, function (c) { return c.toUpperCase(); });
  table.replaceWith(box);
})();
