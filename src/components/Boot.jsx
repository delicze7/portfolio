import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks.js'
import { profile } from '../content.js'

const LINE_MS = 230
const HOLD_MS = 420
const FADE_MS = 480

/**
 * The boot sequence that plays once per browser session.
 * Any key or click skips it — never trap someone behind an animation.
 */
export default function Boot({ lines, skipLabel, onDone }) {
  const reduced = useReducedMotion()
  const [count, setCount] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (reduced) {
      onDone()
      return
    }
    const timers = lines.map((_, i) => setTimeout(() => setCount(i + 1), i * LINE_MS))
    const startFade = setTimeout(() => setLeaving(true), lines.length * LINE_MS + HOLD_MS)
    const finish = setTimeout(onDone, lines.length * LINE_MS + HOLD_MS + FADE_MS)
    return () => [...timers, startFade, finish].forEach(clearTimeout)
  }, [lines, reduced, onDone])

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

  return (
    <div
      className={`scanlines fixed inset-0 z-[100] flex flex-col justify-center bg-ink px-6 transition-opacity duration-500 sm:px-12 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="mx-auto w-full max-w-2xl text-sm sm:text-base">
        <p className="mb-6 text-dim">
          {profile.handle}@portfolio <span className="text-line">·</span> v1.0.0
        </p>
        <ul className="space-y-1.5">
          {lines.slice(0, count).map((line, i) => (
            <li key={line} className="animate-rise">
              <span className="text-acc">[ok]</span>{' '}
              <span className="text-dim">{line}</span>
              {i === count - 1 && count < lines.length && <span className="caret" />}
            </li>
          ))}
        </ul>
        {count >= lines.length && (
          <p className="mt-6 text-acc">
            {profile.handle}@portfolio:~$<span className="caret" />
          </p>
        )}
      </div>
      <p className="absolute inset-x-0 bottom-8 text-center text-xs text-dim/60">{skipLabel}</p>
    </div>
  )
}
