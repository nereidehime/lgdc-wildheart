/* Habillage du moteur Switcheroo existant ; les connexions restent gérées par le plugin. */
(function () {
  'use strict';
  var nav = document.getElementById('switcheroo');
  var panel = document.getElementById('lgdc-switch-panel');
  var toggle = document.getElementById('lgdc-switch-toggle');
  if (!nav || !panel) return;
  var instance = nav.lgdcSwitcheroo;
  var cacheKey = 'lgdc-switcheroo-colors';
  var colors = {};
  var requests = new Map();
  try { colors = JSON.parse(sessionStorage.getItem(cacheKey)) || {}; } catch (e) {}

  function setColor(row, color) {
    if (!color) return;
    row.style.setProperty('--g1', color);
    row.style.setProperty('--g2', color);
    var avatar = row.querySelector('.switcheroo__avatar');
    if (avatar) avatar.style.setProperty('--g1', color);
  }

  function getColor(id) {
    var stored = colors[id];
    if (stored && typeof stored.color === 'string' && Date.now() - stored.at < 3600000) return Promise.resolve(stored.color);
    if (requests.has(id)) return requests.get(id);
    var request = fetch('/u' + id, {credentials: 'same-origin'}).then(function (response) {
      if (!response.ok) throw new Error('Profil indisponible');
      return response.text();
    }).then(function (html) {
      var page = new DOMParser().parseFromString(html, 'text/html');
      var name = page.querySelector('.page-title span[style*="color"]');
      var color = name && name.style.color;
      if (color) {
        colors[id] = {color: color, at: Date.now()};
        try { sessionStorage.setItem(cacheKey, JSON.stringify(colors)); } catch (e) {}
      }
      return color;
    }).catch(function () { requests.delete(id); return null; });
    requests.set(id, request);
    return request;
  }

  function decorate() {
    nav.querySelectorAll('[data-action="switcheroo"]').forEach(function (row) {
      var label = row.querySelector('.switcheroo__popper-text');
      if (!label || row.dataset.lgdcDecorated) return;
      row.dataset.lgdcDecorated = 'true';
      var name = label.querySelector('.lgdc-who');
      if (!name) {
        var original = label.querySelector('[style*="color"]');
        name = document.createElement('span');
        name.className = 'lgdc-who';
        name.textContent = label.textContent;
        if (original && original.style.color) setColor(row, original.style.color);
        else setColor(row, 'var(--ink-soft)');
        label.replaceChildren(name);
      }
      var id = row.dataset.id;
      if (/^\d+$/.test(id)) {
        if (colors[id] && Date.now() - colors[id].at < 3600000) setColor(row, colors[id].color);
        if (panel.matches(':popover-open')) getColor(id).then(function (color) { if (row.isConnected) setColor(row, color); });
      }
    });
  }
  decorate();
  new MutationObserver(decorate).observe(nav, {childList: true, subtree: true});
  panel.addEventListener('beforetoggle', function (event) {
    if (toggle) toggle.setAttribute('aria-expanded', String(event.newState === 'open'));
    if (event.newState !== 'open') return;
    decorate();
    nav.querySelectorAll('[data-action="switcheroo"]').forEach(function (row) {
      if (/^\d+$/.test(row.dataset.id)) getColor(row.dataset.id).then(function (color) { if (row.isConnected) setColor(row, color); });
    });
  });
  if (toggle) {
    toggle.setAttribute('aria-controls', panel.id);
    toggle.setAttribute('aria-expanded', String(panel.matches(':popover-open')));
  }

  if (!instance || !instance.loginModal) return;
  var modal = instance.loginModal;
  modal.options.maxWidth = 420;
  var open = modal.open.bind(modal);
  var close = modal.close.bind(modal);
  modal.open = function () {
    if (modal.modal && modal.modal.isConnected) return;
    open();
    modal.modal.setAttribute('role', 'dialog');
    modal.modal.setAttribute('aria-modal', 'true');
    modal.modal.setAttribute('aria-label', 'Associer un personnage');
    if (modal.closeButton) modal.closeButton.setAttribute('aria-label', 'Fermer');
    var form = modal.modal.querySelector('.switcheroo__form');
    var user = form && form.querySelector('[name="username"]');
    var password = form && form.querySelector('[name="password"]');
    if (form) form.lastElementChild.style.marginBottom = '0';
    if (user) {
      user.setAttribute('autocomplete', 'username');
      var label = form.querySelector('label[for="' + user.id + '"]');
      if (label) label.textContent = 'Nom d’utilisateur';
      user.focus();
    }
    if (password) password.setAttribute('autocomplete', 'current-password');
  };
  // La maquette rend le focus au bouton de personnages lors de la fermeture.
  modal.close = function () {
    if (!modal.modal || !modal.modal.isConnected || !modal.modal.classList.contains('monomer-open')) return;
    close();
    if (toggle) toggle.focus();
  };
  document.addEventListener('keydown', function (event) {
    if (!modal.modal || !modal.modal.isConnected || !modal.modal.classList.contains('monomer-open')) return;
    if (event.key === 'Escape') { event.preventDefault(); modal.close(); }
    if (event.key === 'Tab') {
      var fields = Array.from(modal.modal.querySelectorAll('button,input:not([type="hidden"]):not([type="checkbox"]),[tabindex="0"]')).filter(function (field) { return !field.disabled; });
      var first = fields[0], last = fields[fields.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
})();
