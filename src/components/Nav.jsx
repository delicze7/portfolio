import { useLang } from '../i18n/LanguageContext.jsx'
import { SECTIONS, WIP_SECTIONS, profile } from '../content.js'
import { useScrollSpy } from '../hooks.js'
import { MOD, cx } from '../utils.js'

export default function Nav({ onOpenPalette }) {
  const { t, lang, toggle } = useLang()
  const active = useScrollSpy(SECTIONS)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-ink/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-5 sm:px-8">
        <a
          href="#top"
          className="shrink-0 text-sm font-bold tracking-tight text-fg transition-colors hover:text-acc"
        >
          <span className="text-acc">&gt;</span> {profile.handle}
        </a>

        <ul className="mx-auto hidden items-center gap-1 md:flex">
          {SECTIONS.map((id, i) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={cx(
                  'rounded px-2.5 py-1.5 text-xs transition-colors',
                  active === id ? 'text-acc' : 'text-dim hover:text-fg',
                )}
              >
                <span className="text-line">{String(i + 1).padStart(2, '0')}_</span>
                {t.nav[id]}
                {/* Says a section is unfinished before the click, not after. */}
                {WIP_SECTIONS.includes(id) && (
                  <span className="ml-1 align-super text-[8px] text-warn/80">●</span>
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <button
            type="button"
            onClick={toggle}
            className="rounded border border-line px-2 py-1 text-[11px] text-dim transition-colors hover:border-acc/50 hover:text-acc"
            aria-label={`Language: ${lang.toUpperCase()}`}
          >
            <span className={lang === 'en' ? 'text-acc' : ''}>EN</span>
            <span className="text-line"> / </span>
            <span className={lang === 'bs' ? 'text-acc' : ''}>BS</span>
          </button>

          <button
            type="button"
            onClick={onOpenPalette}
            className="flex items-center gap-2 rounded border border-line px-2.5 py-1 text-[11px] text-dim transition-colors hover:border-acc/50 hover:text-acc"
          >
            <span className="hidden sm:inline">{t.nav.command}</span>
            <kbd className="rounded bg-raised px-1.5 py-0.5 font-mono text-[10px] text-fg/70">
              {MOD} K
            </kbd>
          </button>
        </div>
      </nav>
    </header>
  )
}
