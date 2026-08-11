import { useEffect, useState } from 'react'
import { cx } from '../utils.js'

/** Sparse → dense. Light text on a dark panel, so density tracks brightness. */
const RAMP = ' .`:-=+*ki%@#'
const COLS = 54
/** Monospace glyphs run about 0.6em wide; two rows make a roughly square cell. */
const CHAR_ASPECT = 0.5

/**
 * The portrait renders as ASCII art and cross-fades to the real photo on hover,
 * focus or tap. Falls back to the plain photo if the canvas read fails.
 *
 * `invert` defaults to 'auto': if the frame's edges are brighter than its middle
 * — a dark subject shot against a bright room — the ramp flips so the subject
 * comes out dense instead of hollow.
 */
export default function Portrait({
  src,
  alt,
  caption,
  labels,
  invert = 'auto',
  objectPosition = '50% 25%',
}) {
  const [ascii, setAscii] = useState('')
  const [failed, setFailed] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.decoding = 'async'

    img.onload = () => {
      try {
        const rows = Math.max(
          1,
          Math.round((img.naturalHeight / img.naturalWidth) * COLS * CHAR_ASPECT),
        )
        const canvas = document.createElement('canvas')
        canvas.width = COLS
        canvas.height = rows
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        ctx.drawImage(img, 0, 0, COLS, rows)
        const { data } = ctx.getImageData(0, 0, COLS, rows)

        const lum = new Float32Array(COLS * rows)
        for (let i = 0; i < lum.length; i++) {
          const p = i * 4
          lum[i] = (0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]) / 255
        }

        // Stretch to the 2nd–98th percentile so any photo, however it was
        // exposed, uses the whole ramp instead of collapsing into one character.
        const sorted = Float32Array.from(lum).sort()
        const lo = sorted[Math.floor(sorted.length * 0.02)]
        const hi = sorted[Math.floor(sorted.length * 0.98)]
        const span = Math.max(0.05, hi - lo)

        let flip = invert === true
        if (invert === 'auto') {
          const edgeX = Math.max(1, Math.round(COLS * 0.12))
          const edgeY = Math.max(1, Math.round(rows * 0.12))
          let edgeSum = 0
          let edgeN = 0
          let coreSum = 0
          let coreN = 0
          for (let y = 0; y < rows; y++) {
            for (let x = 0; x < COLS; x++) {
              const v = lum[y * COLS + x]
              if (x < edgeX || x >= COLS - edgeX || y < edgeY || y >= rows - edgeY) {
                edgeSum += v
                edgeN++
              } else if (
                x > COLS * 0.3 &&
                x < COLS * 0.7 &&
                y > rows * 0.15 &&
                y < rows * 0.75
              ) {
                coreSum += v
                coreN++
              }
            }
          }
          flip = edgeN > 0 && coreN > 0 && edgeSum / edgeN > coreSum / coreN + 0.06
        }

        let out = ''
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < COLS; x++) {
            const n = Math.min(1, Math.max(0, (lum[y * COLS + x] - lo) / span))
            // Gamma lift keeps midtones from crushing into the sparse end.
            const t = Math.pow(flip ? 1 - n : n, 0.8)
            out += RAMP[Math.min(RAMP.length - 1, Math.round(t * (RAMP.length - 1)))]
          }
          if (y < rows - 1) out += '\n'
        }
        if (!cancelled) setAscii(out)
      } catch {
        if (!cancelled) setFailed(true) // Tainted canvas — show the photo instead.
      }
    }

    img.onerror = () => !cancelled && setFailed(true)
    img.src = src

    return () => {
      cancelled = true
    }
  }, [src, invert])

  const showPhoto = failed || pinned || hovered || !ascii

  return (
    <figure className="w-full">
      <div
        className="relative aspect-[3/4] overflow-hidden rounded border border-line bg-panel"
        style={{ containerType: 'inline-size' }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        {ascii && (
          <pre
            aria-hidden="true"
            className={cx(
              'absolute inset-0 flex items-center justify-center overflow-hidden text-acc/85 transition-opacity duration-500',
              showPhoto ? 'opacity-0' : 'opacity-100',
            )}
            style={{ fontSize: `calc(100cqw / ${COLS} / 0.6)`, lineHeight: 1.2 }}
          >
            {ascii}
          </pre>
        )}

        <img
          src={src}
          alt={alt}
          className={cx(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
            showPhoto ? 'opacity-100' : 'opacity-0',
          )}
          style={{ objectPosition, filter: 'saturate(0.9) contrast(1.04)' }}
        />

        {/* Vignette keeps a bright photo from punching a hole in a dark page. */}
        <span className="pointer-events-none absolute inset-0 shadow-[inset_0_0_44px_12px_rgba(7,10,11,0.55)]" />
      </div>

      <figcaption className="mt-2 flex items-center justify-between gap-2 text-[10px] text-dim">
        <span className="truncate">{caption}</span>
        {!failed && ascii && (
          <button
            type="button"
            onClick={() => setPinned((p) => !p)}
            aria-pressed={pinned}
            className="shrink-0 rounded border border-line px-1.5 py-0.5 transition-colors hover:border-acc/50 hover:text-acc"
          >
            {pinned ? labels.ascii : labels.photo}
          </button>
        )}
      </figcaption>
    </figure>
  )
}
