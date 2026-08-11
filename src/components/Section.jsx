import { useInView } from '../hooks.js'
import { cx } from '../utils.js'

/** Shared section shell: a shell-prompt heading, a note, then the content. */
export default function Section({ id, index, file, heading, note, children, className }) {
  const [ref, inView] = useInView()

  return (
    <section
      id={id}
      ref={ref}
      className={cx(
        'mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28',
        inView ? 'animate-rise' : 'opacity-0',
        className,
      )}
    >
      <p className="text-xs text-dim sm:text-sm">
        <span className="text-acc">$</span> cat {String(index).padStart(2, '0')}_{file}
      </p>

      <div className="mt-3 flex items-baseline gap-4">
        <h2 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">{heading}</h2>
        <span className="h-px flex-1 bg-line" />
      </div>

      {note && <p className="mt-3 max-w-2xl font-sans text-sm text-dim">{note}</p>}

      <div className="mt-10">{children}</div>
    </section>
  )
}
