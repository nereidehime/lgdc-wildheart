/* Recherche (maquettes recherche.html et resultats-recherche.html).
   Formulaire : la liste native des forums perd ses « |-- » et ses lignes vides, la première ligne devient « Tous les forums ».
   Résultats par messages : chaque carte prend la couleur du groupe de l'auteur. */
(function () {
  'use strict';
  var hits = document.querySelector('.lgdc-fa-results-posts');
  if (hits) {
    var ends = {};
    var probe = document.createElement('span');
    [['#cb7a53', '#dfa283'], ['#8e7f9a', '#b59ab8'], ['#b07a4f', '#c99566'], ['#c2a24f', '#d1b46a'], ['#8a99a4', '#7fa39a'], ['#a39c92', '#857e74']].forEach(function (pair) {
      probe.style.color = pair[0];
      ends[probe.style.color] = pair[1];
    });
    hits.querySelectorAll('.lgdc-search-hit').forEach(function (hit) {
      var box = hit.querySelector('.lgdc-fa-hit-who');
      var colored = box.querySelector('[style*="color"]');
      var link = box.querySelector('a[href]');
      var who = document.createElement(link ? 'a' : 'span');
      if (link) who.href = link.getAttribute('href');
      who.className = 'lgdc-who';
      who.textContent = box.textContent.replace(/\s+/g, ' ').trim();
      var color = colored ? colored.style.color : '#a39c92';
      hit.style.setProperty('--g1', color);
      hit.style.setProperty('--g2', ends[color] || color);
      who.style.setProperty('--g1', color);
      who.style.setProperty('--g2', ends[color] || color);
      box.replaceWith(who);
      // lancer de dés du forum : la balise ne se calcule que dans le sujet
      hit.querySelectorAll('.lgdc-search-hit__excerpt').forEach(function (text) {
        if (/\[(lancer|chasse|portée)[^\]]*\]/i.test(text.innerHTML)) text.innerHTML = text.innerHTML.replace(/\[(lancer|chasse|portée)[^\]]*\]/gi, '(lancer de dés, à voir dans le sujet)');
      });
      // « 1 Réponses » natif : accord et minuscule
      var forum = hit.querySelector('.lgdc-search-hit__forum');
      forum.lastChild.textContent = forum.lastChild.textContent.replace(/(\d+)\s*\S+\s*$/, function (m, n) { return n + (n === '0' || n === '1' ? ' réponse' : ' réponses'); });
      var time = hit.querySelector('time');
      time.textContent = time.textContent.replace(/\s+/g, ' ').trim();
    });
  }

  var page = document.querySelector('.lgdc-fa-search');
  if (!page) return;

  var select = page.querySelector('select[name="search_where"]');
  if (select) {
    var first = true;
    Array.from(select.options).forEach(function (option) {
      var raw = option.textContent;
      var label = raw.replace(/^[|\s -]+/, '').trim();
      if (option.value === '-1' && !label) {
        if (first) { option.textContent = 'Tous les forums'; first = false; }
        else option.remove();
        return;
      }
      first = false;
      // un niveau = un « | » avant le nom
      var depth = Math.max((raw.match(/\|/g) || []).length - 1, 0);
      option.textContent = '   '.repeat(depth) + label;
    });
    select.selectedIndex = 0;
  }
})();
