"""Images du site : dimensions et poids.

Usage (depuis le dossier du site) :
    python outils/images.py              # met à jour _data/images.yml (largeur et hauteur de chaque image)
    python outils/images.py --optimiser  # réduit d'abord les images trop grandes ou trop lourdes, puis met à jour

_data/images.yml permet aux pages d'annoncer la taille de chaque image (attributs width et height) :
la page ne « saute » plus pendant le chargement. Une image absente de ce fichier s'affiche normalement,
sans ces attributs. À relancer après l'ajout ou le remplacement d'images.

Dépend de la bibliothèque Pillow (pip install pillow).
"""
import io
import os
import sys

from PIL import Image, ImageOps

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(RACINE, "assets", "img")
DONNEES = os.path.join(RACINE, "_data", "images.yml")

# Largeur maximale utile par dossier (2 à 3 fois la plus grande taille d'affichage), qualité JPEG.
LIMITES = {
    "photos": (1000, 82),   # polaroïds : 430 px au plus à l'écran
    "presse": (1400, 82),   # coupures : vignettes 150 px, coupure en grand jusqu'à 1000 px
    "audio": (400, 85),     # pochettes : 84 px à l'écran
    "livres": (700, 85),    # couvertures : 300 px au plus à l'écran
}
GAIN_MINIMUM = 0.10  # on ne réécrit une image que si elle maigrit d'au moins 10 %


def optimiser(chemin, largeur_max, qualite):
    avant = os.path.getsize(chemin)
    with Image.open(chemin) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        if im.width > largeur_max:
            im = im.resize((largeur_max, round(im.height * largeur_max / im.width)), Image.LANCZOS)
        tampon = io.BytesIO()
        im.save(tampon, "JPEG", quality=qualite, optimize=True, progressive=True)
    if tampon.tell() <= avant * (1 - GAIN_MINIMUM):
        with open(chemin, "wb") as f:
            f.write(tampon.getvalue())
        return avant, tampon.tell()
    return None


def main():
    if "--optimiser" in sys.argv:
        for dossier, (largeur, qualite) in LIMITES.items():
            for nom in sorted(os.listdir(os.path.join(IMG, dossier))):
                if nom.lower().endswith((".jpg", ".jpeg")):
                    r = optimiser(os.path.join(IMG, dossier, nom), largeur, qualite)
                    if r:
                        print(f"  {dossier}/{nom} : {r[0] // 1024} Ko -> {r[1] // 1024} Ko")

    lignes = ["# Fichier produit par « python outils/images.py » : ne pas modifier à la main.",
              "# Largeur et hauteur de chaque image, pour les attributs width et height des pages."]
    for dossier in sorted(os.listdir(IMG)):
        chemin_dossier = os.path.join(IMG, dossier)
        if not os.path.isdir(chemin_dossier):
            continue
        for nom in sorted(os.listdir(chemin_dossier)):
            if nom.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
                with Image.open(os.path.join(chemin_dossier, nom)) as im:
                    lignes.append(f'"{dossier}/{nom}": [{im.width}, {im.height}]')
    with open(DONNEES, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lignes) + "\n")
    print(f"OK : {DONNEES} ({len(lignes) - 2} images)")


if __name__ == "__main__":
    main()
