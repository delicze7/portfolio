import { useLang } from '../i18n/LanguageContext.jsx'
import { profile } from '../content.js'
import { useCopy } from '../hooks.js'
import Section from './Section.jsx'

export default function Contact() {
  const { t } = useLang()
  const [copied, copy] = useCopy()
  const c = t.contact

  return (
    <Section id="contact" index={6} file="contact.sh" heading={c.heading}>
      <div className="relative overflow-hidden rounded-lg border border-line bg-panel p-6 sm:p-10">
        {/* Closing beat of the page, so it gets the one warm spot on it. */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(74,222,128,0.10),transparent_60%)]" />

        <div className="relative">
          <p className="max-w-2xl font-sans text-xl leading-snug font-semibold text-fg sm:text-2xl">
            {c.lead}
          </p>
          <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-dim sm:text-base">
            {c.pitch}
          </p>

          {/* The address, as the output of a command rather than a list item. */}
          <div className="mt-9">
            <p className="text-xs text-dim sm:text-sm">
              <span className="text-acc">{profile.handle}@portfolio</span>
              <span className="text-dim">:~$</span> <span className="text-fg">{c.command}</span>
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-3">
              <a
                href={`mailto:${profile.email}`}
                className="text-xl font-bold break-all text-acc transition-opacity hover:opacity-75 sm:text-3xl"
              >
                {profile.email}
              </a>
              <button
                type="button"
                onClick={() => copy(profile.email)}
                className="shrink-0 rounded border border-line px-2.5 py-1 text-[11px] text-dim transition-colors hover:border-acc/50 hover:text-acc"
              >
                {copied ? `✓ ${c.copied}` : c.copy}
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="rounded border border-acc/60 bg-acc/10 px-5 py-2.5 text-sm text-acc transition-colors hover:bg-acc/20"
            >
              ./{c.send}
            </a>

            {profile.links.linkedin && (
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="rounded border border-line px-5 py-2.5 text-sm text-dim transition-colors hover:border-fg/40 hover:text-fg"
              >
                {c.linkedin} ↗
              </a>
            )}
          </div>

          <div className="mt-9 flex flex-col gap-2 border-t border-line pt-6 text-xs text-dim sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acc opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-acc" />
              </span>
              {c.availability}
            </p>
            <p>{c.responseTime}</p>
          </div>
        </div>
      </div>
    </Section>
  )
}
