# Règles : site Mélodie Miller

Stack : Jekyll + GitHub Pages, HTML statique, CSS modulaire, JS vanilla. Pas de npm, bundler JS ni framework.

## Règles
- Aucun texte « métier » dans les gabarits ni dans les pages : tout ce que Mélodie modifie vit dans `_data/*.yml` ou `_extraits/`. Textes communs (menu, pied de page, boutons des livres, libellés d'accessibilité, agenda) : `_data/textes.yml`. Textes propres à une page : le fichier `_data` de la page.
- Pas de CMS : Mélodie modifie les fichiers `_data` dans l'éditeur web de GitHub (voir `GUIDE-MELODIE.md`). Garder les commentaires en tête de chaque fichier `_data` à jour, ils lui servent de mode d'emploi.
- Les listes dans `_data` sont sous une clé (`livres:`, `nouveautes:`, `temoignages:`), pas à la racine.
- Couleurs et polices uniquement via les variables de `assets/css/base.css`. Les univers se choisissent avec `data-univers` (portail, conference, thriller, feelgood), sur la page ou sur une carte.
- En Liquid, tester un champ facultatif avec `{% if x and x != "" %}` (jamais `!= blank`, qui ne fonctionne pas).
- Un nouveau fichier CSS doit être référencé dans `_layouts/default.html`.
- Adresses internes : toujours avec le filtre `relative_url`, car `outils/maquette.py` les réécrit pour la maquette zip.
- Tester 320, 768 et 1280 px avant toute modif CSS.
- Ne pas toucher `_config.yml` sans le signaler.
- Textes pleine largeur : classe `.texte-flux` (une colonne, texte agrandi). Carrousels : `_includes/carrousel.html`. Effets de défilement : `assets/js/animations.js` (jamais de classe `.apparait` sur une `.photo`, elle écraserait l'inclinaison).
- Chargement par page : CSS/JS de carrousel, audio, écran et presse ne sont chargés que si la page le demande dans son en-tête (`carrousel`, `audio`, `ecran`, `presse`) : voir `_layouts/default.html`. Nouvelle page qui en a besoin : ajouter le réglage.
- Polices : hébergées dans `assets/polices/` (fichiers + `polices.css`), jamais chargées depuis un service tiers. Nouvelle police ou nouvelle graisse : ajouter le fichier et sa règle `@font-face`.
- Mentions légales et confidentialité : textes dans `_data/legal.yml`. Image de partage et icône iPhone : `python outils/partage.py`.
- Séries des pages Feel good et Thrillers : listes `series:` de `_data/romans.yml` (rubriques et sommaire collant, via `_includes/serie.html` et `_includes/sommaire.html`). Les livres s'y rattachent par leur champ `groupe`.
- Livres audio : partie `audio:` du livre dans `_data/livres.yml` ; `_data/audio.yml` ne garde que les textes de la page.
- Boutons d'un livre : un seul endroit, `_includes/boutons-livre.html` (ordre acheter · chapitres · audio).
- Rencontres des conférences : champ `date` obligatoire (classement À venir / Passées).
