# Site audit and improvement plan

Audit date: 11 November 2026, on commit `53bdf20`. Revised the same day after the decision to remove the CMS.
Scope: security, code, architecture, ergonomics (visitor experience and content editing).
Method: every template, include, script, stylesheet, data file, the deploy workflow and `outils/maquette.py` were read. Images and PDFs were inspected for size and metadata. Nothing was tested in a browser at audit time.

Each item of the plan states what a visitor would see change, so that no page is modified without that having been accepted first.

**Decision recorded: no CMS.** Pages CMS is removed from the project (`.pages.yml` and `GUIDE-MELODIE.md` deleted). Content is edited directly in `_data/*.yml` and `_extraits/`. The findings that only existed because of the CMS have been dropped from this document.

## 1. Summary

The site is sound: small (about 2,700 lines), consistently organised, content separated from templates, no inline scripts, a least-privilege deploy workflow, reduced-motion respected throughout, and no location data in the photos.

The main risks are not attacks. They are:

1. **Nothing checks an edit before it goes live.** Mélodie edits the data files by hand in GitHub's web editor (`GUIDE-MELODIE.md` explains the syntax and what to do when a deploy fails). Every push to `main` deploys. One wrong indent fails the build and the site stays on the old version. The owner chose not to add checks before deploying (see E3); a failed deploy is only signalled by GitHub's failure email and the Actions tab.
2. **Launch blockers**: the code side is done (Phase 1). The legal gaps, the newsletter address, the image rights and the launch switch remain with the owner.

After those, the biggest gain for scalability is giving each book its own page, and the biggest gain for polish is in accessibility and image loading.

## 2. Findings

Severity: **High** = breaks a page or blocks launch · **Medium** = real cost or risk, not urgent · **Low** = tidy-up.

Numbers are stable: the gaps (E1, E2, E4, E6, E9) are the CMS-only findings that were dropped. Findings describe the site as audited; the Status column says what has happened since.

### 2.1 Content editing

| # | Finding | Where | Severity | Status |
|---|---|---|---|---|
| E3 | No validation and no preview. A wrong value either fails the build (the site stays on the old version) or publishes a broken page. The owner chose on 11 November 2026 not to add checks before pushing or deploying. Mitigation: keep GitHub's "failed workflow" email notifications on for whoever edits | `.github/workflows/pages.yml` | High | Accepted risk |
| E5 | Dates, styles and book identifiers are typed by hand. A typo fails silently (a misspelt book id in Nouveautés gives a card with no title and no cover) | `_data/*.yml`, `_includes/nouveautes.html` | Medium | Accepted risk (checks cancelled) |
| E7 | Text still hard-coded in pages, against the project rule: menu labels, section-menu labels, "Cinéma & télévision", "Livres audio", "Romances", "Thrillers", "Les premiers chapitres", "Contacter Mélodie", both legal pages | `_includes/header.html`, `*/index.html`, `_layouts/extrait.html` | Low | **Done** (Phase 3) |
| E8 | The festive style must be switched on, then off, by hand in two places | `_data/livres.yml`, `_data/nouveautes.yml` | Low | Removed from plan |
| E10 | With the CMS gone there is no editing guide, and no no-code way for the owner to change content. Who edits, and how, is undecided | — | Medium | **Done** (Phase 3): `GUIDE-MELODIE.md` |

### 2.2 Architecture and scalability

| # | Finding | Where | Severity | Status |
|---|---|---|---|---|
| A1 | All 17 books live in one 233-line list and exist only as anchors inside carousels and cards. There is no page per book: nothing to share, to index, or to link from a newsletter | `_data/livres.yml` | Medium | Removed from plan |
| A2 | Series are hard-coded in two places: the page templates and the sticky section menu. A new saga needs template work | `romances-feel-good/index.html`, `thrillers/index.html` | Medium | **Done** (Phase 4) |
| A3 | Audio editions repeat the book's identity (id, title, volume) in a second file | `_data/audio.yml` | Low | **Done** (Phase 4) |
| A4 | `Gemfile.lock` is git-ignored, so each deploy resolves gem versions afresh: builds are not reproducible | `.gitignore`, `Gemfile` | Medium | **Done** (Phase 2) |
| A5 | No automated check of any kind. A link verifier already exists but only runs by hand when building the zip mock-up | `outils/maquette.py` (`verifier`) | Medium | Cancelled |
| A6 | 29 colour literals outside `base.css`, mostly the festive red and gold and the "bientôt" coral, against the variables rule | `assets/css/portail.css` and others | Low | **Done** (Phase 4) |
| A7 | Documentation drift: the README still says to create the repo and that GitHub Pages uses its own Jekyll (the workflow builds with Bundler); `.texte-flux` is "2 colonnes" in `CLAUDE.md` and "1 colonne" in `base.css`; leftover `accueil: a` variant flag; empty folder `assets/img/portrait/`; `_config.yml` still excludes the deleted `GUIDE-MELODIE.md` | `README.md`, `CLAUDE.md`, `index.html`, `_config.yml` | Low | **Done** (Phase 4) |
| A8 | Excerpt pages have no date, so each build stamps them with the build time and declares them as blog posts in their metadata | `_layouts/extrait.html` | Low | **Done** (Phase 4) |

### 2.3 Security and privacy

The attack surface is low: static files only, no form, no cookie, no third-party script, deploy permissions already minimal. Removing the CMS also removes a third party with write access to the repository.

| # | Finding | Where | Severity | Status |
|---|---|---|---|---|
| S1 | Fonts are loaded from Google on every page, which sends each visitor's IP address to Google. The privacy page itself lists this as unresolved | `_layouts/default.html` | High (launch) | **Done** (Phase 1) |
| S2 | Legal notice and privacy policy are placeholders. Both are mandatory in France before launch | `mentions-legales/index.html`, `confidentialite/index.html` | High (launch) | **Done** (Phase 1); owner to fill the gaps |
| S3 | Account-level items (two-factor authentication, revoking old Pages CMS access, long-term ownership of the repository and the domain). Removed from the plan by the owner on 11 November 2026 | GitHub settings | Medium | Removed from plan |
| S4 | Data values are written into HTML attributes unescaped (`alt`, `aria-label`, `href`), except on the press page. A double quote in a title breaks the markup | `_includes/*.html` | Low | **Done** (Phase 2) |
| S5 | No Content-Security-Policy and no referrer policy. A strict policy is feasible because there are no inline scripts and no `style` attributes | `_layouts/default.html` | Low | Removed from plan |
| S6 | GitHub Actions are pinned by tag, not by commit; no Dependabot | `.github/workflows/pages.yml` | Low | **Done** (Phase 2) |
| S7 | The contact address is in clear text on every page (spam harvesting) and is a personal Gmail address | `_data/site.yml` | Low | Open, no action planned |
| S8 | Press clippings are reproductions and one photo shows third parties: reproduction and image rights to secure (already noted in the README) | `assets/img/presse/`, `assets/img/photos/atelier-kobo.jpg` | Medium | Owner action |

Checked and fine: no EXIF or GPS data in the 38 images; the four PDFs carry only the author's pen name as metadata; external links opened in a new tab all carry `rel="noopener"`; no secret in the repository.

### 2.4 Visitor experience, accessibility, performance, SEO

| # | Finding | Where | Severity | Status |
|---|---|---|---|---|
| U1 | The newsletter has no sign-up form (`formulaire_url` is empty). Every "Je m'inscris" and "Me prévenir" opens an email draft | `_data/site.yml`, `_includes/newsletter-lien.html` | High (launch) | Owner action |
| U2 | For the 13 books without an excerpt, "Lire les 3 premiers chapitres" also opens that email draft: the button promises chapters and delivers a blank email | `_includes/boutons-livre.html` | High | **Done** (Phase 1) |
| U3 | Carousels advance every 4 s inside an `aria-live="polite"` region, so a screen reader announces each rotation, and there is no pause button (WCAG 2.2.2) | `_includes/carrousel.html`, `assets/js/carrousel.js` | Medium | Removed from plan |
| U4 | Gold text `#b08d57` on white is about 3.1:1, under the 4.5:1 minimum. Past conference cards at 62% opacity are lower still | `assets/css/univers-conference.css` | Medium | Removed from plan |
| U5 | Images have no `width`/`height`, so pages shift while loading. No responsive sizes or modern format: 700 px covers are served for 110 px slots. The home-page portrait is lazy-loaded although it is the main image above the fold. One press image weighs 624 KB | `_includes/photo.html`, `_includes/nouveautes.html`, `assets/img/presse/republique-77-succes.jpg` | Medium | **Done** (Phase 5), except responsive sizes (see 3.6) |
| U6 | The home page and the other "portail" pages load all seven font families | `_layouts/default.html` | Medium | **Done** (Phase 1) |
| U7 | Contact is `mailto:` only: a visitor without a configured mail client cannot write | `contact/index.html` | Medium | Removed from plan |
| U8 | No favicon, no social sharing image, no 404 page, no structured data (Person, Book, Event) | site-wide | Medium | **Done** (Phases 1 and 5) |
| U9 | `robots.txt` is a static `Disallow: /`, separate from the `noindex` switch in `_config.yml`: easy to flip one and forget the other at launch | `robots.txt`, `_config.yml` | Medium | **Done** (Phase 1) |
| U10 | Menu: `aria-haspopup` on a plain link, no `aria-current` on the active page, Escape does not close the mobile menu | `_includes/header.html`, `assets/js/menu.js` | Low | **Done** (Phase 5) |
| U11 | Buy links open in the same tab while PDFs open in a new one, with no "(nouvel onglet)" hint | `_includes/boutons-livre.html` | Low | **Done** (Phase 5) |

## 3. Improvement plan

Size: **S** = under an hour · **M** = half a day · **L** = a day or more.

"None" in the last column means the built pages are meant to stay identical, and that is verified (see 3.7). Phases 2, 3 and 4 are designed to leave the pages untouched. The visible changes are in phases 1, 4 and 5, and each needs the owner's agreement before it is done.

### 3.1 Phase 0 — Clean-up

| Item | Status |
|---|---|
| Remove five data values no template reads (`nouveautes.texte`, `presse.provisoire`, `ecran.provisoire`, `audio.genre`, `audio.statut`) | **Done** |
| Unpublish the example excerpt (`published: false`, `/extraits/exemple/` no longer online) | **Done** |
| Remove the CMS: `.pages.yml` and `GUIDE-MELODIE.md` deleted, CMS rule dropped from `CLAUDE.md`, Pages CMS step dropped from the README | **Done** |

Verified: every page byte-identical before and after, except `/extraits/exemple/`, which is gone.

### 3.2 Phase 1 — Launch blockers

| Item | Fixes | Visible on the pages | Status |
|---|---|---|---|
| Legal notice and privacy policy written in `_data/legal.yml`, with `[à compléter : …]` gaps and a "Texte provisoire" label while `provisoire: true` | S2 | Text of the two legal pages | **Done** |
| Hide "Lire les 3 premiers chapitres" on the 13 books without an excerpt (owner's choice) | U2 | The button disappears from those books | **Done** |
| Fonts hosted in `assets/polices/` (22 files, 648 KB); no call to Google; per-page `polices:` setting removed | S1, U6 | None intended | **Done** (not checked in a browser: screenshots skipped by the owner) |
| Favicon, iPhone icon, default sharing image (portrait and name), regenerated by `outils/partage.py` | U8 | Tab icon and link previews | **Done** |
| 404 page, text in `_data/site.yml` | U8 | New page on wrong addresses | **Done** |
| `robots.txt` driven by `site.noindex` | U9 | None (byte-identical while `noindex: true`) | **Done** |
| Launch checklist in the README | U9 | None | **Done** |
| Fill in the `[à compléter : …]` gaps of `_data/legal.yml`, then `provisoire: false` | S2 | Gaps and label disappear | Owner action |
| Choose the newsletter tool, fill in `newsletter.formulaire_url` | U1 | Buttons open the sign-up form | Owner action |
| Secure press and photo rights | S8 | A clipping or photo removed only if refused | Owner action |
| Launch switch, following the README checklist (touches `_config.yml`) | U9 | The site address changes | Owner action, last |

### 3.3 Phase 2 — Hardening

The owner decided on 11 November 2026 not to add checks before pushing or deploying, and removed the account-settings item and the security headers. The data check, build check and link check (E3, E5, A5) are cancelled, and so is branch protection, which only helps with checks before merging.

| Item | Fixes | Visible on the pages | Status |
|---|---|---|---|
| Commit `Gemfile.lock`, with the Windows and Linux platforms | A4 | None | **Done** (first online build not yet run) |
| Escape data in HTML attributes (72 places) | S4 | None: pages identical once entities are decoded | **Done** |
| Pin the five Actions by commit, add Dependabot (monthly update proposals as pull requests) | S6 | None | **Done** |

### 3.4 Phase 3 — Content editing without a CMS

| Item | Fixes | Size | Visible on the pages | Status |
|---|---|---|---|---|
| Editing guide for Mélodie, who edits the data files in GitHub's web editor (owner's decision, 11 November 2026), including "what to do when the site did not update" | E10, E3 | M | None | **Done**: `GUIDE-MELODIE.md`, not published on the site |
| Move the remaining hard-coded strings to `_data` | E7 | M | None: the same words, stored in data files | **Done**: common texts in `_data/textes.yml`, page texts in each page's file, countdown labels read by `evenements.js` from the page |

### 3.5 Phase 4 — Scalability

| Item | Fixes | Size | Visible on the pages | Status |
|---|---|---|---|---|
| Series described in `_data/romans.yml` (`series:` lists), driving the pages and the section menu | A2 | M | None: same sections, same order | **Done** (`_includes/serie.html`, `_includes/sommaire.html`) |
| Audio edition merged into the book record (`audio:` part in `livres.yml`) | A3 | M | None | **Done** |
| Move colour literals to variables in `base.css` | A6 | S | None: identical values | **Done**: no colour literal left outside `base.css` |
| Bring the README and `CLAUDE.md` back in sync, remove leftovers | A7, A8 | S | None | **Done**: `accueil: a` became `newsletter_bande: false`, empty folder removed, excerpts typed as web pages (`_config.yml`) |

### 3.6 Phase 5 — High-end polish

| Item | Fixes | Size | Visible on the pages | Status |
|---|---|---|---|---|
| Image dimensions, responsive sizes, hero loaded eagerly, heavy press image recompressed | U5 | M | Same look. Pages stop shifting while loading and load faster | **Done**, except responsive sizes: `width`/`height` on every image from `_data/images.yml` (`outils/images.py`), home portrait loaded first, 10 images recompressed (about 700 KB saved). Responsive sizes left out: generated copies would go stale when Mélodie replaces an image by hand |
| Menu semantics | U10 | S | Current page underlined in the menu. Escape closes the mobile menu | **Done** |
| Consistent external links | U11 | S | Behaviour change: buy links open in a new tab, like the PDFs | **Done**: every external link opens a new tab, with a hidden "(nouvel onglet)" for screen readers. The newsletter link keeps the same tab |
| Person and Event structured data | U8 | S | None on the page (search results only) | **Done**: Person on the home page, one Event per upcoming date on Rencontres & presse |

### 3.7 Rule for every "None" item

Build the site before and after the change and compare the two output folders. Differences must be limited to what the item states, ideally nothing. Add screenshots of each page at 320, 768 and 1280 px, as `CLAUDE.md` already requires for CSS. Anything unexpected is treated as a visible change and goes back to the owner before merge.

## 4. Decisions

Taken on 11 November 2026:
- No CMS; content is edited by Mélodie, directly in GitHub's web editor.
- No checks before pushing or deploying.
- Hide the chapters button on books without an excerpt; sharing image made of the portrait and the name.
- Removed from the plan: account settings, security headers, per-book pages, festive dates, carousel pause button, contrast fixes, contact form.

Still open:
1. Which newsletter tool (Brevo, MailerLite or other). It unblocks U1.
2. Who owns the GitHub repository and the domain in the long run.
