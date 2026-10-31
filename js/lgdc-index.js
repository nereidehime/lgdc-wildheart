/* Adaptation du DOM natif ; aucune activité de démonstration n’est injectée. */
(function () {
  'use strict';

  function forumId(href) {
    try {
      var url = new URL(href, location.href);
      var match = url.origin === location.origin && url.pathname.match(/^\/f(\d+)(?:-|$)/);
      return match ? match[1] : null;
    } catch (e) { return null; }
  }

  var clans = [
    { forum: '10', presentation: '21', key: 'crepuscule', colors: ['#8e7f9a', '#b59ab8'] },
    { forum: '11', presentation: '22', key: 'hetre', colors: ['#b07a4f', '#c99566'] },
    { forum: '12', presentation: '23', key: 'orchidee', colors: ['#c2a24f', '#d1b46a'] },
    { forum: '13', presentation: '24', key: 'brouillard', colors: ['#8a99a4', '#7fa39a'] }
  ];

  function emblem(clan, ring) {
    var symbol = document.createElement('span');
    symbol.className = 'lgdc-sym lgdc-fa-emblem';
    symbol.style.setProperty('--sym', 'var(--sym-clan-' + clan.key + ')');
    symbol.setAttribute('aria-hidden', 'true');
    if (!ring) return symbol;
    var outer = document.createElement('span');
    outer.className = 'lgdc-ring';
    var inner = document.createElement('span');
    inner.className = 'lgdc-ring__in';
    inner.appendChild(symbol);
    outer.appendChild(inner);
    return outer;
  }

  function colors(element, clan) {
    element.style.setProperty('--g1', clan.colors[0]);
    element.style.setProperty('--g2', clan.colors[1]);
  }

  document.querySelectorAll('.lgdc-fa-card').forEach(function (card) {
    var id = forumId(card.dataset.forumUrl);
    if (id) card.dataset.forumId = id;
    var clan = clans.find(function (item) { return item.forum === id; });
    if (clan) {
      card.dataset.clan = clan.key;
      colors(card, clan);
      card.querySelector('.lgdc-cw__head').prepend(emblem(clan, false));
    }

    var description = card.querySelector('.lgdc-fa-desc');
    if (description && !description.textContent.trim() && !description.querySelector('img,iframe,video,audio,form')) description.hidden = true;
    var last = card.querySelector('.lgdc-fa-last__text');
    if (last) {
      last.querySelectorAll('a').forEach(function (link) {
        if (!link.getAttribute('href')) link.remove();
      });
      if (!last.textContent.trim()) {
        last.textContent = 'Aucun message pour le moment.';
        last.dataset.empty = 'true';
      }
    }

    var subforums = card.querySelector('.lgdc-fa-subs');
    if (!subforums) return;
    var links = Array.from(subforums.querySelectorAll('a')).filter(function (a) { return forumId(a.href); });
    if (!links.length) { subforums.hidden = true; return; }
    if (id === '7') links.sort(function (a, b) {
      function order(link) { return clans.findIndex(function (item) { return item.presentation === forumId(link.href); }); }
      var first = order(a), second = order(b);
      return (first < 0 ? clans.length : first) - (second < 0 ? clans.length : second);
    });
    var list = document.createElement('ul');
    list.className = 'lgdc-btns';
    links.forEach(function (link) {
      if (id === '7') {
        var item = clans.find(function (clan) { return clan.presentation === forumId(link.href); });
        if (item) { colors(link, item); link.prepend(emblem(item, true)); }
      }
      var li = document.createElement('li');
      li.appendChild(link);
      list.appendChild(li);
    });
    subforums.replaceChildren(list);
  });

})();
