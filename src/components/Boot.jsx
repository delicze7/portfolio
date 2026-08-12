import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks.js'
import { profile } from '../content.js'
import { cx } from '../utils.js'

const TICK = 40

// Whole sequence, in ms from mount. Shorten EXIT_AT to make the intro snappier.
const CMD_START = 250
const CMD_SPEED = 34
const WELCOME_AT = 1000
const LINE_AT = [1200, 1450, 1700]
const NAME_START = 1350
const NAME_DUR = 1150
const BAR_START = 950
const BAR_END = 3050
const EXIT_AT = 3200
const FADE = 550

const GLYPHS = '#$%&*+-<>[]{}/\\=?!ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const BAR_WIDTH = 26

const clamp01 = (v) => Math.max(0, Math.min(1, v))

/** Resolves `text` out of noise: revealed on the left, still scrambling on the right. */
function scramble(text, progress) {
  const revealed = Math.floor(progress * text.length)
  let out = ''
  for (let i = 0; i < text.length; i++) {
    if (text[i] === ' ') out += ' '
    else if (i < revealed) out += text[i]
    else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
  }
  return out
}

/**
 * The intro that plays once per browser tab.
 *
 * The `> zejd` mark is positioned to land exactly where the nav mark will be,
 * so when the overlay fades the mark does not move — the site assembles around
 * a fixed point instead of cutting to a new screen.
 */
export default function Boot({ boot, onDone }) {
  const reduced = useReducedMotion()
  const [elapsed, setElapsed] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (reduced) {
      onDone()
      return
    }
    const started = performance.now()
    const tick = setInterval(() => setElapsed(performance.now() - started), TICK)
    const exit = setTimeout(() => setLeaving(true), EXIT_AT)
    const finish = setTimeout(onDone, EXIT_AT + FADE)
    return () => {
      clearInterval(tick)
      clearTimeout(exit)
      clearTimeout(finish)
    }
  }, [reduced, onDone])

  useEffect(() => {
    const skip = () => onDone()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [onDone])

  if (reduced) return null

  const typed = boot.command.slice(
    0,
    Math.max(0, Math.floor((elapsed - CMD_START) / CMD_SPEED)),
  )
  const commandDone = typed.length >= boot.command.length
  const linesShown = LINE_AT.filter((at) => elapsed >= at).length
  const nameProgress = clamp01((elapsed - NAME_START) / NAME_DUR)
  const barProgress = clamp01((elapsed - BAR_START) / (BAR_END - BAR_START))
  const filled = Math.round(barProgress * BAR_WIDTH)

  return (
    <div
      className={cx(
        'scanlines fixed inset-0 z-[100] overflow-hidden bg-ink transition-all duration-500 ease-out',
        leaving ? 'scale-[1.03] opacity-0' : 'scale-100 opacity-100',
      )}
    >
      {/* Same box as the nav, so the mark sits in the identical spot. */}
      <div className="absolute inset-x-0 top-0">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-5 sm:px-8">
          <span className="text-sm font-bold tracking-tight text-fg">
            <span className="text-acc">&gt;</span> {profile.handle}
          </span>
        </div>
      </div>

      {/* Soft glow behind the name. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(74,222,128,0.10),transparent_65%)]" />

      <div className="relative flex h-full items-center justify-center px-6">
        <div className="w-full max-w-lg">
          <p className="text-sm sm:text-base">
            <span className="text-acc">{profile.handle}@portfolio</span>
            <span className="text-dim">:~$</span> <span className="text-fg">{typed}</span>
            {!commandDone && <span className="caret" />}
          </p>

          <p
            className={cx(
              'mt-5 font-sans text-lg text-acc transition-opacity duration-500 sm:text-xl',
              elapsed >= WELCOME_AT ? 'opacity-100' : 'opacity-0',
            )}
          >
            {boot.welcome}
          </p>

          <ul className="mt-5 space-y-1.5 text-xs sm:text-sm">
            {boot.lines.map((line, i) => (
              <li
                key={line}
                className={cx(
                  'transition-opacity duration-300',
                  i < linesShown ? 'opacity-100' : 'opacity-0',
                )}
              >
                <span className="text-acc">[ok]</span> <span className="text-dim">{line}</span>
              </li>
            ))}
          </ul>

          {/* The name resolves out of noise. */}
          <p
            className={cx(
              'mt-10 text-2xl font-bold tracking-[0.12em] text-fg transition-opacity duration-300 sm:text-4xl',
              nameProgress > 0 ? 'opacity-100' : 'opacity-0',
              nameProgress >= 1 && 'text-glow',
            )}
          >
            {scramble(profile.name.toUpperCase(), nameProgress)}
          </p>
          <p
            className={cx(
              'mt-2 text-xs tracking-[0.24em] text-acc uppercase transition-opacity duration-500 sm:text-sm',
              nameProgress >= 0.92 ? 'opacity-100' : 'opacity-0',
            )}
          >
            {boot.role}
          </p>

          {/* Progress */}
          <div className="mt-10">
            <p className="flex items-baseline justify-between gap-4 text-[11px] text-dim sm:text-xs">
              <span>
                {boot.loading}
                <span className="text-line">{'.'.repeat(1 + (Math.floor(elapsed / 400) % 3))}</span>
              </span>
              <span className="text-fg/70">{Math.round(barProgress * 100)}%</span>
            </p>
            <p className="mt-2 text-xs whitespace-pre text-acc/80 sm:text-sm">
              {'█'.repeat(filled)}
              <span className="text-line">{'░'.repeat(BAR_WIDTH - filled)}</span>
            </p>
          </div>
        </div>
      </div>

      <p className="absolute inset-x-0 bottom-8 text-center text-[11px] text-dim/50">
        {boot.skip}
      </p>
    </div>
  )
}
