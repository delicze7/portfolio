import { useEffect, useMemo, useRef, useState } from 'react'
import { useLang } from '../i18n/LanguageContext.jsx'
import { SECTIONS, profile } from '../content.js'
import { useCopy, useReducedMotion } from '../hooks.js'
import { MOD, cx } from '../utils.js'

/**
 * ⌘K palette. Navigates sections, flips language, copies the email,
 * opens external links — all without the visitor touching the mouse.
 */
export default function CommandPalette({ open, onClose }) {
  const { t, lang, toggle } = useLang()
  const reduced = useReducedMotion()
  const [, copy] = useCopy()
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const restoreFocus = useRef(null)

  const items = useMemo(() => {
    const go = (id) => () => {
      const el = document.getElementById(id)
      el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
      history.replaceState(null, '', `#${id}`)
    }

    return [
      ...SECTIONS.map((id, i) => ({
        id: `nav:${id}`,
        group: 'nav',
        icon: String(i + 1).padStart(2, '0'),
        label: t.nav[id],
        hint: `#${id}`,
        run: go(id),
      })),
      {
        id: 'act:lang',
        group: 'actions',
        icon: '⇄',
        label: t.palette.actions.lang,
        hint: lang === 'en' ? 'BS' : 'EN',
        run: toggle,
        keepOpen: false,
      },
      {
        id: 'act:email',
        group: 'actions',
        icon: '⧉',
        label: t.palette.actions.copyEmail,
        hint: profile.email,
        run: () => copy(profile.email),
      },
      {
        id: 'act:top',
        group: 'actions',
        icon: '↑',
        label: t.palette.actions.top,
        hint: 'home',
        run: () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }),
      },
      {
        id: 'link:github',
        group: 'links',
        icon: '↗',
        label: 'GitHub',
        hint: profile.links.github.replace(/^https?:\/\//, ''),
        run: () => window.open(profile.links.github, '_blank', 'noopener'),
      },
      {
        id: 'link:linkedin',
        group: 'links',
        icon: '↗',
        label: 'LinkedIn',
        hint: profile.links.linkedin.replace(/^https?:\/\//, ''),
        run: () => window.open(profile.links.linkedin, '_blank', 'noopener'),
      },
      {
        id: 'link:mail',
        group: 'links',
        icon: '@',
        label: profile.email,
        hint: 'mailto',
        run: () => window.open(`mailto:${profile.email}`),
      },
    ]
  }, [t, lang, toggle, copy, reduced])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((it) => `${it.label} ${it.hint} ${it.id}`.toLowerCase().includes(q))
  }, [items, query])

  // Group while preserving the flat index the keyboard cursor walks.
  const groups = useMemo(() => {
    const out = []
    filtered.forEach((item, index) => {
      const last = out[out.length - 1]
      if (last && last.name === item.group) last.items.push({ item, index })
      else out.push({ name: item.group, items: [{ item, index }] })
    })
    return out
  }, [filtered])

  useEffect(() => setCursor(0), [query, open])

  useEffect(() => {
    if (!open) return
    restoreFocus.current = document.activeElement
    setQuery('')
    inputRef.current?.focus()
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
      restoreFocus.current?.focus?.()
    }
  }, [open])

  // Keep the highlighted row visible when arrowing past the fold.
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  if (!open) return null

  const select = (item) => {
    item.run()
    if (item.keepOpen !== true) onClose()
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => (filtered.length ? (c + 1) % filtered.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => (filtered.length ? (c - 1 + filtered.length) % filtered.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const item = filtered[cursor]
      if (item) select(item)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={onKeyDown}
        className="w-full max-w-lg animate-rise overflow-hidden rounded-lg border border-line bg-panel shadow-2xl shadow-black/60"
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <span className="text-acc">&gt;</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.palette.placeholder}
            className="w-full bg-transparent text-sm text-fg placeholder:text-dim/60 focus:outline-none"
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-dim">{t.palette.empty}</p>
          )}

          {groups.map((group) => (
            <div key={group.name} className="mb-1">
              <p className="px-4 py-1.5 text-[10px] tracking-wider text-dim/70 uppercase">
                {t.palette.groups[group.name]}
              </p>
              <ul>
                {group.items.map(({ item, index }) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      data-active={index === cursor}
                      onPointerMove={() => setCursor(index)}
                      onClick={() => select(item)}
                      className={cx(
                        'flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors',
                        index === cursor ? 'bg-raised text-fg' : 'text-fg/75',
                      )}
                    >
                      <span
                        className={cx(
                          'w-5 shrink-0 text-center text-xs',
                          index === cursor ? 'text-acc' : 'text-line',
                        )}
                      >
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                      <span className="ml-auto truncate pl-3 text-[11px] text-dim">
                        {item.hint}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 border-t border-line px-4 py-2 text-[10px] text-dim">
          <span>
            <kbd className="rounded bg-raised px-1 py-0.5">↑↓</kbd> {t.palette.hint}
          </span>
          <span>
            <kbd className="rounded bg-raised px-1 py-0.5">esc</kbd> {t.palette.close}
          </span>
          <span className="ml-auto">
            <kbd className="rounded bg-raised px-1 py-0.5">{MOD} K</kbd>
          </span>
        </div>
      </div>
    </div>
  )
}
