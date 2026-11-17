import { useRef, useState } from 'react';
import { gsap, EASE } from '../lib/gsap';
import { useReveals, useDocumentTitle } from '../lib/useReveals';
import { setSound } from '../lib/audio';
import { about, marquee, site, toolkit } from '../data/site';
import { archive, pad, projects } from '../data/projects';
import { Arrow } from '../components/Arrow';
import { Cover } from '../components/Cover';
import { LocalTime } from '../components/LocalTime';
import { Magnetic } from '../components/Magnetic';
import { SectionHead } from '../components/SectionHead';
import { Staff } from '../components/Staff';
import { TLink } from '../components/TLink';

/** Enough copies of a row that it never runs out while it drifts. */
const REPEATS = [0, 1, 2];

export function Home() {
  const scope = useRef<HTMLDivElement>(null);
  const [sound, setSoundState] = useState(false);
  useDocumentTitle('Miguel Sinaga — Portfolio');

  useReveals(scope, () => {
    // The name rises word by word; the blue note lands last.
    gsap.from('.hero__word', {
      yPercent: 112,
      duration: 1.5,
      ease: EASE.out,
      stagger: 0.13,
      delay: 0.1,
    });
    gsap.from('.hero .note', { scale: 0, duration: 0.9, ease: 'back.out(2.4)', delay: 1.2 });

    // The two rows of the toolkit drift against each other as the page scrolls.
    gsap.utils.toArray<HTMLElement>('.marquee__row').forEach((row, i) => {
      gsap.fromTo(
        row,
        { xPercent: i % 2 ? -22 : 0 },
        {
          xPercent: i % 2 ? 0 : -22,
          ease: 'none',
          scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        },
      );
    });
  });

  const toggleSound = async () => setSoundState(await setSound(!sound));

  return (
    <div ref={scope}>
      {/* ───────────── Intro ───────────── */}
      <section className="hero" aria-label="Introduction">
        <div className="hero__meta" data-reveal="stagger" data-delay="0.7">
          <p className="label">
            {site.role} — {site.school}
          </p>
          {site.availability && (
            <p className="label hero__status">
              <span className="hero__status-dot" aria-hidden="true" />
              {site.availability}
            </p>
          )}
          <p className="label">
            {site.location} · <LocalTime />
          </p>
        </div>

        <div className="hero__stage">
          <Staff />
          <h1 className="hero__name">
            <span className="hero__mask">
              <span className="hero__word">Miguel</span>
            </span>{' '}
            <span className="hero__mask">
              <span className="hero__word">
                Sinaga
                <span className="note" aria-hidden="true" />
              </span>
            </span>
          </h1>
        </div>

        <div className="hero__foot">
          <p className="hero__lede" data-reveal="lines" data-delay="0.6">
            Software where <em>algorithms</em> meet <em>music</em>, and the systems work in between.
          </p>
          <div className="hero__aside" data-reveal="fade" data-delay="1.1">
            <p className="label">
              Five lines, bass clef: G&nbsp;B&nbsp;D&nbsp;F&nbsp;A. Cross them with your cursor, or tap one.
            </p>
            <button type="button" className="chip" aria-pressed={sound} onClick={toggleSound} data-cursor="link">
              <span className="chip__dot" aria-hidden="true" />
              Sound {sound ? 'on' : 'off'}
            </button>
          </div>
        </div>
      </section>

      {/* ───────────── A · About ───────────── */}
      <section id="about" className="section about" aria-labelledby="about-title">
        <SectionHead id="about-title" mark="A" title="About" note="the head" />
        <p className="statement" data-reveal="words">
          {about.statement} One theme keeps coming back: <em>algorithms applied to music.</em>
        </p>

        <div className="about__grid">
          <figure className="placeholder about__portrait" data-reveal="cover">
            <div className="placeholder__inner">
              <figcaption className="placeholder__label">Portrait — placeholder</figcaption>
            </div>
          </figure>

          <div className="about__body">
            {about.paragraphs.map((text) => (
              <p key={text} className="about__text" data-reveal="lines">
                {text}
              </p>
            ))}

            <dl className="rows" data-reveal="stagger">
              {about.facts.map((fact) => (
                <div key={fact.label} className="rows__row">
                  <dt className="label">{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>

            <h3 className="label about__subhead">
              Experience <span className="tag">Placeholder</span>
            </h3>
            <ul className="rows" data-reveal="stagger">
              {about.experience.map((item, i) => (
                <li key={i} className="rows__row rows__row--muted">
                  <span className="label">{item.period}</span>
                  <span>
                    {item.title}, {item.place}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────── B · Selected work ───────────── */}
      <section id="work" className="section work" aria-labelledby="work-title">
        <SectionHead id="work-title" mark="B" title="Selected work" note="solos, six choruses" />
        <ol className="work__grid">
          {projects.map((project, i) => (
            <li key={project.slug} className="work__item">
              <TLink
                to={`/work/${project.slug}`}
                className="card"
                transitionTitle={project.title}
                transitionMeta={`${pad(i + 1)} / ${pad(projects.length)}`}
                data-cursor="view"
              >
                <div className="card__cover" data-reveal="cover">
                  <div className="card__cover-inner">
                    <Cover kind={project.cover} />
                  </div>
                </div>
                <div className="card__caption">
                  <span className="label">{pad(i + 1)}</span>
                  <div>
                    <h3 className="card__title">{project.title}</h3>
                    <p className="card__kicker">{project.kicker}</p>
                  </div>
                  <span className="label">{project.year}</span>
                </div>
              </TLink>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────────── C · Index ───────────── */}
      <section id="index" className="section index" aria-labelledby="index-title">
        <SectionHead id="index-title" mark="C" title="Index" note="the rest of the set" />
        <ul className="index__list">
          {archive.map((item) => {
            const body = (
              <>
                <span className="label index__year">{item.year}</span>
                <span className="index__main">
                  <span className="index__title">{item.title}</span>
                  <span className="index__desc">{item.description}</span>
                </span>
                <span className="label index__kind">
                  {item.kind} · {item.team ? 'Team' : 'Solo'}
                </span>
                <span className="label index__stack">{item.stack}</span>
                <span className="index__end">
                  {item.url ? <Arrow /> : <span className="label">Private</span>}
                </span>
              </>
            );
            return (
              <li key={item.title} data-reveal="fade">
                {item.url ? (
                  <a className="index__row" href={item.url} target="_blank" rel="noreferrer" data-cursor="link">
                    {body}
                    <span className="sr-only"> (repository, opens in a new tab)</span>
                  </a>
                ) : (
                  <div className="index__row index__row--static">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
        <p className="label index__note">
          Rows marked private are coursework repositories that stay closed.
        </p>
      </section>

      {/* ───────────── D · Toolkit ───────────── */}
      <section id="toolkit" className="section toolkit" aria-labelledby="toolkit-title">
        <SectionHead id="toolkit-title" mark="D" title="Toolkit" note="the rhythm section" />
        <div className="marquee" aria-hidden="true">
          {[marquee.top, marquee.bottom].map((row, r) => (
            <div key={r} className={`marquee__row${r ? ' marquee__row--alt' : ''}`}>
              {REPEATS.map((n) =>
                row.map((word) => (
                  <span key={`${n}-${word}`} className="marquee__item">
                    {word}
                    <span className="note" />
                  </span>
                )),
              )}
            </div>
          ))}
        </div>
        <div className="toolkit__grid" data-reveal="stagger">
          {toolkit.map((group) => (
            <div key={group.title} className="toolkit__group">
              <h3 className="label">{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── E · Contact ───────────── */}
      <section id="contact" className="section contact" aria-labelledby="contact-title">
        <SectionHead id="contact-title" mark="E" title="Contact" note="coda" />
        <p className="contact__headline" data-reveal="lines">
          Let’s make something <em>sound.</em>
        </p>
        <div className="contact__row">
          <div className="contact__cta" data-reveal="fade">
            <Magnetic strength={0.3}>
              <a className="cta" href={`mailto:${site.email}`} data-cursor="link">
                Say hello
              </a>
            </Magnetic>
          </div>
          <dl className="rows contact__list" data-reveal="stagger">
            <div className="rows__row">
              <dt className="label">Email</dt>
              <dd>
                <a className="link" href={`mailto:${site.email}`} data-cursor="link">
                  {site.email}
                </a>
                <span className="tag">Placeholder</span>
              </dd>
            </div>
            {site.socials.map((social) => (
              <div key={social.label} className="rows__row">
                <dt className="label">{social.label}</dt>
                <dd>
                  <a className="link" href={social.url} target="_blank" rel="noreferrer" data-cursor="link">
                    {social.handle}
                    <Arrow />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </dd>
              </div>
            ))}
            <div className="rows__row">
              <dt className="label">Résumé</dt>
              <dd>
                {site.resumeUrl ? (
                  <a className="link" href={site.resumeUrl} data-cursor="link">
                    Download PDF
                  </a>
                ) : (
                  <>
                    PDF to be added
                    <span className="tag">Placeholder</span>
                  </>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
