/* =========================================================================
   WILDHEART — header commun : thème, avatars, lune, intro
   Dépendance facultative : gsap 3.13 (sans lui, pas d'animation d'entrée).
   ========================================================================= */
(function () {
  var root = document.getElementById('lgdc-header');
  if (!root) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  var skip = /lgdc-static/.test(location.search);

  // masque la bannière dès maintenant, avant le premier rendu
  if (!reduce && hasGsap && !skip) root.classList.add('lgdc--intro');

  /* ---------- stockage local (protégé) ---------- */
  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      if (val === null) localStorage.removeItem(key); else localStorage.setItem(key, val);
    } catch (e) { return null; }
  }

  /* ---------- thème clair (par défaut) / sombre ---------- */
  // l'index, le panneau Notiffi et les infobulles vivent hors du header : ils suivent le même thème
  function setDark(on) {
    document.querySelectorAll('.lgdc').forEach(function (el) { el.classList.toggle('lgdc--dark', on); });
    document.documentElement.classList.toggle('lgdc-dark-page', on);
    document.documentElement.dataset.colorScheme = on ? 'dark' : 'light';
    store('color-scheme', on ? 'dark' : 'light');
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(on));
  }
  setDark((store('lgdc-theme') || store('color-scheme')) === 'dark');

  // Dans les listes et panneaux, le pseudo coloré est à côté de l’avatar.
  function colorAvatars() {
    document.querySelectorAll('.lgdc-topic__last, .notification, .switcheroo__squircle, .lgdc-fa-last, #last_user').forEach(function (item) {
      var name = item.querySelector('.lgdc-who, a[href*="/u"] span[style*="color"]');
      var avatar = item.querySelector('.notif_avatar, .switcheroo__avatar, .lgdc-topic__last-avatar, .lgdc-fa-avatar, #lastuser_avatar, img');
      if (!name || !avatar) return;
      var style = getComputedStyle(name);
      var color = style.getPropertyValue('--g1').trim() || style.color;
      if (color && color !== 'transparent' && color !== 'rgba(0, 0, 0, 0)') avatar.style.setProperty('--g1', color);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', colorAvatars);
  else colorAvatars();
  document.querySelectorAll('#notiffi_panel, #switcheroo').forEach(function (panel) {
    new MutationObserver(colorAvatars).observe(panel, {childList: true, subtree: true});
  });
  var themeBtn = root.querySelector('.lgdc-theme');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var dark = !root.classList.contains('lgdc--dark');
    setDark(dark);
    store('lgdc-theme', dark ? 'dark' : 'light');
  });

  /* ---------- la lune en cours : 1 lune = 1 mois réel ----------
     data-launch (AAAA-MM-JJ) sur #lgdc-header = début de la Lune 1.
     Chaque 1er du mois réel, une nouvelle lune se lève. */
  (function () {
    var p = (root.dataset.launch || '').split('-');
    var now = new Date();
    var launch = p.length > 1 ? new Date(+p[0], +p[1] - 1, 1) : new Date(now.getFullYear(), now.getMonth(), 1);
    var moon = Math.max(1, (now.getFullYear() - launch.getFullYear()) * 12 + now.getMonth() - launch.getMonth() + 1);
    var start = new Date(launch.getFullYear(), launch.getMonth() + moon - 1, 1);
    var next = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    var nextMoon = moon + 1;
    // avant l'ouverture du forum : on compte les jours jusqu'à la Lune 1
    if (now < launch) { next = launch; nextMoon = 1; start = now; }
    var days = Math.ceil((next - now) / 864e5);
    var progress = Math.min(1, Math.max(0, (now - start) / (next - start)));

    function fill(attr, val) {
      root.querySelectorAll('[' + attr + ']').forEach(function (el) { el.textContent = val; });
    }
    fill('data-lgdc-moon', moon);
    fill('data-lgdc-nextlabel', now < launch ? 'Ouverture' : 'Lune ' + nextMoon);
    fill('data-lgdc-days', days <= 1 ? 'demain' : 'dans ' + days + ' jours');
    root.querySelectorAll('[data-lgdc-progress]').forEach(function (el) { el.style.width = (progress * 100) + '%'; });
    root.querySelectorAll('.lgdc-moon').forEach(function (el) { el.classList.add('is-ready'); });
  })();

  /* ---------- intro : seule la bannière apparaît ---------- */
  if (reduce || !hasGsap || skip) return;
  var q = function (s) { return root.querySelectorAll(s); };
  gsap.timeline({
    defaults: { ease: 'expo.out' },
    onComplete: function () {
      root.classList.remove('lgdc--intro');
      gsap.set(q('.lgdc-hero__photo, .lgdc-hero__moon, .lgdc-hero__render, .lgdc-title__half, .lgdc-hero__left, .lgdc-hero__right, .lgdc-moon'), { clearProps: 'opacity,transform' });
    }
  })
    .fromTo(q('.lgdc-hero__photo'), { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 2.6, ease: 'power2.out' }, 0)
    .fromTo(q('.lgdc-hero__moon'), { opacity: 0, xPercent: -50, y: 40 }, { opacity: 1, xPercent: -50, y: 0, duration: 2.4 }, .1)
    .fromTo(q('.lgdc-hero__render'), { opacity: 0, y: 70, xPercent: -50 }, { opacity: 1, y: 0, xPercent: -50, duration: 1.8 }, .3)
    .fromTo(q('.lgdc-title__half--l'), { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1.6 }, .7)
    .fromTo(q('.lgdc-title__half--r'), { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 1.6 }, .7)
    .fromTo(q('.lgdc-hero__left, .lgdc-hero__right'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.2, stagger: .12 }, 1.2)
    .fromTo(q('.lgdc-moon'), { opacity: 0, y: 16, xPercent: -50 }, { opacity: 1, y: 0, xPercent: -50, duration: 1.2 }, 1.4);
})();
