/* Effets de lecture : en-tête qui rétrécit, apparition en fondu, sommaire collant. */
(function () {
  var reduit = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // En-tête plus fin au défilement
  var entete = document.querySelector('.site-header');
  if (entete) {
    var racine = document.documentElement;
    var maj = function () {
      var r = window.scrollY > 40;
      entete.classList.toggle('reduit', r);
      racine.classList.toggle('entete-reduit', r); // le sommaire rétrécit en même temps
    };
    window.addEventListener('scroll', maj, { passive: true });
    maj();
    // Le sommaire collant se cale sur la hauteur réelle du bandeau, pendant toute l'animation
    var caler = function () { racine.style.setProperty('--h-header', entete.offsetHeight + 'px'); };
    caler();
    if ('ResizeObserver' in window) new ResizeObserver(caler).observe(entete);
    else window.addEventListener('resize', caler);
  }

  // Apparition en fondu : uniquement pour ce qui est sous l'écran au chargement
  if (!reduit && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    var cibles = document.querySelectorAll('main .section, main .bloc, main .temoignages, main .nouveautes, main .livre-grand, main .evt');
    Array.prototype.forEach.call(cibles, function (el) {
      if (el.closest('.apparait')) return;
      if (el.getBoundingClientRect().top > window.innerHeight * 0.9) {
        el.classList.add('apparait');
        obs.observe(el);
      }
    });
  }

  // Sommaire collant : met en avant la rubrique visible
  var liens = Array.prototype.slice.call(document.querySelectorAll('.sommaire a[href^="#"]'));
  if (liens.length && 'IntersectionObserver' in window) {
    var sections = liens.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    var obs2 = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        liens.forEach(function (a) { a.classList.toggle('actif', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(function (s) { if (s) obs2.observe(s); });
  }
})();
