# Modifier mon site : guide pas à pas

Tout se fait sur le site de GitHub, dans votre navigateur. Rien à installer.

## Le principe

Les textes, les livres, les dates et les liens de votre site sont rangés dans des fichiers texte, dans le dossier **`_data`** du dépôt. Vous modifiez un de ces fichiers, vous l'enregistrez, et le site se met à jour tout seul **en 1 à 2 minutes**.

Chaque enregistrement est publié directement. Relisez-vous avant d'enregistrer.

## Modifier un texte, étape par étape

1. Ouvrez la page du dépôt sur github.com (connectée avec votre compte GitHub).
2. Cliquez sur le dossier **`_data`**, puis sur le fichier voulu (voir « Où est quoi » plus bas).
3. Cliquez sur le **crayon** en haut à droite du fichier (« Edit this file »).
4. Modifiez le texte.
5. Cliquez sur le bouton vert **« Commit changes… »**. Dans la fenêtre, écrivez en une ligne ce que vous avez changé (ex. « Ajout du salon de Rouen »), laissez **« Commit directly to the main branch »** coché, puis cliquez sur **« Commit changes »**.
6. Attendez 2 minutes, puis rechargez votre site (Ctrl + F5 sur ordinateur).

En haut de chaque fichier, quelques lignes commençant par `#` expliquent les champs. Ces lignes ne s'affichent pas sur le site.

## Les 5 règles d'écriture

Ces fichiers ont une syntaxe précise. Une seule erreur bloque la mise à jour (le site reste alors sur l'ancienne version, rien ne casse).

1. **Les espaces en début de ligne comptent.** Gardez exactement le même retrait que la ligne du dessus ou que les blocs voisins. Utilisez des espaces, jamais la touche Tab.
2. **Les textes sont entre guillemets droits** : `titre: "Mon nouveau roman"`. Dans un texte, n'utilisez pas de guillemets droits `"` : prenez les guillemets français « » ou l'apostrophe, qui ne posent aucun problème.
3. **Ne supprimez jamais le nom du champ ni les deux-points** : `lieu: "Rouen"`, pas `Rouen`.
4. **Les éléments d'une liste commencent par un tiret** aligné sur ceux du dessus : `- "Premier paragraphe"`. Pour ajouter un élément, le plus sûr est de copier un élément existant, de le coller juste en dessous, puis de changer ses textes.
5. **Les dates s'écrivent `"AAAA-MM-JJ"`**, entre guillemets : `"2027-03-20"` pour le 20 mars 2027.

Un champ vide s'écrit `""`. Exemple : `lien: ""`.

## Où est quoi

| Pour modifier… | Fichier dans `_data` |
|---|---|
| Un livre : titre, couverture, résumé, liens d'achat, premiers chapitres, version audio | `livres.yml` |
| Les livres mis en avant sur l'accueil | `nouveautes.yml` |
| Les textes de l'accueil | `accueil.yml` |
| Les pages Feel good et Thrillers : textes, séries | `romans.yml` |
| La page En audio : textes, la voix | `audio.yml` |
| Dédicaces et salons, articles de presse | `rencontres.yml` |
| Conférences et leurs rencontres | `conferences.yml` |
| À propos, prix et agences | `a_propos.yml` |
| Mes romans à l'écran | `ecran.yml` |
| Contact | `contact.yml` |
| Témoignages de lectrices | `temoignages.yml` |
| Email, réseaux sociaux, newsletter, page « introuvable » | `site.yml` |
| Mentions légales, confidentialité | `legal.yml` |
| Menu, pied de page, textes des boutons | `textes.yml` |

## Les tâches courantes

### Ajouter une dédicace ou un salon
`rencontres.yml`, partie `evenements:`. Copiez une ligne existante, collez-la en dessous et changez : `quand` (la date affichée, ex. « 20-21 mars 2027 »), `debut` et `fin` (premier et dernier jour, `"AAAA-MM-JJ"`), `titre`, `lieu`, et `lien` (site de l'organisateur, ou `""`). La prochaine date s'affiche en grand avec « Dans X jours ». Une fois le dernier jour passé, elle disparaît toute seule.

### Ajouter une rencontre à la page Conférences
`conferences.yml`, partie `liste:`. Copiez une ligne et changez `date` (date exacte `"AAAA-MM-JJ"`, ou le dernier jour du mois si elle n'est pas fixée), `quand` (ex. « Mars 2027 »), `lieu` et `sujet`. Elle passe seule de « À venir » à « Passées ».

### Changer les nouveautés de l'accueil
`nouveautes.yml`. Chaque nouveauté désigne un livre par son identifiant (`livre: l-enfant-du-canal`, le même que le champ `id` du livre dans `livres.yml`). Changez l'étiquette (`badge`), la phrase (`texte_court`), le texte du bouton et son lien (`lien: "/thrillers/#l-enfant-du-canal"`, ou `lien: "newsletter"`).

Si la carte de l'accueil n'a ni titre ni couverture, l'identifiant est mal écrit.

### Ajouter un livre
1. Envoyez la couverture (voir « Ajouter une image » plus bas) dans `assets/img/livres`.
2. Dans `livres.yml`, copiez le bloc entier d'un livre du même genre (de `- id:` jusqu'au livre suivant), collez-le au bon endroit, puis changez :
   - `id` : un mot unique, sans accent ni espace (ex. `mon-nouveau-livre`). Il sert d'adresse : `/thrillers/#mon-nouveau-livre`.
   - `titre`, `tome`, `statut` (`paru` ou `a-paraitre`), `image` (le nom du fichier de la couverture), `accroche`…
   - `groupe` : la série où il apparaît (`manon`, `comedies`, `cassandre`, `enquetes`, `autres-thrillers`).
   - `liens` : un bouton par lien d'achat. Un lien vide (`url: ""`) n'affiche pas de bouton.
3. Quand un livre « à paraître » sort : passez `statut` sur `paru` et ajoutez ses liens d'achat.

### Ajouter un lien d'achat (Amazon, Kobo, Audible…)
`livres.yml` > le livre > `liens:`. Collez l'adresse entre les guillemets de `url`. Le bouton apparaît dès que l'adresse n'est plus vide.

### Publier les premiers chapitres
1. Envoyez le PDF dans `assets/chapitres` (voir « Ajouter une image », c'est la même méthode).
2. Dans `livres.yml` > le livre : `extrait: "/assets/chapitres/nom-du-fichier.pdf"`.

Le bouton « Lire les 3 premiers chapitres » apparaît alors et ouvre le PDF. Sans PDF, pas de bouton. Pour un autre texte de bouton : `extrait_libelle: "Lire les premiers chapitres"`.

### Version audio d'un livre
`livres.yml` > le livre > partie `audio:` (copiez-la depuis un autre livre si besoin) : `visuel` (fichier dans `assets/img/audio`), `tome` (texte au-dessus du titre), `message` (ex. « Disponible dès décembre 2026 ») et `url` (le lien Audible). Sans lien, le bouton devient « Me prévenir de la sortie ». Le livre apparaît sur la page En audio dès qu'il a cette partie.

Le bouton « Audio - me prévenir » des pages romans : `audio_bientot: true` sur le livre. Retirez la ligne quand le lien Audible existe.

### Ajouter un article de presse
1. Envoyez deux images dans `assets/img/presse` : une vignette (environ 600 px de large) et la coupure en grand.
2. `rencontres.yml` > `articles:` : copiez un article et changez `media`, `date`, `titre`, `citation`, `image` (la vignette), `image_complete` (la coupure en grand) et `lien` (version web, ou `""`).

### Ajouter un témoignage
`temoignages.yml` : copiez un témoignage, changez `texte` (sans guillemets autour de la citation), `auteur`, et `univers` (`accueil`, `thriller` ou `feelgood` : la page où il s'affiche).

### Style de Noël (rouge et doré)
`livres.yml` et `nouveautes.yml` : `style: noel` sur le livre et sur la nouveauté. Après les fêtes, remplacez par `style: ""`.

### Prix, agences, Instagram (page À propos)
`a_propos.yml` > `distinctions:`. Pour un nouveau prix, copiez un élément de `prix:` (emoji, texte, lien facultatif).

### Brancher la newsletter
`site.yml` > `newsletter:` > `formulaire_url` : collez l'adresse du formulaire d'inscription de votre outil d'emailing. Tant qu'elle est vide, les boutons ouvrent un email.

### Mentions légales
`legal.yml` : remplacez chaque `[à compléter : …]`, puis passez `provisoire: true` à `provisoire: false` pour retirer le bandeau « Texte provisoire ».

### Ajouter une série
`romans.yml` > `series:` de la page (feel good ou thriller) : copiez une série et changez `groupe` (un mot sans accent ni espace), `ancre`, `menu` (texte du sommaire), `titre` et `presentation` (`saga`, `duo` ou `cartes`). Donnez ensuite ce même `groupe` aux livres de la série dans `livres.yml`.

## Ajouter une image ou un PDF

1. Préparez le fichier : **nom sans accent ni espace** (ex. `salon-rouen.jpg`), au format JPG. Taille conseillée : 700 px de large pour une couverture, 1000 px pour une photo, moins de 300 Ko.
2. Sur GitHub, ouvrez le dossier (`assets/img/livres`, `assets/img/photos`, `assets/img/presse`, `assets/img/audio` ou `assets/chapitres`).
3. Bouton **« Add file »** > **« Upload files »**, glissez le fichier, puis **« Commit changes »**.
4. Écrivez le nom du fichier dans le champ concerné (`image`, `photo`, `visuel`…).

Pour remplacer une image, envoyez un fichier portant exactement le même nom.

Après un ajout d'images, prévenez Arthur à l'occasion : il met à jour leurs dimensions (`outils/images.py`), pour que les pages ne « sautent » pas au chargement. Le site fonctionne très bien sans.

## Le site ne s'est pas mis à jour ?

1. Attendez 2 minutes et rechargez la page avec **Ctrl + F5**.
2. Sur GitHub, ouvrez l'onglet **« Actions »** du dépôt. La dernière ligne porte une coche verte (publié), un rond orange (en cours) ou une **croix rouge** (bloqué). GitHub vous envoie aussi un email « Run failed » en cas de blocage.
3. Croix rouge : cliquez sur la ligne, puis sur **« build »**. Le message d'erreur donne le fichier et la ligne en cause (ex. `_data/rencontres.yml` … `line 42`).
4. Ouvrez ce fichier, allez à cette ligne (et à celle du dessus) et vérifiez les 5 règles d'écriture : un retrait décalé, un guillemet oublié ou en trop, des deux-points supprimés. Corrigez et enregistrez : le site se publie à nouveau.

Pour revenir à la version d'avant : ouvrez le fichier, cliquez sur **« History »**, ouvrez la modification précédente, affichez le fichier complet, copiez tout son contenu, puis collez-le à la place du contenu actuel avec le crayon.

Dans le doute, contactez Arthur.

## À ne pas faire

Ne modifiez que les fichiers de `_data`, `_extraits`, `assets/img` et `assets/chapitres`. Les autres fichiers sont la mécanique du site.
