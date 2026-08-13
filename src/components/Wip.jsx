/**
 * Stands in for a section that is not written yet.
 *
 * It replaces the content rather than covering it: an overlay would still ship
 * whatever sits underneath, and on a portfolio that means publishing claims the
 * owner never made.
 */
export default function Wip({ copy, file }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-panel/50 px-6 py-12 text-center">
      <span className="inline-flex items-center gap-2 rounded border border-warn/40 bg-warn/10 px-2.5 py-1 text-[11px] tracking-wider text-warn uppercase">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warn opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-warn" />
        </span>
        {copy.badge}
      </span>

      <p className="mx-auto mt-6 max-w-md font-sans text-lg font-semibold text-fg">
        {copy.title}
      </p>
      <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-dim">
        {copy.note}
      </p>

      <p className="mt-8 text-xs text-dim/70">
        <span className="text-acc">$</span> cat {file}
        <br />
        <span className="text-warn/70">cat: {file}: {copy.shell}</span>
        <span className="caret" />
      </p>
    </div>
  )
}
