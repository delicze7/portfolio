import { useState } from 'react'
import { cx } from '../utils.js'
import Lightbox from './Lightbox.jsx'

const FIELD_BORDER = {
  problem: 'border-warn/50',
  solution: 'border-acc2/50',
  result: 'border-acc/50',
}

/**
 * A project below the featured one. Everything is visible at once — an earlier
 * version hid the write-up behind an expand toggle, and on a portfolio what sits
 * behind a click mostly goes unread.
 *
 * Screenshots here are desktop screens, so they sit side by side at half the
 * card's width rather than in the featured card's phone-sized strip, and open
 * in the lightbox's wide layout.
 */
export default function ProjectCard({ project, labels, shots }) {
  const [open, setOpen] = useState(null)
  const screens = (project.shots ?? [])
    .map((shot) => {
      const src = shots[`${project.id}/${shot.file}`]
      return { ...shot, src, thumb: src }
    })
    .filter((shot) => shot.src)

  return (
    // The id is what a work-history entry links to.
    <article id={`project-${project.id}`} className="rounded-lg border border-line bg-panel p-5 sm:p-8">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h4 className="text-xl font-bold tracking-tight text-fg sm:text-2xl">
          <span className="text-line">./</span>
          {project.name}
        </h4>
        {project.badge && (
          <span className="rounded border border-acc2/40 px-2 py-0.5 text-[11px] text-acc2">
            {project.badge}
          </span>
        )}
        {project.year && <span className="text-xs text-dim">{project.year}</span>}
      </div>
      {project.context && <p className="mt-2 text-xs text-dim">{project.context}</p>}

      <p className="mt-5 max-w-3xl font-sans text-lg leading-relaxed text-fg/85">
        {project.tagline}
      </p>

      {screens.length > 0 && (
        <ul className={cx('mt-8 grid gap-4', screens.length > 1 && 'sm:grid-cols-2')}>
          {screens.map((shot, i) => (
            <li key={shot.file}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group block w-full cursor-zoom-in text-left"
              >
                <span className="block overflow-hidden rounded-lg border border-line bg-raised/40 transition-colors group-hover:border-acc/40">
                  <img
                    src={shot.src}
                    alt={shot.caption}
                    loading="lazy"
                    decoding="async"
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </span>
                <span className="mt-2 block text-[11px] text-dim transition-colors group-hover:text-acc">
                  <span className="text-line">{String(i + 1).padStart(2, '0')}_</span>
                  {shot.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Fields left empty are skipped rather than shown blank. */}
      <dl className="mt-8 grid gap-6 sm:grid-cols-3">
        {['problem', 'solution', 'result']
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

      {/* What comes next, marked the same way as the sections still in progress. */}
      {project.next && (
        <p className="mt-8 flex max-w-3xl items-start gap-3 font-sans text-sm leading-relaxed text-dim">
          <span className="relative mt-[0.45rem] flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warn opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-warn" />
          </span>
          <span>
            <span className="font-mono text-[11px] tracking-wider text-warn uppercase">
              {labels.next}
            </span>{' '}
            — {project.next}
          </span>
        </p>
      )}

      {project.stack?.length > 0 && (
        <ul className="mt-8 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded border border-line bg-raised px-2.5 py-1 text-xs text-fg/75"
            >
              {tech}
            </li>
          ))}
        </ul>
      )}

      {open !== null && (
        <Lightbox
          shots={screens}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
          closeLabel={labels.close}
          wide
        />
      )}
    </article>
  )
}
