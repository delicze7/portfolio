/**
 * SINGLE SOURCE OF TRUTH FOR EVERYTHING ON THE SITE.
 *
 * Edit this file and nothing else to fill in your real content.
 * Everything below is a placeholder — replace the text, keep the shape.
 *
 * Language keys: `en` (English) and `bs` (Bosnian). Both must have the same
 * arrays in the same order — items are matched positionally by the UI.
 */

// Drop your photo into `src/assets/` named `portrait.<ext>` and it is picked up
// automatically — no import to edit. Matches are ordered by extension, so adding
// `portrait.jpg` next to the placeholder `portrait.png` takes over on its own.
// Imported rather than served from /public so the build fingerprints it and the
// relative `base` in vite.config.js keeps working on subdirectory hosting.
const portraits = import.meta.glob('./assets/portrait.{avif,jpeg,jpg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})
const portrait = Object.values(portraits)[0]

export const profile = {
  name: 'Zejd Delic',
  handle: 'zejd',
  email: 'you@example.com',
  location: 'Bosna i Hercegovina',
  photo: portrait,
  links: {
    github: 'https://github.com/your-username',
    linkedin: 'https://linkedin.com/in/your-username',
  },
}

export const content = {
  /* ────────────────────────────────────────────────────────────── ENGLISH ── */
  en: {
    nav: {
      work: 'work',
      approach: 'approach',
      stack: 'stack',
      path: 'path',
      lab: 'lab',
      contact: 'contact',
      command: 'command',
    },

    boot: {
      lines: [
        'initializing portfolio kernel',
        'mounting /projects',
        'loading experience.log',
        'checking coffee levels ......... OK',
        'starting session',
      ],
      skip: 'press any key to skip',
    },

    hero: {
      command: 'whoami',
      commandProfile: 'cat profile.txt',
      role: 'Software Engineer',
      tagline: 'I turn unclear problems into software that keeps working when nobody is watching.',
      description:
        'Full-stack engineer with 5+ years of experience, from the database up to the interface. I take a problem the whole way — the conversation about what is actually needed, the architecture, the code, the deploy, and the part after launch where it has to hold. The projects I like most are the ones where no ready-made solution exists and somebody has to design one.',
      hint: 'for navigation',
      status: 'open to work',
      ctas: [
        { label: 'view-work', href: '#work' },
        { label: 'view-experience', href: '#path' },
        { label: 'contact', href: '#contact' },
      ],
      // Labels stay put; the values type themselves out on a loop. Give a fact
      // several values and it cycles through them — one value just retypes.
      facts: [
        { k: 'location', v: ['Bosnia and Herzegovina'] },
        {
          k: 'focus',
          v: ['full-stack development', 'web applications', 'APIs and integrations', 'idea to production'],
        },
        { k: 'experience', v: ['5+ years'] },
      ],
      portrait: {
        alt: 'Portrait of Zejd Delic',
        caption: 'portrait',
        photo: 'photo',
        ascii: 'ascii',
      },
    },

    work: {
      heading: 'selected work',
      note: 'Four projects, each with the trade-off I actually had to make.',
      labels: {
        problem: 'problem',
        decision: 'decision',
        tradeoff: 'trade-off',
        result: 'result',
        expand: 'read case study',
        collapse: 'close',
        source: 'source',
        live: 'live',
      },
      items: [
        {
          id: 'ledger',
          name: 'ledger-core',
          blurb: 'Double-entry ledger handling 40k transactions/day.',
          year: '2025',
          stack: ['Go', 'PostgreSQL', 'Kafka', 'gRPC'],
          problem:
            'Placeholder: what was broken or missing before you showed up. One or two sentences, concrete numbers if you have them.',
          decision:
            'Placeholder: the approach you chose and why that one over the obvious alternative.',
          tradeoff:
            'Placeholder: what you knowingly gave up. This is the section nobody writes and the only one that proves seniority.',
          result:
            'Placeholder: the measurable outcome. Latency, cost, error rate, hours saved — anything a number can attach to.',
          links: { live: '', source: '' },
        },
        {
          id: 'atlas',
          name: 'atlas',
          blurb: 'Internal service catalog and dependency graph.',
          year: '2024',
          stack: ['TypeScript', 'React', 'Neo4j'],
          problem: 'Placeholder: the problem this project solved.',
          decision: 'Placeholder: your architectural decision.',
          tradeoff: 'Placeholder: what it cost you.',
          result: 'Placeholder: the outcome.',
          links: { live: '', source: '' },
        },
        {
          id: 'pipeline',
          name: 'pipeline-rs',
          blurb: 'Stream processor that replaced a nightly cron batch.',
          year: '2024',
          stack: ['Rust', 'Redis', 'Docker'],
          problem: 'Placeholder: the problem this project solved.',
          decision: 'Placeholder: your architectural decision.',
          tradeoff: 'Placeholder: what it cost you.',
          result: 'Placeholder: the outcome.',
          links: { live: '', source: '' },
        },
        {
          id: 'sentry',
          name: 'watchtower',
          blurb: 'Alerting layer that cut on-call pages by two thirds.',
          year: '2023',
          stack: ['Python', 'Prometheus', 'Terraform'],
          problem: 'Placeholder: the problem this project solved.',
          decision: 'Placeholder: your architectural decision.',
          tradeoff: 'Placeholder: what it cost you.',
          result: 'Placeholder: the outcome.',
          links: { live: '', source: '' },
        },
      ],
    },

    approach: {
      heading: 'how i work',
      note: 'Opinions I hold loosely enough to change, strongly enough to act on.',
      items: [
        {
          title: 'Boring technology wins',
          body: 'Placeholder: your take on choosing proven tools over novel ones, and when you break that rule.',
        },
        {
          title: 'Write it down before you build it',
          body: 'Placeholder: how you approach design docs, RFCs, or just a paragraph in the ticket.',
        },
        {
          title: 'Observability is a feature',
          body: 'Placeholder: your view on logging, metrics, and being able to answer "why is it slow" without a redeploy.',
        },
        {
          title: 'Delete more than you add',
          body: 'Placeholder: your relationship with scope, dead code, and the second system effect.',
        },
      ],
    },

    stack: {
      heading: 'stack',
      note: 'Honest labels. "Daily" means I could debug it half-asleep.',
      levels: { daily: 'daily', working: 'working', touched: 'touched' },
      groups: [
        {
          name: 'languages',
          items: [
            { name: 'Go', level: 'daily' },
            { name: 'TypeScript', level: 'daily' },
            { name: 'Python', level: 'working' },
            { name: 'Rust', level: 'touched' },
            { name: 'SQL', level: 'daily' },
          ],
        },
        {
          name: 'backend',
          items: [
            { name: 'PostgreSQL', level: 'daily' },
            { name: 'Redis', level: 'daily' },
            { name: 'Kafka', level: 'working' },
            { name: 'gRPC', level: 'working' },
            { name: 'GraphQL', level: 'touched' },
          ],
        },
        {
          name: 'frontend',
          items: [
            { name: 'React', level: 'daily' },
            { name: 'Tailwind', level: 'daily' },
            { name: 'Vite', level: 'working' },
            { name: 'Svelte', level: 'touched' },
          ],
        },
        {
          name: 'infra',
          items: [
            { name: 'Docker', level: 'daily' },
            { name: 'Kubernetes', level: 'working' },
            { name: 'Terraform', level: 'working' },
            { name: 'GitHub Actions', level: 'daily' },
            { name: 'AWS', level: 'working' },
          ],
        },
      ],
    },

    path: {
      heading: 'path',
      note: 'git log --author="you" --reverse',
      labels: { present: 'HEAD' },
      entries: [
        {
          hash: 'a3f9d21',
          type: 'feat',
          title: 'Senior Software Engineer',
          org: 'Company Name',
          period: '2024 — present',
          body: 'Placeholder: one line on what you own, and one number that shows scale.',
        },
        {
          hash: '7c1e04b',
          type: 'refactor',
          title: 'Software Engineer',
          org: 'Previous Company',
          period: '2022 — 2024',
          body: 'Placeholder: what changed because you were there.',
        },
        {
          hash: 'd50a88f',
          type: 'feat',
          title: 'Junior Developer',
          org: 'First Company',
          period: '2021 — 2022',
          body: 'Placeholder: where you learned the thing you still use every day.',
        },
        {
          hash: '0000000',
          type: 'init',
          title: 'BSc Computer Science',
          org: 'University Name',
          period: '2017 — 2021',
          body: 'Placeholder: thesis topic, or the one course that actually mattered.',
        },
      ],
    },

    lab: {
      heading: 'lab',
      note: 'Small things built for no good reason. Usually the most fun.',
      items: [
        {
          name: 'ascii-uptime',
          desc: 'Placeholder: a weekend tool, a CLI, a shader, a bot.',
          tag: 'cli',
          href: '',
        },
        {
          name: 'raycaster.c',
          desc: 'Placeholder: something you built to understand how it works.',
          tag: 'graphics',
          href: '',
        },
        {
          name: 'kv-store',
          desc: 'Placeholder: an implementation-from-scratch project.',
          tag: 'systems',
          href: '',
        },
        {
          name: 'dotfiles',
          desc: 'Placeholder: your setup, because someone always asks.',
          tag: 'config',
          href: '',
        },
      ],
    },

    contact: {
      heading: 'contact',
      pitch:
        'Placeholder: say what kind of message is worth sending — a role, a contract, a question about something you wrote. Set expectations on reply time.',
      emailLabel: 'email',
      copy: 'copy',
      copied: 'copied',
      elsewhere: 'elsewhere',
      availability: 'Currently open to backend and platform roles.',
    },

    footer: {
      built: 'Built with React, Vite and Tailwind. No trackers, no cookie banner.',
      source: 'source',
      rights: 'All rights reserved.',
    },

    palette: {
      placeholder: 'Type a command or search…',
      empty: 'No matches.',
      groups: { nav: 'Navigate', actions: 'Actions', links: 'Links' },
      actions: {
        lang: 'Switch language → Bosnian',
        copyEmail: 'Copy email address',
        top: 'Back to top',
        theme: 'Toggle scanlines',
      },
      hint: 'to select',
      close: 'to close',
    },
  },

  /* ───────────────────────────────────────────────────────────── BOSANSKI ── */
  bs: {
    nav: {
      work: 'radovi',
      approach: 'pristup',
      stack: 'stack',
      path: 'put',
      lab: 'lab',
      contact: 'kontakt',
      command: 'komande',
    },

    boot: {
      lines: [
        'pokrećem kernel portfolija',
        'montiram /projekti',
        'učitavam iskustvo.log',
        'provjeravam nivo kafe ......... OK',
        'pokrećem sesiju',
      ],
      skip: 'pritisni bilo koju tipku za preskočiti',
    },

    hero: {
      command: 'whoami',
      commandProfile: 'cat profil.txt',
      role: 'Softverski inženjer',
      tagline: 'Pretvaram nejasne probleme u softver koji radi i kad niko ne gleda.',
      description:
        'Full-stack inženjer sa 5+ godina iskustva, od baze podataka do korisničkog interfejsa. Problem vodim kroz cijeli put — razgovor o tome šta zapravo treba, arhitektura, kod, deploy, i onaj dio poslije lansiranja kad rješenje mora izdržati. Najdraži su mi projekti gdje gotovo rješenje ne postoji, pa ga neko mora osmisliti.',
      hint: 'za navigaciju',
      status: 'otvoren za poslove',
      ctas: [
        { label: 'pogledaj-radove', href: '#work' },
        { label: 'pogledaj-iskustvo', href: '#path' },
        { label: 'kontakt', href: '#contact' },
      ],
      // Oznake stoje; vrijednosti se ispisuju u petlji. Ako fakt ima više
      // vrijednosti, kruži kroz njih — jedna vrijednost se samo ponovo ispisuje.
      facts: [
        { k: 'lokacija', v: ['Bosna i Hercegovina'] },
        {
          k: 'fokus',
          v: ['full-stack razvoj', 'web aplikacije', 'API i integracije', 'od ideje do produkcije'],
        },
        { k: 'iskustvo', v: ['5+ godina'] },
      ],
      portrait: {
        alt: 'Portret — Zejd Delic',
        caption: 'portret',
        photo: 'foto',
        ascii: 'ascii',
      },
    },

    work: {
      heading: 'odabrani radovi',
      note: 'Četiri projekta, svaki sa trade-offom koji sam stvarno morao napraviti.',
      labels: {
        problem: 'problem',
        decision: 'odluka',
        tradeoff: 'trade-off',
        result: 'rezultat',
        expand: 'pročitaj case study',
        collapse: 'zatvori',
        source: 'kod',
        live: 'uživo',
      },
      items: [
        {
          id: 'ledger',
          name: 'ledger-core',
          blurb: 'Dvojni knjigovodstveni sistem sa 40k transakcija dnevno.',
          year: '2025',
          stack: ['Go', 'PostgreSQL', 'Kafka', 'gRPC'],
          problem:
            'Placeholder: šta je bilo pokvareno ili nije postojalo prije tebe. Jedna-dvije rečenice, s brojevima ako ih imaš.',
          decision:
            'Placeholder: pristup koji si odabrao i zašto baš taj, a ne očigledna alternativa.',
          tradeoff:
            'Placeholder: šta si svjesno žrtvovao. Ovo niko ne piše, a jedino ovo dokazuje da si senior.',
          result:
            'Placeholder: mjerljiv ishod. Latencija, trošak, error rate, ušteđeni sati — bilo šta uz šta ide broj.',
          links: { live: '', source: '' },
        },
        {
          id: 'atlas',
          name: 'atlas',
          blurb: 'Interni katalog servisa i graf zavisnosti.',
          year: '2024',
          stack: ['TypeScript', 'React', 'Neo4j'],
          problem: 'Placeholder: problem koji je ovaj projekat riješio.',
          decision: 'Placeholder: tvoja arhitektonska odluka.',
          tradeoff: 'Placeholder: šta te je koštalo.',
          result: 'Placeholder: ishod.',
          links: { live: '', source: '' },
        },
        {
          id: 'pipeline',
          name: 'pipeline-rs',
          blurb: 'Stream procesor koji je zamijenio noćni cron batch.',
          year: '2024',
          stack: ['Rust', 'Redis', 'Docker'],
          problem: 'Placeholder: problem koji je ovaj projekat riješio.',
          decision: 'Placeholder: tvoja arhitektonska odluka.',
          tradeoff: 'Placeholder: šta te je koštalo.',
          result: 'Placeholder: ishod.',
          links: { live: '', source: '' },
        },
        {
          id: 'sentry',
          name: 'watchtower',
          blurb: 'Sloj za alerte koji je smanjio on-call pozive za dvije trećine.',
          year: '2023',
          stack: ['Python', 'Prometheus', 'Terraform'],
          problem: 'Placeholder: problem koji je ovaj projekat riješio.',
          decision: 'Placeholder: tvoja arhitektonska odluka.',
          tradeoff: 'Placeholder: šta te je koštalo.',
          result: 'Placeholder: ishod.',
          links: { live: '', source: '' },
        },
      ],
    },

    approach: {
      heading: 'kako radim',
      note: 'Stavovi koje držim dovoljno labavo da ih promijenim, dovoljno čvrsto da po njima radim.',
      items: [
        {
          title: 'Dosadna tehnologija pobjeđuje',
          body: 'Placeholder: tvoj stav o biranju provjerenih alata umjesto novih, i kada to pravilo prekršiš.',
        },
        {
          title: 'Napiši prije nego izgradiš',
          body: 'Placeholder: kako pristupaš design dokumentima, RFC-ovima, ili samo jednom pasusu u tiketu.',
        },
        {
          title: 'Observability je feature',
          body: 'Placeholder: tvoj pogled na logove, metrike, i mogućnost da odgovoriš "zašto je sporo" bez novog deploya.',
        },
        {
          title: 'Briši više nego što dodaješ',
          body: 'Placeholder: tvoj odnos prema scope-u, mrtvom kodu i second system efektu.',
        },
      ],
    },

    stack: {
      heading: 'stack',
      note: 'Iskrene oznake. "Svaki dan" znači da bih to debugovao polubudan.',
      levels: { daily: 'svaki dan', working: 'radno', touched: 'dodirnuo' },
      groups: [
        {
          name: 'jezici',
          items: [
            { name: 'Go', level: 'daily' },
            { name: 'TypeScript', level: 'daily' },
            { name: 'Python', level: 'working' },
            { name: 'Rust', level: 'touched' },
            { name: 'SQL', level: 'daily' },
          ],
        },
        {
          name: 'backend',
          items: [
            { name: 'PostgreSQL', level: 'daily' },
            { name: 'Redis', level: 'daily' },
            { name: 'Kafka', level: 'working' },
            { name: 'gRPC', level: 'working' },
            { name: 'GraphQL', level: 'touched' },
          ],
        },
        {
          name: 'frontend',
          items: [
            { name: 'React', level: 'daily' },
            { name: 'Tailwind', level: 'daily' },
            { name: 'Vite', level: 'working' },
            { name: 'Svelte', level: 'touched' },
          ],
        },
        {
          name: 'infra',
          items: [
            { name: 'Docker', level: 'daily' },
            { name: 'Kubernetes', level: 'working' },
            { name: 'Terraform', level: 'working' },
            { name: 'GitHub Actions', level: 'daily' },
            { name: 'AWS', level: 'working' },
          ],
        },
      ],
    },

    path: {
      heading: 'put',
      note: 'git log --author="ti" --reverse',
      labels: { present: 'HEAD' },
      entries: [
        {
          hash: 'a3f9d21',
          type: 'feat',
          title: 'Senior softverski inženjer',
          org: 'Ime firme',
          period: '2024 — danas',
          body: 'Placeholder: jedna linija o tome šta vodiš i jedan broj koji pokazuje razmjeru.',
        },
        {
          hash: '7c1e04b',
          type: 'refactor',
          title: 'Softverski inženjer',
          org: 'Prethodna firma',
          period: '2022 — 2024',
          body: 'Placeholder: šta se promijenilo zato što si ti bio tu.',
        },
        {
          hash: 'd50a88f',
          type: 'feat',
          title: 'Junior developer',
          org: 'Prva firma',
          period: '2021 — 2022',
          body: 'Placeholder: gdje si naučio ono što i danas koristiš svaki dan.',
        },
        {
          hash: '0000000',
          type: 'init',
          title: 'BSc Računarstvo',
          org: 'Ime fakulteta',
          period: '2017 — 2021',
          body: 'Placeholder: tema diplomskog, ili jedan predmet koji je stvarno značio.',
        },
      ],
    },

    lab: {
      heading: 'lab',
      note: 'Male stvari napravljene bez dobrog razloga. Obično najzabavnije.',
      items: [
        {
          name: 'ascii-uptime',
          desc: 'Placeholder: vikend alat, CLI, shader ili bot.',
          tag: 'cli',
          href: '',
        },
        {
          name: 'raycaster.c',
          desc: 'Placeholder: nešto što si napravio da razumiješ kako radi.',
          tag: 'grafika',
          href: '',
        },
        {
          name: 'kv-store',
          desc: 'Placeholder: implementacija nečega od nule.',
          tag: 'sistemi',
          href: '',
        },
        {
          name: 'dotfiles',
          desc: 'Placeholder: tvoj setup, jer neko uvijek pita.',
          tag: 'config',
          href: '',
        },
      ],
    },

    contact: {
      heading: 'kontakt',
      pitch:
        'Placeholder: reci kakva poruka ima smisla — pozicija, ugovor, pitanje o nečemu što si napisao. Postavi očekivanje za vrijeme odgovora.',
      emailLabel: 'email',
      copy: 'kopiraj',
      copied: 'kopirano',
      elsewhere: 'drugdje',
      availability: 'Trenutno otvoren za backend i platform pozicije.',
    },

    footer: {
      built: 'Napravljeno u Reactu, Viteu i Tailwindu. Bez trackera, bez cookie bannera.',
      source: 'kod',
      rights: 'Sva prava zadržana.',
    },

    palette: {
      placeholder: 'Ukucaj komandu ili pretraži…',
      empty: 'Nema rezultata.',
      groups: { nav: 'Navigacija', actions: 'Akcije', links: 'Linkovi' },
      actions: {
        lang: 'Promijeni jezik → engleski',
        copyEmail: 'Kopiraj email adresu',
        top: 'Nazad na vrh',
        theme: 'Uključi/isključi scanlines',
      },
      hint: 'za odabir',
      close: 'za zatvoriti',
    },
  },
}

/** Section ids, in page order. Used by the nav, scrollspy and command palette. */
export const SECTIONS = ['work', 'approach', 'stack', 'path', 'lab', 'contact']
