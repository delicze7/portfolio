import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useInView } from '../hooks.js'
import { cx } from '../utils.js'

const FIELD_BORDER = {
  problem: 'border-warn/50',
  decision: 'border-acc2/50',
  tradeoff: 'border-warn/50',
  result: 'border-acc/50',
}

/** Growth bars that fill in once the block is scrolled into view. */
function Growth({ entries, label }) {
  const [ref, inView] = useInView({ threshold: 0.3 })
  const max = Math.max(...entries.map((e) => e.value))

  return (
    <div ref={ref}>
      <p className="text-xs text-dim">
        <span className="text-acc">$</span> {label}
      </p>
      <ul className="mt-4 space-y-2.5">
        {entries.map((entry, i) => (
          <li key={entry.when} className="flex items-center gap-3 text-xs">
            <span className="w-24 shrink-0 text-dim sm:w-32">{entry.when}</span>
            <span className="h-5 flex-1 overflow-hidden rounded-sm bg-raised">
              <span
                className="block h-full rounded-sm bg-acc/60 transition-[width] duration-1000 ease-out"
                style={{
                  // Floor the width so the first data point stays visible next
                  // to a value 26x larger.
                  width: inView ? `${Math.max(5, (entry.value / max) * 100)}%` : '0%',
                  transitionDelay: `${i * 160}ms`,
                }}
              />
            </span>
            <span className="w-16 shrink-0 text-right font-bold text-fg sm:w-20">
              {entry.display}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Full-size view: screen on the left, what it does on the right.
 *
 * Rendered through a portal on `document.body`. The section wrapper animates
 * transform and opacity, and a filling animation on those properties promotes
 * the element to its own stacking context — a `fixed` child of it cannot paint
 * above the site nav no matter how high its z-index goes.
 */
function Lightbox({ shots, index, onIndex, onClose, closeLabel }) {
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
        className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-line bg-panel shadow-2xl shadow-black/60 focus:outline-none sm:flex-row"
      >
        {/* Screen */}
        <div className="flex shrink-0 items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(74,222,128,0.09),transparent_70%)] p-5 sm:w-[44%] sm:p-8">
          <img
            key={shot.src}
            src={shot.src}
            alt={shot.caption}
            className="max-h-[34vh] w-auto max-w-full object-contain sm:max-h-[70vh]"
          />
        </div>

        {/* What it does */}
        <div className="flex min-h-0 flex-1 flex-col border-t border-line p-5 sm:border-t-0 sm:border-l sm:p-8">
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
                  <li key={other.file} className="min-w-0 flex-1">
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

/**
 * One row of screens that scrolls sideways. It bleeds past the card padding so
 * a partly-cut screen is visible at the edge — that, plus the scrollbar, is what
 * tells you there is more without needing a caption to say so.
 */
function Gallery({ shots, urls, thumbs, label, closeLabel }) {
  const [open, setOpen] = useState(null)
  const available = shots
    // `thumb` feeds the strip, `src` the lightbox — fall back to the full file
    // if a thumbnail was never generated.
    .map((shot) => ({ ...shot, src: urls[shot.file], thumb: thumbs?.[shot.file] ?? urls[shot.file] }))
    .filter((s) => s.src)
  if (available.length === 0) return null

  return (
    <div>
      <p className="text-xs text-dim">
        <span className="text-acc">$</span> ls {label}/
      </p>

      <div className="-mx-5 mt-4 snap-x snap-mandatory overflow-x-auto scroll-px-5 px-5 pb-4 sm:-mx-8 sm:scroll-px-8 sm:px-8">
        <ul className="flex w-max gap-4">
          {available.map((shot, i) => (
            <li key={shot.file} className="w-[46vw] max-w-[11rem] shrink-0 snap-start sm:w-44">
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group block w-full cursor-zoom-in"
              >
                <span className="block rounded-lg border border-line bg-[radial-gradient(ellipse_at_center,rgba(74,222,128,0.08),transparent_72%)] p-2 transition-colors group-hover:border-acc/40">
                  <img
                    src={shot.thumb}
                    alt={shot.caption}
                    loading="lazy"
                    decoding="async"
                    className="mx-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </span>
                <span className="mt-2 block truncate text-center text-[11px] text-dim transition-colors group-hover:text-acc">
                  <span className="text-line">{String(i + 1).padStart(2, '0')}_</span>
                  {shot.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {open !== null && (
        <Lightbox
          shots={available}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
          closeLabel={closeLabel}
        />
      )}
    </div>
  )
}

export default function Featured({ project, labels, shotUrls, thumbUrls, logo }) {
  return (
    <article className="rounded-lg border border-line bg-panel p-5 sm:p-8">
      {/* Header — the wordmark stands in for the project title. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <h3 className="flex items-center gap-3">
          {/* Empty alt: the wordmark and the text below say the same thing, and
              a screen reader should hear it once. */}
          {logo && <img src={logo} alt="" className="h-4 w-auto sm:h-5" />}
          {logo && <span className="h-4 w-px bg-line" aria-hidden="true" />}
          <span className="text-xl font-bold tracking-tight text-fg sm:text-2xl">
            {project.name}
          </span>
        </h3>
        <span className="flex items-center gap-2 rounded border border-acc/40 px-2 py-0.5 text-[11px] text-acc">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acc opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-acc" />
          </span>
          {labels.live}
        </span>
        <span className="text-xs text-dim">{project.year}</span>
      </div>

      <p className="mt-5 max-w-3xl font-sans text-lg leading-relaxed text-fg/85">
        {project.tagline}
      </p>

      {/* What this person actually did — the whole point of a portfolio. */}
      {project.role && (
        <div className="mt-6 border-l-2 border-acc/60 pl-4">
          <p className="text-[11px] tracking-wider text-dim uppercase">{labels.role}</p>
          <p className="mt-1 max-w-3xl font-sans text-sm leading-relaxed text-fg/85">
            {project.role}
          </p>
        </div>
      )}

      {/* Metrics */}
      <dl className="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
        {project.metrics.map((metric) => (
          <div key={metric.k} className="bg-raised/40 px-5 py-4">
            <dd className="text-2xl font-bold text-acc sm:text-3xl">{metric.v}</dd>
            <dt className="mt-1 text-[11px] tracking-wider text-dim uppercase">{metric.k}</dt>
          </div>
        ))}
      </dl>

      <div className="mt-10">
        <Gallery
          shots={project.shots}
          urls={shotUrls}
          thumbs={thumbUrls}
          label={labels.gallery}
          closeLabel={labels.close}
        />
      </div>

      {/* Case study — fields left empty are skipped rather than shown blank. */}
      <dl className="mt-10 grid gap-6 sm:grid-cols-2">
        {['problem', 'decision', 'tradeoff', 'result']
          .filter((field) => project[field])
          .map((field) => (
            <div key={field} className={`border-l-2 pl-4 ${FIELD_BORDER[field]}`}>
              <dt className="text-[11px] tracking-wider text-dim uppercase">{labels[field]}</dt>
              <dd className="mt-1.5 font-sans text-sm leading-relaxed text-fg/85">
                {project[field]}
              </dd>
            </div>
          ))}
      </dl>

      <div className="mt-10">
        <Growth entries={project.growth} label={labels.growth} />
      </div>

      {/* Stack */}
      {project.stack?.length > 0 && (
        <div className="mt-10">
          <p className="text-xs text-dim">
            <span className="text-acc">$</span> {labels.stack}
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded border border-line bg-raised px-2.5 py-1 text-xs text-fg/75"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Press */}
      {project.press?.length > 0 && (
        <div className="mt-10">
          <p className="text-xs text-dim">
            <span className="text-acc">$</span> {labels.press}
          </p>
          <ul className="mt-3 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
            {project.press.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col bg-panel p-4 transition-colors hover:bg-raised"
                >
                  <span className="flex items-baseline justify-between gap-3 text-[11px]">
                    <span className="text-acc2 group-hover:underline">{item.outlet}</span>
                    <span className="text-dim">{item.date}</span>
                  </span>
                  <span className="mt-1.5 font-sans text-sm leading-snug text-fg/80">
                    {item.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Call to action */}
      <div className="mt-10 flex flex-wrap gap-3">
        {project.links.live && (
          <a
            href={project.links.live}
            target="_blank"
            rel="noreferrer"
            className="rounded border border-acc/60 bg-acc/10 px-4 py-2 text-sm text-acc transition-colors hover:bg-acc/20"
          >
            {labels.visit} {project.name} ↗
          </a>
        )}
        {project.links.source && (
          <a
            href={project.links.source}
            target="_blank"
            rel="noreferrer"
            className="rounded border border-line px-4 py-2 text-sm text-dim transition-colors hover:border-fg/40 hover:text-fg"
          >
            {labels.source} ↗
          </a>
        )}
      </div>

      {/* Ko-fi — last thing on the card, with the reason it exists. */}
      {project.links.kofi && (
        <div className="mt-6 flex flex-col gap-4 rounded-lg border border-line bg-raised/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl font-sans text-xs leading-relaxed text-dim">
            {labels.kofiNote}
          </p>
          <a
            href={project.links.kofi}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded border border-warn/50 bg-warn/10 px-4 py-2 text-sm text-warn transition-colors hover:bg-warn/20"
          >
            ☕ {labels.kofi} ↗
          </a>
        </div>
      )}
    </article>
  )
}
