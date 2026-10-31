/* Recherche (maquette recherche.html) : la liste native des forums perd ses « |-- » et ses lignes vides,
   la première ligne devient « Tous les forums », les niveaux restent visibles par un retrait. */
(function () {
  'use strict';
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
