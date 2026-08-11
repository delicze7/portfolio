import { useState } from 'react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { slibeShots, slibeThumbs, slibeLogo } from '../content.js'
import Section from './Section.jsx'
import Featured from './Featured.jsx'

const FIELD_COLORS = {
  problem: 'border-warn/50',
  decision: 'border-acc2/50',
  tradeoff: 'border-warn/50',
  result: 'border-acc/50',
}

function CaseStudy({ item, labels }) {
  const [open, setOpen] = useState(false)

  return (
    <article className="group rounded-lg border border-line bg-panel transition-colors hover:border-acc/40">
      <div className="p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-lg font-bold text-fg transition-colors group-hover:text-acc">
            <span className="text-line">./</span>
            {item.name}
          </h3>
          <span className="shrink-0 text-xs text-dim">{item.year}</span>
        </div>

        <p className="mt-2 font-sans text-sm leading-relaxed text-dim">{item.blurb}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {item.stack.map((s) => (
            <li
              key={s}
              className="rounded border border-line bg-raised px-2 py-0.5 text-[11px] text-fg/70"
            >
              {s}
            </li>
          ))}
        </ul>

        {open && (
          <dl className="mt-6 animate-rise space-y-4">
            {['problem', 'decision', 'tradeoff', 'result'].map((field) => (
              <div key={field} className={`border-l-2 pl-4 ${FIELD_COLORS[field]}`}>
                <dt className="text-[11px] tracking-wide text-dim uppercase">{labels[field]}</dt>
                <dd className="mt-1 font-sans text-sm leading-relaxed text-fg/85">
                  {item[field]}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="text-acc transition-opacity hover:opacity-70"
          >
            <span className="text-line">{open ? '▾' : '▸'}</span>{' '}
            {open ? labels.collapse : labels.expand}
          </button>

          {item.links.live && (
            <a
              href={item.links.live}
              target="_blank"
              rel="noreferrer"
              className="text-dim transition-colors hover:text-fg"
            >
              {labels.live} ↗
            </a>
          )}
          {item.links.source && (
            <a
              href={item.links.source}
              target="_blank"
              rel="noreferrer"
              className="text-dim transition-colors hover:text-fg"
            >
              {labels.source} ↗
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Work() {
  const { t } = useLang()

  return (
    <Section id="work" index={1} file="work.md" heading={t.work.heading} note={t.work.note}>
      <Featured
        project={t.work.featured}
        labels={t.work.labels}
        shotUrls={slibeShots}
        thumbUrls={slibeThumbs}
        logo={slibeLogo}
      />

      {t.work.items.length > 0 && (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {t.work.items.map((item) => (
            <CaseStudy key={item.id} item={item} labels={t.work.labels} />
          ))}
        </div>
      )}
    </Section>
  )
}
