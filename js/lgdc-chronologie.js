/* Chronologie : formulaire Persona (plugin de Kim, Blank Theme) et mise en page.
   Généré par outils/construire-personas.py depuis header/persona : ne pas modifier ici.
   Nouveau sujet dans le forum 25, ou modification d'un message « chronologie » : le formulaire est inséré
   au-dessus de l'éditeur, puis le plugin le relie au message. Dans le sujet, le plugin affiche la mise en page. */
(function () {
  'use strict';
  var FORUM = 25;
  var NAME = "chronologie";
  var PLUGIN = "https://cdn.jsdelivr.net/gh/gp-kim/Blank-Theme@main/Persona/persona.js";
  var FORM = "<div class=\"personaForm\" data-persona-name=\"chronologie\">\n  <fieldset>\n    <legend>Identité</legend>\n    <div class=\"field columns\">\n      <div class=\"field\">\n        <label for=\"wh-chrono-nom\">Nom du chat</label>\n        <input type=\"text\" id=\"wh-chrono-nom\" name=\"nom\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-chrono-clan\">Clan</label>\n        <div class=\"wh-select\"><select id=\"wh-chrono-clan\" name=\"clan\">\n          <option value=\"crepuscule\">Clan du Crépuscule</option>\n          <option value=\"hetre\">Clan du Hêtre</option>\n          <option value=\"orchidee\">Clan de l’Orchidée</option>\n          <option value=\"brouillard\">Clan du Brouillard</option>\n        </select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n      </div>\n    </div>\n  </fieldset>\n\n  <fieldset>\n    <legend>Les RP</legend>\n    <div class=\"description legend-help\">Les RP sont regroupés par lune, du plus récent au plus ancien. Tu peux laisser les détails encore inconnus vides.</div>\n    <input type=\"text\" class=\"wh-store\" name=\"rps\" value=\"[]\" tabindex=\"-1\" aria-hidden=\"true\" readonly />\n    <div data-wh-chrono-list></div>\n    <div><button type=\"button\" class=\"addField\" data-wh-chrono-add><i class=\"ph-light ph-plus\" aria-hidden=\"true\"></i>Ajouter un RP</button></div>\n    <p class=\"description wh-chrono__status\" data-wh-chrono-status role=\"status\" aria-live=\"polite\"></p>\n  </fieldset>\n\n  <template data-wh-rp-template>\n    <div class=\"wh-chrono__entry\" data-wh-rp>\n      <div class=\"wh-chrono__name-row\">\n        <div class=\"field\">\n          <label for=\"wh-rp-__id__-titre\">Titre du RP</label>\n          <input type=\"text\" id=\"wh-rp-__id__-titre\" data-wh-rp-field=\"titre\" />\n        </div>\n        <button type=\"button\" class=\"wh-chrono__remove\" data-wh-rp-remove aria-label=\"Supprimer ce RP\"><i class=\"ph-light ph-trash\" aria-hidden=\"true\"></i></button>\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-rp-__id__-url\">Adresse du sujet</label>\n        <div class=\"description\">Facultatif. Le titre sera cliquable si une adresse est renseignée.</div>\n        <input type=\"text\" id=\"wh-rp-__id__-url\" data-wh-rp-field=\"url\" />\n      </div>\n      <div class=\"field columns three\">\n        <div class=\"field\">\n          <label for=\"wh-rp-__id__-lune\">Lune</label>\n          <div class=\"wh-number\">\n            <input type=\"number\" id=\"wh-rp-__id__-lune\" data-wh-rp-field=\"lune\" min=\"1\" step=\"1\" />\n          </div>\n        </div>\n        <div class=\"field\">\n          <label for=\"wh-rp-__id__-moment\">Moment dans la lune</label>\n          <div class=\"wh-select\"><select id=\"wh-rp-__id__-moment\" data-wh-rp-field=\"moment\">\n            <option value=\"\">À préciser</option>\n            <option value=\"debut\">Début de lune</option>\n            <option value=\"milieu\">Mi-lune</option>\n            <option value=\"pleine\">Pleine lune</option>\n            <option value=\"fin\">Fin de lune</option>\n          </select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n        </div>\n        <div class=\"field\">\n          <label for=\"wh-rp-__id__-etat\">État du RP</label>\n          <div class=\"wh-select\"><select id=\"wh-rp-__id__-etat\" data-wh-rp-field=\"etat\">\n            <option value=\"en-cours\">En cours</option>\n            <option value=\"termine\">Terminé</option>\n            <option value=\"abandonne\">Abandonné</option>\n          </select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n        </div>\n      </div>\n      <div class=\"field columns\">\n        <div class=\"field\">\n          <label for=\"wh-rp-__id__-lieu\">Lieu</label>\n          <input type=\"text\" id=\"wh-rp-__id__-lieu\" data-wh-rp-field=\"lieu\" />\n        </div>\n        <div class=\"field\">\n          <label for=\"wh-rp-__id__-participants\">Participants</label>\n          <input type=\"text\" id=\"wh-rp-__id__-participants\" data-wh-rp-field=\"participants\" />\n        </div>\n      </div>\n    </div>\n  </template>\n</div>";

// PERSONA DE CHRONOLOGIE WILDHEART
// Forumactif : JavaScript sur toutes les pages, après le plugin Persona de Kim.
// Indépendant des autres Persona ; styles : persona.css et lgdc-forum.css.
const WH_CHRONO_CLANS = {
  crepuscule: { g1: "#8e7f9a", g2: "#b59ab8" },
  hetre: { g1: "#b07a4f", g2: "#c99566" },
  orchidee: { g1: "#c2a24f", g2: "#d1b46a" },
  brouillard: { g1: "#8a99a4", g2: "#7fa39a" },
};
const WH_CHRONO_MOMENTS = {
  debut: { nom: "début de lune", ordre: 0 },
  milieu: { nom: "mi-lune", ordre: 1 },
  pleine: { nom: "pleine lune", ordre: 1 },
  fin: { nom: "fin de lune", ordre: 2 },
};
const WH_CHRONO_ETATS = { "en-cours": "En cours", termine: "Terminé", abandonne: "Abandonné" };

function whChronoTexte(value) {
  return String(value ?? "").trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function whChronoUrl(value) {
  const source = String(value ?? "").trim();
  if (!source) return "";
  try { return ["http:", "https:"].includes(new URL(source, "https://wildheart.invalid/").protocol) ? source : ""; }
  catch { return ""; }
}
function whLireChronologie(value) {
  let rows;
  try { rows = Array.isArray(value) ? value : JSON.parse(value || "[]"); }
  catch { return []; }
  if (!Array.isArray(rows)) return [];
  return rows.filter((row) => row && typeof row === "object" && !Array.isArray(row)).map((row) => {
    const result = {};
    ["titre", "url", "lieu", "participants"].forEach((key) => { result[key] = String(row[key] ?? "").trim(); });
    const lune = String(row.lune ?? "").trim();
    result.lune = /^\d+$/.test(lune) && Number.isSafeInteger(Number(lune)) && Number(lune) >= 1 ? String(Number(lune)) : "";
    result.moment = Object.hasOwn(WH_CHRONO_MOMENTS, row.moment) ? row.moment : "";
    result.etat = Object.hasOwn(WH_CHRONO_ETATS, row.etat) ? row.etat : "en-cours";
    return result;
  });
}

function whChronologie(data = {}) {
  const clan = Object.hasOwn(WH_CHRONO_CLANS, data.clan) ? WH_CHRONO_CLANS[data.clan] : WH_CHRONO_CLANS.crepuscule;
  const nom = String(data.nom ?? "").trim() || "mon personnage";
  const titre = `La chronologie ${/^[aeiouyàâäéèêëîïôöùûüœæh]/i.test(nom) ? "d’" : "de "}${whChronoTexte(nom)}`;
  const rows = whLireChronologie(data.rps).filter((row) => row.titre);
  rows.sort((a, b) => Number(b.lune) - Number(a.lune)
    || (WH_CHRONO_MOMENTS[b.moment]?.ordre ?? -1) - (WH_CHRONO_MOMENTS[a.moment]?.ordre ?? -1));
  const lunes = [...new Set(rows.map((row) => row.lune))];
  const sections = lunes.map((lune) => {
    const rps = rows.filter((row) => row.lune === lune).map((row) => {
      const url = whChronoUrl(row.url), titre = whChronoTexte(row.titre);
      const infos = [row.lieu, row.participants ? `avec ${row.participants}` : ""].filter(Boolean).map(whChronoTexte).join(", ");
      const moment = WH_CHRONO_MOMENTS[row.moment]?.nom || "à préciser";
      const etat = WH_CHRONO_ETATS[row.etat];
      return `<div class="lgdc-app__rp${row.etat === "termine" ? " is-done" : row.etat === "abandonne" ? " is-abandoned" : ""}">
  <span class="lgdc-app__when">${moment}</span>
  <div>${url ? `<a href="${whChronoTexte(url)}" class="lgdc-app__rp-t">${titre}</a>` : `<span class="lgdc-app__rp-t">${titre}</span>`}${infos ? `<p class="lgdc-app__rp-m">${infos}</p>` : ""}</div>
  <p class="lgdc-app__state">${etat}</p>
</div>`;
    }).join("\n");
    return `<div class="lgdc-app__title"><h3>${lune ? `Lune ${lune}` : "Lune à préciser"}</h3></div><div class="lgdc-app__rps">${rps}</div>`;
  }).join("\n");
  const termines = rows.filter((row) => row.etat === "termine").length;
  const bilan = rows.length ? `${rows.length} RP, dont ${termines} terminé${termines > 1 ? "s" : ""}.` : "Aucun RP pour le moment.";
  return `<div class="lgdc-app lgdc-app--list" style="--g1:${clan.g1};--g2:${clan.g2}">
  <header class="lgdc-app__top"><div><h2 class="lgdc-app__name">${titre}</h2><p class="lgdc-app__quote">${bilan}</p></div></header>
  ${sections || '<div class="lgdc-app__title"><h3>Les aventures à venir</h3></div><div class="lgdc-app__bio"><div class="lgdc-app__story"><p>La première rencontre reste à écrire.</p></div></div>'}
</div>`;
}

function whChronologieForm(form) {
  if (form.dataset.whChronoReady) return;
  form.dataset.whChronoReady = "true";
  const store = form.querySelector('[name="rps"]');
  const list = form.querySelector("[data-wh-chrono-list]");
  const template = form.querySelector("[data-wh-rp-template]");
  const add = form.querySelector("[data-wh-chrono-add]");
  const status = form.querySelector("[data-wh-chrono-status]");
  let serial = store.value, nextId = 0;
  function append(data = {}) {
    const copy = document.createElement("template");
    copy.innerHTML = template.innerHTML.replaceAll("__id__", String(nextId++));
    const row = copy.content.firstElementChild;
    row.querySelectorAll("[data-wh-rp-field]").forEach((input) => {
      const key = input.dataset.whRpField;
      input.value = data[key] ?? (key === "lune" ? "1" : key === "etat" ? "en-cours" : "");
    });
    list.append(row);
    return row;
  }
  function restore() {
    list.replaceChildren();
    const rows = whLireChronologie(store.value);
    (rows.length ? rows : [{}]).forEach(append);
    serial = store.value;
  }
  function refresh() { if (store.value !== serial) restore(); }
  function commit() {
    const rows = [...list.querySelectorAll("[data-wh-rp]")].map((row) => Object.fromEntries(
      [...row.querySelectorAll("[data-wh-rp-field]")].map((input) => [input.dataset.whRpField, input.value])
    ));
    serial = JSON.stringify(rows);
    if (store.value === serial) return;
    store.value = serial;
    store.dispatchEvent(new Event("input", { bubbles: true }));
  }
  function edit(event) {
    if (event.target === store) refresh();
    else if (event.target.matches("[data-wh-rp-field]")) {
      commit();
    }
  }
  form.addEventListener("input", edit);
  form.addEventListener("change", edit);
  add.addEventListener("click", () => {
    const row = append();
    commit();
    row.querySelector('[data-wh-rp-field="titre"]').focus();
    status.textContent = "RP ajouté.";
  });
  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-wh-rp-remove]");
    if (!button) return;
    const row = button.closest("[data-wh-rp]");
    const titre = row.querySelector('[data-wh-rp-field="titre"]').value.trim();
    const next = row.nextElementSibling || row.previousElementSibling;
    row.remove();
    commit();
    (next ? next.querySelector('[data-wh-rp-field="titre"]') : add).focus();
    status.textContent = titre ? `RP « ${titre} » supprimé.` : "RP supprimé.";
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
      personaPageTitle: function (action) { return action + ' sa chronologie'; },
      personaHTML: whChronologie
    });
    var form = document.querySelector('.personaForm[data-persona-name="' + NAME + '"]');
    if (form) whChronologieForm(form);
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
