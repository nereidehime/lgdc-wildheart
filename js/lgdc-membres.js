/* Liste des membres (maquette membres.html) : chaque fiche prend les couleurs du groupe
   de son pseudo, avec le Clan ; filtres par groupe sur la page affichée ; tri natif envoyé au changement. */
(function () {
  'use strict';
  var page = document.querySelector('.lgdc-fa-memberlist');
  if (!page) return;

  var probe = document.createElement('span');
  // ordre des filtres : Staff puis les Clans, toujours Crépuscule, Hêtre, Orchidée, Brouillard
  var GROUPS = [
    { color: '#cb7a53', end: '#dfa283', sym: 'staff', name: 'Staff' },
    { color: '#8e7f9a', end: '#b59ab8', sym: 'clan-crepuscule', name: 'Crépuscule' },
    { color: '#b07a4f', end: '#c99566', sym: 'clan-hetre', name: 'Hêtre' },
    { color: '#c2a24f', end: '#d1b46a', sym: 'clan-orchidee', name: 'Orchidée' },
    { color: '#8a99a4', end: '#7fa39a', sym: 'clan-brouillard', name: 'Brouillard' },
    { color: '#a39c92', end: '#857e74', sym: 'solitaires', name: 'Solitaires' }
  ].map(function (g) { probe.style.color = g.color; g.color = probe.style.color; return g; });
  function clean(text) { return text.replace(/\s+/g, ' ').trim(); }

  var members = Array.from(page.querySelectorAll('.lgdc-fa-member'));
  members.forEach(function (member) {
    var name = member.querySelector('.lgdc-mb__name');
    var colored = name.querySelector('[style*="color"]');
    var group = colored && GROUPS.find(function (g) { return g.color === colored.style.color; });
    name.textContent = clean(name.textContent);
    if (group) {
      member.style.setProperty('--g1', group.color);
      member.style.setProperty('--g2', group.end);
      member.dataset.group = group.name;
      var clan = document.createElement('p');
      clan.className = 'lgdc-mb__clan';
      clan.innerHTML = '<span class="lgdc-sym" style="--sym:var(--sym-' + group.sym + ')" aria-hidden="true"></span>';
      clan.appendChild(document.createTextNode(group.name));
      member.querySelector('.lgdc-mb__id').after(clan);
    }
    var avatar = member.querySelector('.lgdc-mb__av img');
    if (avatar) { avatar.removeAttribute('style'); avatar.alt = ''; avatar.classList.add('lgdc-avatar--contain'); }
    var seen = member.querySelector('.lgdc-mb__rank');
    seen.textContent = clean(seen.textContent);
    var joined = member.querySelector('.lgdc-mb__stats div:last-child dd');
    joined.textContent = clean(joined.textContent);
    // message privé : l'image native devient l'outil de la maquette
    var holder = member.querySelector('.lgdc-fa-mp');
    var pm = holder.querySelector('a[href]');
    if (pm) {
      var a = document.createElement('a');
      a.href = pm.getAttribute('href');
      a.className = 'lgdc-tool lgdc-mb__mp';
      a.setAttribute('aria-label', 'Message privé à ' + name.textContent);
      a.title = 'Message privé';
      a.innerHTML = '<i class="ph-light ph-envelope-simple" aria-hidden="true"></i>';
      member.querySelector('.lgdc-mb__id').appendChild(a);
      holder.remove();
    } else holder.remove();
  });

  // filtres : seulement les groupes présents sur la page
  var filters = document.getElementById('lgdc-mb-filters');
  function chip(label, value) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#';
    a.textContent = label;
    if (!value) a.setAttribute('aria-current', 'page');
    a.addEventListener('click', function (event) {
      event.preventDefault();
      filters.querySelectorAll('a').forEach(function (other) { other.removeAttribute('aria-current'); });
      a.setAttribute('aria-current', 'page');
      members.forEach(function (m) { m.hidden = !!value && m.dataset.group !== value; });
    });
    li.appendChild(a);
    filters.appendChild(li);
  }
  var present = GROUPS.filter(function (g) { return members.some(function (m) { return m.dataset.group === g.name; }); });
  if (present.length > 1) {
    chip('Tous', '');
    present.forEach(function (g) { chip(g.name, g.name); });
  } else filters.closest('nav').remove();

  // tri natif : les deux listes rejoignent le formulaire de recherche et l'envoient au changement
  var form = document.getElementById('lgdc-mb-form');
  page.querySelectorAll('.lgdc-mbs__sort select').forEach(function (select) {
    select.setAttribute('form', form.id);
    select.addEventListener('change', function () { form.submit(); });
  });
})();
