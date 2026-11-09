"""Fabrique une maquette du site qui s'ouvre en double-cliquant sur index.html,
sur n'importe quel ordinateur, sans serveur ni installation.

Usage (depuis le dossier du site) :
    python outils/maquette.py            # construit le site puis crée dist/maquette-melodie-miller.zip
    python outils/maquette.py --sans-build   # réutilise le dossier _site existant

Le script ne dépend d'aucune bibliothèque externe. Il suppose que Jekyll est installé
(voir README.md) : il lance « bundle exec jekyll build ».
"""
import os
import posixpath
import re
import shutil
import subprocess
import sys
import zipfile

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(RACINE, "_site")
DIST = os.path.join(RACINE, "dist")
DOSSIER = os.path.join(DIST, "maquette-melodie-miller")
ZIP = os.path.join(DIST, "maquette-melodie-miller.zip")

# href="/chemin/#ancre" ou src="/chemin/image.jpg" (mais pas href="//domaine/...")
MOTIF = re.compile(r'\b(href|src)="(/(?!/)[^"#?]*)(\?[^"#]*)?(#[^"]*)?"')

LISEZ_MOI = """MAQUETTE DU SITE DE MÉLODIE MILLER
==================================

1. Décompressez ce dossier (clic droit > Extraire tout).
2. Double-cliquez sur « index.html » : le site s'ouvre dans votre navigateur.

- Les polices (Google Fonts) se chargent si vous êtes connecté à Internet.
- Le menu « À l'écran » présente les adaptations possibles (droits : Literary Image).
- Les cadres pointillés « couverture à venir » attendent les fichiers manquants.
- Les textes marqués « provisoire » sont à confirmer.
"""


def reecrire_html(chemin_fichier, texte):
    """Transforme les adresses absolues (/x/) en adresses relatives qui marchent en file://."""
    dossier = posixpath.dirname(os.path.relpath(chemin_fichier, DOSSIER).replace(os.sep, "/"))

    def remplacer(m):
        attribut, chemin, requete, ancre = m.group(1), m.group(2), m.group(3) or "", m.group(4) or ""
        cible = chemin.lstrip("/")
        if chemin.endswith("/"):
            cible = posixpath.join(cible, "index.html")
        rel = posixpath.relpath(cible or "index.html", dossier or ".")
        return f'{attribut}="{rel}{requete}{ancre}"'

    return MOTIF.sub(remplacer, texte)


def verifier(dossier):
    """Vérifie qu'aucune adresse locale n'est absolue et que chaque lien relatif existe."""
    erreurs = []
    motif = re.compile(r'\b(?:href|src)="([^"]*)"')
    for base, _, fichiers in os.walk(dossier):
        for nom in fichiers:
            if not nom.endswith(".html"):
                continue
            chemin = os.path.join(base, nom)
            with open(chemin, encoding="utf-8") as f:
                for lien in motif.findall(f.read()):
                    if re.match(r"^(https?:|mailto:|tel:|data:|#|//)", lien) or lien == "":
                        continue
                    if lien.startswith("/"):
                        erreurs.append(f"{os.path.relpath(chemin, dossier)}: adresse absolue {lien}")
                        continue
                    cible = os.path.normpath(os.path.join(base, re.split(r"[?#]", lien)[0]))
                    if not os.path.exists(cible):
                        erreurs.append(f"{os.path.relpath(chemin, dossier)}: introuvable {lien}")
    return erreurs


def main():
    if "--sans-build" not in sys.argv:
        print("Construction du site avec Jekyll...")
        resultat = subprocess.run(["bundle", "exec", "jekyll", "build", "--baseurl", ""], cwd=RACINE, shell=(os.name == "nt"))
        if resultat.returncode != 0:
            sys.exit("Échec de « jekyll build » (voir README.md pour l'installation).")
    if not os.path.isdir(SITE):
        sys.exit("Dossier _site introuvable : lancez d'abord jekyll build.")

    if os.path.isdir(DOSSIER):
        shutil.rmtree(DOSSIER)
    os.makedirs(DIST, exist_ok=True)
    shutil.copytree(SITE, DOSSIER)

    for base, _, fichiers in os.walk(DOSSIER):
        for nom in fichiers:
            if nom.endswith(".html"):
                chemin = os.path.join(base, nom)
                with open(chemin, encoding="utf-8") as f:
                    texte = f.read()
                with open(chemin, "w", encoding="utf-8", newline="\n") as f:
                    f.write(reecrire_html(chemin, texte))

    for inutile in ("sitemap.xml", "robots.txt"):
        p = os.path.join(DOSSIER, inutile)
        if os.path.exists(p):
            os.remove(p)
    with open(os.path.join(DOSSIER, "LISEZ-MOI.txt"), "w", encoding="utf-8", newline="\r\n") as f:
        f.write(LISEZ_MOI)

    erreurs = verifier(DOSSIER)
    if erreurs:
        print("Problèmes de liens :")
        for e in erreurs:
            print("  -", e)
        sys.exit(1)

    if os.path.exists(ZIP):
        os.remove(ZIP)
    with zipfile.ZipFile(ZIP, "w", zipfile.ZIP_DEFLATED) as z:
        for base, _, fichiers in os.walk(DOSSIER):
            for nom in fichiers:
                chemin = os.path.join(base, nom)
                z.write(chemin, os.path.join("maquette-melodie-miller", os.path.relpath(chemin, DOSSIER)))
    taille = os.path.getsize(ZIP) / 1024 / 1024
    print(f"OK : {ZIP} ({taille:.1f} Mo)")
    print("Liens vérifiés : aucune adresse absolue, tous les fichiers existent.")


if __name__ == "__main__":
    main()
