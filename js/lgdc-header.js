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

  /* ---------- la lune en cours : une lune va d'une pleine lune à la suivante ----------
     data-launch (AAAA-MM-JJ) sur #lgdc-header = début de la Lune 1.
     Chaque lune suivante se lève le lendemain d'une vraie pleine lune, à l'heure de Paris :
     l'Assemblée tombe donc le dernier jour de chaque lune. */
  (function () {
    var rad = Math.PI / 180;
    // pleine lune n° k (Meeus, Astronomical Algorithms, ch. 49), en millisecondes UTC, à quelques minutes près
    function fullMoon(k) {
      k += .5;
      var t = k / 1236.85, e = 1 - .002516 * t;
      var m = (2.5534 + 29.1053567 * k) * rad;
      var mp = (201.5643 + 385.81693528 * k + .0107582 * t * t) * rad;
      var f = (160.7108 + 390.67050284 * k) * rad;
      var om = (124.7746 - 1.56375588 * k) * rad;
      var jd = 2451550.09766 + 29.530588861 * k + .00015437 * t * t
        - .40614 * Math.sin(mp) + .17302 * e * Math.sin(m) + .01614 * Math.sin(2 * mp)
        + .01043 * Math.sin(2 * f) + .00734 * e * Math.sin(mp - m) - .00515 * e * Math.sin(mp + m)
        + .00209 * e * e * Math.sin(2 * m) - .00111 * Math.sin(mp - 2 * f) - .00057 * Math.sin(mp + 2 * f)
        + .00056 * e * Math.sin(2 * mp + m) - .00042 * Math.sin(3 * mp) + .00042 * e * Math.sin(m + 2 * f)
        + .00038 * e * Math.sin(m - 2 * f) - .00024 * e * Math.sin(2 * mp - m) - .00017 * Math.sin(om);
      return (jd - 2440587.5) * 864e5;
    }
    // jour du calendrier à Paris, compté depuis le 1er janvier 1970
    var paris = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' });
    function day(ms) { return Math.round(Date.parse(paris.format(new Date(ms))) / 864e5); }

    var p = (root.dataset.launch || '').split('-');
    var nowMs = Date.now(), today = day(nowMs);
    var launch = p.length > 2 ? Math.round(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 864e5) : today;
    // première pleine lune qui se lève après l'ouverture : la Lune 2 commence le lendemain
    var k = Math.floor((launch * 864e5 - fullMoon(0)) / (29.530588861 * 864e5)) - 1;
    while (day(fullMoon(k)) + 1 <= launch) k++;
    var moon = 1, start = launch, next = day(fullMoon(k)) + 1;
    while (next <= today) { moon++; start = next; next = day(fullMoon(++k)) + 1; }
    var nextMoon = moon + 1;
    // avant l'ouverture du forum : on compte les jours jusqu'à la Lune 1
    if (today < launch) { moon = 1; nextMoon = 1; start = today; next = launch; }
    var days = next - today;
    var hour = (nowMs - Date.parse(paris.format(new Date(nowMs)))) / 864e5 % 1;
    var progress = Math.min(1, Math.max(0, (today - start + hour) / (next - start)));

    function fill(attr, val) {
      root.querySelectorAll('[' + attr + ']').forEach(function (el) { el.textContent = val; });
    }
    fill('data-lgdc-moon', moon);
    fill('data-lgdc-nextlabel', today < launch ? 'Ouverture' : 'Lune ' + nextMoon);
    fill('data-lgdc-days', days <= 1 ? 'demain' : 'dans ' + days + ' jours');
    root.querySelectorAll('[data-lgdc-progress]').forEach(function (el) { el.style.width = (progress * 100) + '%'; });
    root.querySelectorAll('.lgdc-moon').forEach(function (el) { el.classList.add('is-ready'); });
  })();

  /* ---------- intro : seule la bannière apparaît ----------
     x: 0 avec xPercent : sinon GSAP lit le translateX(-50%) du CSS en pixels et l'ajoute au xPercent (double décalage). */
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
    .fromTo(q('.lgdc-hero__moon'), { opacity: 0, x: 0, xPercent: -50, y: 40 }, { opacity: 1, x: 0, xPercent: -50, y: 0, duration: 2.4 }, .1)
    .fromTo(q('.lgdc-hero__render'), { opacity: 0, y: 70, x: 0, xPercent: -50 }, { opacity: 1, y: 0, x: 0, xPercent: -50, duration: 1.8 }, .3)
    .fromTo(q('.lgdc-title__half--l'), { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1.6 }, .7)
    .fromTo(q('.lgdc-title__half--r'), { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 1.6 }, .7)
    .fromTo(q('.lgdc-hero__left, .lgdc-hero__right'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.2, stagger: .12 }, 1.2)
    .fromTo(q('.lgdc-moon'), { opacity: 0, y: 16, x: 0, xPercent: -50 }, { opacity: 1, y: 0, x: 0, xPercent: -50, duration: 1.2 }, 1.4);
})();
