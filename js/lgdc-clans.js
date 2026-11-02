/* Bande des quatre Clans : présentation de la maquette. Les effectifs (data-count) viennent du registre
   (lgdc-registre.js), qui rappelle window.lgdcClansRender une fois la page registre lue. */
(function () {
  'use strict';
  var root = document.querySelector('.lgdc-clans');
  if (!root) return;
  var capacity = Number(root.dataset.capacity);
  if (!Number.isSafeInteger(capacity) || capacity < 1) capacity = 28;
  root.style.setProperty('--lgdc-clan-capacity', String(capacity));
  var panels = Array.from(root.querySelectorAll('.lgdc-clans__panel'));

  function render() {
    var freeTotal = 0;
    panels.forEach(function (panel) {
      var used = Number(panel.dataset.count);
      if (!Number.isSafeInteger(used) || used < 0) used = 0;
      var free = Math.max(0, capacity - used);
      freeTotal += free;
      var gauge = panel.querySelector('.lgdc-clans__gauge');
      gauge.style.setProperty('--fill', String(Math.min(used, capacity)));
      gauge.querySelector('.lgdc-clans__track b').textContent = String(used).padStart(2, '0');
      gauge.querySelector('.lgdc-micro').textContent = '/ ' + capacity;
      panel.querySelector('.lgdc-clans__free b').textContent = String(free);
    });
    var total = root.querySelector('.lgdc-clans__total');
    var number = document.createElement('b');
    number.textContent = String(freeTotal);
    total.replaceChildren(number, document.createTextNode(' / ' + capacity * panels.length + ' places libres'));
  }
  render();
  window.lgdcClansRender = render;

  function syncSelection() {
    var checked = root.querySelector('.lgdc-clans__radio:checked');
    panels.forEach(function (panel) {
      panel.setAttribute('aria-hidden', String(!checked || checked.id !== 'lgdc-clan-' + panel.dataset.clan));
    });
  }
  root.querySelectorAll('label.lgdc-clans__tab').forEach(function (pick) {
    pick.addEventListener('mouseenter', function () {
      var radio = document.getElementById(pick.htmlFor);
      if (radio) { radio.checked = true; syncSelection(); }
    });
  });
  root.querySelectorAll('.lgdc-clans__radio').forEach(function (radio) { radio.addEventListener('change', syncSelection); });
  syncSelection();
})();
