"""Fabrique l'image de partage (aperçu des liens sur les réseaux sociaux et les messageries)
et l'icône pour iPhone.

Usage (depuis le dossier du site) :
    python outils/partage.py

À relancer si le portrait de l'accueil, le nom ou l'accroche changent.
Dépend de la bibliothèque Pillow (pip install pillow). Les textes sont lus dans _data/site.yml
et _data/accueil.yml, sans autre dépendance.
"""
import os
import re

from PIL import Image, ImageDraw, ImageFont

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POLICES = os.path.join(RACINE, "assets", "polices")
FOND, ENCRE = "#f6f3ee", "#1c1c1c"  # --portail-bg et --portail-fg de base.css
L, H = 1200, 630


def valeur(fichier, cle):
    """Lit une valeur simple « cle: "texte" » dans un fichier de _data."""
    with open(os.path.join(RACINE, "_data", fichier), encoding="utf-8") as f:
        m = re.search(r'^\s*%s:\s*"(.*)"\s*$' % re.escape(cle), f.read(), re.M)
    if not m:
        raise SystemExit(f"Clé « {cle} » introuvable dans _data/{fichier}")
    return m.group(1)


def police(fichier, taille, graisse):
    p = ImageFont.truetype(os.path.join(POLICES, fichier), taille)
    try:
        p.set_variation_by_axes([graisse])
    except OSError:
        pass  # police non variable
    return p


def couper(dessin, texte, p, largeur):
    lignes, ligne = [], ""
    for mot in texte.split():
        essai = (ligne + " " + mot).strip()
        if dessin.textlength(essai, font=p) <= largeur or not ligne:
            ligne = essai
        else:
            lignes.append(ligne)
            ligne = mot
    return lignes + [ligne]


def main():
    nom = valeur("site.yml", "nom")
    accroche = valeur("site.yml", "accroche")
    portrait = Image.open(os.path.join(RACINE, "assets", "img", "photos", valeur("accueil.yml", "photo"))).convert("RGB")

    image = Image.new("RGB", (L, H), FOND)
    cote = min(portrait.size)
    gauche, haut = (portrait.width - cote) // 2, (portrait.height - cote) // 2
    image.paste(portrait.crop((gauche, haut, gauche + cote, haut + cote)).resize((H, H), Image.LANCZOS), (0, 0))

    d = ImageDraw.Draw(image)
    x, largeur = H + 60, L - H - 120
    taille = 84
    p_nom = police("cormorant-garamond-normal-latin.woff2", taille, 700)
    while d.textlength(nom, font=p_nom) > largeur and taille > 40:  # le nom tient toujours dans la marge
        taille -= 2
        p_nom = police("cormorant-garamond-normal-latin.woff2", taille, 700)
    p_acc = police("cormorant-garamond-italic-latin.woff2", 40, 500)
    lignes = couper(d, accroche, p_acc, largeur)
    hauteur = 96 + 34 + len(lignes) * 50
    y = (H - hauteur) // 2
    d.text((x, y), nom, font=p_nom, fill=ENCRE)
    d.line((x, y + 112, x + 90, y + 112), fill=ENCRE, width=3)
    for i, ligne in enumerate(lignes):
        d.text((x, y + 130 + i * 50), ligne, font=p_acc, fill=ENCRE)
    sortie = os.path.join(RACINE, "assets", "img", "partage.jpg")
    image.save(sortie, quality=86, optimize=True)
    print("OK :", sortie, f"({os.path.getsize(sortie) // 1024} Ko)")

    # Icône iPhone : même monogramme que assets/img/favicon.svg
    icone = Image.new("RGB", (180, 180), ENCRE)
    di = ImageDraw.Draw(icone)
    p_m = police("cormorant-garamond-normal-latin.woff2", 150, 700)
    b = di.textbbox((0, 0), "M", font=p_m)
    di.text(((180 - (b[2] - b[0])) / 2 - b[0], (180 - (b[3] - b[1])) / 2 - b[1]), "M", font=p_m, fill=FOND)
    sortie = os.path.join(RACINE, "assets", "img", "apple-touch-icon.png")
    icone.save(sortie, optimize=True)
    print("OK :", sortie)


if __name__ == "__main__":
    main()
