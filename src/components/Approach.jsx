import { useLang } from '../i18n/LanguageContext.jsx'
import Section from './Section.jsx'

export default function Approach() {
  const { t } = useLang()

  return (
    <Section
      id="approach"
      index={2}
      file="approach.md"
      heading={t.approach.heading}
      note={t.approach.note}
    >
      <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
        {t.approach.items.map((item, i) => (
          <li key={item.title} className="bg-panel p-6 transition-colors hover:bg-raised">
            <p className="text-xs text-line">// {String(i + 1).padStart(2, '0')}</p>
            <h3 className="mt-2 text-base font-bold text-acc">{item.title}</h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-dim">{item.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
