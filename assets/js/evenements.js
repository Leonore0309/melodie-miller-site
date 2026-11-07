/* Agenda : masque les dates passées, met la prochaine en vedette avec un compte à rebours,
   et alimente les tuiles « Prochaine rencontre ». Fonctionne même si le site n'a pas été reconstruit. */
(function () {
  var d = new Date();
  var pad = function (x) { return ('0' + x).slice(-2); };
  var aujourdhui = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  var jour = function (iso) { return Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) / 86400000; };

  function compte(debut, fin) {
    if (aujourdhui >= debut && aujourdhui <= fin) return aujourdhui === debut ? "Aujourd'hui" : 'En ce moment';
    var n = jour(debut) - jour(aujourdhui);
    return n === 1 ? 'Demain' : 'Dans ' + n + ' jours';
  }

  var liste = document.getElementById('agenda');
  if (liste) {
    var items = Array.prototype.slice.call(liste.querySelectorAll('.evt'));
    var a_venir = [];
    items.forEach(function (li) {
      li.classList.remove('vedette');
      if (li.getAttribute('data-fin') < aujourdhui) li.hidden = true; else a_venir.push(li);
    });
    a_venir.forEach(function (li, i) {
      var c = li.querySelector('.evt-compte');
      if (!c) return;
      c.textContent = compte(li.getAttribute('data-debut'), li.getAttribute('data-fin'));
      c.hidden = false;
      if (i === 0) li.classList.add('vedette');
    });
    var vide = document.getElementById('agenda-vide');
    if (vide && !a_venir.length) vide.hidden = false;
  }

  // Tuiles « Prochaine rencontre » (source cachée générée au build)
  var source = document.querySelectorAll('#agenda-source li');
  var cibles = document.querySelectorAll('[data-prochaine]');
  if (source.length && cibles.length) {
    var prochain = null;
    Array.prototype.forEach.call(source, function (li) {
      if (!prochain && li.getAttribute('data-fin') >= aujourdhui) prochain = li;
    });
    Array.prototype.forEach.call(cibles, function (c) {
      c.textContent = prochain ? prochain.getAttribute('data-texte') : c.getAttribute('data-vide');
    });
  }
})();
