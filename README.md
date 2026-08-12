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

- `profile` — name, email, location, links (GitHub, LinkedIn, CV path).
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
press links) above the regular project grid; `work.items` holds ordinary projects and is
empty for now. Press coverage is shared between languages in the `SLIBE_PRESS` const at the
top of `content.js`, since the headlines are Bosnian either way.

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

### Company logos

Drop them in `src/assets/companies/` — PNG, JPG, WebP, AVIF or SVG — and point a work
entry at one with `logo: '<bare filename, no extension>'` in `path.work`. Nothing to
import.

Logos render on a light tile, so dark and colourful logos both stay visible against the
dark page. An entry with no logo (or one naming a file that is not there) falls back to a
monogram of the company's first letter, so the text column stays aligned either way.

### Project logo

The project logo stays a plain PNG at `src/assets/slibe/logoslibe.png` and is picked up
automatically as `slibeLogo`. Keep it small — a wordmark drawn at 32px does not need to be
8000px wide, and browsers decode the full bitmap into memory regardless of display size.

### Portrait

Save your photo as `src/assets/portrait.jpg` (`.jpeg`, `.png`, `.webp` and `.avif` also
work). No import to edit — `src/content.js` globs `portrait.*` and the extensions are
ordered so a `portrait.jpg` you add takes over from the placeholder `portrait.png`
automatically. Portrait orientation, ideally 3:4 or taller. It is imported rather than
served from `public/` so the build fingerprints it and relative-base hosting keeps working.

The photo renders as ASCII art and cross-fades to the real image on hover, focus or tap.
Two things make that survive an arbitrary photo:

- **Contrast normalisation** to the 2nd–98th percentile, so exposure barely matters.
- **Auto-invert** — if the frame's edges are brighter than its middle (a dark subject shot
  against a bright room), the ramp flips so the subject renders dense instead of hollow.
  Force it either way with `invert={true}` / `invert={false}` on `<Portrait>`.

Framing is `object-cover` at `50% 25%`, which favours the head. Pass a different
`objectPosition` if your crop sits elsewhere. To drop the ASCII effect entirely, render a
plain `<img>` instead of `<Portrait>` in
[`src/components/Hero.jsx`](src/components/Hero.jsx).

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
  open CV. Arrow keys and Enter work; Escape closes.
- **The hero types itself out** as two commands in sequence — `whoami` prints the intro,
  then `cat profile.txt` opens the panel under the photo.
- **The fact values keep rewriting themselves.** Labels (`location`, `focus`, `experience`)
  are fixed; the values type, hold, erase and type again on a loop, staggered so only one
  line is usually moving. Give a fact several values in `content.js` and it cycles through
  them — `focus` does this. Timings live in the `Fact` component and `FACT_STAGGER` at the
  top of [`src/components/Hero.jsx`](src/components/Hero.jsx); to freeze the values, pass
  `active={false}` to `<Fact>`.
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
