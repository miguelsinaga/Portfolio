# Portfolio

Personal portfolio of Miguel Sinaga. Front end only for now: Vite, React, TypeScript, GSAP and Lenis.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, then build to dist/
```

## Where things live

| Path | What it holds |
|---|---|
| `src/data/site.ts` | Name, bio, contact links, toolkit. Every stand-in value is marked `PLACEHOLDER`. |
| `src/data/projects.ts` | The six featured projects and the index of everything else. |
| `src/styles/tokens.css` | Colour, type, spacing and motion tokens for both themes. |
| `src/lib/gsap.ts` | Shared easing and duration tokens for all animation. |
| `src/lib/reveal.ts` | The `data-reveal` attributes (`lines`, `words`, `fade`, `stagger`, `cover`, `rule`). |
| `src/context/Transition.tsx` | The count-in on first load, the page-change wipe, smooth scroll. |
| `src/components/Cover.tsx` | Generated cover art, standing in for screenshots. |

## Placeholders to replace

- `site.email`, `site.resumeUrl`, `site.availability` and `about.experience` in `src/data/site.ts`.
- The portrait in the About section.
- The three screenshot frames on each project page. Each frame shows the file name it expects, for example `public/work/syncopate-01.webp`.

## Motion and accessibility

Animations only run when the visitor has not asked for reduced motion; otherwise pages appear at once and scrolling is native. The count-in plays once per browser session.
