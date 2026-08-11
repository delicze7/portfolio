import { useCallback, useEffect, useState } from 'react'
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

/** Full-size view of one screenshot, with keyboard paging. */
function Lightbox({ shots, index, onIndex, onClose, closeLabel }) {
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
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [go, onClose])

  const shot = shots[index]

  return (
    <div
      className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-black/88 p-4 backdrop-blur-sm"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={shot.label}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="absolute top-4 right-4 rounded border border-line px-2.5 py-1 text-sm text-dim transition-colors hover:border-acc/50 hover:text-acc"
      >
        ✕
      </button>

      <img
        key={shot.src}
        src={shot.src}
        alt={shot.caption}
        className="max-h-[64vh] w-auto max-w-full animate-rise object-contain"
      />

      <div className="mt-5 w-full max-w-md text-center">
        <p className="text-xs text-acc">
          {String(index + 1).padStart(2, '0')}_{shot.label}
        </p>
        <p className="mt-2 font-sans text-sm leading-relaxed text-fg/80">{shot.caption}</p>

        {shots.length > 1 && (
          <div className="mt-5 flex items-center justify-center gap-4 text-sm">
            <button
              type="button"
              onClick={() => go(-1)}
              className="rounded border border-line px-3 py-1 text-dim transition-colors hover:border-acc/50 hover:text-acc"
            >
              ‹
            </button>
            <span className="text-xs text-dim">
              {index + 1} / {shots.length}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              className="rounded border border-line px-3 py-1 text-dim transition-colors hover:border-acc/50 hover:text-acc"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Compact contact-sheet gallery: every screen visible at once, click one to see
 * it full size. The renders are transparent PNGs, so they sit on a soft glow
 * rather than in a hard frame.
 */
function Gallery({ shots, urls, thumbs, label, closeLabel }) {
  const [open, setOpen] = useState(null)
  const available = shots
    // `thumb` feeds the grid, `src` the lightbox — fall back to the full file
    // if a thumbnail was never generated.
    .map((shot) => ({ ...shot, src: urls[shot.file], thumb: thumbs?.[shot.file] ?? urls[shot.file] }))
    .filter((s) => s.src)
  if (available.length === 0) return null

  return (
    <div>
      <p className="text-xs text-dim">
        <span className="text-acc">$</span> ls {label}/
      </p>

      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {available.map((shot, i) => (
          <li key={shot.file}>
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
              <span className="mt-2 block text-center text-[11px] text-dim transition-colors group-hover:text-acc">
                <span className="text-line">{String(i + 1).padStart(2, '0')}_</span>
                {shot.label}
              </span>
            </button>
          </li>
        ))}
      </ul>

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
        <h3 className="flex items-center gap-2.5">
          {logo ? (
            <img src={logo} alt={project.name} className="h-6 w-auto sm:h-8" />
          ) : (
            <span className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
              {project.name}
            </span>
          )}
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
