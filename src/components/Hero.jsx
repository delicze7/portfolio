import { useLang } from '../i18n/LanguageContext.jsx'
import { profile } from '../content.js'
import { useTyped, useTypewriterCycle } from '../hooks.js'
import { MOD, cx } from '../utils.js'
import HeroVisual from './HeroVisual.jsx'

/** Offset between fact lines so they don't all animate at once. */
const FACT_STAGGER = 1700
const SEP = '  ·  '

function Prompt({ children, caret }) {
  return (
    <p className="text-sm sm:text-base">
      <span className="text-acc">{profile.handle}@portfolio</span>
      <span className="text-dim">:~$</span> <span className="text-fg">{children}</span>
      {caret && <span className="caret" />}
    </p>
  )
}

/** `label · value`, printed like program output. The label is fixed; the value keeps rewriting itself. */
function FactLine({ label, width, values, active, delay }) {
  const { text, phase } = useTypewriterCycle(values, {
    active,
    delay,
    typeSpeed: 52,
    eraseSpeed: 24,
    hold: 3400,
  })

  return (
    <div className="whitespace-pre">
      <dt className="inline text-dim">{label.padEnd(width)}</dt>
      <dd className="inline">
        <span className="text-line">{SEP}</span>
        <span className="text-fg/90">{text}</span>
        {phase !== 'holding' && <span className="caret" />}
      </dd>
    </div>
  )
}

export default function Hero({ ready }) {
  const { t } = useLang()

  // Two commands in sequence: `whoami` prints the intro, then `cat profile.txt`
  // prints the facts.
  const [cmd1, cmd1Done] = useTyped(t.hero.command, { speed: 65, delay: 300, active: ready })
  const [cmd2, cmd2Done] = useTyped(t.hero.commandProfile, {
    speed: 45,
    delay: 500,
    active: cmd1Done,
  })

  const labelWidth = Math.max(...t.hero.facts.map((f) => f.k.length))
  const hasPhoto = Boolean(profile.hero)

  return (
    <section id="top" className="relative flex min-h-svh flex-col overflow-hidden lg:justify-center">
      {hasPhoto && <HeroVisual src={profile.hero} alt={t.hero.portrait.alt} ready={ready} />}

      {/* Small screens: the copy starts just above the photo's faded bottom
          edge. Wide screens: it sits in the dark left half, clear of the face. */}
      <div
        className={cx(
          'relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8',
          hasPhoto ? 'pt-[86vw] lg:pt-24' : 'pt-28',
        )}
      >
        <div className="max-w-xl">
          <Prompt caret={!cmd1Done}>{cmd1}</Prompt>

          {cmd1Done && (
            <div className="mt-6 animate-rise">
              <h1 className="text-4xl font-bold tracking-tight text-fg sm:text-6xl lg:text-7xl">
                {profile.name}
              </h1>
              <p className="mt-3 text-base text-acc sm:text-lg">{t.hero.role}</p>
              <p className="mt-6 font-sans text-lg leading-relaxed text-fg/90 sm:text-xl">
                {t.hero.tagline}
              </p>
              <p className="mt-3 font-sans text-sm leading-relaxed text-dim sm:text-base">
                {t.hero.description}
              </p>
            </div>
          )}

          {cmd1Done && (
            <div className="mt-9">
              <Prompt caret={!cmd2Done}>{cmd2}</Prompt>
              {cmd2Done && (
                <dl className="mt-3 animate-rise space-y-1 text-xs sm:text-sm">
                  {t.hero.facts.map((fact, i) => (
                    <FactLine
                      key={fact.k}
                      label={fact.k}
                      width={labelWidth}
                      values={fact.v}
                      active={cmd2Done}
                      delay={i * FACT_STAGGER}
                    />
                  ))}
                </dl>
              )}
            </div>
          )}

          {cmd2Done && (
            <div className="animate-rise">
              <div className="mt-9 flex flex-wrap items-center gap-3">
                {t.hero.ctas.map((cta, i) => (
                  <a
                    key={cta.href}
                    href={cta.href}
                    className={
                      i === 0
                        ? 'rounded border border-acc/60 bg-acc/10 px-4 py-2 text-sm text-acc transition-colors hover:bg-acc/20'
                        : 'rounded border border-line bg-ink/60 px-4 py-2 text-sm text-dim transition-colors hover:border-fg/40 hover:text-fg'
                    }
                  >
                    ./{cta.label}
                  </a>
                ))}

                <span className="flex items-center gap-2 pl-1 text-xs text-dim">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acc opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-acc" />
                  </span>
                  {t.hero.status}
                </span>
              </div>

              <p className="mt-6 text-xs text-dim/70">
                <kbd className="rounded border border-line bg-raised px-1.5 py-0.5 text-[10px] text-fg/70">
                  {MOD}
                </kbd>{' '}
                +{' '}
                <kbd className="rounded border border-line bg-raised px-1.5 py-0.5 text-[10px] text-fg/70">
                  K
                </kbd>{' '}
                {t.hero.hint}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
