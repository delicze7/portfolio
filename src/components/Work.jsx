import { useLang } from '../i18n/LanguageContext.jsx'
import { slibeShots, slibeThumbs, slibeLogo, projectShots } from '../content.js'
import Section from './Section.jsx'
import ProjectList from './ProjectList.jsx'

export default function Work() {
  const { t } = useLang()
  const { labels } = t.work

  // One list, the headline project first. Each item carries its own way of
  // finding screenshots: the featured project keeps its folder and its
  // thumbnails, the rest live under src/assets/projects/<id>/.
  const items = [
    {
      ...t.work.featured,
      logo: slibeLogo,
      live: true,
      orientation: 'phone',
      resolve: (file) => ({ src: slibeShots[file], thumb: slibeThumbs[file] ?? slibeShots[file] }),
    },
    ...t.work.items.map((item) => ({
      ...item,
      // A project gets a wordmark by dropping a file with "logo" in its name
      // into its own folder — `logo.png`, `logo-financije.png`,
      // `financije-logo.png`, whichever way round it is written. Nothing to
      // wire up, and the row goes without if there is none.
      logo: Object.entries(projectShots).find(
        ([key]) => key.startsWith(`${item.id}/`) && /logo/i.test(key),
      )?.[1],
      resolve: (file) => {
        const src = projectShots[`${item.id}/${file}`]
        return { src, thumb: src }
      },
    })),
  ]

  return (
    <Section id="work" index={1} file="work.md" heading={t.work.heading} note={t.work.note}>
      <ProjectList items={items} labels={labels} />
    </Section>
  )
}
