/* Notiffi réel, présentation de la maquette et icônes Phosphor. */
(function () {
  'use strict';
  var bell = document.getElementById('notiffi_button');
  var panel = document.getElementById('notiffi_panel');
  var host = document.getElementById('lgdc-notiffi');
  if (!bell || !panel || !host || typeof Notiffi === 'undefined' || bell.dataset.lgdcNotiffi) return;
  bell.dataset.lgdcNotiffi = 'ready';
  var symbols = ['envelope-simple', 'flag', 'user-plus', 'users-three', 'users-three',
    'chat-text', 'flag', 'chat-text', 'at', 'hash', 'flag', 'heart', 'heart-break',
    'chat-text', 'star', 'chat-text', 'chat-text'];
  var icons = {};
  symbols.forEach(function (name, index) { icons[index] = '<i class="ph-light ph-' + name + '" aria-hidden="true"></i>'; });
  var groupEnds = {};
  var sample = document.createElement('span');
  [['#8e7f9a', '#b59ab8'], ['#b07a4f', '#c99566'], ['#c2a24f', '#d1b46a'],
    ['#8a99a4', '#7fa39a'], ['#a39c92', '#857e74'], ['#cb7a53', '#dfa283']].forEach(function (pair) {
    sample.style.color = pair[0];
    groupEnds[sample.style.color] = pair[1];
  });

  function syncPanel() {
    var open = panel.classList.contains('open');
    bell.classList.toggle('active', open);
    bell.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
  }
  bell.setAttribute('aria-controls', panel.id);
  new MutationObserver(syncPanel).observe(panel, {attributes: true, attributeFilter: ['class']});
  syncPanel();

  function decorate() {
    host.querySelectorAll('.notification').forEach(function (notification) {
      notification.querySelectorAll('.notif_text a[href*="/u"]').forEach(function (link) {
        var nativeName = link.querySelector('span[style*="color"]');
        var color = nativeName && nativeName.style.color;
        if (!color) return;
        if (!link.classList.contains('lgdc-who')) link.classList.add('lgdc-who');
        if (link.style.getPropertyValue('--g1') !== color) {
          link.style.setProperty('--g1', color);
          link.style.setProperty('--g2', groupEnds[color] || color);
        }
        var avatar = notification.querySelector('.notif_avatar');
        if (avatar && avatar.style.getPropertyValue('--g1') !== color) avatar.style.setProperty('--g1', color);
      });
    });
  }
  new MutationObserver(decorate).observe(host, {childList: true, subtree: true, attributes: true, attributeFilter: ['class']});
  // Le moteur ajoute ses alertes dans body ; elles partagent le cadre et le thème du panneau.
  new MutationObserver(function () {
    Array.from(document.body.children).forEach(function (element) {
      if (element.matches('.notification.alert')) host.appendChild(element);
    });
    decorate();
  }).observe(document.body, {childList: true});
  decorate();

  Promise.resolve(Notiffi.init({icons: icons})).then(function () {
    var original = document.getElementById('notiffi_mark_as_read');
    if (!original) return;
    // Le moteur courant n’applique pas l’état lu après le POST réussi.
    var mark = original.cloneNode(true);
    original.replaceWith(mark);
    mark.addEventListener('click', async function () {
      var ids = Notiffi.store.filter(function (notification) { return !notification.read; }).map(function (notification) { return notification.text.id; });
      if (!ids.length || mark.disabled) return;
      var error = host.querySelector('.lgdc-ntf-error');
      if (error) error.remove();
      mark.disabled = true;
      try {
        var data = new URLSearchParams();
        ids.forEach(function (id) { data.append('id[]', id); });
        var response = await fetch('/notif', {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: data.toString()});
        if (!response.ok) throw new Error('Lecture non enregistrée');
        Notiffi.store.forEach(function (notification) { if (ids.includes(notification.text.id)) notification.read = true; });
        await Notiffi.displayNotifications();
        Notiffi.handleUnread();
      } catch (e) {
        error = document.createElement('p');
        error.className = 'lgdc-ntf-error';
        error.setAttribute('role', 'status');
        error.textContent = 'Impossible de marquer les notifications comme lues. Réessayez.';
        host.querySelector('.notiffi_manage').appendChild(error);
      } finally { mark.disabled = false; }
    });
  }).catch(function (error) { console.warn('Wildheart : notifications indisponibles.', error); });
})();
