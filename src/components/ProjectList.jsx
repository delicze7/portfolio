import { useEffect, useState } from 'react'
import { useInView } from '../hooks.js'
import { cx } from '../utils.js'
import Lightbox from './Lightbox.jsx'

const FIELD_BORDER = {
  problem: 'border-warn/50',
  decision: 'border-acc2/50',
  solution: 'border-acc2/50',
  tradeoff: 'border-warn/50',
  result: 'border-acc/50',
}
/** Featured projects use decision/trade-off, the others a plain solution. */
const FIELDS = ['problem', 'decision', 'solution', 'tradeoff', 'result']

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

/** Screens for one project: a strip for phone shots, two-up for desktop ones. */
function Screens({ screens, phone, onOpen }) {
  const item = (shot, i) => (
    <button
      type="button"
      onClick={() => onOpen(i)}
      className="group block w-full cursor-zoom-in text-left"
    >
      <span
        className={cx(
          'block overflow-hidden rounded-lg border border-line transition-colors group-hover:border-acc/40',
          phone
            ? 'bg-[radial-gradient(ellipse_at_center,rgba(74,222,128,0.08),transparent_72%)] p-2'
            : 'bg-raised/40',
        )}
      >
        <img
          src={phone ? shot.thumb : shot.src}
          alt={shot.caption}
          loading="lazy"
          decoding="async"
          className={cx(
            'w-full transition-transform duration-300 group-hover:scale-[1.03]',
            phone ? 'object-contain' : 'object-cover',
          )}
        />
      </span>
      <span className="mt-2 block truncate text-[11px] text-dim transition-colors group-hover:text-acc">
        <span className="text-line">{String(i + 1).padStart(2, '0')}_</span>
        {shot.label}
      </span>
    </button>
  )

  if (phone) {
    return (
      <div className="snap-x snap-mandatory overflow-x-auto pb-4">
        <ul className="flex w-max gap-4">
          {screens.map((shot, i) => (
            <li key={shot.file} className="w-[42vw] max-w-[10rem] shrink-0 snap-start sm:w-40">
              {item(shot, i)}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <ul className={cx('grid gap-4', screens.length > 1 && 'sm:grid-cols-2')}>
      {screens.map((shot, i) => (
        <li key={shot.file}>{item(shot, i)}</li>
      ))}
    </ul>
  )
}

/**
 * One project as a row that opens in place.
 *
 * Closed, a row carries what someone decides on in a glance: the name, whether
 * it is live, the year, one line about it, its headline numbers and its stack.
 * Everything that has to be read — the role, the screens, the write-up, the
 * growth and the press — waits behind "read more".
 *
 * The numbers stay out in the open on purpose. Shown in full the featured
 * project ran to 3190px on a phone, but "13.000+ registered users" is the one
 * fact that earns the click, so it is not something to hide behind it.
 */
function ProjectRow({ project, labels, open, onToggle }) {
  const [lightbox, setLightbox] = useState(null)
  const phone = project.orientation !== 'wide'
  const screens = (project.shots ?? [])
    .map((shot) => ({ ...shot, ...project.resolve(shot.file) }))
    .filter((shot) => shot.src)
  const fields = FIELDS.filter((field) => project[field])
  const summary = project.summary ?? project.tagline

  return (
    // The id is what a work-history entry links to.
    <li id={`project-${project.id}`} className="scroll-mt-24 border-t border-line last:border-b">
      <h4>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="group block w-full py-6 text-left"
        >
          <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {/* A box rather than a fixed height. Pinning the height alone
                punishes square marks: a 5:1 wordmark fills the row at 20px
                while a 1:1 emblem comes out 20x20 and disappears. Empty alt —
                the mark and the name say the same thing, and a screen reader
                should hear it once. */}
            {project.logo && (
              <img
                src={project.logo}
                alt=""
                className="h-9 w-24 object-contain object-left sm:h-11 sm:w-32"
              />
            )}
            {project.logo && <span className="h-6 w-px bg-line sm:h-8" aria-hidden="true" />}

            <span className="text-lg font-bold tracking-tight text-fg transition-colors group-hover:text-acc sm:text-xl">
              <span className="text-line">./</span>
              {project.name}
            </span>

            {project.live ? (
              <span className="flex items-center gap-2 rounded border border-acc/40 px-2 py-0.5 text-[11px] text-acc">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acc opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-acc" />
                </span>
                {labels.live}
              </span>
            ) : (
              project.badge && (
                <span className="rounded border border-acc2/40 px-2 py-0.5 text-[11px] text-acc2">
                  {project.badge}
                </span>
              )
            )}

            {project.year && <span className="text-xs text-dim">{project.year}</span>}
          </span>

          <span className="mt-3 block max-w-2xl font-sans text-sm leading-relaxed text-dim">
            {summary}
          </span>

          {project.metrics?.length > 0 && (
            <span className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-xs">
              {project.metrics.map((metric) => (
                <span key={metric.k}>
                  <span className="font-bold text-acc">{metric.v}</span>{' '}
                  <span className="text-dim">{metric.k}</span>
                </span>
              ))}
            </span>
          )}

          {project.stack?.length > 0 && (
            <span className="mt-3 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded border border-line bg-raised px-2 py-0.5 text-[11px] text-fg/70"
                >
                  {tech}
                </span>
              ))}
            </span>
          )}

          <span className="mt-4 flex items-center gap-2.5 text-sm text-acc">
            <span className={open ? '' : 'text-line transition-colors group-hover:text-acc'}>
              {open ? '▾' : '▸'}
            </span>
            {open ? labels.close : labels.more}
          </span>
        </button>
      </h4>

      {open && (
        <div className="animate-rise pb-8">
          {project.context && <p className="text-xs text-dim">{project.context}</p>}

          {project.role && (
            <div className="mt-5 border-l-2 border-acc/60 pl-4">
              <p className="text-[11px] tracking-wider text-dim uppercase">{labels.role}</p>
              <p className="mt-1 max-w-3xl font-sans text-sm leading-relaxed text-fg/85">
                {project.role}
              </p>
            </div>
          )}

          {screens.length > 0 && (
            <div className="mt-6">
              <Screens screens={screens} phone={phone} onOpen={setLightbox} />
              {/* Says when screens are a design rather than a running product. */}
              {project.shotsNote && (
                <p className="mt-1 font-sans text-[11px] text-dim/80">{project.shotsNote}</p>
              )}
            </div>
          )}

          {/* Fields left empty are skipped rather than shown blank. */}
          {fields.length > 0 && (
            <dl className="mt-8 grid gap-6 sm:grid-cols-2">
              {fields.map((field) => (
                <div key={field} className={`border-l-2 pl-4 ${FIELD_BORDER[field]}`}>
                  <dt className="text-[11px] tracking-wider text-dim uppercase">{labels[field]}</dt>
                  <dd className="mt-1.5 font-sans text-sm leading-relaxed text-fg/85">
                    {project[field]}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {project.growth?.length > 0 && (
            <div className="mt-8">
              <Growth entries={project.growth} label={labels.growth} />
            </div>
          )}

          {project.press?.length > 0 && (
            <div className="mt-8">
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
                      className="group/press flex h-full flex-col bg-panel p-4 transition-colors hover:bg-raised"
                    >
                      <span className="flex items-baseline justify-between gap-3 text-[11px]">
                        <span className="text-acc2 group-hover/press:underline">{item.outlet}</span>
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

          {(project.links?.live || project.links?.source) && (
            <div className="mt-8 flex flex-wrap gap-3">
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
          )}

          {/* Ko-fi — last thing in the row, with the reason it exists. */}
          {project.links?.kofi && (
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

          {lightbox !== null && (
            <Lightbox
              shots={screens}
              index={lightbox}
              onIndex={setLightbox}
              onClose={() => setLightbox(null)}
              closeLabel={labels.close}
              wide={!phone}
            />
          )}
        </div>
      )}
    </li>
  )
}

/** Every project in one list. One open at a time keeps the section short. */
export default function ProjectList({ items, labels }) {
  const [openId, setOpenId] = useState(null)

  // A link to #project-<id> opens that row, so following one from the work
  // history lands on the write-up rather than on a closed heading.
  useEffect(() => {
    const fromHash = () => {
      const match = window.location.hash.match(/^#project-(.+)$/)
      if (match && items.some((item) => item.id === match[1])) setOpenId(match[1])
    }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => window.removeEventListener('hashchange', fromHash)
  }, [items])

  return (
    <ul>
      {items.map((item) => (
        <ProjectRow
          key={item.id}
          project={item}
          labels={labels}
          open={openId === item.id}
          onToggle={() => setOpenId((id) => (id === item.id ? null : item.id))}
        />
      ))}
    </ul>
  )
}
