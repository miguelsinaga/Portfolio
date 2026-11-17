import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useReveals, useDocumentTitle } from '../lib/useReveals';
import { pad, projects } from '../data/projects';
import { Arrow } from '../components/Arrow';
import { Cover } from '../components/Cover';
import { TLink } from '../components/TLink';
import { NotFound } from './NotFound';

export function Project() {
  const { slug } = useParams();
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  const scope = useRef<HTMLElement>(null);

  useDocumentTitle(project ? `${project.title} — Miguel Sinaga` : 'Not found — Miguel Sinaga');
  useReveals(scope);

  if (!project) return <NotFound />;

  const next = projects[(index + 1) % projects.length];
  const nextIndex = ((index + 1) % projects.length) + 1;
  const position = `${pad(index + 1)} / ${pad(projects.length)}`;

  return (
    <article className="project" ref={scope}>
      <header className="project__hero">
        <div className="project__crumbs" data-reveal="fade" data-delay="0.5">
          <TLink
            to="/#work"
            className="label link"
            transitionTitle="Work"
            transitionMeta="Miguel Sinaga"
            data-cursor="link"
          >
            <span aria-hidden="true">← </span>All work
          </TLink>
          <span className="label">{position}</span>
        </div>
        <h1 className="project__title" data-reveal="lines" data-delay="0.05">
          {project.title}
        </h1>
        <p className="project__kicker" data-reveal="lines" data-delay="0.3">
          {project.kicker}
        </p>
      </header>

      <dl className="project__meta" data-reveal="stagger" data-delay="0.55">
        <div>
          <dt className="label">Year</dt>
          <dd>{project.year}</dd>
        </div>
        <div>
          <dt className="label">Role</dt>
          <dd>{project.role}</dd>
        </div>
        <div>
          <dt className="label">Context</dt>
          <dd>{project.context}</dd>
        </div>
        <div>
          <dt className="label">Stack</dt>
          <dd>{project.stack.join(', ')}</dd>
        </div>
        <div>
          <dt className="label">Links</dt>
          <dd className="project__links">
            {project.links.live && (
              <a className="link" href={project.links.live} target="_blank" rel="noreferrer" data-cursor="link">
                Live demo
                <Arrow />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            {project.links.repo && (
              <a className="link" href={project.links.repo} target="_blank" rel="noreferrer" data-cursor="link">
                Source
                <Arrow />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </dd>
        </div>
      </dl>

      <div className="project__cover" data-reveal="cover" data-delay="0.25">
        <div className="project__cover-inner">
          <Cover kind={project.cover} label={`Abstract cover artwork for ${project.title}`} />
        </div>
      </div>

      <section className="project__section" aria-labelledby="overview-title">
        <h2 id="overview-title" className="label project__section-title">
          Overview
        </h2>
        <div className="project__overview">
          {project.overview.map((text) => (
            <p key={text} data-reveal="lines">
              {text}
            </p>
          ))}
        </div>
      </section>

      <section className="project__facts" aria-labelledby="facts-title">
        <h2 id="facts-title" className="sr-only">
          In numbers
        </h2>
        <ul className="facts" data-reveal="stagger">
          {project.facts.map((fact) => (
            <li key={fact.label} className="fact">
              <span className="fact__value">{fact.value}</span>
              <span className="label">{fact.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="project__section" aria-labelledby="how-title">
        <h2 id="how-title" className="label project__section-title">
          How it works
        </h2>
        <ol className="highlights">
          {project.highlights.map((item, i) => (
            <li key={item.title} className="highlight" data-reveal="fade">
              <span className="label">{pad(i + 1)}</span>
              <h3 className="highlight__title">{item.title}</h3>
              <p className="highlight__body">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="project__section" aria-labelledby="screens-title">
        <h2 id="screens-title" className="label project__section-title">
          Screens <span className="tag">Placeholder</span>
        </h2>
        <div className="gallery">
          {[1, 2, 3].map((n) => (
            <figure key={n} className="placeholder gallery__item" data-reveal="cover">
              <div className="placeholder__inner">
                <figcaption className="placeholder__label">
                  Screenshot {pad(n)} — placeholder
                  <span>
                    public/work/{project.slug}-{pad(n)}.webp
                  </span>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </section>

      <nav className="next" aria-label="Next project">
        <TLink
          to={`/work/${next.slug}`}
          className="next__link"
          transitionTitle={next.title}
          transitionMeta={`${pad(nextIndex)} / ${pad(projects.length)}`}
          data-cursor="view"
          data-cursor-label="Next"
        >
          <span className="label">Next project</span>
          <span className="next__title" data-reveal="lines">
            {next.title}
          </span>
          <span className="next__kicker">{next.kicker}</span>
        </TLink>
      </nav>
    </article>
  );
}
