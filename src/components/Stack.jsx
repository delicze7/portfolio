import { useLang } from '../i18n/LanguageContext.jsx'
import { WIP_SECTIONS } from '../content.js'
import Section from './Section.jsx'

const LEVEL_STYLE = {
  daily: { dot: 'bg-acc', text: 'text-fg' },
  working: { dot: 'bg-acc2', text: 'text-fg/75' },
  touched: { dot: 'bg-dim', text: 'text-dim' },
}

export default function Stack() {
  const { t } = useLang()

  return (
    <Section
      id="stack"
      index={3}
      file="stack.json"
      heading={t.stack.heading}
      note={t.stack.note}
      wip={WIP_SECTIONS.includes('stack')}
      wipCopy={t.wip}
    >
      {/* Legend — the labels only mean something if you explain them. */}
      <ul className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-xs">
        {Object.entries(t.stack.levels).map(([key, label]) => (
          <li key={key} className="flex items-center gap-2 text-dim">
            <span className={`h-2 w-2 rounded-full ${LEVEL_STYLE[key].dot}`} />
            {label}
          </li>
        ))}
      </ul>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {t.stack.groups.map((group) => (
          <div key={group.name} className="rounded-lg border border-line bg-panel p-5">
            <h3 className="text-sm text-dim">
              <span className="text-line">~/</span>
              {group.name}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {group.items.map((item) => (
                <li key={item.name} className="flex items-center gap-2.5 text-sm">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${LEVEL_STYLE[item.level].dot}`} />
                  <span className={LEVEL_STYLE[item.level].text}>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
