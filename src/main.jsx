import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageContext.jsx'
import { profile } from './content.js'
import './index.css'

/**
 * Every engineer who visits an engineer's portfolio opens DevTools.
 * Leave them something.
 */
console.log(
  `%c
  ┌───────────────────────────────────────────┐
  │  You opened the console. Respect.         │
  │                                           │
  │  If you got this far you probably have    │
  │  an opinion about something on this page. │
  │  I'd like to hear it:                     │
  │                                           │
  │  ${profile.email.padEnd(41)}│
  └───────────────────────────────────────────┘
`,
  'color:#4ade80;font-family:monospace;font-size:12px',
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
