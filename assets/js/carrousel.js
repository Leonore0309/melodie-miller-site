/* Carrousels de couvertures : livre central en grand (x1,5), voisins plus petits.
   Défilement automatique toutes les 4 s (pause au survol, au focus et après une action),
   flèches, clic sur un voisin, glisser du doigt. Rien ne bouge si « réduire les animations ». */
(function () {
  var reduit = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ECHELLE = 2 / 3; // livres latéraux : 200 px pour un livre central de 300 px
  var ECART = 24;

  function init(car) {
    var items = Array.prototype.slice.call(car.querySelectorAll('.car-item'));
    var details = Array.prototype.slice.call(car.querySelectorAll('.car-detail'));
    var points = Array.prototype.slice.call(car.querySelectorAll('.car-points button'));
    var n = items.length;
    if (n < 2) return;
    var duo = car.getAttribute('data-mode') === 'duo' || n === 2;
    var courant = 0;
    var pauseJusqua = 0;
    var survol = false;
    var visible = true;

    car.classList.add('actif');

    function position(i) { // -1, 0 ou 1 par rapport au livre central (ou 2 = masqué)
      var d = ((i - courant) % n + n) % n;
      if (d === 0) return 0;
      if (d === 1) return 1;
      if (d === n - 1) return -1;
      return 2;
    }

    function dessiner() {
      var w = items[0].offsetWidth || 300;
      var cote = w * ECHELLE;
      var groupe = w + ECART + cote;
      items.forEach(function (it, i) {
        var p = position(i), dx, s, op, z;
        if (duo) {
          dx = p === 0 ? -(groupe / 2 - w / 2) : (groupe / 2 - cote / 2);
          s = p === 0 ? 1 : ECHELLE;
          op = p === 0 ? 1 : .75;
          z = p === 0 ? 3 : 2;
        } else if (p === 0) { dx = 0; s = 1; op = 1; z = 3; }
        else if (p === 2) { dx = 0; s = .5; op = 0; z = 1; }
        else { dx = p * (w / 2 + ECART + cote / 2); s = ECHELLE; op = .75; z = 2; }
        it.style.transform = 'translateX(calc(-50% + ' + dx + 'px)) scale(' + s + ')';
        it.style.opacity = op;
        it.style.zIndex = z;
        it.style.pointerEvents = op === 0 ? 'none' : 'auto';
        it.classList.toggle('centre', p === 0);
        it.setAttribute('aria-hidden', p === 2 ? 'true' : 'false');
      });
      details.forEach(function (d, i) { d.classList.toggle('courant', i === courant); });
      points.forEach(function (b, i) { b.setAttribute('aria-current', i === courant ? 'true' : 'false'); });
    }

    function aller(i, manuel) {
      courant = ((i % n) + n) % n;
      if (manuel) pauseJusqua = Date.now() + 8000;
      dessiner();
    }

    car.querySelector('.car-prec').addEventListener('click', function () { aller(courant - 1, true); });
    car.querySelector('.car-suiv').addEventListener('click', function () { aller(courant + 1, true); });
    items.forEach(function (it, i) {
      it.addEventListener('click', function () { if (i !== courant) aller(i, true); });
    });
    points.forEach(function (b, i) { b.addEventListener('click', function () { aller(i, true); }); });

    // Glisser du doigt ou à la souris
    var piste = car.querySelector('.car-piste');
    var departX = null;
    piste.addEventListener('pointerdown', function (e) { departX = e.clientX; });
    piste.addEventListener('pointerup', function (e) {
      if (departX === null) return;
      var dx = e.clientX - departX; departX = null;
      if (Math.abs(dx) > 40) aller(courant + (dx < 0 ? 1 : -1), true);
    });
    piste.addEventListener('pointercancel', function () { departX = null; });

    // Pause : survol, focus, onglet masqué, carrousel hors écran
    car.addEventListener('mouseenter', function () { survol = true; });
    car.addEventListener('mouseleave', function () { survol = false; });
    car.addEventListener('focusin', function () { survol = true; });
    car.addEventListener('focusout', function () { survol = false; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(car);
    }
    var delai = parseInt(car.getAttribute('data-auto'), 10) || 4000;
    if (!reduit) {
      setInterval(function () {
        if (survol || !visible || document.hidden || Date.now() < pauseJusqua) return;
        aller(courant + 1, false);
      }, delai);
    }

    // Lien direct vers un livre (#id) : on le met au centre
    function selonAncre() {
      var id = window.location.hash.slice(1);
      var i = items.findIndex(function (it) { return it.id === id; });
      if (i >= 0) { aller(i, true); }
    }
    window.addEventListener('hashchange', selonAncre);
    window.addEventListener('resize', dessiner);
    selonAncre();
    dessiner();
    // Les images changent la largeur mesurée : on redessine au chargement complet
    window.addEventListener('load', dessiner);
  }

  Array.prototype.forEach.call(document.querySelectorAll('.carrousel'), init);
})();
