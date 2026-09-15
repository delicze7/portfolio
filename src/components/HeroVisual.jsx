import { useEffect, useRef, useState } from 'react'
import { analyse, buildMatte, renderAscii, RAMP } from '../lib/asciiField.js'
import { useReducedMotion } from '../hooks.js'
import { cx } from '../utils.js'

/** Two rows of monospace glyphs make a roughly square cell. */
const CHAR_ASPECT = 0.5
/** Working pixels per character cell, each axis — see analyse(). */
const SCALE = 4
const SCRAMBLE_MS = 1100
const SHIMMER_MS = 130
/** Share of the drawn glyphs that flicker on each shimmer tick. */
const SHIMMER_SHARE = 0.006

// Centre of the character mask, on the face. Tuned for the current photo, which
// has the face against the right edge and empty backdrop to its left.
const FOCUS = '82% 42%'
// Characters fade out before they reach the copy on the left. Where the photo
// is solid it covers them, so only the dissolve zone and the trail show.
const ASCII_MASK = `radial-gradient(ellipse 72% 88% at ${FOCUS}, #000 55%, transparent 96%)`
// Used only if the canvas cannot be read and there is no subject matte.
const FALLBACK_PHOTO_MASK = `radial-gradient(ellipse 58% 72% at ${FOCUS}, #000 40%, transparent 78%)`

/** Fewer columns on narrow screens, where the frame is a third the size. */
function useColumns() {
  const query = '(min-width: 1024px)'
  const [wide, setWide] = useState(() => window.matchMedia(query).matches)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e) => setWide(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return wide ? 120 : 72
}

/** Paints a per-cell alpha grid into a tiny PNG for use as a CSS mask. */
function matteToUrl(alpha, cols, rows) {
  const canvas = document.createElement('canvas')
  canvas.width = cols
  canvas.height = rows
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(cols, rows)
  for (let i = 0; i < alpha.length; i++) img.data[i * 4 + 3] = Math.round(alpha[i] * 255)
  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL('image/png')
}

/**
 * The hero portrait: the face as a photograph, dissolving through characters
 * into the page. On load the characters scramble into place and the photo
 * surfaces through them; afterwards a few glyphs keep flickering, paused while
 * the hero is off screen.
 *
 * The <pre> is written through a ref rather than rendered by React — it is
 * redrawn every frame during the scramble, and React never needs to diff it.
 */
export default function HeroVisual({ src, alt, ready }) {
  const reduced = useReducedMotion()
  const cols = useColumns()
  const preRef = useRef(null)
  const [image, setImage] = useState(null)
  const [ascii, setAscii] = useState(null)
  const [matte, setMatte] = useState(null)
  const [canvasFailed, setCanvasFailed] = useState(false)
  const [revealed, setRevealed] = useState(false)

  // Decode the photo once.
  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => !cancelled && setImage(img)
    img.src = src
    return () => {
      cancelled = true
    }
  }, [src])

  // Measure the photo, again whenever the column count changes.
  useEffect(() => {
    if (!image) return
    const rows = Math.max(
      1,
      Math.round((image.naturalHeight / image.naturalWidth) * cols * CHAR_ASPECT),
    )
    try {
      const w = cols * SCALE
      const h = rows * SCALE
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(image, 0, 0, w, h)
      const { data } = ctx.getImageData(0, 0, w, h)
      const lum = new Float32Array(w * h)
      for (let i = 0; i < lum.length; i++) {
        const p = i * 4
        lum[i] = (0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2]) / 255
      }
      const analysis = analyse(lum, cols, rows, SCALE)
      setAscii({ text: renderAscii(analysis), cols })
      setMatte(matteToUrl(buildMatte(analysis), cols, rows))
    } catch {
      // A tainted canvas loses the dissolve, not the photo.
      setCanvasFailed(true)
    }
  }, [image, cols])

  // Scramble the characters into place, then let the photo surface.
  useEffect(() => {
    const pre = preRef.current
    if (!pre || !ascii) return
    if (!ready) {
      pre.textContent = ''
      return
    }
    if (reduced) {
      pre.textContent = ascii.text
      setRevealed(true)
      return
    }

    const target = ascii.text
    const chars = target.split('')
    const glyphs = RAMP.slice(1)
    const settleAt = chars.map((c) => (c === ' ' || c === '\n' ? 0 : Math.random() * SCRAMBLE_MS))
    let raf
    let start

    const frame = (now) => {
      start ??= now
      const elapsed = now - start
      let out = ''
      for (let i = 0; i < chars.length; i++) {
        out += elapsed >= settleAt[i] ? chars[i] : glyphs[(Math.random() * glyphs.length) | 0]
      }
      pre.textContent = out
      if (elapsed < SCRAMBLE_MS) raf = requestAnimationFrame(frame)
      else {
        pre.textContent = target
        setRevealed(true)
      }
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [ascii, ready, reduced])

  // Keep a few glyphs flickering, only while the hero is actually on screen.
  useEffect(() => {
    const pre = preRef.current
    if (!pre || !ascii || !revealed || reduced) return

    const base = ascii.text.split('')
    const drawn = []
    base.forEach((c, i) => {
      if (c !== ' ' && c !== '\n') drawn.push(i)
    })
    if (drawn.length === 0) return

    const glyphs = RAMP.slice(1)
    const buf = base.slice()
    const perTick = Math.max(1, Math.round(drawn.length * SHIMMER_SHARE))
    let changed = []
    let onScreen = true

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
    })
    io.observe(pre)

    const id = setInterval(() => {
      if (!onScreen || document.hidden) return
      for (const i of changed) buf[i] = base[i]
      changed = []
      for (let k = 0; k < perTick; k++) {
        const i = drawn[(Math.random() * drawn.length) | 0]
        buf[i] = glyphs[(Math.random() * glyphs.length) | 0]
        changed.push(i)
      }
      pre.textContent = buf.join('')
    }, SHIMMER_MS)

    return () => {
      clearInterval(id)
      io.disconnect()
      pre.textContent = ascii.text
    }
  }, [ascii, revealed, reduced])

  const showPhoto = ready && (revealed || canvasFailed)
  const photoMask = matte
    ? { maskImage: `url(${matte})`, WebkitMaskImage: `url(${matte})`, maskSize: '100% 100%', WebkitMaskSize: '100% 100%', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat' }
    : { maskImage: FALLBACK_PHOTO_MASK, WebkitMaskImage: FALLBACK_PHOTO_MASK }

  return (
    <>
      {/* Square frame: full width on top on small screens, full height against
          the right edge on wide ones. Square because the photo is, so the
          character grid and the matte line up with it cell for cell. */}
      <div
        className="pointer-events-none absolute top-0 right-0 aspect-square w-full lg:h-full lg:w-auto"
        style={{ containerType: 'inline-size' }}
      >
        <pre
          ref={preRef}
          aria-hidden="true"
          className="absolute inset-0 m-0 overflow-hidden whitespace-pre text-acc/75 select-none"
          style={{
            fontSize: `calc(100cqw / ${ascii?.cols ?? cols} / 0.6)`,
            lineHeight: 1.2,
            maskImage: ASCII_MASK,
            WebkitMaskImage: ASCII_MASK,
          }}
        />

        <img
          src={src}
          alt={alt}
          fetchPriority="high"
          decoding="async"
          className={cx(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out',
            showPhoto ? 'opacity-100' : 'opacity-0',
          )}
          style={{ ...photoMask, filter: 'contrast(1.08) brightness(0.92)' }}
        />

        {/* Lets the bottom edge sink into the page instead of ending on a cut. */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(to_top,var(--color-ink),transparent)] lg:h-1/4" />
      </div>

      {/* Wide screens: a scrim on the copy side, so text over the dissolve
          stays readable. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-3/5 bg-[linear-gradient(to_right,var(--color-ink)_35%,transparent)] lg:block" />
    </>
  )
}
