/* Effets de lecture : en-tête qui rétrécit, apparition en fondu, sommaire collant. */
(function () {
  var reduit = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // En-tête plus fin au défilement
  var entete = document.querySelector('.site-header');
  if (entete) {
    var maj = function () { entete.classList.toggle('reduit', window.scrollY > 40); };
    window.addEventListener('scroll', maj, { passive: true });
    maj();
  }

  // Apparition en fondu : uniquement pour ce qui est sous l'écran au chargement
  if (!reduit && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    var cibles = document.querySelectorAll('main .section, main .bloc, main .temoignages, main .nouveautes, main .livre-grand, main .bande, main .tuile-img, main .affiche, main .evt');
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
