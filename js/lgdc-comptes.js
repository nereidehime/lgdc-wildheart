/* Panneaux des comptes et notifications, membres connectés uniquement. */
(function () {
  // la cloche Notiffi est une <div> : Entrée et Espace l'ouvrent aussi ; Échap referme le panneau
  var bell = document.getElementById('notiffi_button');
  if (bell) bell.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bell.click(); }
  });
  document.addEventListener('keydown', function (e) {
    var panel = document.getElementById('notiffi_panel');
    if (e.key === 'Escape' && bell && panel && panel.classList.contains('open')) bell.click();
  });

  /* ---------- Switcheroo : panneau de tous les personnages associés ---------- */
  var characters = document.getElementById('lgdc-switch-panel');
  var switcheroo = document.getElementById('switcheroo');
  if (characters && switcheroo) {
    function prepareCharacters() {
      switcheroo.querySelectorAll('.switcheroo__squircle').forEach(function (row) {
        if (row.classList.contains('switcheroo__logo')) return;
        var choose = row.querySelector('.switcheroo__choose');
        if (!choose) {
          choose = document.createElement('button');
          choose.type = 'button';
          choose.className = 'switcheroo__choose';
          Array.from(row.childNodes).forEach(function (node) {
            if (node.nodeType !== 1 || !node.classList.contains('switcheroo__delete')) choose.appendChild(node);
          });
          row.prepend(choose);
          var remove = row.querySelector('.switcheroo__delete');
          if (remove) {
            var removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = remove.className;
            removeButton.innerHTML = remove.innerHTML;
            var label = row.querySelector('.switcheroo__popper-text');
            removeButton.setAttribute('aria-label', 'Dissocier ' + (label ? label.textContent.trim() : 'ce personnage'));
            remove.replaceWith(removeButton);
          }
        }
        var name = row.querySelector('.switcheroo__popper-text');
        if (name) choose.setAttribute('aria-label', name.textContent.trim());
        if (row.dataset.action === 'switcheroo') {
          var active = row.classList.contains('active');
          choose.setAttribute('aria-label', (active ? 'Personnage actuel : ' : 'Passer sur ') + (name ? name.textContent.trim() : 'ce personnage'));
          choose.disabled = active;
          if (active) choose.setAttribute('aria-current', 'true');
          else choose.removeAttribute('aria-current');
          var status = row.querySelector('.switcheroo__status');
          if (active && !status) {
            status = document.createElement('span');
            status.className = 'switcheroo__status';
            status.textContent = 'Personnage actuel';
            choose.querySelector('.switcheroo__popper').appendChild(status);
          } else if (!active && status) status.remove();
        }
      });
    }
    prepareCharacters();
    new MutationObserver(prepareCharacters).observe(switcheroo, { childList: true, subtree: true });
    characters.addEventListener('beforetoggle', function (e) {
      if (e.newState === 'open') {
        prepareCharacters();
        var notifications = document.getElementById('notiffi_panel');
        if (notifications) notifications.classList.remove('open');
      }
    });
    if (bell) bell.addEventListener('click', function () {
      if (characters.matches(':popover-open')) characters.hidePopover();
    });
    switcheroo.addEventListener('click', function (e) {
      var action = e.target.closest('[data-action]');
      if (action && !e.target.closest('.switcheroo__delete') && characters.matches(':popover-open')) characters.hidePopover();
    });
  }

})();
