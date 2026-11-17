import { useRef } from 'react';
import { useReveals, useDocumentTitle } from '../lib/useReveals';
import { TLink } from '../components/TLink';

export function NotFound() {
  const scope = useRef<HTMLElement>(null);
  useDocumentTitle('Not found — Miguel Sinaga');
  useReveals(scope);

  return (
    <section className="notfound" ref={scope} aria-labelledby="notfound-title">
      <p className="label" data-reveal="fade" data-delay="0.4">
        Error 404
      </p>
      <h1 id="notfound-title" className="notfound__title" data-reveal="lines">
        That was a <em>wrong note.</em>
      </h1>
      <p className="notfound__text" data-reveal="lines" data-delay="0.25">
        This page doesn’t exist, or it moved. The next note fixes it.
      </p>
      <p data-reveal="fade" data-delay="0.6">
        <TLink to="/" className="chip" transitionTitle="Miguel Sinaga" transitionMeta="Home" data-cursor="link">
          Back to the start
        </TLink>
      </p>
    </section>
  );
}
