(function () {
  var bouton = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu');
  if (!bouton || !menu) return;
  bouton.addEventListener('click', function () {
    var ouvert = menu.classList.toggle('ouvert');
    bouton.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
  });
})();
