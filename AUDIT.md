# Site audit and improvement plan

Audit date: 11 November 2026, on commit `53bdf20`.
Scope: security, code, architecture, ergonomics (visitor experience and owner editing).
Method: every template, include, script, stylesheet, data file, the CMS configuration (`.pages.yml`), the deploy workflow and `outils/maquette.py` were read. Images and PDFs were inspected for size and metadata. Nothing was tested in the live CMS or in a browser, so items marked "to confirm" need a real check.

This document changes nothing on the site. Each item of the plan states what a visitor would see change, so that no page is modified without that having been accepted first.

## 1. Summary

The site is sound: small (about 2,700 lines), consistently organised, content separated from templates, no inline scripts, a least-privilege deploy workflow, reduced-motion respected throughout, and no location data in the photos.

The main risks are not attacks. They are:

1. **The CMS configuration and the templates disagree in places.** Some edits Mélodie makes through Pages CMS are likely to break a page.
2. **Nothing checks an edit before it goes live.** Every save in the CMS commits to `main` and deploys.
3. **Launch blockers remain**: legal pages, newsletter sign-up, indexing switches, third-party fonts.

After those, the biggest gain for scalability is giving each book its own page, and the biggest gain for polish is in accessibility and image loading.

## 2. Findings

Severity: **High** = breaks a page or blocks launch · **Medium** = real cost or risk, not urgent · **Low** = tidy-up.

### 2.1 Owner editing

| # | Finding | Where | Severity |
|---|---|---|---|
| E1 | `distinctions.prix` is declared as a single object in the CMS, but the data is a list and the template loops over it. Saving that form is likely to damage the list. The guide tells Mélodie to click "+" in a list that the CMS does not offer. To confirm | `.pages.yml`, `_data/a_propos.yml`, `_includes/distinctions.html` | High |
| E2 | The book cover field is an image picker whose media output is `/assets/img/livres`, while templates add `/assets/img/livres/` in front of a bare file name. A cover chosen in the CMS will probably be saved with its full path and end up with a doubled address. To confirm | `.pages.yml`, `_includes/carte-livre.html`, `_includes/carrousel.html`, `_includes/nouveautes.html`, `a-l-ecran/index.html` | High |
| E3 | No validation and no preview. A wrong value either fails the build (the site silently stays on the old version) or publishes a broken page | `.github/workflows/pages.yml` | High |
| E4 | About 20 photo and cover fields are plain text ("nom du fichier"): upload first, then retype the file name exactly | `.pages.yml` | Medium |
| E5 | Dates are free text (`AAAA-MM-JJ`). `style`, `badge_style` and the book identifier in Nouveautés are free text too. A typo fails silently (a misspelt book id gives a card with no title and no cover) | `.pages.yml`, `_includes/nouveautes.html` | Medium |
| E6 | The guide says "choisissez ce PDF" but `extrait` is a text field where the path must be typed. `nouveautes.texte` is offered in the CMS and used nowhere | `GUIDE-MELODIE.md`, `.pages.yml` | Medium |
| E7 | Text still hard-coded in pages, against the project rule: menu labels, section-menu labels, "Cinéma & télévision", "Livres audio", "Romances", "Thrillers", "Les premiers chapitres", "Contacter Mélodie", both legal pages, and every page's SEO title and description | `_includes/header.html`, `*/index.html`, `_layouts/extrait.html` | Medium |
| E8 | The festive style must be switched on, then off, by hand in two places | `_data/livres.yml`, `_data/nouveautes.yml` | Low |
| E9 | Pages CMS probably rewrites a YAML file when saving it, which drops its comments, including the "# À fournir" notes. To confirm | `_data/livres.yml` (23 comment lines) | Low |

### 2.2 Architecture and scalability

| # | Finding | Where | Severity |
|---|---|---|---|
| A1 | All 17 books live in one 233-line list and exist only as anchors inside carousels and cards. There is no page per book: nothing to share, to index, or to link from a newsletter. The CMS shows them as one long form | `_data/livres.yml` | Medium |
| A2 | Series are hard-coded in three places: page templates, the sticky section menu, and the CMS options. A new saga needs a developer | `romances-feel-good/index.html`, `thrillers/index.html`, `.pages.yml` | Medium |
| A3 | Audio editions repeat the book's identity (id, title, volume) in a second file | `_data/audio.yml` | Low |
| A4 | `Gemfile.lock` is git-ignored, so each deploy resolves gem versions afresh: builds are not reproducible | `.gitignore`, `Gemfile` | Medium |
| A5 | No automated check of any kind. A link verifier already exists but only runs by hand when building the zip mock-up | `outils/maquette.py` (`verifier`) | Medium |
| A6 | 29 colour literals outside `base.css`, mostly the festive red and gold and the "bientôt" coral, against the variables rule | `assets/css/portail.css` and others | Low |
| A7 | Documentation drift: the README still says to create the repo and that GitHub Pages uses its own Jekyll (the workflow builds with Bundler); `.texte-flux` is "2 colonnes" in `CLAUDE.md` and "1 colonne" in `base.css`; leftover `accueil: a` variant flag; empty folder `assets/img/portrait/` | `README.md`, `CLAUDE.md`, `index.html` | Low |
| A8 | The example excerpt is published with placeholder text at `/extraits/exemple/`. Excerpt pages have no date, so each build stamps them with the build time and declares them as blog posts in their metadata | `_extraits/exemple.md` | Low |

### 2.3 Security and privacy

The attack surface is low: static files only, no form, no cookie, no third-party script, deploy permissions already minimal.

| # | Finding | Where | Severity |
|---|---|---|---|
| S1 | Fonts are loaded from Google on every page, which sends each visitor's IP address to Google. The privacy page itself lists this as unresolved | `_layouts/default.html` | High (launch) |
| S2 | Legal notice and privacy policy are placeholders. Both are mandatory in France before launch | `mentions-legales/index.html`, `confidentialite/index.html` | High (launch) |
| S3 | Account-level items to confirm: two-factor authentication on the GitHub accounts, Pages CMS installed on this repository only, branch protection on `main`, and who owns the repository and the domain in the long run (the repository is under a third-party account) | GitHub settings | Medium |
| S4 | Data values are written into HTML attributes unescaped (`alt`, `aria-label`, `href`), except on the press page. A double quote in a title breaks the markup. URL fields accept any scheme | `_includes/*.html` | Medium |
| S5 | No Content-Security-Policy and no referrer policy. A strict policy is feasible because there are no inline scripts and no `style` attributes | `_layouts/default.html` | Low |
| S6 | GitHub Actions are pinned by tag, not by commit; no Dependabot | `.github/workflows/pages.yml` | Low |
| S7 | The contact address is in clear text on every page (spam harvesting) and is a personal Gmail address | `_data/site.yml` | Low |
| S8 | Press clippings are reproductions and one photo shows third parties: reproduction and image rights to secure (already noted in the README) | `assets/img/presse/`, `assets/img/photos/atelier-kobo.jpg` | Medium |

Checked and fine: no EXIF or GPS data in the 38 images; the four PDFs carry only the author's pen name as metadata; external links opened in a new tab all carry `rel="noopener"`; no secret in the repository.

### 2.4 Visitor experience, accessibility, performance, SEO

| # | Finding | Where | Severity |
|---|---|---|---|
| U1 | The newsletter has no sign-up form (`formulaire_url` is empty). Every "Je m'inscris" and "Me prévenir" opens an email draft | `_data/site.yml`, `_includes/newsletter-lien.html` | High (launch) |
| U2 | For the 13 books without an excerpt, "Lire les 3 premiers chapitres" also opens that email draft: the button promises chapters and delivers a blank email | `_includes/boutons-livre.html` | High |
| U3 | Carousels advance every 4 s inside an `aria-live="polite"` region, so a screen reader announces each rotation, and there is no pause button (WCAG 2.2.2) | `_includes/carrousel.html`, `assets/js/carrousel.js` | Medium |
| U4 | Gold text `#b08d57` on white is about 3.1:1, under the 4.5:1 minimum. Past conference cards at 62% opacity are lower still | `assets/css/univers-conference.css` | Medium |
| U5 | Images have no `width`/`height`, so pages shift while loading. No responsive sizes or modern format: 700 px covers are served for 110 px slots. The home-page portrait is lazy-loaded although it is the main image above the fold. One press image weighs 624 KB | `_includes/photo.html`, `_includes/nouveautes.html`, `assets/img/presse/republique-77-succes.jpg` | Medium |
| U6 | The home page and the other "portail" pages load all seven font families | `_layouts/default.html` | Medium |
| U7 | Contact is `mailto:` only: a visitor without a configured mail client cannot write | `contact/index.html` | Medium |
| U8 | No favicon, no social sharing image, no 404 page, no structured data (Person, Book, Event) | site-wide | Medium |
| U9 | `robots.txt` is a static `Disallow: /`, separate from the `noindex` switch in `_config.yml`: easy to flip one and forget the other at launch | `robots.txt`, `_config.yml` | Medium |
| U10 | Menu: `aria-haspopup` on a plain link, no `aria-current` on the active page, Escape does not close the mobile menu | `_includes/header.html`, `assets/js/menu.js` | Low |
| U11 | Buy links open in the same tab while PDFs open in a new one, with no "(nouvel onglet)" hint | `_includes/boutons-livre.html` | Low |

## 3. Improvement plan

Size: **S** = under an hour · **M** = half a day · **L** = a day or more.

"None" in the last column means the built pages are meant to stay identical, and that is verified (see 3.7). Phases 0, 2 and 3 are designed to leave the pages untouched. The visible changes are in phases 1, 4 and 5, and each needs the owner's agreement before it is done.

### 3.1 Phase 0 — CMS correctness (first, about half a day)

**Status (11 November 2026): done, except the live CMS test.**
- `prix` is a list and is labelled "Prix et distinctions".
- Book covers go through `_includes/couverture-url.html`, which accepts a bare file name or a full path.
- Five CMS fields that no template reads were removed, along with their values: `nouveautes.texte`, `presse.provisoire`, `ecran.provisoire`, `audio.genre`, `audio.statut`.
- The guide is corrected, and the example excerpt has `published: false`.
- A before/after build comparison showed every page byte-identical, except `/extraits/exemple/`, which is gone.

Remaining:

| Item | Fixes | Size | Visible on the pages |
|---|---|---|---|
| Test every CMS form once on the live repository: open, save without change, check the commit diff; pick one cover through the image picker | E1, E2, E9 | M | None |

### 3.2 Phase 1 — Launch blockers

| Item | Fixes | Size | Visible on the pages |
|---|---|---|---|
| Write the legal notice and privacy policy | S2 | M | Text of those two pages replaced, "provisoire" label removed. Layout unchanged |
| Choose the newsletter tool and fill in the sign-up address | U1 | S | Same buttons, same look. They open the sign-up form instead of an email draft |
| Decide what "Lire les 3 premiers chapitres" does on a book without an excerpt | U2 | S | **Visible, owner's choice**: hide the button, or relabel it (for example "Recevoir les premiers chapitres"). Affects the thriller cards and the carousel links |
| Host the fonts on the site | S1 | M | Same fonts and weights, no intended change. Checked by before/after screenshots |
| Favicon and social sharing image | U8 | S | Browser tab icon and link previews only. Page content unchanged |
| 404 page | U8 | S | New page, shown only on a wrong address |
| Generate `robots.txt` from `site.noindex` | U9 | S | None |
| Launch switch: `url`, `baseurl`, `CNAME`, `noindex` (touches `_config.yml`) | U9 | S | The site address changes. Pages identical |
| Secure press and photo rights | S8 | — | A clipping or photo is removed only if rights are refused |

### 3.3 Phase 2 — Safety net

| Item | Fixes | Size | Visible on the pages |
|---|---|---|---|
| Commit `Gemfile.lock` | A4 | S | None |
| Check job on every push, blocking the deploy on failure: data check (unique ids, referenced books and files exist, dates valid, addresses are https or mailto), Jekyll build, link check reusing `verifier` from `outils/maquette.py` | E3, E5, A5 | L | None. A faulty edit no longer goes online: the previous version stays |
| Escape data in HTML attributes | S4 | S | None for the current content |
| Content-Security-Policy and referrer policy | S5 | M | None if correct. Risk: a wrong rule blocks fonts or styles, so every page is checked before merge. Do after fonts are self-hosted |
| Pin Actions by commit, add Dependabot | S6 | S | None |
| Confirm two-factor authentication, branch protection, CMS scope, repository and domain ownership | S3 | S | None |

### 3.4 Phase 3 — Easier editing

| Item | Fixes | Size | Visible on the pages |
|---|---|---|---|
| Image pickers instead of typed file names; date pickers; selects for style, badge style and book | E4, E5 | M | None |
| SEO title and description editable in the CMS | E7 | M | None unless Mélodie changes them (browser tab and search results) |
| Move the remaining hard-coded strings to `_data` | E7 | M | None: the same words, stored in data files |
| Festive style driven by a start and an end date | E8 | M | Same look as today. It switches on and off on the dates instead of by hand |
| Guide: "what to do when the site did not update" | E3 | S | None |

### 3.5 Phase 4 — Scalability

| Item | Fixes | Size | Visible on the pages |
|---|---|---|---|
| Books as a Jekyll collection: one file and one page per book (buy buttons, excerpt, audio edition, Book structured data, sharing image) | A1, U8 | L | **Visible**: new pages, one per book. Existing pages keep their layout and their `#id` anchors. The only change on them would be the title and cover becoming links to the book page. Design to be validated on a mock-up first |
| Series described in `_data/series.yml`, driving the pages, the section menu and the CMS options | A2 | M | None: same sections, same order |
| Audio edition merged into the book record | A3 | M | None |
| Move colour literals to variables in `base.css` | A6 | S | None: identical values |
| Bring the README and `CLAUDE.md` back in sync, remove leftovers | A7 | S | None |

### 3.6 Phase 5 — High-end polish (all visible, each optional)

| Item | Fixes | Size | Visible on the pages |
|---|---|---|---|
| Carousel pause button, live region silent during auto-advance | U3 | M | A small pause/play button appears on each carousel (feel-good page) |
| Contrast fixes | U4 | S | Conference page: gold labels slightly darker, past events less faded |
| Image dimensions, responsive sizes, hero loaded eagerly, heavy press image recompressed | U5 | M | Same look. Pages stop shifting while loading and load faster |
| Font sets per page on "portail" pages | U6 | S | None intended: pages that mix universes keep the fonts they use. Checked by screenshots |
| Menu semantics | U10 | S | Current page marked in the menu (can be kept invisible). Escape closes the mobile menu |
| Consistent external links | U11 | S | Behaviour change: buy links open in a new tab, like the PDFs |
| Contact form through the newsletter tool or a form service | U7 | M | New block on the contact page. The email link stays. Adds a third-party processor to declare in the privacy policy |
| Person and Event structured data | U8 | S | None on the page (search results only) |

### 3.7 Rule for every "None" item

Build the site before and after the change and compare the two output folders. Differences must be limited to what the item states, ideally nothing. Add screenshots of each page at 320, 768 and 1280 px, as `CLAUDE.md` already requires for CSS. Anything unexpected is treated as a visible change and goes back to the owner before merge.

## 4. Decisions needed from the owner

1. Which newsletter tool (Brevo, MailerLite or other). It unblocks U1, U2 and possibly U7.
2. What the chapters button does on a book without an excerpt: hidden or relabelled.
3. Whether a contact form is wanted, knowing it adds a third-party processor.
4. Who owns the GitHub repository and the domain in the long run.
5. Whether per-book pages are wanted before launch or after.
