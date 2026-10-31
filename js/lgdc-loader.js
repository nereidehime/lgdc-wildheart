/* Chargement par surface : les gros modules restent sur la page qui les utilise. */
(function () {
  'use strict';
  // les modules viennent du même endroit que ce fichier : épingler son commit dans overall_footer_end suffit
  var self = document.currentScript && document.currentScript.src;
  var base = self && /\/lgdc-loader\.js(\?.*)?$/.test(self)
    ? self.replace(/lgdc-loader\.js(\?.*)?$/, '')
    : 'https://cdn.jsdelivr.net/gh/nereidehime/lgdc-wildheart@main/js/';
  var pending = new Map();

  function load(url) {
    if (pending.has(url)) return pending.get(url);
    var promise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = function () {
        script.remove();
        pending.delete(url);
        reject(new Error('Wildheart : ressource indisponible ' + url));
      };
      document.head.appendChild(script);
    });
    pending.set(url, promise);
    return promise;
  }

  function report(error) { console.warn(error); }
  var page = [];
  if (document.querySelector('.lgdc-fa-card, .lgdc-fa-home')) page.push(load(base + 'lgdc-index.js').catch(report));
  if (document.querySelector('.lgdc-clans')) page.push(load(base + 'lgdc-clans.js').catch(report));
  if (document.querySelector('.lgdc-fa-viewforum, .lgdc-fa-viewtopic')) page.push(load(base + 'lgdc-forum.js').catch(report));
  if (document.getElementById('switcheroo')) {
    load(base + 'lgdc-comptes.js').catch(report);
    load(base + 'lgdc-switcheroo.js').catch(report);
    load(base + 'lgdc-membre.js').catch(function (error) {
      var navigation = document.getElementById('lgdc-native-nav');
      if (navigation) navigation.style.display = 'flex';
      report(error);
    });
  }
  if (document.getElementById('notiffi_button')) load(base + 'lgdc-notiffi.js').catch(report);
  if (document.getElementById('textarea_content')) load(base + 'lgdc-editeur.js').catch(report);

  var mount = document.getElementById('lgdc-guidebook-mount');
  if (mount) page.push(load(base + 'lgdc-guidebook.js').then(function () {
    var names;
    function loadNames() {
      var tab = document.getElementById('lgdc-gb-noms');
      if (!tab || !tab.checked || names) return;
      names = load(base + 'lgdc-noms-data.js').then(function () { return load(base + 'lgdc-noms.js'); });
      names.catch(function (error) {
        names = null;
        var result = document.getElementById('lgdc-noms-resultat');
        if (result) result.textContent = 'Le générateur est indisponible. Rouvrez cet onglet pour réessayer.';
        report(error);
      });
    }
    document.querySelector('.lgdc-gb').addEventListener('change', loadNames);
    window.addEventListener('hashchange', loadNames);
    loadNames();
  }).catch(function (error) {
    mount.textContent = 'Le guidebook est momentanément indisponible. Rechargez la page pour réessayer.';
    report(error);
  }));

  if (document.querySelector('.lgdc-fa-home')) {
    page.push(load('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js').catch(report));
  }
  Promise.all(page).then(function () { return load(base + 'lgdc-header.js'); }).catch(report);
})();
