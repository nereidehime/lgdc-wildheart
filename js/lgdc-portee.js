/* Portée à venir : formulaire Persona (plugin de Kim, Blank Theme) et mise en page.
   Généré par outils/construire-personas.py depuis header/persona : ne pas modifier ici.
   Nouveau sujet dans le forum 3, ou modification d'un message « portee » : le formulaire est inséré
   au-dessus de l'éditeur, puis le plugin le relie au message. Dans le sujet, le plugin affiche la mise en page. */
(function () {
  'use strict';
  var FORUM = 3;
  var NAME = "portee";
  var PLUGIN = "https://cdn.jsdelivr.net/gh/gp-kim/Blank-Theme@main/Persona/persona.js";
  var FORM = "<div class=\"personaForm\" data-persona-name=\"portee\">\n  <fieldset>\n    <legend>La mère</legend>\n    <div class=\"field columns\">\n      <div class=\"field\">\n        <label for=\"wh-po-mere\">Nom</label>\n        <input type=\"text\" id=\"wh-po-mere\" name=\"mere\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-po-mere-fiche\">Lien de sa fiche</label>\n        <input type=\"text\" id=\"wh-po-mere-fiche\" name=\"mereFiche\" />\n      </div>\n    </div>\n    <div class=\"field columns\">\n      <div class=\"field\">\n        <label for=\"wh-po-clan\">Clan</label>\n        <div class=\"description\">Les chatons naissent dans le Clan de leur mère.</div>\n        <div class=\"wh-select\"><select id=\"wh-po-clan\" name=\"clan\">\n          <option value=\"crepuscule\">Clan du Crépuscule</option>\n          <option value=\"hetre\">Clan du Hêtre</option>\n          <option value=\"orchidee\">Clan de l’Orchidée</option>\n          <option value=\"brouillard\">Clan du Brouillard</option>\n          <option value=\"solitaires\">Hors des Clans</option>\n        </select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-po-mere-pelage\">Pelage et yeux</label>\n        <div class=\"description\">Le staff s’en sert pour la génétique.</div>\n        <input type=\"text\" id=\"wh-po-mere-pelage\" name=\"merePelage\" />\n      </div>\n    </div>\n  </fieldset>\n\n  <fieldset>\n    <legend>Le père</legend>\n    <div class=\"field columns\">\n      <div class=\"field\">\n        <label for=\"wh-po-pere\">Nom</label>\n        <input type=\"text\" id=\"wh-po-pere\" name=\"pere\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-po-pere-fiche\">Lien de sa fiche</label>\n        <input type=\"text\" id=\"wh-po-pere-fiche\" name=\"pereFiche\" />\n      </div>\n    </div>\n    <div class=\"field columns\">\n      <div class=\"field\">\n        <label for=\"wh-po-pere-clan\">Clan</label>\n        <div class=\"wh-select\"><select id=\"wh-po-pere-clan\" name=\"pereClan\">\n          <option value=\"crepuscule\">Clan du Crépuscule</option>\n          <option value=\"hetre\">Clan du Hêtre</option>\n          <option value=\"orchidee\">Clan de l’Orchidée</option>\n          <option value=\"brouillard\">Clan du Brouillard</option>\n          <option value=\"solitaires\">Hors des Clans</option>\n        </select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-po-pere-pelage\">Pelage et yeux</label>\n        <input type=\"text\" id=\"wh-po-pere-pelage\" name=\"perePelage\" />\n      </div>\n    </div>\n    <div class=\"field\">\n      <label for=\"wh-po-couple\">Le couple</label>\n      <div class=\"description\">Leur histoire, ce que la portée change pour eux. Laisse une ligne vide entre deux paragraphes.</div>\n      <textarea id=\"wh-po-couple\" name=\"couple\" rows=\"4\"></textarea>\n    </div>\n  </fieldset>\n\n  <fieldset>\n    <legend>Les chatons</legend>\n    <div class=\"description legend-help\">Le nombre de chatons se tire avec le dé Portée, et le staff choisit le pelage et les yeux de chacun d’après les parents. Les parents décident du reste.</div>\n    <div class=\"field columns\">\n      <div class=\"field\">\n        <label for=\"wh-po-nombre\">Nombre de chatons</label>\n        <div class=\"description\">Le résultat du dé Portée, une fois lancé.</div>\n        <input type=\"number\" id=\"wh-po-nombre\" name=\"nombre\" min=\"1\" max=\"8\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-po-places\">Places ouvertes</label>\n        <div class=\"description\">Combien de chatons d’autres membres peuvent prendre.</div>\n        <input type=\"number\" id=\"wh-po-places\" name=\"places\" min=\"0\" max=\"8\" />\n      </div>\n    </div>\n    <div class=\"field\">\n      <label for=\"wh-po-envies\">Ce que vous imaginez</label>\n      <div class=\"description\">Facultatif. Caractères, noms, place de chacun dans la famille.</div>\n      <textarea id=\"wh-po-envies\" name=\"envies\" rows=\"4\"></textarea>\n    </div>\n    <div class=\"field\">\n      <label for=\"wh-po-limites\">Ce que vous ne voulez pas</label>\n      <div class=\"description\">Facultatif. Caractères ou relations à éviter, avec les parents comme entre eux.</div>\n      <textarea id=\"wh-po-limites\" name=\"limites\" rows=\"3\"></textarea>\n    </div>\n    <div class=\"field\">\n      <label for=\"wh-po-conditions\">Conditions d’adoption</label>\n      <div class=\"description\">Facultatif. Activité, présence aux RP de famille…</div>\n      <textarea id=\"wh-po-conditions\" name=\"conditions\" rows=\"3\"></textarea>\n    </div>\n    <div class=\"field\">\n      <label for=\"wh-po-reserves\">Chatons pris</label>\n      <div class=\"description\">À tenir à jour : un chaton par ligne, avec le pseudo de la personne qui le joue.</div>\n      <textarea id=\"wh-po-reserves\" name=\"reserves\" rows=\"3\"></textarea>\n    </div>\n  </fieldset>\n</div>";

// PERSONA DES PORTÉES À VENIR WILDHEART
// Forumactif : JavaScript sur toutes les pages, après le plugin Persona de Kim.
// Mise en page : classes lgdc-app de lgdc-forum.css, comme la fiche de liens.
const WH_PORTEE_GROUPES = {
  crepuscule: { nom: "Clan du Crépuscule", court: "Crépuscule", g1: "#8e7f9a", g2: "#b59ab8" },
  hetre: { nom: "Clan du Hêtre", court: "Hêtre", g1: "#b07a4f", g2: "#c99566" },
  orchidee: { nom: "Clan de l’Orchidée", court: "Orchidée", g1: "#c2a24f", g2: "#d1b46a" },
  brouillard: { nom: "Clan du Brouillard", court: "Brouillard", g1: "#8a99a4", g2: "#7fa39a" },
  solitaires: { nom: "Hors des Clans", court: "Hors des Clans", g1: "#a39c92", g2: "#857e74" },
};

function whPorteeTexte(value) {
  return String(value ?? "").trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function whPorteeParagraphes(value) {
  return String(value ?? "").trim().split(/\n\s*\n/).filter(Boolean)
    .map((p) => `<p>${whPorteeTexte(p).replace(/\n/g, "<br>")}</p>`).join("");
}
function whPorteeUrl(value) {
  const source = String(value ?? "").trim();
  if (!source) return "";
  try {
    return ["http:", "https:"].includes(new URL(source, "https://wildheart.invalid/").protocol) ? source : "";
  } catch { return ""; }
}
function whPorteeGroupe(key) {
  return Object.hasOwn(WH_PORTEE_GROUPES, key) ? WH_PORTEE_GROUPES[key] : WH_PORTEE_GROUPES.crepuscule;
}

function whPortee(data = {}) {
  const clan = whPorteeGroupe(data.clan);
  const parent = (role, nom, fiche, groupe, pelage) => {
    const n = whPorteeTexte(nom), url = whPorteeUrl(fiche);
    if (!n) return "";
    return `<div class="lgdc-app__link" style="--g1:${groupe.g1};--g2:${groupe.g2}">
  <span class="lgdc-app__lav"><i class="ph-light ph-cat" aria-hidden="true"></i></span>
  <div><p class="lgdc-app__lname">${url ? `<a href="${whPorteeTexte(url)}">${n}</a>` : n}</p>
  <ul class="lgdc-app__chips"><li>${role}</li><li>${groupe.court}</li></ul>
  ${pelage ? `<p>${whPorteeTexte(pelage)}</p>` : ""}</div>
</div>`;
  };
  const mere = String(data.mere ?? "").trim(), pere = String(data.pere ?? "").trim();
  const de = (n) => (/^[aeiouyàâäéèêëîïôöùûüœæh]/i.test(n) ? "d’" : "de ") + whPorteeTexte(n);
  const titre = mere ? `La portée ${de(mere)}${pere ? ` et ${whPorteeTexte(pere)}` : ""}` : "La portée à venir";
  const nombre = parseInt(data.nombre, 10), places = parseInt(data.places, 10);
  const basics = [
    ["Clan", clan.nom],
    ["Chatons", nombre > 0 ? String(nombre) : "dé à lancer"],
    ["Places ouvertes", places >= 0 ? String(places) : "à préciser"],
    ["Génétique", "choisie par le staff"],
  ].map(([k, v]) => `<div><dt>${k}</dt><dd>${whPorteeTexte(v)}</dd></div>`).join("");
  const bloc = (titre, texte) => texte ? `<div class="lgdc-app__title"><h3>${titre}</h3></div><div class="lgdc-app__bio"><div class="lgdc-app__story">${texte}</div></div>` : "";
  const pris = String(data.reserves ?? "").split(/\n/).map((l) => l.trim()).filter(Boolean);
  const parents = parent("Mère", data.mere, data.mereFiche, clan, data.merePelage) + parent("Père", data.pere, data.pereFiche, whPorteeGroupe(data.pereClan), data.perePelage);
  return `<div class="lgdc-app lgdc-app--list" style="--g1:${clan.g1};--g2:${clan.g2}">
  <header class="lgdc-app__top"><div><h2 class="lgdc-app__name">${titre}</h2></div></header>
  <dl class="lgdc-app__basics">${basics}</dl>
  ${parents ? `<div class="lgdc-app__title"><h3>Les parents</h3></div><div class="lgdc-app__links">${parents}</div>` : ""}
  ${bloc("Le couple", whPorteeParagraphes(data.couple))}
  ${bloc("Ce qu’ils imaginent", whPorteeParagraphes(data.envies))}
  ${bloc("Ce qu’ils ne veulent pas", whPorteeParagraphes(data.limites))}
  ${bloc("Conditions d’adoption", whPorteeParagraphes(data.conditions))}
  ${bloc("Chatons pris", pris.length ? `<ul>${pris.map((l) => `<li>${whPorteeTexte(l)}</li>`).join("")}</ul>` : "")}
</div>`;
}

// le titre du sujet suit les parents, tant que le membre ne l'a pas réécrit
function whPorteeForm(form) {
  const subject = document.querySelector('input[name="subject"]');
  if (!subject) return;
  const champ = (name) => (form.querySelector(`[name="${name}"]`)?.value || "").trim();
  let auto = subject.value;
  function sync() {
    if (subject.value !== auto && subject.value.trim()) return;
    const noms = [champ("mere"), champ("pere")].filter(Boolean);
    auto = subject.value = noms.length ? `${whPorteeGroupe(champ("clan")).court} - Portée de ${noms.join(" et ")}` : "";
  }
  form.addEventListener("input", sync);
  form.addEventListener("change", sync);
  if (!subject.value.trim()) sync();
}

  var area = document.querySelector('textarea#text_editor_textarea');
  var writing = location.href.indexOf('/post?f=' + FORUM + '&mode=newtopic') >= 0
    || (area && area.value.indexOf('<div class="persona">{"name":"' + NAME + '"') >= 0);
  var shown = document.querySelector('.persona');
  var showing = shown && shown.textContent.indexOf('"name":"' + NAME + '"') >= 0;
  if (!writing && !showing) return;
  if (writing && !document.querySelector('[data-persona-name="' + NAME + '"]')) {
    var edition = document.querySelector('.message-edition');
    if (!edition) return;
    var holder = document.createElement('div');
    holder.innerHTML = FORM;
    edition.parentNode.insertBefore(holder.firstElementChild, edition);
  }
  function start() {
    new Persona({
      category: [FORUM],
      name: NAME,
      personaPageTitle: function (action) { return action + ' une portée'; },
      personaHTML: whPortee
    });
    var form = document.querySelector('.personaForm[data-persona-name="' + NAME + '"]');
    if (form) whPorteeForm(form);
  }
  if (typeof Persona !== 'undefined') start();
  else {
    // les trois modules partagent le même plugin, chargé une seule fois
    var script = document.querySelector('script[src="' + PLUGIN + '"]');
    if (script) { script.addEventListener('load', start); return; }
    script = document.createElement('script');
    script.src = PLUGIN;
    script.onload = start;
    script.onerror = function () { console.warn('Wildheart : plugin Persona indisponible'); };
    document.head.appendChild(script);
  }
})();
