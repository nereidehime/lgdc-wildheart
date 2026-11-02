/* Fiche de présentation : formulaire Persona (plugin de Kim, Blank Theme) et mise en page.
   Généré par outils/construire-personas.py depuis header/persona : ne pas modifier ici.
   Nouveau sujet dans le forum 7, ou modification d'un message « fiche » : le formulaire est inséré
   au-dessus de l'éditeur, puis le plugin le relie au message. Dans le sujet, le plugin affiche la mise en page. */
(function () {
  'use strict';
  var FORUM = 7;
  var NAME = "fiche";
  var PLUGIN = "https://cdn.jsdelivr.net/gh/gp-kim/Blank-Theme@main/Persona/persona.js";
  var FORM = "<div class=\"personaForm\" data-persona-name=\"fiche\">\n\n  <fieldset>\n    <legend>Identité</legend>\n    <div class=\"field\">\n      <label for=\"wh-nom\">Nom du chat</label>\n      <input type=\"text\" id=\"wh-nom\" name=\"nom\" />\n    </div>\n    <div class=\"field\">\n      <label for=\"wh-citation\">Citation</label>\n      <div class=\"description\">Facultatif. Une phrase du chat, ou une phrase sur lui.</div>\n      <textarea id=\"wh-citation\" name=\"citation\"></textarea>\n    </div>\n    <div class=\"field columns\">\n      <div class=\"field\">\n        <label for=\"wh-age\">Âge, en lunes</label>\n        <div class=\"wh-number\">\n          <input type=\"number\" id=\"wh-age\" name=\"age\" min=\"0\" max=\"240\" step=\"1\" />\n        </div>\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-genre\">Genre</label>\n        <div class=\"wh-select\"><select id=\"wh-genre\" name=\"genre\">\n          <option value=\"\">Choisir</option>\n          <option>Femelle</option>\n          <option>Mâle</option>\n        </select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n      </div>\n    </div>\n    <div class=\"field columns\">\n      <div class=\"field\">\n        <label for=\"wh-clan\">Clan</label>\n        <div class=\"wh-select\"><select id=\"wh-clan\" name=\"clan\">\n          <option value=\"crepuscule\">Clan du Crépuscule</option>\n          <option value=\"hetre\">Clan du Hêtre</option>\n          <option value=\"orchidee\">Clan de l’Orchidée</option>\n          <option value=\"brouillard\">Clan du Brouillard</option>\n        </select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-rang\">Rang</label>\n        <div class=\"description\" data-wh-hint=\"rang\"></div>\n        <div class=\"wh-select\"><select id=\"wh-rang\" name=\"rang\">\n          <option data-age=\"0-5\">Chaton</option>\n          <option data-age=\"6-18\">Apprenti</option>\n          <option data-age=\"6-24\">Apprenti guérisseur</option>\n          <option data-age=\"12-\" selected>Guerrier</option>\n          <option data-age=\"12-\" data-genre=\"Femelle\">Reine</option>\n          <option data-age=\"12-\">Guérisseur</option>\n          <option data-age=\"24-\">Lieutenant</option>\n          <option data-age=\"30-\">Chef</option>\n          <option data-age=\"12-\">Ancien</option>\n        </select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n      </div>\n    </div>\n    <div class=\"field columns\">\n      <div class=\"field\" data-wh-rangs=\"Apprenti,Apprenti guérisseur,Guerrier,Reine,Guérisseur,Lieutenant,Chef,Ancien\">\n        <label for=\"wh-mentor\">Mentor</label>\n        <input type=\"text\" id=\"wh-mentor\" name=\"mentor\" />\n      </div>\n      <div class=\"field\" data-wh-rangs=\"Guerrier,Guérisseur,Lieutenant,Chef\">\n        <label for=\"wh-apprenti\">Apprenti</label>\n        <input type=\"text\" id=\"wh-apprenti\" name=\"apprenti\" />\n      </div>\n    </div>\n    <div class=\"field\">\n      <label for=\"wh-naissance\">Naissance</label>\n      <input type=\"text\" id=\"wh-naissance\" name=\"naissance\" />\n    </div>\n  </fieldset>\n\n  <fieldset>\n    <legend>Avatar</legend>\n    <div class=\"field image\">\n      <div>\n        <div class=\"field\">\n          <label for=\"wh-url\">Adresse de l’avatar</label>\n          <div class=\"description\">Image carrée, 250 × 250 pixels au minimum.</div>\n          <input type=\"text\" id=\"wh-url\" name=\"urlAvatar\" />\n        </div>\n        <div class=\"field\">\n          <label for=\"wh-credit\">Crédit</label>\n          <div class=\"description\">Le nom de l’artiste pour un dessin. Rien pour une photo.</div>\n          <input type=\"text\" id=\"wh-credit\" name=\"creditAvatar\" />\n        </div>\n      </div>\n      <div class=\"image-preview avatar\" data-preview=\"urlAvatar\"></div>\n    </div>\n  </fieldset>\n\n  <fieldset>\n    <legend>Apparence</legend>\n    <div class=\"field columns\">\n      <div class=\"field\">\n        <label for=\"wh-pelage\">Pelage</label>\n        <input type=\"text\" id=\"wh-pelage\" name=\"pelage\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-yeux\">Yeux</label>\n        <input type=\"text\" id=\"wh-yeux\" name=\"yeux\" />\n      </div>\n    </div>\n    <div class=\"field columns\">\n      <div class=\"field\">\n        <label for=\"wh-taille\">Taille</label>\n        <input type=\"text\" id=\"wh-taille\" name=\"taille\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-signe\">Signe distinctif</label>\n        <input type=\"text\" id=\"wh-signe\" name=\"signe\" />\n      </div>\n    </div>\n    <div class=\"field\">\n      <label for=\"wh-regard\">Au premier regard</label>\n      <textarea id=\"wh-regard\" name=\"regard\"></textarea>\n    </div>\n  </fieldset>\n\n  <fieldset>\n    <legend>Caractère</legend>\n    <div class=\"field columns\">\n      <div class=\"field\">\n        <label for=\"wh-qualites\">Qualités</label>\n        <textarea id=\"wh-qualites\" name=\"qualites\"></textarea>\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-defauts\">Défauts</label>\n        <textarea id=\"wh-defauts\" name=\"defauts\"></textarea>\n      </div>\n    </div>\n    <div class=\"field columns\">\n      <div class=\"field\">\n        <label for=\"wh-aime\">Aime</label>\n        <textarea id=\"wh-aime\" name=\"aime\"></textarea>\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-craint\">Craint</label>\n        <textarea id=\"wh-craint\" name=\"craint\"></textarea>\n      </div>\n    </div>\n  </fieldset>\n\n  <fieldset>\n    <legend>Famille</legend>\n    <div class=\"description legend-help\">Un nom par ligne, avec une précision entre parenthèses si besoin : « Pas de Lièvre (mort apprenti) ». Laisser vide ce qui ne s’applique pas.</div>\n    <div class=\"field columns\">\n      <div class=\"field\">\n        <label for=\"wh-mere\">Mère</label>\n        <input type=\"text\" id=\"wh-mere\" name=\"mere\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-pere\">Père</label>\n        <input type=\"text\" id=\"wh-pere\" name=\"pere\" />\n      </div>\n    </div>\n    <div class=\"field\">\n      <label for=\"wh-fratrie\">Frères et sœurs</label>\n      <textarea id=\"wh-fratrie\" name=\"fratrie\"></textarea>\n    </div>\n    <div class=\"field columns\" data-wh-rangs=\"Guerrier,Reine,Guérisseur,Lieutenant,Chef,Ancien\">\n      <div class=\"field\">\n        <label for=\"wh-compagnon\">Compagnon ou compagne</label>\n        <input type=\"text\" id=\"wh-compagnon\" name=\"compagnon\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-petits\">Petits</label>\n        <textarea id=\"wh-petits\" name=\"petits\"></textarea>\n      </div>\n    </div>\n  </fieldset>\n\n  <fieldset>\n    <legend>Système</legend>\n    <div class=\"description legend-help\" data-wh-hint=\"des\">La répartition des dés dépend du rang : voir le chapitre <a href=\"/h1-guidebook#sys-personnage\" target=\"_blank\" rel=\"noopener\">Le système</a> du guidebook. Les points de vie, l’esquive et la capacité de Clan se calculent tout seuls.</div>\n    <div class=\"field columns four\">\n      <div class=\"field\">\n        <label for=\"wh-dex\">Dextérité</label>\n        <div class=\"wh-select\"><select id=\"wh-dex\" name=\"dexterite\"><option>d6</option><option selected>d8</option><option>d10</option><option>d12</option></select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-int\">Intelligence</label>\n        <div class=\"wh-select\"><select id=\"wh-int\" name=\"intelligence\"><option>d6</option><option selected>d8</option><option>d10</option><option>d12</option></select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-pui\">Puissance</label>\n        <div class=\"wh-select\"><select id=\"wh-pui\" name=\"puissance\"><option>d6</option><option selected>d8</option><option>d10</option><option>d12</option></select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-vol\">Volonté</label>\n        <div class=\"wh-select\"><select id=\"wh-vol\" name=\"volonte\"><option>d6</option><option selected>d8</option><option>d10</option><option>d12</option></select><i class=\"ph-light ph-caret-down\" aria-hidden=\"true\"></i></div>\n      </div>\n    </div>\n    <p class=\"wh-check\" data-wh-hint=\"check\" role=\"status\" aria-live=\"polite\"></p>\n    <div class=\"field\" data-wh-rangs=\"Apprenti,Apprenti guérisseur,Guerrier,Reine,Guérisseur,Lieutenant,Chef,Ancien\">\n      <label for=\"wh-astuces-q\">Astuces</label>\n      <div class=\"description\" data-wh-hint=\"astuces\"></div>\n      <!-- champ lu par le plugin, rempli par les cases cochées -->\n      <input type=\"text\" class=\"wh-store\" name=\"astuces\" tabindex=\"-1\" aria-hidden=\"true\" readonly />\n      <input type=\"search\" class=\"wh-search\" id=\"wh-astuces-q\" data-wh-search=\"astuces\" autocomplete=\"off\" />\n      <div class=\"wh-picks\" data-wh-astuces></div>\n    </div>\n    <div class=\"field\" data-wh-rangs=\"Apprenti,Apprenti guérisseur,Guerrier,Reine,Guérisseur,Lieutenant,Chef,Ancien\">\n      <label for=\"wh-bonus-q\">Bonus de gestes</label>\n      <div class=\"description\" data-wh-hint=\"bonus\"></div>\n      <input type=\"text\" class=\"wh-store\" name=\"bonus\" tabindex=\"-1\" aria-hidden=\"true\" readonly />\n      <input type=\"search\" class=\"wh-search\" id=\"wh-bonus-q\" data-wh-search=\"bonus\" autocomplete=\"off\" />\n      <div class=\"wh-picks\" data-wh-bonus></div>\n    </div>\n  </fieldset>\n\n  <fieldset>\n    <legend>Histoire</legend>\n    <div class=\"field\">\n      <label for=\"wh-tw\">Avertissement</label>\n      <div class=\"description\">Facultatif. Les thèmes difficiles abordés, séparés par des virgules.</div>\n      <input type=\"text\" id=\"wh-tw\" name=\"avertissement\" />\n    </div>\n    <div class=\"field\">\n      <label for=\"wh-histoire\">Histoire</label>\n      <div class=\"description\">Laisse une ligne vide entre deux paragraphes.</div>\n      <textarea id=\"wh-histoire\" name=\"histoire\" rows=\"8\"></textarea>\n    </div>\n    <div class=\"field\">\n      <label for=\"wh-souvenir\">Un souvenir marquant</label>\n      <textarea id=\"wh-souvenir\" name=\"souvenir\"></textarea>\n    </div>\n  </fieldset>\n\n  <fieldset>\n    <legend>Derrière l’écran</legend>\n    <div class=\"field columns\">\n      <div class=\"field\">\n        <label for=\"wh-pseudo\">Pseudo</label>\n        <input type=\"text\" id=\"wh-pseudo\" name=\"pseudo\" />\n      </div>\n      <div class=\"field\">\n        <label for=\"wh-connu\">Comment as-tu connu le forum ?</label>\n        <input type=\"text\" id=\"wh-connu\" name=\"connu\" />\n      </div>\n    </div>\n  </fieldset>\n\n</div>";

// PERSONA DE LA FICHE DE PRÉSENTATION WILDHEART
// Forumactif : Modules > HTML & JavaScript > Gestion des codes JavaScript, cocher « Sur toutes les pages ».
// Nécessite persona.js (Kim, Blank Theme) chargé dans overall_footer_end.
// La mise en page produite est celle de la fiche .lgdc-app (styles dans lgdc-forum.css).

const WH_CLANS = {
  crepuscule: { nom: "Clan du Crépuscule", g1: "#8e7f9a", g2: "#b59ab8", geste: "Guetter" },
  hetre: { nom: "Clan du Hêtre", g1: "#b07a4f", g2: "#c99566", geste: "Grimper" },
  orchidee: { nom: "Clan de l’Orchidée", g1: "#c2a24f", g2: "#d1b46a", geste: "Bondir" },
  brouillard: { nom: "Clan du Brouillard", g1: "#8a99a4", g2: "#7fa39a", geste: "Se faufiler" },
};

// échappe le texte saisi : les membres écrivent du texte, pas du HTML
function whText(v, vide = "à compléter") {
  const s = String(v ?? "").trim();
  if (!s) return vide;
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// paragraphes : une ligne vide sépare deux paragraphes
function whParas(v) {
  const s = String(v ?? "").trim();
  if (!s) return "<p>à compléter</p>";
  return s.split(/\n\s*\n/).map((p) => `<p>${whText(p).replace(/\n/g, "<br>")}</p>`).join("");
}

function whFiche(data) {
  const clan = WH_CLANS[data.clan] || WH_CLANS.crepuscule;
  const de = (k) => (["d6", "d8", "d10", "d12"].includes(data[k]) ? data[k] : "d8");
  const taille = (d) => parseInt(d.slice(1), 10);
  const rang = data.rang || "Guerrier";
  const bonusPV = rang === "Chaton" ? 5 : rang.startsWith("Apprenti") ? 10 : 15;
  const pv = taille(de("puissance")) + bonusPV + (/(^|, )Inébranlable(,|$)/.test(String(data.astuces ?? "")) ? 5 : 0);
  const esquive = taille(de("dexterite")) + 2;
  const vies = rang === "Chef" ? ", 9 vies" : "";
  const barre = (nom, k) => {
    const d = de(k);
    return `<div class="lgdc-app__bar">${nom}<span style="--v:${(taille(d) - 4) * 12.5}%">${d}</span><b class="lgdc-die">${d}</b></div>`;
  };
  const tw = String(data.avertissement ?? "").trim();
  // famille : seulement les liens renseignés, un nom par ligne
  const liste = (v) => String(v ?? "").split(/\n+/).map((s) => s.trim()).filter(Boolean).map((s) => whText(s)).join("<br>");
  const fam = [["Mère", data.mere], ["Père", data.pere], ["Frères et sœurs", data.fratrie], ["Compagnon ou compagne", data.compagnon], ["Petits", data.petits]]
    .filter(([, v]) => String(v ?? "").trim());
  const famille = fam.length
    ? `<div class="lgdc-app__title"><h3>Famille</h3></div>
  <dl class="lgdc-app__see lgdc-app__fam">${fam.map(([k, v]) => `<div><dt>${k}</dt><dd>${liste(v)}</dd></div>`).join("")}</dl>`
    : "";
  // astuces : infobulle Truesight avec l'effet de chacune
  const astuces = String(data.astuces ?? "").split(",").map((s) => s.trim()).filter(Boolean).map((n) => {
    const a = (typeof WH_ASTUCES !== "undefined" ? WH_ASTUCES : []).find(([nom]) => nom === n.replace(/ \(niv\. \d\)$/, ""));
    return a ? `<b class="lgdc-tip" data-tooltip-head="${whText(n)}" title="${whText(a[3])}">${whText(n)}</b>` : whText(n);
  }).join(", ");

  return `
<div class="lgdc-app" style="--g1:${clan.g1};--g2:${clan.g2}">
  <header class="lgdc-app__top"><div><h2 class="lgdc-app__name">${whText(data.nom, "Nom du chat")}</h2>${data.citation ? `<p class="lgdc-app__quote">${whText(data.citation)}</p>` : ""}</div></header>
  <dl class="lgdc-app__basics">
    <div><dt>Rang</dt><dd>${whText(rang)}</dd></div>
    <div><dt>Clan</dt><dd>${clan.nom.replace(/^Clan (du |de l’)/, "")}</dd></div>
    <div><dt>Âge</dt><dd>${/^\d+$/.test(String(data.age ?? "").trim()) ? `${parseInt(data.age, 10)} lunes` : whText(data.age)}</dd></div>
    <div><dt>Genre</dt><dd>${whText(data.genre)}</dd></div>
    <div><dt>Mentor</dt><dd>${whText(data.mentor, "—")}</dd></div>
    <div><dt>Apprenti</dt><dd>${whText(data.apprenti, "aucun")}</dd></div>
    <div><dt>Naissance</dt><dd>${whText(data.naissance)}</dd></div>
    <div><dt>Avatar</dt><dd>${whText(data.creditAvatar)}</dd></div>
  </dl>
  <div class="lgdc-app__title"><h3>Apparence</h3></div>
  <div class="lgdc-app__look">
    <div class="lgdc-app__portrait"><img src="${whText(data.urlAvatar, "")}" alt=""></div>
    <dl class="lgdc-app__see">
      <div><dt>Pelage</dt><dd>${whText(data.pelage)}</dd></div>
      <div><dt>Yeux</dt><dd>${whText(data.yeux)}</dd></div>
      <div><dt>Taille</dt><dd>${whText(data.taille)}</dd></div>
      <div><dt>Signe distinctif</dt><dd>${whText(data.signe)}</dd></div>
      <div class="is-wide"><dt>Au premier regard</dt><dd>${whText(data.regard)}</dd></div>
    </dl>
  </div>
  <div class="lgdc-app__title"><h3>Caractère</h3></div>
  <div class="lgdc-app__pers">
    <div class="lgdc-app__trait"><p class="lgdc-app__trait-k">Qualités</p><p>${whText(data.qualites)}</p></div>
    <div class="lgdc-app__trait"><p class="lgdc-app__trait-k">Défauts</p><p>${whText(data.defauts)}</p></div>
    <div class="lgdc-app__trait"><p class="lgdc-app__trait-k">Aime</p><p>${whText(data.aime)}</p></div>
    <div class="lgdc-app__trait"><p class="lgdc-app__trait-k">Craint</p><p>${whText(data.craint)}</p></div>
  </div>
${famille}
  <div class="lgdc-app__title"><h3>Système</h3><span>voir le guidebook</span></div>
  <div class="lgdc-app__sys">
    <div class="lgdc-app__bars">${barre("Dextérité", "dexterite")}${barre("Intelligence", "intelligence")}${barre("Puissance", "puissance")}${barre("Volonté", "volonte")}</div>
    <div class="lgdc-app__gift"><p class="lgdc-app__gift-k">Résistance</p><p>${pv} points de vie, esquive ${esquive}${vies}</p></div>
    <div class="lgdc-app__gift"><p class="lgdc-app__gift-k">Les astuces</p><p>${astuces || "aucune"}</p><p>+1 en ${clan.geste} (Clan)${data.bonus ? `, ${whText(data.bonus)}` : ""}</p></div>
  </div>
  <div class="lgdc-app__title"><h3>Histoire</h3></div>
  <div class="lgdc-app__bio">
    ${tw ? `<tw>${whText(tw)}</tw>` : ""}
    <div class="lgdc-app__story">${whParas(data.histoire)}</div>
    <div class="lgdc-app__memory"><p class="lgdc-app__memory-k">Un souvenir marquant</p>${whParas(data.souvenir)}</div>
  </div>
  <footer class="lgdc-app__player"><span><em>Joueur</em>${whText(data.pseudo)}</span><span><em>Connu par</em>${whText(data.connu)}</span></footer>
</div>`;
}


// =========================================================================
// RÈGLES DU FORMULAIRE : rangs selon l'âge, champs selon le rang, dés vérifiés,
// astuces et bonus de gestes choisis dans des listes cherchables.
// =========================================================================
// nom, arbre, rang, effet, astuces requises avant, niveaux possibles, toutes requises (sinon une seule)
const WH_ASTUCES = [
  ["Coup puissant", "Griffe", 1, "+4 dégâts par niveau sur un coup.", [], 2, false],
  ["Plaquage", "Griffe", 1, "Un coup qui touche ralentit aussi la cible.", [], 1, false],
  ["Riposte", "Griffe", 1, "Quand une attaque le rate, son coup suivant touche sans test.", [], 1, false],
  ["Griffes au ventre", "Griffe", 2, "Toujours : +3 dégâts contre une cible ralentie ou en crise.", ["Coup puissant", "Plaquage"], 1, false],
  ["Rage du sang", "Griffe", 2, "Toujours : en crise, +2 pour Frapper, Bondir et Mordre.", ["Plaquage", "Riposte"], 1, false],
  ["Furie", "Griffe", 3, "Deux attaques dans le même tour.", ["Griffes au ventre", "Rage du sang"], 1, true],
  ["Bond mortel", "Chasse", 1, "+1 point par niveau sur une chasse réussie.", [], 2, false],
  ["Pistage", "Chasse", 1, "Toujours : +2 pour Pister ou Réfléchir.", [], 1, false],
  ["Flair", "Chasse", 1, "Si la chasse échoue à l’étape Guetter, relancer la chasse.", [], 1, false],
  ["Partage du gibier", "Chasse", 2, "Une chasse réussie retire l’altération affaibli à tous les camarades du RP.", ["Bond mortel", "Pistage"], 1, false],
  ["Patte légère", "Chasse", 2, "Si la chasse échoue à l’étape Se faufiler ou Bondir, relancer la chasse.", ["Pistage", "Flair"], 1, false],
  ["Traque", "Chasse", 3, "Toujours : ses chasses réussies rapportent le double de points.", ["Partage du gibier", "Patte légère"], 1, true],
  ["Effacer son odeur", "Ombre", 1, "Toujours : −2 pour qui le piste.", [], 1, false],
  ["Feinte", "Ombre", 1, "Le coup touche sans test.", [], 1, false],
  ["Tromperie", "Ombre", 1, "+2 par niveau pour Convaincre en mentant ou en dupant.", [], 2, false],
  ["Embuscade", "Ombre", 2, "Le premier coup d’un combat touche sans test et fait +5 dégâts.", ["Effacer son odeur", "Feinte"], 1, false],
  ["Démasquer", "Ombre", 2, "Après un test de Réfléchir réussi, le joueur de la cible lui confie ce que son personnage cherche vraiment.", ["Feinte", "Tromperie"], 1, false],
  ["Ombre parmi les ombres", "Ombre", 3, "Fuir sans test et sans laisser de trace : personne ne peut le pister jusqu’à la fin du sujet.", ["Embuscade", "Démasquer"], 1, true],
  ["Vigilance", "Cœur", 1, "Toujours : +1 par niveau pour Guetter.", [], 2, false],
  ["Rempart", "Cœur", 1, "Prendre les dégâts d’un camarade.", [], 1, false],
  ["Feulement", "Cœur", 1, "La cible est effrayée.", [], 1, false],
  ["Inébranlable", "Cœur", 2, "Toujours : +5 points de vie, et jamais effrayé.", ["Vigilance", "Rempart"], 1, false],
  ["Parole d’Assemblée", "Cœur", 2, "Toujours : +2 pour Convaincre ou Feuler face à un autre Clan.", ["Rempart", "Feulement"], 1, false],
  ["Ralliement", "Cœur", 3, "Chaque camarade présent relance un test raté, puis gagne +2 à son prochain test.", ["Inébranlable", "Parole d’Assemblée"], 1, true],
  ["Connaissance des plantes", "Herbe", 1, "Toujours : +1 par niveau pour Soigner.", [], 2, false],
  ["Apaiser", "Herbe", 1, "Retire une altération d’Intelligence ou de Volonté : désorienté, effrayé ou enragé.", [], 1, false],
  ["Lire les signes", "Herbe", 1, "Après un test de Réfléchir réussi (difficulté 10), interpréter un rêve ou un présage.", [], 1, false],
  ["Main sûre", "Herbe", 2, "Un soin rend tous les points de vie et retire toutes les altérations.", ["Connaissance des plantes", "Apaiser"], 1, false],
  ["Messager des Étoiles", "Herbe", 2, "Une fois par lune, demander au staff un vrai présage du Clan des Étoiles pour l’intrigue.", ["Apaiser", "Lire les signes"], 1, false],
  ["Souffle des Étoiles", "Herbe", 3, "Un camarade qui tombe à 0 point de vie reste à 1 point de vie et peut agir.", ["Main sûre", "Messager des Étoiles"], 1, true],
];
const WH_GESTES = [
  ["Guetter", "Intelligence + Volonté", "voir, écouter, flairer"],
  ["Pister", "Intelligence + Intelligence", "suivre une piste"],
  ["Réfléchir", "Intelligence + Intelligence", "comprendre, se souvenir"],
  ["Se faufiler", "Dextérité + Volonté", "approcher sans être vu"],
  ["Bondir", "Dextérité + Intelligence", "assaut, attraper une proie"],
  ["Frapper", "Puissance + Puissance", "coup de patte"],
  ["Mordre", "Puissance + Dextérité", "morsure, tuer une proie"],
  ["Grimper", "Dextérité + Puissance", "arbres, rochers"],
  ["Nager", "Puissance + Volonté", "marais, ruisseaux"],
  ["Feuler", "Volonté + Puissance", "feuler, gonfler le dos"],
  ["Soigner", "Intelligence + Volonté", "plantes, blessures"],
  ["Convaincre", "Volonté + Intelligence", "négocier, mener"],
  ["Tenir bon", "Volonté + Volonté", "peur, douleur"],
];
const WH_ATTRS = ["dexterite", "intelligence", "puissance", "volonte"];
const WH_GUERRIER = [[8, 8, 8, 8], [10, 8, 8, 6], [10, 10, 6, 6]];
// répartitions de départ et plafonds, dans l'ordre Dextérité, Intelligence, Puissance, Volonté
const WH_RANGS = {
  Chaton: { bases: [[6, 6, 6, 6]], max: [8, 8, 8, 8], astuces: 0 },
  Apprenti: { bases: [[8, 8, 8, 6], [10, 8, 6, 6]], max: [10, 10, 10, 10], astuces: 1 },
  "Apprenti guérisseur": { bases: [[8, 8, 8, 6], [10, 8, 6, 6]], max: [10, 10, 10, 10], astuces: 1 },
  Guerrier: { bases: WH_GUERRIER, max: [12, 12, 12, 12], astuces: 3 },
  Reine: { bases: WH_GUERRIER, max: [12, 12, 12, 12], astuces: 3 },
  "Guérisseur": { bases: WH_GUERRIER, max: [12, 12, 12, 12], astuces: 3 },
  Lieutenant: { bases: WH_GUERRIER, max: [12, 12, 12, 12], astuces: 3 },
  Chef: { bases: WH_GUERRIER, max: [12, 12, 12, 12], astuces: 3 },
  Ancien: { bases: "ancien", max: [8, 12, 8, 12], astuces: 3 },
};

// toutes les façons de placer une répartition sur les quatre attributs
function whPermutations(a) {
  if (a.length < 2) return [a];
  const out = [];
  a.forEach((x, i) => whPermutations(a.slice(0, i).concat(a.slice(i + 1))).forEach((p) => out.push([x].concat(p))));
  return out;
}
function whBases(rang) {
  const r = WH_RANGS[rang] || WH_RANGS.Guerrier;
  if (r.bases !== "ancien") return r.bases.flatMap(whPermutations);
  // ancien : un guerrier dont Dextérité et Puissance perdent une taille, et Intelligence ou Volonté en gagne une
  const out = [];
  WH_GUERRIER.flatMap(whPermutations).forEach((b) => {
    const v = [Math.max(6, b[0] - 2), b[1], Math.max(6, b[2] - 2), b[3]];
    out.push([v[0], Math.min(12, v[1] + 2), v[2], v[3]], [v[0], v[1], v[2], Math.min(12, v[3] + 2)]);
  });
  return out;
}
// nombre minimal d'améliorations pour passer d'une répartition de départ aux dés choisis (Infinity si impossible)
function whDiceCost(rang, des) {
  let best = Infinity;
  whBases(rang).forEach((b) => {
    let cost = 0;
    for (let i = 0; i < 4; i++) {
      if (des[i] < b[i]) return;
      cost += (des[i] - b[i]) / 2;
    }
    best = Math.min(best, cost);
  });
  return best;
}
// améliorations d'un personnage créé plus âgé : une par tranche de 12 lunes au-delà de 12, quatre au plus
function whAmeliorations(age) {
  return age >= 24 ? Math.min(4, Math.floor((age - 12) / 12)) : 0;
}
const whNorm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();


function whFormRules(form) {
  const $ = (n) => form.querySelector(`[name="${n}"]`);
  const hint = (k) => form.querySelector(`[data-wh-hint="${k}"]`);
  const age = $("age"), genre = $("genre"), rang = $("rang");

  // listes cherchables : une ligne par astuce ou par geste, filtrée par la recherche
  const astucesBox = form.querySelector("[data-wh-astuces]");
  astucesBox.innerHTML = WH_ASTUCES.map(([n, arbre, rang, d, req, max], i) => `<label class="wh-pick" for="wh-a-${i}">${max > 1 ? `<select id="wh-a-${i}" data-astuce="${n}"><option value="0">0</option><option value="1">1</option><option value="2">2</option></select>` : `<input type="checkbox" value="${n}" id="wh-a-${i}" data-astuce="${n}">`}<span class="wh-pick__n">${n}${max > 1 ? " ×2" : ""}</span><span class="wh-pick__v">${arbre} ${["", "I", "II", "III"][rang]}</span><span class="wh-pick__d">${d}</span></label>`).join("");
  const bonusBox = form.querySelector("[data-wh-bonus]");
  bonusBox.innerHTML = WH_GESTES.map(([n, de, d], i) => `<div class="wh-pick wh-pick--step"><label class="wh-pick__n" for="wh-b-${i}">${n}</label><span class="wh-pick__v">${de}</span><span class="wh-pick__d">${d}</span><div class="wh-select"><select id="wh-b-${i}" data-geste="${n}"><option value="0">aucun</option><option value="2">+2</option><option value="4">+4</option></select><i class="ph-light ph-caret-down" aria-hidden="true"></i></div></div>`).join("");
  form.querySelectorAll("[data-wh-search]").forEach((q) => {
    const box = form.querySelector(`[data-wh-${q.dataset.whSearch}]`);
    q.addEventListener("input", () => {
      const s = whNorm(q.value.trim());
      box.querySelectorAll(".wh-pick").forEach((row) => { row.hidden = Boolean(s) && !whNorm(row.textContent).includes(s); });
    });
  });
  // reprend les valeurs déjà enregistrées (édition d'une fiche)
  String($("astuces").value).split(",").map((s) => s.trim()).forEach((s) => {
    const m = s.match(/^(.*?)(?: \(niv\. (\d)\))?$/);
    const c = astucesBox.querySelector(`[data-astuce="${m[1]}"]`);
    if (!c) return;
    if (c.tagName === "SELECT") c.value = m[2] || "1";
    else c.checked = true;
  });
  String($("bonus").value).split(",").forEach((s) => {
    const m = s.match(/\+(\d)\s+en\s+(.+)/);
    const sel = m && bonusBox.querySelector(`[data-geste="${m[2].trim()}"]`);
    if (sel) sel.value = String(Math.min(3, +m[1]));
  });

  function update() {
    const a = parseInt(age.value, 10);
    const known = Number.isFinite(a);
    // rangs possibles selon l'âge et le genre
    [...rang.options].forEach((o) => {
      const [min, max] = (o.dataset.age || "0-").split("-");
      const okAge = !known || (a >= +min && (max === "" || a <= +max));
      const okGenre = !o.dataset.genre || !genre.value || genre.value === o.dataset.genre;
      o.disabled = !(okAge && okGenre);
    });
    if (rang.selectedOptions[0] && rang.selectedOptions[0].disabled) {
      // rang par défaut selon l'âge : chaton, puis apprenti jusqu'à 18 lunes, puis guerrier
      const prefere = !known ? "Guerrier" : a < 6 ? "Chaton" : a <= 18 ? "Apprenti" : "Guerrier";
      const opt = [...rang.options].find((o) => !o.disabled && o.value === prefere) || [...rang.options].find((o) => !o.disabled);
      if (opt) rang.value = opt.value;
    }
    const r = rang.value, rules = WH_RANGS[r] || WH_RANGS.Guerrier;
    hint("rang").textContent = known ? "" : "Indique d’abord l’âge : les rangs proposés en dépendent.";

    // champs qui n'ont de sens que pour certains rangs
    form.querySelectorAll("[data-wh-rangs]").forEach((f) => {
      const on = f.dataset.whRangs.split(",").includes(r);
      f.hidden = !on;
      if (!on) f.querySelectorAll("input[name], textarea[name]").forEach((i) => { i.value = ""; });
    });
    if (r === "Chaton") {
      // un chaton n'a ni astuce, ni bonus, et ses quatre dés sont des d6
      astucesBox.querySelectorAll("input").forEach((c) => { c.checked = false; });
      astucesBox.querySelectorAll("select").forEach((c) => { c.value = "0"; });
      bonusBox.querySelectorAll("select").forEach((s) => { s.value = "0"; });
      WH_ATTRS.forEach((k) => { $(k).value = "d6"; });
    }

    // dés : seules les tailles sous le plafond du rang sont proposées
    WH_ATTRS.forEach((k, i) => {
      [...$(k).options].forEach((o) => { o.disabled = parseInt(o.value.slice(1), 10) > rules.max[i]; });
      if ($(k).selectedOptions[0] && $(k).selectedOptions[0].disabled) $(k).value = "d" + rules.max[i];
    });
    const des = WH_ATTRS.map((k) => parseInt($(k).value.slice(1), 10));
    const total = whAmeliorations(known ? a : 0);
    const coutDes = whDiceCost(r, des);
    // astuces choisies et leur niveau
    const niveaux = new Map([...astucesBox.querySelectorAll("[data-astuce]")]
      .map((c) => [c.dataset.astuce, c.tagName === "SELECT" ? Number(c.value) : (c.checked ? 1 : 0)])
      .filter(([, v]) => v > 0));
    const choisies = [...niveaux.keys()];
    const coutAstuces = Math.max(0, [...niveaux.values()].reduce((x, y) => x + y, 0) - rules.astuces);
    const bonus = [...bonusBox.querySelectorAll("select")].filter((s) => s.value !== "0");
    const coutBonus = bonus.reduce((n, s) => n + Number(s.value) / 2, 0);
    const utilisees = (Number.isFinite(coutDes) ? coutDes : 0) + coutAstuces + coutBonus;

    // les champs cachés que lit le plugin
    $("astuces").value = choisies.map((n) => niveaux.get(n) > 1 ? `${n} (niv. ${niveaux.get(n)})` : n).join(", ");
    $("bonus").value = bonus.map((s) => `+${s.value} en ${s.dataset.geste}`).join(", ");

    hint("astuces").textContent = r === "Chaton"
      ? "Un chaton n’a pas encore d’astuce."
      : `Au rang ${r.toLowerCase()}, on commence avec ${rules.astuces} astuce${rules.astuces > 1 ? "s" : ""}. Chaque astuce en plus coûte une amélioration.`;
    hint("bonus").textContent = "Chaque +2 sur un geste coûte une amélioration, jusqu’à +4 par geste.";
    const check = hint("check");
    // dans une voie, chaque rang demande une astuce du rang précédent
    const sansBase = choisies.map((n) => WH_ASTUCES.find((x) => x[0] === n)).find((x) => x && x[4].length && !(x[6] ? x[4].every((r) => niveaux.has(r)) : x[4].some((r) => niveaux.has(r))));
    if (sansBase) {
      check.textContent = `« ${sansBase[0]} » demande d’abord ${sansBase[4].map((r) => `« ${r} »`).join(sansBase[6] ? " et " : " ou ")}, dans la voie ${sansBase[1]}.`;
      check.dataset.state = "error";
    } else if (!Number.isFinite(coutDes)) {
      check.textContent = `Ces dés ne correspondent à aucune répartition de départ au rang ${r.toLowerCase()}. Voir le guidebook, chapitre Le système.`;
      check.dataset.state = "error";
    } else if (utilisees > total) {
      check.textContent = `Trop d’améliorations : ${utilisees} utilisées, ${total} disponible${total > 1 ? "s" : ""} à ${known ? a : 0} lunes.`;
      check.dataset.state = "error";
    } else {
      check.textContent = total
        ? `${total} amélioration${total > 1 ? "s" : ""} à ${a} lunes : ${utilisees} utilisée${utilisees > 1 ? "s" : ""}, ${total - utilisees} restante${total - utilisees > 1 ? "s" : ""}.`
        : "Répartition valide.";
      check.dataset.state = "ok";
    }
  }
  form.addEventListener("input", update);
  form.addEventListener("change", update);
  update();
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
      enableCheckImage: true,
      messageImageError: 'Vérifie l’adresse ou l’hébergement de ton avatar.',
      messageTagError: 'Vérifie ton code HTML.',
      personaPageTitle: function (action) { return action + ' sa fiche de présentation'; },
      personaHTML: whFiche
    });
    var form = document.querySelector('.personaForm[data-persona-name="' + NAME + '"]');
    if (form) whFormRules(form);
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
