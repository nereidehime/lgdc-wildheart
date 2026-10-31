/* Profil d'un personnage (maquette profil.html) : les champs natifs sont rangés
   dans l'identité, la fiche et le système. Les éléments field_id… sont déplacés tels quels,
   l'édition rapide de Forumactif continue donc de marcher. */
(function () {
  'use strict';
  var page = document.querySelector('.lgdc-fa-profile');
  if (!page) return;
  var raw = document.getElementById('lgdc-prof-raw');

  // couleurs du groupe : dégradé, symbole et nom, comme sur les sujets
  var probe = document.createElement('span');
  var GROUPS = [
    { color: '#8e7f9a', end: '#b59ab8', sym: 'clan-crepuscule', name: 'Clan du Crépuscule' },
    { color: '#b07a4f', end: '#c99566', sym: 'clan-hetre', name: 'Clan du Hêtre' },
    { color: '#c2a24f', end: '#d1b46a', sym: 'clan-orchidee', name: 'Clan de l’Orchidée' },
    { color: '#8a99a4', end: '#7fa39a', sym: 'clan-brouillard', name: 'Clan du Brouillard' },
    { color: '#a39c92', end: '#857e74', sym: 'solitaires', name: 'Solitaires' },
    { color: '#cb7a53', end: '#dfa283', sym: 'staff', name: 'Staff' }
  ].map(function (g) { probe.style.color = g.color; g.color = probe.style.color; return g; });

  var DICE = ['Dextérité', 'Intelligence', 'Puissance', 'Volonté', 'Points de vie', 'Esquive', 'Vies'];
  var SYSTEM = ['Capacité de Clan', 'Capacités de chef', 'Astuces', 'Bonus de gestes', 'Améliorations'];
  var FICHE = ['Âge', 'Genre', 'Rang', 'Mentor', 'Apprenti'];
  var LINKS = { 'Fiche de liens': 'ph-link-simple', 'Chronologie': 'ph-clock-counter-clockwise', 'Présentation': 'ph-book-open-text' };

  function clean(text) { return text.replace(/\s+/g, ' ').replace(/\s*:\s*$/, '').trim(); }
  function valueOf(field) {
    var dd = field.querySelector('dd');
    var shown = dd.querySelector('.field_uneditable') || dd;
    return clean(shown.textContent);
  }
  function editable(field) { return !!field.querySelector('.field_editable'); }
  // un champ vide n'est gardé que pour qui peut le remplir
  function keep(field) {
    if (valueOf(field)) return true;
    if (!editable(field)) return false;
    var shown = field.querySelector('.field_uneditable');
    if (shown) shown.textContent = '—';
    return true;
  }

  // adresse d'un champ de lien : un lien natif ou une adresse tapée
  function linkOf(field) {
    var a = field.querySelector('dd a[href]');
    var href = a ? a.getAttribute('href') : valueOf(field);
    return /^(https?:)?\/\/|^\//.test(href) ? href : '';
  }
  // affichage d'un champ selon son rôle : citation, disponibilité, bouton de fiche
  function decorate(field) {
    var box = field.querySelector('.field_uneditable') || field.querySelector('dd');
    var text = clean(box.textContent);
    var empty = !text || text === '—';
    field.classList.toggle('is-empty', empty);
    if (field.closest('.lgdc-prof__quote')) {
      if (empty) box.textContent = 'Ajouter une citation';
      else if (!/^«/.test(text)) box.textContent = '« ' + text + ' »';
    }
    if (field.classList.contains('lgdc-prof__dispo')) field.classList.toggle('is-off', /indispo|^non|pas dispo|occup/i.test(text));
    if (field.dataset.icon) {
      var href = linkOf(field);
      var label = field.querySelector('dt').textContent;
      var b = document.createElement(href ? 'a' : 'span');
      if (href) b.href = href;
      b.className = 'lgdc-forum-button' + (href ? '' : ' is-empty');
      b.innerHTML = '<i class="ph-light ' + field.dataset.icon + '" aria-hidden="true"></i>';
      b.appendChild(document.createTextNode(label));
      box.replaceChildren(b);
    }
  }

  var fields = {};
  Array.from(raw.children).forEach(function (field) {
    var dt = field.querySelector('dt');
    var label = clean(dt.textContent);
    dt.textContent = label;
    fields[label] = field;
  });
  function take(label) { var f = fields[label]; delete fields[label]; return f; }

  // identité : nom, groupe, citation
  var nameBox = page.querySelector('.lgdc-fa-name');
  var colored = nameBox.querySelector('[style*="color"]');
  var group = colored && GROUPS.find(function (g) { return g.color === colored.style.color; });
  if (group) {
    page.style.setProperty('--g1', group.color);
    page.style.setProperty('--g2', group.end);
  }
  nameBox.textContent = clean(nameBox.textContent);
  var rank = page.querySelector('.lgdc-prof__rank');
  rank.textContent = clean(rank.textContent);
  if (!rank.textContent) rank.remove();
  var where = nameBox;
  if (group) {
    var line = document.createElement('p');
    line.className = 'lgdc-prof__clan';
    line.innerHTML = '<span class="lgdc-sym" style="--sym:var(--sym-' + group.sym + ')" aria-hidden="true"></span>';
    line.appendChild(document.createTextNode(group.name));
    where.after(line);
    where = line;
  }
  var quote = take('Citation');
  if (quote && keep(quote)) {
    var block = document.createElement('blockquote');
    block.className = 'lgdc-prof__quote';
    block.appendChild(quote);
    quote.querySelector('dt').remove();
    where.after(block);
    decorate(quote);
  }
  var avatar = page.querySelector('.lgdc-fa-av img');
  if (avatar) { avatar.removeAttribute('style'); avatar.classList.add('lgdc-avatar--contain'); }

  // chiffres : messages, disponibilité, arrivée
  var stats = page.querySelector('.lgdc-prof__stats');
  var posts = take('Messages');
  if (posts) {
    // liens natifs « Trouver tous les sujets… » retirés, le chiffre seul reste
    posts.querySelector('dd').textContent = valueOf(posts).match(/\d[\d\s.]*/) ? valueOf(posts).match(/\d[\d\s.]*/)[0].trim() : '0';
    stats.appendChild(posts);
  }
  var dispo = take('Pour un RP');
  if (dispo && keep(dispo)) {
    dispo.classList.add('lgdc-prof__dispo');
    stats.appendChild(dispo);
    decorate(dispo);
  }
  var joined = take('Date d\'inscription') || take('Date d’inscription');
  if (joined) {
    var date = valueOf(joined);
    joined.querySelector('dt').textContent = 'Arrivée';
    stats.appendChild(joined);
    page.querySelector('.lgdc-fa-joined').textContent = 'inscription le ' + date + ', ';
  }

  // boutons : message privé (champ contact natif) puis les trois fiches
  var actions = page.querySelector('.lgdc-prof__actions');
  function button(href, label, icon, primary) {
    var a = document.createElement('a');
    a.href = href;
    a.className = 'lgdc-forum-button' + (primary ? ' lgdc-forum-button--primary' : '');
    a.innerHTML = '<i class="ph-light ' + icon + '" aria-hidden="true"></i>';
    a.appendChild(document.createTextNode(label));
    actions.appendChild(a);
  }
  var pm = page.querySelector('.lgdc-fa-contact a[href*="privmsg"], .lgdc-fa-contact a[href*="mode=post"]');
  var mp = take('Messages privés');
  if (!pm && mp) pm = mp.querySelector('a[href]');
  if (pm) button(pm.getAttribute('href'), 'Message privé', 'ph-envelope-simple', true);
  Object.keys(LINKS).forEach(function (label) {
    var field = take(label);
    if (!field) return;
    if (!linkOf(field) && !editable(field)) return;
    keep(field);
    field.dataset.icon = LINKS[label];
    field.classList.add('lgdc-prof__linkfield');
    actions.appendChild(field);
    decorate(field);
  });

  // la fiche, le crédit, le système
  function fill(list, labels) {
    labels.forEach(function (label) { var f = take(label); if (f && keep(f)) list.appendChild(f); });
    return list.children.length;
  }
  var fiche = document.getElementById('lgdc-prof-fiche');
  fill(fiche, FICHE);
  var credit = document.getElementById('lgdc-prof-credit');
  var c = take('Crédit de l’avatar') || take('Crédit de l\'avatar');
  if (c && keep(c)) credit.appendChild(c); else credit.remove();
  // les champs ajoutés plus tard par le staff vont dans la fiche
  var player = take('Joué par');
  Object.keys(fields).forEach(function (label) {
    if (DICE.indexOf(label) < 0 && SYSTEM.indexOf(label) < 0) { var f = take(label); if (keep(f)) fiche.appendChild(f); }
  });
  var dice = document.getElementById('lgdc-prof-dice');
  var sysl = document.getElementById('lgdc-prof-sysl');
  var hasSystem = fill(dice, DICE) + fill(sysl, SYSTEM);
  if (!dice.children.length) dice.remove();
  if (!sysl.children.length) sysl.remove();
  // un panneau vide disparaît avec son titre
  [[fiche.closest('.lgdc-frame'), fiche.children.length || credit.isConnected],
   [page.querySelector('.lgdc-prof__sys').closest('.lgdc-frame'), hasSystem]].forEach(function (pair) {
    if (!pair[1]) { pair[0].previousElementSibling.remove(); pair[0].remove(); }
  });

  // le joueur ou la joueuse
  var who = document.getElementById('lgdc-prof-player');
  if (player && keep(player)) {
    player.querySelector('dt').remove();
    who.appendChild(player);
  } else { who.previousElementSibling.remove(); who.remove(); }
  var online = page.querySelector('.lgdc-fa-online');
  if (online) online.textContent = clean(online.textContent).toLowerCase();
  var admin = page.querySelector('.lgdc-fa-profile-admin');
  if (!admin.textContent.trim() && !admin.querySelector('a, button')) admin.remove();
  raw.remove();

  /* Édition sur place : un crayon par champ modifiable, puis Valider ou Annuler.
     Même envoi que le script natif de Forumactif (U_AJAX_PROFILE), qui répond { id: html } ou « error : … ». */
  var ajax = page.dataset.ajax;
  if (!ajax || !window.jQuery) return;
  function tool(label, icon, className) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = className;
    b.setAttribute('aria-label', label);
    b.title = label;
    b.innerHTML = '<i class="ph-light ' + icon + '" aria-hidden="true"></i>';
    return b;
  }
  function text(label, className) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = className;
    b.textContent = label;
    return b;
  }
  function close(field) {
    field.classList.remove('is-editing');
    field.querySelector('.field_editable').classList.add('invisible');
    field.querySelector('.field_uneditable').classList.remove('invisible');
    var error = field.querySelector('.lgdc-prof__error');
    if (error) error.remove();
  }
  function shown(field, html) {
    var box = field.querySelector('.field_uneditable');
    box.innerHTML = html;
    if (!clean(box.textContent)) box.textContent = '—';
    decorate(field);
  }
  function save(field) {
    var content = [];
    field.querySelectorAll('.field_editable [name]').forEach(function (input) {
      if (/radio|checkbox/.test(input.type) && !input.checked) return;
      content.push([input.name, input.value]);
    });
    field.classList.add('is-saving');
    window.jQuery.post(ajax, {
      id: field.id.substring(8), user: page.dataset.user, active: page.dataset.active,
      content: JSON.stringify(content), tid: page.dataset.tid
    }, function (data) {
      field.classList.remove('is-saving');
      Object.keys(data).forEach(function (id) {
        var target = document.getElementById('field_id' + id);
        if (!target) return;
        var item = String(data[id]);
        if (item.indexOf('error : ') === 0) {
          var error = target.querySelector('.lgdc-prof__error') || document.createElement('p');
          error.className = 'lgdc-micro lgdc-prof__error';
          error.textContent = item.substring(8);
          target.querySelector('.lgdc-prof__editbar').before(error);
        } else { shown(target, item); close(target); }
      });
    }, 'json').fail(function () {
      field.classList.remove('is-saving');
      var error = field.querySelector('.lgdc-prof__error') || document.createElement('p');
      error.className = 'lgdc-micro lgdc-prof__error';
      error.textContent = 'L’enregistrement a échoué, réessaie.';
      field.querySelector('.lgdc-prof__editbar').before(error);
    });
  }
  page.querySelectorAll('[id^="field_id"]').forEach(function (field) {
    var editor = field.querySelector('.field_editable');
    if (!editor || !field.querySelector('.field_uneditable')) return;
    field.classList.add('lgdc-prof__editable');
    var pencil = tool('Modifier', 'ph-pencil-simple-line', 'lgdc-prof__pen');
    field.appendChild(pencil);
    var bar = document.createElement('div');
    bar.className = 'lgdc-prof__editbar';
    var ok = text('Valider', 'lgdc-prof__ok');
    var cancel = text('Annuler', 'lgdc-prof__cancel');
    bar.append(ok, cancel);
    editor.appendChild(bar);
    pencil.addEventListener('click', function () {
      field.classList.add('is-editing');
      editor.classList.remove('invisible');
      field.querySelector('.field_uneditable').classList.add('invisible');
      var input = editor.querySelector('input:not([type=hidden]), textarea, select');
      if (input) input.focus();
    });
    ok.addEventListener('click', function () { save(field); });
    cancel.addEventListener('click', function () { close(field); });
    editor.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') { event.preventDefault(); save(field); }
      if (event.key === 'Escape') close(field);
    });
  });
})();
