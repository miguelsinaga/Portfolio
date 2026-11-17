/**
 * Site-wide content. Anything marked PLACEHOLDER is a stand-in:
 * replace it with the real value before publishing.
 */

type Site = {
  name: string;
  fullName: string;
  role: string;
  school: string;
  location: string;
  timeZone: string;
  timeZoneLabel: string;
  year: number;
  email: string;
  resumeUrl: string;
  availability: string;
  socials: { label: string; handle: string; url: string }[];
};

export const site: Site = {
  name: 'Miguel Sinaga',
  fullName: 'Miguel Rangga Deardo Sinaga',
  role: 'Informatics Engineering',
  school: 'Institut Teknologi Bandung',
  location: 'Bandung, Indonesia',
  timeZone: 'Asia/Jakarta',
  timeZoneLabel: 'WIB',
  year: 2026,

  // PLACEHOLDER — swap for the address you want people to write to.
  email: 'hello@example.com',
  // PLACEHOLDER — drop a PDF in /public and point this at it, e.g. '/miguel-sinaga-cv.pdf'.
  resumeUrl: '',
  // PLACEHOLDER — edit or set to '' to hide the line in the hero.
  availability: 'Open to internships',

  socials: [
    { label: 'GitHub', handle: '@miguelsinaga', url: 'https://github.com/miguelsinaga' },
    {
      label: 'LinkedIn',
      handle: 'Miguel Rangga Deardo Sinaga',
      url: 'https://www.linkedin.com/in/miguel-rangga-deardo-sinaga-89ab49329',
    },
    { label: 'Instagram', handle: '@miguelsinaga', url: 'https://instagram.com/miguelsinaga' },
  ],
};

export const about = {
  statement:
    'Most of what I build started as coursework in algorithm strategy, linear algebra and software engineering, usually with the bonus specs built in: a GUI, multithreading, a live deploy.',
  paragraphs: [
    'I’m Miguel, an Informatics Engineering undergraduate at Institut Teknologi Bandung. I like problems where the algorithm is the product: a search strategy you can hear, a decomposition you can play, a matcher you can watch working on a live page.',
    'One theme keeps coming back, and it is algorithms applied to music. Around it sits the systems work that keeps me honest: a database engine, a network stack and a consensus protocol, each built from first principles with a team.',
  ],
  facts: [
    { label: 'Studying', value: 'Informatics Engineering, ITB' },
    { label: 'Based in', value: 'Bandung, Indonesia' },
    { label: 'Leaning toward', value: 'Algorithms, systems, audio on the web' },
    { label: 'Writes mostly', value: 'TypeScript, Java, C++, Go, Python' },
  ],
  // PLACEHOLDER — replace with real roles, organisations and years.
  experience: [
    { period: '20XX — 20XX', title: 'Role or position', place: 'Organisation' },
    { period: '20XX — 20XX', title: 'Role or position', place: 'Organisation' },
    { period: '20XX', title: 'Award or achievement', place: 'Event' },
  ],
};

export const toolkit = [
  {
    title: 'Languages',
    items: ['C', 'C++', 'Java', 'Python', 'Go', 'TypeScript', 'JavaScript', 'Haskell', 'Prolog', 'SQL'],
  },
  {
    title: 'Web & backend',
    items: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'Spring Boot', 'PostgreSQL', 'Supabase'],
  },
  {
    title: 'Tools',
    items: ['Git', 'GitHub', 'Docker', 'Vercel', 'Figma'],
  },
  {
    title: 'Also used',
    items: ['Web Audio API', 'Chrome Extensions (MV3)', 'SFML', 'JavaFX', 'CustomTkinter'],
  },
];

export const marquee = {
  top: ['Graph search', 'String matching', 'Octrees', 'Singular values', 'Consensus', 'Local search'],
  bottom: ['TypeScript', 'Java', 'C++', 'Go', 'Python', 'Web Audio', 'React', 'PostgreSQL'],
};
