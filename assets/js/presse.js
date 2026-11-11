/* Presse : « Voir l'article » ouvre la coupure en grand dans une fenêtre (dialog natif).
   Sans JavaScript, le bouton est un simple lien vers l'image. */
(function () {
  var dialogue = document.getElementById('presse-dialog');
  var grand = document.getElementById('presse-grand');
  if (!dialogue || !grand || typeof dialogue.showModal !== 'function') return;

  function ouvrir(url, titre) {
    grand.src = url;
    grand.alt = (dialogue.getAttribute('aria-label') || '') + ' : ' + (titre || '');
    dialogue.showModal();
  }

  Array.prototype.forEach.call(document.querySelectorAll('.presse-carte'), function (carte) {
    var vignette = carte.querySelector('.presse-vignette');
    var lien = carte.querySelector('[data-ouvrir]');
    var titre = vignette ? vignette.getAttribute('data-titre') : '';
    if (vignette) vignette.addEventListener('click', function () { ouvrir(vignette.getAttribute('data-grand'), titre); });
    if (lien) lien.addEventListener('click', function (e) { e.preventDefault(); ouvrir(lien.getAttribute('href'), titre); });
  });

  // Clic en dehors de l'image : fermer
  dialogue.addEventListener('click', function (e) { if (e.target === dialogue) dialogue.close(); });
})();
