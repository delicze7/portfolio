import { useLang } from '../i18n/LanguageContext.jsx'
import { WIP_SECTIONS } from '../content.js'
import Section from './Section.jsx'

/**
 * The stack, grouped by where a tool sits rather than by how well I know it.
 *
 * There are no levels on purpose. "Daily" and "touched" are claims nobody can
 * check and everybody inflates, and a bar chart of my own confidence says less
 * than the projects above it, where the same names appear with a year and a
 * result attached.
 */
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
      {/* items-start: the groups are different lengths, and a three-item card
          stretched to match an eight-item one is mostly empty box. */}
      <div className="grid grid-cols-2 items-start gap-3 sm:gap-5 lg:grid-cols-4">
        {t.stack.groups.map((group) => (
          <div key={group.name} className="rounded-lg border border-line bg-panel p-4 sm:p-5">
            <h3 className="text-sm text-dim">
              <span className="text-line">~/</span>
              {group.name}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {group.items.map((item) => (
                <li key={item} className="flex items-baseline gap-2.5 text-sm text-fg/85">
                  <span className="text-line" aria-hidden="true">
                    -
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
