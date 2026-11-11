# Site de Mélodie Miller (guide technique)

Site statique Jekyll, publié par GitHub Pages. Deux univers de romans (feel good, thrillers), une page conférences (Valérie Pierson / Mélodie Miller), des rencontres et un contact.

## Voir le site sur son ordinateur
1. Installer Ruby 3.3 avec l'outil RubyInstaller (https://rubyinstaller.org, version « with Devkit »). Sans droits administrateur : installation « pour l'utilisateur courant ».
2. Dans ce dossier : `bundle install` puis `bundle exec jekyll serve`, puis ouvrir http://localhost:4000

Si un antivirus (Avast…) bloque `bundle install` avec une erreur de certificat SSL, exporter le certificat racine de l'antivirus au format PEM, l'ajouter à une copie du fichier `cert.pem` de Ruby, puis définir `SSL_CERT_FILE` vers ce fichier pour la session. Ne pas désactiver la vérification SSL.

Le `Gemfile` utilise `jekyll` seul (pas `github-pages`) pour éviter la compilation de gems natifs. Le fichier `Gemfile.lock` fixe les versions exactes : la publication en ligne (GitHub Actions, sous Linux) utilise les mêmes que l'ordinateur. Après un `bundle update`, garder la plateforme Linux dans ce fichier (`bundle lock --add-platform x86_64-linux`), sinon la publication échoue.

Mises à jour : Dependabot propose chaque mois, par pull request, les nouvelles versions des gems et des actions GitHub (`.github/dependabot.yml`). Les actions du fichier `.github/workflows/pages.yml` sont fixées à un commit précis : ne les modifier que par ces propositions.

## Maquette à envoyer à un autre ordinateur
`python outils/maquette.py` construit le site et crée `dist/maquette-melodie-miller.zip`. Il suffit de décompresser et de double-cliquer sur `index.html`. Le script réécrit les adresses pour qu'elles marchent sans serveur, puis vérifie tous les liens.

Les choix de Mélodie sont fixés : nouveautés en une phrase, En audio en playlist, bandeau de distinctions sur À propos.

## Où est quoi
| Pour modifier… | Fichier |
|---|---|
| Livres (titre, couverture, liens, extrait, statut) | `_data/livres.yml` |
| Nouveautés de l'accueil | `_data/nouveautes.yml` |
| Textes de l'accueil A | `_data/accueil.yml` |
| Mes romans à l'écran (adaptations, droits) | `_data/ecran.yml` |
| Page En audio (livres audio, voix, liens Audible) | `_data/audio.yml` |
| Coupures de presse | `_data/rencontres.yml` (section `presse`), images dans `assets/img/presse/` |
| Textes des pages romans | `_data/romans.yml` |
| À propos | `_data/a_propos.yml` |
| Rencontres, dates, presse | `_data/rencontres.yml` |
| Conférences | `_data/conferences.yml` |
| Contact | `_data/contact.yml` |
| Témoignages | `_data/temoignages.yml` |
| Email, réseaux, newsletter, page 404 | `_data/site.yml` |
| Mentions légales, confidentialité | `_data/legal.yml` |
| Image de partage (aperçu des liens), icône | `python outils/partage.py` (refait `assets/img/partage.jpg`) |
| Les 3 premiers chapitres | PDF dans `assets/chapitres/`, champ `extrait` du livre (ou pages `_extraits/*.md`) |
| Couleurs et polices | `assets/css/base.css` (variables en haut) |
| Photos et couvertures | `assets/img/photos/`, `assets/img/livres/` |

- Un livre « à paraître » (`statut: a-paraitre`) reçoit un badge et un bouton « Être informé de sa sortie ».
- Les dates passées de `rencontres.yml` disparaissent seules (au build et à l'affichage). La prochaine date est mise en vedette avec un compte à rebours (`debut` et `fin` au format AAAA-MM-JJ).
- Carrousels de couvertures (Manon, Cassandre, comédies) : `_includes/carrousel.html` + `assets/js/carrousel.js`. Défilement toutes les 4 s, pause au survol, désactivé si le visiteur demande moins d'animations.
- Premiers chapitres : champ `extrait` du livre = `/assets/chapitres/<id>.pdf`, `/extraits/<nom>/` ou un lien externe. Vide : aucun bouton « premiers chapitres » sur ce livre. `extrait_libelle` change le texte du bouton.
- Bouton « Audio - me prévenir » : `audio_bientot: true` sur le livre (à retirer quand le lien Audible existe).
- Style de Noël : `style: noel` dans `livres.yml` et `nouveautes.yml` (badge rouge, boutons dorés), à vider après les fêtes.
- Conférences : chaque rencontre a une `date` (AAAA-MM-JJ) ; « À venir » en premier, puis « Passées » atténuées.
- Chargement par page (performances) : réglages `carrousel`, `audio`, `ecran`, `presse` dans l'en-tête de chaque page (voir `_layouts/default.html`).
- Polices : hébergées sur le site dans `assets/polices/` (aucun appel à Google). Le navigateur ne télécharge que celles que la page utilise.

## Mise en ligne sur le vrai domaine (liste de contrôle)
1. `_data/legal.yml` : remplacer tous les `[à compléter : …]`, puis `provisoire: false`.
2. `_data/site.yml` : renseigner `newsletter.formulaire_url` (adresse du formulaire d'inscription).
3. Droits : accord des titres de presse pour les coupures, accord des personnes sur la photo de l'atelier Kobo.
4. GitHub > Settings > Pages > Custom domain : saisir `melodiemiller.fr`, puis créer les enregistrements DNS chez le registrar et cocher « Enforce HTTPS ». Le site est publié par GitHub Actions : un fichier `CNAME` dans le dépôt serait ignoré.
5. `_config.yml` : `url: "https://melodiemiller.fr"`, `baseurl: ""`, `noindex: false`. Ce seul réglage `noindex` retire la balise noindex et ouvre `robots.txt` (avec l'adresse du sitemap).
6. Après publication : vérifier `https://melodiemiller.fr/robots.txt`, `/sitemap.xml`, une adresse inexistante (page 404) et l'aperçu d'un lien partagé.

Un bouton dont le lien est vide n'est pas affiché (Kobo, précommande, Audible…). Les articles de presse sont des reproductions : vérifier les droits de reproduction avant la mise en ligne réelle.

## À fournir
Couvertures : *Un chum pour Noël*, *Les disparues de la crypte*, *L'Enfant du canal*, Manon T6 · liens d'achat : *Un chum pour Noël* sur Amazon.ca (facultatif), Manon T6 · outil newsletter et lien d'inscription · références presse · accord des deux autres personnes sur la photo de l'atelier Kobo · extraits d'autres livres.
