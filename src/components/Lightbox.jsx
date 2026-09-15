import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../utils.js'

/**
 * Full-size view of one screenshot, with what it shows and paging between them.
 *
 * Phone screens sit beside their description. `wide` is for desktop
 * screenshots, which sit above it instead — a landscape screen squeezed into a
 * side column comes out too small to read.
 *
 * Rendered through a portal on `document.body`. The section wrapper animates
 * transform and opacity, and a filling animation on those properties promotes
 * the element to its own stacking context — a `fixed` child of it cannot paint
 * above the site nav no matter how high its z-index goes.
 */
export default function Lightbox({ shots, index, onIndex, onClose, closeLabel, wide = false }) {
  const panelRef = useRef(null)
  const go = useCallback(
    (step) => onIndex((index + step + shots.length) % shots.length),
    [index, shots.length, onIndex],
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [go, onClose])

  const shot = shots[index]

  return createPortal(
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={shot.label}
        className={cx(
          'flex max-h-[90vh] w-full flex-col overflow-hidden rounded-lg border border-line bg-panel shadow-2xl shadow-black/60 focus:outline-none',
          wide ? 'max-w-5xl' : 'max-w-4xl sm:flex-row',
        )}
      >
        {/* Screen */}
        <div
          className={cx(
            'flex shrink-0 items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(74,222,128,0.09),transparent_70%)] p-5',
            wide ? 'sm:p-6' : 'sm:w-[44%] sm:p-8',
          )}
        >
          <img
            key={shot.src}
            src={shot.src}
            alt={shot.caption}
            className={cx(
              'w-auto max-w-full object-contain',
              wide ? 'max-h-[54vh] rounded border border-line' : 'max-h-[34vh] sm:max-h-[70vh]',
            )}
          />
        </div>

        {/* What it shows */}
        <div
          className={cx(
            'flex min-h-0 flex-1 flex-col border-t border-line p-5',
            wide ? 'sm:p-6' : 'sm:border-t-0 sm:border-l sm:p-8',
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-acc">
              <span className="text-line">{String(index + 1).padStart(2, '0')}_</span>
              {shot.label}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="-mt-1 shrink-0 rounded border border-line px-2 py-0.5 text-sm text-dim transition-colors hover:border-acc/50 hover:text-acc"
            >
              ✕
            </button>
          </div>

          <p className="mt-4 min-h-0 flex-1 overflow-y-auto font-sans text-sm leading-relaxed text-fg/85">
            {shot.caption}
          </p>

          {shots.length > 1 && (
            <div className="mt-6 shrink-0 border-t border-line pt-5">
              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="previous"
                  className="rounded border border-line px-3 py-1.5 text-sm text-dim transition-colors hover:border-acc/50 hover:text-acc"
                >
                  ‹
                </button>
                <span className="text-xs text-dim">
                  {index + 1} / {shots.length}
                </span>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="next"
                  className="rounded border border-line px-3 py-1.5 text-sm text-dim transition-colors hover:border-acc/50 hover:text-acc"
                >
                  ›
                </button>
              </div>

              {/* Jump straight to a screen — the thumbnails are already loaded. */}
              <ul className="mt-4 flex gap-2">
                {shots.map((other, i) => (
                  <li key={other.file} className={cx('min-w-0 flex-1', wide && 'max-w-[9rem]')}>
                    <button
                      type="button"
                      onClick={() => onIndex(i)}
                      aria-label={other.label}
                      aria-current={i === index}
                      className={cx(
                        'block w-full rounded border p-1 transition-colors',
                        i === index
                          ? 'border-acc/60 bg-acc/10'
                          : 'border-line opacity-55 hover:border-fg/30 hover:opacity-100',
                      )}
                    >
                      <img src={other.thumb} alt="" className="w-full object-contain" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
