/* Identité du compte courant et lien natif de déconnexion. */
(function () {
  'use strict';
  var nativeNav = document.getElementById('lgdc-native-nav');
  var logout = nativeNav && nativeNav.querySelector('a[href*="logout=1"]');
  if (logout) document.querySelectorAll('[data-lgdc-logout]').forEach(function (link) {
    link.href = logout.href;
    link.hidden = false;
  });

  var user = window._userdata;
  if (!user || !(Number(user.user_id) > 0)) return;
  var profile = '/u' + Number(user.user_id);
  var names = document.querySelectorAll('[data-lgdc-current-user]');
  names.forEach(function (link) {
    link.href = profile;
    if (typeof user.username === 'string') link.textContent = user.username;
  });
  document.querySelectorAll('[data-lgdc-profile]').forEach(function (link) { link.href = profile; });

  function applyColor(color) {
    if (!color) return;
    names.forEach(function (link) {
      link.style.setProperty('--g1', color);
      link.style.setProperty('--g2', color);
    });
  }
  var nativeName = Array.from(document.querySelectorAll('a[href*="/u"]')).find(function (a) {
    try { return new URL(a.href, location.href).pathname === profile && a.querySelector('span[style*="color"]'); }
    catch (e) { return false; }
  });
  if (nativeName) { applyColor(nativeName.querySelector('span[style*="color"]').style.color); return; }
  // Une seule lecture du profil courant si son nom coloré ne figure pas déjà sur cette page.
  fetch(profile, { credentials: 'same-origin' }).then(function (response) {
    if (!response.ok) throw new Error('Profil indisponible');
    return response.text();
  }).then(function (html) {
    var page = new DOMParser().parseFromString(html, 'text/html');
    var name = page.querySelector('.page-title span[style*="color"]');
    if (name) applyColor(name.style.color);
  }).catch(function () { /* Le lien et le pseudo restent utilisables sans la couleur. */ });
})();
