import { useLang } from '../i18n/LanguageContext.jsx'
import Section from './Section.jsx'

const TYPE_COLOR = {
  feat: 'text-acc',
  refactor: 'text-acc2',
  perf: 'text-warn',
  init: 'text-dim',
}

export default function Path() {
  const { t } = useLang()

  return (
    <Section id="path" index={4} file="path.log" heading={t.path.heading} note={t.path.note}>
      <ol className="relative">
        {/* The commit graph line */}
        <span className="absolute top-2 bottom-2 left-[5px] w-px bg-line" aria-hidden="true" />

        {t.path.entries.map((entry, i) => (
          <li key={entry.hash} className="relative pb-10 pl-8 last:pb-0">
            <span
              className={`absolute top-1.5 left-0 h-2.5 w-2.5 rounded-full ring-4 ring-ink ${
                i === 0 ? 'bg-acc' : 'bg-line'
              }`}
              aria-hidden="true"
            />

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
              <code className="text-warn/80">{entry.hash}</code>
              <span className={TYPE_COLOR[entry.type] ?? 'text-dim'}>{entry.type}:</span>
              <h3 className="font-bold text-fg">{entry.title}</h3>
              {i === 0 && (
                <span className="rounded border border-acc/40 px-1.5 py-0.5 text-[10px] text-acc">
                  {t.path.labels.present}
                </span>
              )}
            </div>

            <p className="mt-1.5 text-xs text-dim">
              {entry.org} <span className="text-line">·</span> {entry.period}
            </p>
            <p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-fg/75">
              {entry.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
