/**
 * Draws a studio portrait in characters, and works out where the photo should
 * give way to them.
 *
 * Plain luminance ASCII renders a bright, empty backdrop as a solid wall of
 * glyphs and loses the subject in it. Here density follows how far each cell
 * departs from the backdrop's tone, plus how much edge detail it holds — so
 * hair, beard, eyes and fabric turn into characters while the backdrop stays
 * blank. Left of the subject's contour, sparse glyphs trail off into the
 * backdrop: the portrait coming apart into text.
 *
 * Pure functions with no DOM access, so the same code runs in the browser and
 * in a Node check against the real photo.
 */

/** Sparse to dense. Rendered light on dark, so density reads as brightness. */
export const RAMP = ' .:-=+*#%@'

/** Deterministic PRNG, so the trail is the same on every render and resize. */
function mulberry32(seed) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function quantile(values, q) {
  const sorted = Float32Array.from(values).sort()
  return sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))]
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

function smoothstep(from, to, x) {
  const t = clamp01((x - from) / (to - from))
  return t * t * (3 - 2 * t)
}

/**
 * Measures the photo: how strongly each cell belongs to the subject, and where
 * the subject's left contour runs on every row.
 *
 * @param {Float32Array} lum  luminance 0..1, sampled at (cols*scale) x (rows*scale)
 * @param {number} cols       characters per row
 * @param {number} rows       rows of characters
 * @param {number} scale      working pixels per character cell, each axis
 * @param {object} [opts]
 * @param {number} [opts.backdropWidth]  share of the frame, from the left edge,
 *   known to be pure backdrop — used to learn its tone and noise floor
 */
export function analyse(lum, cols, rows, scale = 4, { backdropWidth = 0.18 } = {}) {
  const W = cols * scale
  const H = rows * scale

  // Edge strength at working resolution, pooled per cell below. Working above
  // character resolution is what lets curls and stubble register as texture.
  const mag = new Float32Array(W * H)
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = y * W + x
      const gx =
        lum[i - W + 1] + 2 * lum[i + 1] + lum[i + W + 1] -
        lum[i - W - 1] - 2 * lum[i - 1] - lum[i + W - 1]
      const gy =
        lum[i + W - 1] + 2 * lum[i + W] + lum[i + W + 1] -
        lum[i - W - 1] - 2 * lum[i - W] - lum[i - W + 1]
      mag[i] = Math.hypot(gx, gy)
    }
  }

  const n = cols * rows
  const cellLum = new Float32Array(n)
  const cellEdge = new Float32Array(n)
  const area = scale * scale
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      let l = 0
      let e = 0
      for (let y = cy * scale; y < (cy + 1) * scale; y++) {
        for (let x = cx * scale; x < (cx + 1) * scale; x++) {
          l += lum[y * W + x]
          e += mag[y * W + x]
        }
      }
      cellLum[cy * cols + cx] = l / area
      cellEdge[cy * cols + cx] = e / area
    }
  }

  // Learn the backdrop from the strip at the left edge: its tone, how much it
  // wanders, and how much edge noise the file's grain produces there.
  const strip = Math.max(1, Math.round(cols * backdropWidth))
  const backLum = []
  const backEdge = []
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < strip; cx++) {
      backLum.push(cellLum[cy * cols + cx])
      backEdge.push(cellEdge[cy * cols + cx])
    }
  }
  const tone = quantile(backLum, 0.5)
  const wander = quantile(backLum.map((v) => Math.abs(v - tone)), 0.5)
  const grain = quantile(backEdge, 0.9)

  const dev = cellLum.map((v) => Math.abs(v - tone))
  const floor = Math.max(0.035, 3.5 * wander)
  const devTop = Math.max(floor + 0.05, quantile(dev, 0.98))
  const edgeTop = Math.max(grain + 0.05, quantile(cellEdge, 0.98))

  const field = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const d = clamp01((dev[i] - floor) / (devTop - floor))
    const e = clamp01((cellEdge[i] - grain) / (edgeTop - grain))
    field[i] = Math.max(d, e * 0.85)
  }

  // Leftmost point of the subject on each row — two solid cells in a row, so a
  // stray speck in the backdrop is not mistaken for it. -1 where there is none.
  const contour = new Int16Array(rows).fill(-1)
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols - 1; cx++) {
      if (field[cy * cols + cx] > 0.22 && field[cy * cols + cx + 1] > 0.22) {
        contour[cy] = cx
        break
      }
    }
  }

  return { field, contour, cols, rows }
}

/** @returns {string} rows of characters joined by '\n' */
export function renderAscii({ field, contour, cols, rows }, { seed = 7 } = {}) {
  const rand = mulberry32(seed)
  const trailReach = cols * 0.15
  const out = []

  for (let cy = 0; cy < rows; cy++) {
    const row = new Array(cols).fill(' ')
    const edge = contour[cy]
    for (let cx = 0; cx < cols; cx++) {
      const f = field[cy * cols + cx]
      if (f >= 0.1) {
        row[cx] = RAMP[Math.round(Math.pow(f, 0.85) * (RAMP.length - 1))]
      } else if (edge > 0 && cx < edge) {
        // The trail: likely near the contour, thinning out with distance.
        const p = 0.32 * Math.exp(-(edge - cx) / trailReach)
        if (rand() < p) row[cx] = RAMP[1 + ((rand() * 4) | 0)]
      }
    }
    out.push(row.join(''))
  }

  return out.join('\n')
}

function boxBlur(src, cols, rows) {
  const out = new Float32Array(src.length)
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      let sum = 0
      let count = 0
      for (let dy = -1; dy <= 1; dy++) {
        const y = cy + dy
        if (y < 0 || y >= rows) continue
        for (let dx = -1; dx <= 1; dx++) {
          const x = cx + dx
          if (x < 0 || x >= cols) continue
          sum += src[y * cols + x]
          count++
        }
      }
      out[cy * cols + cx] = sum / count
    }
  }
  return out
}

/**
 * Alpha for the photo, one value per character cell.
 *
 * A radial mask cannot tell a head from the wall behind it, so it keeps a disc
 * of bright backdrop around the face. This follows the subject instead: solid
 * from each row's contour to the right edge — which fills the face with no
 * holes even where skin matches the backdrop's tone — and nothing over the
 * backdrop. A horizontal fade then hands the subject's left side (back of the
 * head, ear, shoulder) over to the characters underneath.
 *
 * @param {object} analysis   output of analyse()
 * @param {object} [opts]
 * @param {number} [opts.fadeFrom]  share of the width where the photo starts to appear
 * @param {number} [opts.fadeTo]    share of the width where it is fully solid
 * @param {number} [opts.feather]   cells of soft edge outside the contour
 */
export function buildMatte({ contour, cols, rows }, { fadeFrom = 0.57, fadeTo = 0.73, feather = 3 } = {}) {
  let alpha = new Float32Array(cols * rows)
  for (let cy = 0; cy < rows; cy++) {
    const edge = contour[cy]
    if (edge < 0) continue
    for (let cx = 0; cx < cols; cx++) {
      const inside = clamp01((cx - (edge - feather)) / feather)
      alpha[cy * cols + cx] = inside * smoothstep(fadeFrom, fadeTo, (cx + 0.5) / cols)
    }
  }
  // Two passes take the row-by-row staircase out of the contour.
  for (let pass = 0; pass < 2; pass++) alpha = boxBlur(alpha, cols, rows)
  return alpha
}

/** Convenience: the characters only. */
export function buildAscii(lum, cols, rows, scale = 4, opts = {}) {
  return renderAscii(analyse(lum, cols, rows, scale, opts), opts)
}
