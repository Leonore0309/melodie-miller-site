/* Maquette : panneau « Variantes » pour passer de l'accueil A à l'accueil B. */
(function () {
  var script = document.currentScript;
  var racine = script ? script.getAttribute('src').replace('assets/js/variantes.js', '') : '/';

  function construire() {
    var accueil = document.body.getAttribute('data-accueil');
    var panneau = document.createElement('details');
    panneau.className = 'vp';
    panneau.innerHTML = '<summary>Variantes</summary><div class="vp-corps">' +
      '<div class="vp-groupe"><span class="vp-titre">Page d\'accueil</span><div class="vp-choix">' +
      '<a class="vp-lien" href="' + racine + 'index.html"' + (accueil === 'a' ? ' aria-current="page"' : '') + '>Version A</a>' +
      '<a class="vp-lien" href="' + racine + 'version-b/index.html"' + (accueil === 'b' ? ' aria-current="page"' : '') + '>Version B</a>' +
      '</div></div><p class="vp-note">Maquette : ce panneau disparaîtra du site final.</p></div>';
    document.body.appendChild(panneau);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', construire);
  else construire();
})();
