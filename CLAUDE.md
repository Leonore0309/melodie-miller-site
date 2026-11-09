# Règles : site Mélodie Miller

Stack : Jekyll + GitHub Pages, HTML statique, CSS modulaire, JS vanilla. Pas de npm, bundler JS ni framework.

## Règles
- Aucun texte « métier » dans les gabarits ni dans les pages : tout ce que Mélodie modifie vit dans `_data/*.yml` ou `_extraits/`.
- Si une clé de `_data` change, mettre à jour `.pages.yml` (sinon le CMS casse).
- Les listes dans `_data` sont sous une clé (`livres:`, `nouveautes:`, `temoignages:`), pas à la racine.
- Couleurs et polices uniquement via les variables de `assets/css/base.css`. Les univers se choisissent avec `data-univers` (portail, conference, thriller, feelgood), sur la page ou sur une carte.
- En Liquid, tester un champ facultatif avec `{% if x and x != "" %}` (jamais `!= blank`, qui ne fonctionne pas).
- Un nouveau fichier CSS doit être référencé dans `_layouts/default.html`.
- Adresses internes : toujours avec le filtre `relative_url`, car `outils/maquette.py` les réécrit pour la maquette zip.
- Tester 320, 768 et 1280 px avant toute modif CSS.
- Ne pas toucher `_config.yml` sans le signaler.
- Textes pleine largeur : classe `.texte-flux` (2 colonnes, réglable par le panneau Variantes). Carrousels : `_includes/carrousel.html`. Effets de défilement : `assets/js/animations.js` (jamais de classe `.apparait` sur une `.photo`, elle écraserait l'inclinaison).
- Chargement par page : CSS/JS de carrousel, audio, écran, presse et polices ne sont chargés que si la page le demande dans son en-tête (`carrousel`, `audio`, `ecran`, `presse`, `polices`) : voir `_layouts/default.html`. Nouvelle page qui en a besoin : ajouter le réglage.
- Boutons d'un livre : un seul endroit, `_includes/boutons-livre.html` (ordre acheter · chapitres · audio).
- Rencontres des conférences : champ `date` obligatoire (classement À venir / Passées).
