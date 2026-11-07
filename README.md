# Site de Mélodie Miller (guide technique)

Site statique Jekyll, publié par GitHub Pages. Deux univers de romans (feel good, thrillers), une page conférences (Valérie Pierson / Mélodie Miller), des rencontres et un contact.

## Voir le site sur son ordinateur
1. Installer Ruby 3.3 avec l'outil RubyInstaller (https://rubyinstaller.org, version « with Devkit »). Sans droits administrateur : installation « pour l'utilisateur courant ».
2. Dans ce dossier : `bundle install` puis `bundle exec jekyll serve`, puis ouvrir http://localhost:4000

Si un antivirus (Avast…) bloque `bundle install` avec une erreur de certificat SSL, exporter le certificat racine de l'antivirus au format PEM, l'ajouter à une copie du fichier `cert.pem` de Ruby, puis définir `SSL_CERT_FILE` vers ce fichier pour la session. Ne pas désactiver la vérification SSL.

Le `Gemfile` utilise `jekyll` seul (pas `github-pages`) pour éviter la compilation de gems natifs. En ligne, GitHub Pages utilise sa propre version : le site n'emploie que des fonctions de base.

## Maquette à envoyer à un autre ordinateur
`python outils/maquette.py` construit le site et crée `dist/maquette-melodie-miller.zip`. Il suffit de décompresser et de double-cliquer sur `index.html`. Le script réécrit les adresses pour qu'elles marchent sans serveur, puis vérifie tous les liens.

Le panneau « Variantes » (bas de page à droite) permet de passer de l'accueil A à l'accueil B (`/version-b/`) et de comparer 3 largeurs de texte (`?texte=colonnes|large|grand`). Pour le retirer : `maquette: false` dans `_config.yml`, puis figer le choix dans `.texte-flux` (`assets/css/base.css`). Une fois l'accueil retenu, remplacer `index.html` par la version choisie et supprimer l'autre.

## Où est quoi
| Pour modifier… | Fichier |
|---|---|
| Livres (titre, couverture, liens, extrait, statut) | `_data/livres.yml` |
| Nouveautés de l'accueil | `_data/nouveautes.yml` |
| Textes de l'accueil A | `_data/accueil.yml` |
| Accueil B (façon Coben, textes courts) | `_data/accueil_b.yml` |
| Mes romans à l'écran (adaptations, droits) | `_data/ecran.yml` |
| Textes des pages romans | `_data/romans.yml` |
| À propos | `_data/a_propos.yml` |
| Rencontres, dates, presse | `_data/rencontres.yml` |
| Conférences | `_data/conferences.yml` |
| Contact | `_data/contact.yml` |
| Témoignages | `_data/temoignages.yml` |
| Email, réseaux, newsletter | `_data/site.yml` |
| Les 3 premiers chapitres | `_extraits/*.md` |
| Couleurs et polices | `assets/css/base.css` (variables en haut) |
| Photos et couvertures | `assets/img/photos/`, `assets/img/livres/` |

- Un livre « à paraître » (`statut: a-paraitre`) reçoit un badge et un bouton « Être informé de sa sortie ».
- Les dates passées de `rencontres.yml` disparaissent seules (au build et à l'affichage). La prochaine date est mise en vedette avec un compte à rebours (`debut` et `fin` au format AAAA-MM-JJ).
- Carrousels de couvertures (Manon, Cassandre, comédies) : `_includes/carrousel.html` + `assets/js/carrousel.js`. Défilement toutes les 4 s, pause au survol, désactivé si le visiteur demande moins d'animations.
- Extrait : mettre `/extraits/<nom-du-fichier>/` (page du site) ou un lien externe dans le champ `extrait` du livre.

## À faire plus tard
- **Mise en ligne** : créer un dépôt GitHub, pousser ce dossier, activer Settings > Pages (branche main).
- **Domaine** : fichier `CNAME` contenant `melodiemiller.fr`, puis les enregistrements DNS chez le registrar.
- **Mélodie** : lui transférer le dépôt ou l'ajouter comme collaboratrice, puis connecter https://app.pagescms.org. Le fichier `.pages.yml` définit les formulaires (toutes ses clés ont été vérifiées contre `_data`, mais le test réel n'est possible qu'une fois le dépôt en ligne).
- Passer `maquette: false` avant la mise en ligne.
- Mentions légales et confidentialité : textes provisoires à compléter.

## À fournir
Couvertures : *Un chum pour Noël*, *Les disparues de la crypte*, *L'Enfant du canal*, Manon T6 · liens d'achat : *Un chum pour Noël* (Amazon.fr et .ca), Manon T6 · outil newsletter et lien d'inscription · références presse · accord des deux autres personnes sur la photo de l'atelier Kobo · extraits d'autres livres.
