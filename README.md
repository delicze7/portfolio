# portfolio

Terminal-themed personal site. React + Vite + Tailwind v4, bilingual (EN / BS).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview
```

## Editing content

**Everything you need to change lives in [`src/content.js`](src/content.js).** No component
touches hardcoded copy.

- `profile` — name, email, location, the hero photo, links (LinkedIn).
- `content.en` / `content.bs` — all text, in both languages.

The two language objects must keep the **same arrays in the same order** — the UI matches
items positionally, so if `en.work.items` has four projects, `bs.work.items` needs the same
four in the same order.

To drop the Bosnian version entirely: delete the `bs` block, remove the toggle in
[`src/components/Nav.jsx`](src/components/Nav.jsx), and hardcode `'en'` in
[`src/i18n/LanguageContext.jsx`](src/i18n/LanguageContext.jsx).

There is deliberately **no CV download** — the page is the CV.

### Featured project

`work.featured` renders as a full case study (metrics, screenshot gallery, growth chart,
press links). `work.items` renders below it under "other projects" as a list of rows: name,
badge, year, the one-line `summary` and the stack are always visible, and a row opens in
place for its screenshots, problem / solution / result and an optional `next` line. One is
open at a time.

Shown in full, each of those adds 1200–1500px to the section on a phone — with three
projects it ran past 6000px and buried the featured one. As rows the whole section is
under 4000px. A link to `#project-<id>` opens that row, so the pointer from a work-history
entry lands on the write-up rather than on a closed heading.

Press coverage is shared between languages in the `SLIBE_PRESS` const at the top of
`content.js`, since the headlines are Bosnian either way.

Screenshots go in `src/assets/slibe/`. Each entry in `work.featured.shots` names one by
bare filename with no extension (`file: 'slibealbum1'`), so gallery order is set by the
content rather than by how the files happen to sort. A shot whose file is missing is
skipped, so the gallery never renders an empty frame.

The grid draws thumbnails from `src/assets/slibe/thumbs/`; the lightbox loads the full
image only when someone opens it. To add screenshots, drop the raw exports in
`src/assets/slibe/` and run:

```bash
npm i -D sharp
node scripts/optimize-images.mjs
npm uninstall sharp
```

That writes a 1000px WebP and a 400px WebP thumbnail for each, and moves your raw exports
to `src/assets/slibe/original/` (outside the import globs, so they are kept but never
bundled). `sharp` is deliberately not a project dependency — the site does not build or run
with it. The conversion is worth doing: for the five Slibe screens it took the gallery from
1509 kB of PNG to 161 kB of WebP.

### Other projects

Each project in `work.items` gets a folder, `src/assets/projects/<id>/`, and names its
screenshots in `shots` by bare filename. `orientation` decides how they are drawn: `'wide'`
puts desktop screens two to a row and opens them in the lightbox's wide layout, `'phone'`
puts portrait app screens in a strip that scrolls sideways. Convert them without
thumbnails — at the size they are drawn a 400px thumbnail would be blurry:

```bash
npm i -D sharp
node scripts/optimize-images.mjs src/assets/projects/<id> --no-thumbs
npm uninstall sharp
```

`shotsNote` prints a line under the screens — use it when they are a design rather than
captures of a running product, so nobody reads a mockup as a shipped app.

A work-history entry can point at a project with `project: { id, name }`, which renders a
link that scrolls to that project's row and opens it.

### Company logos

Drop them in `src/assets/companies/` — PNG, JPG, WebP, AVIF or SVG — and point a work
entry at one with `logo: '<bare filename, no extension>'` in `path.work`. Nothing to
import.

Every logo renders as a white silhouette (`brightness(0) invert(1)`), so dark and
colourful logos both read on the dark page and match each other. They sit in a shared box
rather than at a shared height, so a square mark is not dwarfed by a wide wordmark. An
entry with no logo can set `mark` instead — freelance uses the site's own `>` glyph.

### Project logo

The project logo stays a plain PNG at `src/assets/slibe/logoslibe.png` and is picked up
automatically as `slibeLogo`. Keep it small — a wordmark drawn at 32px does not need to be
8000px wide, and browsers decode the full bitmap into memory regardless of display size.

### Hero photo

The photo is `src/assets/hero.webp` — a quality-80 WebP (59 kB) made from the original,
which is kept at `src/assets/original/hero.jpg` (101 kB) outside the import glob.
`src/content.js` globs `hero.*` in avif, webp, jpg, jpeg or png and takes the
smallest-to-ship format present, so there is no import to edit; with no file at all the
hero renders as text only. Square is ideal: the character grid and the matte are laid over
the photo cell for cell.

The face sits against the right edge and dissolves into the page through characters.
[`src/lib/asciiField.js`](src/lib/asciiField.js) measures the photo once and produces both
the ASCII and a matte for the photo, and
[`src/components/HeroVisual.jsx`](src/components/HeroVisual.jsx) lays one over the other.
The matte follows the subject's contour row by row, so the photo shows the head and none of
the backdrop — a radial mask cannot tell the two apart and left a bright grey disc around
the face — and a horizontal fade hands the back of the head and the shoulder over to the
characters. On load the characters scramble into place and the
photo surfaces through them; afterwards a few glyphs keep flickering, paused while the hero
is off screen. `prefers-reduced-motion` gets the finished frame with no motion at all.

The ASCII is deliberately not brightness-based. A studio backdrop is bright, and
brightness ASCII renders it as a wall of glyphs that swallows the subject. Density follows
how far each cell departs from the backdrop's tone, plus its edge detail, so hair, beard
and fabric become characters while the backdrop stays blank. Left of the head, sparse
glyphs trail off into the dark — that trail is the dissolve.

All of this assumes the current framing: subject against the right edge, backdrop on the
left. The backdrop is learned from the left 18% of the frame (`backdropWidth` in
`analyse`), the photo fades in between 57% and 73% of the width (`fadeFrom` / `fadeTo` in
`buildMatte`), and the character mask is centred on `FOCUS` in `HeroVisual.jsx`. A photo
framed differently needs those moved.

## Sections

| # | id         | file                                | what it is                                  |
|---|------------|-------------------------------------|---------------------------------------------|
| — | `top`      | `components/Hero.jsx`               | `whoami` then `cat profile.txt`, typed in sequence |
| 1 | `work`     | `components/Work.jsx`               | case studies: problem / decision / trade-off / result |
| 2 | `approach` | `components/Approach.jsx`           | how you work                                |
| 3 | `stack`    | `components/Stack.jsx`              | tools grouped by layer, honest skill labels |
| 4 | `path`     | `components/Path.jsx`               | experience rendered as a git log            |
| 5 | `lab`      | `components/Lab.jsx`                | side projects and experiments               |
| 6 | `contact`  | `components/Contact.jsx`            | email, copy button, links                   |

Add or reorder sections by editing the `SECTIONS` array at the bottom of `src/content.js`
and the render order in [`src/App.jsx`](src/App.jsx). The nav, scrollspy and command
palette all read from that array.

## Details worth knowing

- **`Ctrl/⌘ + K`** opens the command palette — navigation, language switch, copy email,
  LinkedIn. Arrow keys and Enter work; Escape closes.
- **The hero types itself out** as two commands in sequence — `whoami` prints the intro,
  then `cat profile.txt` prints the facts beneath it.
- **The fact values keep rewriting themselves.** Labels (`location`, `focus`, `experience`)
  are fixed; the values type, hold, erase and type again on a loop, staggered so only one
  line is usually moving. Give a fact several values in `content.js` and it cycles through
  them — `focus` does this. Timings live in the `FactLine` component and `FACT_STAGGER` at
  the top of [`src/components/Hero.jsx`](src/components/Hero.jsx); to freeze the values,
  pass `active={false}` to `<FactLine>`.
- **The intro screen is English only** and lives in the top-level `boot` export in
  `src/content.js`, outside `content.en` / `content.bs`. It plays before the visitor has
  chosen a language, so there is nothing to translate it against. Its timings are the
  constants at the top of [`src/components/Boot.jsx`](src/components/Boot.jsx) — `EXIT_AT`
  is the one to change to make it longer or shorter.
- **The intro plays on every page load**, not once per session. Any key or click skips it.
- **Console message** lives in [`src/main.jsx`](src/main.jsx) — visitors who open DevTools
  get your email.
- **`prefers-reduced-motion`** is respected everywhere: the boot screen is skipped, typing
  is instant, smooth scrolling turns off.
- **Theme tokens** are the `@theme` block at the top of [`src/index.css`](src/index.css).
  Change `--color-acc` there to reskin the whole site.

## Deploy

Static output. Any host works.

- **GitHub Pages** — `npm run build`, publish `dist/`. `base: './'` in
  [`vite.config.js`](vite.config.js) already makes relative paths work from a subdirectory.
- **Netlify / Vercel / Cloudflare Pages** — build `npm run build`, publish directory `dist`.
