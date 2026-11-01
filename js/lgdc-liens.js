/* Fiche de liens : formulaire Persona (plugin de Kim, Blank Theme) et mise en page.
   Généré par outils/construire-personas.py depuis header/persona : ne pas modifier ici.
   Nouveau sujet dans le forum 2, ou modification d'un message « liens » : le formulaire est inséré
   au-dessus de l'éditeur, puis le plugin le relie au message. Dans le sujet, le plugin affiche la mise en page. */
(function () {
  'use strict';
  var FORUM = 2;
  var NAME = "liens";
  var PLUGIN = "https://cdn.jsdelivr.net/gh/gp-kim/Blank-Theme@main/Persona/persona.js";
  var FORM = "<div class=\"personaForm\" data-persona-name=\"liens\">\n  <fieldset>\n    <legend>Identité</legend>\n    <div class=\"field columns\">\n      <div class=\"field\">\n        <label for=\"wh-liens-nom\">Nom du chat</label>\n        <input type=\"text\" id=\"wh-liens-nom\" name=\"nom\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-liens-clan\">Clan</label>\n        <div class=\"wh-select\"><select id=\"wh-liens-clan\" name=\"clan\">\n          <option value=\"crepuscule\">Clan du Crépuscule</option>\n          <option value=\"hetre\">Clan du Hêtre</option>\n          <option value=\"orchidee\">Clan de l’Orchidée</option>\n          <option value=\"brouillard\">Clan du Brouillard</option>\n        </select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n      </div>\n    </div>\n    <div class=\"field\">\n      <label for=\"wh-liens-citation\">Quelques mots</label>\n      <div class=\"description\">Facultatif. Une citation ou une courte introduction.</div>\n      <textarea id=\"wh-liens-citation\" name=\"citation\"></textarea>\n    </div>\n  </fieldset>\n\n  <fieldset>\n    <legend>Les liens</legend>\n    <div class=\"description legend-help\">Un lien peut concerner un personnage ou un groupe. Un RP terminé permet de gagner une émotion. L’émotion opposée remplace l’ancienne.</div>\n    <input type=\"text\" class=\"wh-store\" name=\"relations\" value=\"[]\" tabindex=\"-1\" aria-hidden=\"true\" readonly />\n    <div data-wh-liens-list></div>\n    <div><button type=\"button\" class=\"addField\" data-wh-liens-add><i class=\"ph-light ph-plus\" aria-hidden=\"true\"></i>Ajouter un lien</button></div>\n    <p class=\"description wh-liens__status\" data-wh-liens-status role=\"status\" aria-live=\"polite\"></p>\n  </fieldset>\n\n  <template data-wh-lien-template>\n    <div class=\"wh-liens__entry\" data-wh-lien>\n      <div class=\"wh-liens__name-row\">\n        <div class=\"field\">\n          <label for=\"wh-lien-__id__-nom\">Personnage ou groupe</label>\n          <input type=\"text\" id=\"wh-lien-__id__-nom\" data-wh-lien-field=\"nom\" />\n        </div>\n        <button type=\"button\" class=\"wh-liens__remove\" data-wh-lien-remove aria-label=\"Supprimer ce lien\"><i class=\"ph-light ph-trash\" aria-hidden=\"true\"></i></button>\n      </div>\n      <div class=\"field columns\">\n        <div class=\"field\">\n          <label for=\"wh-lien-__id__-groupe\">Groupe</label>\n          <div class=\"wh-select\"><select id=\"wh-lien-__id__-groupe\" data-wh-lien-field=\"groupe\">\n            <option value=\"crepuscule\">Clan du Crépuscule</option>\n            <option value=\"hetre\">Clan du Hêtre</option>\n            <option value=\"orchidee\">Clan de l’Orchidée</option>\n            <option value=\"brouillard\">Clan du Brouillard</option>\n            <option value=\"solitaires\">Hors des Clans</option>\n          </select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n        </div>\n        <div class=\"field\">\n          <label for=\"wh-lien-__id__-rang\">Rang ou rôle</label>\n          <input type=\"text\" id=\"wh-lien-__id__-rang\" data-wh-lien-field=\"rang\" />\n        </div>\n      </div>\n      <div class=\"field columns\">\n        <div class=\"field\">\n          <label for=\"wh-lien-__id__-avatar\">Adresse de l’avatar</label>\n          <div class=\"description\">Facultatif. L’image sera affichée dans un carré.</div>\n          <input type=\"text\" id=\"wh-lien-__id__-avatar\" data-wh-lien-field=\"avatar\" />\n        </div>\n        <div class=\"field\">\n          <label for=\"wh-lien-__id__-profil\">Lien du profil ou du groupe</label>\n          <div class=\"description\">Facultatif.</div>\n          <input type=\"text\" id=\"wh-lien-__id__-profil\" data-wh-lien-field=\"profil\" />\n        </div>\n      </div>\n      <div class=\"field columns three\">\n        <div class=\"field\">\n          <label for=\"wh-lien-__id__-estime\">Admiration ou mépris</label>\n          <div class=\"wh-select\"><select id=\"wh-lien-__id__-estime\" data-wh-lien-field=\"estime\">\n            <option value=\"\">Aucune émotion</option><option value=\"admiration\">Admiration</option><option value=\"mépris\">Mépris</option>\n          </select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n        </div>\n        <div class=\"field\">\n          <label for=\"wh-lien-__id__-confiance\">Loyauté ou méfiance</label>\n          <div class=\"wh-select\"><select id=\"wh-lien-__id__-confiance\" data-wh-lien-field=\"confiance\">\n            <option value=\"\">Aucune émotion</option><option value=\"loyauté\">Loyauté</option><option value=\"méfiance\">Méfiance</option>\n          </select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n        </div>\n        <div class=\"field\">\n          <label for=\"wh-lien-__id__-attachement\">Affection ou haine</label>\n          <div class=\"wh-select\"><select id=\"wh-lien-__id__-attachement\" data-wh-lien-field=\"attachement\">\n            <option value=\"\">Aucune émotion</option><option value=\"affection\">Affection</option><option value=\"haine\">Haine</option>\n          </select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n        </div>\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-lien-__id__-description\">La relation</label>\n        <div class=\"description\">Laisse une ligne vide entre deux paragraphes.</div>\n        <textarea id=\"wh-lien-__id__-description\" data-wh-lien-field=\"description\" rows=\"3\"></textarea>\n      </div>\n    </div>\n  </template>\n</div>";

// PERSONA DE LA FICHE DE LIENS WILDHEART
// Forumactif : JavaScript sur toutes les pages, après le plugin Persona de Kim.
// Indépendant du Persona de présentation ; styles : persona.css et lgdc-forum.css.
const WH_LIENS_GROUPES = {
  crepuscule: { nom: "Clan du Crépuscule", court: "Crépuscule", g1: "#8e7f9a", g2: "#b59ab8" },
  hetre: { nom: "Clan du Hêtre", court: "Hêtre", g1: "#b07a4f", g2: "#c99566" },
  orchidee: { nom: "Clan de l’Orchidée", court: "Orchidée", g1: "#c2a24f", g2: "#d1b46a" },
  brouillard: { nom: "Clan du Brouillard", court: "Brouillard", g1: "#8a99a4", g2: "#7fa39a" },
  solitaires: { nom: "Hors des Clans", court: "Hors des Clans", g1: "#a39c92", g2: "#857e74" },
};
const WH_LIENS_EMOTIONS = {
  estime: ["admiration", "mépris"],
  confiance: ["loyauté", "méfiance"],
  attachement: ["affection", "haine"],
};

function whLienTexte(value) {
  return String(value ?? "").trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function whLienParagraphes(value) {
  return String(value ?? "").trim().split(/\n\s*\n/).filter(Boolean)
    .map((p) => `<p>${whLienTexte(p).replace(/\n/g, "<br>")}</p>`).join("");
}
function whLienUrl(value) {
  const source = String(value ?? "").trim();
  if (!source) return "";
  try {
    return ["http:", "https:"].includes(new URL(source, "https://wildheart.invalid/").protocol) ? source : "";
  } catch { return ""; }
}
function whLireLiens(value) {
  let rows;
  try { rows = Array.isArray(value) ? value : JSON.parse(value || "[]"); }
  catch { return []; }
  if (!Array.isArray(rows)) return [];
  return rows.filter((row) => row && typeof row === "object" && !Array.isArray(row)).map((row) => {
    const result = {};
    ["nom", "rang", "avatar", "profil", "description"].forEach((key) => { result[key] = String(row[key] ?? "").trim(); });
    result.groupe = Object.hasOwn(WH_LIENS_GROUPES, row.groupe) ? row.groupe : "solitaires";
    Object.entries(WH_LIENS_EMOTIONS).forEach(([key, values]) => { result[key] = values.includes(row[key]) ? row[key] : ""; });
    return result;
  });
}

function whLiens(data = {}) {
  const clan = Object.hasOwn(WH_LIENS_GROUPES, data.clan) ? WH_LIENS_GROUPES[data.clan] : WH_LIENS_GROUPES.crepuscule;
  const nom = String(data.nom ?? "").trim() || "mon personnage";
  const titre = `Les liens ${/^[aeiouyàâäéèêëîïôöùûüœæh]/i.test(nom) ? "d’" : "de "}${whLienTexte(nom)}`;
  const rows = whLireLiens(data.relations).filter((row) => row.nom);
  const sections = Object.entries(WH_LIENS_GROUPES).map(([key, groupe]) => {
    const liens = rows.filter((row) => row.groupe === key).map((row) => {
      const avatar = whLienUrl(row.avatar), profil = whLienUrl(row.profil);
      const nom = whLienTexte(row.nom);
      const emotions = Object.keys(WH_LIENS_EMOTIONS).map((k) => row[k]).filter(Boolean);
      return `<div class="lgdc-app__link" style="--g1:${groupe.g1};--g2:${groupe.g2}">
  <span class="lgdc-app__lav">${avatar ? `<img src="${whLienTexte(avatar)}" alt="Avatar de ${nom}" loading="lazy" width="96" height="96">` : '<i class="ph-light ph-cat" role="img" aria-label="Sans avatar"></i>'}</span>
  <div><p class="lgdc-app__lname">${profil ? `<a href="${whLienTexte(profil)}">${nom}</a>` : nom}</p>
  <ul class="lgdc-app__chips"><li>${groupe.court}</li>${row.rang ? `<li>${whLienTexte(row.rang)}</li>` : ""}${emotions.length ? emotions.map((e) => `<li class="is-emo">${e}</li>`).join("") : '<li>pas encore d’émotion</li>'}</ul>
  ${whLienParagraphes(row.description)}</div>
</div>`;
    }).join("\n");
    return liens ? `<div class="lgdc-app__title"><h3>${groupe.nom}</h3></div><div class="lgdc-app__links">${liens}</div>` : "";
  }).filter(Boolean).join("\n");
  return `<div class="lgdc-app lgdc-app--list" style="--g1:${clan.g1};--g2:${clan.g2}">
  <header class="lgdc-app__top"><div><h2 class="lgdc-app__name">${titre}</h2>${data.citation ? `<p class="lgdc-app__quote">${whLienTexte(data.citation)}</p>` : ""}</div></header>
  ${sections || '<div class="lgdc-app__title"><h3>Les rencontres à venir</h3></div><div class="lgdc-app__bio"><div class="lgdc-app__story"><p>Aucun lien pour le moment.</p></div></div>'}
</div>`;
}

function whLiensForm(form) {
  if (form.dataset.whLiensReady) return;
  form.dataset.whLiensReady = "true";
  const store = form.querySelector('[name="relations"]');
  const list = form.querySelector("[data-wh-liens-list]");
  const template = form.querySelector("[data-wh-lien-template]");
  const add = form.querySelector("[data-wh-liens-add]");
  const status = form.querySelector("[data-wh-liens-status]");
  let serial = store.value, nextId = 0;
  function append(data = {}) {
    const copy = document.createElement("template");
    copy.innerHTML = template.innerHTML.replaceAll("__id__", String(nextId++));
    const row = copy.content.firstElementChild;
    row.querySelectorAll("[data-wh-lien-field]").forEach((input) => {
      const key = input.dataset.whLienField;
      input.value = data[key] ?? (key === "groupe" ? form.querySelector('[name="clan"]').value : "");
    });
    list.append(row);
    return row;
  }
  function restore() {
    list.replaceChildren();
    const rows = whLireLiens(store.value);
    (rows.length ? rows : [{}]).forEach(append);
    serial = store.value;
  }
  function refresh() { if (store.value !== serial) restore(); }
  function commit() {
    const rows = [...list.querySelectorAll("[data-wh-lien]")].map((row) => Object.fromEntries(
      [...row.querySelectorAll("[data-wh-lien-field]")].map((input) => [input.dataset.whLienField, input.value])
    ));
    serial = JSON.stringify(rows);
    if (store.value === serial) return;
    store.value = serial;
    store.dispatchEvent(new Event("input", { bubbles: true }));
  }
  function edit(event) {
    if (event.target === store) refresh();
    else if (event.target.matches("[data-wh-lien-field]")) commit();
  }
  form.addEventListener("input", edit);
  form.addEventListener("change", edit);
  add.addEventListener("click", () => {
    const row = append();
    commit();
    row.querySelector('[data-wh-lien-field="nom"]').focus();
    status.textContent = "Lien ajouté.";
  });
  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-wh-lien-remove]");
    if (!button) return;
    const row = button.closest("[data-wh-lien]");
    const nom = row.querySelector('[data-wh-lien-field="nom"]').value.trim();
    const next = row.nextElementSibling || row.previousElementSibling;
    row.remove();
    commit();
    (next ? next.querySelector('[data-wh-lien-field="nom"]') : add).focus();
    status.textContent = nom ? `Lien avec ${nom} supprimé.` : "Lien supprimé.";
  });
  restore();
  // Persona remplit les champs sauvegardés puis révèle le formulaire en mode édition.
  new MutationObserver(refresh).observe(form, { attributes: true, attributeFilter: ["style", "class"] });
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
      personaPageTitle: function (action) { return action + ' sa fiche de liens'; },
      personaHTML: whLiens
    });
    var form = document.querySelector('.personaForm[data-persona-name="' + NAME + '"]');
    if (form) whLiensForm(form);
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
