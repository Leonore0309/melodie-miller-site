/* Maquette : panneau « Variantes », uniquement sur la page En audio (3 mises en page).
   On peut aussi forcer une variante par l'adresse : ?audio=pochettes | playlist | salles */
(function () {
  var CHOIX = [['pochettes', 'Pochettes + ondes'], ['playlist', 'Playlist'], ['salles', 'Deux salles']];
  var html = document.documentElement;
  var params = new URLSearchParams(window.location.search);
  function lire() { try { return window.localStorage.getItem('mm-audio'); } catch (e) { return null; } }
  function ecrire(v) { try { window.localStorage.setItem('mm-audio', v); } catch (e) { /* stockage indisponible */ } }
  function valide(v) { return CHOIX.some(function (c) { return c[0] === v; }); }

  var val = params.get('audio') || lire() || 'pochettes';
  if (!valide(val)) val = 'pochettes';
  html.setAttribute('data-audio', val);
  if (params.get('audio')) ecrire(val);

  function construire() {
    if (!document.querySelector('.audio-corps')) return;
    var panneau = document.createElement('details');
    panneau.className = 'vp';
    panneau.open = true;
    var corps = '<summary>Variantes</summary><div class="vp-corps"><div class="vp-groupe"><span class="vp-titre">Mise en page audio</span><div class="vp-choix">';
    CHOIX.forEach(function (c) {
      corps += '<button type="button" data-val="' + c[0] + '" aria-pressed="' + (html.getAttribute('data-audio') === c[0]) + '">' + c[1] + '</button>';
    });
    corps += '</div></div><p class="vp-note">Maquette : ce panneau disparaîtra du site final.</p></div>';
    panneau.innerHTML = corps;
    panneau.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-val]');
      if (!b) return;
      html.setAttribute('data-audio', b.getAttribute('data-val'));
      ecrire(b.getAttribute('data-val'));
      panneau.querySelectorAll('button[data-val]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    });
    document.body.appendChild(panneau);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', construire);
  else construire();
})();
