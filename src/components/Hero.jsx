import { useLang } from '../i18n/LanguageContext.jsx'
import { profile } from '../content.js'
import { useTyped, useTypewriterCycle } from '../hooks.js'
import { MOD } from '../utils.js'
import Portrait from './Portrait.jsx'

/** Offset between fact lines so they don't all animate at once. */
const FACT_STAGGER = 1700

function Prompt({ children, caret, bare }) {
  return (
    <p className={bare ? 'text-[11px]' : 'text-sm sm:text-base'}>
      {bare ? (
        <span className="text-acc">$</span>
      ) : (
        <>
          <span className="text-acc">{profile.handle}@portfolio</span>
          <span className="text-dim">:~$</span>
        </>
      )}{' '}
      <span className={bare ? 'text-dim' : 'text-fg'}>{children}</span>
      {caret && <span className="caret" />}
    </p>
  )
}

/** One `label / value` row. The label is fixed; the value keeps rewriting itself. */
function Fact({ label, values, active, delay }) {
  const { text, phase } = useTypewriterCycle(values, {
    active,
    delay,
    typeSpeed: 52,
    eraseSpeed: 24,
    hold: 3400,
  })

  return (
    <div className="py-2.5">
      <dt className="text-[10px] tracking-[0.14em] text-dim/70 uppercase">{label}</dt>
      <dd className="mt-1 min-h-[1.4em] text-sm text-fg/90">
        {text}
        {phase !== 'holding' && <span className="caret" />}
      </dd>
    </div>
  )
}

export default function Hero({ ready }) {
  const { t } = useLang()

  // Two commands in sequence: `whoami` prints the intro, then `cat profile.txt`
  // opens the panel under the photo.
  const [cmd1, cmd1Done] = useTyped(t.hero.command, { speed: 65, delay: 300, active: ready })
  const [cmd2, cmd2Done] = useTyped(t.hero.commandProfile, {
    speed: 45,
    delay: 500,
    active: cmd1Done,
  })

  return (
    <section id="top" className="relative flex min-h-screen items-center px-5 pt-24 pb-16 sm:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="scanlines relative overflow-hidden rounded-lg border border-line bg-panel shadow-2xl shadow-black/50">
          <div className="flex items-center gap-2 border-b border-line bg-raised/60 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="mx-auto text-[11px] text-dim">
              {profile.handle}@portfolio — ~/about
            </span>
          </div>

          <div className="px-5 py-7 sm:px-8 sm:py-10">
            <Prompt caret={!cmd1Done}>{cmd1}</Prompt>

            {cmd1Done && (
              <div className="mt-7 flex animate-rise flex-col gap-10 sm:flex-row sm:items-start sm:gap-10">
                {/* Left: who you are and where to go next. */}
                <div className="order-2 min-w-0 flex-1 sm:order-1">
                  <h1 className="text-3xl font-bold tracking-tight text-fg text-glow sm:text-5xl">
                    {profile.name}
                  </h1>
                  <p className="mt-2 text-base text-acc sm:text-lg">{t.hero.role}</p>
                  <p className="mt-5 font-sans text-lg leading-relaxed text-fg/90 sm:text-xl">
                    {t.hero.tagline}
                  </p>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-dim sm:text-base">
                    {t.hero.description}
                  </p>

                  {cmd2Done && (
                    <div className="mt-8 flex animate-rise flex-wrap items-center gap-3">
                      {t.hero.ctas.map((cta, i) => (
                        <a
                          key={cta.href}
                          href={cta.href}
                          className={
                            i === 0
                              ? 'rounded border border-acc/60 bg-acc/10 px-4 py-2 text-sm text-acc transition-colors hover:bg-acc/20'
                              : 'rounded border border-line px-4 py-2 text-sm text-dim transition-colors hover:border-fg/40 hover:text-fg'
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
                  )}
                </div>

                {/* Right: the photo, with the profile panel stacked underneath it. */}
                <aside className="order-1 mx-auto w-full max-w-[15rem] shrink-0 sm:order-2 sm:mx-0 sm:w-60 sm:max-w-none">
                  <Portrait
                    src={profile.photo}
                    alt={t.hero.portrait.alt}
                    caption={t.hero.portrait.caption}
                    labels={t.hero.portrait}
                  />

                  <div className="mt-6">
                    <Prompt bare caret={!cmd2Done}>
                      {cmd2}
                    </Prompt>

                    {cmd2Done && (
                      <dl className="mt-3 animate-rise divide-y divide-line border-y border-line">
                        {t.hero.facts.map((fact, i) => (
                          <Fact
                            key={fact.k}
                            label={fact.k}
                            values={fact.v}
                            active={cmd2Done}
                            delay={i * FACT_STAGGER}
                          />
                        ))}
                      </dl>
                    )}
                  </div>
                </aside>
              </div>
            )}
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-dim/70">
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
    </section>
  )
}
