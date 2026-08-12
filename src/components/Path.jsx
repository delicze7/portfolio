import { useState } from 'react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { companyLogos } from '../content.js'
import { cx } from '../utils.js'
import Section from './Section.jsx'

const TYPE_COLOR = {
  feat: 'text-acc',
  refactor: 'text-acc2',
  perf: 'text-warn',
  init: 'text-dim',
}

/**
 * Company mark, sitting at the right of an entry like a letterhead.
 *
 * Both logos here are transparent PNGs with dark ink — measured at 62% and 89%
 * dark pixels, with no light pixels at all — so they are invisible on this
 * page as they come. `brightness(0) invert(1)` flattens whatever colour a logo
 * has to pure white while keeping its alpha, so every company reads as one
 * silhouette in the site's own palette. It also means any logo added later
 * works without being edited first, whatever colour it arrives in.
 *
 * `mark` covers self-employment, where there is no logo and inventing one would
 * be worse than not having it.
 */
function CompanyMark({ logo, mark, org }) {
  const src = logo ? companyLogos[logo] : null

  if (src) {
    // A shared box rather than a shared height. Constraining height alone
    // punishes square logos: Tech Towers is 3.7:1 and fills the row at 24px
    // tall, while the 1:1 Kozarac mark comes out 24x24 and disappears. Inside a
    // fixed box each logo scales until it hits whichever edge it reaches first,
    // so a wordmark and a square end up carrying similar weight. `object-right`
    // keeps them flush down the same edge whatever shape they are.
    return (
      <img
        src={src}
        alt={org}
        loading="lazy"
        className="h-10 w-32 object-contain object-right opacity-80 transition-opacity duration-300 group-hover:opacity-100 sm:h-12 sm:w-44"
        style={{ filter: 'brightness(0) invert(1)' }}
      />
    )
  }

  if (mark) {
    return (
      <span className="text-base text-dim transition-colors group-hover:text-acc sm:text-lg">
        <span className="text-acc">{mark}</span> {org.toLowerCase()}
      </span>
    )
  }

  return null
}

/** Work history, drawn as a commit graph. */
function WorkLog({ entries, labels }) {
  return (
    <ol className="relative">
      <span className="absolute top-2 bottom-2 left-[5px] w-px bg-line" aria-hidden="true" />

      {entries.map((entry, i) => (
        <li key={entry.hash} className="group relative pb-10 pl-8 last:pb-0">
          <span
            className={cx(
              'absolute top-1.5 left-0 h-2.5 w-2.5 rounded-full ring-4 ring-ink',
              entry.current ? 'bg-acc' : 'bg-line',
            )}
            aria-hidden="true"
          />

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
            <code className="text-warn/80">{entry.hash}</code>
            <span className={TYPE_COLOR[entry.type] ?? 'text-dim'}>{entry.type}:</span>
            <h4 className="font-bold text-fg">{entry.title}</h4>
            {entry.current && (
              <span className="rounded border border-acc/40 px-1.5 py-0.5 text-[10px] text-acc">
                {labels.present}
              </span>
            )}

            {/* Pushed right, so the marks line up down the edge of the column. */}
            <span className="ml-auto pl-4">
              <CompanyMark logo={entry.logo} mark={entry.mark} org={entry.org} />
            </span>
          </div>

          <p className="mt-2 text-xs text-dim">
            {entry.org} <span className="text-line">·</span> {entry.period}
            {entry.location && (
              <>
                {' '}
                <span className="text-line">·</span> {entry.location}
              </>
            )}
          </p>

          <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-fg/75">
            {entry.body}
          </p>

          {/* The number, if there is one, gets its own line so it is not buried. */}
          {entry.metric && (
            <p className="mt-2 text-sm text-acc">
              <span className="text-line">→</span> {entry.metric}
            </p>
          )}

          {entry.stack?.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {entry.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded border border-line bg-raised px-2 py-0.5 text-[11px] text-fg/70"
                >
                  {tech}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  )
}

function Education({ items, labels }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item.institution + item.period}
          className="rounded-lg border border-line bg-panel p-5"
        >
          <p className="text-xs text-dim">{item.period}</p>
          <h4 className="mt-2 font-bold text-fg">{item.degree}</h4>
          <p className="mt-1 text-sm text-acc">{item.institution}</p>
          {item.note && (
            <p className="mt-3 font-sans text-sm leading-relaxed text-dim">
              <span className="text-line">{labels.thesis}: </span>
              {item.note}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}

/** A short, curated list — every one of these is meant to be read. */
function Certs({ items, labels }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => {
        const Tag = item.href ? 'a' : 'div'
        return (
          <li key={item.name + item.year}>
            <Tag
              {...(item.href ? { href: item.href, target: '_blank', rel: 'noreferrer' } : {})}
              className={cx(
                'flex h-full flex-col rounded-lg border border-acc/35 bg-panel p-5 transition-colors',
                item.href && 'hover:border-acc/70 hover:bg-raised',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded border border-line px-2 py-0.5 text-[10px] tracking-wider text-dim uppercase">
                  {item.type}
                </span>
                <span className="text-xs text-dim">{item.year}</span>
              </div>

              <h4 className="mt-3 font-bold text-fg">{item.name}</h4>
              <p className="mt-1 text-sm text-acc">{item.issuer}</p>

              {item.href && (
                <span className="mt-4 text-xs text-dim transition-colors group-hover:text-acc">
                  {labels.verify} ↗
                </span>
              )}
            </Tag>
          </li>
        )
      })}
    </ul>
  )
}

export default function Path() {
  const { t } = useLang()
  const path = t.path

  // A branch with nothing in it is not shown at all.
  const branches = path.branches.filter((b) => path[b.id]?.length > 0)
  const [active, setActive] = useState(branches[0]?.id)

  if (branches.length === 0) return null

  const current = branches.find((b) => b.id === active) ?? branches[0]

  return (
    <Section id="path" index={4} file="path.log" heading={path.heading} note={path.note}>
      {/* Branch picker, printed like `git branch`. The counts are deliberate:
          they show how much is in each branch to someone who never clicks. */}
      <p className="text-xs text-dim">
        <span className="text-acc">$</span> {path.labels.branchCommand}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {branches.map((branch) => {
          const isActive = branch.id === current.id
          return (
            <button
              key={branch.id}
              type="button"
              onClick={() => setActive(branch.id)}
              aria-pressed={isActive}
              className={cx(
                'rounded border px-3 py-1.5 text-sm transition-colors',
                isActive
                  ? 'border-acc/60 bg-acc/10 text-acc'
                  : 'border-line text-dim hover:border-fg/30 hover:text-fg',
              )}
            >
              <span className={isActive ? 'text-acc' : 'text-line'}>{isActive ? '*' : ' '}</span>{' '}
              {branch.label}{' '}
              <span className={isActive ? 'text-acc/60' : 'text-line'}>
                ({path[branch.id].length})
              </span>
            </button>
          )
        })}
      </div>

      <p className="mt-8 text-xs text-dim">
        <span className="text-acc">$</span> {current.command}
      </p>

      <div key={current.id} className="mt-6 animate-rise">
        {current.id === 'work' && <WorkLog entries={path.work} labels={path.labels} />}
        {current.id === 'education' && <Education items={path.education} labels={path.labels} />}
        {current.id === 'certs' && <Certs items={path.certs} labels={path.labels} />}
      </div>
    </Section>
  )
}
