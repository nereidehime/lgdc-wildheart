/* Suivi de combat : page HTML /h3-suivi-de-combat (haut et bas du forum), construite dans #lgdc-combat-mount.
   Les dés restent ceux du forum : la page ne lance rien, elle calcule. */
(function () {
  var mount = document.getElementById("lgdc-combat-mount");
  if (!mount) return;
  mount.className = "lgdc lgdc-sc";
  mount.innerHTML = "<h1 class=\"lgdc-sc__title\">Suivi de combat</h1>\n  <ol class=\"lead lgdc-sc__steps\"><li><b>Avant d’écrire</b>, collez le bloc « État du combat » du message précédent dans <i>Reprendre un combat</i>, puis entrez les deux dés affichés dans ce message : l’outil calcule ce que le coup a donné, et vous le racontez dans votre RP.</li><li><b>Préparez votre coup</b> : geste, astuces, et l’altération voulue en cas de critique, puis cliquez sur <i>Préparer mon message</i>.</li><li><b>Dans votre message</b>, collez la balise de dés et le nouveau bloc « État du combat ». Le joueur suivant reprendra à partir de lui.</li></ol><p class=\"lead\">L’outil suit un duel. Dans un combat à plusieurs, suivez chaque duel à part. Les soins, les neuf vies du chef et les capacités de rôle se règlent avec les boutons de points de vie et les pastilles d’altération.</p>\n\n  <!-- 1. Les combattants -->\n  <section class=\"box\" id=\"setup\">\n    <h2>Les combattants</h2>\n    <div class=\"grid2\" id=\"setup-cats\"></div>\n    <div class=\"row\" style=\"margin-top:6px\">\n      <label class=\"f\" style=\"min-width:240px\"><span class=\"micro\">Qui provoque le combat ?</span><select id=\"first\"><option value=\"0\">Le premier chat</option><option value=\"1\">Le second chat</option></select></label>\n      <button class=\"main\" id=\"start\" type=\"button\">Commencer le combat</button>\n    </div>\n    <details style=\"margin-top:10px\">\n      <summary class=\"micro\" style=\"cursor:pointer\">Reprendre un combat en cours</summary>\n      <p style=\"margin-top:10px\">Collez le dernier bloc « État du combat » du sujet :</p>\n      <textarea id=\"resume-in\"></textarea>\n      <div class=\"row\" style=\"margin-top:8px\"><button id=\"resume\" type=\"button\">Reprendre</button><span id=\"resume-err\" class=\"err\"></span></div>\n    </details>\n  </section>\n\n  <!-- 2. Le combat -->\n  <section id=\"fight\" class=\"hide\">\n    <div class=\"grid2\" id=\"status\"></div>\n\n    <div class=\"box\" id=\"turn\">\n      <h2 id=\"turn-title\"></h2>\n      <div id=\"incoming\" class=\"editor hide\" style=\"margin-bottom:16px\">\n        <span class=\"micro\">Le coup du message précédent</span>\n        <p id=\"incoming-desc\" style=\"margin:6px 0 10px\"></p>\n        <div class=\"row\"><input type=\"number\" id=\"d1\" min=\"1\" style=\"width:90px\" aria-label=\"Premier dé\"><input type=\"number\" id=\"d2\" min=\"1\" style=\"width:90px\" aria-label=\"Second dé\"><button class=\"main\" id=\"resolve\" type=\"button\">Résoudre</button></div>\n        <p class=\"err\" id=\"dice-err\"></p>\n      </div>\n      <div class=\"grid2\" id=\"plan\">\n        <div>\n          <label class=\"f\"><span class=\"micro\">Geste</span><select id=\"geste\"><option>Frapper</option><option>Bondir</option><option>Mordre</option></select></label>\n          <p class=\"micro\" style=\"margin:12px 0 6px\">Astuces à déclarer</p>\n          <div class=\"checks\" id=\"declare\"></div>\n        </div>\n        <div>\n          <div class=\"editor\">\n            <span class=\"micro\">La balise à mettre dans votre message</span>\n            <code id=\"tag\"></code>\n            <button type=\"button\" id=\"copy-tag\">Copier la balise</button>\n            <p class=\"stat\" id=\"tag-note\"></p>\n          </div>\n          <label class=\"f\" style=\"margin-top:14px\"><span class=\"micro\">Bonus de lien</span><select id=\"lien\"><option value=\"0\">aucun</option><option value=\"1\">+1, une émotion</option><option value=\"2\">+2, deux émotions</option><option value=\"3\">+3, trois émotions</option></select></label>\n          <label class=\"f\"><span class=\"micro\">En cas de critique</span><select id=\"crit-choice\"><option value=\"\">+2 au prochain test d’un allié</option><option>ralenti</option><option>désorienté</option><option>affaibli</option><option>effrayé</option><option>enragé</option><option>empoisonné</option></select></label>\n          <button class=\"main\" id=\"prep\" type=\"button\">Préparer mon message</button>\n        </div>\n      </div>\n      <div id=\"result\" class=\"res hide\"></div>\n    </div>\n\n    <div class=\"box\">\n      <h3>État du combat, à coller dans votre message</h3>\n      <textarea id=\"state-out\" readonly></textarea>\n      <div class=\"row\" style=\"margin-top:8px\"><button type=\"button\" id=\"copy-state\">Copier</button><button type=\"button\" id=\"undo\">Annuler le dernier tour</button><button type=\"button\" id=\"reset\">Nouveau combat</button></div>\n    </div>\n\n    <div class=\"box\">\n      <h3>Journal</h3>\n      <ol class=\"log\" id=\"log\"></ol>\n    </div>\n  </section>";
})();
(function () {
  'use strict';
  var ATTRS = [['D', 'Dextérité'], ['I', 'Intelligence'], ['P', 'Puissance'], ['V', 'Volonté']];
  var RANGS = ['Chaton', 'Apprenti', 'Guerrier', 'Guérisseur', 'Lieutenant', 'Chef', 'Ancien'];
  var GESTES = { Frapper: ['P', 'P'], Bondir: ['D', 'I'], Mordre: ['P', 'D'] };
  // altérations : le dé (ou les dés) qu'elles font baisser d'une taille
  var ALT = { ralenti: ['D'], 'désorienté': ['I'], affaibli: ['P'], 'effrayé': ['V'], 'enragé': ['D', 'I'], 'empoisonné': ['P', 'V'] };
  // astuces qui comptent en combat ; « auto » = le coup touche sans test
  var AST = [
    ['Coup puissant', 'Griffe I, ×2 : +4 dégâts par niveau sur un coup'],
    ['Plaquage', 'Griffe I : un coup qui touche ralentit la cible'],
    ['Riposte', 'Griffe I : après une attaque ratée contre lui, son coup touche sans test'],
    ['Griffes au ventre', 'Griffe II, toujours : +3 dégâts contre une cible ralentie ou en crise'],
    ['Rage du sang', 'Griffe II, toujours : en crise, +2 pour Frapper, Bondir et Mordre'],
    ['Furie', 'Griffe III : deux attaques dans le même tour'],
    ['Feinte', 'Ombre I : le coup touche sans test'],
    ['Embuscade', 'Ombre II : le premier coup du combat touche sans test, +5 dégâts'],
    ['Inébranlable', 'Cœur II, toujours : +5 points de vie, jamais effrayé'],
    ['Feulement', 'Cœur I : la cible est effrayée, que le coup touche ou non']
  ];
  var DECLARABLE = ['Coup puissant', 'Plaquage', 'Riposte', 'Furie', 'Feinte', 'Embuscade', 'Feulement'];
  var $ = function (id) { return document.getElementById(id); };
  var S = null, history = [];

  // ---------- les combattants ----------
  function catForm(i, ex) {
    var dice = ATTRS.map(function (a) {
      return '<label class="f"><span class="micro">' + a[1] + '</span><select data-k="' + a[0] + '">' + [6, 8, 10, 12].map(function (n) {
        return '<option value="' + n + '"' + ((ex[a[0]] || 8) === n ? ' selected' : '') + '>d' + n + '</option>'; }).join('') + '</select></label>';
    }).join('');
    var ast = AST.map(function (a) {
      var lvl = a[0] === 'Coup puissant';
      var v = ex.ast && ex.ast[a[0]] || 0;
      return '<label>' + (lvl ? '<select data-a="' + a[0] + '" style="width:58px;padding:3px"><option value="0">0</option><option value="1"' + (v === 1 ? ' selected' : '') + '>1</option><option value="2"' + (v === 2 ? ' selected' : '') + '>2</option></select>'
        : '<input type="checkbox" data-a="' + a[0] + '"' + (v ? ' checked' : '') + '>') + '<span><b>' + a[0] + '</b> <small>' + a[1].replace(/^[^:]+: /, '') + '</small></span></label>';
    }).join('');
    var bon = ['Frapper', 'Bondir', 'Mordre'].map(function (g) {
      return '<label class="f"><span class="micro">' + g + '</span><select data-b="' + g + '"><option value="0">aucun</option><option value="2">+2</option><option value="4">+4</option></select></label>';
    }).join('');
    return '<div class="box" data-cat="' + i + '"><label class="f"><span class="micro">Nom du chat</span><input type="text" data-k="nom" value="' + (ex.nom || '') + '"></label>'
      + '<label class="f"><span class="micro">Rang</span><select data-k="rang">' + RANGS.map(function (r) { return '<option' + (r === (ex.rang || 'Guerrier') ? ' selected' : '') + '>' + r + '</option>'; }).join('') + '</select></label>'
      + '<div class="dice">' + dice + '</div><p class="micro" style="margin:8px 0 6px">Bonus de gestes</p><div class="dice" style="grid-template-columns:repeat(3,minmax(0,1fr))">' + bon + '</div>'
      + '<p class="micro" style="margin:8px 0 6px">Astuces de combat</p><div class="checks">' + ast + '</div></div>';
  }
  $('setup-cats').innerHTML = catForm(0, {}) + catForm(1, {});

  function readCat(i) {
    var box = document.querySelector('[data-cat="' + i + '"]');
    var c = { nom: box.querySelector('[data-k=nom]').value.trim() || ('Chat ' + (i + 1)), rang: box.querySelector('[data-k=rang]').value, ast: {}, bonus: {}, alt: [], spent: [], missed: false };
    ATTRS.forEach(function (a) { c[a[0]] = +box.querySelector('[data-k=' + a[0] + ']').value; });
    box.querySelectorAll('[data-a]').forEach(function (el) { var v = el.tagName === 'SELECT' ? +el.value : (el.checked ? 1 : 0); if (v) c.ast[el.dataset.a] = v; });
    box.querySelectorAll('[data-b]').forEach(function (el) { c.bonus[el.dataset.b] = +el.value; });
    var base = c.rang === 'Chaton' ? 5 : c.rang === 'Apprenti' ? 10 : 15;
    c.max = c.P + base + (c.ast['Inébranlable'] ? 5 : 0);
    c.pv = c.max;
    return c;
  }

  // ---------- règles ----------
  function crise(c) { return c.pv > 0 && c.pv <= Math.floor(c.max / 2); }
  function hasAlt(c, a) { return c.alt.indexOf(a) >= 0; }
  // taille du dé après altérations ; ce qui passerait sous d6 devient −2 au test
  function die(c, k) {
    var n = 0;
    c.alt.forEach(function (a) { if (ALT[a].indexOf(k) >= 0) n++; });
    var size = Math.max(6, c[k] - 2 * n), over = n - (c[k] - 6) / 2;
    return { size: size, malus: over > 0 ? -2 * over : 0 };
  }
  function esquive(c) { return die(c, 'D').size + 2; }
  function available(c, name) { return c.ast[name] && c.spent.indexOf(name) < 0; }

  function plan() {
    var at = S.cats[S.next], de = S.cats[1 - S.next], g = $('geste').value;
    var k = GESTES[g], d1 = die(at, k[0]), d2 = die(at, k[1]);
    var bonus = (at.bonus[g] || 0) + d1.malus + d2.malus;
    var rage = at.ast['Rage du sang'] && crise(at) ? 2 : 0;
    var lien = +$('lien').value || 0;
    bonus += rage + lien;
    var decl = [].slice.call(document.querySelectorAll('#declare input:checked')).map(function (x) { return x.value; });
    var auto = decl.some(function (n) { return n === 'Feinte' || n === 'Riposte' || n === 'Embuscade'; });
    return { at: at, de: de, g: g, sizes: [d1.size, d2.size], bonus: bonus, rage: rage, lien: lien, diff: esquive(de), decl: decl, auto: auto };
  }

  // ---------- affichage ----------
  function renderStatus() {
    $('status').innerHTML = S.cats.map(function (c, i) {
      var pct = Math.max(0, c.pv) / c.max * 100;
      var chips = Object.keys(ALT).map(function (a) {
        if (a === 'effrayé' && c.ast['Inébranlable']) return '';
        return '<button type="button" class="chip' + (hasAlt(c, a) ? ' on' : '') + '" data-alt="' + a + '" data-i="' + i + '">' + a + '</button>';
      }).join('');
      var spent = c.spent.length ? 'Astuces dépensées : ' + c.spent.join(', ') + '.' : 'Aucune astuce dépensée.';
      return '<div class="box cat' + (i === S.next && !S.over ? ' is-turn' : '') + (crise(c) ? ' is-crise' : '') + '"><div class="name"><h3>' + esc(c.nom) + '</h3>' + (crise(c) ? '<span class="badge">En crise</span>' : '') + '</div>'
        + '<div class="row"><span class="pv">' + Math.max(0, c.pv) + ' / ' + c.max + ' PV</span><button type="button" data-pv="-1" data-i="' + i + '">−1</button><button type="button" data-pv="1" data-i="' + i + '">+1</button></div>'
        + '<div class="bar"><i style="width:' + pct + '%"></i></div><p class="stat">Esquive ' + esquive(c) + '. ' + spent + '</p><div class="chips">' + chips + '</div></div>';
    }).join('');
  }
  function renderTurn() {
    var at = S.cats[S.next], de = S.cats[1 - S.next];
    var pd = S.pending;
    $('incoming').classList.toggle('hide', !pd || !!S.over);
    $('plan').classList.toggle('hide', !!pd || !!S.over);
    if (S.over) { $('turn-title').textContent = S.over; return; }
    if (pd) {
      var who = S.cats[pd.at];
      $('turn-title').textContent = 'Tour ' + S.tour + ' : le coup de ' + who.nom + ' attend ses dés';
      $('incoming-desc').textContent = who.nom + ' : ' + pd.g + ', ' + tagOf(pd) + (pd.decl.length ? ', astuces ' + pd.decl.join(', ') : '') + (pd.left > 1 ? ' (Furie : première attaque sur deux)' : '') + '. Entrez les deux dés affichés dans son message.';
      return;
    }
    $('geste').value = at.geste || 'Frapper';
    $('lien').value = '0';
    $('turn-title').textContent = 'Tour ' + S.tour + ' : ' + at.nom + ' attaque ' + de.nom;
    $('declare').innerHTML = DECLARABLE.filter(function (n) {
      if (!available(at, n)) return false;
      if (n === 'Riposte') return de.missed;
      if (n === 'Embuscade') return S.firstCoup;
      if (n === 'Furie') return true;
      return true;
    }).map(function (n) { return '<label><input type="checkbox" value="' + n + '"><span><b>' + n + '</b> <small>' + AST.filter(function (a) { return a[0] === n; })[0][1].replace(/^[^:]+: /, '') + '</small></span></label>'; }).join('') || '<p class="stat">Aucune astuce à déclarer.</p>';
    updateTag();
  }
  function updateTag() {
    var p = plan();
    $('tag').textContent = tagOf(p) + (p.decl.indexOf('Furie') >= 0 ? ' ' + tagOf(p) : '');
    var notes = [];
    if (p.rage) notes.push('Rage du sang +2 compris.');
    if (p.lien) notes.push('Lien +' + p.lien + ' compris : écrivez dans le message envers qui.');
    if (p.auto) notes.push('Le coup touchera sans test : les dés servent aux dégâts.');
    if (p.decl.length) notes.push('À écrire dans le message : astuce' + (p.decl.length > 1 ? 's' : '') + ' ' + p.decl.join(', ') + '.');
    $('tag-note').textContent = notes.join(' ');
  }
  function tagOf(p) { return '[lancer d' + p.sizes[0] + ' d' + p.sizes[1] + ' difficulté ' + p.diff + (p.bonus ? ' ' + (p.bonus > 0 ? '+' : '') + p.bonus : '') + ']'; }
  function renderState() {
    var lines = ['[b]État du combat, tour ' + S.tour + '[/b]'];
    S.cats.forEach(function (c) {
      var bits = [Math.max(0, c.pv) + '/' + c.max + ' PV'];
      if (crise(c)) bits.push('en crise');
      c.alt.forEach(function (a) { bits.push(a); });
      lines.push(c.nom + ' : ' + bits.join(', ') + '.' + (c.spent.length ? ' Astuces dépensées : ' + c.spent.join(', ') + '.' : ''));
    });
    if (S.over) lines.push(S.over);
    else if (S.pending) lines.push('Coup de ' + S.cats[S.pending.at].nom + ' dans ce message : ' + S.pending.g + (S.pending.decl.length ? ', astuces ' + S.pending.decl.join(', ') : '') + ', en cas de critique : ' + (S.pending.crit || '+2 au prochain test d’un allié') + '. Au joueur suivant de reprendre ce bloc et d’entrer les dés.');
    else lines.push('À ' + S.cats[S.next].nom + ' de préparer son coup.');
    lines.push('[size=9]Code de reprise : WHC1:' + btoa(unescape(encodeURIComponent(JSON.stringify(S)))) + '[/size]');
    $('state-out').value = lines.join('\n');
    $('log').innerHTML = S.log.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('');
  }
  function render() { renderStatus(); renderTurn(); renderState(); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // ---------- résolution ----------
  function resolve() {
    var p = S.pending, a = +$('d1').value, b = +$('d2').value;
    if (!p) return;
    $('dice-err').textContent = '';
    if (!(a >= 1 && a <= p.sizes[0] && b >= 1 && b <= p.sizes[1])) { $('dice-err').textContent = 'Entrez les deux dés affichés sur le forum (1 à ' + p.sizes[0] + ', puis 1 à ' + p.sizes[1] + ').'; return; }
    history.push(JSON.stringify(S));
    var at = S.cats[p.at], de = S.cats[1 - p.at], total = a + b + p.bonus;
    var fumble = a === 1 && b === 1, crit = a === b && a >= 6;
    var hit = p.auto || (!fumble && (crit || total >= p.diff));
    var line = 'Tour ' + S.tour + ', ' + at.nom + ' : ' + p.g + ' ' + a + ' + ' + b + (p.bonus ? ' ' + (p.bonus > 0 ? '+ ' : '− ') + Math.abs(p.bonus) : '') + ' = ' + total + ' contre ' + p.diff;
    var html;
    if (hit) {
      var dmg = Math.max(a, b) + 5, extra = [];
      if (at.ast['Griffes au ventre'] && (hasAlt(de, 'ralenti') || crise(de))) { dmg += 3; extra.push('Griffes au ventre +3'); }
      if (p.decl.indexOf('Coup puissant') >= 0) { dmg += 4 * at.ast['Coup puissant']; extra.push('Coup puissant +' + 4 * at.ast['Coup puissant']); }
      if (p.decl.indexOf('Embuscade') >= 0) { dmg += 5; extra.push('Embuscade +5'); }
      if (p.decl.indexOf('Plaquage') >= 0 && !hasAlt(de, 'ralenti')) { de.alt.push('ralenti'); extra.push('Plaquage : altération ralenti pour ' + de.nom); }
      p.decl.forEach(function (n) { if (at.spent.indexOf(n) < 0) at.spent.push(n); });
      de.pv -= dmg;
      line += (p.auto ? ', touché sans test (' + p.decl.filter(function (n) { return /Feinte|Riposte|Embuscade/.test(n); }).join(', ') + ')' : crit ? ', critique' : ', touché') + ', ' + dmg + ' dégâts' + (extra.length ? ' (' + extra.join(', ') + ')' : '') + '. ' + de.nom + ' : ' + Math.max(0, de.pv) + '/' + de.max + ' PV' + (crise(de) ? ', en crise' : '') + '.';
      html = '<b>Touché.</b> ' + dmg + ' dégâts' + (extra.length ? ' (' + esc(extra.join(', ')) + ')' : '') + '. ' + esc(de.nom) + ' passe à ' + Math.max(0, de.pv) + '/' + de.max + ' PV.';
      $('result').className = 'res hit';
    } else {
      p.decl.forEach(function (n) { if (n === 'Furie' && at.spent.indexOf(n) < 0) at.spent.push(n); });
      line += fumble ? ', double 1 : échec spectaculaire.' : ', raté.';
      html = fumble ? '<b>Double 1 : échec spectaculaire.</b> Ça tourne mal pour ' + esc(at.nom) + '.' : '<b>Raté.</b> Les astuces déclarées ne sont pas dépensées.';
      $('result').className = 'res miss';
    }
    at.missed = !hit;
    S.firstCoup = false;
    S.log.push(line);
    $('result').innerHTML = html;
    if (de.pv <= 0) {
      S.over = de.nom + ' tombe à 0 : se rendre ou se sacrifier' + (de.rang === 'Chef' ? ', ou perdre une de ses neuf vies' : '') + ', au choix de son joueur ou de sa joueuse.';
      S.log.push(S.over);
    }
    if (crit && hit && de.pv > 0) {
      if (p.crit && !hasAlt(de, p.crit) && !(p.crit === 'effrayé' && de.ast['Inébranlable'])) { de.alt.push(p.crit); S.log.push('Critique : altération ' + p.crit + ' pour ' + de.nom + '.'); }
      else if (!p.crit) S.log.push('Critique : ' + at.nom + ' donne +2 au prochain test d’un allié.');
    }
    // Feulement : la cible est effrayée, que le coup touche ou non
    if (p.decl.indexOf('Feulement') >= 0) {
      if (at.spent.indexOf('Feulement') < 0) at.spent.push('Feulement');
      if (de.pv > 0 && !hasAlt(de, 'effrayé') && !de.ast['Inébranlable']) { de.alt.push('effrayé'); S.log.push('Feulement : altération effrayé pour ' + de.nom + '.'); }
    }
    // Furie : la seconde attaque suit, sans les astuces déjà jouées
    if (!S.over && p.left > 1) { p.left--; p.decl = []; p.auto = false; }
    else { S.pending = null; if (!S.over) S.next = 1 - S.next; }
    S.tour++;
    $('d1').value = $('d2').value = '';
    render();
  }

  // ---------- événements ----------
  $('start').addEventListener('click', function () {
    S = { cats: [readCat(0), readCat(1)], next: +$('first').value, tour: 1, firstCoup: true, extra: false, over: '', log: [] };
    S.log.push(S.cats[S.next].nom + ' provoque le combat et frappe en premier.');
    history = []; $('result').className = 'res hide';
    $('setup').classList.add('hide'); $('fight').classList.remove('hide');
    render();
  });
  $('resume').addEventListener('click', function () {
    var m = $('resume-in').value.match(/WHC1:([A-Za-z0-9+/=]+)/);
    $('resume-err').textContent = '';
    try {
      if (!m) throw new Error();
      S = JSON.parse(decodeURIComponent(escape(atob(m[1]))));
      history = []; $('setup').classList.add('hide'); $('fight').classList.remove('hide'); render();
    } catch (e) { $('resume-err').textContent = 'Code de reprise introuvable dans ce texte.'; }
  });
  $('turn').addEventListener('change', function (e) { if (e.target.id === 'geste' && S) S.cats[S.next].geste = e.target.value; updateTag(); });
  $('resolve').addEventListener('click', resolve);
  $('prep').addEventListener('click', function () {
    var p = plan();
    history.push(JSON.stringify(S));
    S.pending = { at: S.next, g: p.g, sizes: p.sizes, bonus: p.bonus, diff: p.diff, decl: p.decl, auto: p.auto, crit: $('crit-choice').value, left: p.decl.indexOf('Furie') >= 0 ? 2 : 1 };
    S.log.push(S.cats[S.next].nom + ' prépare son coup : ' + p.g + (p.decl.length ? ', astuces ' + p.decl.join(', ') : '') + '.');
    $('result').className = 'res hide';
    render();
  });
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.dataset.alt !== undefined && S) {
      history.push(JSON.stringify(S));
      var c = S.cats[+t.dataset.i], k = c.alt.indexOf(t.dataset.alt);
      if (k >= 0) c.alt.splice(k, 1); else c.alt.push(t.dataset.alt);
      render();
    } else if (t.dataset.pv !== undefined && S) {
      history.push(JSON.stringify(S));
      var cat = S.cats[+t.dataset.i];
      cat.pv = Math.min(cat.max, cat.pv + +t.dataset.pv);
      render();
    }
  });
  $('undo').addEventListener('click', function () { if (!history.length) return; S = JSON.parse(history.pop()); $('result').className = 'res hide'; render(); });
  $('reset').addEventListener('click', function () { if (!confirm('Commencer un nouveau combat ?')) return; S = null; $('fight').classList.add('hide'); $('setup').classList.remove('hide'); });
  function copy(id, btn) {
    var el = $(id); var txt = el.value !== undefined && el.tagName === 'TEXTAREA' ? el.value : el.textContent;
    (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { btn.textContent = 'Copié'; setTimeout(function () { btn.textContent = btn.dataset.l; }, 1400); }, function () { if (el.select) el.select(); });
  }
  [['copy-tag', 'tag'], ['copy-state', 'state-out']].forEach(function (x) { var b = $(x[0]); b.dataset.l = b.textContent; b.addEventListener('click', function () { copy(x[1], b); }); });
})();
