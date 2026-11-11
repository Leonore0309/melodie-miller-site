# Site audit and improvement plan

Audit date: 11 November 2026, on commit `53bdf20`. Revised the same day after the decision to remove the CMS.
Scope: security, code, architecture, ergonomics (visitor experience and content editing).
Method: every template, include, script, stylesheet, data file, the deploy workflow and `outils/maquette.py` were read. Images and PDFs were inspected for size and metadata. Nothing was tested in a browser at audit time.

Each item of the plan states what a visitor would see change, so that no page is modified without that having been accepted first.

**Decision recorded: no CMS.** Pages CMS is removed from the project (`.pages.yml` and `GUIDE-MELODIE.md` deleted). Content is edited directly in `_data/*.yml` and `_extraits/`. The findings that only existed because of the CMS have been dropped from this document.

## 1. Summary

The site is sound: small (about 2,700 lines), consistently organised, content separated from templates, no inline scripts, a least-privilege deploy workflow, reduced-motion respected throughout, and no location data in the photos.

The main risks are not attacks. They are:

1. **Nothing checks an edit before it goes live.** Every push to `main` deploys. Content is now edited by hand in YAML, where one wrong indent fails the build and the site silently stays on the old version.
2. **Launch blockers remain**: legal pages, newsletter sign-up, indexing switches, third-party fonts.

After those, the biggest gain for scalability is giving each book its own page, and the biggest gain for polish is in accessibility and image loading.

## 2. Findings

Severity: **High** = breaks a page or blocks launch · **Medium** = real cost or risk, not urgent · **Low** = tidy-up.

Numbers are stable: the gaps (E1, E2, E4, E6, E9) are the CMS-only findings that were dropped. Findings describe the site as audited; section 3 says what has been fixed since.

### 2.1 Content editing

| # | Finding | Where | Severity |
|---|---|---|---|
| E3 | No validation and no preview. A wrong value either fails the build (the site silently stays on the old version) or publishes a broken page | `.github/workflows/pages.yml` | High |
| E5 | Dates, styles and book identifiers are typed by hand. A typo fails silently (a misspelt book id in Nouveautés gives a card with no title and no cover) | `_data/*.yml`, `_includes/nouveautes.html` | Medium |
| E7 | Text still hard-coded in pages, against the project rule: menu labels, section-menu labels, "Cinéma & télévision", "Livres audio", "Romances", "Thrillers", "Les premiers chapitres", "Contacter Mélodie", both legal pages | `_includes/header.html`, `*/index.html`, `_layouts/extrait.html` | Low |
| E8 | The festive style must be switched on, then off, by hand in two places | `_data/livres.yml`, `_data/nouveautes.yml` | Low |
| E10 | With the CMS gone there is no editing guide, and no no-code way for the owner to change content. Who edits, and how, is undecided | — | Medium |

### 2.2 Architecture and scalability

| # | Finding | Where | Severity |
|---|---|---|---|
| A1 | All 17 books live in one 233-line list and exist only as anchors inside carousels and cards. There is no page per book: nothing to share, to index, or to link from a newsletter | `_data/livres.yml` | Medium |
| A2 | Series are hard-coded in two places: the page templates and the sticky section menu. A new saga needs template work | `romances-feel-good/index.html`, `thrillers/index.html` | Medium |
| A3 | Audio editions repeat the book's identity (id, title, volume) in a second file | `_data/audio.yml` | Low |
| A4 | `Gemfile.lock` is git-ignored, so each deploy resolves gem versions afresh: builds are not reproducible | `.gitignore`, `Gemfile` | Medium |
| A5 | No automated check of any kind. A link verifier already exists but only runs by hand when building the zip mock-up | `outils/maquette.py` (`verifier`) | Medium |
| A6 | 29 colour literals outside `base.css`, mostly the festive red and gold and the "bientôt" coral, against the variables rule | `assets/css/portail.css` and others | Low |
| A7 | Documentation drift: the README still says to create the repo and that GitHub Pages uses its own Jekyll (the workflow builds with Bundler); `.texte-flux` is "2 colonnes" in `CLAUDE.md` and "1 colonne" in `base.css`; leftover `accueil: a` variant flag; empty folder `assets/img/portrait/`; `_config.yml` still excludes the deleted `GUIDE-MELODIE.md` | `README.md`, `CLAUDE.md`, `index.html`, `_config.yml` | Low |
| A8 | Excerpt pages have no date, so each build stamps them with the build time and declares them as blog posts in their metadata | `_layouts/extrait.html` | Low |

### 2.3 Security and privacy

The attack surface is low: static files only, no form, no cookie, no third-party script, deploy permissions already minimal. Removing the CMS also removes a third party with write access to the repository.

| # | Finding | Where | Severity |
|---|---|---|---|
| S1 | Fonts are loaded from Google on every page, which sends each visitor's IP address to Google. The privacy page itself lists this as unresolved | `_layouts/default.html` | High (launch) |
| S2 | Legal notice and privacy policy are placeholders. Both are mandatory in France before launch | `mentions-legales/index.html`, `confidentialite/index.html` | High (launch) |
| S3 | Account-level items to confirm: two-factor authentication on the GitHub accounts, branch protection on `main`, Pages CMS access revoked on GitHub if it was ever authorised, and who owns the repository and the domain in the long run (the repository is under a third-party account) | GitHub settings | Medium |
| S4 | Data values are written into HTML attributes unescaped (`alt`, `aria-label`, `href`), except on the press page. A double quote in a title breaks the markup | `_includes/*.html` | Low |
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

"None" in the last column means the built pages are meant to stay identical, and that is verified (see 3.7). Phases 2 and 3 are designed to leave the pages untouched. The visible changes are in phases 1, 4 and 5, and each needs the owner's agreement before it is done.

### 3.1 Phase 0 — Clean-up (done, 11 November 2026)

- Five data values that no template reads were removed: `nouveautes.texte`, `presse.provisoire`, `ecran.provisoire`, `audio.genre`, `audio.statut`.
- The example excerpt has `published: false`, so `/extraits/exemple/` is no longer online.
- The CMS was removed: `.pages.yml` and `GUIDE-MELODIE.md` deleted, the CMS rule dropped from `CLAUDE.md`, the Pages CMS step dropped from the README.
- A before/after build comparison showed every page byte-identical, except `/extraits/exemple/`, which is gone.

### 3.2 Phase 1 — Launch blockers

**Done on 11 November 2026:**
- Legal notice and privacy policy written, stored in `_data/legal.yml`. The facts only the owner knows are marked `[à compléter : …]`, and the "Texte provisoire" label shows until `provisoire: false`.
- "Lire les 3 premiers chapitres" is hidden on the 13 books without an excerpt (owner's choice).
- Fonts are hosted in `assets/polices/` (22 files, 648 KB, Latin and extended Latin). No call to Google remains. The per-page `polices:` setting is gone: a browser only downloads the fonts a page uses, which also settles U6.
- Favicon, iPhone icon, and a sharing image (portrait and name) set as the default for every page in `_config.yml`. `outils/partage.py` regenerates the two images.
- 404 page, with its text in `_data/site.yml`.
- `robots.txt` follows `site.noindex`. While it is `true`, the file is byte-identical to the previous one.
- Launch checklist written in the README.

Remaining, all on the owner's side:

| Item | Fixes | Size | Visible on the pages |
|---|---|---|---|
| Fill in the `[à compléter : …]` gaps of `_data/legal.yml`, then set `provisoire: false` | S2 | S | The gaps and the "Texte provisoire" label disappear from the two legal pages |
| Choose the newsletter tool and fill in `newsletter.formulaire_url` | U1 | S | Same buttons, same look. They open the sign-up form instead of an email draft |
| Secure press and photo rights | S8 | — | A clipping or photo is removed only if rights are refused |
| Launch switch, following the README checklist (touches `_config.yml`) | U9 | S | The site address changes. Pages identical |

### 3.3 Phase 2 — Safety net (now the first priority after launch blockers)

| Item | Fixes | Size | Visible on the pages |
|---|---|---|---|
| Commit `Gemfile.lock` | A4 | S | None |
| Check job on every push, blocking the deploy on failure, with error messages a non-developer can act on: data check (valid YAML, unique ids, referenced books and files exist, dates valid, addresses are https or mailto), Jekyll build, link check reusing `verifier` from `outils/maquette.py` | E3, E5, A5 | L | None. A faulty edit no longer goes online: the previous version stays |
| Escape data in HTML attributes | S4 | S | None for the current content |
| Content-Security-Policy and referrer policy | S5 | M | None if correct. Risk: a wrong rule blocks fonts or styles, so every page is checked before merge. Do after fonts are self-hosted |
| Pin Actions by commit, add Dependabot | S6 | S | None |
| Confirm two-factor authentication, branch protection, revoked CMS access, repository and domain ownership | S3 | S | None |

### 3.4 Phase 3 — Content editing without a CMS

| Item | Fixes | Size | Visible on the pages |
|---|---|---|---|
| Decide who edits content (see section 4). If the owner edits: a short guide for editing the data files in GitHub's web editor, including "what to do when the site did not update" | E10, E3 | M | None |
| Festive style driven by a start and an end date | E8 | M | Same look as today. It switches on and off on the dates instead of by hand |
| Move the remaining hard-coded strings to `_data` | E7 | M | None: the same words, stored in data files |

### 3.5 Phase 4 — Scalability

| Item | Fixes | Size | Visible on the pages |
|---|---|---|---|
| Books as a Jekyll collection: one file and one page per book (buy buttons, excerpt, audio edition, Book structured data, sharing image) | A1, U8 | L | **Visible**: new pages, one per book. Existing pages keep their layout and their `#id` anchors. The only change on them would be the title and cover becoming links to the book page. Design to be validated on a mock-up first |
| Series described in `_data/series.yml`, driving the pages and the section menu | A2 | M | None: same sections, same order |
| Audio edition merged into the book record | A3 | M | None |
| Move colour literals to variables in `base.css` | A6 | S | None: identical values |
| Bring the README and `CLAUDE.md` back in sync, remove leftovers | A7, A8 | S | None |

### 3.6 Phase 5 — High-end polish (all visible, each optional)

| Item | Fixes | Size | Visible on the pages |
|---|---|---|---|
| Carousel pause button, live region silent during auto-advance | U3 | M | A small pause/play button appears on each carousel (feel-good page) |
| Contrast fixes | U4 | S | Conference page: gold labels slightly darker, past events less faded |
| Image dimensions, responsive sizes, hero loaded eagerly, heavy press image recompressed | U5 | M | Same look. Pages stop shifting while loading and load faster |
| Menu semantics | U10 | S | Current page marked in the menu (can be kept invisible). Escape closes the mobile menu |
| Consistent external links | U11 | S | Behaviour change: buy links open in a new tab, like the PDFs |
| Contact form through the newsletter tool or a form service | U7 | M | New block on the contact page. The email link stays. Adds a third-party processor to declare in the privacy policy |
| Person and Event structured data | U8 | S | None on the page (search results only) |

### 3.7 Rule for every "None" item

Build the site before and after the change and compare the two output folders. Differences must be limited to what the item states, ideally nothing. Add screenshots of each page at 320, 768 and 1280 px, as `CLAUDE.md` already requires for CSS. Anything unexpected is treated as a visible change and goes back to the owner before merge.

## 4. Decisions needed from the owner

1. Who edits content now that there is no CMS: the owner in GitHub's web editor (then a guide is needed), or the developer only.
2. Which newsletter tool (Brevo, MailerLite or other). It unblocks U1 and possibly U7.
3. Whether a contact form is wanted, knowing it adds a third-party processor.
4. Who owns the GitHub repository and the domain in the long run.
5. Whether per-book pages are wanted before launch or after.
