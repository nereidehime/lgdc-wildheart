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
    var text = quote.querySelector('.field_uneditable') || quote.querySelector('dd');
    var said = clean(text.textContent);
    if (said && said !== '—' && !/^«/.test(said)) text.textContent = '« ' + said + ' »';
    where.after(block);
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
    if (/indispo|^non|pas dispo|occup/i.test(valueOf(dispo))) dispo.classList.add('is-off');
    stats.appendChild(dispo);
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
    var link = field.querySelector('dd a[href]');
    var href = link ? link.getAttribute('href') : valueOf(field);
    if (/^(https?:)?\/|^\//.test(href)) button(href, label, LINKS[label]);
    else if (editable(field)) { keep(field); actions.appendChild(field); }
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
})();
