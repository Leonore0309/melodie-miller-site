/* Menu mobile : ouverture par le bouton « Menu », fermeture par Échap (le focus revient sur le bouton). */
(function () {
  var bouton = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu');
  if (!bouton || !menu) return;
  function ouvrir(oui) {
    menu.classList.toggle('ouvert', oui);
    bouton.setAttribute('aria-expanded', oui ? 'true' : 'false');
  }
  bouton.addEventListener('click', function () { ouvrir(!menu.classList.contains('ouvert')); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('ouvert')) { ouvrir(false); bouton.focus(); }
  });
})();
