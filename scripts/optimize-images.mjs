/**
 * Turns raw screenshot exports into what the site actually ships:
 * a 1000px WebP for the lightbox and a 400px WebP thumbnail for the grid.
 *
 * `sharp` is not a project dependency — the site neither builds nor runs with
 * it. Install it only when you have new screenshots to process:
 *
 *   npm i -D sharp
 *   node scripts/optimize-images.mjs
 *   npm uninstall sharp
 *
 * Drop the raw PNG/JPG exports in `src/assets/slibe/`. Originals are moved to
 * `src/assets/slibe/original/` afterwards, which sits outside the import globs
 * in `src/content.js`, so nothing is lost and nothing extra is bundled.
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const SRC = 'src/assets/slibe'
const ORIGINAL = path.join(SRC, 'original')
const THUMBS = path.join(SRC, 'thumbs')

const FULL_WIDTH = 1000
const THUMB_WIDTH = 400

fs.mkdirSync(ORIGINAL, { recursive: true })
fs.mkdirSync(THUMBS, { recursive: true })

// Everything except the logo, which is a tiny wordmark and stays as a PNG.
const files = fs
  .readdirSync(SRC)
  .filter((f) => /\.(png|jpe?g)$/i.test(f) && !/^logo/i.test(f))

if (files.length === 0) {
  console.log('Nothing to do — no raw PNG/JPG exports in', SRC)
  process.exit(0)
}

let before = 0
let thumbTotal = 0
let fullTotal = 0

for (const file of files) {
  const from = path.join(SRC, file)
  const base = file.replace(/\.[^.]+$/, '')
  const input = fs.readFileSync(from)
  before += input.length

  const full = await sharp(input)
    .resize({ width: FULL_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toBuffer()
  const thumb = await sharp(input)
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toBuffer()

  fs.writeFileSync(path.join(SRC, `${base}.webp`), full)
  fs.writeFileSync(path.join(THUMBS, `${base}.webp`), thumb)
  fs.renameSync(from, path.join(ORIGINAL, file))

  fullTotal += full.length
  thumbTotal += thumb.length
  const kb = (n) => `${(n / 1024).toFixed(0)} kB`
  console.log(`${base.padEnd(20)} ${kb(input.length).padStart(8)} -> full ${kb(full.length)}, thumb ${kb(thumb.length)}`)
}

const kb = (n) => `${(n / 1024).toFixed(0)} kB`
console.log(`\ngallery grid: ${kb(before)} -> ${kb(thumbTotal)}`)
console.log(`lightbox, per image opened: ~${kb(fullTotal / files.length)}`)
