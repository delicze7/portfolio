import { useLang } from '../i18n/LanguageContext.jsx'
import { profile } from '../content.js'
import { useCopy } from '../hooks.js'
import Section from './Section.jsx'

export default function Contact() {
  const { t } = useLang()
  const [copied, copy] = useCopy()

  return (
    <Section id="contact" index={6} file="contact.sh" heading={t.contact.heading}>
      <div className="rounded-lg border border-line bg-panel p-6 sm:p-8">
        <p className="max-w-2xl font-sans text-sm leading-relaxed text-dim">{t.contact.pitch}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="text-xl font-bold break-all text-acc transition-opacity hover:opacity-75 sm:text-2xl"
          >
            {profile.email}
          </a>
          <button
            type="button"
            onClick={() => copy(profile.email)}
            className="rounded border border-line px-2.5 py-1 text-[11px] text-dim transition-colors hover:border-acc/50 hover:text-acc"
          >
            {copied ? `✓ ${t.contact.copied}` : t.contact.copy}
          </button>
        </div>

        <p className="mt-4 flex items-center gap-2 text-xs text-dim">
          <span className="h-1.5 w-1.5 rounded-full bg-acc" />
          {t.contact.availability}
        </p>

        <div className="mt-8 border-t border-line pt-6">
          <p className="text-xs text-dim">{t.contact.elsewhere}</p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                className="text-fg/80 transition-colors hover:text-acc"
              >
                github ↗
              </a>
            </li>
            <li>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-fg/80 transition-colors hover:text-acc"
              >
                linkedin ↗
              </a>
            </li>
          </ul>
        </div>
      </div>
    </Section>
  )
}
