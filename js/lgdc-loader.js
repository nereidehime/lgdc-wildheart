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
  // les effectifs de la bande viennent du registre, lu une fois la bande prête
  if (document.querySelector('.lgdc-clans')) page.push(load(base + 'lgdc-clans.js').then(function () { return load(base + 'lgdc-registre.js'); }).catch(report));
  if (document.querySelector('.lgdc-fa-viewforum, .lgdc-fa-viewtopic')) page.push(load(base + 'lgdc-forum.js').catch(report));
  if (document.querySelector('.lgdc-fa-profile')) page.push(load(base + 'lgdc-profil.js').catch(report));
  if (document.querySelector('.lgdc-fa-memberlist')) page.push(load(base + 'lgdc-membres.js').catch(report));
  if (document.querySelector('.lgdc-fa-groups, .lgdc-fa-group')) page.push(load(base + 'lgdc-groupes.js').catch(report));
  if (document.querySelector('.lgdc-fa-mp')) page.push(load(base + 'lgdc-mp.js').catch(report));
  if (document.querySelector('.lgdc-fa-search, .lgdc-fa-results-posts')) page.push(load(base + 'lgdc-recherche.js').catch(report));
  if (document.querySelector('.lgdc-fa-posting')) page.push(load(base + 'lgdc-poster.js').catch(report));
  // formulaires Persona : nouveau sujet dans leur forum, modification d'un de leurs messages, ou message affiché
  var editorText = document.querySelector('textarea#text_editor_textarea');
  var personaShown = document.querySelector('.persona');
  [['fiche', 7, 'lgdc-fiche.js'], ['liens', 2, 'lgdc-liens.js'], ['chronologie', 25, 'lgdc-chronologie.js'], ['prelien', 6, 'lgdc-prelien.js'], ['portee', 3, 'lgdc-portee.js'], ['recherche', 26, 'lgdc-recherche-rp.js']].forEach(function (persona) {
    var tag = '"name":"' + persona[0] + '"';
    if (location.href.indexOf('/post?f=' + persona[1] + '&mode=newtopic') >= 0
      || (editorText && editorText.value.indexOf('<div class="persona">{' + tag) >= 0)
      || (personaShown && personaShown.textContent.indexOf(tag) >= 0)) page.push(load(base + persona[2]).catch(report));
  });
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
  if (document.querySelector('#textarea_content, #text_editor_textarea')) load(base + 'lgdc-editeur.js').catch(report);

  var mount = document.getElementById('lgdc-guidebook-mount');
  if (mount) page.push(load(base + 'lgdc-guidebook.js').then(function () {
    load(base + 'lgdc-registre.js').catch(report);
    var names;
    function loadNames() {
      var tab = document.getElementById('lgdc-gb-noms');
      if (!tab || !tab.checked || names) return;
      names = load(base + 'lgdc-noms-data.js').then(function () { return load(base + 'lgdc-noms.js'); });
      names.catch(function (error) {
        names = null;
        var result = document.getElementById('lgdc-noms-resultat');
        if (result) result.textContent = 'Le générateur est indisponible. Rouvre cet onglet pour réessayer.';
        report(error);
      });
    }
    document.querySelector('.lgdc-gb').addEventListener('change', loadNames);
    window.addEventListener('hashchange', loadNames);
    loadNames();
  }).catch(function (error) {
    mount.textContent = 'Le guidebook est momentanément indisponible. Recharge la page pour réessayer.';
    report(error);
  }));

  var combat = document.getElementById('lgdc-combat-mount');
  if (combat) page.push(load(base + 'lgdc-combat.js').catch(function (error) {
    combat.textContent = 'Le suivi de combat est momentanément indisponible. Recharge la page pour réessayer.';
    report(error);
  }));

  if (document.querySelector('.lgdc-fa-home')) {
    page.push(load('https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js').catch(report));
  }
  Promise.all(page).then(function () { return load(base + 'lgdc-header.js'); }).catch(report);
})();
