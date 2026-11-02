/* Pré-lien : formulaire Persona (plugin de Kim, Blank Theme) et mise en page.
   Généré par outils/construire-personas.py depuis header/persona : ne pas modifier ici.
   Nouveau sujet dans le forum 6, ou modification d'un message « prelien » : le formulaire est inséré
   au-dessus de l'éditeur, puis le plugin le relie au message. Dans le sujet, le plugin affiche la mise en page. */
(function () {
  'use strict';
  var FORUM = 6;
  var NAME = "prelien";
  var PLUGIN = "https://cdn.jsdelivr.net/gh/gp-kim/Blank-Theme@main/Persona/persona.js";
  var FORM = "<div class=\"personaForm\" data-persona-name=\"prelien\">\n  <fieldset>\n    <legend>Le personnage</legend>\n    <div class=\"field columns\">\n      <div class=\"field\">\n        <label for=\"wh-pl-nom\">Nom proposé</label>\n        <div class=\"description\">Facultatif. Laisse vide si le nom est libre.</div>\n        <input type=\"text\" id=\"wh-pl-nom\" name=\"nom\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-pl-clan\">Clan</label>\n        <div class=\"description\">Là où vit le personnage.</div>\n        <div class=\"wh-select\"><select id=\"wh-pl-clan\" name=\"clan\">\n          <option value=\"crepuscule\">Clan du Crépuscule</option>\n          <option value=\"hetre\">Clan du Hêtre</option>\n          <option value=\"orchidee\">Clan de l’Orchidée</option>\n          <option value=\"brouillard\">Clan du Brouillard</option>\n          <option value=\"solitaires\">Hors des Clans</option>\n        </select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n      </div>\n    </div>\n    <div class=\"field columns three\">\n      <div class=\"field\">\n        <label for=\"wh-pl-rang\">Rang</label>\n        <input type=\"text\" id=\"wh-pl-rang\" name=\"rang\" placeholder=\"Guerrier, apprenti…\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-pl-age\">Âge</label>\n        <input type=\"text\" id=\"wh-pl-age\" name=\"age\" placeholder=\"En lunes, ou libre\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-pl-sexe\">Sexe</label>\n        <div class=\"wh-select\"><select id=\"wh-pl-sexe\" name=\"sexe\">\n          <option value=\"\">Libre</option>\n          <option value=\"mâle\">Mâle</option>\n          <option value=\"femelle\">Femelle</option>\n        </select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n      </div>\n    </div>\n    <div class=\"field\">\n      <label for=\"wh-pl-avatar\">Adresse d’un avatar</label>\n      <div class=\"description\">Facultatif. Une image carrée pour donner l’idée.</div>\n      <input type=\"text\" id=\"wh-pl-avatar\" name=\"avatar\" />\n    </div>\n  </fieldset>\n\n  <fieldset>\n    <legend>Le lien</legend>\n    <div class=\"field columns\">\n      <div class=\"field\">\n        <label for=\"wh-pl-avec\">Avec mon personnage</label>\n        <input type=\"text\" id=\"wh-pl-avec\" name=\"avec\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-pl-profil\">Lien de sa fiche</label>\n        <div class=\"description\">Facultatif.</div>\n        <input type=\"text\" id=\"wh-pl-profil\" name=\"profil\" />\n      </div>\n    </div>\n    <div class=\"field\">\n      <label for=\"wh-pl-nature\">Ce qui les lie</label>\n      <input type=\"text\" id=\"wh-pl-nature\" name=\"nature\" placeholder=\"Sœur de portée, ancien mentor, rival de patrouille…\" />\n    </div>\n    <div class=\"field\">\n      <label for=\"wh-pl-histoire\">Leur histoire</label>\n      <div class=\"description\">Laisse une ligne vide entre deux paragraphes.</div>\n      <textarea id=\"wh-pl-histoire\" name=\"histoire\" rows=\"5\"></textarea>\n    </div>\n  </fieldset>\n\n  <fieldset>\n    <legend>Le reste</legend>\n    <div class=\"field\">\n      <label for=\"wh-pl-caractere\">Caractère</label>\n      <div class=\"description\">Facultatif. Quelques traits, sans tout imposer.</div>\n      <textarea id=\"wh-pl-caractere\" name=\"caractere\" rows=\"3\"></textarea>\n    </div>\n    <div class=\"field\">\n      <label for=\"wh-pl-libre\">Ce qui reste libre</label>\n      <div class=\"description\">Facultatif. Ce que la personne qui le prendra pourra inventer.</div>\n      <textarea id=\"wh-pl-libre\" name=\"libre\" rows=\"3\"></textarea>\n    </div>\n  </fieldset>\n</div>";

// PERSONA DES PRÉ-LIENS WILDHEART
// Forumactif : JavaScript sur toutes les pages, après le plugin Persona de Kim.
// Mise en page : classes lgdc-app de lgdc-forum.css, comme la fiche de liens.
const WH_PRELIEN_GROUPES = {
  crepuscule: { nom: "Clan du Crépuscule", g1: "#8e7f9a", g2: "#b59ab8" },
  hetre: { nom: "Clan du Hêtre", g1: "#b07a4f", g2: "#c99566" },
  orchidee: { nom: "Clan de l’Orchidée", g1: "#c2a24f", g2: "#d1b46a" },
  brouillard: { nom: "Clan du Brouillard", g1: "#8a99a4", g2: "#7fa39a" },
  solitaires: { nom: "Hors des Clans", g1: "#a39c92", g2: "#857e74" },
};

function whPrelienTexte(value) {
  return String(value ?? "").trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function whPrelienParagraphes(value) {
  return String(value ?? "").trim().split(/\n\s*\n/).filter(Boolean)
    .map((p) => `<p>${whPrelienTexte(p).replace(/\n/g, "<br>")}</p>`).join("");
}
function whPrelienUrl(value) {
  const source = String(value ?? "").trim();
  if (!source) return "";
  try {
    return ["http:", "https:"].includes(new URL(source, "https://wildheart.invalid/").protocol) ? source : "";
  } catch { return ""; }
}

function whPrelien(data = {}) {
  const groupe = Object.hasOwn(WH_PRELIEN_GROUPES, data.clan) ? WH_PRELIEN_GROUPES[data.clan] : WH_PRELIEN_GROUPES.crepuscule;
  const nom = whPrelienTexte(data.nom) || "Nom libre";
  const avatar = whPrelienUrl(data.avatar), profil = whPrelienUrl(data.profil);
  const avec = whPrelienTexte(data.avec);
  const basics = [["Clan", groupe.nom], ["Rang", data.rang], ["Âge", data.age], ["Sexe", data.sexe || "libre"]]
    .filter(([, v]) => String(v ?? "").trim())
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${whPrelienTexte(v)}</dd></div>`).join("");
  const bloc = (titre, texte) => texte ? `<div class="lgdc-app__title"><h3>${titre}</h3></div><div class="lgdc-app__bio"><div class="lgdc-app__story">${texte}</div></div>` : "";
  const lien = [
    data.nature ? `<p><b>${whPrelienTexte(data.nature)}</b>${avec ? `${/^[aeiouyàâäéèêëîïôöùûüœæh]/i.test(data.avec.trim()) ? " d’" : " de "}${profil ? `<a href="${whPrelienTexte(profil)}">${avec}</a>` : avec}` : ""}</p>` : (avec ? `<p>Lié à ${profil ? `<a href="${whPrelienTexte(profil)}">${avec}</a>` : avec}</p>` : ""),
    whPrelienParagraphes(data.histoire),
  ].join("");
  return `<div class="lgdc-app lgdc-app--list" style="--g1:${groupe.g1};--g2:${groupe.g2}">
  <header class="lgdc-app__top"><div class="lgdc-app__head">${avatar ? `<span class="lgdc-app__lav"><img src="${whPrelienTexte(avatar)}" alt="" loading="lazy" width="96" height="96"></span>` : ""}<div><h2 class="lgdc-app__name">${nom}</h2>${avec ? `<p class="lgdc-app__quote">Pré-lien proposé par ${avec}</p>` : ""}</div></div></header>
  ${basics ? `<dl class="lgdc-app__basics">${basics}</dl>` : ""}
  ${bloc("Le lien", lien)}
  ${bloc("Caractère", whPrelienParagraphes(data.caractere))}
  ${bloc("Ce qui reste libre", whPrelienParagraphes(data.libre))}
</div>`;
}

// pas de champ dynamique : rien à brancher sur le formulaire
function whPrelienForm() {}

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
      personaPageTitle: function (action) { return action + ' un pré-lien'; },
      personaHTML: whPrelien
    });
    var form = document.querySelector('.personaForm[data-persona-name="' + NAME + '"]');
    if (form) whPrelienForm(form);
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
