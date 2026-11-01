/* Liste des sujets (maquette presentations.html) et lecture d'un sujet (maquette sujet.html) :
   les données natives prennent le balisage des maquettes. */
(function () {
  'use strict';
  var page = document.querySelector('.lgdc-fa-viewforum, .lgdc-fa-viewtopic');
  if (!page) return;

  // dégradés des groupes, comme sur l'index
  var ends = {};
  var probe = document.createElement('span');
  [['#8e7f9a', '#b59ab8'], ['#b07a4f', '#c99566'], ['#c2a24f', '#d1b46a'], ['#8a99a4', '#7fa39a'],
    ['#a39c92', '#857e74'], ['#cb7a53', '#dfa283']].forEach(function (pair) {
    probe.style.color = pair[0];
    ends[probe.style.color] = pair[1];
  });
  // « Admin » natif (span coloré + strong) devient un pseudo aux couleurs de son groupe
  function who(box) {
    if (!box) return;
    var colored = box.querySelector('[style*="color"]');
    var link = box.querySelector('a[href]');
    var name = (colored || link || box).textContent.replace(/\s+/g, ' ').trim();
    if (!name) return;
    var node = document.createElement(link ? 'a' : 'span');
    if (link) node.href = link.getAttribute('href');
    node.className = 'lgdc-who';
    node.textContent = name;
    var color = colored ? colored.style.color : '#a39c92';
    node.style.setProperty('--g1', color);
    node.style.setProperty('--g2', ends[color] || color);
    var target = colored ? (colored.closest('a') || colored) : null;
    if (target && box.contains(target)) target.replaceWith(node);
    else box.replaceChildren(node);
  }
  function plural(n, one, many) { return parseInt(n, 10) > 1 ? many : one; }

  var list = document.getElementById('lgdc-topic-list');
  var pinned = document.querySelector('#lgdc-announcements .lgdc-announcements');
  var topics = Array.from(page.querySelectorAll('.lgdc-fa-topic'));
  topics.forEach(function (topic) {
    // classes natives : folder_new, folder_announce_new… ; « folder_no_new » reste lu
    var unread = Array.from(topic.classList).some(function (c) { return /_new$/.test(c) && !/no_new$/.test(c); });
    // résultats de recherche : l'état vient de l'image native du dossier
    if (topic.dataset.img) unread = /_new[^/]*$/.test(topic.dataset.img) && !/no_new/.test(topic.dataset.img);
    if (unread) {
      topic.classList.add('is-unread');
      var meta = topic.querySelector('.lgdc-topic__meta');
      if (meta) meta.appendChild(Object.assign(document.createElement('span'), { className: 'lgdc-topic__new', textContent: 'Nouveau' }));
    }
    var author = topic.querySelector('.lgdc-topic__author');
    if (author) {
      who(author);
      var by = author.firstChild;
      if (by && by.nodeType === 3) by.textContent = by.textContent.replace(/\s+/g, ' ').replace(/^\s+/, '');
    }
    who(topic.querySelector('.lgdc-fa-lastwho'));
    // la date devient le lien vers le dernier message, l'icône native disparaît
    var lastLink = topic.querySelector('.lgdc-fa-lastlink');
    if (lastLink) {
      var arrow = lastLink.querySelector('a[href]');
      var time = lastLink.querySelector('time');
      time.textContent = time.textContent.replace(/\s+/g, ' ').trim();
      if (arrow) {
        var a = document.createElement('a');
        a.className = 'lgdc-topic__last-link';
        a.href = arrow.getAttribute('href');
        a.appendChild(time);
        lastLink.replaceWith(a);
      } else lastLink.className = 'lgdc-topic__last-link';
    }
    var avatar = topic.querySelector('.lgdc-topic__last > img');
    if (avatar) { avatar.removeAttribute('style'); avatar.alt = ''; avatar.classList.add('lgdc-avatar--contain'); }
    topic.querySelectorAll('.lgdc-topic__number').forEach(function (number, index) {
      var n = number.querySelector('b').textContent.trim();
      number.querySelector('span').textContent = index ? plural(n, 'vue', 'vues') : plural(n, 'réponse', 'réponses');
    });
    var type = topic.querySelector('.lgdc-fa-type');
    var label = type ? type.textContent.replace(/[:\s]+$/, '').trim() : '';
    if (type && !label) type.remove();
    else if (type) type.textContent = label;
    var desc = topic.querySelector('.lgdc-topic__desc');
    if (desc && !desc.textContent.trim()) desc.remove();
    // annonces et notes : section « À lire avant de commencer », comme dans la maquette
    if (label && pinned) pinned.appendChild(topic);
    else topic.querySelector('.lgdc-topic__symbol').remove();
  });
  if (pinned && pinned.children.length) pinned.closest('section').hidden = false;

  var count = document.getElementById('lgdc-topic-count');
  var shown = list ? list.querySelectorAll('.lgdc-fa-topic').length : 0;
  if (count && shown) count.textContent = shown + ' ' + plural(shown, 'sujet', 'sujets');

  // fil d'Ariane natif : « :: » entre les liens, remplacé par la séparation de la maquette
  var crumbs = page.querySelector('.lgdc-fa-crumbs');
  if (crumbs) {
    var links = Array.from(crumbs.querySelectorAll('a'));
    crumbs.replaceChildren.apply(crumbs, links.map(function (link) {
      link.textContent = link.textContent.trim();
      link.removeAttribute('class');
      return link;
    }));
  }
  // texte natif « Utilisateurs parcourant actuellement ce forum »
  var here = document.getElementById('users_here');
  if (here) {
    here.querySelectorAll('br').forEach(function (br) { br.remove(); });
    here.innerHTML = here.innerHTML.replace(/Utilisateurs parcourant actuellement ce forum|Actuellement sur ce forum/, 'Sur ce forum').replace(/\s*:\s*/, ' : ');
  }
  var mod = document.getElementById('moderation_forum_tools');
  if (mod) mod.innerHTML = mod.innerHTML.replace(/modérer ce forum/, 'Modérer les sujets du forum');

  /* Lecture d'un sujet : chaque message prend les couleurs du groupe de son auteur. */
  var CLANS = [
    { color: '#8e7f9a', sym: 'clan-crepuscule', name: 'Clan du Crépuscule' },
    { color: '#b07a4f', sym: 'clan-hetre', name: 'Clan du Hêtre' },
    { color: '#c2a24f', sym: 'clan-orchidee', name: 'Clan de l’Orchidée' },
    { color: '#8a99a4', sym: 'clan-brouillard', name: 'Clan du Brouillard' },
    { color: '#a39c92', sym: 'solitaires', name: 'Solitaires' },
    { color: '#cb7a53', sym: 'staff', name: 'Staff' }
  ].map(function (clan) { probe.style.color = clan.color; clan.color = probe.style.color; return clan; });
  var LABELS = { "Date d'inscription": 'Arrivée', 'Date d’inscription': 'Arrivée' };
  function tool(href, label, icon) {
    var a = document.createElement('a');
    a.href = href; a.className = 'lgdc-tool';
    a.setAttribute('aria-label', label); a.title = label;
    a.innerHTML = '<i class="ph-light ' + icon + '" aria-hidden="true"></i>';
    return a;
  }
  page.querySelectorAll('.lgdc-post').forEach(function (post) {
    var nameBox = post.querySelector('.lgdc-fa-name');
    var colored = nameBox && nameBox.querySelector('[style*="color"]');
    var color = colored ? colored.style.color : '#a39c92';
    post.style.setProperty('--g1', color);
    post.style.setProperty('--g2', ends[color] || color);
    var profile = (nameBox && nameBox.querySelector('a[href]')) || post.querySelector('.lgdc-fa-av a[href]');
    var profileHref = profile && profile.getAttribute('href');
    if (nameBox) {
      var name = document.createElement(profileHref ? 'a' : 'span');
      if (profileHref) name.href = profileHref;
      name.className = 'lgdc-post__name';
      name.textContent = nameBox.textContent.replace(/\s+/g, ' ').trim();
      nameBox.replaceWith(name);
      var clan = CLANS.find(function (c) { return c.color === color; });
      if (clan) {
        var line = document.createElement('p');
        line.className = 'lgdc-post__clan';
        line.innerHTML = '<span class="lgdc-sym" style="--sym:var(--sym-' + clan.sym + ')" aria-hidden="true"></span>';
        line.appendChild(document.createTextNode(clan.name));
        post.querySelector('.lgdc-post__rank').after(line);
      }
    }
    var avatar = post.querySelector('.lgdc-fa-av img');
    if (avatar) { avatar.removeAttribute('style'); avatar.alt = ''; }
    else { var empty = post.querySelector('.lgdc-fa-av'); if (empty) empty.remove(); }
    post.querySelectorAll('.lgdc-post__rank br').forEach(function (br) { br.remove(); });
    post.querySelectorAll('.lgdc-post__stats dt').forEach(function (dt) {
      var label = dt.textContent.replace(/\s*:\s*$/, '').trim();
      dt.textContent = LABELS[label] || label;
    });
    // actions sans droit : Forumactif laisse un lien vide
    post.querySelectorAll('.lgdc-post__actions a').forEach(function (a) { if (!a.getAttribute('href')) a.remove(); });
    post.querySelectorAll('.lgdc-fa-like').forEach(function (b) { if (!b.dataset.href) b.remove(); });
    var time = post.querySelector('.lgdc-post__date time');
    if (time) time.textContent = time.textContent.replace(/\s+/g, ' ').trim();
    // contacts : icônes natives remplacées par les outils de la maquette
    var contact = post.querySelector('.lgdc-fa-contact');
    if (contact) {
      var tools = [];
      if (profileHref) tools.push(tool(profileHref, 'Profil', 'ph-user-circle'));
      contact.querySelectorAll('a[href]').forEach(function (a) {
        var href = a.getAttribute('href');
        if (/privmsg|mode=post/.test(href)) tools.push(tool(href, 'Message privé', 'ph-envelope-simple'));
        else if (/^mailto:/.test(href)) tools.push(tool(href, 'E-mail', 'ph-at'));
        else { var t = tool(href, a.title || 'Site web', 'ph-globe-simple'); t.target = '_blank'; t.rel = 'nofollow'; tools.push(t); }
      });
      contact.replaceChildren.apply(contact, tools);
      if (!tools.length) contact.remove();
    }
    var sig = post.querySelector('.lgdc-post__sig');
    if (sig && !sig.textContent.trim() && !sig.querySelector('img')) sig.remove();
  });
  // outils de modération : images natives remplacées par les outils de la maquette
  var MOD = { delete: 'ph-trash', move: 'ph-arrows-out-cardinal', lock: 'ph-lock-simple', unlock: 'ph-lock-simple-open', split: 'ph-scissors', merge: 'ph-git-merge' };
  page.querySelectorAll('.lgdc-fa-quickmod .lgdc-fa-modtools a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    var mode = /\/merge/.test(href) ? 'merge' : (href.match(/mode=(\w+)/) || [])[1];
    var img = a.querySelector('img');
    a.replaceWith(tool(href, img ? img.alt : mode, MOD[mode] || 'ph-wrench'));
  });
  // tables des dés spéciaux (guidebook, chapitre Le système) : bornes hautes du d100
  var PREY = {
    'crépuscule': [[35, 'campagnol'], [60, 'lézard'], [85, 'oiseau'], [100, 'lapin']],
    'hêtre': [[40, 'mulot'], [70, 'oiseau'], [100, 'écureuil']],
    'orchidée': [[40, 'campagnol'], [85, 'oiseau'], [100, 'lapin']],
    'brouillard': [[35, 'grenouille'], [55, 'campagnol'], [70, 'oiseau'], [100, 'poisson']]
  };
  var LITTER = [[4, '1 chaton'], [14, '2 chatons'], [34, '3 chatons'], [59, '4 chatons'], [79, '5 chatons'], [91, '6 chatons'], [97, '7 chatons'], [100, '8 chatons']];
  // chasse en un seul lancer : dé Chasse, puis deux dés par étape (guidebook, La chasse)
  // difficultés par proie (Guetter, Se faufiler, Bondir, Mordre) et points pour la pile
  var HUNT = {
    campagnol: [10, 7, 7, 7, 1], mulot: [10, 7, 7, 7, 1], grenouille: [10, 7, 10, 7, 1], 'lézard': [10, 7, 10, 7, 1],
    oiseau: [7, 10, 13, 7, 1], 'écureuil': [7, 10, 13, 7, 2], poisson: [10, 7, 13, 7, 2], lapin: [7, 13, 13, 10, 3]
  };
  var STEPS = ['Guetter', 'Se faufiler', 'Bondir', 'Mordre'];
  // capacité de Clan : +1 en Guetter pour le Crépuscule, +1 en Bondir pour l'Orchidée
  var CLAN_STEP = { 'crépuscule': 0, 'orchidée': 2 };
  // dégradé des dés : le territoire de la chasse, sinon le groupe de l'auteur
  var CLAN_TINT = { 'crépuscule': ['#8e7f9a', '#b59ab8'], 'hêtre': ['#b07a4f', '#c99566'], 'orchidée': ['#c2a24f', '#d1b46a'], 'brouillard': ['#8a99a4', '#7fa39a'] };
  function tint(card, pair) {
    if (!pair || !pair[0]) return;
    card.style.setProperty('--g1', pair[0]);
    card.style.setProperty('--g2', pair[1] || pair[0]);
  }
  function ending(card, won, text, line) {
    var end = document.createElement('div');
    end.className = 'lgdc-roll__end ' + (won ? 'is-win' : 'is-fail');
    var title = document.createElement('b');
    title.textContent = text;
    end.appendChild(title);
    if (line) {
      var code = document.createElement('code');
      code.textContent = line;
      end.appendChild(code);
    }
    card.appendChild(end);
  }
  function note(card, text) {
    var p = document.createElement('p');
    p.className = 'lgdc-roll__note';
    p.textContent = text;
    card.appendChild(p);
  }
  // critique : double de 6 ou plus ; échec spectaculaire : double 1 (guidebook, Le test)
  function judge(faces, score, diff) {
    var pair = faces.length === 2 && faces[0] === faces[1];
    return pair && faces[0] === 1 ? ['fumble', 'Échec spectaculaire']
      : pair && faces[0] >= 6 ? ['crit', 'Critique']
      : score >= diff ? ['win', 'Réussite'] : ['fail', 'Échec'];
  }
  function chip(verdict) {
    var tag = document.createElement('span');
    tag.className = 'lgdc-roll__verdict is-' + verdict[0];
    tag.textContent = verdict[1];
    return tag;
  }
  function lookup(die, value) {
    var name = die.toLowerCase();
    var table = /portée/.test(name) ? LITTER : null;
    Object.keys(PREY).forEach(function (clan) { if (/chasse/.test(name) && name.indexOf(clan) >= 0) table = PREY[clan]; });
    if (!table || !/^\d+$/.test(value)) return null;
    var hit = table.find(function (step) { return +value <= step[0]; });
    return hit ? hit[1] : null;
  }
  // lancers de dés : le texte natif (« Le membre 'X' a effectué l'action suivante… ») devient une carte
  // mises en page des messages : la balise écrite par l'éditeur en tête du message,
  // [modele=brk|titre=…|lune=…|lieu=…|moment=…|avec=…|image=…|couleur=#…|tw=…] pour un RP, [staff=ok|titre=…] pour le staff.
  // Le reste du message devient le texte du modèle, aux couleurs du Clan de l'auteur.
  var MOMENTS = { 'aube': 'ph-sun-horizon', 'matin': 'ph-sun', 'midi': 'ph-sun', 'après-midi': 'ph-sun', 'crépuscule': 'ph-sun-horizon', 'nuit': 'ph-moon-stars' };
  var STAFF = { info: 'Le staff', fix: 'Ajustements demandés', ok: 'Fiche validée', no: 'Fiche refusée' };
  function node(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function meta(cls, o) {
    var p = node('p', cls);
    [['ph-moon', o.lune ? 'Lune ' + o.lune : ''], ['ph-map-pin', o.lieu], [MOMENTS[(o.moment || '').toLowerCase()] || 'ph-sun', o.moment]].forEach(function (item) {
      if (!item[1]) return;
      var span = node('span');
      var icon = node('i', 'ph-light ' + item[0]);
      icon.setAttribute('aria-hidden', 'true');
      span.append(icon, item[1]);
      p.appendChild(span);
    });
    return p.children.length ? p : null;
  }
  function partners(cls, o) {
    var names = (o.avec || '').split(',').map(function (n) { return n.trim(); }).filter(Boolean);
    if (!names.length) return null;
    var p = node('p', cls);
    names.forEach(function (n) {
      var a = node('a', null, n);
      a.href = '/memberlist?username=' + encodeURIComponent(n);
      p.appendChild(a);
    });
    return p;
  }
  // éclaircit une couleur #rrggbb vers le blanc (0 à 1), pour la seconde couleur du dégradé
  function lighten(hex, amount) {
    return '#' + [1, 3, 5].map(function (i) {
      var c = parseInt(hex.slice(i, i + 2), 16);
      return Math.round(c + (255 - c) * amount).toString(16).padStart(2, '0');
    }).join('');
  }
  // la suite d'une fiche validée, la même pour tout le monde
  function nextSteps() {
    var ul = node('ul');
    [['Liens', 'Poste ta fiche de liens : ', '/f2-fiche-de-liens', 'fiches de liens', '. Le formulaire se remplit tout seul.'],
     ['Chronologie', 'Ouvre ta chronologie dans ', '/f25-chronologies', 'chronologies', ', pour suivre les RP de ton personnage.'],
     ['Partenaires', 'Cherche avec qui jouer dans ', '/f26-recherches-ouvertes', 'les recherches ouvertes', ', ou réponds à une annonce.'],
     ['Premier RP', 'Lance ton premier sujet sur le territoire de ton Clan. Les dés et les modèles sont dans l’éditeur, expliqués au ', '/h1-guidebook#systeme', 'guidebook', '.']
    ].forEach(function (step) {
      var li = node('li'), a = node('a', null, step[3]);
      a.href = step[2];
      li.append(node('b', null, step[0]), node('span'));
      li.lastChild.append(step[1], a, step[4]);
      ul.appendChild(li);
    });
    return ul;
  }
  function where(o) { return [o.lune ? 'Lune ' + o.lune : '', o.lieu, (o.moment || '').toLowerCase()].filter(Boolean).join(', '); }
  function layout(content, post) {
    var html = content.innerHTML;
    var m = html.match(/\[(modele|staff)=([^\]]*)\]/i);
    if (!m) return;
    var raw = document.createElement('div');
    raw.innerHTML = m[2];
    var parts = raw.textContent.split('|');
    var kind = parts.shift().trim().toLowerCase(), o = {};
    parts.forEach(function (part) {
      var eq = part.indexOf('=');
      if (eq > 0) o[part.slice(0, eq).trim().toLowerCase()] = part.slice(eq + 1).trim();
    });
    var staff = /^staff$/i.test(m[1]);
    if (staff ? !STAFF[kind] : ['tpl', 'tpl2', 'brk', 'frm'].indexOf(kind) < 0) return;
    var body = html.slice(0, m.index) + html.slice(m.index + m[0].length).replace(/^\s*(<br\s*\/?>\s*)+/i, '');
    var text = node('div');
    text.innerHTML = body.trim();
    if (o.tw && !staff) text.prepend(node('tw', null, o.tw));
    var box, g1 = post.style.getPropertyValue('--g1'), g2 = post.style.getPropertyValue('--g2');
    if (staff) {
      box = node('div', 'lgdc-adm lgdc-adm--' + kind);
      box.append(node('p', 'lgdc-adm__label', STAFF[kind]));
      // annonce : une grande icône Phosphor en entête, au choix du staff
      if (kind === 'info') {
        var head = node('div', 'lgdc-adm__head'), ico = node('i', 'ph-light ph-' + ((o.icone || '').toLowerCase().replace(/[^a-z0-9-]/g, '') || 'megaphone'));
        ico.setAttribute('aria-hidden', 'true');
        head.appendChild(ico);
        box.appendChild(head);
      }
      // fiche validée : le staff donne seulement le pseudo, le titre de bienvenue en découle
      var title = o.titre || (kind === 'ok' && o.pour ? 'Bienvenue parmi nous, ' + o.pour : '');
      if (title) box.appendChild(node('h2', 'lgdc-adm__title', title));
      // le texte libre devient des paragraphes (une ligne vide les sépare), les listes restent à part
      var para = null, breaks = 0;
      Array.from(text.childNodes).forEach(function (child) {
        if (child.nodeType === 1 && /^(UL|OL|DIV|BLOCKQUOTE|TABLE|P)$/.test(child.tagName)) { para = null; box.appendChild(child); return; }
        if (child.nodeType === 1 && child.tagName === 'BR') { breaks++; if (breaks > 1) para = null; else if (para) para.appendChild(child); return; }
        if (child.nodeType === 3 && !child.textContent.trim()) return;
        breaks = 0;
        if (!para) { para = node('p'); box.appendChild(para); }
        para.appendChild(child);
      });
      // seul le retour à la ligne qui finit un paragraphe disparaît (:last-child ignore le texte qui le suit)
      box.querySelectorAll('p > br').forEach(function (br) { var next = br.nextSibling; if (!next || (next.nodeType === 3 && !next.textContent.trim() && !next.nextSibling)) br.remove(); });
      if (kind === 'ok') box.append(node('p', 'lgdc-adm__sub', 'Et maintenant'), nextSteps());
    } else {
      box = node('div', 'lgdc-' + kind);
      // accent : la couleur de dialogue du personnage, sinon celle de son groupe
      if (/^#[0-9a-f]{6}$/i.test(o.couleur || '')) { g1 = o.couleur; g2 = lighten(o.couleur, .3); }
      if (g1) { box.style.setProperty('--g1', g1); box.style.setProperty('--g2', g2 || g1); }
      var av = post.querySelector('.lgdc-post__av img');
      var avatar = function (cls) {
        var span = node(cls === 'lgdc-tpl2__av' ? 'span' : 'div', cls);
        // l'image choisie dans l'éditeur, sinon l'avatar du compte
        var src = /^https?:\/\//.test(o.image || '') ? o.image.replace(/"/g, '') : av && av.getAttribute('src');
        if (src) { var img = node('img'); img.src = src; img.alt = ''; span.appendChild(img); }
        return span;
      };
      var title = o.titre ? node('h2', 'lgdc-' + kind + '__title', o.titre) : null;
      if (kind === 'tpl') {
        var top = node('div', 'lgdc-tpl__top');
        // avec une image : elle remplit le carré, sur la bannière de brume teintée de l'accent ;
        // sans image : variante unie, sans carré (comme la maquette)
        var picture = /^https?:\/\//.test(o.image || '') ? o.image.replace(/"/g, '') : '';
        if (picture) top.style.setProperty('--img', 'url("https://images.unsplash.com/photo-1696255400336-05e8eb84f01a?w=1200&q=70")');
        else box.classList.add('lgdc-tpl--plain');
        if (title) top.appendChild(title);
        box.appendChild(top);
        if (picture) {
          var square = node('div', 'lgdc-tpl__av'), img = node('img');
          img.src = picture; img.alt = '';
          square.appendChild(img);
          box.appendChild(square);
        }
        if (where(o)) box.appendChild(node('p', 'lgdc-tpl__where', where(o)));
        text.className = 'lgdc-tpl__text';
        box.appendChild(text);
        var with1 = partners('lgdc-tpl__with', o); if (with1) box.appendChild(with1);
      } else if (kind === 'tpl2') {
        var side = node('aside', 'lgdc-tpl2__side');
        side.appendChild(avatar('lgdc-tpl2__av'));
        if (title) side.appendChild(title);
        if (where(o)) side.appendChild(node('p', 'lgdc-tpl2__sub', where(o)));
        var main = node('div', 'lgdc-tpl2__main');
        text.className = 'lgdc-tpl2__text';
        main.appendChild(text);
        var with2 = partners('lgdc-tpl2__with', o); if (with2) main.appendChild(with2);
        box.append(side, main);
      } else {
        var inner = node('div', 'lgdc-' + kind + '__in');
        if (kind === 'brk') {
          var clan = CLANS.find(function (c) { return c.color === post.style.getPropertyValue('--g1'); });
          if (clan) {
            var sym = node('span', 'lgdc-brk__sym'), mark = node('span', 'lgdc-sym');
            mark.style.setProperty('--sym', 'var(--sym-' + clan.sym + ')');
            mark.setAttribute('aria-hidden', 'true');
            sym.appendChild(mark);
            inner.appendChild(sym);
          }
        }
        if (title) inner.appendChild(title);
        text.className = 'lgdc-' + kind + '__text';
        inner.appendChild(text);
        var info = meta('lgdc-' + kind + '__meta', o); if (info) inner.appendChild(info);
        box.appendChild(inner);
      }
    }
    content.replaceChildren(box);
  }
  // [dialogue=#b0503a]…[/dialogue] : la réplique prend la couleur choisie pour le personnage (sinon celle du Clan)
  function dialogue(content) {
    if (!/\[dialogue/i.test(content.innerHTML)) return;
    content.innerHTML = content.innerHTML.replace(/\[dialogue(?:=(#[0-9a-f]{6}|#[0-9a-f]{3}))?\]([\s\S]*?)\[\/dialogue\]/gi, function (all, color, text) {
      return '<span class="lgdc-dialogue"' + (color ? ' style="--d:' + color + '"' : '') + '>' + text + '</span>';
    });
  }
  page.querySelectorAll('.lgdc-post').forEach(function (post) {
    var content = post.querySelector('.lgdc-post__body .content');
    if (!content) return;
    dialogue(content);
    layout(content, post);
  });

  // [difficulté 13 +2] écrit par l'éditeur dans le message de RP : retiré du texte, gardé pour le verdict.
  // Forumactif publie le lancer dans un message à part, juste après, au nom du compte admin : le joueur
  // n'apparaît que dans « Le membre 'X' ». Le lancer reprend la balise du message précédent de ce joueur.
  var contents = Array.from(page.querySelectorAll('.lgdc-post__body .content'));
  var checks = contents.map(function (content) {
    var found = null;
    var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    for (var t = walker.nextNode(); t; t = walker.nextNode()) {
      var m = t.textContent.match(/\[difficulté (\d+)(?: ([+-]\d+))?\]/);
      if (m) { found = { diff: +m[1], bonus: m[2] ? +m[2] : 0 }; t.textContent = t.textContent.replace(m[0], ''); }
    }
    return found;
  });
  function poster(content) {
    var name = content.closest('.lgdc-post');
    name = name && name.querySelector('.lgdc-post__name');
    return name ? name.textContent.replace(/\s+/g, ' ').trim() : '';
  }
  function roller(content) {
    var m = content.innerHTML.match(/Le membre '\s*<strong>([^<]+)<\/strong>/);
    return m ? m[1].replace(/\s+/g, ' ').trim() : '';
  }
  contents.forEach(function (content, index) {
    var check = checks[index];
    var player = roller(content);
    // le dernier message de ce joueur parmi les trois précédents, sinon le message suivant s'il est de lui
    for (var k = index - 1; !check && player && k >= 0 && k >= index - 3; k--) {
      if (poster(contents[k]) === player) { check = checks[k]; break; }
    }
    if (!check && player && contents[index + 1] && poster(contents[index + 1]) === player) check = checks[index + 1];
    var starts = [];
    content.childNodes.forEach(function (node) {
      if (node.nodeType === 3 && /Le membre '\s*$/.test(node.textContent)) starts.push(node);
    });
    starts.forEach(function (start, i) {
      var nodes = [];
      for (var n = start; n && n !== starts[i + 1]; n = n.nextSibling) nodes.push(n);
      var holder = document.createElement('div');
      nodes.forEach(function (node) { holder.appendChild(node.cloneNode(true)); });
      var html = holder.innerHTML;
      var rolls = [];
      html.replace(/'([^']+)'\s*:\s*<strong>([^<]+)<\/strong>/g, function (all, die, values) {
        rolls.push({ die: die, values: values.split(/[,\s]+/).filter(Boolean) });
      });
      if (!rolls.length) return;
      // le texte du message avant « Le membre » reste, seul le bloc du lancer est remplacé
      start.textContent = start.textContent.replace(/Le membre '\s*$/, '');
      var card = document.createElement('div');
      card.className = 'lgdc-roll';
      var head = document.createElement('p');
      head.className = 'lgdc-roll__head lgdc-micro';
      head.innerHTML = '<i class="ph-light ph-dice-five" aria-hidden="true"></i>Lancer de dés';
      card.appendChild(head);
      // couleur du groupe du joueur qui a lancé (le message du lancer est au nom de l'admin)
      var own = contents.map(function (c) { return c.closest('.lgdc-post'); })
        .filter(function (p, k) { return p && poster(contents[k]) === player; })[0];
      var post = own || content.closest('.lgdc-post');
      if (post) tint(card, [post.style.getPropertyValue('--g1'), post.style.getPropertyValue('--g2')]);
      var total = 0, count = 0, faces = [], prey = null, territory = null, plainRows = [], marks = [];
      rolls.forEach(function (roll) {
        var row = document.createElement('div');
        row.className = 'lgdc-roll__row';
        var die = document.createElement('span');
        die.className = 'lgdc-roll__die';
        die.textContent = roll.die;
        row.appendChild(die);
        var special = false;
        roll.values.forEach(function (value) {
          var face = document.createElement('b');
          face.className = 'lgdc-roll__face';
          face.textContent = value;
          row.appendChild(face);
          var result = lookup(roll.die, value);
          if (result && HUNT[result] && !prey) {
            prey = result;
            territory = Object.keys(PREY).find(function (clan) { return roll.die.toLowerCase().indexOf(clan) >= 0; });
          }
          if (result) {
            special = true;
            marks.push(result);
            var out = document.createElement('span');
            out.className = 'lgdc-roll__out';
            out.textContent = result;
            row.appendChild(out);
          }
          else if (/^\d+$/.test(value)) { total += +value; count++; faces.push(+value); }
        });
        if (special) row.classList.add('is-special');
        else plainRows.push(row);
        card.appendChild(row);
      });

      if (prey && faces.length >= 2) {
        // la chasse se déroule dans l'ordre : arrêt au premier échec, un critique saute l'étape suivante
        head.lastChild.textContent = 'Chasse';
        tint(card, CLAN_TINT[territory]);
        card.classList.add('is-hunt');
        card.dataset.mark = prey;
        plainRows.forEach(function (row) { row.remove(); });
        var step = 0, caught = false, over = false;
        STEPS.forEach(function (name, s) {
          var row = document.createElement('div');
          row.className = 'lgdc-roll__row lgdc-roll__step';
          var label = document.createElement('span');
          label.className = 'lgdc-roll__die';
          label.textContent = name;
          row.appendChild(label);
          var pair = faces.slice(s * 2, s * 2 + 2);
          if (over || s < step || pair.length < 2) {
            row.classList.add('is-off');
            var off = document.createElement('span');
            off.className = 'lgdc-micro lgdc-roll__diff';
            off.textContent = s < step ? 'sautée' : 'non jouée';
            row.appendChild(off);
            card.appendChild(row);
            return;
          }
          var plus = CLAN_STEP[territory] === s ? 1 : 0;
          var score = pair[0] + pair[1] + plus;
          pair.forEach(function (v) {
            var face = document.createElement('b');
            face.className = 'lgdc-roll__face';
            face.textContent = v;
            row.appendChild(face);
          });
          var against = document.createElement('span');
          against.className = 'lgdc-micro lgdc-roll__diff';
          against.textContent = score + (plus ? ' (+1 du Clan)' : '') + ' contre ' + HUNT[prey][s];
          var verdict = judge(pair, score, HUNT[prey][s]);
          row.append(against, chip(verdict));
          card.appendChild(row);
          if (verdict[0] === 'fail' || verdict[0] === 'fumble') { over = true; return; }
          step = s + (verdict[0] === 'crit' ? 2 : 1);
          if (step >= 4) { caught = true; over = true; }
        });
        if (caught) ending(card, true, 'Proie attrapée', 'Chasse : ' + prey + ' (+' + HUNT[prey][4] + ')');
        else ending(card, false, 'La proie s’enfuit');
      }
      else {
        var tested = check && count > 0 && i === 0;
        if (count > 1 || tested) {
          var sum = document.createElement('p');
          sum.className = 'lgdc-roll__total';
          sum.innerHTML = '<span class="lgdc-micro">total</span><b></b>';
          var score = total + (tested ? check.bonus : 0);
          sum.querySelector('b').textContent = score;
          card.dataset.mark = score;
          if (tested) {
            if (check.bonus) sum.querySelector('.lgdc-micro').textContent = 'total, bonus ' + (check.bonus > 0 ? '+' : '') + check.bonus;
            var against = document.createElement('span');
            against.className = 'lgdc-micro lgdc-roll__diff';
            against.textContent = 'difficulté ' + check.diff;
            sum.append(against, chip(judge(faces, score, check.diff)));
          }
          card.appendChild(sum);
        }
      }
      if (!card.dataset.mark) card.dataset.mark = marks.length ? marks[0] : count > 1 ? total : (faces[0] || '');
      nodes.slice(1).forEach(function (node) { node.remove(); });
      start.after(card);
    });
  });
  // lancer de dés du forum : la balise écrite par l'éditeur ([lancer d8 d6 difficulté 13 +2],
  // [chasse Orchidée d8 d12 …], [portée]) devient une fiche. Chaque dé est calculé à partir des numéros
  // du message, du sujet et du compte, et de sa position : le résultat est le même pour tous les visiteurs.
  // cyrb53 (hachage) puis mulberry32 (tirage), deux algorithmes publics.
  function cyrb53(str) {
    var h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (var c = 0; c < str.length; c++) {
      var ch = str.charCodeAt(c);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }
  function mulberry32(seed) {
    var t = (seed + 0x6d2b79f5) | 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  function die(seed, sides) { return 1 + Math.floor(mulberry32(cyrb53(seed) % 4294967296) * sides); }
  function face(value) {
    var b = document.createElement('b');
    b.className = 'lgdc-roll__face';
    b.textContent = value;
    return b;
  }
  function line(card, label, values, out) {
    var row = document.createElement('div');
    row.className = 'lgdc-roll__row' + (out ? ' is-special' : '');
    var name = document.createElement('span');
    name.className = 'lgdc-roll__die';
    name.textContent = label;
    row.appendChild(name);
    values.forEach(function (v) { row.appendChild(face(v)); });
    if (out) {
      var o = document.createElement('span');
      o.className = 'lgdc-roll__out';
      o.textContent = out;
      row.appendChild(o);
    }
    card.appendChild(row);
    return row;
  }
  function rollCard(kind, inner, seedBase, post) {
    var card = document.createElement('div');
    card.className = 'lgdc-roll';
    var head = document.createElement('p');
    head.className = 'lgdc-roll__head lgdc-micro';
    head.innerHTML = '<i class="ph-light ph-dice-five" aria-hidden="true"></i>';
    head.appendChild(document.createTextNode(/^chasse$/i.test(kind) ? 'Chasse' : /^portée$/i.test(kind) ? 'Portée' : 'Lancer de dés'));
    card.appendChild(head);
    if (post) tint(card, [post.style.getPropertyValue('--g1'), post.style.getPropertyValue('--g2')]);
    var words = inner.trim().split(/\s+/).filter(Boolean);
    var n = 0;
    var roll = function (sides) { return die(seedBase + ':' + (n++) + ':' + sides, sides); };

    if (/^portée$/i.test(kind)) {
      var litter = roll(100);
      var res = lookup('Portée', String(litter));
      line(card, 'Portée', [litter], res);
      card.dataset.mark = res;
      return card;
    }

    if (/^chasse$/i.test(kind)) {
      var territory = Object.keys(PREY).find(function (clan) { return plain(clan) === plain(words[0] || ''); });
      if (!territory) return null;
      var d100 = roll(100);
      var prey = lookup('Chasse : ' + territory, String(d100));
      tint(card, CLAN_TINT[territory]);
      card.classList.add('is-hunt');
      card.dataset.mark = prey;
      line(card, 'Chasse : ' + words[0], [d100], prey);
      var dice = words.slice(1).filter(function (w) { return /^d\d+$/i.test(w); });
      var faces = dice.map(function (w) { return roll(+w.slice(1)); });
      var step = 0, caught = false, over = false, failed = false;
      STEPS.forEach(function (stepName, st) {
        var row = line(card, stepName, []);
        row.classList.add('lgdc-roll__step');
        var pair = faces.slice(st * 2, st * 2 + 2);
        if (over || st < step || pair.length < 2) {
          row.classList.add('is-off');
          var off = document.createElement('span');
          off.className = 'lgdc-micro lgdc-roll__diff';
          off.textContent = st < step ? 'sautée' : 'non jouée';
          row.appendChild(off);
          return;
        }
        var plus = CLAN_STEP[territory] === st ? 1 : 0;
        var score = pair[0] + pair[1] + plus;
        pair.forEach(function (v) { row.appendChild(face(v)); });
        var against = document.createElement('span');
        against.className = 'lgdc-micro lgdc-roll__diff';
        against.textContent = score + (plus ? ' (+1 du Clan)' : '') + ' contre ' + HUNT[prey][st];
        var verdict = judge(pair, score, HUNT[prey][st]);
        row.append(against, chip(verdict));
        if (verdict[0] === 'fail' || verdict[0] === 'fumble') { over = true; failed = true; return; }
        step = st + (verdict[0] === 'crit' ? 2 : 1);
        if (step >= 4) { caught = true; over = true; }
      });
      if (caught) ending(card, true, 'Proie attrapée', 'Chasse : ' + prey + ' (+' + HUNT[prey][4] + ')');
      else if (failed) ending(card, false, 'La proie s’enfuit');
      // la balise n'a pas assez de dés pour finir la chasse : pas de faux échec
      else ending(card, false, 'Chasse incomplète', 'les dés des étapes manquent');
      return card;
    }

    // [lancer d8 d6 difficulté 13 +2]
    var d = words.indexOf('difficulté');
    var diff = d >= 0 ? parseInt(words[d + 1], 10) : 0;
    var bonus = d >= 0 && words[d + 2] ? parseInt(words[d + 2], 10) || 0 : 0;
    var list = (d >= 0 ? words.slice(0, d) : words).filter(function (w) { return /^d\d+$/i.test(w) && +w.slice(1) >= 2 && +w.slice(1) <= 100; });
    if (!list.length) return null;
    var values = list.map(function (w) { return roll(+w.slice(1)); });
    list.forEach(function (w, k) { line(card, w, [values[k]]); });
    var total = values.reduce(function (a, b) { return a + b; }, 0);
    if (values.length > 1 || diff) {
      var sum = document.createElement('p');
      sum.className = 'lgdc-roll__total';
      sum.innerHTML = '<span class="lgdc-micro">total</span><b></b>';
      var scoreAll = total + (diff ? bonus : 0);
      sum.querySelector('b').textContent = scoreAll;
      if (diff) {
        if (bonus) sum.querySelector('.lgdc-micro').textContent = 'total, bonus ' + (bonus > 0 ? '+' : '') + bonus;
        var vs = document.createElement('span');
        vs.className = 'lgdc-micro lgdc-roll__diff';
        vs.textContent = 'difficulté ' + diff;
        sum.append(vs, chip(judge(values, scoreAll, diff)));
      }
      card.appendChild(sum);
      card.dataset.mark = scoreAll;
    } else card.dataset.mark = values[0];
    return card;
  }
  function plain(text) { return String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
  page.querySelectorAll('.lgdc-post').forEach(function (post) {
    var content = post.querySelector('.lgdc-post__body .content');
    if (!content) return;
    var postId = post.id || (post.className.match(/post--(\d+)/) || [])[1] || '';
    var date = post.querySelector('.lgdc-post__date');
    var topicId = ((date && date.getAttribute('href')) || location.pathname).match(/\/t(\d+)/);
    topicId = topicId ? topicId[1] : '';
    var author = post.querySelector('a.lgdc-post__name, .lgdc-post__name a');
    var userId = author ? ((author.getAttribute('href') || '').match(/\/u(\d+)/) || [])[1] || '0' : '0';
    var found = 0;
    // les dés prennent l'accent de la mise en page du RP s'il y en a une, sinon la couleur du groupe
    var accent = content.querySelector('.lgdc-tpl, .lgdc-tpl2, .lgdc-brk, .lgdc-frm') || post;
    var walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    var texts = [];
    for (var t = walker.nextNode(); t; t = walker.nextNode()) if (/\[(lancer|chasse|portée)[^\]]*\]/i.test(t.textContent)) texts.push(t);
    texts.forEach(function (text) {
      var re = /\[(lancer|chasse|portée)([^\]]*)\]/gi, m, last = 0, frag = document.createDocumentFragment(), src = text.textContent;
      while ((m = re.exec(src))) {
        frag.appendChild(document.createTextNode(src.slice(last, m.index)));
        var card = postId && topicId ? rollCard(m[1], m[2], 'wildheart:' + topicId + ':' + postId + ':' + userId + ':' + (found++), accent) : null;
        frag.appendChild(card || document.createTextNode(m[0]));
        last = re.lastIndex;
      }
      frag.appendChild(document.createTextNode(src.slice(last)));
      text.replaceWith(frag);
    });
  });
  var posters = page.querySelector('.lgdc-fa-posters');
  if (posters && !posters.textContent.trim()) posters.remove();
})();
