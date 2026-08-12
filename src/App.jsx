import { useCallback, useEffect, useState } from 'react'
import { useLang } from './i18n/LanguageContext.jsx'
import Boot from './components/Boot.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Work from './components/Work.jsx'
import Approach from './components/Approach.jsx'
import Stack from './components/Stack.jsx'
import Path from './components/Path.jsx'
import Lab from './components/Lab.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import CommandPalette from './components/CommandPalette.jsx'

const BOOT_KEY = 'portfolio:booted'

export default function App() {
  const { t } = useLang()
  // Boot plays once per tab session — charming the first time, tedious the fifth.
  const [booted, setBooted] = useState(() => sessionStorage.getItem(BOOT_KEY) === '1')
  const [paletteOpen, setPaletteOpen] = useState(false)

  const finishBoot = useCallback(() => {
    sessionStorage.setItem(BOOT_KEY, '1')
    setBooted(true)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {!booted && <Boot boot={t.boot} onDone={finishBoot} />}

      {/* Ambient background: blueprint grid plus one soft glow behind the hero. */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(ellipse_at_top,rgba(74,222,128,0.09),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,var(--color-ink))]" />
      </div>

      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded focus:bg-raised focus:px-3 focus:py-2 focus:text-sm focus:text-acc"
      >
        skip to content
      </a>

      <Nav onOpenPalette={() => setPaletteOpen(true)} />

      <main>
        <Hero ready={booted} />
        <Work />
        <Approach />
        <Stack />
        <Path />
        <Lab />
        <Contact />
      </main>

      <Footer />

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  )
}
