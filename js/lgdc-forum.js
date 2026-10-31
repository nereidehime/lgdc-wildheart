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
  var posters = page.querySelector('.lgdc-fa-posters');
  if (posters && !posters.textContent.trim()) posters.remove();
})();
