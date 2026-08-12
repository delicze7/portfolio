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

// Screenshots for the featured project. Drop image files into
// `src/assets/slibe/` and reference them by bare filename (no extension) from
// `work.featured.shots` — that way the gallery order is set by the content, not
// by how the files happen to sort.
const shotModules = import.meta.glob('./assets/slibe/*.{avif,jpeg,jpg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})
export const slibeShots = Object.fromEntries(
  Object.entries(shotModules).map(([path, url]) => [
    path.replace(/^.*\//, '').replace(/\.[^.]+$/, ''),
    url,
  ]),
)

// Small versions for the gallery grid, which draws them ~195px wide. Loading
// the full 1000px files there would cost ~1.5 MB; these cost ~160 kB.
const thumbModules = import.meta.glob('./assets/slibe/thumbs/*.{avif,jpeg,jpg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})
export const slibeThumbs = Object.fromEntries(
  Object.entries(thumbModules).map(([path, url]) => [
    path.replace(/^.*\//, '').replace(/\.[^.]+$/, ''),
    url,
  ]),
)

/** White wordmark, shown in place of the project title. */
export const slibeLogo = slibeShots.logoslibe

// Press coverage is the same in both languages — the headlines are Bosnian
// either way — so it lives here instead of being duplicated and drifting.
const SLIBE_PRESS = [
  {
    outlet: 'Klix.ba',
    date: '19.05.2026.',
    title: 'Mladi bh. inženjeri pokrenuli slibe.online: Platforma koja je zaludjela kolekcionare',
    href: 'https://www.klix.ba/sport/nogomet/mladi-bh-inzenjeri-pokrenuli-slibeonline-platforma-koja-je-zaludjela-kolekcionare/260519128',
  },
  {
    outlet: 'Radio Sarajevo',
    date: '06.05.2026.',
    title: 'Mladići kreirali stranicu za kolekcionare: Kako "slibe.online" olakšava razmjenu sličica u BiH',
    href: 'https://radiosarajevo.ba/metromahala/teme/mladici-kreirali-stranicu-za-kolekcionare-slibe-online/636324',
  },
  {
    outlet: 'Vijesti.ba',
    date: '2026.',
    title: 'Za sve ljubitelje sličica: Pokrenuta platforma Slibe.online',
    href: 'https://www.vijesti.ba/clanak/754898/za-sve-ljubitelje-slicica-pokrenuta-platforma-slibe-online',
  },
  {
    outlet: 'etto.ba',
    date: '2026.',
    title: 'Pokrenuta nova platforma za kolekcionare Panini sličica',
    href: 'https://etto.ba/clanak/pokrenuta-nova-platforma-za-kolekcionare-panini-slicica',
  },
]

/**
 * The intro screen. English only — it plays before the visitor has picked a
 * language, and swapping its wording mid-animation would be worse than leaving
 * it in one. Timings live in src/components/Boot.jsx.
 */
export const boot = {
  command: 'ssh zejd@portfolio',
  welcome: 'You are in the right place.',
  lines: ['establishing connection', 'loading projects', 'checking coffee levels'],
  loading: 'loading zejd portfolio',
  role: 'software engineer',
  skip: 'press any key to skip',
}

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
      note: 'One project, told properly. More will follow.',
      labels: {
        problem: 'problem',
        decision: 'decision',
        tradeoff: 'trade-off',
        result: 'result',
        role: 'my role',
        stack: 'built with',
        growth: 'registered users',
        gallery: 'screens',
        press: 'in the press',
        visit: 'open',
        source: 'source',
        live: 'live',
        close: 'close',
        kofi: 'Support on Ko-fi',
        kofiNote:
          'Slibe is free and always has been. Four people run it in their own time and donations pay the server bill.',
      },

      featured: {
        id: 'slibe',
        name: 'slibe.online',
        year: '2026',
        tagline:
          'A sticker album rebuilt in the browser, with an algorithm that finds you the person holding the number you are missing.',

        role: 'Four of us, deliberately working across the whole product instead of each sitting in a private corner of it — a side project built around full-time jobs. Alongside the build I ran the press and outreach: the articles landed inside exactly the window where the platform went from 500 to 5.000 users in thirteen days.',
        // Empty array hides the block — fill it in once the stack is confirmed.
        stack: [],

        metrics: [
          { v: '13.000+', k: 'registered users' },
          { v: '1M+', k: 'stickers entered' },
          { v: '0 KM', k: 'cost to collectors' },
        ],

        growth: [
          { when: '6 May 2026', value: 500, display: '500' },
          { when: '19 May 2026', value: 5000, display: '5.000' },
          { when: 'August 2026', value: 13000, display: '13.000+' },
        ],

        problem:
          'Sticker trading ran on Facebook groups — hundreds of unreadable comments, and no way to see who actually held the one number you were missing. The World Cup 2026 album runs to 992 stickers and a packet of seven costs 2,50 KM, so buying your way to a full album gets expensive fast.',
        decision:
          'We rebuilt the album one-to-one in the browser: mark what you own, what you are missing, what you have spare. A matching algorithm then does the searching, pairs collectors whose collections complement each other, and hands them a built-in chat to settle the trade.',
        // Empty string hides this block until there is something real to say.
        tradeoff: '',
        result:
          '500 registered users on 6 May 2026. Five thousand thirteen days later. Past 13.000 today, with more than a million stickers entered. Built and run by four engineers as volunteer work, free for everyone, funded by donations.',

        // `file` is the bare filename in src/assets/slibe/. Order here is the
        // order of the gallery tabs.
        shots: [
          {
            file: 'slibealbum1',
            label: 'album',
            caption:
              'The album rebuilt page by page, 99 pages of it. A completion bar, filters for missing, owned and duplicate stickers, and a PDF export of the whole thing.',
          },
          {
            file: 'sliberazmjena1',
            label: 'trades',
            caption:
              'Trading partners ranked by how well two collections fit, with what each side gives and gets shown up front. Filterable by city, so a trade can end as a handover rather than a parcel.',
          },
          {
            file: 'slibeporuke1',
            label: 'chat',
            caption:
              'A trade is a real object, not a conversation: both halves laid out sticker by sticker, editable, with a pending state until the other side confirms.',
          },
          {
            file: 'slibeprofil1',
            label: 'profile',
            caption:
              'A shareable public profile — owned, duplicate and missing counts, completion, and the album as a downloadable PDF.',
          },
          {
            file: 'slibeprijava1',
            label: 'sign-in',
            caption:
              'One-tap Google sign-in and an install prompt — it runs as an installable web app, so there is no app store between a collector and their album.',
          },
        ],

        press: SLIBE_PRESS,
        links: { live: 'https://www.slibe.online', source: '', kofi: 'https://ko-fi.com/slibeonline' },
      },

      // Future projects go here — they render as cards under the featured one.
      items: [],
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
      note: 'Jedan projekat, ispričan kako treba. Slijede još.',
      labels: {
        problem: 'problem',
        decision: 'odluka',
        tradeoff: 'trade-off',
        result: 'rezultat',
        role: 'moja uloga',
        stack: 'napravljeno u',
        growth: 'registrovanih korisnika',
        gallery: 'ekrani',
        press: 'u medijima',
        visit: 'otvori',
        source: 'kod',
        live: 'uživo',
        close: 'zatvori',
        kofi: 'Podrži na Ko-fi',
        kofiNote:
          'Slibe je besplatan i uvijek je bio. Četvero ljudi ga vodi u svoje slobodno vrijeme, a donacije plaćaju server.',
      },

      featured: {
        id: 'slibe',
        name: 'slibe.online',
        year: '2026',
        tagline:
          'Album sličica prenesen u browser, s algoritmom koji ti nađe čovjeka koji drži baš onaj broj koji tebi fali.',

        role: 'Četvero nas, namjerno uključenih u cijeli proizvod umjesto da svako sjedi u svom uglu — side projekat rađen uz redovne poslove. Pored razvoja, vodio sam medijsku promociju i komunikaciju s portalima: objave su izašle tačno u onom prozoru u kojem je platforma otišla s 500 na 5.000 korisnika za trinaest dana.',
        // Prazan niz sakriva blok — popuni kad potvrdiš stack.
        stack: [],

        metrics: [
          { v: '13.000+', k: 'registrovanih korisnika' },
          { v: '1M+', k: 'unesenih sličica' },
          { v: '0 KM', k: 'cijena za kolekcionare' },
        ],

        growth: [
          { when: '6. maj 2026.', value: 500, display: '500' },
          { when: '19. maj 2026.', value: 5000, display: '5.000' },
          { when: 'august 2026.', value: 13000, display: '13.000+' },
        ],

        problem:
          'Razmjena sličica godinama se svodila na Facebook grupe — stotine nepreglednih komentara i nikakav način da vidiš ko zaista ima baš onaj broj koji tebi fali. Album za Svjetsko prvenstvo 2026. ima 992 sličice, a paketić od sedam košta 2,50 KM, pa kupovina do punog albuma brzo postane skupa.',
        decision:
          'Prenijeli smo album jedan-na-jedan u browser: označiš šta imaš, šta ti fali i šta su ti duplikati. Algoritam onda sam traži, spaja kolekcionare čije se kolekcije poklapaju, i daje im ugrađeni chat da dogovore razmjenu.',
        // Prazan string sakriva blok dok nemaš šta stvarno reći.
        tradeoff: '',
        result:
          '500 registrovanih korisnika 6. maja 2026. Pet hiljada trinaest dana kasnije. Preko 13.000 danas, uz više od milion unesenih sličica. Radi i održava četvero inženjera volonterski, besplatno za sve, uz donacije.',

        // `file` je golo ime fajla iz src/assets/slibe/. Redoslijed ovdje je
        // redoslijed tabova u galeriji.
        shots: [
          {
            file: 'slibealbum1',
            label: 'album',
            caption:
              'Album prenesen stranicu po stranicu, njih 99. Traka popunjenosti, filteri za ono što fali, što imaš i duplikate, i export cijelog albuma u PDF.',
          },
          {
            file: 'sliberazmjena1',
            label: 'razmjena',
            caption:
              'Partneri za zamjenu poredani po tome koliko se dvije kolekcije poklapaju, sa brojem koji svako daje i dobija odmah vidljivim. Filter po gradu, pa razmjena može završiti kao predaja iz ruke u ruku umjesto paketa.',
          },
          {
            file: 'slibeporuke1',
            label: 'poruke',
            caption:
              'Razmjena je stvarni objekat, ne dogovor u razgovoru: obje strane složene sličicu po sličicu, s mogućnošću izmjene i statusom "na čekanju" dok druga strana ne potvrdi.',
          },
          {
            file: 'slibeprofil1',
            label: 'profil',
            caption:
              'Javni profil koji se dijeli — koliko imaš, koliko je duplikata, koliko fali, procenat popunjenosti i album kao PDF.',
          },
          {
            file: 'slibeprijava1',
            label: 'prijava',
            caption:
              'Prijava Googleom u jedan klik i poziv za instalaciju — radi kao instalabilna web aplikacija, pa između kolekcionara i albuma nema app storea.',
          },
        ],

        press: SLIBE_PRESS,
        links: { live: 'https://www.slibe.online', source: '', kofi: 'https://ko-fi.com/slibeonline' },
      },

      // Budući projekti idu ovdje — renderuju se kao kartice ispod istaknutog.
      items: [],
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
