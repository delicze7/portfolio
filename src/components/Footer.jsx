import { useLang } from '../i18n/LanguageContext.jsx'
import { profile } from '../content.js'

export default function Footer() {
  const { t } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-xs text-dim sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          <span className="text-line">©</span> {year} {profile.name}. {t.footer.rights}
        </p>
        <p className="sm:text-right">{t.footer.built}</p>
      </div>
    </footer>
  )
}
