/* Registre des Clans : une page HTML du forum liste les personnages validés (pseudo, profil, rang, clan).
   Il remplit les allégeances du guidebook et les effectifs de la bande des quatre Clans sur l'accueil.
   Valider un personnage : l'ajouter à la page registre, rien d'autre à modifier dans le code. */
(function () {
  'use strict';
  var PAGE = '/h4-registre';
  var CACHE = 'lgdc-registre';
  var TTL = 2 * 60 * 1000; // une modification du registre se voit au plus tard deux minutes après
  // clé du Clan dans le guidebook → clé de la bande de l'accueil
  var BANDE = { crepuscule: 'crep', hetre: 'het', orchidee: 'orc', brouillard: 'bro' };
  // rang de la fiche (au singulier, sans accent) → ligne des allégeances
  var ROLES = {
    'chef': 'Chef', 'lieutenant': 'Lieutenant', 'lieutenante': 'Lieutenant',
    'guerisseur': 'Guérisseur', 'guerisseuse': 'Guérisseur',
    'apprenti guerisseur': 'Apprenti guérisseur', 'apprentie guerisseuse': 'Apprenti guérisseur',
    'guerrier': 'Guerriers', 'guerriere': 'Guerriers', 'apprenti': 'Apprentis', 'apprentie': 'Apprentis',
    'reine': 'Reines', 'chaton': 'Chatons', 'ancien': 'Anciens', 'ancienne': 'Anciens'
  };

  function bare(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  }
  function clanKey(s) {
    var k = bare(s).replace(/^clan (du |de l'|de l’|de la |des )?/, '');
    return BANDE[k] ? k : null;
  }
  function roleOf(s) {
    var k = bare(s);
    return ROLES[k] || ROLES[k.replace(/s(?= |$)/g, '')] || null;
  }
  // seuls les liens du forum sont gardés
  function profileOf(s) {
    var v = String(s || '').trim();
    return /^\/u\d+/.test(v) || v.indexOf(location.origin + '/') === 0 ? v : '';
  }

  function read() {
    try {
      var cached = JSON.parse(sessionStorage.getItem(CACHE));
      if (cached && Date.now() - cached.t < TTL) return Promise.resolve(cached.v);
    } catch (e) { void e; }
    return fetch(PAGE, { credentials: 'same-origin' }).then(function (r) {
      if (!r.ok) throw new Error('Wildheart : registre indisponible (' + r.status + ')');
      return r.text();
    }).then(function (html) {
      var m = html.match(/<script[^>]*id=["']lgdc-registre["'][^>]*>([\s\S]*?)<\/script>/);
      if (!m) throw new Error('Wildheart : registre introuvable sur ' + PAGE);
      var list = JSON.parse(m[1]);
      if (!Array.isArray(list)) throw new Error('Wildheart : le registre doit être une liste [ … ]');
      try { sessionStorage.setItem(CACHE, JSON.stringify({ t: Date.now(), v: list })); } catch (e) { void e; }
      return list;
    });
  }

  // une ligne mal remplie est ignorée et signalée dans la console, le reste du registre s'affiche
  function clean(list) {
    return list.map(function (c, i) {
      var out = { nom: String(c && c.pseudo || '').trim(), profil: profileOf(c && c.profil), role: roleOf(c && c.rang), clan: clanKey(c && c.clan) };
      if (!out.nom || !out.role || !out.clan) { console.warn('Wildheart : ligne ' + (i + 1) + ' du registre ignorée', c); return null; }
      return out;
    }).filter(Boolean);
  }

  function fillGuidebook(list) {
    document.querySelectorAll('.lgdc-gbc__panel[data-clan]').forEach(function (panel) {
      var mine = list.filter(function (c) { return c.clan === panel.dataset.clan; });
      panel.querySelectorAll('.lgdc-gbc__list > div[data-role]').forEach(function (row) {
        var places = Number(row.dataset.n) || 0;
        var names = mine.filter(function (c) { return c.role === row.dataset.role; });
        var ul = row.querySelector('ul');
        if (!ul) return;
        ul.replaceChildren();
        names.forEach(function (c) {
          var li = document.createElement('li');
          var name = document.createElement(c.profil ? 'a' : 'span');
          if (c.profil) name.href = c.profil;
          name.textContent = c.nom;
          li.appendChild(name);
          ul.appendChild(li);
        });
        for (var i = names.length; i < places; i++) {
          var free = document.createElement('li');
          free.className = 'lgdc-gbc__free';
          free.textContent = 'Place libre';
          ul.appendChild(free);
        }
      });
      var left = panel.querySelector('[data-lgdc-libres]');
      if (left) {
        var capacity = Number(left.dataset.lgdcLibres) || 0;
        left.textContent = Math.max(0, capacity - mine.length) + ' / ' + capacity;
      }
    });
  }

  function fillBand(list) {
    var band = document.querySelector('.lgdc-clans');
    if (!band) return;
    Object.keys(BANDE).forEach(function (k) {
      var panel = band.querySelector('.lgdc-clans__panel[data-clan="' + BANDE[k] + '"]');
      if (panel) panel.dataset.count = String(list.filter(function (c) { return c.clan === k; }).length);
    });
    if (typeof window.lgdcClansRender === 'function') window.lgdcClansRender();
  }

  read().then(clean).then(function (list) {
    fillGuidebook(list);
    fillBand(list);
  }).catch(function (error) { console.warn(error); });
})();
