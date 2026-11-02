/* Recherche de RP : formulaire Persona (plugin de Kim, Blank Theme) et mise en page.
   Généré par outils/construire-personas.py depuis header/persona : ne pas modifier ici.
   Nouveau sujet dans le forum 26, ou modification d'un message « recherche » : le formulaire est inséré
   au-dessus de l'éditeur, puis le plugin le relie au message. Dans le sujet, le plugin affiche la mise en page. */
(function () {
  'use strict';
  var FORUM = 26;
  var NAME = "recherche";
  var PLUGIN = "https://cdn.jsdelivr.net/gh/gp-kim/Blank-Theme@main/Persona/persona.js";
  var FORM = "<div class=\"personaForm\" data-persona-name=\"recherche\">\n  <fieldset>\n    <legend>Ton chat</legend>\n    <div class=\"field columns\">\n      <div class=\"field\">\n        <label for=\"wh-re-nom\">Nom</label>\n        <input type=\"text\" id=\"wh-re-nom\" name=\"nom\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-re-fiche\">Lien de sa fiche</label>\n        <div class=\"description\">Facultatif.</div>\n        <input type=\"text\" id=\"wh-re-fiche\" name=\"fiche\" />\n      </div>\n    </div>\n    <div class=\"field\">\n      <label for=\"wh-re-clan\">Clan</label>\n      <div class=\"wh-select\"><select id=\"wh-re-clan\" name=\"clan\">\n        <option value=\"crepuscule\">Clan du Crépuscule</option>\n        <option value=\"hetre\">Clan du Hêtre</option>\n        <option value=\"orchidee\">Clan de l’Orchidée</option>\n        <option value=\"brouillard\">Clan du Brouillard</option>\n        <option value=\"solitaires\">Hors des Clans</option>\n      </select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n    </div>\n  </fieldset>\n\n  <fieldset>\n    <legend>Le RP</legend>\n    <div class=\"field columns\">\n      <div class=\"field\">\n        <label for=\"wh-re-genre\">Genre de scène</label>\n        <div class=\"wh-select\"><select id=\"wh-re-genre\" name=\"genre\">\n          <option value=\"Patrouille\">Patrouille</option>\n          <option value=\"Chasse\">Chasse</option>\n          <option value=\"Entraînement\">Entraînement</option>\n          <option value=\"Rencontre\">Rencontre</option>\n          <option value=\"Conflit\">Conflit</option>\n          <option value=\"Vie du camp\">Vie du camp</option>\n          <option value=\"Assemblée\">Assemblée</option>\n          <option value=\"Autre\">Autre</option>\n        </select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-re-qui\">Qui peut répondre</label>\n        <div class=\"wh-select\"><select id=\"wh-re-qui\" name=\"qui\">\n          <option value=\"Tout le monde\">Tout le monde</option>\n          <option value=\"Son Clan\">Son Clan seulement</option>\n          <option value=\"Un autre Clan\">Un autre Clan</option>\n          <option value=\"Hors des Clans\">Hors des Clans</option>\n        </select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n      </div>\n    </div>\n    <div class=\"field columns three\">\n      <div class=\"field\">\n        <label for=\"wh-re-places\">Partenaires</label>\n        <input type=\"number\" id=\"wh-re-places\" name=\"places\" min=\"1\" max=\"10\" value=\"1\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-re-lieu\">Lieu</label>\n        <input type=\"text\" id=\"wh-re-lieu\" name=\"lieu\" placeholder=\"Libre\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-re-moment\">Moment</label>\n        <div class=\"wh-select\"><select id=\"wh-re-moment\" name=\"moment\">\n          <option value=\"\">Libre</option>\n          <option>Aube</option><option>Matin</option><option>Midi</option><option>Après-midi</option><option>Soir</option><option>Nuit</option>\n        </select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n      </div>\n    </div>\n    <div class=\"field\">\n      <label for=\"wh-re-idee\">L’idée</label>\n      <div class=\"description\">Ce qui se passe, ce que ton chat cherche. Laisse une ligne vide entre deux paragraphes.</div>\n      <textarea id=\"wh-re-idee\" name=\"idee\" rows=\"5\"></textarea>\n    </div>\n    <div class=\"field\">\n      <label for=\"wh-re-avertir\">Contenu à signaler</label>\n      <div class=\"description\">Facultatif. Sang, mort d’un personnage…</div>\n      <input type=\"text\" id=\"wh-re-avertir\" name=\"avertir\" />\n    </div>\n  </fieldset>\n</div>";

// PERSONA DES RECHERCHES DE RP WILDHEART
// Forumactif : JavaScript sur toutes les pages, après le plugin Persona de Kim.
// Mise en page : classes lgdc-app de lgdc-forum.css, comme la fiche de liens.
const WH_RECHERCHE_GROUPES = {
  crepuscule: { nom: "Clan du Crépuscule", court: "Crépuscule", g1: "#8e7f9a", g2: "#b59ab8" },
  hetre: { nom: "Clan du Hêtre", court: "Hêtre", g1: "#b07a4f", g2: "#c99566" },
  orchidee: { nom: "Clan de l’Orchidée", court: "Orchidée", g1: "#c2a24f", g2: "#d1b46a" },
  brouillard: { nom: "Clan du Brouillard", court: "Brouillard", g1: "#8a99a4", g2: "#7fa39a" },
  solitaires: { nom: "Hors des Clans", court: "Hors des Clans", g1: "#a39c92", g2: "#857e74" },
};

function whRechercheTexte(value) {
  return String(value ?? "").trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function whRechercheParagraphes(value) {
  return String(value ?? "").trim().split(/\n\s*\n/).filter(Boolean)
    .map((p) => `<p>${whRechercheTexte(p).replace(/\n/g, "<br>")}</p>`).join("");
}
function whRechercheUrl(value) {
  const source = String(value ?? "").trim();
  if (!source) return "";
  try {
    return ["http:", "https:"].includes(new URL(source, "https://wildheart.invalid/").protocol) ? source : "";
  } catch { return ""; }
}
function whRechercheGroupe(key) {
  return Object.hasOwn(WH_RECHERCHE_GROUPES, key) ? WH_RECHERCHE_GROUPES[key] : WH_RECHERCHE_GROUPES.crepuscule;
}

function whRecherche(data = {}) {
  const groupe = whRechercheGroupe(data.clan);
  const nom = whRechercheTexte(data.nom), fiche = whRechercheUrl(data.fiche);
  const genre = whRechercheTexte(data.genre) || "RP";
  const places = parseInt(data.places, 10) > 0 ? parseInt(data.places, 10) : 1;
  const basics = [
    ["Scène", genre],
    ["Partenaires", places > 1 ? `${places} chats` : "1 chat"],
    ["Pour", data.qui === "Son Clan" ? groupe.nom : data.qui || "Tout le monde"],
    ["Où et quand", [data.lieu, String(data.moment ?? "").toLowerCase()].map((v) => String(v ?? "").trim()).filter(Boolean).join(", ") || "libre"],
  ].map(([k, v]) => `<div><dt>${k}</dt><dd>${whRechercheTexte(v)}</dd></div>`).join("");
  const qui = nom ? (fiche ? `<a href="${whRechercheTexte(fiche)}">${nom}</a>` : nom) : "";
  return `<div class="lgdc-app lgdc-app--list" style="--g1:${groupe.g1};--g2:${groupe.g2}">
  <header class="lgdc-app__top"><div><h2 class="lgdc-app__name">${genre}${nom ? ` avec ${nom}` : ""}</h2><p class="lgdc-app__quote">${qui ? `${qui}, ${groupe.nom}` : groupe.nom}</p></div></header>
  <dl class="lgdc-app__basics">${basics}</dl>
  ${data.avertir ? `<div class="lgdc-app__bio"><p class="lgdc-app__state">À savoir : ${whRechercheTexte(data.avertir)}</p></div>` : ""}
  <div class="lgdc-app__title"><h3>L’idée</h3></div><div class="lgdc-app__bio"><div class="lgdc-app__story">${whRechercheParagraphes(data.idee) || "<p>Tout est à imaginer ensemble.</p>"}</div></div>
</div>`;
}

// le titre du sujet suit le formulaire (Clan - Scène - Nom), tant que le membre ne l'a pas réécrit
function whRechercheForm(form) {
  const subject = document.querySelector('input[name="subject"]');
  if (!subject) return;
  const champ = (name) => (form.querySelector(`[name="${name}"]`)?.value || "").trim();
  let auto = subject.value;
  function sync() {
    if (subject.value !== auto && subject.value.trim()) return;
    auto = subject.value = [whRechercheGroupe(champ("clan")).court, champ("genre"), champ("nom")].filter(Boolean).join(" - ");
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
      personaPageTitle: function (action) { return action + ' une recherche de RP'; },
      personaHTML: whRecherche
    });
    var form = document.querySelector('.personaForm[data-persona-name="' + NAME + '"]');
    if (form) whRechercheForm(form);
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
