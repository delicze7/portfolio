import { useLang } from '../i18n/LanguageContext.jsx'
import { slibeShots, slibeThumbs, slibeLogo, projectShots } from '../content.js'
import Section from './Section.jsx'
import Featured from './Featured.jsx'
import ProjectCard from './ProjectCard.jsx'

export default function Work() {
  const { t } = useLang()
  const { labels } = t.work

  return (
    <Section id="work" index={1} file="work.md" heading={t.work.heading} note={t.work.note}>
      <Featured
        project={t.work.featured}
        labels={labels}
        shotUrls={slibeShots}
        thumbUrls={slibeThumbs}
        logo={slibeLogo}
      />

      {t.work.items.length > 0 && (
        <div className="mt-16">
          <p className="text-xs text-dim sm:text-sm">
            <span className="text-acc">$</span> ls {labels.othersDir}/
          </p>
          <div className="mt-3 flex items-baseline gap-4">
            <h3 className="text-lg font-bold tracking-tight text-fg sm:text-xl">{labels.others}</h3>
            <span className="h-px flex-1 bg-line" />
          </div>

          <div className="mt-8 space-y-6">
            {t.work.items.map((item) => (
              <ProjectCard key={item.id} project={item} labels={labels} shots={projectShots} />
            ))}
          </div>
        </div>
      )}
    </Section>
  )
}
