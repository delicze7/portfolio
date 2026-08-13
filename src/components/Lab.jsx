import { useLang } from '../i18n/LanguageContext.jsx'
import { WIP_SECTIONS } from '../content.js'
import Section from './Section.jsx'

export default function Lab() {
  const { t } = useLang()

  return (
    <Section
      id="lab"
      index={5}
      file="lab/"
      heading={t.lab.heading}
      note={t.lab.note}
      wip={WIP_SECTIONS.includes('lab')}
      wipCopy={t.wip}
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.lab.items.map((item) => {
          const Tag = item.href ? 'a' : 'div'
          return (
            <li key={item.name}>
              <Tag
                {...(item.href ? { href: item.href, target: '_blank', rel: 'noreferrer' } : {})}
                className="flex h-full flex-col rounded-lg border border-line bg-panel p-5 transition-colors hover:border-acc/40 hover:bg-raised"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold text-fg">{item.name}</h3>
                  {item.href && <span className="text-xs text-dim">↗</span>}
                </div>
                <p className="mt-2 flex-1 font-sans text-xs leading-relaxed text-dim">
                  {item.desc}
                </p>
                <span className="mt-4 self-start rounded border border-line px-2 py-0.5 text-[10px] text-dim">
                  {item.tag}
                </span>
              </Tag>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
