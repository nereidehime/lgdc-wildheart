/* Banque française décomposée ; les filtres portent sur les éléments libres du nom. */
(function () {
  'use strict';
  var form = document.getElementById('lgdc-noms-form');
  var banque = window.lgdcNoms;
  if (!form || !banque) return;
  var rang = document.getElementById('lgdc-noms-rang');
  var resultat = document.getElementById('lgdc-noms-resultat');
  var selection = document.getElementById('lgdc-noms-selection');
  var cases = Array.from(form.querySelectorAll('input[name="trait"]'));
  var noms = {chaton: [], apprenti: [], guerrier: [], chef: []};

  function cle(mot) {
    mot = mot.replace(/^(?:de (?:la |l’)?|du |des |d’|au |aux )/, '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return mot.length > 3 && mot.endsWith('s') ? mot.slice(0, -1) : mot;
  }
  function ajouter(rangNom, texte, premier, second) {
    if (rangNom === 'guerrier' && cle(premier) === cle(second)) return;
    noms[rangNom].push({texte: texte, pre: premier, suf: second, a: banque.evocations[cle(premier)] || 0,
      b: banque.evocations[cle(second)] || 0});
  }
  banque.basesChaton.forEach(function (mot) {
    if (mot.texte === 'Poil' || mot.texte === 'Boule') return;
    ajouter('chaton', (mot.feminin ? 'Petite ' : 'Petit ') + mot.texte, '', mot.texte);
    ['Patte ', 'Boule '].forEach(function (prefixe) {
      ajouter('chaton', prefixe + mot.liaison + mot.texte, '', mot.texte);
    });
  });
  banque.prefixes.forEach(function (prefixe) {
    var suffixes = prefixe.suffixes || banque.complements.concat(banque.attributs[prefixe.accord]);
    suffixes.forEach(function (suffixe) {
      ajouter('guerrier', prefixe.texte + (prefixe.separateur || ' ') + suffixe, prefixe.texte, suffixe);
    });
  });
  banque.complements.concat(banque.attributs.ms).forEach(function (suffixe) {
    if (/nuage/i.test(suffixe)) return;
    ajouter('apprenti', 'Nuage ' + suffixe, '', suffixe);
  });
  banque.complements.concat(banque.attributs.fs).forEach(function (suffixe) {
    if (/étoile|etoile/i.test(suffixe)) return;
    ajouter('chef', 'Étoile ' + suffixe, '', suffixe);
  });
  Object.keys(noms).forEach(function (key) {
    noms[key] = Array.from(new Map(noms[key].map(function (nom) { return [nom.texte, nom]; })).values());
  });

  // guerrier : on peut garder le préfixe ou le suffixe qui plaît et continuer à tirer l'autre moitié
  var verrous = document.createElement('div');
  verrous.className = 'lgdc-noms__verrous';
  resultat.after(verrous);
  var garde = {pre: '', suf: ''}, actuel = null;
  function bouton(cote, mot) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'lgdc-noms__verrou';
    b.setAttribute('aria-pressed', String(garde[cote] === mot));
    var icone = document.createElement('i');
    icone.className = 'ph-light ' + (garde[cote] === mot ? 'ph-lock-simple' : 'ph-lock-simple-open');
    icone.setAttribute('aria-hidden', 'true');
    b.append(icone, (garde[cote] === mot ? 'Gardé : ' : 'Garder ') + '« ' + mot + ' »');
    b.addEventListener('click', function () {
      garde[cote] = garde[cote] === mot ? '' : mot;
      montrer();
    });
    return b;
  }
  function montrer() {
    verrous.replaceChildren();
    if (rang.value !== 'guerrier' || !actuel) return;
    verrous.append(bouton('pre', actuel.pre), bouton('suf', actuel.suf));
  }

  function generer() {
    var coches = cases.filter(function (caseFiltre) { return caseFiltre.checked; }).map(function (caseFiltre) { return caseFiltre.value; });
    var disponibles = banque.filtres.filter(function (filtre) { return coches.includes(filtre.id); });
    var tires = [];
    var nombre = rang.value === 'guerrier' ? Math.min(2, disponibles.length) : Math.min(1, disponibles.length);
    while (tires.length < nombre) {
      tires.push(disponibles.splice(Math.floor(Math.random() * disponibles.length), 1)[0]);
    }
    var choix = noms[rang.value].filter(function (nom) {
      if (!tires.length) return true;
      var premier = tires[0].bit;
      if (rang.value !== 'guerrier') return Boolean(nom.b & premier);
      if (tires.length === 1) return (nom.a & premier) && (nom.b & premier);
      var second = tires[1].bit;
      return ((nom.a & premier) && (nom.b & second)) || ((nom.a & second) && (nom.b & premier));
    });
    if (rang.value === 'guerrier') {
      choix = choix.filter(function (nom) {
        return (!garde.pre || nom.pre === garde.pre) && (!garde.suf || nom.suf === garde.suf);
      });
    }
    var autres = choix.filter(function (nom) { return nom.texte !== resultat.textContent; });
    if (autres.length) choix = autres;
    if (!choix.length) {
      actuel = null;
      montrer();
      resultat.textContent = 'Aucune combinaison';
      selection.textContent = 'Modifie les filtres ou relance le tirage pour trouver un nom compatible.';
      return;
    }
    actuel = choix[Math.floor(Math.random() * choix.length)];
    resultat.textContent = actuel.texte;
    selection.textContent = garde.pre && garde.suf ? 'Les deux moitiés sont gardées : libère-en une pour tirer d’autres noms.' : '';
    montrer();
  }
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    generer();
  });
  form.addEventListener('change', function (event) {
    if (event.target === rang) garde = {pre: '', suf: ''};
    generer();
  });
  document.getElementById('lgdc-noms-effacer').addEventListener('click', function () {
    cases.forEach(function (caseFiltre) { caseFiltre.checked = false; });
    generer();
  });
  generer();
})();
