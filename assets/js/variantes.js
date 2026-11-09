/* Maquette : panneau « Variantes ».
   - Accueil : texte des nouveautés (?nouv=complet | court)
   - En audio : 3 mises en page (?audio=pochettes | playlist | salles) */
(function () {
  var html = document.documentElement;
  var params = new URLSearchParams(window.location.search);
  var REGLAGES = [
    { cle: 'audio', attr: 'data-audio', titre: 'Mise en page audio', defaut: 'pochettes', page: '.audio-corps',
      choix: [['pochettes', 'Pochettes + ondes'], ['playlist', 'Playlist'], ['salles', 'Deux salles']] },
    { cle: 'nouv', attr: 'data-nouv', titre: 'Textes des nouveautés', defaut: 'complet', page: '.nouveautes',
      choix: [['complet', 'Complets'], ['court', 'Une phrase']] }
  ];
  function lire(c) { try { return window.localStorage.getItem('mm-' + c); } catch (e) { return null; } }
  function ecrire(c, v) { try { window.localStorage.setItem('mm-' + c, v); } catch (e) { /* stockage indisponible */ } }

  REGLAGES.forEach(function (r) {
    var val = params.get(r.cle) || lire(r.cle) || r.defaut;
    if (!r.choix.some(function (c) { return c[0] === val; })) val = r.defaut;
    html.setAttribute(r.attr, val);
    if (params.get(r.cle)) ecrire(r.cle, val);
  });

  function construire() {
    var actifs = REGLAGES.filter(function (r) { return document.querySelector(r.page); });
    if (!actifs.length) return;
    var panneau = document.createElement('details');
    panneau.className = 'vp';
    panneau.open = true;
    var corps = '<summary>Variantes</summary><div class="vp-corps">';
    actifs.forEach(function (r) {
      corps += '<div class="vp-groupe"><span class="vp-titre">' + r.titre + '</span><div class="vp-choix">';
      r.choix.forEach(function (c) {
        corps += '<button type="button" data-cle="' + r.cle + '" data-val="' + c[0] + '" aria-pressed="' + (html.getAttribute(r.attr) === c[0]) + '">' + c[1] + '</button>';
      });
      corps += '</div></div>';
    });
    corps += '<p class="vp-note">Maquette : ce panneau disparaîtra du site final.</p></div>';
    panneau.innerHTML = corps;
    panneau.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-val]');
      if (!b) return;
      var r = REGLAGES.filter(function (x) { return x.cle === b.getAttribute('data-cle'); })[0];
      html.setAttribute(r.attr, b.getAttribute('data-val'));
      ecrire(r.cle, b.getAttribute('data-val'));
      panneau.querySelectorAll('button[data-cle="' + r.cle + '"]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    });
    document.body.appendChild(panneau);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', construire);
  else construire();
})();
