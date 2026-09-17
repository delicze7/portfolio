import { useEffect, useState } from 'react'
import { cx } from '../utils.js'
import Lightbox from './Lightbox.jsx'

const FIELD_BORDER = {
  problem: 'border-warn/50',
  solution: 'border-acc2/50',
  result: 'border-acc/50',
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
 * The name, badge, year, one-line summary and stack are always visible; the
 * screens and the write-up sit behind the toggle. The featured project above
 * carries the depth, and with several of these shown in full the section ran
 * past 6000px on a phone — far enough that the featured one gets buried.
 */
function ProjectRow({ project, labels, shots, open, onToggle }) {
  const [lightbox, setLightbox] = useState(null)
  const phone = project.orientation === 'phone'
  const screens = (project.shots ?? [])
    .map((shot) => {
      const src = shots[`${project.id}/${shot.file}`]
      return { ...shot, src, thumb: src }
    })
    .filter((shot) => shot.src)

  return (
    // The id is what a work-history entry links to.
    <li id={`project-${project.id}`} className="scroll-mt-24 border-t border-line last:border-b">
      <h4>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="group flex w-full items-start gap-3 py-5 text-left"
        >
          <span className={cx('mt-1 shrink-0 transition-colors', open ? 'text-acc' : 'text-line group-hover:text-acc')}>
            {open ? '▾' : '▸'}
          </span>

          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-lg font-bold tracking-tight text-fg transition-colors group-hover:text-acc sm:text-xl">
                <span className="text-line">./</span>
                {project.name}
              </span>
              {project.badge && (
                <span className="rounded border border-acc2/40 px-2 py-0.5 text-[11px] text-acc2">
                  {project.badge}
                </span>
              )}
              {project.year && <span className="text-xs text-dim">{project.year}</span>}
            </span>

            <span className="mt-2 block max-w-2xl font-sans text-sm leading-relaxed text-dim">
              {project.summary}
            </span>

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
          </span>
        </button>
      </h4>

      {open && (
        <div className="animate-rise pb-8 pl-7">
          {project.context && <p className="text-xs text-dim">{project.context}</p>}

          {screens.length > 0 && (
            <div className="mt-5">
              <Screens screens={screens} phone={phone} onOpen={setLightbox} />
              {/* Says when screens are a design rather than a running product. */}
              {project.shotsNote && (
                <p className="mt-1 font-sans text-[11px] text-dim/80">{project.shotsNote}</p>
              )}
            </div>
          )}

          {/* Fields left empty are skipped rather than shown blank. */}
          <dl className="mt-6 grid gap-6 sm:grid-cols-3">
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
            <p className="mt-6 flex max-w-3xl items-start gap-3 font-sans text-sm leading-relaxed text-dim">
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

/** The projects below the featured one. One open at a time keeps it short. */
export default function ProjectList({ items, labels, shots }) {
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
          shots={shots}
          open={openId === item.id}
          onToggle={() => setOpenId((id) => (id === item.id ? null : item.id))}
        />
      ))}
    </ul>
  )
}
