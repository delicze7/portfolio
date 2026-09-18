/**
 * Turns raw screenshot exports into what the site actually ships: a 1000px WebP
 * for each, and a 400px WebP thumbnail unless told otherwise.
 *
 *   node scripts/optimize-images.mjs                                   # src/assets/slibe, with thumbnails
 *   node scripts/optimize-images.mjs src/assets/projects/<id> --no-thumbs
 *
 * The featured project's phone strip draws ~195px thumbnails, so it wants them.
 * Other projects show desktop screens at half the card's width, where a 400px
 * thumbnail would be blurry — they use the 1000px file directly.
 *
 * `sharp` is not a project dependency — the site neither builds nor runs with
 * it. Install it only when you have new screenshots to process:
 *
 *   npm i -D sharp
 *   node scripts/optimize-images.mjs ...
 *   npm uninstall sharp
 *
 * Originals are moved to `<folder>/original/`, which sits outside the import
 * globs in `src/content.js`, so nothing is lost and nothing extra is bundled.
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const args = process.argv.slice(2)
const SRC = args.find((a) => !a.startsWith('--')) ?? 'src/assets/slibe'
const WITH_THUMBS = !args.includes('--no-thumbs')
const ORIGINAL = path.join(SRC, 'original')
const THUMBS = path.join(SRC, 'thumbs')

const FULL_WIDTH = 1000
const THUMB_WIDTH = 400

if (!fs.existsSync(SRC)) {
  console.error(`No such folder: ${SRC}`)
  process.exit(1)
}

fs.mkdirSync(ORIGINAL, { recursive: true })
if (WITH_THUMBS) fs.mkdirSync(THUMBS, { recursive: true })

// Everything except logos — they are marks, not screenshots, and get their own
// treatment. Matched anywhere in the name: logo.png, financije-logo.png.
const files = fs
  .readdirSync(SRC)
  .filter((f) => /\.(png|jpe?g)$/i.test(f) && !/logo/i.test(f))

if (files.length === 0) {
  console.log('Nothing to do — no raw PNG/JPG exports in', SRC)
  process.exit(0)
}

const kb = (n) => `${(n / 1024).toFixed(0)} kB`
let before = 0
let fullTotal = 0
let thumbTotal = 0

for (const file of files) {
  const from = path.join(SRC, file)
  const base = file.replace(/\.[^.]+$/, '')
  const input = fs.readFileSync(from)
  before += input.length

  const full = await sharp(input)
    .resize({ width: FULL_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toBuffer()
  fs.writeFileSync(path.join(SRC, `${base}.webp`), full)
  fullTotal += full.length

  let note = ''
  if (WITH_THUMBS) {
    const thumb = await sharp(input)
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toBuffer()
    fs.writeFileSync(path.join(THUMBS, `${base}.webp`), thumb)
    thumbTotal += thumb.length
    note = `, thumb ${kb(thumb.length)}`
  }

  fs.renameSync(from, path.join(ORIGINAL, file))
  console.log(`${base.padEnd(20)} ${kb(input.length).padStart(8)} -> full ${kb(full.length)}${note}`)
}

console.log(`\n${SRC}: ${kb(before)} of raw exports -> ${kb(fullTotal)} of WebP`)
if (WITH_THUMBS) console.log(`thumbnails: ${kb(thumbTotal)}`)
