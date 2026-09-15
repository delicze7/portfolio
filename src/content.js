/**
 * SINGLE SOURCE OF TRUTH FOR EVERYTHING ON THE SITE.
 *
 * Edit this file and nothing else to fill in your real content.
 * Everything below is a placeholder — replace the text, keep the shape.
 *
 * Language keys: `en` (English) and `bs` (Bosnian). Both must have the same
 * arrays in the same order — items are matched positionally by the UI.
 */

// The hero photo. Save it as `src/assets/hero.<ext>` — jpg, png, webp or avif —
// and it is picked up with no import to edit. Until it exists the hero renders
// text only. Imported rather than served from /public so the build
// fingerprints it and the relative `base` in vite.config.js keeps working on
// subdirectory hosting.
const heroPhotos = import.meta.glob('./assets/hero.{avif,jpeg,jpg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})
// If more than one format is present, take the one that is smallest to ship.
// Glob keys sort alphabetically, which would pick a .jpg over a .webp.
const heroPhoto = ['avif', 'webp', 'jpg', 'jpeg', 'png']
  .map((ext) => heroPhotos[`./assets/hero.${ext}`])
  .find(Boolean)

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

// Company logos for the work history. Drop files in `src/assets/companies/`
// and point a work entry at one with `logo: '<bare filename>'`. Any logo works,
// whatever its colour — each renders as a white silhouette. An entry without a
// logo can set `mark` instead, or show nothing on that side.
const companyModules = import.meta.glob('./assets/companies/*.{avif,jpeg,jpg,png,svg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})
export const companyLogos = Object.fromEntries(
  Object.entries(companyModules).map(([path, url]) => [
    path.replace(/^.*\//, '').replace(/\.[^.]+$/, ''),
    url,
  ]),
)

// Screenshots for the projects below the featured one: one folder per project,
// `src/assets/projects/<id>/`, keyed `<id>/<bare filename>`. Only files directly
// inside a project folder match, so `original/` subfolders are kept but never
// bundled.
const projectModules = import.meta.glob('./assets/projects/*/*.{avif,jpeg,jpg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})
export const projectShots = Object.fromEntries(
  Object.entries(projectModules).map(([path, url]) => [
    path.replace(/^\.\/assets\/projects\//, '').replace(/\.[^.]+$/, ''),
    url,
  ]),
)

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
  email: 'deliczejd123@gmail.com',
  location: 'Bosna i Hercegovina',
  hero: heroPhoto,
  // Every link here is optional. Remove one and the places that show it — the
  // contact section, the command palette — drop it without further edits.
  links: {
    linkedin: 'https://www.linkedin.com/in/zejd-delic-717b12252',
  },
}

/**
 * Sections that are written but not filled in yet. Each keeps its heading,
 * note and anchor, and shows a placeholder where the content will go.
 */
export const WIP_SECTIONS = ['approach', 'stack', 'lab']

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
      },
    },

    work: {
      heading: 'selected work',
      note: 'One project told in full, and more below it.',
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
        others: 'other projects',
        othersDir: 'projects',
        solution: 'solution',
        next: 'next',
      },

      featured: {
        id: 'slibe',
        name: 'slibe.online',
        year: '2026',
        tagline:
          'A sticker album rebuilt in the browser, with an algorithm that finds you the person holding the number you are missing.',

        role: 'Four of us, deliberately working across the whole product instead of each sitting in a private corner of it — a side project built around full-time jobs. Alongside the build I ran the press and outreach: the articles landed inside exactly the window where the platform went from 500 to 5.000 users in thirteen days.',
        stack: ['React', 'Supabase', 'PostgreSQL', 'Cloudflare'],

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
          'We rebuilt the album one-to-one in the browser: mark what you own, what you are missing, what you have spare. A matching algorithm then does the searching, pairs collectors whose collections complement each other, and hands them a built-in chat to settle the trade. There is no backend of our own — Supabase holds the database and the auth, Cloudflare serves the sticker images. Four people with day jobs cannot also keep infrastructure standing.',
        tradeoff:
          'Matching ran in real time at first: every sticker you ticked recalculated your matches against everyone else on the spot. At a few hundred users that felt like magic. At a few thousand it took the database down, and always at the worst moment — the evening, when everyone was trading. We moved it to a batch that runs every minute. The cost is honest: a sticker you tick now reaches your partners on the next pass, not instantly. The platform stopped falling over precisely when the most people were on it, and we took the slower answer over the one that was not there at all.',
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

      // Projects below the featured one. Screenshots live in
      // src/assets/projects/<id>/ and are named in `shots` by bare filename.
      items: [
        {
          id: 'hocsv',
          name: 'Konta — HO Kozarac',
          badge: 'internal tool',
          year: '2025',
          context: 'Humanitarna organizacija Kozarac · desktop application',
          tagline:
            'A humanitarian organisation publishes every donation and every expense on its website. This desktop tool turns exports from the bank, PayPal and the cash desk into the one file the site imports.',
          problem:
            'The organisation keeps its books in public: every donation and every expense is listed on its WordPress site. The figures arrive from three places — the bank, PayPal and the cash desk — each in its own format, and every payment had to be entered separately, by hand. With a monthly turnover in the tens of thousands of KM, that could not last.',
          solution:
            'A .NET desktop application I built on my own. Feed it an export from the bank, PayPal or the cash desk and it hands back files in exactly the layout the site import expects — income and expenses split apart, sorted by category and by person.',
          result:
            'What used to be entered payment by payment is ready in a few clicks. It is for internal use only and no visitor ever sees it, but it is what keeps the public record current.',
          next: 'A web platform with sign-in, where every member of the organisation gets a shared dashboard. In progress, alongside everything else.',
          stack: ['.NET', 'CSV', 'WordPress'],
          shots: [
            {
              file: 'hok-pocetna',
              label: 'home',
              caption:
                'The home screen: shortcuts to PayPal, the website admin and the cash desk, and the membership count of the organisation in one place. The space for the account balance is already there, waiting on the database.',
            },
            {
              file: 'hok-import',
              label: 'import',
              caption:
                'Import: pick the source — bank, PayPal or cash desk — and the account, and the tool splits income from expenses and saves the file the website imports.',
            },
          ],
        },
      ],
    },

    wip: {
      badge: 'in progress',
      title: 'This section is still being written.',
      note: 'I am working on it. I would rather leave it empty for now than fill it with something that is not true.',
      shell: 'work in progress',
    },
    approach: {
      heading: 'how i work',
      note: 'Opinions I hold loosely enough to change, strongly enough to act on.',
      items: [],
    },

    stack: {
      heading: 'stack',
      note: 'Honest labels. "Daily" means I could debug it half-asleep.',
      levels: { daily: 'daily', working: 'working', touched: 'touched' },
      groups: [],
    },

    path: {
      heading: 'path',
      note: 'Each part of the story on its own branch.',
      labels: {
        present: 'HEAD',
        verify: 'verify',
        thesis: 'thesis',
        branchCommand: 'git branch',
        empty: 'Nothing here yet.',
        project: 'see the project',
      },

      // Tabs, in order. A branch with no entries hides itself.
      branches: [
        { id: 'work', label: 'work', command: 'git log --author="zejd"' },
        { id: 'education', label: 'education', command: 'cat education.md' },
        { id: 'certs', label: 'certificates', command: 'ls certificates/' },
      ],

      // Newest first. `current: true` marks a role that is still running — two
      // of them overlap, which is the point.
      work: [
        {
          hash: '4d7fa08',
          type: 'feat',
          title: 'Freelance Software Engineer',
          org: 'Freelance',
          logo: '',
          mark: '>',
          period: '01.2025 — present',
          location: 'remote',
          current: true,
          body: 'I work for my own clients — web and mobile applications, websites, WordPress builds. Work arrives through referrals and through project platforms, and the clients are spread across several countries. Alongside the building there is the part that is not code: agreeing what gets made, by when, and for how much.',
          metric: '',
          stack: [],
        },
        {
          hash: 'e91b4c2',
          type: 'feat',
          title: 'Digital Coordinator & Developer',
          org: 'Humanitarna organizacija Kozarac',
          logo: 'logoHO',
          period: '01.2025 — present',
          location: '',
          current: true,
          body: 'I keep the record of incoming payments and run the organisation website and its social accounts. For internal use I built Konta on my own — a desktop app that turns bank, PayPal and cash-desk exports into the file the website imports, work that until then was done by hand. The role is semi-voluntary.',
          project: { id: 'hocsv', name: 'Konta — HO Kozarac' },
          metric: '',
          stack: [],
        },
        {
          hash: '7c1e04b',
          type: 'init',
          title: 'Backend Developer',
          org: 'Tech Towers d.o.o. Prijedor',
          logo: 'techtowers',
          period: '01.2022 — 01.2025',
          location: 'Prijedor',
          body: 'First job, and three years of backend work in .NET against SQL and PostgreSQL. Alongside building features, a large part of it was tuning queries and application logic so things held together as load grew. I worked inside project teams, from designing a solution through to shipping it.',
          metric: '',
          stack: ['.NET', 'SQL', 'PostgreSQL'],
        },
      ],

      // Fill these in and the tab reappears on its own — a branch with no
      // entries hides itself. Shape:
      //   education: [{ degree, institution, period, note }]
      education: [],

      //   certs: [{ name, issuer, year, type, href }]
      certs: [],
    },

    lab: {
      heading: 'lab',
      note: 'Small things built for no good reason. Usually the most fun.',
      items: [],
    },

    contact: {
      heading: 'contact',
      command: 'mail zejd',
      lead: 'There is a solution to every problem. Sometimes it just has to be written.',
      pitch:
        'A project, a role, or an idea that needs saying out loud to someone — any of those is worth an email. I am open to new work, and the conversations I like best are the ones that start with "is this even possible".',
      copy: 'copy',
      copied: 'copied',
      send: 'send a message',
      availability: 'Open to new work and collaborations.',
      responseTime: 'I usually reply within a day or two.',
      linkedin: 'LinkedIn',
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
      },
    },

    work: {
      heading: 'odabrani radovi',
      note: 'Jedan projekat ispričan do kraja, i ostali ispod njega.',
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
        others: 'ostali projekti',
        othersDir: 'projekti',
        solution: 'rješenje',
        next: 'dalje',
      },

      featured: {
        id: 'slibe',
        name: 'slibe.online',
        year: '2026',
        tagline:
          'Album sličica prenesen u browser, s algoritmom koji ti nađe čovjeka koji drži baš onaj broj koji tebi fali.',

        role: 'Četvero nas, namjerno uključenih u cijeli proizvod umjesto da svako sjedi u svom uglu — side projekat rađen uz redovne poslove. Pored razvoja, vodio sam medijsku promociju i komunikaciju s portalima: objave su izašle tačno u onom prozoru u kojem je platforma otišla s 500 na 5.000 korisnika za trinaest dana.',
        stack: ['React', 'Supabase', 'PostgreSQL', 'Cloudflare'],

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
          'Prenijeli smo album jedan-na-jedan u browser: označiš šta imaš, šta ti fali i šta su ti duplikati. Algoritam onda sam traži, spaja kolekcionare čije se kolekcije poklapaju, i daje im ugrađeni chat da dogovore razmjenu. Vlastitog backenda nema — Supabase drži bazu i autentikaciju, Cloudflare servira slike sličica. Četvero ljudi uz redovne poslove ne može uz sve to još i održavati infrastrukturu.',
        tradeoff:
          'Uparivanje je isprva radilo u realnom vremenu: svaka sličica koju označiš odmah je ponovo računala poklapanja prema svima ostalima. Na nekoliko stotina korisnika to je djelovalo kao magija. Na nekoliko hiljada je obaralo bazu, i to uvijek u najgorem trenutku — navečer, kad svi razmjenjuju. Prebacili smo ga na batch koji se vrti svake minute. Cijena je poštena: sličica koju sad označiš stiže do partnera u sljedećem prolazu, ne istog trena. Zauzvrat je platforma prestala padati baš kad je najviše ljudi na njoj — sporiji odgovor je bolji od nikakvog.',
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

      // Projekti ispod istaknutog. Slike su u src/assets/projects/<id>/ i
      // navode se u `shots` po golom imenu fajla.
      items: [
        {
          id: 'hocsv',
          name: 'Konta — HO Kozarac',
          badge: 'interni alat',
          year: '2025',
          context: 'Humanitarna organizacija Kozarac · desktop aplikacija',
          tagline:
            'Humanitarna organizacija javno objavljuje svaku donaciju i svaki trošak na svom sajtu. Ovaj alat pretvara izvode iz banke, PayPala i blagajne u jedan fajl koji sajt uvozi.',
          problem:
            'Organizacija vodi finansije javno: svaka uplata i svaki trošak objavljeni su na njenom WordPress sajtu. Podaci stižu iz tri izvora — banke, PayPala i blagajne — svaki u svom formatu, i svaka uplata se morala unijeti zasebno, ručno. Uz mjesečni promet od desetina hiljada KM, to nije moglo dugo trajati.',
          solution:
            'Desktop aplikacija u .NET-u koju sam napravio sam. Ubaciš izvod iz banke, PayPala ili blagajne, a ona vraća fajlove tačno u obliku koji traži uvoz na sajtu — prihodi i troškovi razdvojeni, razvrstani po kategorijama i osobama.',
          result:
            'Ono što se unosilo uplatu po uplatu sad je spremno u par klikova. Alat koristi samo administracija i posjetilac sajta ga nikad ne vidi, ali upravo on drži javnu evidenciju ažurnom.',
          next: 'Web platforma s prijavom, gdje svaki član organizacije ima zajednički dashboard. U razvoju, uz ostale obaveze.',
          stack: ['.NET', 'CSV', 'WordPress'],
          shots: [
            {
              file: 'hok-pocetna',
              label: 'početna',
              caption:
                'Početni ekran: prečice do PayPala, administracije sajta i blagajne, i broj članova organizacije na jednom mjestu. Mjesto za stanje računa je već tu — čeka povezivanje s bazom.',
            },
            {
              file: 'hok-import',
              label: 'uvoz',
              caption:
                'Uvoz: izabereš izvor — banka, PayPal ili blagajna — i konto, a alat razdvaja prihode od troškova i spremi fajl koji sajt uvozi.',
            },
          ],
        },
      ],
    },

    wip: {
      badge: 'u pripremi',
      title: 'Ova sekcija se još piše.',
      note: 'Radim na njoj. Radije ću je ostaviti praznu nego je popuniti nečim što nije istina.',
      shell: 'work in progress',
    },
    approach: {
      heading: 'kako radim',
      note: 'Stavovi koje držim dovoljno labavo da ih promijenim, dovoljno čvrsto da po njima radim.',
      items: [],
    },

    stack: {
      heading: 'stack',
      note: 'Iskrene oznake. "Svaki dan" znači da bih to debugovao polubudan.',
      levels: { daily: 'svaki dan', working: 'radno', touched: 'dodirnuo' },
      groups: [],
    },

    path: {
      heading: 'put',
      note: 'Svaki dio priče u svojoj grani.',
      labels: {
        present: 'HEAD',
        verify: 'provjeri',
        thesis: 'završni rad',
        branchCommand: 'git branch',
        empty: 'Ovdje još nema ništa.',
        project: 'pogledaj projekat',
      },

      // Tabovi, ovim redom. Grana bez unosa se sama sakrije.
      branches: [
        { id: 'work', label: 'posao', command: 'git log --author="zejd"' },
        { id: 'education', label: 'obrazovanje', command: 'cat obrazovanje.md' },
        { id: 'certs', label: 'certifikati', command: 'ls certifikati/' },
      ],

      // Najnovije prvo. `current: true` označava posao koji još traje — dva se
      // preklapaju, i to je poenta.
      work: [
        {
          hash: '4d7fa08',
          type: 'feat',
          title: 'Softverski inženjer — freelance',
          org: 'Freelance',
          logo: '',
          mark: '>',
          period: '01.2025 — danas',
          location: 'remote',
          current: true,
          body: 'Radim za vlastite klijente — web i mobilne aplikacije, sajtovi, WordPress. Poslovi dolaze preko preporuka i preko platformi za projekte, a klijenti su iz raznih zemalja. Uz sam razvoj tu je i dio koji se ne piše u kodu: dogovoriti šta se gradi, u kom roku i za koji budžet.',
          metric: '',
          stack: [],
        },
        {
          hash: 'e91b4c2',
          type: 'feat',
          title: 'Digitalni koordinator i razvoj',
          org: 'Humanitarna organizacija Kozarac',
          logo: 'logoHO',
          period: '01.2025 — danas',
          location: '',
          current: true,
          body: 'Vodim evidenciju uplata, web stranicu organizacije i društvene mreže. Za internu upotrebu sam samostalno razvio aplikaciju Konta — alat koji izvode iz banke, PayPala i blagajne pretvara u fajl koji sajt uvozi, posao koji se do tada radio ručno. Rad je polu-volonterski.',
          project: { id: 'hocsv', name: 'Konta — HO Kozarac' },
          metric: '',
          stack: [],
        },
        {
          hash: '7c1e04b',
          type: 'init',
          title: 'Backend developer',
          org: 'Tech Towers d.o.o. Prijedor',
          logo: 'techtowers',
          period: '01.2022 — 01.2025',
          location: 'Prijedor',
          body: 'Prvo zaposlenje i tri godine backend razvoja u .NET-u, nad SQL i PostgreSQL bazama. Uz izradu novih funkcionalnosti, veliki dio posla bila je optimizacija upita i logike aplikacije — da rješenje ostane stabilno kako opterećenje raste. Radio sam unutar projektnih timova, od dizajna rješenja do isporuke.',
          metric: '',
          stack: ['.NET', 'SQL', 'PostgreSQL'],
        },
      ],

      // Popuni ih i tab se sam vrati — grana bez unosa se sakriva. Oblik:
      //   education: [{ degree, institution, period, note }]
      education: [],

      //   certs: [{ name, issuer, year, type, href }]
      certs: [],
    },

    lab: {
      heading: 'lab',
      note: 'Male stvari napravljene bez dobrog razloga. Obično najzabavnije.',
      items: [],
    },

    contact: {
      heading: 'kontakt',
      command: 'mail zejd',
      lead: 'Za svaki problem postoji rješenje. Nekad ga samo treba napisati.',
      pitch:
        'Projekat, pozicija ili ideja koju treba nekome ispričati naglas — svaka od tih stvari vrijedi jedan mail. Radujem se novim suradnjama, a najdraži su mi razgovori koji počnu s "je li ovo uopšte moguće".',
      copy: 'kopiraj',
      copied: 'kopirano',
      send: 'pošalji poruku',
      availability: 'Otvoren za nove suradnje i poslove.',
      responseTime: 'Odgovaram obično u roku od dan-dva.',
      linkedin: 'LinkedIn',
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
