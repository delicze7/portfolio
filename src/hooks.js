import { useCallback, useEffect, useRef, useState } from 'react'

/** True when the visitor asked the OS to cut down on motion. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/**
 * Types `text` out one character at a time.
 * Returns [visibleText, done]. Instant when motion is reduced or `active` is false.
 */
export function useTyped(text, { speed = 55, delay = 0, active = true } = {}) {
  const reduced = useReducedMotion()
  const instant = reduced || !active
  const [shown, setShown] = useState(() => (instant ? text : ''))

  useEffect(() => {
    if (instant) {
      setShown(text)
      return
    }
    setShown('')
    let i = 0
    let tick
    const start = setTimeout(function step() {
      tick = setInterval(() => {
        i += 1
        setShown(text.slice(0, i))
        if (i >= text.length) clearInterval(tick)
      }, speed)
    }, delay)
    return () => {
      clearTimeout(start)
      clearInterval(tick)
    }
  }, [text, speed, delay, instant])

  return [shown, shown.length >= text.length]
}

/**
 * Terminal typewriter that keeps writing: types a value, holds it, erases it,
 * then moves to the next one and loops. Give it a single value and it retypes
 * that one forever; give it several and it cycles through them.
 *
 * Returns `{ text, phase }` where phase is 'typing' | 'holding' | 'erasing'.
 * Settles on the first value when motion is reduced or `active` is false.
 */
export function useTypewriterCycle(
  values,
  { typeSpeed = 55, eraseSpeed = 26, hold = 2800, gap = 280, delay = 0, active = true } = {},
) {
  const reduced = useReducedMotion()
  const instant = reduced || !active
  const [text, setText] = useState(() => (instant ? values[0] : ''))
  const [phase, setPhase] = useState(instant ? 'holding' : 'typing')

  useEffect(() => {
    if (instant) {
      setText(values[0])
      setPhase('holding')
      return
    }

    let timer
    let index = 0
    let chars = 0
    setText('')
    setPhase('typing')

    const type = () => {
      chars += 1
      setText(values[index].slice(0, chars))
      if (chars < values[index].length) {
        timer = setTimeout(type, typeSpeed)
      } else {
        setPhase('holding')
        timer = setTimeout(erase, hold)
      }
    }

    const erase = () => {
      setPhase('erasing')
      if (chars > 0) {
        chars -= 1
        setText(values[index].slice(0, chars))
        timer = setTimeout(erase, eraseSpeed)
      } else {
        index = (index + 1) % values.length
        setPhase('typing')
        timer = setTimeout(type, gap)
      }
    }

    timer = setTimeout(type, delay)
    return () => clearTimeout(timer)
    // Joined so an equal-but-new array from a re-render doesn't restart the run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.join('|'), typeSpeed, eraseSpeed, hold, gap, delay, instant])

  return { text, phase }
}

/** Returns the id of the section currently closest to the top of the viewport. */
export function useScrollSpy(ids, offset = 120) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const onScroll = () => {
      let current = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= offset) current = id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ids, offset])

  return active
}

/** Copy-to-clipboard with a short-lived "copied" flag for button feedback. */
export function useCopy(resetAfter = 1600) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  const copy = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        // Clipboard API needs a secure context; fall back to the old trick.
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        ta.remove()
      }
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), resetAfter)
    },
    [resetAfter],
  )

  useEffect(() => () => clearTimeout(timer.current), [])

  return [copied, copy]
}

/**
 * Fires once when the element scrolls into view — used to reveal sections.
 *
 * Triggers when the element's top edge crosses a line near the bottom of the
 * viewport, not when some share of it is visible. A share-based threshold
 * breaks on tall elements: the work section is over 5000px tall on a phone, so
 * 15% of it never fits on screen at once, and it stayed invisible for good.
 */
export function useInView({ threshold = 0, rootMargin = '0px 0px -12% 0px' } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, rootMargin])

  return [ref, inView]
}
